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
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email || !consent) return;
    setSending(true);
    try {
      await axios.post(`${API}/contact`, {
        name: "Newsletter Subscriber",
        email,
        topic: "Insights Newsletter",
        message: "Please add me to the Anvaya Partners insights newsletter.",
        consent: true,
      });
      toast.success("You're on the list.");
      setEmail("");
      setConsent(false);
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
              <span className="font-extrabold tracking-tight text-2xl text-white">Anvaya</span>
              <span className="font-mono text-[10px] tracking-[0.35em] text-champagne">PARTNERS</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm mb-3">
              Where capital meets founders.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
              An early-stage investment firm that invests its own capital in startups and works
              hands-on with founders on strategy, technology, finance, operations and go-to-market.
            </p>
            <form onSubmit={subscribe} className="max-w-sm" data-testid="footer-newsletter-form">
              <div className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email for insights"
                  data-testid="footer-newsletter-email-input"
                  className="flex-1 bg-charcoal border border-white/10 border-r-0 rounded-l-full px-5 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/50"
                />
                <button
                  type="submit"
                  disabled={sending || !consent}
                  data-testid="footer-newsletter-submit-button"
                  className="rounded-r-full bg-champagne text-obsidian px-5 text-sm font-bold hover:bg-champagneBright transition-colors duration-300 disabled:opacity-50"
                >
                  {sending ? "…" : <ArrowUpRight size={16} />}
                </button>
              </div>
              <label className="mt-3 flex items-start gap-2.5 text-[11px] text-gray-500 leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  data-testid="footer-newsletter-consent-checkbox"
                  className="mt-0.5 h-3.5 w-3.5 accent-[#E6C280]"
                />
                <span>
                  I consent to Anvaya Partners processing my email as described in the{" "}
                  <Link to="/privacy" className="text-champagne underline underline-offset-2">Privacy Policy</Link>.
                </span>
              </label>
            </form>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterCol
              title="Firm"
              items={[
                { label: "About", path: "/about" },
                { label: "EPOHTECH", path: "/epohtech" },
                { label: "Approach", path: "/approach" },
                { label: "Team", path: "/team" },
                { label: "Insights", path: "/insights" },
              ]}
            />
            <FooterCol
              title="Partner With Us"
              items={[
                { label: "For Founders", path: "/founders" },
                { label: "For Investors", path: "/investors" },
                { label: "Portfolio", path: "/portfolio" },
                { label: "Contact", path: "/contact" },
              ]}
            />
            <FooterCol
              title="Legal"
              items={[
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Terms of Use", path: "/terms" },
                { label: "Disclaimer", path: "/disclaimer" },
              ]}
            />
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-white/5 bg-charcoal/40 p-6" data-testid="footer-disclaimer">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Anvaya Partners Private Limited is not a stock exchange, is not registered with SEBI as an
            intermediary, and does not solicit investment from the public. Nothing on this website
            constitutes an offer to sell, or a solicitation of an offer to buy, any securities.
            Investment opportunities are shared only privately with eligible, verified investors in
            compliance with applicable law. Investing in early-stage companies involves high risk,
            including possible loss of the entire amount invested.{" "}
            <Link to="/disclaimer" className="text-champagne underline underline-offset-2">Read the full disclaimer</Link>.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600">
            © {new Date().getFullYear()} Anvaya Partners Private Limited · Hyderabad, India
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600">
            Conviction · Partnership · Discipline · Integrity
          </p>
        </div>
      </div>
    </footer>
  );
}
