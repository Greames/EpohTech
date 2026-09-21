import InsightsSection from "@/components/InsightsSection";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

export default function InsightsPage() {
  return (
    <div className="pt-32 md:pt-44 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Insights</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Notes from</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">the build floor.</span></MaskedLine>
          </h1>
        </Reveal>
      </div>
      <InsightsSection />
    </div>
  );
}
