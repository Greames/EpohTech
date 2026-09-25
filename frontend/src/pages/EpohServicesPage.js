import { Link } from "react-router-dom";
import { ArrowUpRight, Database, LineChart, Layers, Compass, Code2, Workflow, BarChart3, Factory } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const SERVICES = [
  {
    icon: Database,
    title: "Data Engineering",
    body: "Harness the power of your data with comprehensive data engineering. We specialise in data integration, ETL processes, data warehousing and advanced analytics — turning raw data into a dependable foundation for decisions.",
    points: ["Data integration & ETL", "Data warehousing", "Pipeline architecture", "Advanced analytics foundations"],
  },
  {
    icon: LineChart,
    title: "Big Data Analytics",
    body: "Leverage big data to gain a competitive edge. Our solutions help you process and analyse large datasets efficiently, providing valuable business intelligence at the speed your market moves.",
    points: ["Large-scale data processing", "Business intelligence", "Real-time analysis", "Decision-ready reporting"],
  },
  {
    icon: Layers,
    title: "Oracle ERP Technical & OIC",
    body: "Specialised Oracle ERP technical services coupled with Oracle Integration Cloud (OIC). Our certified Oracle professionals deliver comprehensive, end-to-end solutions tailored to your enterprise resource planning needs.",
    points: ["Oracle ERP technical services", "Oracle Integration Cloud", "Certified Oracle professionals", "End-to-end delivery"],
  },
  {
    icon: Compass,
    title: "IT Strategy & Consulting",
    body: "Develop a robust IT strategy with our consulting services. Expert guidance on technology selection, IT infrastructure, cybersecurity and digital transformation — aligned with your business goals, not vendor roadmaps.",
    points: ["Technology selection", "Infrastructure planning", "Cybersecurity guidance", "Digital transformation"],
  },
];

const SOLUTIONS = [
  { icon: Factory, title: "Industry-Specific Solutions", body: "Every industry has unique challenges. Our solutions cater to finance, healthcare, retail and more — targeted IT services that drive measurable success." },
  { icon: Code2, title: "Custom Software Development", body: "Custom software tailored to your business requirements. Scalable, secure, high-performance applications built by engineers who stay for the long run." },
  { icon: Workflow, title: "Data Transformation & Integration", body: "Streamline your data processes. We ensure seamless data flow across systems, improving data quality and accessibility throughout your organisation." },
  { icon: BarChart3, title: "Advanced Analytics & Reporting", body: "Turn data into actionable insight. State-of-the-art tools and techniques delivering clear, concise, valuable business intelligence." },
];

export default function EpohServicesPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Serious technology,</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">quietly delivered.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
            From data engineering to Oracle ERP, every capability below is one we run in
            production — inside our own portfolio first.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.1}>
              <div
                data-testid={`epoh-service-${s.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="group h-full rounded-3xl border border-white/5 bg-charcoal/50 p-8 sm:p-10 hover:border-champagne/25 transition-colors duration-500"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-champagne/10 text-champagne border border-champagne/20">
                  <s.icon size={21} strokeWidth={1.75} />
                </span>
                <h2 className="mt-6 text-xl sm:text-2xl font-extrabold text-white tracking-tight">{s.title}</h2>
                <p className="mt-4 text-sm sm:text-[15px] text-gray-400 leading-relaxed">{s.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-[13px] text-gray-500">
                      <span className="h-1 w-1 rounded-full bg-champagne shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-28">
          <Reveal>
            <Eyebrow>Solutions</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              Applied where it <span className="text-champagne">matters.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SOLUTIONS.map((c, i) => (
              <Reveal key={c.title} delay={(i % 2) * 0.08}>
                <div
                  data-testid={`epoh-solution-${c.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="h-full rounded-2xl border border-white/5 bg-obsidian/60 p-8 hover:border-champagne/25 hover:-translate-y-1 transition-all duration-500"
                >
                  <c.icon size={20} strokeWidth={1.75} className="text-champagne" />
                  <h3 className="mt-4 text-base font-bold text-white tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-24">
          <div data-testid="epoh-services-cta" className="rounded-3xl border border-champagne/20 bg-charcoal/60 p-10 sm:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-[1.1]">
                Tell us the problem. <span className="text-champagne">We will scope the system.</span>
              </h2>
              <p className="mt-3 text-gray-400 text-sm sm:text-base max-w-lg leading-relaxed">
                Every engagement starts with a conversation about your operations — not our pitch deck.
              </p>
            </div>
            <Link
              to="/epohtech/contact"
              data-testid="epoh-services-cta-button"
              className="group inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-9 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 shrink-0 self-start lg:self-center"
            >
              START A CONVERSATION <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
