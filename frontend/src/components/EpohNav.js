import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ArrowLeft } from "lucide-react";

const LINKS = [
  { label: "Home", path: "/epohtech" },
  { label: "Services", path: "/epohtech/services" },
  { label: "Programs", path: "/epohtech/programs" },
  { label: "About", path: "/epohtech/about" },
  { label: "Contact", path: "/epohtech/contact" },
];

export default function EpohNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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
      data-testid="epoh-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "bg-obsidian/85 backdrop-blur-xl border-b border-white/5" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <Link to="/epohtech" data-testid="epoh-nav-logo" className="flex items-baseline gap-2 group shrink-0">
          <span className="font-extrabold tracking-tight text-lg sm:text-xl text-white leading-none">
            EPOH<span className="text-champagne group-hover:text-champagneBright transition-colors duration-300">TECH</span>
          </span>
          <span className="hidden md:inline font-mono text-[9px] tracking-[0.3em] text-gray-500 uppercase">
            An Anvaya Partners Company
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" data-testid="epoh-nav-desktop">
          {LINKS.slice(1).map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              data-testid={`epoh-nav-link-${l.label.toLowerCase()}`}
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
          <Link
            to="/"
            data-testid="epoh-nav-anvaya-link"
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500 hover:text-champagne transition-colors duration-300"
          >
            <ArrowLeft size={12} /> Anvaya Partners
          </Link>
          <Link
            to="/epohtech/contact"
            data-testid="epoh-nav-cta-contact"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-champagne text-obsidian text-xs font-bold tracking-wide px-5 py-2.5 hover:bg-champagneBright hover:gap-2.5 transition-all duration-300"
          >
            START A CONVERSATION <ArrowUpRight size={14} />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            data-testid="epoh-nav-mobile-menu-button"
            className="lg:hidden text-gray-200 p-2"
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
            className="lg:hidden overflow-hidden bg-obsidian/95 backdrop-blur-xl border-b border-white/5"
            data-testid="epoh-nav-mobile-drawer"
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
                    end={l.path === "/epohtech"}
                    data-testid={`epoh-nav-mobile-link-${l.label.toLowerCase()}`}
                    className={({ isActive }) =>
                      `text-lg font-semibold ${isActive ? "text-champagne" : "text-gray-300"}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <Link
                to="/"
                data-testid="epoh-nav-mobile-anvaya-link"
                className="mt-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500"
              >
                <ArrowLeft size={13} /> Back to Anvaya Partners
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
