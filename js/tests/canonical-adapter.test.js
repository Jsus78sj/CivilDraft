import assert from "node:assert/strict";
import {civilDraftToCanonical} from "../core/canonical-adapter.js";

const state = {
  meta: {name: "بيت الاختبار", level: 0, wallH: 3000},
  levelDefs: [
    {n: 0, name: "أرضي", elev: 0, h: 3000, slab: 200},
    {n: 1, name: "أول", elev: 3200, h: 2800, slab: 180}
  ],
  walls: [
    {id: "w1", level: 0, type: "ext", align: "c", a: [0, 0], b: [5000, 0], t: 200},
    {id: "w2", level: 1, type: "int", align: "c", a: [0, 0], b: [3000, 0], t: 120, h: 2800, bulge: 0.2}
  ],
  opens: [{id: "o1", level: 0, wall: "w1", kind: "door", s: 1000, w: 900, h: 2100, sill: 0}],
  areas: [{id: "r1", level: 0, name: "مجلس", ring: [[0, 0], [5000, 0], [5000, 4000]], showArea: true}]
};

const project = civilDraftToCanonical(state);
assert.equal(project.storageUnit, "mm");
assert.equal(project.levels.length, 2);
assert.equal(project.levels[1].elevation, 3200);
assert.equal(project.levels[0].walls[0].thickness, 200);
assert.equal(project.levels[0].openings[0].offset, 1000);
assert.equal(project.levels[0].rooms[0].ring[1][0], 5000);
assert.equal(project.levels[1].walls[0].bulge, 0.2);

const snapshot = JSON.parse(JSON.stringify(project));
const again = civilDraftToCanonical(state);
assert.deepEqual(again, snapshot);
assert.equal(state.walls[0].t, 200);

console.log("canonical adapter: ok");
