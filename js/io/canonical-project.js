/* ═══ جسر ملفّ المشروع والعقد الموحّد · المرحلة 1 ═══
   لا يستبدل صيغة CivilDraft الحالية. يضيف غلافاً صريحاً قابلاً للتبادل
   يحوي العقد canonical مع النسخة الأصلية، حتى لا تُفقد حقول لم تدخل
   العقد بعد. القراءة ترفض الملف الفاسد قبل لمس حالة التطبيق.
*/
import {civilDraftToCanonical} from "../core/canonical-adapter.js";
import {canonicalToCivilDraft} from "../core/canonical-import.js";
import {validateCanonicalProject} from "../core/canonical-contract.js";

export const CANONICAL_FILE_VERSION = 1;
export const CANONICAL_APP = "civildraft-canonical";

export function exportCanonicalFile(state, options = {}) {
  const canonical = civilDraftToCanonical(state);
  const envelope = {
    app: CANONICAL_APP,
    version: CANONICAL_FILE_VERSION,
    format: "canonical-project",
    canonical,
    source: options.includeSource === false ? undefined : state
  };
  if (envelope.source === undefined) delete envelope.source;
  return JSON.stringify(envelope);
}

export function importCanonicalFile(text) {
  let envelope;
  try { envelope = JSON.parse(String(text)); }
  catch { throw new Error("ملف العقد الموحّد ليس JSON صالحاً"); }
  if (!envelope || envelope.app !== CANONICAL_APP || envelope.version !== CANONICAL_FILE_VERSION)
    throw new Error("إصدار أو نوع ملف العقد الموحّد غير مدعوم");
  const check = validateCanonicalProject(envelope.canonical);
  if (!check.ok) throw new Error(check.errors.map(e => `${e.path}: ${e.message}`).join("; "));
  const converted = canonicalToCivilDraft(envelope.canonical);
  return {state: converted.state, report: converted.report, source: envelope.source || null};
}
