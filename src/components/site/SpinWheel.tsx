import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";

const rewards = ["10% OFF", "Free Sample", "Mystery Gift", "100 ✦", "Free Ship", "20% OFF", "VIP Drop", "Glow Kit"];

export function SpinWheel() {
  const [angle, setAngle] = useState(0);
  const [reward, setReward] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * rewards.length);
    const next = angle + 360 * 5 + (360 / rewards.length) * idx;
    setAngle(next);
    setTimeout(() => {
      setReward(rewards[rewards.length - idx - 1] ?? rewards[0]);
      setSpinning(false);
    }, 4200);
  };

  const seg = 360 / rewards.length;

  return (
    <section className="relative overflow-hidden bg-aurora px-6 py-28 grain">
      <div className="bg-glow absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-foreground/50">Daily Spin</span>
          <h2 className="mt-3 font-display text-5xl md:text-7xl">
            Spin for your <em className="text-gradient-gold not-italic">daily glow</em>.
          </h2>
          <p className="mt-6 max-w-md text-foreground/70">
            Show up, spin once a day, and unlock surprises. Every spin earns Glow Points toward bigger rewards.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <div className="glass rounded-2xl px-5 py-4">
              <div className="text-xs uppercase tracking-widest text-foreground/50">Streak</div>
              <div className="font-display text-3xl">7 days 🔥</div>
            </div>
            <div className="glass rounded-2xl px-5 py-4">
              <div className="text-xs uppercase tracking-widest text-foreground/50">Glow Points</div>
              <div className="font-display text-gradient-gold text-3xl">1,240</div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex h-[420px] w-[420px] items-center justify-center">
          <div className="bg-gold absolute inset-0 rounded-full blur-3xl opacity-70 animate-glow-pulse" />
          <div
            className="relative h-full w-full rounded-full border-[6px] border-champagne shadow-glow transition-transform"
            style={{
              transform: `rotate(${angle}deg)`,
              transitionDuration: spinning ? "4s" : "0s",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              background: `conic-gradient(${rewards
                .map((_, i) => {
                  const c = i % 2 === 0 ? "oklch(0.97 0.05 85)" : "oklch(0.88 0.1 70)";
                  return `${c} ${i * seg}deg ${(i + 1) * seg}deg`;
                })
                .join(",")})`,
            }}
          >
            {rewards.map((r, i) => (
              <div
                key={r}
                className="absolute left-1/2 top-1/2 origin-left text-xs font-medium uppercase tracking-wider text-charcoal"
                style={{ transform: `rotate(${i * seg + seg / 2}deg) translateX(70px)` }}
              >
                {r}
              </div>
            ))}
          </div>
          <button
            onClick={spin}
            disabled={spinning}
            className="bg-foreground text-background absolute z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full text-xs uppercase tracking-widest shadow-glow transition hover:scale-105 disabled:opacity-70"
          >
            <Sparkles className="mb-1 h-4 w-4" />
            {spinning ? "..." : "Spin"}
          </button>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl text-champagne">▼</div>

          {reward && !spinning && (
            <div className="glass animate-fade-up absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-6 py-3 text-sm">
              <Gift className="mr-2 inline h-4 w-4 text-champagne" />
              You won <strong className="text-gradient-gold">{reward}</strong>!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
