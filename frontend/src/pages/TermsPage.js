import { Reveal, Eyebrow } from "@/components/Reveal";

const SECTIONS = [
  {
    title: "1. Acceptance",
    body: "By using this website you accept these Terms of Use. If you do not agree, please do not use the website. Anvaya Partners Private Limited, [City], India (\"Anvaya Partners\") operates this website.",
  },
  {
    title: "2. Informational purpose only",
    body: "This website is provided for general information about Anvaya Partners. Nothing on it constitutes investment advice, financial advice, legal advice, or an offer to sell or a solicitation of an offer to buy any securities. See our Disclaimer for the full statement.",
  },
  {
    title: "3. No public offering; no transactions",
    body: "This website offers no facility to invest, transact or transfer money. Investment opportunities are shared only privately with eligible, verified investors in compliance with applicable law. Any actual investment is documented separately under professional legal, tax and regulatory advice.",
  },
  {
    title: "4. Submissions",
    body: "Founder applications, pitch decks, messages and deck requests you submit are reviewed by our team. Please do not submit information you are not entitled to share. Submission does not create any obligation on either side, and we do not guarantee a response, review outcome or engagement.",
  },
  {
    title: "5. Accounts",
    body: "Certain areas (account, investor portal, founder workspace) require sign-in. Access to the investor network is verification-based and may be declined or revoked at our discretion.",
  },
  {
    title: "6. Intellectual property",
    body: "All content on this website — text, design, branding and the Anvaya Partners name — belongs to Anvaya Partners Private Limited and may not be reproduced without written permission.",
  },
  {
    title: "7. Limitation of liability",
    body: "The website is provided \"as is\" without warranties of any kind. To the maximum extent permitted by law, Anvaya Partners is not liable for any loss arising from use of this website or reliance on its content.",
  },
  {
    title: "8. Governing law",
    body: "These terms are governed by the laws of India. Courts at [City], India have exclusive jurisdiction.",
  },
  {
    title: "9. Changes & contact",
    body: "We may update these terms; the current version is always on this page. Contact: [email] · [phone] · [City], India.",
  },
];

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.05]" data-testid="terms-title">
            Terms of Use
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-champagne" data-testid="terms-review-note">
            [To be reviewed by legal counsel]
          </p>
          <p className="mt-6 text-gray-400 text-sm leading-relaxed">Last updated: [Date].</p>
        </Reveal>
        <div className="mt-12 space-y-8">
          {SECTIONS.map((s) => (
            <Reveal key={s.title}>
              <section data-testid={`terms-section-${s.title.split(".")[0]}`}>
                <h2 className="text-lg font-bold text-white tracking-tight">{s.title}</h2>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">{s.body}</p>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
