import skin from "@/assets/skin-texture.jpg";

const steps = [
  { n: "01", t: "Cleanse", d: "Milky cream cleanser melts away the day." },
  { n: "02", t: "Treat", d: "15% Vitamin C wakes up dull, tired skin." },
  { n: "03", t: "Hydrate", d: "Peptide cream seals in deep moisture." },
  { n: "04", t: "Glow", d: "Champagne mist for that lit-from-within finish." },
];

export function Ritual() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background px-6 py-28">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.2fr] items-center">
        <div className="relative">
          <img
            src={skin}
            alt="Glowing skin texture"
            loading="lazy"
            width={1280}
            height={1600}
            className="rounded-[2rem] shadow-glow"
          />
          <div className="glass-dark absolute -right-4 bottom-8 rounded-2xl p-4 text-sm">
            <div className="text-xs uppercase tracking-widest text-background/60">Hydration</div>
            <div className="font-display text-3xl text-gradient-gold">+148%</div>
          </div>
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-background/50">Build Your Ritual</span>
          <h2 className="mt-3 font-display text-5xl md:text-7xl">
            Four steps to your <em className="text-gradient-gold not-italic">brightest</em> self.
          </h2>
          <div className="mt-12 space-y-6">
            {steps.map((s) => (
              <div key={s.n} className="group flex gap-6 border-b border-background/10 pb-6 transition hover:border-champagne">
                <div className="font-display text-champagne text-3xl">{s.n}</div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl text-background">{s.t}</h3>
                  <p className="mt-1 text-background/60">{s.d}</p>
                </div>
                <div className="self-center text-background/40 transition group-hover:translate-x-1 group-hover:text-champagne">→</div>
              </div>
            ))}
          </div>
          <button className="bg-gold text-charcoal mt-10 rounded-full px-7 py-4 text-sm font-medium uppercase tracking-wider shadow-glow">
            Build My Kit · Save 25%
          </button>
        </div>
      </div>
    </section>
  );
}
