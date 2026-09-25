import { Reveal, Eyebrow } from "@/components/Reveal";

const SECTIONS = [
  {
    title: "1. Who we are",
    body: "Anvaya Partners Private Limited, Hyderabad, India (\"Anvaya Partners\", \"we\", \"us\") operates this website. This Privacy Policy explains how we collect, use, store and protect personal data in line with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India.",
  },
  {
    title: "2. Data we collect",
    body: "Information you provide: name, email, phone number, location, LinkedIn profile, professional background, and — for founder applications — company details, business plans and pitch deck files you upload. Account data: when you sign in with Google, we receive your name, email and profile picture from Google. Usage data: standard, privacy-respecting website analytics.",
  },
  {
    title: "3. How we use it",
    body: "To evaluate founder applications and investor network applications; to operate the verified investor network and share opportunities privately; to respond to messages and deck requests; to send confirmations, updates and (with your consent) our insights newsletter; and to meet legal and regulatory obligations.",
  },
  {
    title: "4. Consent",
    body: "Every form on this website requires your explicit consent before submission. You may withdraw consent at any time by writing to tulasi.reddu@anvayapartners.in; withdrawal does not affect processing already lawfully carried out.",
  },
  {
    title: "5. Sharing",
    body: "We do not sell personal data. Data is shared only with: service providers who operate our infrastructure (hosting, email delivery, file storage) under confidentiality obligations; and authorities where required by law. Pitch decks and application materials are reviewed only by the Anvaya Partners team.",
  },
  {
    title: "6. Retention & security",
    body: "We retain personal data only as long as needed for the purposes above or as required by law. We use encryption in transit, access controls and authenticated storage for uploaded documents.",
  },
  {
    title: "7. Your rights under the DPDP Act, 2023",
    body: "You may request access to your personal data, its correction or erasure, withdraw consent, nominate a representative, and raise a grievance. Write to our Grievance Officer: Tulasi Reddy, tulasi.reddu@anvayapartners.in. We will respond within the timelines prescribed by law.",
  },
  {
    title: "8. Children",
    body: "This website is not directed at anyone under 18, and we do not knowingly collect their data.",
  },
  {
    title: "9. Changes & contact",
    body: "We may update this policy; the current version is always on this page. Contact: tulasi.reddu@anvayapartners.in · [phone] · Hyderabad, India.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.05]" data-testid="privacy-title">
            Privacy Policy
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-champagne" data-testid="privacy-review-note">
            [To be reviewed by legal counsel]
          </p>
          <p className="mt-6 text-gray-400 text-sm leading-relaxed">
            Aligned with the Digital Personal Data Protection Act, 2023 (India). Last updated: September 2026.
          </p>
        </Reveal>
        <div className="mt-12 space-y-8">
          {SECTIONS.map((s) => (
            <Reveal key={s.title}>
              <section data-testid={`privacy-section-${s.title.split(".")[0]}`}>
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
