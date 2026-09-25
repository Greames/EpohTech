import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, Lock, TrendingUp, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios, { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

export default function OpportunitiesPage() {
  const { user, loading, login } = useAuth();
  const [state, setState] = useState("loading");
  const [opps, setOpps] = useState([]);
  const [interestFor, setInterestFor] = useState(null);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`${API}/opportunities`)
      .then((r) => {
        setOpps(r.data.opportunities || []);
        setState("ready");
      })
      .catch((e) => setState(e.response?.status === 403 ? "denied" : "ready"));
  }, [user]);

  const express = async () => {
    setSending(true);
    try {
      await axios.post(`${API}/opportunities/${interestFor.venture_id}/interest`, { note });
      setOpps((list) => list.map((o) => (o.venture_id === interestFor.venture_id ? { ...o, my_interest: true } : o)));
      toast.success("Interest recorded — the studio team will reach out.");
      setInterestFor(null);
      setNote("");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Could not record interest");
    } finally {
      setSending(false);
    }
  };

  if (loading || (user && state === "loading")) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="opportunities-loading">
        <Loader2 size={28} className="animate-spin text-champagne" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-testid="opportunities-signin-prompt">
        <div className="text-center max-w-md">
          <Lock size={28} className="mx-auto text-champagne" />
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">Investor sign-in required</h1>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            Live venture opportunities are available to verified members of the investor network.
          </p>
          <button
            onClick={login}
            data-testid="opportunities-google-signin-button"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold px-8 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 gold-glow"
          >
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-testid="opportunities-verification-pending">
        <div className="text-center max-w-md">
          <Eyebrow className="justify-center">Verification</Eyebrow>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">Verification in progress</h1>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            Your investor registration (<span className="text-champagne">{user.email}</span>) is not verified yet.
            Once the studio approves it, opportunities will appear here.
          </p>
          <Link
            to="/investors"
            data-testid="opportunities-register-link"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-champagne/50 text-champagne font-bold px-8 py-4 text-sm hover:bg-champagne hover:text-obsidian transition-colors duration-300"
          >
            View my registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36 min-h-screen" data-testid="opportunities-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Investor Portal</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Live</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">opportunities.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            Opportunities shared privately with verified members of the Anvaya Partners investor
            network. Structured documentation, visible progress, direct line to the team.
          </p>
        </Reveal>

        {opps.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-16 rounded-3xl border border-white/5 bg-charcoal/50 p-12 text-center" data-testid="opportunities-empty">
              <TrendingUp size={32} className="mx-auto text-champagne" />
              <h2 className="mt-5 text-xl font-bold text-white">New opportunities are in validation</h2>
              <p className="mt-3 text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                The studio only lists ventures that clear market research and founder review.
                You will be notified the moment one opens.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {opps.map((o, i) => (
              <Reveal key={o.venture_id} delay={(i % 2) * 0.1}>
                <div
                  data-testid={`opportunity-card-${o.venture_id}`}
                  className="h-full rounded-3xl border border-white/5 bg-charcoal/50 p-8 sm:p-10 hover:border-champagne/25 transition-colors duration-500"
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-full border border-champagne/30 bg-champagne/5 text-champagne px-3.5 py-1.5">
                      {o.stage}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-full border border-white/10 text-gray-400 px-3.5 py-1.5">
                      {o.industry}
                    </span>
                  </div>
                  <h2 className="mt-5 text-2xl font-extrabold text-white tracking-tight">{o.name}</h2>
                  <p className="mt-3 text-sm text-gray-400 leading-relaxed">{o.description}</p>
                  <div className="mt-7 grid grid-cols-2 gap-5">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">Capital Requirement</p>
                      <p className="mt-1 text-sm font-bold text-champagne">{o.capital_required || "On request"}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">Founder</p>
                      <p className="mt-1 text-sm font-bold text-white">{o.founder_name || "Studio-led"}</p>
                    </div>
                  </div>
                  {o.milestones_total > 0 && (
                    <div className="mt-7">
                      <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
                        <span>Build Progress</span>
                        <span>{o.milestones_done}/{o.milestones_total} milestones</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-champagne transition-all duration-700"
                          style={{ width: `${Math.round((o.milestones_done / o.milestones_total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {(o.documents || []).length > 0 && (
                    <div className="mt-7 space-y-2" data-testid={`opportunity-documents-${o.venture_id}`}>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">Documents</p>
                      {o.documents.map((d) => (
                        <a
                          key={d.document_id}
                          href={`${API}/documents/${d.document_id}/download`}
                          data-testid={`opportunity-doc-${d.document_id}`}
                          className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-obsidian/60 px-4 py-2.5 text-xs text-gray-300 hover:border-champagne/40 hover:text-white transition-colors duration-300"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E6C280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          <span className="truncate">{d.filename}</span>
                          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600 shrink-0">
                            {d.kind} · {(d.size / 1024).toFixed(0)} KB
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => !o.my_interest && setInterestFor(o)}
                    disabled={o.my_interest}
                    data-testid={`opportunity-interest-${o.venture_id}`}
                    className={`mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-wide px-8 py-3.5 text-sm transition-colors duration-300 ${
                      o.my_interest
                        ? "border border-growth/40 text-emerald-300 cursor-default"
                        : "bg-champagne text-obsidian hover:bg-champagneBright gold-glow"
                    }`}
                  >
                    {o.my_interest ? (<><CheckCircle2 size={15} /> INTEREST RECORDED</>) : "EXPRESS INTEREST"}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <p className="mt-12 font-mono text-[10px] text-gray-600 leading-relaxed max-w-2xl" data-testid="opportunities-disclaimer">
          Opportunities involve risk. Nothing here is a promise of returns, exits or allocation.
          Documentation is shared after a conversation with the studio.
        </p>
      </div>

      <AnimatePresence>
        {interestFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-obsidian/80 backdrop-blur-md sm:p-6"
            onClick={() => setInterestFor(null)}
            data-testid="interest-modal-overlay"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              data-testid="interest-modal"
              className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-white/10 bg-charcoal p-7 sm:p-10"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-extrabold text-white tracking-tight">Express interest</h3>
                <button onClick={() => setInterestFor(null)} data-testid="interest-modal-close" className="rounded-full border border-white/10 p-2 text-gray-400 hover:text-white transition-colors duration-300" aria-label="Close">
                  <X size={16} />
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                <span className="text-champagne font-semibold">{interestFor.name}</span> — the studio team will
                contact you with full documentation and next steps.
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Optional note — ticket size, questions, strategic value you bring…"
                data-testid="interest-note-input"
                className="mt-5 w-full rounded-xl border border-white/10 bg-obsidian/70 px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/60 transition-colors duration-300 resize-none"
              />
              <button
                onClick={express}
                disabled={sending}
                data-testid="interest-submit-button"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300 disabled:opacity-60"
              >
                {sending ? <Loader2 size={15} className="animate-spin" /> : null}
                {sending ? "RECORDING…" : "CONFIRM INTEREST"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
