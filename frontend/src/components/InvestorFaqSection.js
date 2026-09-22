import { Reveal, Eyebrow } from "@/components/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "What ticket sizes can I participate with?",
    a: "Venture opportunities in the ecosystem typically range from ₹10L to ₹10Cr in total capital requirement. Within each opportunity, your participation is sized to your comfort — you will always see the full capital plan before deciding.",
  },
  {
    q: "Do I choose the ventures myself?",
    a: "Yes. This is not a blind pool or a fund you hand money to. You review each opportunity individually — business, founder, market, capital requirement and progress — and decide venture by venture.",
  },
  {
    q: "What information do I get before deciding?",
    a: "Structured documentation for every opportunity: the business and revenue model, market research, founder background, capital requirement, current traction and milestones, plus pitch decks and financial documents through the investor portal.",
  },
  {
    q: "How do returns work?",
    a: "Participation is equity-based. Value is realized as ventures mature — through exits, spin-offs, dividends or follow-on rounds. We never promise guaranteed returns, exits or allocations; every venture carries real risk and we say so openly.",
  },
  {
    q: "How is the ownership structure decided?",
    a: "Per venture, not by a fixed formula. Ownership reflects founder contribution, capital contributed, intellectual property, technology, existing customers, experience, risk, vesting and milestones — designed with appropriate legal, tax and regulatory advice for each company.",
  },
  {
    q: "What happens after I register?",
    a: "Registration → verification → approved access to the Opportunities portal. From there you can explore live ventures, download documentation, and express interest — which starts a direct conversation with the studio.",
  },
  {
    q: "Can I track a venture after participating?",
    a: "Yes. The investor portal shows milestone progress and monthly KPIs for investor-visible ventures, and the studio shares structured updates as ventures move from validation through launch and scale.",
  },
];

export default function InvestorFaqSection() {
  return (
    <section data-testid="investor-faq-section" className="mt-24 max-w-3xl">
      <Reveal>
        <Eyebrow>Investor FAQ</Eyebrow>
        <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
          Straight answers, <span className="text-champagne">before you ask.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <Accordion type="single" collapsible className="mt-10 space-y-3" data-testid="investor-faq-accordion">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              data-testid={`investor-faq-${i}`}
              className="rounded-2xl border border-white/5 bg-charcoal/50 px-6 data-[state=open]:border-champagne/25 transition-colors duration-300"
            >
              <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-white hover:text-champagne hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-400 leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
