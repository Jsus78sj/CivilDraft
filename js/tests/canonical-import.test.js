import assert from "node:assert/strict";
import {canonicalToCivilDraft} from "../core/canonical-import.js";

const project = {
  contractVersion: 1, storageUnit: "mm", sourceUnit: "m", name: "استيراد",
  levels: [{id: "level-0", number: 0, name: "أرضي", elevation: 0, height: 3000, slab: 200,
    walls: [{id: "w1", a: [0, 0], b: [5000, 0], thickness: 200, height: 3000}],
    openings: [{id: "o1", wallId: "w1", kind: "door", offset: 1000, width: 900, height: 2100, sill: 0}],
    rooms: [{id: "r1", name: "مجلس", ring: [[0, 0], [5000, 0], [5000, 4000]]}]}]
};
const result = canonicalToCivilDraft(project);
assert.equal(result.report.ok, true);
assert.equal(result.report.warnings[0].code, "converted-to-storage-unit");
assert.equal(result.state.walls[0].t, 200);
assert.equal(result.state.opens[0].wall, "w1");
assert.equal(result.state.areas[0].name, "مجلس");
assert.equal(result.state.levelDefs[0].h, 3000);

const bad = {...project, levels: [{...project.levels[0], openings: [{id: "orphan", wallId: "missing", offset: 0, width: 900, height: 2100}]}]};
const skipped = canonicalToCivilDraft(bad);
assert.equal(skipped.state.opens.length, 0);
assert.ok(skipped.report.warnings.some(w => w.code === "orphan-opening"));
console.log("canonical import: ok");
