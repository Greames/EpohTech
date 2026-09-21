const WORDS = [
  "Company Building",
  "Capital",
  "Technology",
  "Founders",
  "Investors",
  "Market Intelligence",
  "EPOHTECH",
  "Validation",
  "Scale",
];

export default function EditorialMarquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div
      data-testid="editorial-marquee"
      className="relative overflow-hidden border-y border-white/5 bg-charcoal/30 py-6 select-none"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center gap-10">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-extrabold uppercase tracking-tight text-2xl md:text-4xl text-white/10 whitespace-nowrap">
              {w}
            </span>
            <span className="h-2 w-2 rotate-45 bg-champagne/40 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
