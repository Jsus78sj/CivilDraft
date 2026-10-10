import assert from "node:assert/strict";
import {S,newState} from "../core/state.js";
import {commitQuickRectangle} from "../core/quick-draw-transaction.js";

newState();
const result=commitQuickRectangle([0,0],[6000,4000],{thickness:200,type:"ext",align:"c"});
assert.equal(result.created.length,4);
assert.deepEqual(S.walls.map(w=>w.a),[[0,0],[6000,0],[6000,4000],[0,4000]]);
assert.deepEqual(S.walls.map(w=>w.b),[[6000,0],[6000,4000],[0,4000],[0,0]]);
assert.ok(S.walls.every(w=>w.type==="ext"&&w.t===200));
console.log("quickdraw tool contract: ok");
