import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Star, Truck, Recycle, Sparkles, Check } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProductGallery } from "@/components/product/ProductGallery";
import { BeforeAfterSlider } from "@/components/product/BeforeAfterSlider";
import { Ingredients } from "@/components/product/Ingredients";
import { StickyBar } from "@/components/product/StickyBar";
import { Recommendations } from "@/components/product/Recommendations";
import { getProduct, products } from "@/data/products";
import { addToCart } from "@/lib/store";
import { fetchProductBySlug, fetchProducts } from "@/lib/supabaseStore";

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ params }) => {
    const localProduct = getProduct(params.slug);
    if (!localProduct) throw notFound();
    
    // Fetch dynamic real-time data from Supabase
    const dbProduct = await fetchProductBySlug(params.slug);
    
    // Merge them: dynamic fields from Supabase, static fields from local data
    const product = dbProduct ? { ...localProduct, ...dbProduct } : localProduct;
    
    const dbAllProducts = await fetchProducts();
    const mergedProducts = products.map(p => {
      const dbP = dbAllProducts.find(dp => dp.slug === p.slug);
      return dbP ? { ...p, ...dbP } : p;
    });

    return { product, mergedProducts };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Lumi Glow 15` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Lumi Glow 15` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.gallery[0] },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-5xl">Not in stock</h1>
        <Link to="/" className="text-champagne mt-4 inline-block underline">Back to glow</Link>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product, mergedProducts } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    addToCart({
      id: product.slug, // the slug acts as ID here since we use local products.ts
      name: product.name,
      price: product.price,
      image: product.gallery[0],
      size: product.size,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const recs = mergedProducts.filter((p) => p.slug !== product.slug);

  return (
    <main className="min-h-screen pb-32">
      <Navbar />

      <section className="relative px-6 pt-32 pb-20">
        <div className="bg-glow absolute inset-x-0 top-0 h-[600px] opacity-50" />
        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <ProductGallery images={product.gallery} name={product.name} swatch={product.swatch} />

          <div>
            <nav className="text-xs uppercase tracking-widest text-foreground/50">
              <Link to="/" className="hover:text-foreground">Shop</Link> / <span>{product.name}</span>
            </nav>

            {product.badge && (
              <span className="bg-gold text-charcoal mt-6 inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-widest">
                ✨ {product.badge}
              </span>
            )}

            <h1 className="mt-4 font-display text-5xl md:text-6xl leading-[1]">
              {product.name}
            </h1>
            <p className="text-foreground/55 mt-3 text-sm uppercase tracking-widest">{product.tag} · {product.size}</p>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex text-champagne">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-foreground/70">{product.rating} · {product.reviews.toLocaleString()} reviews</span>
            </div>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-foreground/75">
              {product.description}
            </p>

            <div className="mt-10 flex items-end gap-4">
              <div className="font-display text-5xl">₹{product.price.toLocaleString("en-IN")}</div>
              <div className="text-foreground/50 mb-2 text-sm line-through">₹{(product.price + 800).toLocaleString("en-IN")}</div>
              <span className="text-champagne mb-2 text-xs uppercase tracking-widest">Save ₹800</span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:opacity-70">−</button>
                <span className="w-8 text-center font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:opacity-70">+</button>
              </div>
              <button
                onClick={onAdd}
                className="bg-foreground text-background relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-4 text-sm uppercase tracking-wider transition hover:scale-[1.01]"
              >
                {added ? (
                  <span className="animate-fade-up flex items-center gap-2"><Check className="h-4 w-4 text-champagne" /> Added to bag</span>
                ) : (
                  <>Add to Bag · ₹{(product.price * qty).toLocaleString("en-IN")}</>
                )}
              </button>
              <button className="glass rounded-full px-6 py-4 text-sm uppercase tracking-wider">Subscribe · 15% Off</button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 text-xs text-foreground/65">
              {[
                { i: Truck, t: "Free ship ₹2,999+" },
                { i: Recycle, t: "Refillable" },
                { i: Sparkles, t: "+50 Glow Pts" },
              ].map(({ i: Icon, t }) => (
                <div key={t} className="glass flex items-center gap-2 rounded-2xl px-4 py-3">
                  <Icon className="h-4 w-4 text-champagne" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Ingredients items={product.ingredients} science={product.science} />
        </div>
      </section>

      <section className="bg-foreground text-background px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-background/50">Real Results</span>
            <h2 className="mt-3 font-display text-5xl md:text-6xl">Drag to reveal the <em className="text-gradient-gold not-italic">glow</em>.</h2>
            <p className="mt-6 max-w-md text-background/70">
              Real customer · 14 days, twice daily. No filters, no retouching. Just radiance.
            </p>
            <div className="mt-8 flex gap-6">
              <div>
                <div className="text-gradient-gold font-display text-4xl">+148%</div>
                <div className="text-xs uppercase tracking-widest text-background/55">Hydration</div>
              </div>
              <div>
                <div className="text-gradient-gold font-display text-4xl">−62%</div>
                <div className="text-xs uppercase tracking-widest text-background/55">Dark spots</div>
              </div>
            </div>
          </div>
          <BeforeAfterSlider />
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Recommendations items={recs} />
        </div>
      </section>

      <Footer />

      <StickyBar product={product} qty={qty} setQty={setQty} onAdd={onAdd} />
    </main>
  );
}
