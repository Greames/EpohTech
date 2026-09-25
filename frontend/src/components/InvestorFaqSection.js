import { Reveal, Eyebrow } from "@/components/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Does Anvaya Partners manage or pool investors' money?",
    a: "No. Anvaya Partners invests its own capital and does not manage or pool investors' money. Members of our investor network review opportunities privately and invest directly in the companies they individually choose.",
  },
  {
    q: "Who can join the investor network?",
    a: "The network is private and verification-based. Every application is reviewed manually, and membership is by invitation or approved application. Opportunities are shared only with verified members — never publicly.",
  },
  {
    q: "What information do I receive about an opportunity?",
    a: "Verified members receive curated documentation privately: the business and revenue model, the founder's background, the capital plan and current progress. We do not publicly list any company's fundraising terms, amounts, valuations or share prices.",
  },
  {
    q: "What is the difference between the two paths?",
    a: "Backing individual companies means choosing specific opportunities as a verified network member. Investing in Anvaya Partners means backing the firm itself, with exposure to every company we invest in and build — request our deck and our team will follow up personally.",
  },
  {
    q: "How do returns work?",
    a: "Participation is equity-based, and value is realised as companies mature — through exits, dividends or follow-on rounds. Nothing is guaranteed. Investing in early-stage companies involves high risk, including possible loss of the entire amount invested.",
  },
  {
    q: "Is Anvaya Partners registered with SEBI?",
    a: "Anvaya Partners Private Limited is not a stock exchange, is not registered with SEBI as an intermediary, and does not solicit investment from the public. Opportunities are shared only privately with eligible, verified investors in compliance with applicable law. Read the full disclaimer on our Disclaimer page.",
  },
  {
    q: "Can I track progress after participating?",
    a: "Yes. Verified members receive structured progress updates, and our portal shows milestones and monthly KPIs for the companies you follow.",
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
