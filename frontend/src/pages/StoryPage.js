import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";
import OriginStoryTimeline from "@/components/OriginStoryTimeline";
import StoryMeaningSection from "@/components/StoryMeaningSection";

const PROCESS = ["Idea", "Screen", "Market Research", "Validation", "Founder", "Business Model", "Capital", "Build", "Launch", "Traction", "Scale", "Follow-On Capital", "Exit / Spin-Off / Long-Term"];

const PHILOSOPHY = [
  { title: "Flexible Ownership", body: "No hard-coded equity splits. Ownership reflects what each party brings — idea, capital, IP, technology, customers, experience, commitment and risk. Every venture's cap table is designed, not defaulted." },
  { title: "Builders, Not Brokers", body: "We are not a fund, a broker or a marketplace. We co-build companies and stay in the trenches from validation through scale." },
  { title: "Shared Infrastructure", body: "Technology through EPOHTECH, capital through our investor network, and thirteen operating capabilities through the studio — every venture inherits all of it." },
  { title: "Honest About Risk", body: "We never promise returns, exits or allocations. We promise process, transparency and work." },
];

export default function StoryPage() {
  return (
    <div className="pt-32 md:pt-44">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Our Story</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Two salaries.</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">One decision.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            Why we exist: because building a company should not require doing everything alone.
            Second Salary Capital is the ecosystem we wish we had when we started with our second
            month's pay.
          </p>
        </Reveal>
      </div>

      <OriginStoryTimeline />
      <StoryMeaningSection />

      <section className="py-24 md:py-32 border-t border-white/5" data-testid="philosophy-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>Philosophy</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
              How we think about <span className="text-champagne">building.</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {PHILOSOPHY.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.1}>
                <div data-testid={`philosophy-${p.title.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="h-full rounded-3xl border border-white/5 bg-charcoal/50 p-8 sm:p-10 hover:border-champagne/25 transition-colors duration-500">
                  <h3 className="text-xl font-bold text-white tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-white/5 bg-charcoal/30" data-testid="process-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>How We Build</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
              Every venture runs the <span className="text-champagne">same gauntlet.</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {PROCESS.map((step, i) => (
              <Reveal key={step} delay={(i % 4) * 0.06}>
                <div
                  data-testid={`process-step-${step.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-obsidian/60 px-5 py-4 hover:border-champagne/30 transition-colors duration-300"
                >
                  <span className="font-mono text-xs text-champagne/70 w-7 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-medium text-gray-200">{step}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-16 text-center">
            <Link
              to="/build"
              data-testid="story-build-with-us-button"
              className="group inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-9 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 gold-glow"
            >
              START YOUR CHAPTER <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
