/* ═══ جسر المعاينة للعقد الموحّد ═══
   API قراءة فقط لطبقة الواجهة. لا يفتح نافذة ولا يلمس S؛ يفصل تحميل
   العقد عن اختيار واجهة العرض، ويسمح للواجهة الحديثة باستعمال نفس
   model3d قبل نقل الرسم إلى محرك آخر.
*/
import {buildCanonical3d} from "../core/canonical-3d.js";

export function canonicalPreview(project, options = {}) {
  return buildCanonical3d(project, options);
}
