import { motion } from "framer-motion";
import { Reveal, Eyebrow } from "@/components/Reveal";
import { Users, Banknote, Cpu, ArrowDown, ArrowRight } from "lucide-react";

const PARTIES = [
  {
    icon: Users,
    name: "Founders",
    gives: "Leadership & Execution",
    body: "Domain experts and operators who run the venture day-to-day and own the outcome.",
    testId: "ecosystem-party-founders",
  },
  {
    icon: Banknote,
    name: "Investors",
    gives: "Capital & Strategy",
    body: "80+ onboarded investors providing capital, introductions and strategic support.",
    testId: "ecosystem-party-investors",
  },
  {
    icon: Cpu,
    name: "EPOHTECH",
    gives: "Technology & Product",
    body: "Our technology partner — software, AI, cloud, ERP and IT for every venture from day one.",
    testId: "ecosystem-party-epohtech",
    accent: true,
  },
];

const FLOW = ["Company Building", "New Ventures", "Scale", "Liquidity / Exit"];

export default function EcosystemFlowSection() {
  return (
    <section data-testid="ecosystem-section" className="py-24 md:py-36 border-t border-white/5 bg-charcoal/30 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(230,194,128,0.07) 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Reveal className="text-center max-w-2xl mx-auto">
          <Eyebrow className="justify-center">The Ecosystem</Eyebrow>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
            One studio. Four forces.
            <br />
            <span className="text-champagne">Companies, built repeatedly.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="mt-16">
          <div
            data-testid="ecosystem-ssc"
            className="mx-auto max-w-md rounded-3xl border border-champagne/30 bg-obsidian px-8 py-7 text-center gold-glow"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">The Operating Framework</p>
            <p className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Second Salary <span className="text-champagne">Capital</span>
            </p>
            <p className="mt-2 text-xs text-gray-500">Validation · Business support · Shared infrastructure</p>
          </div>
        </Reveal>

        <div className="hidden lg:flex justify-center" aria-hidden="true">
          <div className="h-10 w-px bg-gradient-to-b from-champagne/50 to-white/10" />
        </div>
        <div className="hidden lg:block max-w-4xl mx-auto h-px bg-white/10" aria-hidden="true" />

        <div className="mt-10 lg:mt-0 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PARTIES.map((p, i) => (
            <Reveal key={p.name} delay={0.2 + i * 0.1}>
              <div className="hidden lg:block h-10 w-px bg-white/10 mx-auto" aria-hidden="true" />
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                data-testid={p.testId}
                className={`rounded-3xl border p-7 text-center h-full ${
                  p.accent
                    ? "border-epoh/30 bg-epoh/5"
                    : "border-white/5 bg-obsidian/70 hover:border-champagne/25"
                } transition-colors duration-500`}
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${
                  p.accent ? "bg-epoh/10 text-epoh border-epoh/25" : "bg-champagne/10 text-champagne border-champagne/20"
                }`}>
                  <p.icon size={19} strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-white tracking-tight">{p.name}</h3>
                <p className={`mt-1 font-mono text-[9px] uppercase tracking-[0.25em] ${p.accent ? "text-epoh" : "text-champagne"}`}>
                  {p.gives}
                </p>
                <p className="mt-3 text-[13px] text-gray-500 leading-relaxed">{p.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.35} className="mt-14">
          <div className="flex flex-col items-center gap-4" data-testid="ecosystem-flow">
            <ArrowDown size={16} className="text-champagne/60" />
            <div className="flex flex-wrap items-center justify-center gap-3">
              {FLOW.map((step, i) => (
                <div key={step} className="flex items-center gap-3" data-testid={`ecosystem-flow-${step.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                  <span className={`rounded-full px-5 py-2.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] border ${
                    i === FLOW.length - 1
                      ? "border-champagne bg-champagne text-obsidian font-bold"
                      : "border-white/10 bg-white/[0.03] text-gray-300"
                  }`}>
                    {step}
                  </span>
                  {i < FLOW.length - 1 && <ArrowRight size={14} className="text-gray-600" />}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
