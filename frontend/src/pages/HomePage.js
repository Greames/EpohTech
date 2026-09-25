import { Link } from "react-router-dom";
import { ArrowUpRight, Scale, Wrench, Clock, Compass, Search, Banknote, Handshake } from "lucide-react";
import KineticHero from "@/components/KineticHero";
import EditorialMarquee from "@/components/EditorialMarquee";
import InsightsSection from "@/components/InsightsSection";
import { Reveal, Eyebrow } from "@/components/Reveal";

const PILLARS = [
  {
    icon: Scale,
    title: "Capital-Efficient",
    body: "We back businesses built to reach sustainable revenue early — not ones that burn cash chasing growth.",
    testId: "pillar-capital-efficient",
  },
  {
    icon: Wrench,
    title: "Operator-Led",
    body: "We've built real systems and businesses ourselves, and we bring that experience into every company we back.",
    testId: "pillar-operator-led",
  },
  {
    icon: Clock,
    title: "Long-Term",
    body: "We partner for years, not quarters. Our horizon matches the time real companies take to build.",
    testId: "pillar-long-term",
  },
];

const PROCESS = [
  { icon: Compass, name: "Discover", body: "Meet founders and understand the opportunity in its own terms." },
  { icon: Search, name: "Evaluate", body: "Test the market, the model and the founder — rigorously and honestly." },
  { icon: Banknote, name: "Invest", body: "Commit our own capital with a clear, fair structure." },
  { icon: Handshake, name: "Build Together", body: "Work inside the company on strategy, technology, finance and go-to-market." },
];

const VALUES = ["Conviction", "Partnership", "Discipline", "Integrity"];

