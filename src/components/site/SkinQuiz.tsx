import { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

const steps = [
  { q: "What's your skin telling you today?", opts: ["Dry & tight", "Oily / shiny", "Combination", "Sensitive"] },
  { q: "Your biggest glow goal?", opts: ["Brightening", "Hydration", "Anti-aging", "Even tone"] },
  { q: "How's your sleep ritual?", opts: ["8h queen", "6–7h mostly", "Night owl", "It varies"] },
];

export function SkinQuiz() {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const done = step >= steps.length;
  const progress = ((done ? steps.length : step) / steps.length) * 100;

  const choose = (opt: string) => {
    setPicks([...picks, opt]);
    setStep(step + 1);
  };
  const reset = () => { setStep(0); setPicks([]); };

  return (
    <section className="relative overflow-hidden px-6 py-28">
      <div className="bg-glow absolute inset-0 opacity-50" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-foreground/50">AI Skin Lab</span>
          <h2 className="mt-3 font-display text-5xl md:text-7xl leading-tight">
            Your skin, <em className="text-gradient-gold not-italic">decoded</em> in 60 seconds.
          </h2>
          <p className="mt-6 max-w-md text-foreground/70">
            Answer a few questions and our AI builds a daily ritual matched to your unique skin biology.
            Earn 50 Glow Points just for finishing.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-foreground/70">
            {["Personalized AM + PM routine", "Glow score with progress tracking", "Saved to your Glow Club profile"].map(t => (
              <li key={t} className="flex items-center gap-3">
                <span className="bg-champagne h-1.5 w-1.5 rounded-full" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass relative rounded-[2rem] p-8 shadow-glow">
          <div className="bg-secondary mb-8 h-1 overflow-hidden rounded-full">
            <div
              className="bg-gold h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          {!done ? (
            <div key={step} className="animate-fade-up">
              <div className="text-xs uppercase tracking-widest text-foreground/50">
                Question {step + 1} / {steps.length}
              </div>
              <h3 className="mt-3 font-display text-3xl md:text-4xl">{steps[step].q}</h3>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {steps[step].opts.map(opt => (
                  <button
                    key={opt}
                    onClick={() => choose(opt)}
                    className="group bg-card hover:bg-foreground hover:text-background flex items-center justify-between rounded-2xl border border-border px-5 py-4 text-left text-sm transition"
                  >
                    {opt}
                    <ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => { setStep(step - 1); setPicks(picks.slice(0, -1)); }} className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground">
                  <ArrowLeft className="h-3 w-3" /> Back
                </button>
              )}
            </div>
          ) : (
            <div className="animate-fade-up text-center">
              <Sparkles className="text-champagne mx-auto h-10 w-10 animate-glow-pulse" />
              <h3 className="mt-4 font-display text-4xl">Your Glow Score</h3>
              <div className="text-gradient-gold font-display my-4 text-7xl">A+</div>
              <p className="text-foreground/70">
                Based on <strong>{picks.join(" · ")}</strong>, we've curated your Lumi ritual.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <button className="bg-foreground text-background rounded-full px-6 py-3 text-sm uppercase tracking-wider">
                  See My Routine
                </button>
                <button onClick={reset} className="glass rounded-full px-6 py-3 text-sm uppercase tracking-wider">
                  Retake
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
