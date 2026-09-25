import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const BELIEFS = [
  {
    title: "Own capital, real conviction",
    body: "We invest from our own balance sheet. When we back a company, it is because we believe in it enough to stand behind it ourselves — not because we are deploying someone else's fund.",
  },
  {
    title: "Hands-on, not hands-off",
    body: "Strategy, technology, finance, operations and go-to-market — we work alongside founders inside the business, bringing a decade of enterprise systems experience to every engagement.",
  },
  {
    title: "Built for the long term",
    body: "We partner for years, not quarters. Sustainable revenue early, honest unit economics, and structures designed to survive contact with reality.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>About Anvaya Partners</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Bringing together</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">capital and founders.</span></MaskedLine>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 rounded-3xl border border-champagne/20 bg-charcoal/50 p-8 sm:p-14 text-center" data-testid="about-name-meaning">
            <p className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white">अन्वय</p>
            <p className="mt-4 text-xl sm:text-2xl font-bold text-champagne tracking-tight">
              Anvaya — Sanskrit for "bringing together."
            </p>
            <p className="mt-5 text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Founders with ambition. Investors with conviction. And a partner committed to both.
            </p>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Who We Are</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              An early-stage investment firm that does the work.
            </h2>
            <p className="mt-6 text-gray-400 text-base leading-relaxed">
              Anvaya Partners Private Limited, Hyderabad, India. We invest our own capital in early-stage
              startups and work hands-on with their founders — on strategy, technology, finance,
              operations and go-to-market.
            </p>
            <p className="mt-4 text-gray-400 text-base leading-relaxed">
              Our first companies launch in 2026. We are building deliberately: few companies,
              deep involvement, long partnerships.
            </p>
          </Reveal>
          <div className="lg:col-span-7 space-y-5">
            {BELIEFS.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.1}>
                <div data-testid={`about-belief-${i + 1}`} className="rounded-2xl border border-white/5 bg-charcoal/50 p-7 sm:p-9 hover:border-champagne/25 transition-colors duration-500">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{b.title}</h3>
                  <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl border border-champagne/20 bg-charcoal/50 p-8 sm:p-12" data-testid="about-proof">
            <Eyebrow>Proof, Not Promises</Eyebrow>
            <h3 className="mt-5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              EPOHTECH — ₹1.5 Cr revenue in two years.
            </h3>
            <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Our own technology platform, built capital-efficiently with less investment. EPOHTECH
              is now the technology partner to every Anvaya Partners company — the operator-led
              model, proven on ourselves first.{" "}
              <Link to="/epohtech" className="text-champagne underline underline-offset-2 hover:text-champagneBright transition-colors duration-300" data-testid="about-epohtech-link">
                Read the EPOHTECH story
              </Link>.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-20">
          <div className="rounded-3xl border border-white/5 bg-charcoal/40 p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Read how we work.</h3>
              <p className="mt-2 text-sm text-gray-400">Our approach, our process, and the values behind both.</p>
            </div>
            <Link
              to="/approach"
              data-testid="about-approach-link"
              className="group inline-flex items-center gap-2 rounded-full border border-champagne/50 text-champagne font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagne hover:text-obsidian transition-colors duration-300 shrink-0"
            >
              OUR APPROACH <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
