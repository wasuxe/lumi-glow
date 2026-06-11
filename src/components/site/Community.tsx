import { Heart, MessageCircle } from "lucide-react";

const posts = [
  { user: "@mira.glow", caption: "Two weeks in & my skin is THAT girl ✨", color: "from-peach/60 to-glow/40" },
  { user: "@sara.skin", caption: "The serum hits different at 7am 🌅", color: "from-rose/40 to-cream/30" },
  { user: "@lila.lit",  caption: "Cannot stop staring at my glow", color: "from-champagne/40 to-peach/40" },
  { user: "@noor.aura", caption: "Lumi nights >>>", color: "from-glow/50 to-rose/30" },
];

export function Community() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-foreground/50">#LumiGlow</span>
          <h2 className="mt-3 font-display text-5xl md:text-7xl">
            Real glow, <em className="text-gradient-gold not-italic">real girls</em>.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((p, i) => (
            <div
              key={p.user}
              className={`group relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br ${p.color} p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-glow`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
              <div className="relative flex h-full flex-col justify-between text-background">
                <div className="flex items-center gap-2">
                  <div className="bg-background/80 h-8 w-8 rounded-full ring-1 ring-white/40" />
                  <span className="text-xs font-medium">{p.user}</span>
                </div>
                <div>
                  <p className="font-display text-lg">{p.caption}</p>
                  <div className="mt-3 flex gap-4 text-xs opacity-90">
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> 2.4k</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> 84</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
