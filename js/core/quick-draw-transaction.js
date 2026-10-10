/* ═══ تنفيذ الرسم السريع الذرّي · المرحلة 2 ═══
   طبقة ربط صغيرة بين خطة الرسم السريع ونواة CivilDraft.
   لا تُستعمل من الواجهة إلا داخل edit؛ فإما أن تُنشأ كل الجدران
   أو لا يتغير شيء. تبقى المعاينة منفصلة عن هذه الدالة.
*/
import {addWall} from "./walls.js";
import {edit} from "./state.js";
import {drawingCommitPlan, rectangleFromCorners} from "./quick-draw.js";

export function commitQuickRectangle(a, b, options = {}) {
  const points = rectangleFromCorners(a, b);
  const plan = drawingCommitPlan(points);
  const created = [];
  const t = options.thickness;
  const type = options.type || "ext";
  const align = options.align || "c";
  const height = options.height;
  edit(() => {
    for (const [p, q] of plan.segments) {
      created.push(addWall(p, q, t, type, align, height));
    }
  }, options.label || "رسم مستطيل سريع");
  return {created, plan};
}
