import { Link } from "react-router-dom";
import { ArrowUpRight, Database, LineChart, Layers, Compass, Code2, Workflow, BarChart3, Factory } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";
import EpohConsulting, { CONSULTING_CLIENTS, ClientMark } from "@/components/EpohConsulting";

const HERO_IMG = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc29mdHdhcmUlMjBlbmdpbmVlciUyMGNvZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODk5ODMxNzl8MA&ixlib=rb-4.1.0&q=85";
const PROGRAMS_IMG = "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHx0ZWNoJTIwc29mdHdhcmUlMjBlbmdpbmVlciUyMGNvZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODk5ODMxNzl8MA&ixlib=rb-4.1.0&q=85";

const SERVICES = [
  { icon: Database, title: "Data Engineering", body: "Data integration, ETL, warehousing and pipelines that turn scattered data into a single, dependable source of truth." },
  { icon: LineChart, title: "Big Data Analytics", body: "Large datasets processed and analysed efficiently — business intelligence you can act on, not just admire." },
  { icon: Layers, title: "Oracle ERP & OIC", body: "Certified Oracle professionals delivering ERP technical and Oracle Integration Cloud solutions, end to end." },
  { icon: Compass, title: "IT Strategy & Consulting", body: "Technology selection, infrastructure, cybersecurity and digital transformation — aligned to business goals." },
];

const SOLUTIONS = [
  { icon: Factory, title: "Industry-Specific Solutions", body: "Targeted systems for finance, healthcare, retail and more." },
  { icon: Code2, title: "Custom Software", body: "Scalable, secure, high-performance applications built to spec." },
  { icon: Workflow, title: "Data Transformation & Integration", body: "Seamless data flow across systems, improving quality and access." },
  { icon: BarChart3, title: "Advanced Analytics & Reporting", body: "Clear, concise intelligence from state-of-the-art tooling." },
];

export default function EpohHomePage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <Reveal className="max-w-3xl">
          <Eyebrow>An Anvaya Partners Company</Eyebrow>
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[0.98]">
            <MaskedLine delay={0.15}><span>Your IT Department,</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">On-Demand.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
            Non-tech cofounders can concentrate on running the business — we back the tech.
            Data, cloud, enterprise systems and day-to-day IT, handled end to end.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/epohtech/services"
              data-testid="epoh-hero-services-button"
              className="group inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300"
            >
              EXPLORE SERVICES <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/epohtech/contact"
              data-testid="epoh-hero-contact-button"
              className="inline-flex items-center gap-2 rounded-full border border-champagne/50 text-champagne font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagne hover:text-obsidian transition-colors duration-300"
            >
              START A CONVERSATION
            </Link>
          </div>
        </Reveal>

        {/* Client credibility strip */}
        <Reveal className="mt-20">
          <div data-testid="epoh-clients-strip" className="border-y border-white/5 py-10">
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600">
              Trusted by teams in India &amp; the US
            </p>
            <div className="mt-6 mx-auto max-w-3xl grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {CONSULTING_CLIENTS.map((c) => (
                <ClientMark key={c.name} client={c} />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
              <span data-testid="epoh-client-dawn-fresh" className="font-extrabold tracking-tight text-xl sm:text-2xl text-gray-400 hover:text-champagne transition-colors duration-500">Dawn Fresh</span>
              <span data-testid="epoh-client-volt-valve" className="font-extrabold tracking-tight text-xl sm:text-2xl text-gray-400 hover:text-champagne transition-colors duration-500">Volt &amp; Valve</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-600">+ every Anvaya Partners company</span>
            </div>
          </div>
        </Reveal>

        {/* Services */}
        <div className="mt-24 md:mt-32">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <Eyebrow>What We Do</Eyebrow>
              <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
                Technology, handled <span className="text-champagne">end to end.</span>
              </h2>
            </div>
            <Link
              to="/epohtech/services"
              data-testid="epoh-home-all-services-link"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-champagne hover:text-champagneBright transition-colors duration-300 shrink-0"
            >
              All services <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((c, i) => (
              <Reveal key={c.title} delay={(i % 4) * 0.08}>
                <div
                  data-testid={`epoh-home-service-${c.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="group h-full rounded-2xl border border-white/5 bg-charcoal/50 p-7 hover:border-champagne/25 hover:-translate-y-1 transition-all duration-500"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-champagne/10 text-champagne border border-champagne/20">
                    <c.icon size={19} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-white tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Consulting */}
        <EpohConsulting />

        {/* Story band */}
        <div className="mt-28 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden border border-white/10">
              <img src={HERO_IMG} alt="Epoh Tech engineering" className="w-full h-[320px] sm:h-[420px] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-obsidian/40" />
              <p className="absolute bottom-5 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">
                An Anvaya Partners Company
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <Eyebrow>Why We Exist</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              Built inside a portfolio. <span className="text-champagne">Working for yours.</span>
            </h2>
            <p className="mt-6 text-gray-300 text-base md:text-lg leading-relaxed">
              Epoh Tech runs technology for every Anvaya Partners company — the same engineers,
              systems and standards are now available to founders and startups beyond the portfolio.
            </p>
            <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">
              No technical co-founder? No IT team? We step in as yours — from architecture to
              analytics to everyday support — so your capital goes into the business, not into
              rebuilding basic systems.
            </p>
            <Link
              to="/epohtech/about"
              data-testid="epoh-home-story-link"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-champagne/50 text-champagne font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagne hover:text-obsidian transition-colors duration-300"
            >
              OUR STORY <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* Solutions strip */}
        <div className="mt-28">
          <Reveal>
            <Eyebrow>Solutions</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              Built around your business, <span className="text-champagne">not our template.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SOLUTIONS.map((c, i) => (
              <Reveal key={c.title} delay={(i % 4) * 0.08}>
                <div
                  data-testid={`epoh-home-solution-${c.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="h-full rounded-2xl border border-white/5 bg-obsidian/60 p-7 hover:border-champagne/25 transition-colors duration-500"
                >
                  <c.icon size={20} strokeWidth={1.75} className="text-champagne" />
                  <h3 className="mt-4 text-sm font-bold text-white tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Programs band */}
        <div className="mt-28 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal className="order-2 lg:order-1">
            <Eyebrow>Internship Program</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              Top of your class? <span className="text-champagne">Come build with us.</span>
            </h2>
            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-lg">
              Exceptional academics — top 5 in your class — and excellent communication skills?
              Join our internship program and learn alongside the engineers who run real systems.
            </p>
            <Link
              to="/epohtech/programs"
              data-testid="epoh-home-programs-link"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300"
            >
              EXPLORE THE INTERNSHIP <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
          <Reveal delay={0.12} className="order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden border border-white/10">
              <img src={PROGRAMS_IMG} alt="Epoh Tech internship program" className="w-full h-[320px] sm:h-[420px] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-obsidian/40" />
              <p className="absolute bottom-5 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">
                Internship program
              </p>
            </div>
          </Reveal>
        </div>

        {/* CTA */}
        <Reveal className="mt-28">
          <div data-testid="epoh-home-cta" className="rounded-3xl border border-champagne/20 bg-charcoal/60 p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              Focus on your business. <span className="text-champagne">We'll handle the technology.</span>
            </h2>
            <p className="mt-5 text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Tell us what you are building. We will show you how we would run it.
            </p>
            <Link
              to="/epohtech/contact"
              data-testid="epoh-home-cta-button"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-9 py-4 text-sm hover:bg-champagneBright transition-colors duration-300"
            >
              START A CONVERSATION <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
