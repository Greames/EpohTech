import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { toast } from "sonner";
import axios, { API } from "@/lib/api";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-obsidian/70 px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/60 focus:ring-1 focus:ring-champagne/30 transition-colors duration-300";
const labelCls = "block font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2";

const TOPICS = ["General", "Founder Application Question", "Investor Network Question", "Request Deck — Invest in Anvaya Partners", "Press & Media", "Other"];

const CONTACT_ROWS = [
  { icon: Mail, label: "Email", value: "tulasi.reddu@anvayapartners.in", testId: "contact-info-email" },
  { icon: Phone, label: "Phone", value: "[phone]", testId: "contact-info-phone" },
  { icon: MapPin, label: "Office", value: "Hyderabad, India", testId: "contact-info-city" },
  { icon: Linkedin, label: "LinkedIn", value: "[LinkedIn URL]", testId: "contact-info-linkedin" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "General", message: "" });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, { ...form, consent: true });
      setDone(true);
      toast.success("Message sent — we'll be in touch.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
              <MaskedLine delay={0.15}><span>Start a</span></MaskedLine>
              <MaskedLine delay={0.3}><span className="text-champagne">conversation.</span></MaskedLine>
            </h1>
            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
              Founders building something durable, investors who share our horizon — every
              partnership starts here.
            </p>
            <div className="mt-12 space-y-6">
              {CONTACT_ROWS.map((r) => (
                <div key={r.label} className="flex items-start gap-4" data-testid={r.testId}>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-champagne/10 text-champagne border border-champagne/20 shrink-0">
                    <r.icon size={18} strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">{r.label}</p>
                    <p className="mt-1 text-sm text-gray-200">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600">
              Anvaya Partners Private Limited
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-champagne/25 bg-charcoal/70 p-10 sm:p-14 text-center h-full flex flex-col items-center justify-center"
                data-testid="contact-success"
              >
                <CheckCircle2 size={48} className="text-champagne" />
                <h3 className="mt-6 text-2xl font-extrabold text-white tracking-tight">Message received.</h3>
                <p className="mt-4 text-gray-400 max-w-sm text-sm leading-relaxed">
                  A confirmation is on its way to your inbox. Every message is read personally.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={submit}
                data-testid="contact-form"
                className="rounded-3xl border border-white/10 bg-charcoal/50 p-6 sm:p-10 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className={labelCls}>Name <span className="text-champagne">*</span></label>
                    <input id="name" name="name" required value={form.name} onChange={onChange} placeholder="Your name" data-testid="contact-input-name" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelCls}>Email <span className="text-champagne">*</span></label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={onChange} placeholder="you@email.com" data-testid="contact-input-email" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label htmlFor="topic" className={labelCls}>Topic</label>
                  <select id="topic" name="topic" value={form.topic} onChange={onChange} data-testid="contact-input-topic" className={inputCls}>
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className={labelCls}>Message <span className="text-champagne">*</span></label>
                  <textarea id="message" name="message" required rows={5} value={form.message} onChange={onChange} placeholder="Tell us about your company, or how you'd like to partner." data-testid="contact-input-message" className={`${inputCls} resize-none`} />
                </div>
                <label className="flex items-start gap-3 text-xs text-gray-400 leading-relaxed cursor-pointer">
                  <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} data-testid="contact-consent-checkbox" className="mt-0.5 h-4 w-4 accent-[#E6C280]" />
                  <span>
                    I consent to Anvaya Partners Private Limited processing my information as described in the{" "}
                    <Link to="/privacy" className="text-champagne underline underline-offset-2">Privacy Policy</Link> (DPDP Act, 2023).
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="contact-submit-button"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-10 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 disabled:opacity-60"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? "SENDING…" : "SEND MESSAGE"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
