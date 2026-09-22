import InvestorRegistrationForm from "@/components/InvestorRegistrationForm";
import ValueFlowSection from "@/components/ValueFlowSection";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";
import { FileSearch, Users2, TrendingUp, MessageSquare } from "lucide-react";

const PROMISES = [
  { icon: FileSearch, title: "Structured Information", body: "Business model, market research, capital requirement, traction and documentation — organised for real evaluation." },
  { icon: Users2, title: "Founder Access", body: "Know who is building. Founder backgrounds, domain expertise and commitment, presented openly." },
  { icon: TrendingUp, title: "Progress Visibility", body: "Stage-by-stage updates as ventures move from validation through launch and scale." },
  { icon: MessageSquare, title: "Direct Communication", body: "A channel to the venture and the studio — questions answered before decisions." },
];

export default function InvestorsPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-end">
          <Reveal>
            <Eyebrow>Investor Network</Eyebrow>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
              <MaskedLine delay={0.15}><span>Invest in what</span></MaskedLine>
              <MaskedLine delay={0.3}><span className="text-champagne">we build next.</span></MaskedLine>
            </h1>
            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-lg">
              Join 80+ investors already inside the ecosystem. Registration → verification →
              approved access to venture opportunities in the ₹10L–₹10Cr range.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROMISES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div data-testid={`investor-promise-${p.title.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="rounded-2xl border border-white/5 bg-charcoal/50 p-5 h-full">
                  <p.icon size={18} className="text-champagne" strokeWidth={1.75} />
                  <h3 className="mt-3 text-sm font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-14 max-w-4xl">
          <InvestorRegistrationForm />
        </div>
      </div>
      <ValueFlowSection />
    </div>
  );
}
