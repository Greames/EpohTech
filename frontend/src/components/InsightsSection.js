import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axios, { API } from "@/lib/api";
import { Reveal, Eyebrow } from "@/components/Reveal";

export const ARTICLES = [
  {
    slug: "why-second-salary",
    category: "Origin Story",
    title: "Why Second Salary?",
    read: "4 min",
    excerpt: "The name is not about a second income. It is the true story of two salaries, gratitude, and a leap into company building.",
    body: "After college, our founders took their first jobs like everyone else. The first salary went to their parents and to God — gratitude before ambition. The second salary went somewhere unusual: it became seed capital for their own company. That decision, made with one month's pay, is the entire philosophy of Second Salary Capital. You do not need permission, inheritance or a fund behind you to start building. You need conviction and one month's courage. We built this studio so that the next founder gets more than a month's salary behind their leap — they get capital, technology, and a full operating ecosystem.",
  },
  {
    slug: "how-we-evaluate",
    category: "Investment Education",
    title: "How We Evaluate Opportunities",
    read: "6 min",
    excerpt: "Market size, founder fit, unit economics and timing — the four questions every venture must answer before capital moves.",
    body: "Before a single rupee moves, every proposed company passes through defined stages: idea, screen, market research, validation, founder match, business model and capital planning. We ask four questions. Is the market real and measurable? Is the founder the right person — with domain expertise and full-time commitment? Do the unit economics work at small scale before they work at big scale? And why is now the right time? Most ideas fail one of these. That is the point of a studio: kill weak ideas cheaply, and pour shared resources into the ones that survive.",
  },
  {
    slug: "build-in-public-validation",
    category: "Company Building",
    title: "What We Learned Validating Ventures",
    read: "5 min",
    excerpt: "Customer conversations beat spreadsheets. Lessons from taking ideas through our validation process.",
    body: "Every venture in our pipeline goes through structured validation: customer interviews, competitor teardown, pricing tests and market sizing from the bottom up. The consistent lesson: founders fall in love with solutions, but markets only pay for problems. Our validation stage forces the problem first — who hurts, how much, and what they already pay to make it stop. When we cannot find the pain, we do not build. When we find it and the founder can reach it, we move fast: capital, technology and business support arrive together, not sequentially.",
  },
  {
    slug: "ai-traditional-business",
    category: "Technology",
    title: "How AI Changes Traditional Businesses",
    read: "5 min",
    excerpt: "Automation is not about replacing people — it is about letting a five-person venture operate like a fifty-person company.",
    body: "Through EPOHTECH, every venture in our ecosystem gets access to applied AI and automation from day one. The biggest gains are unglamorous: automated follow-ups in sales, intelligent document processing in operations, forecasting in finance, and support systems that answer before a human wakes up. A traditional business with modern tooling does not just move faster — it compounds. Data from every process feeds the next decision. That is the technology dividend we build into every company we create.",
  },
  {
    slug: "what-we-look-for-founders",
    category: "Founder Stories",
    title: "What We Look For in a Founder",
    read: "4 min",
    excerpt: "Domain depth, full-time commitment and coachability matter more than a polished pitch deck.",
    body: "We have reviewed founders with beautiful decks and no customers, and founders with grease on their hands and a waiting list. We choose the second kind. What we look for: real domain expertise earned inside an industry, the willingness to go full-time, the humility to be challenged during validation, and the stamina for a multi-year build. Equity in our ventures is not a fixed formula — it reflects what the founder brings: idea, experience, customers, capital and commitment. Bring more, own more.",
  },
  {
    slug: "inside-the-ecosystem",
    category: "Behind the Scenes",
    title: "Inside the Second Salary Ecosystem",
    read: "7 min",
    excerpt: "How founders, investors, EPOHTECH and our operating team fit together to build companies repeatedly.",
    body: "Second Salary Capital sits at the centre of four forces. Founders bring leadership and execution. Investors — 80+ onboarded today — bring capital and strategic support. EPOHTECH brings technology: software, AI, cloud, ERP and IT operations. And the studio itself brings the operating framework: market research, strategy, legal and CA coordination, marketing, recruitment and business development. Every venture draws from all four. That is what makes it a studio rather than a fund — we do not write cheques and wait. We build, launch, grow, and stay in the trenches through scale and, eventually, liquidity.",
  },
];

export default function InsightsSection() {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(null);
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/insights`)
      .then((r) => setRemote(r.data.insights || []))
      .catch(() => setRemote([]));
  }, []);

  const source = remote && remote.length ? remote : ARTICLES;
  const CATEGORIES = ["All", ...Array.from(new Set(source.map((a) => a.category)))];
  const list = cat === "All" ? source : source.filter((a) => a.category === cat);

  return (
    <section data-testid="insights-section" className="py-24 md:py-36 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Insights</Eyebrow>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
            Inside the <span className="text-champagne">Build</span>
          </h2>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            Founder stories, market research, technology notes and lessons from building businesses — written as we build.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-2.5" data-testid="insights-filters">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                data-testid={`insights-filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
                className={`rounded-full px-5 py-2 text-xs font-mono uppercase tracking-[0.15em] border transition-colors duration-300 ${
                  cat === c
                    ? "bg-champagne text-obsidian border-champagne font-bold"
                    : "border-white/10 text-gray-400 hover:border-champagne/40 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 0.08}>
              <button
                onClick={() => setOpen(a)}
                data-testid={`insight-card-${a.slug}`}
                className="group text-left h-full w-full rounded-2xl border border-white/5 bg-charcoal/50 p-7 hover:border-champagne/30 hover:bg-charcoal hover:-translate-y-1 transition-all duration-500"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-champagne">{a.category}</span>
                  <span className="font-mono text-[10px] text-gray-600">{a.read}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-white tracking-tight leading-snug group-hover:text-champagne transition-colors duration-300">
                  {a.title}
                </h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{a.excerpt}</p>
                <span className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 group-hover:text-champagne transition-colors duration-300">
                  Read →
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-obsidian/80 backdrop-blur-md"
            onClick={() => setOpen(null)}
            data-testid="insight-modal-overlay"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              data-testid="insight-modal"
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/10 bg-charcoal p-8 sm:p-12"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-champagne">{open.category} · {open.read}</span>
                  <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{open.title}</h3>
                </div>
                <button
                  onClick={() => setOpen(null)}
                  data-testid="insight-modal-close"
                  className="shrink-0 rounded-full border border-white/10 p-2 text-gray-400 hover:text-white hover:border-champagne/40 transition-colors duration-300"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="mt-8 text-gray-300 leading-[1.9] text-[15px]">{open.body}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
