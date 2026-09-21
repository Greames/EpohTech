import FounderApplicationForm from "@/components/FounderApplicationForm";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const STAGES = ["Submitted", "Screening", "Shortlisted", "Discovery", "Validation", "Founder Review", "Decision"];

export default function BuildPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Founder Application</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Build <span className="text-champagne">with us.</span></span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            An idea, an opportunity, deep industry expertise, or an existing business that needs
            capital and technology to scale — bring it here. Every application moves through a
            defined pipeline:
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-2 max-w-3xl" data-testid="build-pipeline-stages">
            {STAGES.map((s) => (
              <span key={s} className="font-mono text-[10px] uppercase tracking-[0.18em] rounded-full border border-white/10 bg-white/5 text-gray-400 px-4 py-2">
                {s}
              </span>
            ))}
          </div>
        </Reveal>
        <div className="mt-14 max-w-4xl">
          <FounderApplicationForm />
        </div>
      </div>
    </div>
  );
}
