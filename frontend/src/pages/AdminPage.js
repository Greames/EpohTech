import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, RefreshCw, Plus, Pencil, Trash2, X, Download, Eye, EyeOff, LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";
import axios, { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Eyebrow } from "@/components/Reveal";

const FOUNDER_STATUSES = ["submitted", "screening", "shortlisted", "discovery", "validation", "founder_review", "approved", "rejected"];
const INVESTOR_STATUSES = ["verification_pending", "verified", "approved", "rejected"];
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "founders", label: "Founder Applications" },
  { id: "investors", label: "Investor Registrations" },
  { id: "insights", label: "Insights" },
  { id: "messages", label: "Messages" },
];

const statusCls = (s) =>
  s === "approved" || s === "verified"
    ? "border-growth/40 text-emerald-300 bg-growth/5"
    : s === "rejected"
      ? "border-red-500/40 text-red-300 bg-red-500/5"
      : "border-champagne/30 text-champagne bg-champagne/5";

const selectCls =
  "rounded-full border border-white/10 bg-obsidian px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-300 focus:outline-none focus:border-champagne/50";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-obsidian/70 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/60 transition-colors duration-300";

function StatusSelect({ value, options, onChange, testId }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} data-testid={testId} className={selectCls}>
      {options.map((s) => (
        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
      ))}
    </select>
  );
}

const KV = ({ k, v }) =>
  v ? (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">{k}</p>
      <p className="text-sm text-gray-300 mt-0.5 break-words">{v}</p>
    </div>
  ) : null;

const EMPTY_ARTICLE = { title: "", category: "Founder Stories", read: "4 min", excerpt: "", body: "", published: true };

