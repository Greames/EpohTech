import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Reveal, Eyebrow } from "@/components/Reveal";

// `logo` is a file in frontend/public/clients/ (e.g. "/clients/acme.svg") or the
// client's official logo URL. Logos show in full colour on a light tile, so files
// with white backgrounds work too. Without a logo (or if it fails to load) the
// client's name is shown on the tile instead.
export const CONSULTING_CLIENTS = [
  { name: "Accion Labs", logo: "https://www.accionlabs.com/hubfs/Accion%20HubSpot%20Website/Logos%20and%20Icons/Accion%20Labs/Accion%20Labs%20Logo_Color-1.svg" },
  { name: "Swift Navigation", logo: "https://www.swiftnav.com/wp-content/uploads/2025/02/logo-black.svg" },
  { name: "Strive4x", logo: "https://strive4x.net/assets/img/logo.png" },
  { name: "Infolob", logo: null },
  { name: "Hindsight Software Solutions", logo: "/clients/hindsight-software-solutions.png" },
  { name: "CARE Hospitals", logo: "https://www.carehospitals.com/assets/images/cares-logo.webp" },
];

export const ClientMark = ({ client }) => {
  const [failed, setFailed] = useState(false);
  return (
    <span
      title={client.name}
      className="flex h-14 sm:h-16 w-full items-center justify-center rounded-xl bg-white px-4 ring-1 ring-white/10 hover:-translate-y-0.5 transition-transform duration-500"
    >
      {client.logo && !failed ? (
        <img
          src={client.logo}
          alt={client.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="max-h-9 sm:max-h-10 max-w-full w-auto object-contain"
        />
      ) : (
        <span className="text-center text-sm font-extrabold tracking-tight text-obsidian leading-tight">{client.name}</span>
      )}
    </span>
  );
};

const REGIONS = [
  {
    region: "India",
    body: "Consultants working alongside enterprise and healthcare teams in India — delivery, integration and day-to-day application support.",
  },
  {
    region: "United States",
    body: "Engineers embedded with US product and services companies — overlapping US business hours, with follow-the-sun cover from India.",
  },
];

const CAPABILITIES = ["Oracle ERP & OIC", "Data engineering", "Application support", "Integration & migration"];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function EpohConsulting() {
  return (
    <div data-testid="epoh-consulting" className="mt-28">
      <Reveal className="max-w-3xl">
        <Eyebrow>Consulting</Eyebrow>
        <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
          Enterprise consulting, <span className="text-champagne">India &amp; US.</span>
        </h2>
        <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
          Beyond the portfolio, our consultants support established companies across India and
          the United States — the same engineers who run our own systems, working inside yours.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
        {REGIONS.map((r, i) => (
          <Reveal key={r.region} delay={i * 0.08}>
            <div
              data-testid={`epoh-consulting-region-${slug(r.region)}`}
              className="h-full rounded-2xl border border-white/5 bg-charcoal/50 p-8 hover:border-champagne/25 transition-colors duration-500"
            >
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-champagne">
                <MapPin size={14} strokeWidth={1.75} /> {r.region}
              </span>
              <p className="mt-4 text-sm sm:text-[15px] text-gray-400 leading-relaxed">{r.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-5">
        <div className="rounded-2xl border border-white/5 bg-obsidian/60 p-8 sm:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600">Clients we support</p>
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {CONSULTING_CLIENTS.map((c) => (
              <li key={c.name} data-testid={`epoh-consulting-client-${slug(c.name)}`} className="flex">
                <ClientMark client={c} />
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <ul className="flex flex-wrap gap-2">
              {CAPABILITIES.map((c) => (
                <li key={c} className="rounded-full border border-white/10 px-3.5 py-1.5 text-[12px] text-gray-400">
                  {c}
                </li>
              ))}
            </ul>
            <Link
              to="/epohtech/contact"
              data-testid="epoh-consulting-contact-link"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-champagne hover:text-champagneBright transition-colors duration-300 shrink-0"
            >
              Engage our consultants <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
