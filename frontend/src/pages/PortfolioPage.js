import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const COMPANIES = [
  {
    name: "EPOHTECH",
    description: "Technology platform and technology partner to every Anvaya Partners company — ₹1.5 Cr revenue in two years, built capital-efficiently with less investment.",
    year: "Operating",
  },
  { name: "[Company 1]", description: "Wholesale meat distribution to restaurants from a single processing unit — with a franchise model planned for one to two units per district, roughly every 20–30 km.", year: "2026" },
  { name: "[Company 2]", description: "[Company 2 — one-line description]", year: "2026" },
];

export default function PortfolioPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Portfolio</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Few companies.</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">Deep involvement.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            We invest our own capital and work hands-on with every company we back. EPOHTECH — our
            own technology platform — is operating today; two more companies launch in 2026.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPANIES.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.1}>
              <div
                data-testid={`portfolio-company-${i + 1}`}
                className={`group h-full rounded-3xl border p-8 sm:p-12 transition-colors duration-500 ${
                  c.year === "Operating"
                    ? "border-champagne/25 bg-charcoal/60 hover:border-champagne/45"
                    : "border-white/5 bg-charcoal/50 hover:border-champagne/25"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-champagne">
                    {c.year === "Operating" ? "Operating · Built by us" : `Launching ${c.year}`}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600">Portfolio</span>
                </div>
                <h2 className="mt-8 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{c.name}</h2>
                <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">{c.description}</p>
                {c.year === "Operating" && (
                  <Link to="/epohtech" data-testid="portfolio-epohtech-link" className="group mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-champagne hover:text-champagneBright transition-colors duration-300">
                    The EPOHTECH story <ArrowUpRight size={13} />
                  </Link>
                )}
                <div className="mt-10 h-px bg-white/5" />
                <p className="mt-6 text-[13px] text-gray-500 leading-relaxed">
                  Backed by Anvaya Partners' own capital, with hands-on support across strategy,
                  technology, finance, operations and go-to-market.
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-obsidian/50 p-8 sm:p-12 text-center" data-testid="portfolio-more">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">More coming soon</p>
            <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              We add companies deliberately, not frequently. If you are building something worth
              a decade, we would like to hear about it.
            </p>
            <Link
              to="/founders"
              data-testid="portfolio-apply-button"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300"
            >
              APPLY AS A FOUNDER <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>

        <p className="mt-12 font-mono text-[10px] text-gray-600 leading-relaxed max-w-3xl" data-testid="portfolio-disclaimer">
          Anvaya Partners Private Limited does not publicly disclose fundraising terms, amounts,
          valuations or share prices of any company. Details are shared only privately with
          eligible, verified investors.
        </p>
      </div>
    </div>
  );
}
