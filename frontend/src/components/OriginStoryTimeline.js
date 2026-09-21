import { Reveal, Eyebrow } from "@/components/Reveal";
import { HandHeart, Hammer, Mountain, Building2 } from "lucide-react";

const chapters = [
  {
    num: "01",
    icon: HandHeart,
    title: "First Salary",
    body: "Straight out of college, our first salaries went to our parents and to God. Gratitude before ambition.",
  },
  {
    num: "02",
    icon: Hammer,
    title: "Second Salary",
    body: "With our second month's salaries, we started our own company. That leap became the name we build under.",
  },
  {
    num: "03",
    icon: Mountain,
    title: "The Journey",
    body: "Building taught us what builders actually need — capital, technology, people and someone in the trenches with them.",
  },
  {
    num: "04",
    icon: Building2,
    title: "Second Salary Capital",
    body: "The next chapter: an ecosystem where other people can build companies of their own. Again and again.",
  },
];

export default function OriginStoryTimeline() {
  return (
    <section data-testid="origin-story" className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Our Story</Eyebrow>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
                Our first salary was for <span className="text-gray-500">gratitude.</span>
                <br />
                Our second salary was for <span className="text-champagne">building.</span>
              </h2>
              <p className="mt-8 text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
                The name Second Salary Capital does not mean a second income. It is the true story
                of how our founders became entrepreneurs — and why we now exist to help the next
                generation of builders take the same leap.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7 relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-champagne/60 via-white/10 to-transparent hidden sm:block" aria-hidden="true" />
            <div className="space-y-6">
              {chapters.map((c, i) => (
                <Reveal key={c.num} delay={i * 0.12}>
                  <div
                    data-testid={`story-chapter-${c.num}`}
                    className="group relative flex gap-6 rounded-2xl border border-white/5 bg-charcoal/60 p-6 sm:p-8 hover:border-champagne/30 hover:bg-charcoal transition-colors duration-500"
                  >
                    <div className="shrink-0 flex flex-col items-center">
                      <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-champagne/25 bg-obsidian text-champagne">
                        <c.icon size={20} strokeWidth={1.75} />
                      </span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-champagne/70">{c.num}</span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{c.title}</h3>
                      </div>
                      <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
