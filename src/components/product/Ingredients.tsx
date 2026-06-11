import type { Ingredient } from "@/data/products";

export function Ingredients({ items, science }: { items: Ingredient[]; science: string }) {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-foreground/50">Hero Ingredients</span>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Crafted with <em className="text-gradient-gold not-italic">15+ actives</em>.</h2>
        <div className="mt-8 space-y-3">
          {items.map((i) => (
            <div key={i.name} className="group flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition hover:border-champagne hover:shadow-soft">
              <div>
                <div className="font-display text-xl">{i.name}</div>
                <div className="text-sm text-foreground/60">{i.benefit}</div>
              </div>
              <div className="text-gradient-gold font-display text-2xl">{i.pct}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass relative flex flex-col justify-center rounded-[2rem] p-10 shadow-soft">
        <div className="bg-glow absolute inset-0 rounded-[2rem] opacity-40" />
        <div className="relative">
          <span className="text-xs uppercase tracking-[0.3em] text-foreground/50">Skin Science</span>
          <h3 className="mt-3 font-display text-3xl leading-tight">Backed by <em className="text-gradient-gold not-italic">clinical data</em>.</h3>
          <p className="mt-6 text-foreground/70">{science}</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { v: "98%", l: "Saw glow" },
              { v: "+148%", l: "Hydration" },
              { v: "14d", l: "Visible results" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-card/70 p-4 text-center">
                <div className="text-gradient-gold font-display text-2xl">{s.v}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-foreground/55">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
