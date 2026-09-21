import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    const hash = location.hash || "";
    const match = hash.match(/session_id=([^&]+)/);
    const sessionId = match?.[1];
    if (!sessionId) {
      navigate("/");
      return;
    }
    (async () => {
      try {
        const r = await axios.post(`${API}/auth/session`, { session_id: sessionId });
        setUser(r.data);
        toast.success(`Welcome, ${r.data.name || "builder"}`);
        navigate("/account", { state: { user: r.data }, replace: true });
      } catch (e) {
        toast.error("Sign-in failed. Please try again.");
        navigate("/", { replace: true });
      }
    })();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian" data-testid="auth-callback-loading">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-champagne border-t-transparent animate-spin" />
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500">Signing you in</p>
      </div>
    </div>
  );
}
