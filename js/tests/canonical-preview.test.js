import assert from "node:assert/strict";
import {canonicalPreview} from "../ui/canonical-preview.js";

const project = {
  contractVersion: 1, storageUnit: "mm", sourceUnit: "mm", name: "preview",
  levels: [{id: "level-0", number: 0, elevation: 0, height: 3000, slab: 200,
    walls: [{id: "w", a: [0, 0], b: [3000, 0], thickness: 200, height: 3000}],
    openings: [], rooms: []}]
};
const before = JSON.stringify(project);
const preview = canonicalPreview(project, {level: 0});
assert.equal(preview.importReport.ok, true);
assert.ok(preview.faces.length > 0);
assert.equal(JSON.stringify(project), before);
console.log("canonical preview: ok");
