import { Link } from "react-router-dom";
import { ArrowUpRight, GraduationCap, MessageSquareText, Rocket, CheckCircle2 } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const APPLY_PATH = "/epohtech/contact?interest=Internship%20Program";

const CRITERIA = [
  {
    icon: GraduationCap,
    title: "Exceptional academics",
    body: "You rank in the top 5 of your class — and you got there by understanding the work, not just memorising it.",
  },
  {
    icon: MessageSquareText,
    title: "Excellent communication",
    body: "You explain clearly, ask good questions and write well. You will work directly with our engineers and clients.",
  },
  {
    icon: Rocket,
    title: "Curiosity to explore",
    body: "You want to see how real systems are built and run — data, cloud, Oracle ERP and integrations — from the inside.",
  },
];

const EXPERIENCE = [
  "Work on live projects alongside working Epoh Tech engineers",
  "Exposure to client engagements across India and the US",
  "Mentorship and regular, honest feedback on your work",
  "A path to a permanent role for interns who stand out",
];

export default function EpohProgramsPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Internship Program</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Top of your class?</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">Come build with us.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
            If you have exceptional academics — top 5 in your class — and excellent communication
            skills, join our internship program and explore what real technology work looks like.
          </p>
          <Link
            to={APPLY_PATH}
            data-testid="epoh-internship-apply-hero"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-3.5 text-sm hover:bg-champagneBright transition-colors duration-300"
          >
            APPLY FOR THE INTERNSHIP <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>

        <div className="mt-24">
          <Reveal>
            <Eyebrow>Who We Are Looking For</Eyebrow>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {CRITERIA.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div
                  data-testid={`epoh-internship-criteria-${c.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="h-full rounded-2xl border border-white/5 bg-charcoal/50 p-8 hover:border-champagne/25 transition-colors duration-500"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-champagne/10 text-champagne border border-champagne/20">
                    <c.icon size={19} strokeWidth={1.75} />
                  </span>
                  <h2 className="mt-5 text-lg font-bold text-white tracking-tight">{c.title}</h2>
                  <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Reveal>
            <div data-testid="epoh-internship-experience" className="h-full rounded-3xl border border-white/5 bg-charcoal/50 p-8 sm:p-10">
              <Eyebrow>What You Get</Eyebrow>
              <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-[1.1]">
                The greatest experience <span className="text-champagne">we can give.</span>
              </h2>
              <ul className="mt-8 space-y-3.5">
                {EXPERIENCE.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm text-gray-400">
                    <CheckCircle2 size={16} className="text-champagne shrink-0 mt-0.5" /> {pt}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div data-testid="epoh-internship-pay" className="h-full rounded-3xl border border-champagne/20 bg-obsidian/60 p-8 sm:p-10">
              <Eyebrow>Straight Talk on Pay</Eyebrow>
              <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-[1.1]">
                Unpaid now. <span className="text-champagne">Paid when you go permanent.</span>
              </h2>
              <p className="mt-6 text-sm sm:text-[15px] text-gray-400 leading-relaxed">
                We can't pay a salary during the internship at the moment. What we can offer is
                real work, real mentors and the best experience we know how to give.
              </p>
              <p className="mt-4 text-sm sm:text-[15px] text-gray-400 leading-relaxed">
                If you become a permanent member of the team, your actual pay starts then.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-24">
          <div data-testid="epoh-internship-cta" className="rounded-3xl border border-champagne/20 bg-charcoal/60 p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              Think you fit? <span className="text-champagne">Tell us about yourself.</span>
            </h2>
            <p className="mt-5 text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Share your college, your class rank and what you want to learn. We read every application.
            </p>
            <Link
              to={APPLY_PATH}
              data-testid="epoh-internship-apply-button"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-9 py-4 text-sm hover:bg-champagneBright transition-colors duration-300"
            >
              APPLY NOW <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
