import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, Database, BrainCircuit, Cloud, Blocks, ShieldCheck, ServerCog, Workflow } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const CAPABILITIES = [
  { icon: Code2, title: "Software Development", body: "Web applications, mobile applications and internal tools — designed, built and shipped for the ventures in the ecosystem." },
  { icon: Database, title: "Oracle / ERP", body: "Enterprise resource planning, Oracle systems and the business applications that keep operations honest at scale." },
  { icon: BrainCircuit, title: "AI", body: "Applied machine intelligence: forecasting, document processing, decision support and customer-facing AI features." },
  { icon: Workflow, title: "Automation", body: "Workflow automation across sales, operations and finance — small teams operating like large ones." },
  { icon: Cloud, title: "Cloud", body: "Cloud architecture, deployment and infrastructure that grows from first customer to full scale." },
  { icon: Blocks, title: "Integrations", body: "APIs, CRM, payment, logistics and third-party systems wired into one coherent stack." },
  { icon: Database, title: "Data & Analytics", body: "Dashboards, KPI systems and analytics that turn operations into decisions." },
  { icon: ShieldCheck, title: "IT Support & Security", body: "Day-to-day IT, cybersecurity and reliability — the unglamorous work that keeps companies alive." },
];

const INDUSTRIES = ["Agri & Food", "Infrastructure & MEP", "Logistics", "D2C & Retail", "Professional Services", "Manufacturing", "Fintech Ops", "Healthcare Ops"];

export default function EpohTechPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <Eyebrow className="!text-epoh">Technology Partner · Second Salary Capital Ecosystem</Eyebrow>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[0.98]">
              <MaskedLine delay={0.15}><span>EPOH<span className="text-epoh">TECH</span></span></MaskedLine>
            </h1>
            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-lg">
              An established technology company and the engineering engine behind every venture
              Second Salary Capital builds. Independent, battle-tested, and embedded in the
              ecosystem from idea to scale.
            </p>
            <div className="mt-8 rounded-2xl border border-epoh/25 bg-epoh/5 p-6 max-w-lg" data-testid="epoh-relationship-card">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-epoh mb-3">The Relationship</p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Second Salary Capital creates the operating framework. Founders lead and execute.
                Investors provide capital. <strong className="text-purple-200">EPOHTECH provides the technology</strong> —
                software, AI, cloud and IT capability as a shared service across all ventures.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-epoh/10 blur-2xl" aria-hidden="true" />
              <img
                src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHx0ZWNoJTIwc29mdHdhcmUlMjBlbmdpbmVlciUyMGNvZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODk5ODMxNzl8MA&ixlib=rb-4.1.0&q=85"
                alt="EPOHTECH engineer building venture software"
                data-testid="epohtech-page-image"
                className="relative rounded-3xl border border-white/10 object-cover w-full aspect-[4/3] grayscale-[35%] hover:grayscale-0 transition-[filter] duration-700"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-24">
          <Reveal>
            <Eyebrow className="!text-epoh">Capabilities</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">The full stack, in-house.</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={(i % 4) * 0.08}>
                <div
                  data-testid={`epoh-capability-${c.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="group h-full rounded-2xl border border-white/5 bg-charcoal/50 p-6 hover:border-epoh/40 hover:-translate-y-1 transition-all duration-500"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-epoh/10 text-epoh border border-epoh/20">
                    <c.icon size={18} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-white tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <Eyebrow className="!text-epoh">Industries</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Technology for the real economy.</h2>
            <p className="mt-5 text-gray-400 text-base leading-relaxed max-w-md">
              EPOHTECH's work spans the industries Second Salary Capital builds in — from traditional
              businesses being modernised to software-native ventures.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2.5">
              {INDUSTRIES.map((ind) => (
                <span
                  key={ind}
                  data-testid={`epoh-industry-${ind.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="font-mono text-[11px] uppercase tracking-[0.15em] rounded-full border border-white/10 bg-white/[0.03] text-gray-300 px-5 py-2.5 hover:border-epoh/40 hover:text-purple-200 transition-colors duration-300"
                >
                  {ind}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-24">
          <div className="rounded-3xl border border-epoh/25 bg-gradient-to-br from-epoh/10 via-charcoal to-charcoal p-10 sm:p-16 text-center" data-testid="epoh-contact-cta">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Building something that needs serious technology?
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
              Whether you are a founder joining the ecosystem or a business that needs EPOHTECH
              directly — start the conversation.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/build"
                data-testid="epoh-build-with-us-button"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-9 py-4 text-sm hover:bg-champagneBright transition-colors duration-300"
              >
                BUILD WITH US <ArrowUpRight size={16} />
              </Link>
              <Link
                to="/contact"
                data-testid="epoh-contact-button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-epoh/40 text-purple-200 font-bold tracking-wide px-9 py-4 text-sm hover:bg-epoh/10 transition-colors duration-300"
              >
                CONTACT EPOHTECH
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
