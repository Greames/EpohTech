import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";
import {
  Compass, Code2, Rocket, Scale, Users, TrendingUp,
} from "lucide-react";

const CATEGORIES = [
  {
    icon: Compass,
    name: "Business",
    tagline: "Know the market before you enter it.",
    items: ["Market Research", "Market Sizing", "Competitor Research", "Customer Research", "Pricing Research", "Industry Analysis", "Opportunity Validation", "Business Model & Strategy", "Go-To-Market", "Unit Economics"],
  },
  {
    icon: Code2,
    name: "Technology",
    tagline: "Delivered through EPOHTECH, our technology partner.",
    items: ["Software Development", "Web & Mobile Applications", "AI & Automation", "ERP & Oracle", "Cloud Infrastructure", "APIs & Integrations", "CRM & Business Applications", "Data & Analytics", "Cybersecurity", "IT Support"],
  },
  {
    icon: Rocket,
    name: "Growth",
    tagline: "A growth engine, not a social media calendar.",
    items: ["Brand Strategy", "Website & Identity", "Content & Storytelling", "Google Ads", "Meta Ads", "LinkedIn", "Lead Generation", "Landing Pages", "Analytics & Retargeting", "Email Campaigns"],
  },
  {
    icon: Scale,
    name: "Corporate",
    tagline: "Investor-grade foundations from day one.",
    items: ["Founder Agreements", "NDAs & Contracts", "Vendor & Customer Agreements", "Legal Coordination", "Accounting & GST", "Tax & Compliance", "Financial Statements & MIS", "CA Support", "Financial Planning"],
  },
  {
    icon: Users,
    name: "People",
    tagline: "The right humans in the right seats.",
    items: ["Founder Recruitment", "Employee Recruitment", "Contractor Network", "HR Processes", "Payroll Support", "Mentorship"],
  },
  {
    icon: TrendingUp,
    name: "Scale",
    tagline: "Systems that survive growth.",
    items: ["SOPs & Process Design", "Procurement & Vendor Management", "KPI Systems", "Project Management", "Follow-On Capital", "Expansion Strategy", "Customer Introductions", "Partnerships & Channels"],
  },
];

export default function SupportPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>What We Support</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>One venture.</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">Every capability.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            Six support pillars shared across every company we build — so founders can focus on the
            few things only they can do.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.name} delay={(i % 2) * 0.1}>
              <div
                data-testid={`support-category-${c.name.toLowerCase()}`}
                className="group h-full rounded-3xl border border-white/5 bg-charcoal/50 p-8 sm:p-10 hover:border-champagne/25 transition-colors duration-500"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/10 text-champagne border border-champagne/20">
                    <c.icon size={22} strokeWidth={1.75} />
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{c.name}</h2>
                    <p className="text-xs text-gray-500 mt-1">{c.tagline}</p>
                  </div>
                </div>
                <div className="mt-7 flex flex-wrap gap-2">
                  {c.items.map((item) => (
                    <span
                      key={item}
                      data-testid={`support-item-${item.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-gray-300 group-hover:border-white/15 transition-colors duration-500"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
