import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-cream/60 border-t border-border px-6 py-16">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="bg-gold flex h-8 w-8 items-center justify-center rounded-full"><Sparkles className="h-4 w-4 text-charcoal" /></span>
            <span className="font-display text-xl">Lumi <span className="text-gradient-gold">Glow 15</span></span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-foreground/60">
            Bringing light to your skin. Clean, clinical, kind formulas crafted for your daily ritual.
          </p>
          <form className="mt-6 flex max-w-sm rounded-full border border-border bg-background p-1">
            <input
              type="email"
              placeholder="Join the Glow Club"
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-foreground/40"
            />
            <button className="bg-foreground text-background rounded-full px-5 py-2 text-xs uppercase tracking-widest">
              Subscribe
            </button>
          </form>
        </div>
        {[
          { t: "Shop", l: ["Best Sellers", "Serums", "Moisturizers", "Mystery Box"] },
          { t: "Glow Club", l: ["Skin Quiz", "Loyalty", "Referrals", "Journal"] },
        ].map(c => (
          <div key={c.t}>
            <div className="text-xs uppercase tracking-[0.3em] text-foreground/50">{c.t}</div>
            <ul className="mt-4 space-y-2 text-sm text-foreground/70">
              {c.l.map(i => <li key={i}><a href="#" className="hover:text-foreground">{i}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl items-center justify-between border-t border-border pt-6 text-xs text-foreground/50">
        <span>© 2026 Lumi Glow 15. Bringing light to your skin ✨</span>
        <span>Crafted with radiance</span>
      </div>
    </footer>
  );
}
