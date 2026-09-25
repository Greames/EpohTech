import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, BrainCircuit, Cloud, Blocks, BarChart3, MonitorCheck } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const STATS = [
  { value: "₹1.5 Cr", label: "Revenue", note: "Earned within two years of launch", testId: "epoh-stat-revenue" },
  { value: "2 years", label: "To Prove the Model", note: "From zero to a self-sustaining platform", testId: "epoh-stat-years" },
  { value: "Less", label: "Outside Investment", note: "Built capital-efficiently — the Anvaya way", testId: "epoh-stat-investment" },
];

const CAPABILITIES = [
  { icon: Code2, title: "Software Development", body: "Web platforms, internal tools and business applications designed for operations, not demos." },
  { icon: BrainCircuit, title: "AI & Automation", body: "Applied AI and workflow automation that remove manual work from sales, finance and operations." },
  { icon: Cloud, title: "Cloud & Infrastructure", body: "Dependable architecture that scales from first customer to full operation." },
  { icon: Blocks, title: "Integrations", body: "APIs, ERP, CRM and third-party systems wired into one coherent stack." },
  { icon: BarChart3, title: "Data & Analytics", body: "Dashboards and KPIs that turn day-to-day operations into decisions." },
  { icon: MonitorCheck, title: "Ongoing IT Support", body: "The unglamorous, essential work that keeps a company running every single day." },
];

export default function EpohTechPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Built by Anvaya Partners</Eyebrow>
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[0.98]">
            <MaskedLine delay={0.15}><span>EPOH<span className="text-champagne">TECH</span></span></MaskedLine>
          </h1>
          <MaskedLine delay={0.3}>
            <p className="mt-6 text-xl sm:text-2xl font-bold text-white tracking-tight">
              Proof, in revenue — not in pitch decks.
            </p>
          </MaskedLine>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
            Before Anvaya Partners asked anyone to trust its model, it ran the model on itself.
            EPOHTECH is the result: a technology platform built capital-efficiently, now the
            technology partner to every company we back.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5" data-testid="epoh-stats">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div data-testid={s.testId} className="rounded-3xl border border-champagne/20 bg-charcoal/60 p-8 sm:p-10 h-full">
                <p className="font-mono font-bold text-4xl sm:text-5xl text-champagne tracking-tight">{s.value}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400">{s.label}</p>
                <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow>The Story</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              We built the machine <span className="text-champagne">before selling the ride.</span>
            </h2>
          </Reveal>
          <div className="lg:col-span-7 space-y-6">
            <Reveal delay={0.1}>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                EPOHTECH started the way we believe every good company should start: with real work
                for real customers, funded carefully, built to sustain itself. No growth-at-all-costs,
                no burn chasing headlines.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Within two years it reached ₹1.5 Cr in revenue — with less investment than most
                companies spend finding their footing. That is the capital-efficient, operator-led
                approach Anvaya Partners brings to every company it backs: evidence first,
                capital second, sustainability always.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Today, EPOHTECH provides technology support to all Anvaya Partners companies —
                so every founder we back starts with a proven engineering and systems capability
                behind them, from day one.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-24">
          <Reveal>
            <Eyebrow>What It Does</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              Technology, handled.
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 0.08}>
                <div
                  data-testid={`epoh-capability-${c.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="group h-full rounded-2xl border border-white/5 bg-charcoal/50 p-7 hover:border-champagne/25 hover:-translate-y-1 transition-all duration-500"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-champagne/10 text-champagne border border-champagne/20">
                    <c.icon size={19} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-white tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Reveal>
            <div data-testid="epoh-for-founders" className="h-full rounded-3xl border border-white/5 bg-charcoal/50 p-8 sm:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">For Founders</p>
              <h3 className="mt-4 text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Start with a technology team, not a hiring problem.
              </h3>
              <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                Founders backed by Anvaya Partners get EPOHTECH's platform and people behind their
                product from day one — so capital goes into the business, not into rebuilding
                basic systems.
              </p>
              <Link
                to="/founders"
                data-testid="epoh-apply-button"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300"
              >
                APPLY AS A FOUNDER <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div data-testid="epoh-for-investors" className="h-full rounded-3xl border border-white/5 bg-charcoal/50 p-8 sm:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">For Investors</p>
              <h3 className="mt-4 text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Execution risk, reduced before you commit.
              </h3>
              <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                Most early-stage risk is execution risk. With EPOHTECH delivering technology across
                the portfolio, the companies you review have already cleared the hardest operational
                hurdle — with the revenue to prove the model works.
              </p>
              <Link
                to="/investors"
                data-testid="epoh-partner-button"
                className="group mt-8 inline-flex items-center gap-2 rounded-full border border-champagne/50 text-champagne font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagne hover:text-obsidian transition-colors duration-300"
              >
                PARTNER AS AN INVESTOR <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
