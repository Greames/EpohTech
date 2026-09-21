import { useEffect, useState } from "react";
import { Loader2, Lock, Building2, CalendarClock, ListTodo, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios, { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

export default function FounderPortalPage() {
  const { user, loading, login } = useAuth();
  const [state, setState] = useState("loading");
  const [venture, setVenture] = useState(null);

  const load = () => {
    axios
      .get(`${API}/my/venture`)
      .then((r) => {
        setVenture(r.data);
        setState("ready");
      })
      .catch((e) => setState(e.response?.status === 404 ? "none" : "none"));
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleTask = async (t) => {
    try {
      await axios.patch(`${API}/my/tasks/${t.task_id}`, { done: !t.done });
      setVenture((v) => ({
        ...v,
        tasks: v.tasks.map((x) => (x.task_id === t.task_id ? { ...x, done: !x.done } : x)),
      }));
      toast.success(!t.done ? "Task completed" : "Task reopened");
    } catch {
      toast.error("Could not update task");
    }
  };

  if (loading || (user && state === "loading")) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="founder-portal-loading">
        <Loader2 size={28} className="animate-spin text-champagne" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-testid="founder-portal-signin-prompt">
        <div className="text-center max-w-md">
          <Lock size={28} className="mx-auto text-champagne" />
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">Founder sign-in required</h1>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            Your venture workspace — milestones, tasks and build progress — lives here.
          </p>
          <button
            onClick={login}
            data-testid="founder-portal-google-signin-button"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold px-8 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 gold-glow"
          >
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  if (state === "none") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-testid="founder-portal-empty">
        <div className="text-center max-w-md">
          <Building2 size={28} className="mx-auto text-champagne" />
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">No venture linked yet</h1>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            Once the studio approves your application and links a venture to{" "}
            <span className="text-champagne">{user.email}</span>, your workspace will appear here.
          </p>
          <Link
            to="/build"
            data-testid="founder-portal-apply-link"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold px-8 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 gold-glow"
          >
            APPLY TO BUILD
          </Link>
        </div>
      </div>
    );
  }

  const milestones = venture.milestones || [];
  const tasks = venture.tasks || [];
  const doneMs = milestones.filter((m) => m.done).length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36 min-h-screen" data-testid="founder-portal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Founder Workspace</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>{venture.name}</span></MaskedLine>
          </h1>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-full border border-champagne/30 bg-champagne/5 text-champagne px-4 py-2">{venture.stage}</span>
            {venture.industry && (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-full border border-white/10 text-gray-400 px-4 py-2">{venture.industry}</span>
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-full border border-white/10 text-gray-400 px-4 py-2">{venture.status}</span>
          </div>
          {venture.description && (
            <p className="mt-6 text-gray-400 text-base leading-relaxed max-w-2xl">{venture.description}</p>
          )}
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-charcoal/50 p-7 sm:p-9 h-full" data-testid="founder-portal-milestones">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  <CalendarClock size={18} className="text-champagne" /> Milestones
                </h2>
                <span className="font-mono text-xs text-gray-500">{doneMs}/{milestones.length}</span>
              </div>
              {milestones.length > 0 && (
                <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-champagne transition-all duration-700" style={{ width: `${Math.round((doneMs / milestones.length) * 100)}%` }} />
                </div>
              )}
              <ul className="mt-6 space-y-3">
                {milestones.length === 0 && <li className="text-sm text-gray-500">Milestones will appear once the studio sets them with you.</li>}
                {milestones.map((m) => {
                  const overdue = !m.done && m.due_date && m.due_date < today;
                  return (
                    <li key={m.milestone_id} data-testid={`founder-milestone-${m.milestone_id}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-obsidian/60 px-4 py-3">
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${m.done ? "bg-emerald-400" : overdue ? "bg-red-400" : "bg-champagne/50"}`} />
                      <span className={`flex-1 text-sm ${m.done ? "text-gray-600 line-through" : "text-gray-200"}`}>{m.title}</span>
                      {m.due_date && <span className={`font-mono text-[9px] ${overdue ? "text-red-400" : "text-gray-600"}`}>{m.due_date}{overdue ? " · overdue" : ""}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="rounded-3xl border border-white/10 bg-charcoal/50 p-7 sm:p-9 h-full" data-testid="founder-portal-tasks">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  <ListTodo size={18} className="text-champagne" /> Your Tasks
                </h2>
                <span className="font-mono text-xs text-gray-500">{doneTasks}/{tasks.length} done</span>
              </div>
              <ul className="mt-6 space-y-3">
                {tasks.length === 0 && <li className="text-sm text-gray-500">No tasks assigned yet.</li>}
                {tasks.map((t) => {
                  const overdue = !t.done && t.due_date && t.due_date < today;
                  return (
                    <li key={t.task_id} data-testid={`founder-task-${t.task_id}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-obsidian/60 px-4 py-3">
                      <button
                        onClick={() => toggleTask(t)}
                        data-testid={`founder-task-toggle-${t.task_id}`}
                        className={`shrink-0 h-5 w-5 rounded-md border flex items-center justify-center transition-colors duration-300 ${t.done ? "bg-champagne border-champagne" : "border-white/20 hover:border-champagne/60"}`}
                        aria-label={t.done ? "Reopen task" : "Complete task"}
                      >
                        {t.done && <CheckCircle2 size={13} className="text-obsidian" />}
                      </button>
                      <span className={`flex-1 text-sm ${t.done ? "text-gray-600 line-through" : "text-gray-200"}`}>{t.title}</span>
                      {t.due_date && <span className={`font-mono text-[9px] ${overdue ? "text-red-400" : "text-gray-600"}`}>{t.due_date}</span>}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 text-[11px] text-gray-600 leading-relaxed">
                Checking off a task here updates the studio's view in real time.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
