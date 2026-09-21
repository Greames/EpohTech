import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Reveal } from "@/components/Reveal";

const easeOut = (t) => 1 - Math.pow(1 - t, 4);

function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(Math.round(easeOut(p) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

const metrics = [
  { id: "investors", value: <Counter to={80} suffix="+" />, label: "Investors Onboarded" },
  { id: "startups", value: <Counter to={2} suffix="+" />, label: "Startups Funded" },
  { id: "range", value: <span className="tabular-nums">₹10L – ₹10Cr</span>, label: "Investment Opportunity Range" },
];

export default function HeroMetricCounters() {
  return (
    <section data-testid="hero-metrics" className="relative border-y border-white/5 bg-charcoal/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
        {metrics.map((m, i) => (
          <Reveal key={m.id} delay={i * 0.12}>
            <div data-testid={`metric-${m.id}`} className="text-center sm:text-left sm:border-l sm:border-white/10 sm:pl-8 first:border-0 first:pl-0">
              <div className="font-mono font-bold text-4xl md:text-5xl lg:text-6xl text-champagne tracking-tight">
                {m.value}
              </div>
              <p className="mt-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-500">
                {m.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
