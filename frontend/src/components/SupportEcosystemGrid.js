import { Reveal, Eyebrow } from "@/components/Reveal";
import {
  Search, Compass, Code2, BrainCircuit, MonitorCheck, Palette,
  Megaphone, FileSignature, Calculator, Landmark, UserPlus, Cog, TrendingUp,
} from "lucide-react";

export const SUPPORT_ITEMS = [
  { icon: Search, title: "Market Research", body: "Sizing, competitor, customer, pricing and industry analysis. Opportunity validation before capital moves." },
  { icon: Compass, title: "Business Strategy", body: "Business model, revenue model, pricing, go-to-market, expansion strategy and unit economics." },
  { icon: Code2, title: "Technology", body: "Software, web and mobile applications built by EPOHTECH — our dedicated technology partner." },
  { icon: BrainCircuit, title: "AI & Automation", body: "Applied AI, workflow automation and data systems that let small teams operate like large ones." },
  { icon: MonitorCheck, title: "IT Support", body: "Infrastructure, cloud, cybersecurity, business applications and day-to-day IT operations." },
  { icon: Palette, title: "Branding", body: "Brand strategy, identity, website and design that make a new venture look investment-grade from day one." },
  { icon: Megaphone, title: "Digital Marketing", body: "Content, Google Ads, Meta Ads, LinkedIn, lead generation, landing pages and analytics." },
  { icon: FileSignature, title: "Contracts & Legal", body: "Founder agreements, NDAs, vendor, customer and service agreements, and legal coordination." },
  { icon: Calculator, title: "Accounting", body: "Bookkeeping, GST, tax, financial statements, MIS and financial planning." },
  { icon: Landmark, title: "CA Support", body: "Chartered-accountant support for compliance, structuring and investor-ready financials." },
  { icon: UserPlus, title: "Recruitment", body: "Founder recruitment, employee hiring, contractor networks, HR processes and payroll support." },
  { icon: Cog, title: "Operations", body: "SOPs, procurement, vendor management, process design, KPI systems and project management." },
  { icon: TrendingUp, title: "Business Development", body: "Customer introductions, enterprise opportunities, partnerships, sales process and channel development." },
];

export default function SupportEcosystemGrid({ compact = false }) {
  const items = compact ? SUPPORT_ITEMS.slice(0, 8) : SUPPORT_ITEMS;
  return (
    <section data-testid="support-ecosystem" className="py-24 md:py-36 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Support Ecosystem</Eyebrow>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
            Everything a company needs <span className="text-champagne">to get moving.</span>
          </h2>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            You don't have to build every part of a company alone. Thirteen shared capabilities,
            one operating framework.
          </p>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((s, i) => (
            <Reveal key={s.title} delay={(i % 4) * 0.08}>
              <div
                data-testid={`support-card-${s.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="group h-full rounded-2xl border border-white/5 bg-charcoal/50 p-6 hover:border-champagne/30 hover:bg-charcoal hover:-translate-y-1 transition-all duration-500"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-300 border border-white/10 group-hover:text-champagne group-hover:border-champagne/30 transition-colors duration-500">
                  <s.icon size={18} strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-base font-bold text-white tracking-tight">{s.title}</h3>
                <p className="mt-2 text-[13px] text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors duration-500">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
