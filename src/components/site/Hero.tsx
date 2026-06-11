import heroProduct from "@/assets/hero-product.png";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative grain min-h-screen overflow-hidden bg-aurora pt-32 pb-20">
      {/* glow orbs */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-glow opacity-70 blur-3xl animate-glow-pulse" />
      <div className="absolute -bottom-32 right-0 h-[600px] w-[600px] rounded-full bg-glow opacity-60 blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

      {/* particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="bg-champagne pointer-events-none absolute h-1 w-1 rounded-full opacity-70 shadow-glow animate-float"
          style={{
            top: `${(i * 53) % 100}%`,
            left: `${(i * 37) % 100}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${5 + (i % 5)}s`,
          }}
        />
      ))}

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div className="animate-fade-up">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-foreground/70">
            <Sparkles className="h-3 w-3" /> New · Glow Drop 02
          </span>
          <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-tight">
            Glow that <em className="not-italic text-gradient-gold">lights you</em> up.
          </h1>
          <p className="mt-6 max-w-md text-lg text-foreground/70">
            Personalized skincare rituals powered by AI and crafted with clean, clinical ingredients.
            Discover the formula your skin has been waiting for.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="group bg-foreground text-background relative flex items-center gap-2 overflow-hidden rounded-full px-7 py-4 text-sm font-medium uppercase tracking-wider transition hover:scale-[1.02]">
              Take Skin Quiz
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="glass rounded-full px-7 py-4 text-sm font-medium uppercase tracking-wider text-foreground transition hover:shadow-glow">
              Shop Best Sellers
            </button>
          </div>

          <div className="mt-14 flex items-center gap-8 text-xs uppercase tracking-widest text-foreground/55">
            <div><div className="font-display text-3xl text-foreground normal-case tracking-tight">15<span className="text-champagne">+</span></div>actives</div>
            <div className="bg-border h-10 w-px" />
            <div><div className="font-display text-3xl text-foreground normal-case tracking-tight">98%</div>saw glow in 14d</div>
            <div className="bg-border h-10 w-px" />
            <div><div className="font-display text-3xl text-foreground normal-case tracking-tight">240k</div>glow club</div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="bg-gold absolute inset-12 rounded-full blur-3xl opacity-60 animate-glow-pulse" />
          <div className="relative animate-float">
            <div className="absolute inset-0 -m-8 rounded-[3rem] bg-gold opacity-30 blur-2xl" />
            <img
              src={heroProduct}
              alt="LUMI Glow 15 Radiant Glow Serum"
              width={780}
              height={780}
              className="relative w-[min(560px,90vw)] rounded-[2.5rem] object-cover shadow-glow"

            />
            <div className="glass absolute -bottom-6 -left-6 rounded-2xl p-4 shadow-soft animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="text-[10px] uppercase tracking-widest text-foreground/60">Glow Score</div>
              <div className="font-display text-3xl text-gradient-gold">A+</div>
            </div>
            <div className="glass absolute -top-4 -right-4 rounded-full px-4 py-2 text-xs animate-fade-up" style={{ animationDelay: "0.6s" }}>
              ✨ Niacinamide · Vit C · Peptides
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
