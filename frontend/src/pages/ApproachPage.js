import { Scale, Wrench, Clock, Compass, Search, Banknote, Handshake } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const PILLARS = [
  {
    icon: Scale,
    num: "01",
    title: "Capital-Efficient",
    body: "We back businesses built to reach sustainable revenue early — not ones that burn cash chasing growth. Discipline with money is a strategy, not a constraint.",
    points: ["Sustainable revenue early", "Honest unit economics", "Growth funded by evidence, not hope"],
  },
  {
    icon: Wrench,
    num: "02",
    title: "Operator-Led",
    body: "We have built real systems and real businesses ourselves. That experience goes into every company we back — in the details, not just the boardroom.",
    points: ["Strategy and business model", "Technology and systems", "Finance, operations, go-to-market"],
  },
  {
    icon: Clock,
    num: "03",
    title: "Long-Term",
    body: "We partner for years, not quarters. Our structures, expectations and involvement are designed around the time real companies actually take to build.",
    points: ["Years, not quarters", "Beyond the first cheque", "Alignment over speed"],
  },
];

const PROCESS = [
  { icon: Compass, name: "Discover", body: "We meet founders and understand the opportunity in its own terms — the market, the problem, and the person." },
  { icon: Search, name: "Evaluate", body: "We test the market, the model and the founder rigorously. If the evidence is not there, we say so early and honestly." },
  { icon: Banknote, name: "Invest", body: "We commit our own capital with a clear, fair structure that both sides understand completely." },
  { icon: Handshake, name: "Build Together", body: "Then the real work: strategy, technology, finance, operations and go-to-market — side by side with the founder." },
];

const VALUES = [
  { name: "Conviction", body: "We only back what we believe in enough to own ourselves." },
  { name: "Partnership", body: "We work inside the company, next to the founder." },
  { name: "Discipline", body: "Evidence over enthusiasm. Always." },
  { name: "Integrity", body: "Plain dealing, honest numbers, kept commitments." },
];

export default function ApproachPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Our Approach</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>How we choose.</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">How we build.</span></MaskedLine>
          </h1>
        </Reveal>

        <div className="mt-16 space-y-6">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div
                data-testid={`approach-pillar-${p.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="rounded-3xl border border-white/5 bg-charcoal/50 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 hover:border-champagne/25 transition-colors duration-500"
              >
                <div className="lg:col-span-1">
                  <span className="font-mono text-sm text-champagne/60">{p.num}</span>
                </div>
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/10 text-champagne border border-champagne/20 shrink-0">
                      <p.icon size={22} strokeWidth={1.75} />
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{p.title}</h2>
                  </div>
                  <p className="mt-5 text-gray-400 text-sm sm:text-base leading-relaxed">{p.body}</p>
                </div>
                <div className="lg:col-span-6 flex flex-col justify-center">
                  <ul className="space-y-3">
                    {p.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm text-gray-300">
                        <span className="mt-2 h-1.5 w-1.5 rotate-45 bg-champagne/60 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24">
          <Reveal>
            <Eyebrow>The Process</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              Discover → Evaluate → Invest → <span className="text-champagne">Build together.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="approach-process">
            {PROCESS.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.08}>
                <div data-testid={`approach-step-${s.name.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-2xl border border-white/5 bg-charcoal/40 p-6 h-full">
                  <div className="flex items-center justify-between">
                    <s.icon size={18} className="text-champagne" strokeWidth={1.75} />
                    <span className="font-mono text-[10px] text-gray-600">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-white tracking-tight">{s.name}</h3>
                  <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <Reveal>
            <Eyebrow>Values</Eyebrow>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="approach-values">
            {VALUES.map((v, i) => (
              <Reveal key={v.name} delay={i * 0.08}>
                <div data-testid={`value-${v.name.toLowerCase()}`} className="rounded-2xl border border-champagne/20 bg-champagne/5 p-7 h-full">
                  <h3 className="text-lg font-extrabold text-champagne tracking-tight">{v.name}</h3>
                  <p className="mt-3 text-[13px] text-gray-400 leading-relaxed">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
