export function Marquee() {
  const items = ["Vogue", "Allure", "Elle", "Harper's Bazaar", "Cosmopolitan", "Byrdie", "Refinery29"];
  return (
    <section className="border-y border-border/60 bg-cream/40 py-6 overflow-hidden">
      <div className="flex gap-16 whitespace-nowrap animate-[shimmer_30s_linear_infinite]" style={{ width: "max-content" }}>
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="font-display text-2xl text-foreground/40 tracking-widest">
            {it} <span className="text-champagne">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