export default function HomePage() {
  return (
    <>
      <KineticHero />
      <EditorialMarquee />

      <section data-testid="name-meaning-section" className="py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.35em] text-champagne">The Name</p>
            <p className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white" data-testid="anvaya-devanagari">
              अन्वय
            </p>
            <h2 className="mt-6 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Anvaya — Sanskrit for <span className="text-champagne">"bringing together."</span>
            </h2>
            <p className="mt-8 text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Founders with ambition. Investors with conviction. And a partner committed to both.
              That is the whole idea behind Anvaya Partners.
            </p>
          </Reveal>
        </div>
      </section>

      <section data-testid="approach-section" className="py-24 md:py-36 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <Eyebrow>Our Approach</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
              Calm capital. <span className="text-champagne">Serious building.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div
                  data-testid={p.testId}
                  className="h-full rounded-3xl border border-white/5 bg-charcoal/60 p-8 sm:p-10 hover:border-champagne/25 transition-colors duration-500"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/10 text-champagne border border-champagne/20">
                    <p.icon size={22} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-7 text-xl sm:text-2xl font-bold text-white tracking-tight">{p.title}</h3>
                  <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="process-strip">
            {PROCESS.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.08}>
                <div data-testid={`process-${s.name.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-2xl border border-white/5 bg-charcoal/40 p-6 h-full">
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

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap justify-center gap-2.5" data-testid="values-chips">
              {VALUES.map((v) => (
                <span key={v} className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] rounded-full border border-champagne/25 bg-champagne/5 text-champagne px-5 py-2.5">
                  {v}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section data-testid="audiences-section" className="py-24 md:py-36 border-t border-white/5 bg-charcoal/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <Eyebrow>Partner With Us</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
              Two doors into <span className="text-champagne">Anvaya Partners.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Reveal>
              <div data-testid="audience-founders" className="h-full flex flex-col rounded-3xl border border-white/5 bg-obsidian/70 p-8 sm:p-12 hover:border-champagne/25 transition-colors duration-500">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">For Founders</p>
                <h3 className="mt-5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  More than a cheque.
                </h3>
                <ul className="mt-7 space-y-4 flex-1">
                  {[
                    "Capital from our own balance sheet",
                    "Hands-on support across strategy, technology, finance and operations",
                    "Introductions to our verified investor network",
                    "A long-term partner beyond the first cheque",
                  ].map((point) => (
                    <li key={point} className="flex gap-3 text-sm sm:text-base text-gray-400 leading-relaxed">
                      <span className="mt-2.5 h-1.5 w-1.5 rotate-45 bg-champagne/60 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/founders"
                  data-testid="audience-apply-founder-button"
                  className="group mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300"
                >
                  APPLY AS A FOUNDER
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div data-testid="audience-investors" className="h-full flex flex-col rounded-3xl border border-white/5 bg-obsidian/70 p-8 sm:p-12 hover:border-champagne/25 transition-colors duration-500">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">For Investors</p>
                <h3 className="mt-5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Two ways to partner.
                </h3>
                <ul className="mt-7 space-y-4 flex-1">
                  <li className="flex gap-3 text-sm sm:text-base text-gray-400 leading-relaxed">
                    <span className="mt-2.5 h-1.5 w-1.5 rotate-45 bg-champagne/60 shrink-0" />
                    <span><strong className="text-white">Back individual companies</strong> — join our private, verification-based investor network and review curated opportunities privately.</span>
                  </li>
                  <li className="flex gap-3 text-sm sm:text-base text-gray-400 leading-relaxed">
                    <span className="mt-2.5 h-1.5 w-1.5 rotate-45 bg-champagne/60 shrink-0" />
                    <span><strong className="text-white">Invest in Anvaya Partners</strong> — back the firm itself and gain exposure to every company we invest in and build.</span>
                  </li>
                  <li className="flex gap-3 text-sm sm:text-base text-gray-500 leading-relaxed">
                    <span className="mt-2.5 h-1.5 w-1.5 rotate-45 bg-white/20 shrink-0" />
                    Anvaya Partners does not manage or pool investors' money.
                  </li>
                </ul>
                <Link
                  to="/investors"
                  data-testid="audience-partner-investor-button"
                  className="group mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-champagne/50 text-champagne font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagne hover:text-obsidian transition-colors duration-300"
                >
                  PARTNER AS AN INVESTOR
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section data-testid="portfolio-preview" className="py-24 md:py-36 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal className="max-w-2xl">
              <Eyebrow>Track Record &amp; Portfolio</Eyebrow>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
                Built first. <span className="text-champagne">Proven first.</span>
              </h2>
              <p className="mt-5 text-gray-400 text-base leading-relaxed">
                Before asking anyone to trust our model, we ran it ourselves: EPOHTECH, our own
                technology platform, reached ₹1.5 Cr revenue within two years — built
                capital-efficiently, with minimal outside investment. It now provides technology
                support to every company we back.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                to="/portfolio"
                data-testid="portfolio-preview-link"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-champagne hover:text-champagneBright transition-colors duration-300"
              >
                View portfolio <ArrowUpRight size={14} />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal>
              <div data-testid="portfolio-preview-epohtech" className="rounded-3xl border border-champagne/25 bg-charcoal/60 p-8 h-full">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-champagne">Operating · Built by us</span>
                <h3 className="mt-5 text-xl font-extrabold text-white tracking-tight">EPOHTECH</h3>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                  Technology platform and partner to all Anvaya Partners companies. ₹1.5 Cr revenue
                  in two years, with less investment.
                </p>
              </div>
            </Reveal>
            {["[Company 1 — one-line description]", "[Company 2 — one-line description]"].map((c, i) => (
              <Reveal key={c} delay={(i + 1) * 0.1}>
                <div data-testid={`portfolio-preview-${i + 1}`} className="rounded-3xl border border-white/5 bg-charcoal/50 p-8 h-full">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-champagne">Launching 2026</span>
                  <p className="mt-5 text-base sm:text-lg text-gray-200 font-semibold leading-relaxed">{c}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section data-testid="team-preview" className="py-24 md:py-32 border-t border-white/5 bg-charcoal/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl border border-white/5 bg-obsidian/70 p-8 sm:p-12 flex flex-col md:flex-row gap-8 items-start">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-champagne/15 border border-champagne/30 font-mono font-bold text-xl text-champagne shrink-0">
                AP
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">Leadership</p>
                <h3 className="mt-3 text-2xl font-extrabold text-white tracking-tight">
                  [Founder Name] — Founder &amp; Managing Partner
                </h3>
                <blockquote className="mt-4 border-l-2 border-champagne/50 pl-5 text-sm sm:text-base text-gray-300 leading-relaxed italic">
                  "A decade of building and integrating enterprise systems for large organisations,
                  now applying that same discipline to building companies."
                </blockquote>
                <Link
                  to="/team"
                  data-testid="team-preview-link"
                  className="group mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-champagne hover:text-champagneBright transition-colors duration-300"
                >
                  Meet the team <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <InsightsSection />
    </>
  );
}
