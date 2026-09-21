import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Eyebrow } from "@/components/Reveal";

export const EPOH_CAPABILITIES = [
  "Software Development",
  "AI & Machine Learning",
  "Automation",
  "ERP & Oracle",
  "Cloud Infrastructure",
  "APIs & Integrations",
  "Data & Analytics",
  "IT Support & Security",
];

export default function EpohTechSection() {
  return (
    <section data-testid="epohtech-section" className="py-24 md:py-36 border-t border-white/5 relative overflow-hidden">
      <div
        className="absolute top-1/3 -right-52 w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 60%)" }}
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <Eyebrow className="!text-epoh">Technology Partner</Eyebrow>
            <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.0]">
              EPOH<span className="text-epoh">TECH</span>
            </h2>
            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-lg">
              The technology engine of the Second Salary Capital ecosystem. EPOHTECH is an
              established technology company — not an internal department — providing every venture
              with software, AI, cloud and IT capability from day one.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5 max-w-lg">
              {EPOH_CAPABILITIES.map((c) => (
                <span
                  key={c}
                  data-testid={`epoh-chip-${c.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] rounded-full border border-epoh/25 bg-epoh/5 text-purple-200 px-4 py-2"
                >
                  {c}
                </span>
              ))}
            </div>
            <Link
              to="/epohtech"
              data-testid="explore-epohtech-button"
              className="group mt-10 inline-flex items-center gap-2 rounded-full border border-epoh/40 text-purple-200 font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-epoh/10 hover:border-epoh transition-colors duration-300"
            >
              EXPLORE EPOHTECH
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-epoh/10 blur-2xl" aria-hidden="true" />
              <img
                src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc29mdHdhcmUlMjBlbmdpbmVlciUyMGNvZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODk5ODMxNzl8MA&ixlib=rb-4.1.0&q=85"
                alt="EPOHTECH engineering — software architecture in progress"
                data-testid="epohtech-image"
                className="relative rounded-3xl border border-white/10 object-cover w-full aspect-[4/3] grayscale-[35%] hover:grayscale-0 transition-[filter] duration-700"
                loading="lazy"
              />
              <div className="absolute bottom-5 left-5 rounded-xl border border-white/10 bg-obsidian/80 backdrop-blur-md px-5 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-epoh">EPOHTECH</p>
                <p className="text-sm text-white font-semibold mt-1">Software · AI · Cloud · Data</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
