import { Reveal, Eyebrow } from "@/components/Reveal";
import { Hammer, Banknote, Building2 } from "lucide-react";

const COLUMNS = [
  {
    icon: Hammer,
    party: "Founders",
    headline: "Build equity, not just a salary.",
    testId: "value-flow-founders",
    points: [
      "A meaningful equity stake in the company you build — typically 15–40%, shaped by what you bring: idea, domain expertise, customers, capital and full-time commitment",
      "A founder salary once the venture is funded and generating revenue",
      "Real wealth at exit, spin-off or long-term ownership — not just experience",
      "A track record as a funded founder that compounds into your next venture",
    ],
  },
  {
    icon: Banknote,
    party: "Investors",
    headline: "Returns from real companies.",
    testId: "value-flow-investors",
    points: [
      "Equity participation in the specific ventures you choose — not a blind pool",
      "Returns as ventures mature: exits, spin-offs, dividends or follow-on rounds",
      "Full visibility — milestones, KPIs, documents and direct communication with the studio",
      "No guaranteed returns, exits or allocations. Risk is real, and we say so openly",
    ],
  },
  {
    icon: Building2,
    party: "The Studio",
    headline: "We earn when ventures win.",
    testId: "value-flow-studio",
    points: [
      "Anchor equity in each company in exchange for capital, technology through EPOHTECH, and the full operating ecosystem",
      "No fee-first model — our upside is the venture's upside",
      "Long-term alignment: we stay in the trenches from validation through scale",
    ],
  },
];

export default function ValueFlowSection() {
  return (
    <section data-testid="value-flow-section" className="py-24 md:py-36 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Revenue Model</Eyebrow>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
            How value flows through <span className="text-champagne">the ecosystem.</span>
          </h2>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            Everyone at the table owns a piece of what gets built. No fixed formula — every
            venture's structure is designed around contribution, capital, risk and commitment.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {COLUMNS.map((c, i) => (
            <Reveal key={c.party} delay={i * 0.12}>
              <div
                data-testid={c.testId}
                className="group h-full rounded-3xl border border-white/5 bg-charcoal/60 p-8 sm:p-10 hover:border-champagne/30 transition-colors duration-500"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/10 text-champagne border border-champagne/20 shrink-0">
                    <c.icon size={22} strokeWidth={1.75} />
                  </span>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">{c.party}</p>
                </div>
                <h3 className="mt-6 text-xl sm:text-2xl font-bold text-white tracking-tight">{c.headline}</h3>
                <ul className="mt-6 space-y-4">
                  {c.points.map((p) => (
                    <li key={p.slice(0, 24)} className="flex gap-3 text-sm text-gray-400 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 rotate-45 bg-champagne/60 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14 rounded-3xl border border-white/5 bg-charcoal/40 p-8 sm:p-10" data-testid="equity-example">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-lg font-bold text-white tracking-tight">An example ownership structure</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600">Company A — illustrative only</span>
            </div>
            <div className="mt-6 flex h-16 sm:h-20 rounded-2xl overflow-hidden border border-white/10">
              <div className="bg-champagne flex flex-col justify-center px-4 sm:px-6" style={{ width: "60%" }} data-testid="equity-ssc">
                <span className="font-mono font-bold text-obsidian text-lg sm:text-2xl">60%</span>
                <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.15em] text-obsidian/70">Second Salary Capital</span>
              </div>
              <div className="bg-elevated border-x border-white/10 flex flex-col justify-center px-4 sm:px-6" style={{ width: "25%" }} data-testid="equity-founder">
                <span className="font-mono font-bold text-white text-lg sm:text-2xl">25%</span>
                <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.15em] text-gray-500">Founder</span>
              </div>
              <div className="bg-obsidian flex flex-col justify-center px-4 sm:px-6" style={{ width: "15%" }} data-testid="equity-investor">
                <span className="font-mono font-bold text-epoh text-lg sm:text-2xl">15%</span>
                <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.15em] text-gray-600">Investor</span>
              </div>
            </div>
            <p className="mt-5 text-[13px] text-gray-500 leading-relaxed max-w-3xl">
              Another company could look completely different — a founder with customers and capital
              might hold 40%, a studio-built idea might start differently. Ownership follows
              contribution, IP, technology, capital, experience, risk, vesting and milestones.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
