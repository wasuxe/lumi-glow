import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import {
  isAdminCredentials, adminLogin,
} from "@/lib/store";
import { supabaseLogin } from "@/lib/supabaseStore";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Lumi Glow 15" },
      { name: "description", content: "Sign in to your Lumi Glow account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);

    // Check if admin credentials
    if (isAdminCredentials(email, password)) {
      adminLogin(email, password);
      setLoading(false);
      navigate({ to: "/admin" });
      return;
    }

    // Try customer login via Supabase
    const result = await supabaseLogin(email, password);
    setLoading(false);
    if (result.ok) {
      window.dispatchEvent(new Event("auth-updated"));
      navigate({ to: "/" });
    } else {
      setError(result.error || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-foreground p-12 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-champagne/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-rose/10 blur-3xl" />
        </div>
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <span className="bg-gold flex h-9 w-9 items-center justify-center rounded-full shadow-glow">
            <Sparkles className="h-4 w-4 text-charcoal" />
          </span>
          <span className="font-display text-xl text-ivory">
            Lumi <span className="text-gradient-gold">Glow 15</span>
          </span>
        </Link>
        <div className="relative z-10">
          <h2 className="font-display text-5xl text-ivory leading-tight">
            Your skin's<br />
            <em className="text-gradient-gold not-italic">glow ritual</em><br />
            awaits.
          </h2>
          <p className="mt-6 text-ivory/50 text-base max-w-xs leading-relaxed">
            Sign in to access your personalized skincare dashboard, track orders, and unlock exclusive glow rewards.
          </p>
          <div className="mt-10 flex gap-6">
            {[{ n: "240k+", l: "Customers" }, { n: "4.9★", l: "Rated" }, { n: "50+", l: "Glow Points" }].map(({ n, l }) => (
              <div key={l}>
                <div className="font-display text-2xl text-champagne">{n}</div>
                <div className="text-xs uppercase tracking-widest text-ivory/40 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
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

          <h1 className="font-display text-4xl">Welcome back ✨</h1>
          <p className="mt-2 text-foreground/50 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-champagne hover:underline font-medium" id="go-to-register">
              Create one free
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
              <label htmlFor="login-email" className="block text-xs uppercase tracking-widest text-foreground/50 mb-2">
                Email Address
              </label>
              <input
                id="login-email"
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="text-xs uppercase tracking-widest text-foreground/50">
                  Password
                </label>
                <button type="button" className="text-xs text-champagne hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
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
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-foreground text-background rounded-full py-4 text-sm uppercase tracking-wider font-medium hover:opacity-90 disabled:opacity-60 transition mt-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-foreground/40 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social logins (cosmetic) */}
          <div className="grid grid-cols-2 gap-3">
            {[{ label: "Google", icon: "🔍" }, { label: "Apple", icon: "🍎" }].map(({ label, icon }) => (
              <button
                key={label}
                type="button"
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm hover:bg-secondary transition"
              >
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-foreground/30">
            By signing in you agree to our{" "}
            <a href="#" className="underline hover:text-foreground/60">Terms</a>{" "}
            &{" "}
            <a href="#" className="underline hover:text-foreground/60">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
