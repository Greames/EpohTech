import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

export default function TeamPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>The Team</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Operators first.</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">Investors second.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            Anvaya Partners is led by builders — people who spent years inside real systems and
            real businesses before ever writing a cheque.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Reveal>
            <div
              data-testid="team-founder-card"
              className="h-full rounded-3xl border border-champagne/25 bg-charcoal/60 p-8 sm:p-12"
            >
              <div className="flex items-center gap-5">
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-champagne/15 border border-champagne/30 font-mono font-bold text-xl text-champagne shrink-0">
                  AP
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">[Founder Name]</h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">Founder &amp; Managing Partner</p>
                </div>
              </div>
              <blockquote className="mt-8 border-l-2 border-champagne/50 pl-5 text-sm sm:text-base text-gray-300 leading-relaxed italic">
                "A decade of building and integrating enterprise systems for large organisations,
                now applying that same discipline to building companies."
              </blockquote>
              <p className="mt-6 text-sm text-gray-400 leading-relaxed">
                [Founder bio — background, previous companies, areas of focus.]
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div
              data-testid="team-partner-placeholder"
              className="h-full rounded-3xl border border-dashed border-white/15 bg-obsidian/50 p-8 sm:p-12 flex flex-col"
            >
              <div className="flex items-center gap-5">
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-500 shrink-0">
                  <Sparkles size={28} strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">[Partner / Team Member]</h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">[Role]</p>
                </div>
              </div>
              <p className="mt-8 text-sm text-gray-400 leading-relaxed flex-1">
                [Add other partners or team members here — name, role, one-line background.]
              </p>
              <Link
                to="/founders"
                data-testid="team-build-link"
                className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-champagne/50 text-champagne font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagne hover:text-obsidian transition-colors duration-300"
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
