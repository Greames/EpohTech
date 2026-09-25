import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Network, Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios, { API } from "@/lib/api";
import InvestorRegistrationForm from "@/components/InvestorRegistrationForm";
import InvestorFaqSection from "@/components/InvestorFaqSection";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-obsidian/70 px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/60 focus:ring-1 focus:ring-champagne/30 transition-colors duration-300";
const labelCls = "block font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2";

function RequestDeckModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/contact`, {
        name: form.name,
        email: form.email,
        topic: "Request Deck — Invest in Anvaya Partners",
        message: `Deck request. Phone: ${form.phone || "-"}. Note: ${form.note || "-"}`,
        consent: true,
      });
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-obsidian/80 backdrop-blur-md sm:p-6"
      onClick={onClose}
      data-testid="deck-request-overlay"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        data-testid="deck-request-modal"
        className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/10 bg-charcoal p-7 sm:p-10"
      >
        {done ? (
          <div className="text-center py-6" data-testid="deck-request-success">
            <CheckCircle2 size={44} className="mx-auto text-champagne" />
            <h3 className="mt-5 text-2xl font-extrabold text-white tracking-tight">Request received.</h3>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
              Our team reviews every request personally and will follow up with you directly.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-extrabold text-white tracking-tight">Request the Anvaya Partners deck</h3>
              <button onClick={onClose} data-testid="deck-request-close" className="rounded-full border border-white/10 p-2 text-gray-400 hover:text-white transition-colors duration-300" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              The deck is shared personally, not published. Tell us who you are and our team will follow up.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4" data-testid="deck-request-form">
              <div>
                <label htmlFor="dr-name" className={labelCls}>Name <span className="text-champagne">*</span></label>
                <input id="dr-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} data-testid="deck-request-name" className={inputCls} placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="dr-email" className={labelCls}>Email <span className="text-champagne">*</span></label>
                <input id="dr-email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} data-testid="deck-request-email" className={inputCls} placeholder="you@email.com" />
              </div>
              <div>
                <label htmlFor="dr-phone" className={labelCls}>Phone</label>
                <input id="dr-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} data-testid="deck-request-phone" className={inputCls} placeholder="+91 …" />
              </div>
              <div>
                <label htmlFor="dr-note" className={labelCls}>Note</label>
                <textarea id="dr-note" rows={3} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} data-testid="deck-request-note" className={`${inputCls} resize-none`} placeholder="Anything you'd like us to know" />
              </div>
              <label className="flex items-start gap-3 text-xs text-gray-400 leading-relaxed cursor-pointer">
                <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} data-testid="deck-request-consent-checkbox" className="mt-0.5 h-4 w-4 accent-[#E6C280]" />
                <span>
                  I consent to Anvaya Partners Private Limited processing my information as described in the{" "}
                  <Link to="/privacy" className="text-champagne underline underline-offset-2">Privacy Policy</Link>.
                </span>
              </label>
              <button
                type="submit"
                disabled={sending}
                data-testid="deck-request-submit-button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300 disabled:opacity-60"
              >
                {sending ? <Loader2 size={15} className="animate-spin" /> : null}
                {sending ? "SENDING…" : "REQUEST DECK"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function InvestorsPage() {
  const [deckOpen, setDeckOpen] = useState(false);

  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>For Investors</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Partner with</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">Anvaya Partners.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            Two considered ways to participate — both private, both reviewed personally.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Reveal>
            <div data-testid="investor-path-network" className="h-full flex flex-col rounded-3xl border border-white/5 bg-charcoal/60 p-8 sm:p-12 hover:border-champagne/25 transition-colors duration-500">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/10 text-champagne border border-champagne/20">
                <Network size={22} strokeWidth={1.75} />
              </span>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">Path One</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Back individual companies</h2>
              <ul className="mt-6 space-y-4 flex-1">
                {[
                  "Join our private investor network — invitation and verification based",
                  "Review curated opportunities privately, with full documentation",
                  "Invest directly in the companies you choose",
                ].map((point) => (
                  <li key={point} className="flex gap-3 text-sm sm:text-base text-gray-400 leading-relaxed">
                    <span className="mt-2.5 h-1.5 w-1.5 rotate-45 bg-champagne/60 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <a
                href="#join-network"
                data-testid="apply-join-network-scroll-button"
                className="group mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300"
              >
                APPLY TO JOIN THE NETWORK
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div data-testid="investor-path-firm" className="h-full flex flex-col rounded-3xl border border-champagne/20 bg-charcoal/60 p-8 sm:p-12 hover:border-champagne/40 transition-colors duration-500">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/10 text-champagne border border-champagne/20">
                <FileText size={22} strokeWidth={1.75} />
              </span>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">Path Two</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Invest in Anvaya Partners</h2>
              <ul className="mt-6 space-y-4 flex-1">
                {[
                  "Back the firm itself",
                  "Gain exposure to every company we invest in and build",
                  "Request our deck — our team follows up personally",
                ].map((point) => (
                  <li key={point} className="flex gap-3 text-sm sm:text-base text-gray-400 leading-relaxed">
                    <span className="mt-2.5 h-1.5 w-1.5 rotate-45 bg-champagne/60 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setDeckOpen(true)}
                data-testid="request-deck-button"
                className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-champagne/50 text-champagne font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagne hover:text-obsidian transition-colors duration-300"
              >
                REQUEST DECK
              </button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 rounded-2xl border border-white/5 bg-charcoal/40 px-6 py-4 text-[13px] text-gray-500 leading-relaxed" data-testid="no-pooling-note">
            Anvaya Partners does not manage or pool investors' money. Opportunities are shared only
            privately with eligible, verified investors, and every decision remains yours.
          </p>
        </Reveal>

        <InvestorFaqSection />

        <div id="join-network" className="mt-20 max-w-4xl scroll-mt-28">
          <Reveal>
            <Eyebrow>Network Application</Eyebrow>
            <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Apply to join the investor network
            </h2>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Every application is reviewed manually. Verified members receive privately shared
              opportunities — never public listings.
            </p>
          </Reveal>
          <div className="mt-8">
            <InvestorRegistrationForm />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {deckOpen && <RequestDeckModal onClose={() => setDeckOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
