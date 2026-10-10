/* ═══ محوّل CivilDraft → العقد الموحّد · المرحلة 1 ═══
   محوّل محض: لا يبدّل S ولا يعيد تطبيعها. كل الإحداثيات تبقى mm.
   النسخة العكسية ستأتي بعد تثبيت عقد الاستيراد والتحذيرات.
*/
import {CONTRACT_VERSION, STORAGE_UNIT, canonicalProject,
  validateCanonicalProject} from "./canonical-contract.js";

const finite = v => typeof v === "number" && Number.isFinite(v);
const num = (v, fallback = 0) => finite(+v) ? +v : fallback;
const clone = value => JSON.parse(JSON.stringify(value));

function levelOf(def, n) {
  return {
    id: `level-${n}`,
    number: n,
    name: String(def?.name ?? `طابق ${n}`),
    elevation: num(def?.elev),
    height: Math.max(0, num(def?.h, 3000)),
    slab: Math.max(0, num(def?.slab, 200)),
    walls: [],
    openings: [],
    rooms: []
  };
}

export function civilDraftToCanonical(state) {
  const s = state && typeof state === "object" ? state : {};
  const defs = Array.isArray(s.levelDefs) && s.levelDefs.length
    ? s.levelDefs : [{n: num(s.meta?.level), name: "أرضي", elev: 0, h: 3000, slab: 200}];
  const levels = defs.map(def => levelOf(def, num(def?.n)));
  const byNumber = new Map(levels.map(level => [level.number, level]));
  const fallback = levels[0];
  const put = (levelNumber, key, value) => (byNumber.get(num(levelNumber)) || fallback)[key].push(value);

  for (const wall of Array.isArray(s.walls) ? s.walls : []) {
    if (!wall || !Array.isArray(wall.a) || !Array.isArray(wall.b)) continue;
    put(wall.level, "walls", {
      id: String(wall.id), type: wall.type || "int", align: wall.align || "c",
      a: [num(wall.a[0]), num(wall.a[1])], b: [num(wall.b[0]), num(wall.b[1])],
      thickness: Math.max(0, num(wall.t)), height: Math.max(0, num(wall.h, s.meta?.wallH || 3000)),
      bulge: wall.bulge == null ? undefined : num(wall.bulge)
    });
  }
  for (const opening of Array.isArray(s.opens) ? s.opens : []) {
    if (!opening) continue;
    put(opening.level, "openings", {
      id: String(opening.id), wallId: String(opening.wall), kind: opening.kind || "door",
      offset: num(opening.s), width: Math.max(0, num(opening.w)),
      height: Math.max(0, num(opening.h)), sill: Math.max(0, num(opening.sill)),
      hinge: opening.hinge || "start", swing: opening.swing || "left"
    });
  }
  for (const room of Array.isArray(s.areas) ? s.areas : []) {
    if (!room || !Array.isArray(room.ring)) continue;
    put(room.level, "rooms", {
      id: String(room.id), name: String(room.name || ""),
      ring: room.ring.filter(p => Array.isArray(p) && p.length === 2)
        .map(p => [num(p[0]), num(p[1])]),
      showArea: !!room.showArea, fill: room.fill || "tint"
    });
  }

  const result = canonicalProject({
    name: String(s.meta?.name || "PLAN"),
    metadata: {source: "CivilDraft", sourceVersion: s.meta?.version || null},
    levels
  });
  result.contractVersion = CONTRACT_VERSION;
  result.storageUnit = STORAGE_UNIT;
  result.sourceUnit = "mm";
  const report = validateCanonicalProject(result);
  if (!report.ok) throw new TypeError(report.errors.map(e => `${e.path}: ${e.message}`).join("; "));
  return clone(result);
}
