/* ═══ العقد الموحّد → نموذج 3D · قراءة محضة ═══
   لا يكتب في المشروع. يحوّل العقد إلى حالة CivilDraft المؤقتة ثم
   يستعمل مولّد model3d الحالي، وبذلك تبقى قواعد الفتحات والأسقف واحدة.
   هذه طبقة انتقالية إلى أن يصبح مولّد 3D مستهلكاً للعقد مباشرةً.
*/
import {canonicalToCivilDraft} from "./canonical-import.js";
import {build3d} from "./model3d.js";

export function buildCanonical3d(project, options = {}) {
  const converted = canonicalToCivilDraft(project);
  const model = build3d(converted.state, options);
  return {
    ...model,
    importReport: converted.report,
    sourceContractVersion: project.contractVersion
  };
}
