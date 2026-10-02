import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-obsidian/70 px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/60 focus:ring-1 focus:ring-champagne/30 transition-colors duration-300";
const labelCls = "block font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2";

const INTERESTS = [
  "General Enquiry",
  "Data Engineering",
  "Big Data Analytics",
  "Oracle ERP & OIC Services",
  "IT Strategy & Consulting",
  "Custom Software Development",
  "Internship Program",
  "Corporate Training",
  "Other",
];

const CONTACT_ROWS = [
  { icon: Mail, label: "Email", value: "assist@theepoh.com", href: "mailto:assist@theepoh.com", testId: "epoh-contact-info-email" },
  { icon: Phone, label: "Phone", value: "+91 70229 13284", href: "tel:+917022913284", testId: "epoh-contact-info-phone" },
  { icon: MapPin, label: "Proddatur", value: "D.No: 9/580, Khadarbad, Proddatur, Andhra Pradesh 516362", testId: "epoh-contact-info-proddatur" },
  { icon: MapPin, label: "Hyderabad", value: "16th Floor, Awfis Coworking Space, Prestige Skytech, Financial District, Hyderabad 500032", testId: "epoh-contact-info-hyderabad" },
];

export default function EpohContactPage() {
  const [params] = useSearchParams();
  const initialInterest = INTERESTS.includes(params.get("interest")) ? params.get("interest") : "General Enquiry";
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: initialInterest, message: "" });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Netlify Forms stores the lead and emails it to the configured recipients.
      const body = new URLSearchParams({
        "form-name": "epoh-enquiry",
        "bot-field": e.target.elements["bot-field"].value,
        ...form,
        consent: consent ? "yes" : "no",
      });
      const res = await fetch("/enquiry-received.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDone(true);
      toast.success("Enquiry sent — we'll be in touch.");
    } catch {
      toast.error("Could not send. Please email assist@theepoh.com or try again.");
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
              <MaskedLine delay={0.15}><span>Book a</span></MaskedLine>
              <MaskedLine delay={0.3}><span className="text-champagne">consultation.</span></MaskedLine>
            </h1>
            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
              Ready to transform your business with technology that works? Tell us what you
              need — we will find out how we can help.
            </p>
            <div className="mt-12 space-y-6">
              {CONTACT_ROWS.map((r) => (
                <div key={r.label} className="flex items-start gap-4" data-testid={r.testId}>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-champagne/10 text-champagne border border-champagne/20 shrink-0">
                    <r.icon size={18} strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">{r.label}</p>
                    {r.href ? (
                      <a href={r.href} className="mt-1 block text-sm text-gray-200 hover:text-champagne transition-colors duration-300">{r.value}</a>
                    ) : (
                      <p className="mt-1 text-sm text-gray-200 max-w-xs">{r.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600">
              EpohTech Solutions Pvt Ltd · An Anvaya Partners Company
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-champagne/25 bg-charcoal/70 p-10 sm:p-14 text-center h-full flex flex-col items-center justify-center"
                data-testid="epoh-contact-success"
              >
                <CheckCircle2 size={44} className="text-champagne" />
                <h2 className="mt-6 text-2xl font-extrabold text-white tracking-tight">Enquiry received.</h2>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-sm">
                  Thank you for reaching out to Epoh Tech. Our team will get back to you shortly.
                </p>
              </motion.div>
            ) : (
              <form
                name="epoh-enquiry"
                onSubmit={submit}
                data-testid="epoh-contact-form"
                className="rounded-3xl border border-white/10 bg-charcoal/60 p-8 sm:p-10 space-y-5"
              >
                <p hidden>
                  <label>Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="epoh-name" className={labelCls}>Full Name *</label>
                    <input id="epoh-name" name="name" required value={form.name} onChange={onChange} placeholder="Your name" data-testid="epoh-contact-name-input" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="epoh-phone" className={labelCls}>Phone *</label>
                    <input id="epoh-phone" name="phone" required value={form.phone} onChange={onChange} placeholder="+91" data-testid="epoh-contact-phone-input" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label htmlFor="epoh-email" className={labelCls}>Email Address *</label>
                  <input id="epoh-email" type="email" name="email" required value={form.email} onChange={onChange} placeholder="you@company.com" data-testid="epoh-contact-email-input" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="epoh-interest" className={labelCls}>I'm interested in</label>
                  <select id="epoh-interest" name="interest" value={form.interest} onChange={onChange} data-testid="epoh-contact-interest-select" className={inputCls}>
                    {INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="epoh-message" className={labelCls}>Comments / Questions *</label>
                  <textarea id="epoh-message" name="message" required rows={5} value={form.message} onChange={onChange} placeholder="Tell us about your business and what you need…" data-testid="epoh-contact-message-input" className={`${inputCls} resize-none`} />
                </div>
                <label className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    data-testid="epoh-contact-consent-checkbox"
                    className="mt-0.5 h-3.5 w-3.5 accent-[#E6C280]"
                  />
                  <span>
                    I consent to EpohTech Solutions Pvt Ltd processing my details to respond to my
                    enquiry, as described in the Anvaya Partners Privacy Policy.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={loading || !consent}
                  data-testid="epoh-contact-submit-button"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "SEND ENQUIRY"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
