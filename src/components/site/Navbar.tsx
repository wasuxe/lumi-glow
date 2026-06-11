import { Link } from "@tanstack/react-router";
import { ShoppingBag, Search, Sparkles, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { CartDrawer } from "@/components/site/CartDrawer";
import { getCart } from "@/lib/store";
import { getSupabaseCustomer, supabaseLogout, onAuthChange } from "@/lib/supabaseStore";
import type { Customer } from "@/lib/store";

const links = [
  { label: "Shop", href: "/shop" },
  { label: "Skin Quiz", href: "/" },
  { label: "Rituals", href: "/" },
  { label: "Glow Club", href: "/" },
];

export function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const refreshCart = () => setCartCount(getCart().reduce((s, c) => s + c.qty, 0));

  useEffect(() => {
    refreshCart();
    getSupabaseCustomer().then(setCustomer);

    window.addEventListener("cart-updated", refreshCart);
    const { data: authListener } = onAuthChange(setCustomer);

    return () => {
      window.removeEventListener("cart-updated", refreshCart);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
        <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-gold flex h-8 w-8 items-center justify-center rounded-full shadow-glow">
              <Sparkles className="h-4 w-4 text-charcoal" />
            </span>
            <span className="font-display text-lg tracking-tight">
              Lumi <span className="text-gradient-gold">Glow 15</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button className="hover:bg-secondary rounded-full p-2 transition" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>

            {/* User account */}
            {customer ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm transition hover:bg-secondary"
                  id="user-menu-btn"
                >
                  <span className="h-6 w-6 rounded-full bg-gold flex items-center justify-center text-[10px] font-bold text-charcoal">
                    {customer.name[0].toUpperCase()}
                  </span>
                  <span className="hidden sm:inline text-sm max-w-[80px] truncate">{customer.name.split(" ")[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 glass rounded-2xl shadow-soft overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs font-medium truncate">{customer.name}</p>
                      <p className="text-[10px] text-foreground/40 truncate">{customer.email}</p>
                    </div>
                    <button
                      onClick={async () => {
                        await supabaseLogout();
                        setUserMenuOpen(false);
                        setCustomer(null);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-foreground/60 hover:bg-secondary transition"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                id="navbar-login-btn"
                className="hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:bg-secondary"
              >
                <User className="h-3.5 w-3.5" /> Sign In
              </Link>
            )}

            <button
              onClick={() => setCartOpen(true)}
              id="open-cart-btn"
              className="bg-foreground text-background flex items-center gap-2 rounded-full px-4 py-2 text-sm transition hover:opacity-90"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Bag{cartCount > 0 ? ` · ${cartCount}` : ""}</span>
            </button>

            <button
              className="md:hidden hover:bg-secondary rounded-full p-2 transition"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="glass mx-auto mt-2 max-w-7xl rounded-2xl px-5 py-4 md:hidden">
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="block text-sm text-foreground/70 hover:text-foreground transition" onClick={() => setMenuOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
              {!customer && (
                <li>
                  <Link to="/login" className="block text-sm text-champagne hover:text-foreground transition" onClick={() => setMenuOpen(false)}>
                    Sign In / Register
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
