import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
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
  name: "", email: "", phone: "", location: "", linkedin: "", occupation: "", experience: "",
  industry: "", idea: "", problem: "", target_customer: "", solution: "", existing_business: "",
  existing_customers: "", revenue: "", team: "", capital_required: "", capital_invested: "",
  full_time: "", why_build: "", deck_link: "",
};

const SectionTitle = ({ n, children }) => (
  <div className="flex items-center gap-4 pt-4">
    <span className="font-mono text-xs text-champagne">{n}</span>
    <h3 className="text-lg font-bold text-white tracking-tight">{children}</h3>
    <span className="flex-1 h-px bg-white/5" />
  </div>
);

export default function FounderApplicationForm() {
  const [form, setForm] = useState(INITIAL);
  const [deck, setDeck] = useState(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await axios.post(`${API}/applications/founder`, { ...form, consent: true });
      if (deck) {
        try {
          const fd = new FormData();
          fd.append("file", deck);
          await axios.post(`${API}/applications/founder/${r.data.application_id}/deck`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (deckErr) {
          toast.warning("Application saved, but the deck upload failed — you can email it to us instead.");
        }
      }
      setDone(r.data);
      toast.success("Application submitted — check your inbox for confirmation.");
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
        data-testid="founder-application-success"
      >
        <CheckCircle2 size={48} className="mx-auto text-champagne" />
        <h3 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Application received.</h3>
        <p className="mt-4 text-gray-400 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
          Thank you. Your application
          <span className="font-mono text-champagne text-xs ml-1">{done.application_id}</span> is now
          <strong className="text-white"> under review</strong>. Every application is read personally —
          if there is a fit, we will reach out for a conversation. A confirmation email is on its way.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={submit}
      data-testid="founder-application-form"
      className="rounded-3xl border border-white/10 bg-charcoal/50 p-6 sm:p-10 lg:p-12 space-y-8"
    >
      <SectionTitle n="01">About You</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full Name" name="name" required placeholder="Your name" form={form} onChange={onChange} testId="founder-input-name" />
        <Field label="Email" name="email" type="email" required placeholder="you@email.com" form={form} onChange={onChange} testId="founder-input-email" />
        <Field label="Phone" name="phone" placeholder="+91 …" form={form} onChange={onChange} testId="founder-input-phone" />
        <Field label="Location" name="location" placeholder="City, State" form={form} onChange={onChange} testId="founder-input-location" />
        <Field label="LinkedIn" name="linkedin" placeholder="linkedin.com/in/…" form={form} onChange={onChange} testId="founder-input-linkedin" />
        <Field label="Your Role" name="occupation" placeholder="e.g. Founder & CEO" form={form} onChange={onChange} testId="founder-input-occupation" />
        <Field label="Years of Experience" name="experience" options={["0–2", "3–5", "6–10", "10+"]} form={form} onChange={onChange} testId="founder-input-experience" />
        <Field label="Industry / Domain" name="industry" placeholder="e.g. Logistics, Agri, SaaS" form={form} onChange={onChange} testId="founder-input-industry" />
      </div>

      <SectionTitle n="02">The Company</SectionTitle>
      <div className="grid grid-cols-1 gap-5">
        <Field label="Tell us about the company" name="idea" required textarea placeholder="What it does, for whom, and why now." form={form} onChange={onChange} testId="founder-input-idea" />
        <Field label="The Problem" name="problem" textarea placeholder="What problem does it solve, and for whom?" form={form} onChange={onChange} testId="founder-input-problem" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Target Customer" name="target_customer" placeholder="Who pays for this?" form={form} onChange={onChange} testId="founder-input-target-customer" />
          <Field label="Your Solution" name="solution" placeholder="How does the company solve it?" form={form} onChange={onChange} testId="founder-input-solution" />
        </div>
      </div>

      <SectionTitle n="03">Traction</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Company Stage" name="existing_business" options={["Idea stage", "Early — pre-revenue", "Revenue generating"]} form={form} onChange={onChange} testId="founder-input-existing-business" />
        <Field label="Existing Customers?" name="existing_customers" options={["None yet", "1–10", "10–50", "50+"]} form={form} onChange={onChange} testId="founder-input-existing-customers" />
        <Field label="Current Revenue" name="revenue" placeholder="e.g. ₹2L/month (or none)" form={form} onChange={onChange} testId="founder-input-revenue" />
        <Field label="Current Team" name="team" placeholder="e.g. Just me / 3 people" form={form} onChange={onChange} testId="founder-input-team" />
      </div>

      <SectionTitle n="04">Capital & Commitment</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Capital Sought" name="capital_required" placeholder="e.g. ₹50L (details discussed privately)" form={form} onChange={onChange} testId="founder-input-capital-required" />
        <Field label="Capital Already Invested" name="capital_invested" placeholder="e.g. ₹5L of savings" form={form} onChange={onChange} testId="founder-input-capital-invested" />
        <Field label="Full-Time Availability" name="full_time" options={["Yes — immediately", "Within 3 months", "Part-time for now"]} form={form} onChange={onChange} testId="founder-input-full-time" />
        <Field label="Pitch Deck Link" name="deck_link" placeholder="Drive / DocSend link (optional)" form={form} onChange={onChange} testId="founder-input-deck-link" />
      </div>
      <div>
        <span className={labelCls}>Or Upload Pitch Deck</span>
        <label
          htmlFor="deck_file"
          data-testid="founder-input-deck-file-label"
          className="flex items-center gap-3 rounded-xl border border-dashed border-white/15 bg-obsidian/70 px-4 py-3.5 text-sm text-gray-500 hover:border-champagne/50 hover:text-gray-300 cursor-pointer transition-colors duration-300"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E6C280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span className="truncate">{deck ? `${deck.name} · ${(deck.size / 1048576).toFixed(1)} MB` : "PDF, PPT or DOC — max 15MB"}</span>
        </label>
        <input id="deck_file" type="file" accept=".pdf,.ppt,.pptx,.doc,.docx" onChange={(e) => setDeck(e.target.files?.[0] || null)} data-testid="founder-input-deck-file" className="hidden" />
      </div>
      <Field label="Why are you building this?" name="why_build" textarea placeholder="The honest version." form={form} onChange={onChange} testId="founder-input-why-build" />

      <label className="flex items-start gap-3 text-xs text-gray-400 leading-relaxed cursor-pointer">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} data-testid="founder-consent-checkbox" className="mt-0.5 h-4 w-4 accent-[#E6C280]" />
        <span>
          I consent to Anvaya Partners Private Limited processing the information and documents I submit
          (including my pitch deck) to evaluate my application, as described in the{" "}
          <Link to="/privacy" className="text-champagne underline underline-offset-2">Privacy Policy</Link> (DPDP Act, 2023).
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        data-testid="founder-application-submit-button"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-10 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "SUBMITTING…" : "SUBMIT APPLICATION"}
      </button>
    </form>
  );
}
