import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Approach", path: "/approach" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "For Founders", path: "/founders" },
  { label: "For Investors", path: "/investors" },
  { label: "Team", path: "/team" },
  { label: "Insights", path: "/insights" },
  { label: "Contact", path: "/contact" },
];

const GoogleMark = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.25 1.3-1.66 3.8-5.5 3.8-3.3 0-6-2.75-6-6.1s2.7-6.1 6-6.1c1.9 0 3.16.8 3.9 1.5l2.65-2.55C16.9 3.1 14.7 2 12 2 6.9 2 2.75 6.15 2.75 11.8S6.9 21.6 12 21.6c5.8 0 9.25-4.05 9.25-9.75 0-.66-.07-1.15-.16-1.65H12z"/>
  </svg>
);

export default function HeaderNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      data-testid="header-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "bg-obsidian/85 backdrop-blur-xl border-b border-white/5" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <Link to="/" data-testid="nav-logo" className="flex items-baseline gap-2 group shrink-0">
          <span className="font-extrabold tracking-tight text-lg sm:text-xl text-white leading-none">
            Anvaya
          </span>
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.35em] text-champagne group-hover:text-champagneBright transition-colors duration-300">
            PARTNERS
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-5" data-testid="nav-desktop">
          {LINKS.slice(1).map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `text-xs font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${
                  isActive ? "text-champagne" : "text-gray-400 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/account"
                data-testid="nav-account-link"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-1 pr-3 py-1 hover:border-champagne/40 transition-colors duration-300"
              >
                {user.picture ? (
                  <img src={user.picture} alt="" className="h-7 w-7 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <span className="h-7 w-7 rounded-full bg-champagne/20 text-champagne flex items-center justify-center text-xs font-bold">
                    {(user.name || "A")[0]}
                  </span>
                )}
                <span className="text-xs text-gray-300 max-w-[110px] truncate">{user.name || user.email}</span>
              </Link>
              <button
                onClick={logout}
                data-testid="nav-logout-button"
                className="text-gray-500 hover:text-white transition-colors duration-300"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              data-testid="nav-google-signin-button"
              className="hidden sm:flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-gray-200 hover:border-champagne/50 hover:text-white transition-colors duration-300"
            >
              <GoogleMark /> Sign in
            </button>
          )}
          <Link
            to="/founders"
            data-testid="nav-cta-apply"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-champagne text-obsidian text-xs font-bold tracking-wide px-5 py-2.5 hover:bg-champagneBright hover:gap-2.5 transition-all duration-300"
          >
            APPLY AS FOUNDER <ArrowUpRight size={14} />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            data-testid="nav-mobile-menu-button"
            className="xl:hidden text-gray-200 p-2"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="xl:hidden overflow-hidden bg-obsidian/95 backdrop-blur-xl border-b border-white/5"
            data-testid="nav-mobile-drawer"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.path}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <NavLink
                    to={l.path}
                    data-testid={`nav-mobile-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={({ isActive }) =>
                      `text-lg font-semibold ${isActive ? "text-champagne" : "text-gray-300"}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              {!user && (
                <button
                  onClick={login}
                  data-testid="nav-mobile-google-signin-button"
                  className="mt-2 flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-3 text-sm font-medium text-gray-200"
                >
                  <GoogleMark /> Sign in with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