export default function AdminPage() {
  const { user, loading, login } = useAuth();
  const [denied, setDenied] = useState(false);
  const [tab, setTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [founders, setFounders] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [insights, setInsights] = useState([]);
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState(null);

  const loadAll = useCallback(async () => {
    setBusy(true);
    try {
      const [ov, fa, ir, cm, ins] = await Promise.all([
        axios.get(`${API}/admin/overview`),
        axios.get(`${API}/admin/founder-applications`),
        axios.get(`${API}/admin/investor-registrations`),
        axios.get(`${API}/admin/contacts`),
        axios.get(`${API}/admin/insights`),
      ]);
      setOverview(ov.data);
      setFounders(fa.data.applications || []);
      setInvestors(ir.data.registrations || []);
      setMessages(cm.data.messages || []);
      setInsights(ins.data.insights || []);
      setDenied(false);
    } catch (e) {
      if (e.response?.status === 403) setDenied(true);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadAll();
  }, [user, loadAll]);

  const patchStatus = async (kind, id, status) => {
    try {
      await axios.patch(`${API}/admin/${kind}/${id}`, { status });
      if (kind === "founder-applications") {
        setFounders((list) => list.map((a) => (a.application_id === id ? { ...a, status } : a)));
      } else {
        setInvestors((list) => list.map((r) => (r.registration_id === id ? { ...r, status } : r)));
      }
      toast.success(`Status updated to ${status.replace(/_/g, " ")}`);
    } catch {
      toast.error("Could not update status");
    }
  };

  const saveInsight = async () => {
    if (!editor.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      if (editor.insight_id) {
        const r = await axios.put(`${API}/admin/insights/${editor.insight_id}`, editor);
        setInsights((list) => list.map((a) => (a.insight_id === editor.insight_id ? r.data : a)));
      } else {
        const r = await axios.post(`${API}/admin/insights`, editor);
        setInsights((list) => [r.data, ...list]);
      }
      setEditor(null);
      toast.success("Article saved");
    } catch {
      toast.error("Could not save article");
    }
  };

  const removeInsight = async (id) => {
    try {
      await axios.delete(`${API}/admin/insights/${id}`);
      setInsights((list) => list.filter((a) => a.insight_id !== id));
      toast.success("Article deleted");
    } catch {
      toast.error("Could not delete article");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="admin-loading">
        <Loader2 size={28} className="animate-spin text-champagne" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-testid="admin-signin-prompt">
        <div className="text-center max-w-md">
          <Eyebrow>Restricted</Eyebrow>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">Admin sign-in required</h1>
          <p className="mt-4 text-gray-400 text-sm">This dashboard is reserved for the Second Salary Capital team.</p>
          <button
            onClick={login}
            data-testid="admin-google-signin-button"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold px-8 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 gold-glow"
          >
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  if (denied) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-testid="admin-access-denied">
        <div className="text-center max-w-md">
          <Eyebrow>Access Denied</Eyebrow>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">Not an admin account</h1>
          <p className="mt-4 text-gray-400 text-sm">
            Signed in as <span className="text-champagne">{user.email}</span>. This account is not on the admin list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 md:pt-36 min-h-screen" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <Eyebrow>Studio Console</Eyebrow>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <LayoutDashboard size={26} className="text-champagne" /> Admin Dashboard
            </h1>
          </div>
          <button
            onClick={loadAll}
            data-testid="admin-refresh-button"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-medium text-gray-300 hover:border-champagne/50 hover:text-white transition-colors duration-300"
          >
            <RefreshCw size={14} className={busy ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" data-testid="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-testid={`admin-tab-${t.id}`}
              className={`rounded-full px-5 py-2.5 text-xs font-mono uppercase tracking-[0.15em] border transition-colors duration-300 ${
                tab === t.id
                  ? "bg-champagne text-obsidian border-champagne font-bold"
                  : "border-white/10 text-gray-400 hover:border-champagne/40 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && overview && (
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4" data-testid="admin-overview">
            {[
              ["Founder Applications", overview.founder_applications],
              ["Investor Registrations", overview.investor_registrations],
              ["Messages", overview.contact_messages],
              ["Insight Articles", overview.insights],
              ["Registered Users", overview.users],
              ["Files Stored", overview.files],
            ].map(([label, val]) => (
              <div key={label} data-testid={`admin-stat-${label.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-2xl border border-white/5 bg-charcoal/60 p-6">
                <p className="font-mono font-bold text-3xl text-champagne tabular-nums">{val}</p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500">{label}</p>
              </div>
            ))}
            <div className="col-span-full rounded-2xl border border-white/5 bg-charcoal/40 p-6 flex flex-wrap gap-x-10 gap-y-3">
              <span className="text-sm text-gray-400"><span className="text-champagne font-bold">80+</span> Investors Onboarded</span>
              <span className="text-sm text-gray-400"><span className="text-champagne font-bold">2+</span> Startups Funded</span>
              <span className="text-sm text-gray-400"><span className="text-champagne font-bold">₹10L–₹10Cr</span> Investment Opportunity Range</span>
            </div>
          </div>
        )}

        {tab === "founders" && (
          <div className="mt-10 space-y-5" data-testid="admin-founder-list">
            {founders.length === 0 && <p className="text-gray-500 text-sm">No founder applications yet.</p>}
            {founders.map((a) => (
              <div key={a.application_id} data-testid={`admin-founder-${a.application_id}`} className="rounded-3xl border border-white/5 bg-charcoal/50 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{a.name}</h3>
                      <span className={`font-mono text-[10px] uppercase tracking-[0.15em] rounded-full border px-3 py-1 ${statusCls(a.status)}`}>
                        {a.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-gray-600 mt-1.5">
                      {a.application_id} · {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {a.deck_file_id && (
                      <a
                        href={`${API}/admin/files/${a.deck_file_id}/download`}
                        data-testid={`admin-founder-deck-${a.application_id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-epoh/40 text-purple-200 px-4 py-1.5 text-[11px] font-medium hover:bg-epoh/10 transition-colors duration-300"
                      >
                        <Download size={13} /> {a.deck_filename || "Deck"}
                      </a>
                    )}
                    <StatusSelect
                      value={a.status}
                      options={FOUNDER_STATUSES}
                      onChange={(s) => patchStatus("founder-applications", a.application_id, s)}
                      testId={`admin-founder-status-${a.application_id}`}
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-300 leading-relaxed">{a.idea}</p>
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <KV k="Email" v={a.email} />
                  <KV k="Phone" v={a.phone} />
                  <KV k="Location" v={a.location} />
                  <KV k="Industry" v={a.industry} />
                  <KV k="Capital Required" v={a.capital_required} />
                  <KV k="Full-Time" v={a.full_time} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "investors" && (
          <div className="mt-10 space-y-5" data-testid="admin-investor-list">
            {investors.length === 0 && <p className="text-gray-500 text-sm">No investor registrations yet.</p>}
            {investors.map((r) => (
              <div key={r.registration_id} data-testid={`admin-investor-${r.registration_id}`} className="rounded-3xl border border-white/5 bg-charcoal/50 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{r.name}</h3>
                      <span className={`font-mono text-[10px] uppercase tracking-[0.15em] rounded-full border px-3 py-1 ${statusCls(r.status)}`}>
                        {r.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-gray-600 mt-1.5">
                      {r.registration_id} · {r.created_at ? new Date(r.created_at).toLocaleString() : ""}
                    </p>
                  </div>
                  <StatusSelect
                    value={r.status}
                    options={INVESTOR_STATUSES}
                    onChange={(s) => patchStatus("investor-registrations", r.registration_id, s)}
                    testId={`admin-investor-status-${r.registration_id}`}
                  />
                </div>
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <KV k="Email" v={r.email} />
                  <KV k="Company" v={r.company} />
                  <KV k="Range" v={r.investment_range} />
                  <KV k="Stage" v={r.investment_stage} />
                  <KV k="Sectors" v={r.preferred_sectors} />
                  <KV k="Experience" v={r.investment_experience} />
                </div>
                {r.notes && <p className="mt-4 text-sm text-gray-400 leading-relaxed">{r.notes}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === "insights" && (
          <div className="mt-10" data-testid="admin-insights-list">
            <button
              onClick={() => setEditor({ ...EMPTY_ARTICLE })}
              data-testid="admin-new-article-button"
              className="inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold px-6 py-3 text-xs tracking-wide hover:bg-champagneBright transition-colors duration-300"
            >
              <Plus size={14} /> NEW ARTICLE
            </button>
            <div className="mt-6 space-y-4">
              {insights.map((a) => (
                <div key={a.insight_id} data-testid={`admin-insight-${a.insight_id}`} className="rounded-2xl border border-white/5 bg-charcoal/50 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-bold text-white truncate">{a.title}</h3>
                      <span className={`font-mono text-[9px] uppercase tracking-[0.15em] rounded-full border px-2.5 py-0.5 ${a.published ? "border-growth/40 text-emerald-300" : "border-white/15 text-gray-500"}`}>
                        {a.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-gray-600 mt-1">{a.category} · {a.read} · /{a.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const r = await axios.put(`${API}/admin/insights/${a.insight_id}`, { ...a, published: !a.published });
                          setInsights((list) => list.map((x) => (x.insight_id === a.insight_id ? r.data : x)));
                          toast.success(r.data.published ? "Published" : "Unpublished");
                        } catch {
                          toast.error("Could not update");
                        }
                      }}
                      data-testid={`admin-insight-toggle-${a.insight_id}`}
                      className="rounded-full border border-white/10 p-2.5 text-gray-400 hover:text-champagne hover:border-champagne/40 transition-colors duration-300"
                      aria-label="Toggle publish"
                    >
                      {a.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      onClick={() => setEditor({ ...a })}
                      data-testid={`admin-insight-edit-${a.insight_id}`}
                      className="rounded-full border border-white/10 p-2.5 text-gray-400 hover:text-champagne hover:border-champagne/40 transition-colors duration-300"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => removeInsight(a.insight_id)}
                      data-testid={`admin-insight-delete-${a.insight_id}`}
                      className="rounded-full border border-white/10 p-2.5 text-gray-400 hover:text-red-400 hover:border-red-500/40 transition-colors duration-300"
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "messages" && (
          <div className="mt-10 space-y-4" data-testid="admin-messages-list">
            {messages.length === 0 && <p className="text-gray-500 text-sm">No messages yet.</p>}
            {messages.map((m) => (
              <div key={m.message_id} data-testid={`admin-message-${m.message_id}`} className="rounded-2xl border border-white/5 bg-charcoal/50 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-white">{m.name}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-champagne">{m.topic}</span>
                </div>
                <p className="font-mono text-[10px] text-gray-600 mt-1">
                  {m.email} · {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
                </p>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {editor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-obsidian/80 backdrop-blur-md sm:p-6"
            onClick={() => setEditor(null)}
            data-testid="insight-editor-overlay"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              data-testid="insight-editor-modal"
              className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/10 bg-charcoal p-7 sm:p-10"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  {editor.insight_id ? "Edit Article" : "New Article"}
                </h3>
                <button onClick={() => setEditor(null)} data-testid="insight-editor-close" className="rounded-full border border-white/10 p-2 text-gray-400 hover:text-white transition-colors duration-300" aria-label="Close">
                  <X size={16} />
                </button>
              </div>
              <div className="mt-6 space-y-4">
                <input value={editor.title} onChange={(e) => setEditor((s) => ({ ...s, title: e.target.value }))} placeholder="Title" data-testid="insight-editor-title" className={inputCls} />
                <div className="grid grid-cols-2 gap-4">
                  <input value={editor.category} onChange={(e) => setEditor((s) => ({ ...s, category: e.target.value }))} placeholder="Category" data-testid="insight-editor-category" className={inputCls} />
                  <input value={editor.read} onChange={(e) => setEditor((s) => ({ ...s, read: e.target.value }))} placeholder="Read time (e.g. 4 min)" data-testid="insight-editor-read" className={inputCls} />
                </div>
                <textarea value={editor.excerpt} onChange={(e) => setEditor((s) => ({ ...s, excerpt: e.target.value }))} placeholder="Excerpt — one or two sentences shown on the card" rows={2} data-testid="insight-editor-excerpt" className={`${inputCls} resize-none`} />
                <textarea value={editor.body} onChange={(e) => setEditor((s) => ({ ...s, body: e.target.value }))} placeholder="Full article body" rows={8} data-testid="insight-editor-body" className={`${inputCls} resize-none`} />
                <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={editor.published} onChange={(e) => setEditor((s) => ({ ...s, published: e.target.checked }))} data-testid="insight-editor-published" className="h-4 w-4 accent-[#E6C280]" />
                  Publish immediately
                </label>
                <button
                  onClick={saveInsight}
                  data-testid="insight-editor-save"
                  className="w-full rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300"
                >
                  SAVE ARTICLE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
