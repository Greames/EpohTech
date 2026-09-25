import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { MaskedLine } from "@/components/Reveal";

export default function KineticHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      data-testid="kinetic-hero"
      className="relative overflow-hidden min-h-[100svh] flex flex-col justify-center pt-28 pb-16"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 hero-grid" aria-hidden="true" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(230,194,128,0.09) 0%, transparent 60%)" }}
        aria-hidden="true"
      />

      <motion.div style={{ opacity: fade }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MaskedLine delay={0.1}>
          <span
            data-testid="hero-eyebrow"
            className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-champagne"
          >
            <span className="h-px w-10 bg-champagne/50 inline-block" />
            Anvaya Partners · Early-Stage Investment Firm
            <span className="h-px w-10 bg-champagne/50 inline-block" />
          </span>
        </MaskedLine>

        <h1 className="mt-8 font-extrabold tracking-tight leading-[1.02] text-white text-[11.5vw] sm:text-7xl lg:text-[6.2rem]">
          <MaskedLine delay={0.25}>
            <span>Where capital</span>
          </MaskedLine>
          <MaskedLine delay={0.4}>
            <span>
              meets <span className="text-champagne italic font-bold">founders</span>
              <span className="text-champagne">.</span>
            </span>
          </MaskedLine>
        </h1>

        <div className="mt-10 max-w-2xl">
          <MaskedLine delay={0.6}>
            <p data-testid="hero-subtext" className="text-base md:text-lg text-gray-400 leading-relaxed">
              We invest our own capital in early-stage startups — and work hands-on with their
              founders on strategy, technology, finance, operations and go-to-market.
            </p>
          </MaskedLine>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/founders"
            data-testid="hero-apply-founder-button"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-9 py-4 text-sm hover:bg-champagneBright transition-colors duration-300"
          >
            APPLY AS A FOUNDER
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/investors"
            data-testid="hero-partner-investor-button"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 text-white font-bold tracking-wide px-9 py-4 text-sm hover:border-champagne/60 hover:text-champagne transition-colors duration-300"
          >
            PARTNER AS AN INVESTOR
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        aria-hidden="true"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.35em]">Scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <ArrowDown size={14} />
        </motion.span>
      </motion.div>
    </section>
  );
}
