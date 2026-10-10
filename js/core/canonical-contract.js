/* ═══ عقد المشروع الموحّد · المرحلة 1 ═══
   هذا الملف حدٌّ صغير ومستقل بين CivilDraft وأي محرر أو محرك 3D لاحق.
   المليمتر هو وحدة التخزين الوحيدة. الوحدات الأخرى واجهة إدخال/إخراج فقط.
   لا يغيّر الحالة ولا يصلحها خلسةً: يعيد تقريراً قابلاً للعرض والاختبار.
*/

export const STORAGE_UNIT = "mm";
export const CONTRACT_VERSION = 1;

const finite = v => typeof v === "number" && Number.isFinite(v);
const point = p => Array.isArray(p) && p.length === 2 && finite(p[0]) && finite(p[1]);

export const units = Object.freeze({
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
  ft: 304.8
});

export function toMillimetres(value, unit = "mm") {
  const factor = units[unit];
  if (!finite(value) || !factor) throw new RangeError(`Unsupported length: ${unit}`);
  return value * factor;
}

export function fromMillimetres(value, unit = "mm") {
  const factor = units[unit];
  if (!finite(value) || !factor) throw new RangeError(`Unsupported length: ${unit}`);
  return value / factor;
}

export function convertPointToMillimetres(p, unit = "mm") {
  if (!point(p)) throw new TypeError("Point must contain two finite numbers");
  return [toMillimetres(p[0], unit), toMillimetres(p[1], unit)];
}

function issue(path, code, message) { return {path, code, message}; }

/* يتحقق من الحد الأدنى المشترك، لا من كل قواعد CivilDraft التفصيلية.
   قواعد النواة الحالية تبقى في ensureShape؛ هذا العقد يحرس حدود التكامل. */
export function validateCanonicalProject(project) {
  const errors = [];
  if (!project || typeof project !== "object" || Array.isArray(project)) {
    return {ok: false, errors: [issue("$", "project-type", "Project must be an object")], warnings: []};
  }
  if (project.contractVersion !== CONTRACT_VERSION)
    errors.push(issue("contractVersion", "contract-version", `Expected ${CONTRACT_VERSION}`));
  if (project.storageUnit !== STORAGE_UNIT)
    errors.push(issue("storageUnit", "storage-unit", "Canonical storage unit must be mm"));
  if (!Array.isArray(project.levels))
    errors.push(issue("levels", "levels-type", "levels must be an array"));
  const levels = Array.isArray(project.levels) ? project.levels : [];
  const ids = new Set();
  levels.forEach((level, i) => {
    const path = `levels[${i}]`;
    if (!level || typeof level !== "object") { errors.push(issue(path, "level-type", "Level must be an object")); return; }
    if (typeof level.id !== "string" || !level.id) errors.push(issue(`${path}.id`, "level-id", "Level id is required"));
    else if (ids.has(level.id)) errors.push(issue(`${path}.id`, "duplicate-id", `Duplicate level id ${level.id}`));
    else ids.add(level.id);
    for (const key of ["elevation", "height", "slab"]) {
      if (!finite(level[key]) || level[key] < 0) errors.push(issue(`${path}.${key}`, "length", `${key} must be a non-negative mm value`));
    }
  });
  if (project.sourceUnit != null && !units[project.sourceUnit])
    errors.push(issue("sourceUnit", "source-unit", "sourceUnit is not supported"));
  return {ok: errors.length === 0, errors, warnings: []};
}

export function canonicalProject({name = "PLAN", levels = [], metadata = {}} = {}) {
  return {
    contractVersion: CONTRACT_VERSION,
    storageUnit: STORAGE_UNIT,
    sourceUnit: "mm",
    name: String(name),
    metadata: {...metadata},
    levels: levels.map(level => ({...level}))
  };
}

export function roundTripCanonicalProject(project) {
  const checked = validateCanonicalProject(project);
  if (!checked.ok) throw new TypeError(checked.errors.map(e => `${e.path}: ${e.message}`).join("; "));
  return JSON.parse(JSON.stringify(project));
}
