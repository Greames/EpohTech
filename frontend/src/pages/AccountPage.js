import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2, LogOut, FileText, ShieldCheck } from "lucide-react";
import axios, { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Reveal, Eyebrow } from "@/components/Reveal";
import { Link } from "react-router-dom";

const STATUS_STYLES = {
  submitted: "border-champagne/30 text-champagne bg-champagne/5",
  verification_pending: "border-epoh/30 text-purple-300 bg-epoh/5",
  screening: "border-champagne/30 text-champagne bg-champagne/5",
  approved: "border-growth/30 text-emerald-300 bg-growth/5",
};

const GoogleMark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.25 1.3-1.66 3.8-5.5 3.8-3.3 0-6-2.75-6-6.1s2.7-6.1 6-6.1c1.9 0 3.16.8 3.9 1.5l2.65-2.55C16.9 3.1 14.7 2 12 2 6.9 2 2.75 6.15 2.75 11.8S6.9 21.6 12 21.6c5.8 0 9.25-4.05 9.25-9.75 0-.66-.07-1.15-.16-1.65H12z"/>
  </svg>
);

export default function AccountPage() {
  const { user, loading, login, logout } = useAuth();
  const location = useLocation();
  const [activity, setActivity] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const effectiveUser = user || location.state?.user || null;

  useEffect(() => {
    if (!effectiveUser) return;
    axios
      .get(`${API}/my/activity`)
      .then((r) => setActivity(r.data))
      .catch(() => setActivity(null));
    axios
      .get(`${API}/admin/overview`)
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false));
  }, [effectiveUser]);

  if (loading && !effectiveUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="account-loading">
        <Loader2 size={28} className="animate-spin text-champagne" />
      </div>
    );
  }

  if (!effectiveUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-testid="account-signin-prompt">
        <div className="text-center max-w-md">
          <Eyebrow className="justify-center">Members</Eyebrow>
          <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Sign in to your account
          </h1>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            Track your founder applications and investor registrations inside the Second Salary
            Capital ecosystem.
          </p>
          <button
            onClick={login}
            data-testid="account-google-signin-button"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 gold-glow"
          >
            <GoogleMark /> Continue with Google
          </button>
        </div>
      </div>
    );
  }

  const founderApps = activity?.founder_applications || [];
  const investorRegs = activity?.investor_registrations || [];

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-36 min-h-screen" data-testid="account-dashboard">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {effectiveUser.picture ? (
                <img src={effectiveUser.picture} alt="" className="h-14 w-14 rounded-full border border-champagne/30" referrerPolicy="no-referrer" />
              ) : (
                <span className="h-14 w-14 rounded-full bg-champagne/15 text-champagne flex items-center justify-center text-xl font-bold">
                  {(effectiveUser.name || "S")[0]}
                </span>
              )}
              <div>
                <Eyebrow>Your Account</Eyebrow>
                <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white" data-testid="account-user-name">
                  {effectiveUser.name || effectiveUser.email}
                </h1>
                <p className="text-xs text-gray-500 mt-1" data-testid="account-user-email">{effectiveUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  data-testid="account-admin-link"
                  className="inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian px-5 py-2.5 text-xs font-bold hover:bg-champagneBright transition-colors duration-300"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                data-testid="account-logout-button"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-medium text-gray-300 hover:border-champagne/50 hover:text-white transition-colors duration-300"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-charcoal/50 p-7 sm:p-9" data-testid="account-founder-applications">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                  <FileText size={18} className="text-champagne" /> Founder Applications
                </h2>
                <span className="font-mono text-xs text-gray-500">{founderApps.length}</span>
              </div>
              {founderApps.length === 0 ? (
                <div className="mt-6 text-sm text-gray-500 leading-relaxed">
                  No applications yet.{" "}
                  <Link to="/build" className="text-champagne hover:text-champagneBright" data-testid="account-build-link">
                    Build with us →
                  </Link>
                </div>
              ) : (
                <ul className="mt-6 space-y-4">
                  {founderApps.map((a) => (
                    <li key={a.application_id} className="rounded-2xl border border-white/5 bg-obsidian/60 p-5" data-testid={`account-application-${a.application_id}`}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-[10px] text-gray-500">{a.application_id}</span>
                        <span className={`font-mono text-[10px] uppercase tracking-[0.15em] rounded-full border px-3 py-1 ${STATUS_STYLES[a.status] || STATUS_STYLES.submitted}`}>
                          {a.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-300 leading-relaxed line-clamp-2">{a.idea}</p>
                      <p className="mt-2 text-[11px] text-gray-600">{a.industry || "General"} · {new Date(a.created_at).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="rounded-3xl border border-white/10 bg-charcoal/50 p-7 sm:p-9" data-testid="account-investor-registrations">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                  <ShieldCheck size={18} className="text-epoh" /> Investor Registrations
                </h2>
                <span className="font-mono text-xs text-gray-500">{investorRegs.length}</span>
              </div>
              {investorRegs.length === 0 ? (
                <div className="mt-6 text-sm text-gray-500 leading-relaxed">
                  Not registered yet.{" "}
                  <Link to="/investors" className="text-champagne hover:text-champagneBright" data-testid="account-invest-link">
                    Join the investor network →
                  </Link>
                </div>
              ) : (
                <ul className="mt-6 space-y-4">
                  {investorRegs.map((r) => (
                    <li key={r.registration_id} className="rounded-2xl border border-white/5 bg-obsidian/60 p-5" data-testid={`account-registration-${r.registration_id}`}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-[10px] text-gray-500">{r.registration_id}</span>
                        <span className={`font-mono text-[10px] uppercase tracking-[0.15em] rounded-full border px-3 py-1 ${STATUS_STYLES[r.status] || STATUS_STYLES.verification_pending}`}>
                          {r.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-300">{r.investment_range || "Range TBD"} · {r.investment_stage || "Any stage"}</p>
                      <p className="mt-2 text-[11px] text-gray-600">{new Date(r.created_at).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
