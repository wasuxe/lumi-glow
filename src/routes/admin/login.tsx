import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { adminLogin, isAdminAuthenticated } from "@/lib/store";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Lumi Glow 15" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in
  if (isAdminAuthenticated()) {
    navigate({ to: "/admin" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate async
    const ok = adminLogin(username.trim(), password);
    setLoading(false);
    if (ok) {
      navigate({ to: "/admin" });
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-champagne/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-rose/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <span className="bg-gold flex h-12 w-12 items-center justify-center rounded-full shadow-glow">
              <Sparkles className="h-6 w-6 text-charcoal" />
            </span>
          </div>
          <h1 className="font-display text-4xl text-ivory">Lumi <span className="text-gradient-gold">Glow 15</span></h1>
          <div className="mt-3 flex items-center justify-center gap-2 text-ivory/50 text-sm">
            <Shield className="h-4 w-4" />
            <span>Admin Portal</span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-dark rounded-3xl p-8">
          <h2 className="font-display text-2xl text-ivory mb-1">Welcome back</h2>
          <p className="text-ivory/50 text-sm mb-8">Sign in to your admin dashboard</p>

          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-destructive/20 border border-destructive/30 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-xs uppercase tracking-widest text-ivory/50 mb-2">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@lumiglow15.com"
                required
                autoComplete="username"
                className="w-full rounded-2xl border border-ivory/10 bg-ivory/5 px-5 py-4 text-sm text-ivory placeholder:text-ivory/30 outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs uppercase tracking-widest text-ivory/50 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-ivory/10 bg-ivory/5 px-5 py-4 text-sm text-ivory placeholder:text-ivory/30 outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory transition"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="w-full bg-gold text-charcoal rounded-full py-4 text-sm uppercase tracking-widest font-semibold transition hover:opacity-90 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : "Sign In"}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-8 rounded-2xl border border-champagne/20 bg-champagne/5 p-4">
            <p className="text-xs text-ivory/50 text-center mb-2 uppercase tracking-widest">Demo Credentials</p>
            <p className="text-xs text-ivory/70 text-center">admin@lumiglow15.com</p>
            <p className="text-xs text-ivory/70 text-center">LumiAdmin@2026</p>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-ivory/30">
          This portal is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
}
