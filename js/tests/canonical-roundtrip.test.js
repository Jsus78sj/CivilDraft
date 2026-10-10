import assert from "node:assert/strict";
import {civilDraftToCanonical} from "../core/canonical-adapter.js";
import {canonicalToCivilDraft} from "../core/canonical-import.js";

const source = {
  meta: {name: "Roundtrip", level: 0, wallH: 3000},
  levelDefs: [{n: 0, name: "Ground", elev: 0, h: 3000, slab: 200}],
  walls: [
    {id: "w1", level: 0, type: "ext", align: "c", a: [0, 0], b: [6000, 0], t: 200},
    {id: "w2", level: 0, type: "int", align: "c", a: [6000, 0], b: [6000, 4000], t: 120}
  ],
  opens: [{id: "o1", level: 0, wall: "w1", kind: "door", s: 1200, w: 900, h: 2100, sill: 0}],
  areas: [{id: "r1", level: 0, name: "Living", ring: [[0, 0], [6000, 0], [6000, 4000], [0, 4000]]}]
};

const canonical = civilDraftToCanonical(source);
const imported = canonicalToCivilDraft(canonical);
assert.equal(imported.report.ok, true);
assert.equal(imported.report.warnings.length, 0);
assert.deepEqual(imported.state.levelDefs.map(x => ({n: x.n, h: x.h, slab: x.slab})),
  [{n: 0, h: 3000, slab: 200}]);
assert.deepEqual(imported.state.walls.map(x => ({id: x.id, a: x.a, b: x.b, t: x.t})), [
  {id: "w1", a: [0, 0], b: [6000, 0], t: 200},
  {id: "w2", a: [6000, 0], b: [6000, 4000], t: 120}
]);
assert.deepEqual(imported.state.opens.map(x => ({id: x.id, wall: x.wall, s: x.s, w: x.w})),
  [{id: "o1", wall: "w1", s: 1200, w: 900}]);
assert.equal(imported.state.areas[0].ring.length, 4);

const malformed = structuredClone(canonical);
malformed.levels[0].openings.push({id: "bad", wallId: "missing", offset: 0, width: 900, height: 2100});
const safe = canonicalToCivilDraft(malformed);
assert.equal(safe.state.opens.length, 1);
assert.ok(safe.report.warnings.some(x => x.code === "orphan-opening"));

console.log("canonical round-trip: ok");
