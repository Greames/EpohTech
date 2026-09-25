import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axios, { API } from "@/lib/api";
import { Reveal, Eyebrow } from "@/components/Reveal";

export const ARTICLES = [
  {
    slug: "why-anvaya",
    category: "The Firm",
    title: "Why 'Anvaya'?",
    read: "3 min",
    excerpt: "Anvaya is Sanskrit for 'bringing together' — founders with ambition, investors with conviction, and a partner committed to both.",
    body: "Names carry intent. Anvaya (अन्वय) is Sanskrit for 'bringing together' — and that is precisely what this firm exists to do. On one side, founders with ambition: people building real companies who need more than money. On the other, investors with conviction: people who want to back real businesses, not lottery tickets. Anvaya Partners stands between them, committed to both — investing our own capital first, and then working hands-on inside every company we back. Bringing together is not a slogan. It is the operating model.",
  },
  {
    slug: "capital-efficient-by-design",
    category: "Approach",
    title: "Capital-Efficient by Design",
    read: "4 min",
    excerpt: "We back businesses built to reach sustainable revenue early — not ones that burn cash chasing growth.",
    body: "Burn is a choice, not a strategy. When we evaluate a company, the first question is not 'how fast can it grow with unlimited capital' but 'how soon can it sustain itself'. Businesses built to reach sustainable revenue early make better decisions: they price honestly, they hire carefully, and they listen to customers because they have to. Capital then accelerates what already works instead of subsidising what doesn't. That is what capital-efficient means in practice — and it is the only kind of company we back.",
  },
  {
    slug: "what-operator-led-means",
    category: "Approach",
    title: "What Operator-Led Actually Means",
    read: "4 min",
    excerpt: "A decade of building and integrating enterprise systems — applied to every company we back.",
    body: "Many investors advise. Fewer operate. Our team spent a decade building and integrating enterprise systems for large organisations — the unglamorous work of making strategy survive contact with reality. In every company we back, that experience shows up as real work: designing the go-to-market, setting up the finance stack, choosing the technology, building the operating rhythm. We work inside the company, next to the founder — not around it, from a distance.",
  },
  {
    slug: "how-we-evaluate",
    category: "Investment Notes",
    title: "How We Evaluate a Company",
    read: "5 min",
    excerpt: "Discover, Evaluate, Invest, Build together — what we actually test at each stage.",
    body: "Our process has four stages. Discover: we understand the opportunity in its own terms — the market, the problem, the person. Evaluate: we test all three rigorously — is the market real, does the model sustain itself early, is this the founder who will outlast the hard years? If the evidence is not there, we say so early and honestly. Invest: we commit our own capital with a structure both sides understand completely. Build together: then the real work begins — strategy, technology, finance, operations, go-to-market — side by side with the founder, for years.",
  },
  {
    slug: "what-we-look-for",
    category: "Founders",
    title: "What We Look For in a Founder",
    read: "4 min",
    excerpt: "Clarity of thought, capital discipline, domain depth — and a years-not-quarters mindset.",
    body: "We look for four things. Clarity of thought: the founder can explain the business simply, because they understand it deeply. Capital discipline: they treat money as something earned, not something to spend. Domain depth: they know their industry from the inside — its customers, its inefficiencies, its unwritten rules. And temperament: building takes years, and we partner with people whose horizon matches ours. Decks matter less than conversations. If you have these four, we would like to meet you.",
  },
  {
    slug: "beyond-the-first-cheque",
    category: "Partnership",
    title: "A Partner Beyond the First Cheque",
    read: "3 min",
    excerpt: "Introductions to our verified investor network, follow-on support, and a relationship measured in years.",
    body: "The first cheque is the beginning, not the product. As companies mature, they need more than our own capital — so we make introductions to our verified investor network, privately and deliberately. We stay involved through the hard middle: hiring, pricing, systems, the second product, the second city. Our horizon is years, not quarters, because that is how long real companies take. Partnership, for us, is a duration — not a sentiment.",
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
            Notes on building, <span className="text-champagne">written as we build.</span>
          </h2>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            How we think about companies, capital and partnerships — and what we learn along the way.
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
