import { Link } from "react-router-dom";
import { Reveal, Eyebrow } from "@/components/Reveal";

export default function DisclaimerPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.05]" data-testid="disclaimer-title">
            Disclaimer
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-champagne" data-testid="disclaimer-review-note">
            [To be reviewed by legal counsel]
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 rounded-3xl border border-champagne/20 bg-charcoal/50 p-8 sm:p-12" data-testid="disclaimer-full-text">
            <p className="text-sm sm:text-base text-gray-300 leading-[1.9]">
              Anvaya Partners Private Limited is not a stock exchange, is not registered with SEBI
              as an intermediary, and does not solicit investment from the public. Nothing on this
              website constitutes an offer to sell, or a solicitation of an offer to buy, any
              securities. Investment opportunities are shared only privately with eligible,
              verified investors in compliance with applicable law. Investing in early-stage
              companies involves high risk, including possible loss of the entire amount invested.
            </p>
            <div className="mt-8 h-px bg-white/5" />
            <p className="mt-8 text-sm text-gray-400 leading-relaxed">
              This website is informational only and provides no investment, financial, legal or tax
              advice. We do not publicly list any company's fundraising terms, amounts, valuations
              or share prices. This website offers no facility to invest or transact online.
            </p>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Questions: tulasi.reddu@anvayapartners.in · [phone] · Hyderabad, India. Also see our{" "}
              <Link to="/privacy" className="text-champagne underline underline-offset-2">Privacy Policy</Link> and{" "}
              <Link to="/terms" className="text-champagne underline underline-offset-2">Terms of Use</Link>.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
