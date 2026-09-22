import { Reveal, Eyebrow } from "@/components/Reveal";
import { Hammer, Banknote } from "lucide-react";
import { Link } from "react-router-dom";

const PANELS = [
  {
    icon: Hammer,
    audience: "For Founders",
    headline: "We've stood exactly where you're standing.",
    testId: "story-meaning-founders",
    points: [
      "We started with one month's salary, not a fund. Hustle and domain knowledge earn respect here — not pedigree or polished decks.",
      "Because we bootstrapped first, we know which parts of building are lonely. That's why we show up with capital, technology and operations — not advice.",
      "We will never ask you to take a risk we haven't already taken ourselves.",
    ],
    cta: { label: "BUILD WITH US", path: "/build", testId: "story-meaning-build-button" },
  },
  {
    icon: Banknote,
    audience: "For Investors",
    headline: "We spent our own money before we'll ever touch yours.",
    testId: "story-meaning-investors",
    points: [
      "The founders of this studio proved their discipline with their own salaries first. That discipline runs every venture: validation before capital, milestones before more capital.",
      "Skin in the game isn't a slogan here — it's the founding act of the company.",
      "Every rupee is treated like a second salary: hard-earned, and not to be wasted.",
    ],
    cta: { label: "INVEST WITH US", path: "/investors", testId: "story-meaning-invest-button" },
  },
];

export default function StoryMeaningSection() {
  return (
    <section data-testid="story-meaning-section" className="py-24 md:py-32 border-t border-white/5 bg-charcoal/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Why It Matters</Eyebrow>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
            A nice story is not the point.
            <br />
            <span className="text-champagne">What it proves is the point.</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PANELS.map((p, i) => (
            <Reveal key={p.audience} delay={i * 0.12}>
              <div
                data-testid={p.testId}
                className="group h-full flex flex-col rounded-3xl border border-white/5 bg-obsidian/70 p-8 sm:p-12 hover:border-champagne/30 transition-colors duration-500"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/10 text-champagne border border-champagne/20 shrink-0">
                    <p.icon size={22} strokeWidth={1.75} />
                  </span>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">{p.audience}</p>
                </div>
                <h3 className="mt-7 text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {p.headline}
                </h3>
                <ul className="mt-7 space-y-4 flex-1">
                  {p.points.map((point) => (
                    <li key={point.slice(0, 28)} className="flex gap-3 text-sm sm:text-base text-gray-400 leading-relaxed">
                      <span className="mt-2.5 h-1.5 w-1.5 rotate-45 bg-champagne/60 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  to={p.cta.path}
                  data-testid={p.cta.testId}
                  className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-champagne/40 text-champagne font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagne hover:text-obsidian transition-colors duration-300"
                >
                  {p.cta.label}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
