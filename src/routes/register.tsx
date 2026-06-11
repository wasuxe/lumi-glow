import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Eye, EyeOff, AlertCircle, Check, ArrowRight } from "lucide-react";
import { supabaseRegister, supabaseLogin } from "@/lib/supabaseStore";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — Lumi Glow 15" },
      { name: "description", content: "Join Lumi Glow 15 and unlock your personalized skincare ritual." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordStrength = () => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-destructive", "bg-yellow-400", "bg-champagne", "bg-green-500"];
  const strength = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);

    const result = await supabaseRegister(name.trim(), email.trim(), password);
    if (!result.ok) {
      setLoading(false);
      setError(result.error || "Registration failed.");
      return;
    }

    // Auto login after registration
    await supabaseLogin(email.trim(), password);
    setLoading(false);
    setSuccess(true);
    window.dispatchEvent(new Event("auth-updated"));
    setTimeout(() => navigate({ to: "/" }), 1800);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-foreground p-12 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-glow/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-champagne/10 blur-3xl" />
        </div>
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <span className="bg-gold flex h-9 w-9 items-center justify-center rounded-full shadow-glow">
            <Sparkles className="h-4 w-4 text-charcoal" />
          </span>
          <span className="font-display text-xl text-ivory">
            Lumi <span className="text-gradient-gold">Glow 15</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="font-display text-5xl text-ivory leading-tight">
            Join 240k<br />
            <em className="text-gradient-gold not-italic">glow girls</em><br />
            today.
          </h2>
          <p className="text-ivory/50 text-base max-w-xs leading-relaxed">
            Create your free account and get access to personalized routines, exclusive discounts, and glow rewards.
          </p>
          <ul className="space-y-3">
            {[
              "50 Glow Points on sign up",
              "Personalized skin quiz",
              "Early access to new launches",
              "Free shipping on first order",
            ].map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-ivory/70 text-sm">
                <span className="h-5 w-5 rounded-full bg-champagne/20 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-champagne" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-xs text-ivory/20">
          © 2026 Lumi Glow 15. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="bg-gold flex h-9 w-9 items-center justify-center rounded-full shadow-glow">
              <Sparkles className="h-4 w-4 text-charcoal" />
            </span>
            <span className="font-display text-xl">
              Lumi <span className="text-gradient-gold">Glow 15</span>
            </span>
          </Link>

          {success ? (
            <div className="text-center py-12 animate-fade-up">
              <div className="h-20 w-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-5 shadow-glow text-4xl">
                ✨
              </div>
              <h1 className="font-display text-4xl">Welcome aboard!</h1>
              <p className="mt-3 text-foreground/50">Your account is ready. Redirecting you home…</p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-4xl">Create account ✨</h1>
              <p className="mt-2 text-foreground/50 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-champagne hover:underline font-medium" id="go-to-login">
                  Sign in
                </Link>
              </p>

              {error && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="reg-name" className="block text-xs uppercase tracking-widest text-foreground/50 mb-2">
                    Full Name
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                    className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-champagne transition placeholder:text-foreground/30"
                  />
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-xs uppercase tracking-widest text-foreground/50 mb-2">
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-champagne transition placeholder:text-foreground/30"
                  />
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-xs uppercase tracking-widest text-foreground/50 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      autoComplete="new-password"
                      className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-champagne transition placeholder:text-foreground/30 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password strength */}
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= strength ? strengthColor[strength] : "bg-border"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-foreground/50">{strengthLabel[strength]}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-confirm" className="block text-xs uppercase tracking-widest text-foreground/50 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="reg-confirm"
                      type={showPass ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      autoComplete="new-password"
                      className={`w-full rounded-2xl border bg-card px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-champagne transition placeholder:text-foreground/30 pr-12 ${confirm && confirm !== password ? "border-destructive" : "border-border"}`}
                    />
                    {confirm && confirm === password && (
                      <Check className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  id="register-submit-btn"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-foreground text-background rounded-full py-4 text-sm uppercase tracking-wider font-medium hover:opacity-90 disabled:opacity-60 transition mt-2"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <><span>Create Account</span><ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-foreground/30">
                By registering you agree to our{" "}
                <a href="#" className="underline hover:text-foreground/60">Terms</a>{" "}
                &{" "}
                <a href="#" className="underline hover:text-foreground/60">Privacy Policy</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
