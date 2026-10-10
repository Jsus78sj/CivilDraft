import assert from "node:assert/strict";
import {exportCanonicalFile, importCanonicalFile} from "../io/canonical-project.js";

const state = {
  meta: {name: "ملف", level: 0, wallH: 3000},
  levelDefs: [{n: 0, name: "أرضي", elev: 0, h: 3000, slab: 200}],
  walls: [{id: "w1", level: 0, a: [0, 0], b: [4000, 0], t: 200, type: "ext", align: "c"}],
  opens: [],
  areas: [],
};
const text = exportCanonicalFile(state);
const loaded = importCanonicalFile(text);
assert.equal(loaded.state.walls[0].id, "w1");
assert.equal(loaded.state.walls[0].t, 200);
assert.equal(loaded.report.ok, true);
assert.deepEqual(loaded.source.meta.name, "ملف");
assert.throws(() => importCanonicalFile("{}"), /إصدار أو نوع/);
assert.throws(() => importCanonicalFile("not json"), /JSON/);
console.log("canonical project file: ok");
