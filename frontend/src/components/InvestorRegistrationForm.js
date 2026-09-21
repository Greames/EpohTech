import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios, { API } from "@/lib/api";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-obsidian/70 px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/60 focus:ring-1 focus:ring-champagne/30 transition-colors duration-300";
const labelCls = "block font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2";

const Field = ({ label, name, type = "text", required = false, textarea = false, options = null, placeholder = "", form, onChange, testId }) => (
  <div>
    <label htmlFor={name} className={labelCls}>
      {label} {required && <span className="text-champagne">*</span>}
    </label>
    {textarea ? (
      <textarea id={name} name={name} required={required} rows={3} value={form[name]} onChange={onChange} placeholder={placeholder} data-testid={testId} className={`${inputCls} resize-none`} />
    ) : options ? (
      <select id={name} name={name} required={required} value={form[name]} onChange={onChange} data-testid={testId} className={inputCls}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    ) : (
      <input id={name} name={name} type={type} required={required} value={form[name]} onChange={onChange} placeholder={placeholder} data-testid={testId} className={inputCls} />
    )}
  </div>
);

const INITIAL = {
  name: "", company: "", email: "", phone: "", location: "", investment_range: "",
  preferred_sectors: "", preferred_geography: "", investment_stage: "",
  investment_experience: "", strategic_expertise: "", linkedin: "", notes: "",
};

export default function InvestorRegistrationForm() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await axios.post(`${API}/applications/investor`, form);
      setDone(r.data);
      toast.success("Registration received — verification is underway.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-champagne/25 bg-charcoal/70 p-10 sm:p-14 text-center"
        data-testid="investor-registration-success"
      >
        <ShieldCheck size={48} className="mx-auto text-champagne" />
        <h3 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Verification underway.</h3>
        <p className="mt-4 text-gray-400 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
          Your registration <span className="font-mono text-champagne text-xs">{done.registration_id}</span> is in
          <strong className="text-white"> VERIFICATION</strong>. Once approved, live venture opportunities will be
          waiting for you on the Opportunities page — sign in with this email to access them.
          A confirmation email is on its way.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={submit}
      data-testid="investor-registration-form"
      className="rounded-3xl border border-white/10 bg-charcoal/50 p-6 sm:p-10 lg:p-12 space-y-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full Name" name="name" required placeholder="Your name" form={form} onChange={onChange} testId="investor-input-name" />
        <Field label="Company / Firm" name="company" placeholder="Optional" form={form} onChange={onChange} testId="investor-input-company" />
        <Field label="Email" name="email" type="email" required placeholder="you@email.com" form={form} onChange={onChange} testId="investor-input-email" />
        <Field label="Phone" name="phone" placeholder="+91 …" form={form} onChange={onChange} testId="investor-input-phone" />
        <Field label="Location" name="location" placeholder="City, State" form={form} onChange={onChange} testId="investor-input-location" />
        <Field label="LinkedIn" name="linkedin" placeholder="linkedin.com/in/…" form={form} onChange={onChange} testId="investor-input-linkedin" />
        <Field label="Investment Range" name="investment_range" options={["₹10L – ₹25L", "₹25L – ₹1Cr", "₹1Cr – ₹5Cr", "₹5Cr – ₹10Cr+"]} form={form} onChange={onChange} testId="investor-input-investment-range" />
        <Field label="Preferred Stage" name="investment_stage" options={["Idea / Validation", "Launch", "Traction", "Scale"]} form={form} onChange={onChange} testId="investor-input-stage" />
        <Field label="Preferred Sectors" name="preferred_sectors" placeholder="e.g. Agri, Infra, SaaS, D2C" form={form} onChange={onChange} testId="investor-input-sectors" />
        <Field label="Preferred Geography" name="preferred_geography" placeholder="e.g. India, Tier-2 cities" form={form} onChange={onChange} testId="investor-input-geography" />
        <Field label="Investment Experience" name="investment_experience" options={["First-time investor", "Angel — a few deals", "Experienced — 5+ deals", "Institutional"]} form={form} onChange={onChange} testId="investor-input-experience" />
        <Field label="Strategic Expertise" name="strategic_expertise" placeholder="e.g. Distribution, Manufacturing, GTM" form={form} onChange={onChange} testId="investor-input-expertise" />
      </div>
      <Field label="Notes" name="notes" textarea placeholder="Anything else we should know?" form={form} onChange={onChange} testId="investor-input-notes" />

      <p className="text-[11px] text-gray-600 leading-relaxed font-mono">
        Registration does not guarantee allocation, returns or exits. All venture opportunities involve risk
        and are shared only after verification.
      </p>

      <button
        type="submit"
        disabled={loading}
        data-testid="investor-registration-submit-button"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-10 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 disabled:opacity-60 gold-glow"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "SUBMITTING…" : "JOIN THE INVESTOR NETWORK"}
      </button>
    </form>
  );
}
