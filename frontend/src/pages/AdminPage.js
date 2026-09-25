import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, RefreshCw, Plus, Pencil, Trash2, X, Download, Eye, EyeOff, LayoutDashboard,
  Building2, Sparkles, CalendarClock, Globe, FileText, ListTodo, BarChart3,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";
import axios, { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Eyebrow } from "@/components/Reveal";

const FOUNDER_STATUSES = ["submitted", "screening", "shortlisted", "discovery", "validation", "founder_review", "approved", "rejected"];
const INVESTOR_STATUSES = ["verification_pending", "verified", "approved", "rejected"];
const VENTURE_STAGES = ["Validation", "Build", "Launch", "Traction", "Scale"];
const VENTURE_STATUSES = ["active", "paused", "exited"];
const PARTY_TYPES = ["founder", "ssc", "investor", "other"];
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "ventures", label: "Ventures" },
  { id: "founders", label: "Founder Applications" },
  { id: "investors", label: "Investor Registrations" },
  { id: "insights", label: "Insights" },
  { id: "messages", label: "Messages" },
];
const EMPTY_VENTURE = {
  name: "", industry: "", stage: "Validation", description: "",
  capital_required: "", founder_name: "", founder_email: "", status: "active", visible_to_investors: false,
};
const DOC_KINDS = ["deck", "financial", "document"];

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
  const [ventures, setVentures] = useState([]);
  const [interests, setInterests] = useState([]);
  const [ventureEditor, setVentureEditor] = useState(null);
  const [digest, setDigest] = useState(null);
  const [digestBusy, setDigestBusy] = useState(false);
  const [milestoneDrafts, setMilestoneDrafts] = useState({});
  const [ownershipDrafts, setOwnershipDrafts] = useState({});
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState(null);

  const loadAll = useCallback(async () => {
    setBusy(true);
    try {
      const [ov, fa, ir, cm, ins, ve, ints] = await Promise.all([
        axios.get(`${API}/admin/overview`),
        axios.get(`${API}/admin/founder-applications`),
        axios.get(`${API}/admin/investor-registrations`),
        axios.get(`${API}/admin/contacts`),
        axios.get(`${API}/admin/insights`),
        axios.get(`${API}/admin/ventures`),
        axios.get(`${API}/admin/interests`),
      ]);
      setOverview(ov.data);
      setFounders(fa.data.applications || []);
      setInvestors(ir.data.registrations || []);
      setMessages(cm.data.messages || []);
      setInsights(ins.data.insights || []);
      setVentures(ve.data.ventures || []);
      setInterests(ints.data.interests || []);
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

  const saveVenture = async () => {
    if (!ventureEditor.name.trim()) {
      toast.error("Venture name is required");
      return;
    }
    try {
      if (ventureEditor.venture_id) {
        await axios.put(`${API}/admin/ventures/${ventureEditor.venture_id}`, ventureEditor);
        toast.success("Venture updated");
      } else {
        await axios.post(`${API}/admin/ventures`, ventureEditor);
        toast.success("Venture created");
      }
      setVentureEditor(null);
      loadAll();
    } catch {
      toast.error("Could not save venture");
    }
  };

  const removeVenture = async (id) => {
    try {
      await axios.delete(`${API}/admin/ventures/${id}`);
      setVentures((list) => list.filter((v) => v.venture_id !== id));
      toast.success("Venture deleted");
    } catch {
      toast.error("Could not delete venture");
    }
  };

  const addMilestone = async (ventureId) => {
    const draft = milestoneDrafts[ventureId] || {};
    if (!draft.title?.trim()) {
      toast.error("Milestone title is required");
      return;
    }
    try {
      await axios.post(`${API}/admin/ventures/${ventureId}/milestones`, {
        title: draft.title, due_date: draft.due_date || "", done: false,
      });
      setMilestoneDrafts((d) => ({ ...d, [ventureId]: {} }));
      loadAll();
    } catch {
      toast.error("Could not add milestone");
    }
  };

  const toggleMilestone = async (m) => {
    try {
      await axios.patch(`${API}/admin/milestones/${m.milestone_id}`, {
        title: m.title, due_date: m.due_date || "", done: !m.done,
      });
      loadAll();
    } catch {
      toast.error("Could not update milestone");
    }
  };

  const removeMilestone = async (id) => {
    try {
      await axios.delete(`${API}/admin/milestones/${id}`);
      loadAll();
    } catch {
      toast.error("Could not delete milestone");
    }
  };

  const addOwnership = async (ventureId) => {
    const draft = ownershipDrafts[ventureId] || {};
    if (!draft.party_name?.trim() || !draft.percentage) {
      toast.error("Party name and percentage are required");
      return;
    }
    try {
      await axios.post(`${API}/admin/ventures/${ventureId}/ownership`, {
        party_name: draft.party_name,
        party_type: draft.party_type || "founder",
        percentage: parseFloat(draft.percentage),
      });
      setOwnershipDrafts((d) => ({ ...d, [ventureId]: {} }));
      loadAll();
    } catch {
      toast.error("Could not add ownership record");
    }
  };

  const removeOwnership = async (id) => {
    try {
      await axios.delete(`${API}/admin/ownership/${id}`);
      loadAll();
    } catch {
      toast.error("Could not delete record");
    }
  };

  const sendDigest = async () => {
    setDigestBusy(true);
    try {
      const r = await axios.post(`${API}/admin/jarvis/digest`);
      setDigest(r.data.preview);
      toast.success("JARVIS digest sent to the team inbox");
    } catch {
      toast.error("Could not generate digest");
    } finally {
      setDigestBusy(false);
    }
  };

  const [docDrafts, setDocDrafts] = useState({});
  const [kpiDrafts, setKpiDrafts] = useState({});
  const [taskDrafts, setTaskDrafts] = useState({});

  const uploadVentureDoc = async (ventureId, file) => {
    if (!file) return;
    const kind = (docDrafts[ventureId] || {}).kind || "document";
    try {
      const fd = new FormData();
      fd.append("file", file);
      await axios.post(`${API}/admin/ventures/${ventureId}/documents?kind=${kind}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Document uploaded");
      loadAll();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Upload failed");
    }
  };

  const removeDocument = async (id) => {
    try {
      await axios.delete(`${API}/admin/documents/${id}`);
      toast.success("Document removed");
      loadAll();
    } catch {
      toast.error("Could not remove document");
    }
  };

  const addKpi = async (ventureId) => {
    const draft = kpiDrafts[ventureId] || {};
    if (!draft.month || draft.revenue === "" || draft.revenue === undefined) {
      toast.error("Month and revenue are required");
      return;
    }
    try {
      await axios.post(`${API}/admin/ventures/${ventureId}/kpis`, {
        month: draft.month,
        revenue: parseFloat(draft.revenue) || 0,
        growth: draft.growth === "" || draft.growth === undefined ? null : parseFloat(draft.growth),
      });
      setKpiDrafts((d) => ({ ...d, [ventureId]: {} }));
      loadAll();
    } catch {
      toast.error("Could not add KPI");
    }
  };

  const removeKpi = async (id) => {
    try {
      await axios.delete(`${API}/admin/kpis/${id}`);
      loadAll();
    } catch {
      toast.error("Could not delete KPI");
    }
  };

  const addTask = async (ventureId) => {
    const draft = taskDrafts[ventureId] || {};
    if (!draft.title?.trim()) {
      toast.error("Task title is required");
      return;
    }
    try {
      await axios.post(`${API}/admin/ventures/${ventureId}/tasks`, {
        title: draft.title, due_date: draft.due_date || "", done: false,
      });
      setTaskDrafts((d) => ({ ...d, [ventureId]: {} }));
      loadAll();
    } catch {
      toast.error("Could not add task");
    }
  };

  const toggleTaskAdmin = async (t) => {
    try {
      await axios.patch(`${API}/admin/tasks/${t.task_id}`, {
        title: t.title, due_date: t.due_date || "", done: !t.done,
      });
      loadAll();
    } catch {
      toast.error("Could not update task");
    }
  };

  const removeTask = async (id) => {
    try {
      await axios.delete(`${API}/admin/tasks/${id}`);
      loadAll();
    } catch {
      toast.error("Could not delete task");
    }
  };

  const portfolioSeries = Object.values(
    ventures
      .flatMap((v) => (v.kpis || []))
      .reduce((acc, k) => {
        acc[k.month] = acc[k.month] || { month: k.month, revenue: 0 };
        acc[k.month].revenue += Number(k.revenue) || 0;
        return acc;
      }, {})
  ).sort((a, b) => a.month.localeCompare(b.month));

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
          <p className="mt-4 text-gray-400 text-sm">This dashboard is reserved for the Anvaya Partners team.</p>
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

        {tab === "overview" && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="admin-digest-section">
            <div className="rounded-3xl border border-champagne/20 bg-charcoal/60 p-7">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <Sparkles size={18} className="text-champagne" /> JARVIS Daily Digest
                </h3>
                <button
                  onClick={sendDigest}
                  disabled={digestBusy}
                  data-testid="admin-send-digest-button"
                  className="inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold px-5 py-2.5 text-xs hover:bg-champagneBright transition-colors duration-300 disabled:opacity-60"
                >
                  {digestBusy ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  {digestBusy ? "GENERATING…" : "SEND NOW"}
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                AI summary of the last 24 hours — applications, investors, messages, interest and overdue
                milestones. Auto-emailed to the team every morning; send one manually anytime.
              </p>
              {digest && (
                <pre
                  className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-obsidian/70 p-5 text-xs text-gray-300 leading-relaxed"
                  data-testid="admin-digest-preview"
                >
                  {digest}
                </pre>
              )}
            </div>
            <div className="rounded-3xl border border-white/5 bg-charcoal/60 p-7" data-testid="admin-interests-card">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <Globe size={18} className="text-champagne" /> Investor Interest
              </h3>
              {interests.length === 0 ? (
                <p className="mt-3 text-xs text-gray-500 leading-relaxed">No interest expressed yet. Verified investors can express interest from the Opportunities page.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {interests.slice(0, 6).map((it) => (
                    <li key={it.interest_id} data-testid={`admin-interest-${it.interest_id}`} className="rounded-xl border border-white/5 bg-obsidian/60 px-4 py-3">
                      <p className="text-sm text-white font-semibold">
                        {it.investor_name || it.investor_email} <span className="text-champagne font-normal">→ {it.venture_name}</span>
                      </p>
                      {it.note && <p className="mt-1 text-xs text-gray-400">{it.note}</p>}
                      <p className="mt-1 font-mono text-[9px] text-gray-600">
                        {it.investor_email} · {it.created_at ? new Date(it.created_at).toLocaleString() : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {tab === "overview" && (
          <div className="mt-6 rounded-3xl border border-white/5 bg-charcoal/60 p-7" data-testid="admin-portfolio-chart">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <BarChart3 size={18} className="text-champagne" /> Portfolio Revenue
            </h3>
            {portfolioSeries.length === 0 ? (
              <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                Add monthly KPIs on the Ventures tab to see the portfolio revenue curve here.
              </p>
            ) : (
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioSeries} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill: "#6B7280", fontSize: 10, fontFamily: "JetBrains Mono" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${v >= 100000 ? `${(v / 100000).toFixed(1)}L` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`}
                    />
                    <Tooltip
                      contentStyle={{ background: "#13151A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: "#E6C280", fontFamily: "JetBrains Mono" }}
                      formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#E6C280" strokeWidth={2.5} dot={{ r: 4, fill: "#E6C280", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#F5D796" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
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

        {tab === "ventures" && (
          <div className="mt-10" data-testid="admin-ventures-list">
            <button
              onClick={() => setVentureEditor({ ...EMPTY_VENTURE })}
              data-testid="admin-new-venture-button"
              className="inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold px-6 py-3 text-xs tracking-wide hover:bg-champagneBright transition-colors duration-300"
            >
              <Plus size={14} /> NEW VENTURE
            </button>
            <div className="mt-6 space-y-6">
              {ventures.length === 0 && (
                <p className="text-gray-500 text-sm">No ventures yet. Create the first company in the portfolio.</p>
              )}
              {ventures.map((v) => {
                const totalPct = (v.ownership || []).reduce((s, o) => s + (o.percentage || 0), 0);
                const md = milestoneDrafts[v.venture_id] || {};
                const od = ownershipDrafts[v.venture_id] || {};
                return (
                  <div key={v.venture_id} data-testid={`admin-venture-${v.venture_id}`} className="rounded-3xl border border-white/5 bg-charcoal/50 p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                            <Building2 size={19} className="text-champagne" /> {v.name}
                          </h3>
                          <span className="font-mono text-[9px] uppercase tracking-[0.15em] rounded-full border border-champagne/30 text-champagne px-2.5 py-0.5">{v.stage}</span>
                          {v.industry && <span className="font-mono text-[9px] uppercase tracking-[0.15em] rounded-full border border-white/10 text-gray-400 px-2.5 py-0.5">{v.industry}</span>}
                          <span className={`font-mono text-[9px] uppercase tracking-[0.15em] rounded-full border px-2.5 py-0.5 ${statusCls(v.status)}`}>{v.status}</span>
                          {v.visible_to_investors && (
                            <span className="font-mono text-[9px] uppercase tracking-[0.15em] rounded-full border border-epoh/40 text-purple-300 px-2.5 py-0.5 flex items-center gap-1">
                              <Globe size={10} /> Investor-visible
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[10px] text-gray-600 mt-1.5">
                          {v.venture_id} · {v.capital_required || "capital TBD"} · Founder: {v.founder_name || "studio-led"} · {v.interests_count || 0} investor interest
                        </p>
                        {v.description && <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-2xl">{v.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setVentureEditor({ ...v })} data-testid={`admin-venture-edit-${v.venture_id}`} className="rounded-full border border-white/10 p-2.5 text-gray-400 hover:text-champagne hover:border-champagne/40 transition-colors duration-300" aria-label="Edit venture">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => removeVenture(v.venture_id)} data-testid={`admin-venture-delete-${v.venture_id}`} className="rounded-full border border-white/10 p-2.5 text-gray-400 hover:text-red-400 hover:border-red-500/40 transition-colors duration-300" aria-label="Delete venture">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6" data-testid={`admin-venture-kpis-${v.venture_id}`}>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 flex items-center gap-2">
                        <BarChart3 size={12} className="text-champagne" /> Portfolio KPIs
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {(v.kpis || []).map((k) => (
                          <span key={k.kpi_id} data-testid={`admin-kpi-${k.kpi_id}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-obsidian/60 px-4 py-2 text-xs">
                            <span className="font-mono text-gray-500">{k.month}</span>
                            <span className="text-champagne font-bold">₹{Number(k.revenue).toLocaleString("en-IN")}</span>
                            {k.growth !== null && k.growth !== undefined && (
                              <span className={k.growth >= 0 ? "text-emerald-400" : "text-red-400"}>{k.growth >= 0 ? "+" : ""}{k.growth}%</span>
                            )}
                            <button onClick={() => removeKpi(k.kpi_id)} data-testid={`admin-kpi-delete-${k.kpi_id}`} className="text-gray-600 hover:text-red-400 transition-colors duration-300" aria-label="Delete KPI">
                              <Trash2 size={11} />
                            </button>
                          </span>
                        ))}
                        <input
                          value={(kpiDrafts[v.venture_id] || {}).month || ""}
                          onChange={(e) => setKpiDrafts((d) => ({ ...d, [v.venture_id]: { ...(d[v.venture_id] || {}), month: e.target.value } }))}
                          placeholder="2026-09"
                          data-testid={`admin-kpi-month-${v.venture_id}`}
                          className="w-24 rounded-xl border border-white/10 bg-obsidian/70 px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/50"
                        />
                        <input
                          type="number"
                          value={(kpiDrafts[v.venture_id] || {}).revenue || ""}
                          onChange={(e) => setKpiDrafts((d) => ({ ...d, [v.venture_id]: { ...(d[v.venture_id] || {}), revenue: e.target.value } }))}
                          placeholder="Revenue ₹"
                          data-testid={`admin-kpi-revenue-${v.venture_id}`}
                          className="w-28 rounded-xl border border-white/10 bg-obsidian/70 px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/50"
                        />
                        <input
                          type="number" step="0.1"
                          value={(kpiDrafts[v.venture_id] || {}).growth || ""}
                          onChange={(e) => setKpiDrafts((d) => ({ ...d, [v.venture_id]: { ...(d[v.venture_id] || {}), growth: e.target.value } }))}
                          placeholder="Growth %"
                          data-testid={`admin-kpi-growth-${v.venture_id}`}
                          className="w-24 rounded-xl border border-white/10 bg-obsidian/70 px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/50"
                        />
                        <button onClick={() => addKpi(v.venture_id)} data-testid={`admin-kpi-add-${v.venture_id}`} className="rounded-xl bg-champagne/15 border border-champagne/30 text-champagne px-3.5 py-2 hover:bg-champagne hover:text-obsidian transition-colors duration-300" aria-label="Add KPI">
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div data-testid={`admin-venture-milestones-${v.venture_id}`}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 flex items-center gap-2">
                          <CalendarClock size={12} className="text-champagne" /> Milestones ({(v.milestones || []).filter((m) => m.done).length}/{(v.milestones || []).length})
                        </p>
                        <ul className="mt-3 space-y-2">
                          {(v.milestones || []).map((m) => {
                            const overdue = !m.done && m.due_date && m.due_date < new Date().toISOString().slice(0, 10);
                            return (
                              <li key={m.milestone_id} data-testid={`admin-milestone-${m.milestone_id}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-obsidian/60 px-4 py-2.5">
                                <input type="checkbox" checked={!!m.done} onChange={() => toggleMilestone(m)} data-testid={`admin-milestone-toggle-${m.milestone_id}`} className="h-4 w-4 accent-[#E6C280] cursor-pointer" />
                                <span className={`flex-1 text-sm ${m.done ? "text-gray-600 line-through" : overdue ? "text-red-300" : "text-gray-300"}`}>{m.title}</span>
                                {m.due_date && <span className={`font-mono text-[9px] ${overdue ? "text-red-400" : "text-gray-600"}`}>{m.due_date}{overdue ? " · overdue" : ""}</span>}
                                <button onClick={() => removeMilestone(m.milestone_id)} data-testid={`admin-milestone-delete-${m.milestone_id}`} className="text-gray-600 hover:text-red-400 transition-colors duration-300" aria-label="Delete milestone">
                                  <Trash2 size={13} />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="mt-3 flex gap-2">
                          <input
                            value={md.title || ""}
                            onChange={(e) => setMilestoneDrafts((d) => ({ ...d, [v.venture_id]: { ...md, title: e.target.value } }))}
                            placeholder="New milestone"
                            data-testid={`admin-milestone-input-${v.venture_id}`}
                            className="flex-1 rounded-xl border border-white/10 bg-obsidian/70 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/50"
                          />
                          <input
                            type="date"
                            value={md.due_date || ""}
                            onChange={(e) => setMilestoneDrafts((d) => ({ ...d, [v.venture_id]: { ...md, due_date: e.target.value } }))}
                            data-testid={`admin-milestone-date-${v.venture_id}`}
                            className="rounded-xl border border-white/10 bg-obsidian/70 px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-champagne/50 [color-scheme:dark]"
                          />
                          <button onClick={() => addMilestone(v.venture_id)} data-testid={`admin-milestone-add-${v.venture_id}`} className="rounded-xl bg-champagne/15 border border-champagne/30 text-champagne px-3.5 hover:bg-champagne hover:text-obsidian transition-colors duration-300" aria-label="Add milestone">
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>

                      <div data-testid={`admin-venture-captable-${v.venture_id}`}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">
                          Cap Table · <span className={totalPct === 100 ? "text-emerald-400" : "text-champagne"}>{totalPct}%</span> allocated
                        </p>
                        <ul className="mt-3 space-y-2">
                          {(v.ownership || []).map((o) => (
                            <li key={o.ownership_id} data-testid={`admin-ownership-${o.ownership_id}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-obsidian/60 px-4 py-2.5">
                              <span className="flex-1 text-sm text-gray-200">{o.party_name}</span>
                              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500">{o.party_type}</span>
                              <span className="font-mono text-sm font-bold text-champagne">{o.percentage}%</span>
                              <button onClick={() => removeOwnership(o.ownership_id)} data-testid={`admin-ownership-delete-${o.ownership_id}`} className="text-gray-600 hover:text-red-400 transition-colors duration-300" aria-label="Delete ownership">
                                <Trash2 size={13} />
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex gap-2">
                          <input
                            value={od.party_name || ""}
                            onChange={(e) => setOwnershipDrafts((d) => ({ ...d, [v.venture_id]: { ...od, party_name: e.target.value } }))}
                            placeholder="Party (e.g. Founder, SSC)"
                            data-testid={`admin-ownership-name-${v.venture_id}`}
                            className="flex-1 rounded-xl border border-white/10 bg-obsidian/70 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/50"
                          />
                          <select
                            value={od.party_type || "founder"}
                            onChange={(e) => setOwnershipDrafts((d) => ({ ...d, [v.venture_id]: { ...od, party_type: e.target.value } }))}
                            data-testid={`admin-ownership-type-${v.venture_id}`}
                            className="rounded-xl border border-white/10 bg-obsidian px-2.5 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-champagne/50"
                          >
                            {PARTY_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
                          </select>
                          <input
                            type="number" min="0" max="100" step="0.5"
                            value={od.percentage || ""}
                            onChange={(e) => setOwnershipDrafts((d) => ({ ...d, [v.venture_id]: { ...od, percentage: e.target.value } }))}
                            placeholder="%"
                            data-testid={`admin-ownership-pct-${v.venture_id}`}
                            className="w-20 rounded-xl border border-white/10 bg-obsidian/70 px-3 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/50"
                          />
                          <button onClick={() => addOwnership(v.venture_id)} data-testid={`admin-ownership-add-${v.venture_id}`} className="rounded-xl bg-champagne/15 border border-champagne/30 text-champagne px-3.5 hover:bg-champagne hover:text-obsidian transition-colors duration-300" aria-label="Add ownership">
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>

                      <div data-testid={`admin-venture-tasks-${v.venture_id}`}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 flex items-center gap-2">
                          <ListTodo size={12} className="text-champagne" /> Founder Tasks ({(v.tasks || []).filter((t) => t.done).length}/{(v.tasks || []).length})
                        </p>
                        <ul className="mt-3 space-y-2">
                          {(v.tasks || []).map((t) => {
                            const overdue = !t.done && t.due_date && t.due_date < new Date().toISOString().slice(0, 10);
                            return (
                              <li key={t.task_id} data-testid={`admin-task-${t.task_id}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-obsidian/60 px-4 py-2.5">
                                <input type="checkbox" checked={!!t.done} onChange={() => toggleTaskAdmin(t)} data-testid={`admin-task-toggle-${t.task_id}`} className="h-4 w-4 accent-[#E6C280] cursor-pointer" />
                                <span className={`flex-1 text-sm ${t.done ? "text-gray-600 line-through" : overdue ? "text-red-300" : "text-gray-300"}`}>{t.title}</span>
                                {t.due_date && <span className={`font-mono text-[9px] ${overdue ? "text-red-400" : "text-gray-600"}`}>{t.due_date}</span>}
                                <button onClick={() => removeTask(t.task_id)} data-testid={`admin-task-delete-${t.task_id}`} className="text-gray-600 hover:text-red-400 transition-colors duration-300" aria-label="Delete task">
                                  <Trash2 size={13} />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="mt-3 flex gap-2">
                          <input
                            value={(taskDrafts[v.venture_id] || {}).title || ""}
                            onChange={(e) => setTaskDrafts((d) => ({ ...d, [v.venture_id]: { ...(d[v.venture_id] || {}), title: e.target.value } }))}
                            placeholder="Assign a task to the founder"
                            data-testid={`admin-task-input-${v.venture_id}`}
                            className="flex-1 rounded-xl border border-white/10 bg-obsidian/70 px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/50"
                          />
                          <input
                            type="date"
                            value={(taskDrafts[v.venture_id] || {}).due_date || ""}
                            onChange={(e) => setTaskDrafts((d) => ({ ...d, [v.venture_id]: { ...(d[v.venture_id] || {}), due_date: e.target.value } }))}
                            data-testid={`admin-task-date-${v.venture_id}`}
                            className="rounded-xl border border-white/10 bg-obsidian/70 px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-champagne/50 [color-scheme:dark]"
                          />
                          <button onClick={() => addTask(v.venture_id)} data-testid={`admin-task-add-${v.venture_id}`} className="rounded-xl bg-champagne/15 border border-champagne/30 text-champagne px-3.5 hover:bg-champagne hover:text-obsidian transition-colors duration-300" aria-label="Add task">
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>

                      <div data-testid={`admin-venture-documents-${v.venture_id}`}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 flex items-center gap-2 flex-wrap">
                          <FileText size={12} className="text-champagne" /> Documents
                          {v.visible_to_investors
                            ? <span className="text-epoh normal-case tracking-normal">· shared with verified investors</span>
                            : <span className="text-gray-600 normal-case tracking-normal">· hidden until venture is investor-visible</span>}
                        </p>
                        <ul className="mt-3 space-y-2">
                          {(v.documents || []).map((d) => (
                            <li key={d.document_id} data-testid={`admin-document-${d.document_id}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-obsidian/60 px-4 py-2.5">
                              <FileText size={13} className="text-champagne shrink-0" />
                              <span className="flex-1 text-sm text-gray-300 truncate">{d.filename}</span>
                              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">{d.kind}</span>
                              <a href={`${API}/admin/documents/${d.document_id}/download`} data-testid={`admin-document-download-${d.document_id}`} className="text-gray-500 hover:text-champagne transition-colors duration-300" aria-label="Download document">
                                <Download size={13} />
                              </a>
                              <button onClick={() => removeDocument(d.document_id)} data-testid={`admin-document-delete-${d.document_id}`} className="text-gray-600 hover:text-red-400 transition-colors duration-300" aria-label="Delete document">
                                <Trash2 size={13} />
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex gap-2 items-center">
                          <select
                            value={(docDrafts[v.venture_id] || {}).kind || "document"}
                            onChange={(e) => setDocDrafts((d) => ({ ...d, [v.venture_id]: { kind: e.target.value } }))}
                            data-testid={`admin-document-kind-${v.venture_id}`}
                            className="rounded-xl border border-white/10 bg-obsidian px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-champagne/50"
                          >
                            {DOC_KINDS.map((k) => (<option key={k} value={k}>{k}</option>))}
                          </select>
                          <label
                            htmlFor={`doc-file-${v.venture_id}`}
                            data-testid={`admin-document-upload-${v.venture_id}`}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-obsidian/70 px-3.5 py-2.5 text-xs text-gray-500 hover:border-champagne/50 hover:text-gray-300 cursor-pointer transition-colors duration-300"
                          >
                            <FileText size={13} className="text-champagne" /> Upload deck / financial / doc
                          </label>
                          <input
                            id={`doc-file-${v.venture_id}`}
                            type="file"
                            accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.csv"
                            className="hidden"
                            data-testid={`admin-document-file-${v.venture_id}`}
                            onChange={(e) => {
                              uploadVentureDoc(v.venture_id, e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
        {ventureEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-obsidian/80 backdrop-blur-md sm:p-6"
            onClick={() => setVentureEditor(null)}
            data-testid="venture-editor-overlay"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              data-testid="venture-editor-modal"
              className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/10 bg-charcoal p-7 sm:p-10"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  {ventureEditor.venture_id ? "Edit Venture" : "New Venture"}
                </h3>
                <button onClick={() => setVentureEditor(null)} data-testid="venture-editor-close" className="rounded-full border border-white/10 p-2 text-gray-400 hover:text-white transition-colors duration-300" aria-label="Close">
                  <X size={16} />
                </button>
              </div>
              <div className="mt-6 space-y-4">
                <input value={ventureEditor.name} onChange={(e) => setVentureEditor((s) => ({ ...s, name: e.target.value }))} placeholder="Venture name" data-testid="venture-editor-name" className={inputCls} />
                <div className="grid grid-cols-2 gap-4">
                  <input value={ventureEditor.industry} onChange={(e) => setVentureEditor((s) => ({ ...s, industry: e.target.value }))} placeholder="Industry" data-testid="venture-editor-industry" className={inputCls} />
                  <select value={ventureEditor.stage} onChange={(e) => setVentureEditor((s) => ({ ...s, stage: e.target.value }))} data-testid="venture-editor-stage" className={inputCls}>
                    {VENTURE_STAGES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                  <input value={ventureEditor.capital_required} onChange={(e) => setVentureEditor((s) => ({ ...s, capital_required: e.target.value }))} placeholder="Capital required (e.g. ₹50L – ₹1Cr)" data-testid="venture-editor-capital" className={inputCls} />
                  <input value={ventureEditor.founder_name} onChange={(e) => setVentureEditor((s) => ({ ...s, founder_name: e.target.value }))} placeholder="Founder name" data-testid="venture-editor-founder" className={inputCls} />
                  <input value={ventureEditor.founder_email || ""} onChange={(e) => setVentureEditor((s) => ({ ...s, founder_email: e.target.value }))} placeholder="Founder Google email (links Founder Portal)" data-testid="venture-editor-founder-email" className={inputCls} />
                </div>
                <textarea value={ventureEditor.description} onChange={(e) => setVentureEditor((s) => ({ ...s, description: e.target.value }))} placeholder="What this venture does (shown to verified investors if visible)" rows={4} data-testid="venture-editor-description" className={`${inputCls} resize-none`} />
                <div className="grid grid-cols-2 gap-4 items-center">
                  <select value={ventureEditor.status} onChange={(e) => setVentureEditor((s) => ({ ...s, status: e.target.value }))} data-testid="venture-editor-status" className={inputCls}>
                    {VENTURE_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                  <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={!!ventureEditor.visible_to_investors} onChange={(e) => setVentureEditor((s) => ({ ...s, visible_to_investors: e.target.checked }))} data-testid="venture-editor-visible" className="h-4 w-4 accent-[#E6C280]" />
                    Visible to verified investors
                  </label>
                </div>
                <button
                  onClick={saveVenture}
                  data-testid="venture-editor-save"
                  className="w-full rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300"
                >
                  SAVE VENTURE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
