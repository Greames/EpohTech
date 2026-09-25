import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Target, Handshake, Gauge } from "lucide-react";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const VALUES = [
  { icon: Target, title: "Evidence first", body: "We ran the model on ourselves before offering it to anyone else. Revenue before rhetoric." },
  { icon: Gauge, title: "Capital-efficient", body: "₹1.5 Cr in revenue within two years, with less outside investment than most companies spend finding their footing." },
  { icon: Handshake, title: "Client-centric", body: "Every solution is customised to the unique demands of the client — never a template with a new logo." },
];

const LOCATIONS = [
  { city: "Proddatur", address: "D.No: 9/580, Khadarbad, Proddatur, Andhra Pradesh 516362", testId: "epoh-about-location-proddatur" },
  { city: "Hyderabad", address: "16th Floor, Awfis Coworking Space, Prestige Skytech, Financial District, Hyderabad 500032", testId: "epoh-about-location-hyderabad" },
];

export default function EpohAboutPage() {
  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>About Epoh Tech</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>Proof, in revenue —</span></MaskedLine>
            <MaskedLine delay={0.3}><span className="text-champagne">not in pitch decks.</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
            Before Anvaya Partners asked anyone to trust its model, it ran the model on itself.
            Epoh Tech is the result.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow>The Story</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              We built the machine <span className="text-champagne">before selling the ride.</span>
            </h2>
          </Reveal>
          <div className="lg:col-span-7 space-y-6">
            <Reveal delay={0.1}>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Epoh Tech started the way we believe every good company should start: with real work
                for real customers, funded carefully, built to sustain itself. No growth-at-all-costs,
                no burn chasing headlines.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Within two years it reached ₹1.5 Cr in revenue — with less investment than most
                companies spend finding their footing. That is the capital-efficient, operator-led
                approach Anvaya Partners brings to every company it backs: evidence first,
                capital second, sustainability always.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Today, Epoh Tech provides technology support to all Anvaya Partners companies — and
                offers the same data engineering, big data analytics, Oracle cloud and consulting
                capability to businesses beyond the portfolio. Our seasoned team brings deep
                experience across the systems that keep enterprises running, with a client-centric
                approach that tailors every solution to the demands in front of us.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1}>
              <div
                data-testid={`epoh-about-value-${v.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="h-full rounded-2xl border border-white/5 bg-charcoal/50 p-8 hover:border-champagne/25 transition-colors duration-500"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-champagne/10 text-champagne border border-champagne/20">
                  <v.icon size={19} strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-base font-bold text-white tracking-tight">{v.title}</h3>
                <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24">
          <Reveal>
            <Eyebrow>Where We Work</Eyebrow>
            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              Two offices. <span className="text-champagne">One standard.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {LOCATIONS.map((l, i) => (
              <Reveal key={l.city} delay={i * 0.1}>
                <div data-testid={l.testId} className="h-full rounded-2xl border border-white/5 bg-obsidian/60 p-8">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-champagne" />
                    <h3 className="text-lg font-bold text-white tracking-tight">{l.city}</h3>
                  </div>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">{l.address}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-24">
          <div data-testid="epoh-about-anvaya-band" className="rounded-3xl border border-champagne/20 bg-charcoal/60 p-10 sm:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">An Anvaya Partners Company</p>
              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-[1.1]">
                Part of a firm that invests its own capital <span className="text-champagne">in what it believes.</span>
              </h2>
            </div>
            <Link
              to="/"
              data-testid="epoh-about-anvaya-link"
              className="group inline-flex items-center gap-2 rounded-full border border-champagne/50 text-champagne font-bold tracking-wide px-9 py-4 text-sm hover:bg-champagne hover:text-obsidian transition-colors duration-300 shrink-0 self-start lg:self-center"
            >
              VISIT ANVAYA PARTNERS <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
