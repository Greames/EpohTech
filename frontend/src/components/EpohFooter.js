import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const FooterCol = ({ title, items }) => (
  <div>
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-5">{title}</p>
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.label}>
          <Link
            to={i.path}
            data-testid={`epoh-footer-link-${i.label.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-sm text-gray-400 hover:text-champagne transition-colors duration-300"
          >
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function EpohFooter() {
  return (
    <footer className="border-t border-white/5 bg-obsidian" data-testid="epoh-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-2 mb-5">
              <span className="font-extrabold tracking-tight text-2xl text-white">
                EPOH<span className="text-champagne">TECH</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm mb-3">
              Your IT Department, On-Demand.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
              An Anvaya Partners company. Non-tech cofounders concentrate on running the
              business — we back the tech: data engineering, cloud, Oracle ERP and custom software.
            </p>
            <div className="space-y-4 max-w-sm">
              <a
                href="tel:+917022913284"
                data-testid="epoh-footer-phone"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-champagne transition-colors duration-300"
              >
                <Phone size={15} className="text-champagne shrink-0" /> +91 70229 13284
              </a>
              <a
                href="mailto:assist@theepoh.com"
                data-testid="epoh-footer-email"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-champagne transition-colors duration-300"
              >
                <Mail size={15} className="text-champagne shrink-0" /> assist@theepoh.com
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-500" data-testid="epoh-footer-address-proddatur">
                <MapPin size={15} className="text-champagne shrink-0 mt-0.5" />
                <span>D.No: 9/580, Khadarbad, Proddatur, Andhra Pradesh 516362</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-500" data-testid="epoh-footer-address-hyderabad">
                <MapPin size={15} className="text-champagne shrink-0 mt-0.5" />
                <span>16th Floor, Awfis Coworking Space, Prestige Skytech, Financial District, Hyderabad 500032</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterCol
              title="Company"
              items={[
                { label: "Home", path: "/epohtech" },
                { label: "About", path: "/epohtech/about" },
                { label: "Services", path: "/epohtech/services" },
                { label: "Programs", path: "/epohtech/programs" },
                { label: "Contact", path: "/epohtech/contact" },
              ]}
            />
            <FooterCol
              title="Services"
              items={[
                { label: "Data Engineering", path: "/epohtech/services" },
                { label: "Big Data Analytics", path: "/epohtech/services" },
                { label: "Oracle ERP & OIC", path: "/epohtech/services" },
                { label: "IT Consulting", path: "/epohtech/services" },
              ]}
            />
            <FooterCol
              title="Anvaya Partners"
              items={[
                { label: "Anvaya Home", path: "/" },
                { label: "Portfolio", path: "/portfolio" },
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Terms of Use", path: "/terms" },
              ]}
            />
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-white/5 bg-charcoal/40 p-6" data-testid="epoh-footer-disclaimer">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            EpohTech Solutions Pvt Ltd is the technology company of Anvaya Partners. Nothing on
            this website constitutes an offer to sell, or a solicitation of an offer to buy, any
            securities. For investment-related information, please refer to{" "}
            <Link to="/" className="text-champagne underline underline-offset-2">Anvaya Partners</Link>.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600">
            © {new Date().getFullYear()} EpohTech Solutions Pvt Ltd · Hyderabad, India
          </p>
          <Link
            to="/"
            data-testid="epoh-footer-anvaya-link"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 hover:text-champagne transition-colors duration-300"
          >
            An Anvaya Partners Company <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
