import { Link } from "react-router-dom";
import { ArrowUpRight, Cpu, Sparkles } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

export default function TeamPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>The Team</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>The people who bet</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">their second salary.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            Second Salary Capital is led by the person who lived the story the company is named
            after — and backed by a technology partner that builds like an owner.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Reveal>
            <div
              data-testid="team-founder-tulasi"
              className="h-full rounded-3xl border border-champagne/25 bg-charcoal/60 p-8 sm:p-10 gold-glow"
            >
              <div className="flex items-center gap-5">
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-champagne/15 border border-champagne/30 font-mono font-bold text-2xl text-champagne shrink-0">
                  TR
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Tulasi Reddy</h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">Founder</p>
                </div>
              </div>
              <blockquote className="mt-8 border-l-2 border-champagne/50 pl-5 text-sm sm:text-base text-gray-300 leading-relaxed italic">
                "My first salary went to my parents and to God. My second salary started a company.
                Second Salary Capital exists so your second salary — whatever yours looks like —
                can start yours."
              </blockquote>
              <p className="mt-6 text-sm text-gray-400 leading-relaxed">
                Tulasi leads venture strategy, founder partnerships and the investor network —
                from the first screening call to the day a company stands on its own. The studio's
                rule comes straight from that founding act: conviction first, capital second,
                gratitude always.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div
              data-testid="team-epohtech"
              className="h-full rounded-3xl border border-epoh/25 bg-epoh/5 p-8 sm:p-10"
            >
              <div className="flex items-center gap-5">
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-epoh/10 border border-epoh/30 text-epoh shrink-0">
                  <Cpu size={30} strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">EPOHTECH</h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-epoh">Technology Partner</p>
                </div>
              </div>
              <p className="mt-8 text-sm sm:text-base text-gray-300 leading-relaxed">
                An established technology company — not an internal department — providing every
                venture with software, AI, automation, ERP, cloud and IT support from day one.
              </p>
              <Link
                to="/epohtech"
                data-testid="team-epohtech-link"
                className="group mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-epoh hover:text-purple-300 transition-colors duration-300"
              >
                Meet the technology team <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div
              data-testid="team-join-card"
              className="h-full rounded-3xl border border-dashed border-white/15 bg-obsidian/50 p-8 sm:p-10 flex flex-col"
            >
              <div className="flex items-center gap-5">
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-500 shrink-0">
                  <Sparkles size={30} strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">You?</h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">Next Founder</p>
                </div>
              </div>
              <p className="mt-8 text-sm sm:text-base text-gray-400 leading-relaxed flex-1">
                Every venture we build needs someone willing to lead it. If you have the idea,
                the expertise or the business — this card is waiting for your name.
              </p>
              <Link
                to="/build"
                data-testid="team-join-build-button"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300 gold-glow"
              >
                BUILD WITH US <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
