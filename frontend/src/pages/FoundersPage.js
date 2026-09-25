import FounderApplicationForm from "@/components/FounderApplicationForm";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const WHAT_YOU_GET = [
  { title: "Capital from our own balance sheet", body: "No fund timelines, no external approvals. When we believe in a company, we commit our own money." },
  { title: "Hands-on support", body: "Strategy, finance, operations and go-to-market — plus technology through EPOHTECH, our own proven technology platform." },
  { title: "A verified investor network", body: "Introductions to investors we know and have verified, when your company is ready for more." },
  { title: "A long-term partner", body: "We stay beyond the first cheque — years, not quarters." },
];

export default function FoundersPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <Reveal>
            <Eyebrow>For Founders</Eyebrow>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
              <MaskedLine delay={0.15}><span>A partner,</span></MaskedLine>
              <MaskedLine delay={0.3}><span className="text-champagne">not just a cheque.</span></MaskedLine>
            </h1>
            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
              Tell us about your company. If there is a fit, we invest our own capital and work
              alongside you — from strategy to systems to your first sustainable revenue.
            </p>
          </Reveal>
          <div className="space-y-4">
            {WHAT_YOU_GET.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.08}>
                <div data-testid={`founders-benefit-${i + 1}`} className="rounded-2xl border border-white/5 bg-charcoal/50 p-6">
                  <h3 className="text-base font-bold text-white tracking-tight">{w.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-14 max-w-4xl">
          <FounderApplicationForm />
        </div>
      </div>
    </div>
  );
}
