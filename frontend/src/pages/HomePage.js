import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import KineticHero from "@/components/KineticHero";
import HeroMetricCounters from "@/components/HeroMetricCounters";
import OriginStoryTimeline from "@/components/OriginStoryTimeline";
import WhatWeDoGrid from "@/components/WhatWeDoGrid";
import SupportEcosystemGrid from "@/components/SupportEcosystemGrid";
import EditorialMarquee from "@/components/EditorialMarquee";
import EpohTechSection from "@/components/EpohTechSection";
import InsightsSection from "@/components/InsightsSection";
import { Reveal, Eyebrow } from "@/components/Reveal";

const FOUNDER_STEPS = ["Idea", "Validation", "Founder", "Capital", "Build", "Scale"];
const INVESTOR_INFO = ["Business", "Stage", "Industry", "Capital Requirement", "Progress", "Founder", "Opportunity Docs"];

export default function HomePage() {
  return (
    <>
      <KineticHero />
      <HeroMetricCounters />
      <OriginStoryTimeline />
      <EditorialMarquee />
      <WhatWeDoGrid />
      <SupportEcosystemGrid compact />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-8 text-right">
        <Link
          to="/support"
          data-testid="see-all-support-link"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-champagne hover:text-champagneBright transition-colors duration-300"
        >
          All 13 capabilities <ArrowRight size={14} />
        </Link>
      </div>
      <EpohTechSection />

      <section data-testid="founder-cta-section" className="py-24 md:py-36 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <Eyebrow>For Founders</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
              Have an idea <span className="text-champagne">worth building?</span>
            </h2>
            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
              Bring your idea, experience or opportunity. We'll help you explore what it can become —
              with validation, capital, technology and a team behind you.
            </p>
            <Link
              to="/build"
              data-testid="founder-section-build-button"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-9 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 gold-glow"
            >
              BUILD WITH US
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-wrap items-center gap-3">
              {FOUNDER_STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-3" data-testid={`founder-step-${s.toLowerCase()}`}>
                  <span className="rounded-full border border-champagne/30 bg-champagne/5 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-champagne">
                    {s}
                  </span>
                  {i < FOUNDER_STEPS.length - 1 && <ArrowRight size={14} className="text-gray-600" />}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section data-testid="investor-cta-section" className="py-24 md:py-36 border-t border-white/5 bg-charcoal/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal delay={0.15} className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {INVESTOR_INFO.map((s) => (
                <div
                  key={s}
                  data-testid={`investor-info-${s.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="rounded-2xl border border-white/5 bg-obsidian/60 px-5 py-4 hover:border-champagne/25 transition-colors duration-300"
                >
                  <span className="text-sm text-gray-300 font-medium">{s}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <Eyebrow>For Investors</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
              Be part of the companies <span className="text-champagne">we build.</span>
            </h2>
            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
              Explore structured opportunities being developed through the Second Salary Capital
              ecosystem — with the documentation to evaluate them properly.
            </p>
            <Link
              to="/investors"
              data-testid="investor-section-join-button"
              className="group mt-10 inline-flex items-center gap-2 rounded-full border border-champagne/50 text-champagne font-bold tracking-wide px-9 py-4 text-sm hover:bg-champagne hover:text-obsidian transition-colors duration-300"
            >
              JOIN THE INVESTOR NETWORK
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <InsightsSection />
    </>
  );
}
