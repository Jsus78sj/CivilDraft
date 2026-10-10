import assert from "node:assert/strict";
import {buildCanonical3d} from "../core/canonical-3d.js";

const project = {
  contractVersion: 1, storageUnit: "mm", sourceUnit: "mm", name: "3D",
  levels: [{id: "level-0", number: 0, name: "Ground", elevation: 0, height: 3000, slab: 200,
    walls: [{id: "w1", a: [0, 0], b: [4000, 0], thickness: 200, height: 3000}],
    openings: [{id: "o1", wallId: "w1", kind: "door", offset: 2000, width: 900, height: 2100, sill: 0}],
    rooms: []}]
};
const model = buildCanonical3d(project, {level: 0});
assert.equal(model.importReport.ok, true);
assert.equal(model.sourceContractVersion, 1);
assert.ok(model.faces.length > 0);
assert.ok(model.faces.some(face => face.kind === "wall"));
assert.deepEqual(model.levels, [0]);
assert.equal(model.arcSolid, 0);
console.log("canonical 3d adapter: ok");
