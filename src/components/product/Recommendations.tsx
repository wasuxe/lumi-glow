import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { Product } from "@/data/products";

export function Recommendations({ items }: { items: Product[] }) {
  return (
    <section>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-foreground/50">Pairs Beautifully With</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Complete the <em className="text-gradient-gold not-italic">ritual</em>.</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((p) => (
          <Link
            key={p.slug}
            to="/shop/$slug"
            params={{ slug: p.slug }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
          >
            <div className={`relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${p.swatch}`}>
              <img src={p.gallery[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="bg-foreground text-background absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition group-hover:opacity-100">
                <Plus className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl">{p.name}</h3>
                <p className="text-xs text-foreground/55">{p.tag}</p>
              </div>
              <div className="font-display text-lg">${p.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
