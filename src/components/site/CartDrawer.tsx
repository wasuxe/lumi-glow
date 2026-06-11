import { useState, useEffect } from "react";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, MapPin, Phone, User } from "lucide-react";
import {
  getCart,
  removeFromCart,
  updateCartQty,
  clearCart,
  getCartTotal,
  CartItem,
} from "@/lib/store";
import { getSupabaseCustomer, insertOrder } from "@/lib/supabaseStore";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

type Step = "cart" | "checkout" | "success";

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [formError, setFormError] = useState("");

  const refresh = () => setCart([...getCart()]);

  useEffect(() => {
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  useEffect(() => {
    if (open) {
      refresh();
      document.body.style.overflow = "hidden";
      // Pre-fill name from logged-in customer
      getSupabaseCustomer().then(customer => {
        if (customer) {
          setForm((f) => ({ ...f, name: f.name || customer.name }));
        }
      });
    } else {
      document.body.style.overflow = "";
      setStep("cart");
      setFormError("");
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const total = getCartTotal();

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) { setFormError("Please enter your name."); return; }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) { setFormError("Enter a valid 10-digit Indian mobile number."); return; }
    if (form.address.trim().length < 10) { setFormError("Please enter your full delivery address."); return; }

    insertOrder({
      items: cart,
      total,
      customer: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });
    clearCart();
    setStep("success");
  };

  const goToCheckout = () => {
    setStep("checkout");
    setFormError("");
  };

  const freeShippingThreshold = 2999;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[200] bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[201] h-full w-full max-w-[440px] flex flex-col bg-background shadow-2xl transition-transform duration-400 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5" />
            <span className="font-display text-xl">
              {step === "checkout" ? "Delivery Details" : "Your Bag"}
            </span>
            {step === "cart" && cart.length > 0 && (
              <span className="bg-foreground text-background flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
                {cart.reduce((s, c) => s + c.qty, 0)}
              </span>
            )}
          </div>
          <button
            onClick={step === "checkout" ? () => setStep("cart") : onClose}
            className="rounded-full p-2 hover:bg-secondary transition"
            aria-label={step === "checkout" ? "Back to cart" : "Close cart"}
          >
            {step === "checkout" ? (
              <span className="text-xs text-foreground/60 px-1">← Back</span>
            ) : (
              <X className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* ── SUCCESS STATE ── */}
        {step === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center animate-fade-up">
            <div className="bg-gold h-20 w-20 rounded-full flex items-center justify-center text-4xl shadow-glow">
              ✨
            </div>
            <h3 className="font-display text-3xl">Order Placed!</h3>
            <p className="text-foreground/60">
              Your glow ritual is on its way. Thank you for choosing Lumi Glow!
            </p>
            <p className="text-sm text-foreground/40 mt-1">
              Our team will contact you on <strong>{form.phone}</strong> to confirm delivery.
            </p>
            <button
              onClick={() => { setStep("cart"); onClose(); }}
              className="mt-4 bg-foreground text-background rounded-full px-8 py-3 text-sm uppercase tracking-wider"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {step === "cart" && cart.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-4xl">
              🛍️
            </div>
            <h3 className="font-display text-2xl">Your bag is empty</h3>
            <p className="text-sm text-foreground/55">
              Discover your perfect glow ritual and add products to your bag.
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-foreground text-background rounded-full px-6 py-3 text-sm uppercase tracking-wider"
            >
              Shop Now
            </button>
          </div>
        )}

        {/* ── CART ITEMS ── */}
        {step === "cart" && cart.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                  <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-gradient-to-br from-champagne/30 to-glow/30 overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display text-base leading-tight">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex-shrink-0 rounded-full p-1 hover:bg-secondary transition text-foreground/40 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-foreground/50 mt-0.5">{item.size}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-border bg-background px-1">
                        <button onClick={() => updateCartQty(item.id, item.qty - 1)} className="p-1.5 hover:opacity-70">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateCartQty(item.id, item.qty + 1)} className="p-1.5 hover:opacity-70">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        {item.offerPrice ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground/40 text-xs line-through">₹{item.price}</span>
                            <span className="font-display text-base">₹{(item.offerPrice * item.qty).toFixed(0)}</span>
                          </div>
                        ) : (
                          <span className="font-display text-base">₹{(item.price * item.qty).toFixed(0)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Free shipping progress */}
            <div className="px-6 py-3 border-t border-border">
              {total < freeShippingThreshold ? (
                <div>
                  <p className="text-xs text-foreground/60 mb-1">
                    Add <strong>₹{(freeShippingThreshold - total).toFixed(0)}</strong> more for free shipping
                  </p>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-champagne font-medium">✓ You've unlocked free shipping!</p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/60">Subtotal</span>
                <span className="font-display text-xl">₹{total.toFixed(0)}</span>
              </div>
              <button
                onClick={goToCheckout}
                className="w-full bg-foreground text-background flex items-center justify-center gap-2 rounded-full py-4 text-sm uppercase tracking-wider font-medium hover:opacity-90 transition"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => clearCart()}
                className="w-full text-center text-xs text-foreground/40 hover:text-foreground/70 transition py-1"
              >
                Clear bag
              </button>
            </div>
          </>
        )}

        {/* ── CHECKOUT FORM ── */}
        {step === "checkout" && (
          <form onSubmit={handleCheckout} className="flex flex-col flex-1 overflow-y-auto">
            <div className="flex-1 px-6 py-5 space-y-5">
              <p className="text-sm text-foreground/50">Fill in your delivery details to complete the order.</p>

              {formError && (
                <div className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Priya Sharma"
                    id="checkout-name"
                    className="w-full rounded-2xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-champagne"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-1.5">
                  Mobile Number * <span className="text-foreground/30">(10-digit)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                    placeholder="9876543210"
                    id="checkout-phone"
                    className="w-full rounded-2xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-champagne"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-1.5">
                  Delivery Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-4 w-4 text-foreground/30" />
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="House/Flat No., Street, Area, City, State – PIN Code"
                    id="checkout-address"
                    rows={4}
                    className="w-full rounded-2xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-champagne resize-none"
                  />
                </div>
              </div>

              {/* Order summary */}
              <div className="rounded-2xl bg-secondary/50 p-4 space-y-2">
                <p className="text-xs uppercase tracking-widest text-foreground/40 mb-3">Order Summary</p>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground/70 truncate max-w-[60%]">{item.name} × {item.qty}</span>
                    <span className="font-medium">₹{((item.offerPrice ?? item.price) * item.qty).toFixed(0)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span className="font-display text-base">₹{total.toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border px-6 py-5">
              <button
                type="submit"
                className="w-full bg-foreground text-background flex items-center justify-center gap-2 rounded-full py-4 text-sm uppercase tracking-wider font-medium hover:opacity-90 transition"
              >
                Place Order · ₹{total.toFixed(0)} <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-center text-[11px] text-foreground/40 mt-3">
                Cash on delivery available · Free returns within 7 days
              </p>
            </div>
          </form>
        )}
      </aside>
    </>
  );
}
