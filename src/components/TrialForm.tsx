import { useState, type FormEvent } from "react";
import { CONTACT } from "../config";
import type { Copy } from "../i18n";

/* "Request a free trial" form. The site has no server, so submitting opens
 * WhatsApp (or, failing that, the visitor's email app) with the details
 * already written into the message, addressed to CONTACT in config.ts. */
type Field = "name" | "clinic" | "phone" | "city";

export default function TrialForm({ c }: { c: Copy }) {
  const f = c.form;
  const [values, setValues] = useState({ name: "", clinic: "", phone: "", city: "", doctors: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"" | "sent" | "noChannel">("");

  const channel = CONTACT.whatsapp ? "whatsapp" : CONTACT.email ? "email" : null;
  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (k in errors) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<Field, string>> = {};
    (["name", "clinic", "phone"] as const).forEach((k) => { if (!values[k].trim()) er[k] = f.required; });
    // Latin or Arabic-Indic digits; at least 8 of them.
    const digitCount = (values.phone.match(/[0-9٠-٩]/g) ?? []).length;
    if (values.phone.trim() && digitCount < 8) er.phone = f.phoneInvalid;
    setErrors(er);
    if (Object.keys(er).length) return;

    if (!channel) { setStatus("noChannel"); return; }

    const lines = [
      `*${f.msgHeader}*`,
      `${f.name}: ${values.name.trim()}`,
      `${f.clinic}: ${values.clinic.trim()}`,
      `${f.phone}: ${values.phone.trim()}`,
      values.city.trim() && `${f.city}: ${values.city.trim()}`,
      values.doctors && `${f.doctors}: ${values.doctors}`,
      values.message.trim() && `\n${values.message.trim()}`,
    ].filter(Boolean).join("\n");

    const url = channel === "whatsapp"
      ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(lines)}`
      : `mailto:${CONTACT.email}?subject=${encodeURIComponent(f.msgHeader)}&body=${encodeURIComponent(lines.replace(/\*/g, ""))}`;
    if (channel === "whatsapp") window.open(url, "_blank", "noopener");
    else window.location.href = url;
    setStatus("sent");
  };

  const input = (k: Field, label: string, opts: { type?: string; required?: boolean; autoComplete?: string; dir?: string } = {}) => (
    <label className={`fld${errors[k] ? " bad" : ""}`}>
      <span>{label}{opts.required && <b aria-hidden="true"> *</b>}</span>
      <input
        type={opts.type ?? "text"} value={values[k]} onChange={set(k)} autoComplete={opts.autoComplete}
        dir={opts.dir} aria-invalid={!!errors[k] || undefined} aria-required={opts.required || undefined}
      />
      {errors[k] && <em role="alert">{errors[k]}</em>}
    </label>
  );

  return (
    <form className="trial" onSubmit={submit} noValidate>
      <div className="trial-head">
        <h3>{f.title}</h3>
        <p>{f.lead}</p>
      </div>
      <div className="trial-grid">
        {input("name", f.name, { required: true, autoComplete: "name" })}
        {input("clinic", f.clinic, { required: true, autoComplete: "organization" })}
        {input("phone", f.phone, { required: true, type: "tel", autoComplete: "tel", dir: "ltr" })}
        {input("city", f.city, { autoComplete: "address-level2" })}
        <div className="fld wide">
          <span>{f.doctors}</span>
          <div className="chips" role="radiogroup" aria-label={f.doctors}>
            {f.doctorsOptions.map((o) => (
              <button
                type="button" key={o} role="radio" aria-checked={values.doctors === o}
                className={`chip${values.doctors === o ? " on" : ""}`}
                onClick={() => setValues((v) => ({ ...v, doctors: v.doctors === o ? "" : o }))}
              >{o}</button>
            ))}
          </div>
        </div>
        <label className="fld wide">
          <span>{f.message}</span>
          <textarea rows={3} value={values.message} onChange={set("message")} />
        </label>
      </div>
      <button type="submit" className="btn btn-gold trial-submit">
        {channel === "email" ? f.submitEmail : f.submitWhatsapp}
      </button>
      {status && <p className={`trial-status ${status}`} role="status">{status === "sent" ? f.sent : f.noChannel}</p>}
    </form>
  );
}
