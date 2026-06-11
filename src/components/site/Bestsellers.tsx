import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import cream from "@/assets/product-cream.jpg";
import serum from "@/assets/product-serum.jpg";
import mist from "@/assets/product-mist.jpg";
import { Plus } from "lucide-react";
import { subscribeProducts } from "@/lib/supabaseStore";
import type { AdminProduct } from "@/lib/store";

const staticProducts = [
  { slug: "aura-glow-serum", name: "Aura Glow Serum", tag: "Vitamin C 15%", price: "₹3,999", img: serum, color: "from-champagne/30 to-glow/30" },
  { slug: "velvet-light-cream", name: "Velvet Light Cream", tag: "Peptide Hydration", price: "₹4,499", img: cream, color: "from-peach/40 to-cream/30" },
  { slug: "halo-essence-mist", name: "Halo Essence Mist", tag: "Niacinamide Glow", price: "₹2,999", img: mist, color: "from-rose/30 to-peach/30" },
];

export function Bestsellers() {
  const [products, setProducts] = useState<AdminProduct[]>([]);

  useEffect(() => {
    const unsub = subscribeProducts(setProducts);
    return () => { if (typeof unsub === "function") unsub(); };
  }, []);

  const display = (products && products.length > 0)
    ? products.slice(0, 3).map(p => ({ slug: p.slug, name: p.name, tag: p.tag, price: `₹${p.price.toLocaleString("en-IN")}`, img: p.image || serum, color: "from-champagne/30 to-glow/30" }))
    : staticProducts;

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-foreground/50">The Edit</span>
            <h2 className="mt-3 font-display text-5xl md:text-7xl">
              Loved by <em className="text-gradient-gold not-italic">240k</em> glow girls.
            </h2>
          </div>
          <a href="#" className="hidden text-sm uppercase tracking-widest text-foreground/70 hover:text-foreground md:block">
            View all →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {display.map((p, i) => (
            <Link
              to="/shop/$slug"
              params={{ slug: p.slug }}
              key={p.slug}
              className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-2 hover:shadow-glow"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br ${p.color}`}>
                <div className="bg-gold absolute inset-8 rounded-full opacity-0 blur-2xl transition group-hover:opacity-60" />
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="relative h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <button className="bg-foreground text-background absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full opacity-0 transition group-hover:opacity-100">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-2xl">{p.name}</h3>
                  <p className="mt-1 text-sm text-foreground/60">{p.tag}</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl">{p.price}</div>
                  <div className="text-xs uppercase tracking-widest text-champagne">★ 4.9</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
