import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import axios, { API } from "@/lib/api";

const FooterCol = ({ title, items }) => (
  <div>
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-5">{title}</p>
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.label}>
          <Link
            to={i.path}
            data-testid={`footer-link-${i.label.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-sm text-gray-400 hover:text-champagne transition-colors duration-300"
          >
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    try {
      await axios.post(`${API}/contact`, {
        name: "Newsletter Subscriber",
        email,
        topic: "Insights Newsletter",
        message: "Please add me to the Inside the Build newsletter.",
      });
      toast.success("You're on the list. Welcome inside the build.");
      setEmail("");
    } catch (err) {
      toast.error("Could not subscribe right now. Try again shortly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="border-t border-white/5 bg-obsidian" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-2 mb-5">
              <span className="font-extrabold tracking-tight text-2xl text-white">Second&nbsp;Salary</span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-champagne">CAPITAL</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-3">
              Our first salary was for gratitude. Our second salary was for building.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
              A venture studio building companies with founders, investors, technology and the
              support required to turn opportunities into businesses.
            </p>
            <form onSubmit={subscribe} className="flex max-w-sm" data-testid="footer-newsletter-form">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email for Inside the Build"
                data-testid="footer-newsletter-email-input"
                className="flex-1 bg-charcoal border border-white/10 border-r-0 rounded-l-full px-5 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/50"
              />
              <button
                type="submit"
                disabled={sending}
                data-testid="footer-newsletter-submit-button"
                className="rounded-r-full bg-champagne text-obsidian px-5 text-sm font-bold hover:bg-champagneBright transition-colors duration-300 disabled:opacity-50"
              >
                {sending ? "…" : <ArrowUpRight size={16} />}
              </button>
            </form>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterCol
              title="Build"
              items={[
                { label: "Build With Us", path: "/build" },
                { label: "For Investors", path: "/investors" },
                { label: "What We Support", path: "/support" },
                { label: "Insights", path: "/insights" },
              ]}
            />
            <FooterCol
              title="Ecosystem"
              items={[
                { label: "EPOHTECH", path: "/epohtech" },
                { label: "Our Story", path: "/story" },
                { label: "Team", path: "/team" },
                { label: "Contact", path: "/contact" },
                { label: "Account", path: "/account" },
              ]}
            />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-5">Proof</p>
              <ul className="space-y-3 text-sm">
                <li className="text-gray-400"><span className="text-champagne font-bold">80+</span> Investors Onboarded</li>
                <li className="text-gray-400"><span className="text-champagne font-bold">2+</span> Startups Funded</li>
                <li className="text-gray-400"><span className="text-champagne font-bold">₹10L–₹10Cr</span> Investment Range</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600">
            © {new Date().getFullYear()} Second Salary Capital
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600">
            Technology by <Link to="/epohtech" className="text-epoh hover:text-champagne transition-colors duration-300">EPOHTECH</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
