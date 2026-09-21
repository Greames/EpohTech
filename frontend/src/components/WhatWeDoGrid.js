import { Reveal, Eyebrow } from "@/components/Reveal";
import { Lightbulb, Users, Banknote, Wrench } from "lucide-react";

const pillars = [
  {
    num: "01",
    icon: Lightbulb,
    title: "Idea",
    body: "Identify and validate opportunities through market research, sizing and real customer signals — before anyone writes code.",
  },
  {
    num: "02",
    icon: Users,
    title: "Founders",
    body: "Find people with the domain expertise, conviction and full-time commitment capable of building them.",
  },
  {
    num: "03",
    icon: Banknote,
    title: "Capital",
    body: "Connect businesses with appropriate capital from a network of 80+ onboarded investors, from ₹10L to ₹10Cr opportunities.",
  },
  {
    num: "04",
    icon: Wrench,
    title: "Build",
    body: "Technology, AI, people, systems and support — the shared operating infrastructure that turns a plan into a company.",
  },
];

export default function WhatWeDoGrid() {
  return (
    <section data-testid="what-we-do" className="py-24 md:py-36 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>What We Do</Eyebrow>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
            We don't just invest in companies.
            <br />
            <span className="text-champagne">We help build them.</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.1}>
              <div
                data-testid={`pillar-${p.title.toLowerCase()}`}
                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-charcoal/60 p-8 sm:p-12 h-full hover:border-champagne/30 transition-colors duration-500"
              >
                <span
                  className="absolute -top-6 -right-2 font-mono font-bold text-[7rem] leading-none text-white/[0.04] group-hover:text-champagne/10 transition-colors duration-700 select-none"
                  aria-hidden="true"
                >
                  {p.num}
                </span>
                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/10 text-champagne border border-champagne/20">
                    <p.icon size={22} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-8 text-2xl font-bold text-white tracking-tight">{p.title}</h3>
                  <p className="mt-4 text-gray-400 leading-relaxed text-sm sm:text-base max-w-md">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
