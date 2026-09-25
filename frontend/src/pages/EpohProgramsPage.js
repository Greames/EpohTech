import { Link } from "react-router-dom";
import { ArrowUpRight, Database, Layers, CheckCircle2 } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const PROGRAMS = [
  {
    icon: Database,
    title: "Big Data Engineering",
    tag: "Cohort Program",
    body: "A practitioner-led program covering the full data engineering discipline — pipelines, warehousing, ETL and large-scale processing — taught by engineers who build and run these systems in production.",
    points: [
      "Data pipeline design & ETL in practice",
      "Warehousing and modelling fundamentals",
      "Large-scale processing frameworks",
      "Capstone project on real production patterns",
    ],
    interest: "Big Data Engineering Program",
    testId: "epoh-program-big-data",
  },
  {
    icon: Layers,
    title: "Oracle Fusion with OIC",
    tag: "Cohort Program",
    body: "Hands-on Oracle Fusion and Oracle Integration Cloud training led by certified Oracle professionals — from technical fundamentals to delivering end-to-end integration solutions for enterprise environments.",
    points: [
      "Oracle Fusion technical foundations",
      "Oracle Integration Cloud (OIC) workflows",
      "Enterprise integration patterns",
      "Guided, end-to-end solution build",
    ],
    interest: "Oracle Fusion with OIC Program",
    testId: "epoh-program-oracle",
  },
];

export default function EpohProgramsPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Programs</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Learn from people</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">who ship it.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
            No theory-only classrooms. Epoh Tech programs are taught by the same engineers who
            deliver these systems for our clients and the Anvaya Partners portfolio.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PROGRAMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <div
                data-testid={p.testId}
                className="h-full rounded-3xl border border-white/5 bg-charcoal/50 p-8 sm:p-10 hover:border-champagne/25 transition-colors duration-500 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-champagne/10 text-champagne border border-champagne/20">
                    <p.icon size={21} strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-champagne border border-champagne/25 rounded-full px-3 py-1.5">
                    {p.tag}
                  </span>
                </div>
                <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{p.title}</h2>
                <p className="mt-4 text-sm sm:text-[15px] text-gray-400 leading-relaxed">{p.body}</p>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-[13px] text-gray-400">
                      <CheckCircle2 size={15} className="text-champagne shrink-0 mt-0.5" /> {pt}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/epohtech/contact?interest=${encodeURIComponent(p.interest)}`}
                  data-testid={`${p.testId}-register-button`}
                  className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300"
                >
                  REGISTER INTEREST <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <div data-testid="epoh-programs-note" className="rounded-2xl border border-white/5 bg-obsidian/60 p-6 sm:p-8 text-center">
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Cohort dates and formats are shared directly with registered participants. For
              corporate training for your team,{" "}
              <Link to="/epohtech/contact?interest=Corporate%20Training" className="text-champagne underline underline-offset-2">
                contact us
              </Link>.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
