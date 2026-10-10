import assert from "node:assert/strict";
import {
  CONTRACT_VERSION, STORAGE_UNIT, canonicalProject, convertPointToMillimetres,
  fromMillimetres, roundTripCanonicalProject, toMillimetres,
  validateCanonicalProject
} from "../core/canonical-contract.js";

const project = canonicalProject({
  name: "اختبار",
  levels: [{id: "level-0", elevation: 0, height: 3000, slab: 200}]
});

assert.equal(STORAGE_UNIT, "mm");
assert.equal(CONTRACT_VERSION, 1);
assert.equal(toMillimetres(2, "m"), 2000);
assert.equal(toMillimetres(1, "ft"), 304.8);
assert.equal(fromMillimetres(2500, "m"), 2.5);
assert.deepEqual(convertPointToMillimetres([1.5, 2], "m"), [1500, 2000]);
assert.equal(validateCanonicalProject(project).ok, true);
assert.deepEqual(roundTripCanonicalProject(project), project);

const bad = {...project, storageUnit: "m", levels: [
  {id: "level-0", elevation: 0, height: 3000, slab: 200},
  {id: "level-0", elevation: -1, height: 0, slab: 0}
]};
const report = validateCanonicalProject(bad);
assert.equal(report.ok, false);
assert.ok(report.errors.some(e => e.code === "storage-unit"));
assert.ok(report.errors.some(e => e.code === "duplicate-id"));
assert.ok(report.errors.some(e => e.code === "length"));
assert.throws(() => toMillimetres(1, "yards"), /Unsupported length/);

console.log("canonical contract: ok");
