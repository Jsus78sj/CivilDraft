/* ═══ العقد الموحّد → CivilDraft · المرحلة 1 ═══
   استيراد محافظ: يبني حالة CivilDraft جزئية واضحة، ولا يخفي ما لم
   يدخل بعد في النواة. كل الأبعاد الواردة canonical هي mm بالفعل.
*/
import {CONTRACT_VERSION, STORAGE_UNIT, validateCanonicalProject} from "./canonical-contract.js";

const finite = v => typeof v === "number" && Number.isFinite(v);
const num = (v, fallback = 0) => finite(+v) ? +v : fallback;
const point = p => Array.isArray(p) && p.length === 2 && finite(+p[0]) && finite(+p[1]);
const copy = value => JSON.parse(JSON.stringify(value));

export function canonicalToCivilDraft(project) {
  const report = validateCanonicalProject(project);
  if (!report.ok) throw new TypeError(report.errors.map(e => `${e.path}: ${e.message}`).join("; "));
  const warnings = [];
  const state = {
    meta: {name: String(project.name || "PLAN"), level: 0, scale: 100, wallH: 3000},
    levelDefs: [], walls: [], opens: [], areas: [],
    dims: [], chains: [], anno: [], cols: [], fixt: [], stairs: [], roofs: [],
    plines: [], clouds: [], livefields: [], tables: [], struct: [], callouts: [], groups: [], blocks: []
  };
  const wallIds = new Set();
  const levelNumbers = new Set();
  for (const level of project.levels) {
    const n = Number.isInteger(level.number) ? level.number : state.levelDefs.length;
    if (levelNumbers.has(n)) warnings.push({path: `levels.${level.id}`, code: "duplicate-level-number", message: `Level number ${n} mapped to the next available level`});
    levelNumbers.add(n);
    state.levelDefs.push({n, name: String(level.name || `طابق ${n}`), elev: num(level.elevation), h: num(level.height, 3000), slab: num(level.slab, 200), color: "#cccccc"});
    state.meta.wallH = Math.max(state.meta.wallH, num(level.height, 3000));
    for (const wall of Array.isArray(level.walls) ? level.walls : []) {
      if (!point(wall.a) || !point(wall.b)) {
        warnings.push({path: `levels.${level.id}.walls.${wall.id}`, code: "invalid-wall", message: "Wall skipped because endpoints are invalid"});
        continue;
      }
      const id = String(wall.id);
      if (wallIds.has(id)) {
        warnings.push({path: `levels.${level.id}.walls.${id}`, code: "duplicate-id", message: "Wall skipped because its id already exists"});
        continue;
      }
      wallIds.add(id);
      const out = {id, level: n, type: wall.type || "int", align: wall.align || "c", a: [+wall.a[0], +wall.a[1]], b: [+wall.b[0], +wall.b[1]], t: Math.max(0, num(wall.thickness)), h: Math.max(0, num(wall.height, level.height))};
      if (wall.bulge != null) out.bulge = num(wall.bulge);
      state.walls.push(out);
    }
    for (const opening of Array.isArray(level.openings) ? level.openings : []) {
      const wallId = String(opening.wallId);
      if (!wallIds.has(wallId)) {
        warnings.push({path: `levels.${level.id}.openings.${opening.id}`, code: "orphan-opening", message: "Opening skipped because its wall is not present"});
        continue;
      }
      state.opens.push({id: String(opening.id), level: n, wall: wallId, kind: opening.kind || "door", s: Math.max(0, num(opening.offset)), w: Math.max(0, num(opening.width)), h: Math.max(0, num(opening.height, 2100)), sill: Math.max(0, num(opening.sill)), hinge: opening.hinge || "start", swing: opening.swing || "left"});
    }
    for (const room of Array.isArray(level.rooms) ? level.rooms : []) {
      const ring = Array.isArray(room.ring) ? room.ring.filter(point).map(p => [+p[0], +p[1]]) : [];
      if (ring.length < 3) {
        warnings.push({path: `levels.${level.id}.rooms.${room.id}`, code: "invalid-room", message: "Room skipped because its boundary has fewer than three points"});
        continue;
      }
      state.areas.push({id: String(room.id), level: n, name: String(room.name || ""), ring, showArea: room.showArea ? 1 : 0, fill: room.fill || "tint"});
    }
  }
  state.meta.level = state.levelDefs[0]?.n || 0;
  if (project.sourceUnit && project.sourceUnit !== STORAGE_UNIT) warnings.push({path: "sourceUnit", code: "converted-to-storage-unit", message: `${project.sourceUnit} was already normalized to ${STORAGE_UNIT}`});
  return {state: copy(state), report: {ok: true, contractVersion: CONTRACT_VERSION, storageUnit: STORAGE_UNIT, warnings}};
}
