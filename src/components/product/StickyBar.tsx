import { useEffect, useState } from "react";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import type { Product } from "@/data/products";

export function StickyBar({ product, qty, setQty, onAdd }: {
  product: Product;
  qty: number;
  setQty: (n: number) => void;
  onAdd: () => void;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="glass mx-auto flex max-w-3xl items-center gap-4 rounded-full p-2 pl-6 shadow-glow">
        <div className="hidden sm:block">
          <div className="font-display text-base leading-tight">{product.name}</div>
          <div className="text-xs text-foreground/60">{product.size} · ${product.price}</div>
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1.5 hover:opacity-70" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
          <span className="w-6 text-center text-sm">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="p-1.5 hover:opacity-70" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
        </div>
        <button
          onClick={onAdd}
          className="bg-foreground text-background flex items-center gap-2 rounded-full px-6 py-3 text-sm uppercase tracking-wider transition hover:scale-[1.02]"
        >
          <ShoppingBag className="h-4 w-4" />
          Add · ${(product.price * qty).toFixed(0)}
        </button>
      </div>
    </div>
  );
}
