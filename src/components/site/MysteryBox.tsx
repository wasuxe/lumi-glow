import { Gift, Clock } from "lucide-react";

export function MysteryBox() {
  return (
    <section className="px-6 py-28">
      <div className="bg-foreground text-background relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] p-12 md:p-20">
        <div className="bg-gold absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl" />
        <div className="bg-gold absolute -left-32 -bottom-32 h-96 w-96 rounded-full opacity-20 blur-3xl" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-champagne text-xs uppercase tracking-[0.3em]">Mystery Drop · Limited</span>
            <h2 className="mt-3 font-display text-5xl md:text-6xl">
              The <em className="text-gradient-gold not-italic">Lumi Box</em>.<br />Surprise. Every month.
            </h2>
            <p className="mt-6 max-w-md text-background/70">
              5+ full-size and exclusive products curated to your skin profile. Worth $180. Yours from $39/mo.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <button className="bg-gold text-charcoal rounded-full px-7 py-4 text-sm uppercase tracking-wider shadow-glow">
                Reveal This Month
              </button>
              <div className="text-background/70 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-champagne" /> 02d : 14h : 38m
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gold relative flex h-72 w-72 items-center justify-center rounded-3xl shadow-glow animate-float">
              <Gift className="h-24 w-24 text-charcoal" />
              <div className="absolute -top-3 left-1/2 h-2 w-[110%] -translate-x-1/2 bg-charcoal rounded-full" />
              <div className="absolute -bottom-6 -right-6 glass-dark rounded-2xl px-4 py-3 text-xs uppercase tracking-widest text-background">
                ✨ Drop 02
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
