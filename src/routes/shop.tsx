import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, Star, ShoppingBag, Heart, X, Sparkles, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { addToCart, AdminProduct } from "@/lib/store";
import { subscribeProducts } from "@/lib/supabaseStore";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Lumi Glow 15 ✨" },
      { name: "description", content: "Discover our full collection of premium skincare rituals. Filter by category, price, and skin concern." },
    ],
  }),
  component: ShopPage,
});

const CATEGORIES = ["All", "Serums", "Moisturizers", "Mists", "Eye Care", "SPF", "Cleansers"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];
const CONCERNS = ["Brightening", "Hydration", "Anti-aging", "Pore-refining", "Soothing", "Glow"];

function ProductCard({ product, onAddToCart }: { product: AdminProduct; onAddToCart: (p: AdminProduct) => void }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const displayPrice = product.offerPrice ?? product.price;
  const savings = product.offerPrice ? product.price - product.offerPrice : 0;

  return (
    <article className="group relative flex flex-col rounded-3xl border border-border bg-card overflow-hidden shadow-soft hover:-translate-y-2 hover:shadow-glow transition-all duration-400">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {product.badge && (
          <span className="bg-gold text-charcoal rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-semibold">
            {product.badge}
          </span>
        )}
        {product.offerLabel && (
          <span className="bg-rose text-white rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-semibold">
            {product.offerLabel}
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={(e) => { e.preventDefault(); setWished(!wished); }}
        aria-label="Wishlist"
        className="absolute right-3 top-3 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border transition hover:scale-110"
      >
        <Heart className={`h-4 w-4 transition ${wished ? "fill-rose text-rose" : "text-foreground/50"}`} />
      </button>

      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-champagne/20 to-glow/20">
        <div className="bg-gold absolute inset-8 rounded-full opacity-0 blur-2xl transition duration-500 group-hover:opacity-40" />
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%23f5f0e8' width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' font-family='serif' font-size='18' fill='%23a0896a' text-anchor='middle'%3E${encodeURIComponent(product.name)}%3C/text%3E%3C/svg%3E`;
          }}
        />

        {/* Quick add overlay */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAdd}
            className="w-full bg-foreground text-background flex items-center justify-center gap-2 rounded-full py-3 text-xs uppercase tracking-wider font-medium hover:opacity-90 transition"
          >
            {added ? (
              <><Sparkles className="h-3.5 w-3.5 text-champagne" /> Added!</>
            ) : (
              <><ShoppingBag className="h-3.5 w-3.5" /> Quick Add</>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl leading-tight">{product.name}</h3>
            <p className="mt-1 text-xs text-foreground/55 uppercase tracking-wider">{product.tag}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex text-champagne">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-current" : "fill-none"}`} />
            ))}
          </div>
          <span className="text-xs text-foreground/50">{product.rating} ({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl">₹{displayPrice.toLocaleString("en-IN")}</span>
            {product.offerPrice && (
              <span className="text-foreground/40 text-sm line-through">₹{product.price.toLocaleString("en-IN")}</span>
            )}
          </div>
          {savings > 0 && (
            <span className="text-champagne text-xs uppercase tracking-widest">Save ₹{savings.toLocaleString("en-IN")}</span>
          )}
        </div>

        {/* Skin type tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["All Skin", product.size].map((tag) => (
            <span key={tag} className="text-[10px] bg-secondary rounded-full px-2.5 py-0.5 text-foreground/60 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        {/* Stock */}
        {product.stock < 30 && (
          <p className="mt-2 text-[10px] text-rose uppercase tracking-widest">
            Only {product.stock} left!
          </p>
        )}
      </div>
    </article>
  );
}

function ShopPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(9999);
  const [filterOpen, setFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribe = subscribeProducts((p) => setProducts(p));
    return () => { unsubscribe(); };
  }, []);

  const handleAddToCart = (product: AdminProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      offerPrice: product.offerPrice,
      image: product.image,
      size: product.size,
    });
    setAddedMap((m) => ({ ...m, [product.id]: true }));
    setTimeout(() => setAddedMap((m) => ({ ...m, [product.id]: false })), 1600);
  };

  const filtered = useMemo(() => {
    let p = [...products];
    if (category !== "All") p = p.filter((x) => x.category === category);
    if (search.trim()) p = p.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()) || x.tag.toLowerCase().includes(search.toLowerCase()));
    p = p.filter((x) => (x.offerPrice ?? x.price) <= priceMax);
    if (concerns.length > 0) {
      p = p.filter((x) =>
        concerns.some((c) => x.tag.toLowerCase().includes(c.toLowerCase()) || x.description.toLowerCase().includes(c.toLowerCase()))
      );
    }
    switch (sort) {
      case "price-asc": p.sort((a, b) => (a.offerPrice ?? a.price) - (b.offerPrice ?? b.price)); break;
      case "price-desc": p.sort((a, b) => (b.offerPrice ?? b.price) - (a.offerPrice ?? a.price)); break;
      case "rating": p.sort((a, b) => b.rating - a.rating); break;
      case "newest": p.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }
    return p;
  }, [products, category, sort, search, priceMax, concerns]);

  const toggleConcern = (c: string) => {
    setConcerns((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };

  const offerProducts = products.filter((p) => p.offerPrice);
  const totalSavings = offerProducts.reduce((s, p) => s + (p.price - (p.offerPrice ?? p.price)), 0);


  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero banner */}
      <section className="relative px-6 pt-32 pb-16 overflow-hidden">
        <div className="bg-glow absolute inset-x-0 top-0 h-[400px] opacity-50" />
        <div className="relative mx-auto max-w-7xl text-center">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-foreground/50 mb-4">
            The Collection
          </span>
          <h1 className="font-display text-6xl md:text-8xl">
            Shop <em className="text-gradient-gold not-italic">Radiance</em>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-foreground/60 text-lg">
            Science-backed formulas for your daily glow ritual. Free shipping on orders over ₹2,999.
          </p>

          {/* Stats bar */}
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { n: "240k+", l: "Happy Customers" },
              { n: "4.9★", l: "Average Rating" },
              { n: "Free", l: "Ship on ₹2,999+" },
            ].map(({ n, l }) => (
              <div key={l} className="glass rounded-2xl py-4 px-3">
                <div className="font-display text-2xl text-gradient-gold">{n}</div>
                <div className="text-[10px] uppercase tracking-widest text-foreground/50 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer banner */}
      {offerProducts.length > 0 && (
        <section className="px-6 pb-6">
          <div className="mx-auto max-w-7xl">
            <div className="bg-foreground text-background rounded-2xl px-6 py-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-medium text-sm">Limited Time Offers Active!</p>
                  <p className="text-xs text-background/60">{offerProducts.length} products on sale · Save up to ₹{totalSavings.toLocaleString("en-IN")} total</p>
                </div>
              </div>
              <button
                onClick={() => setCategory("All")}
                className="bg-champagne text-charcoal rounded-full px-5 py-2 text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition"
              >
                View Offers
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-7xl">
          {/* Search + Sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search serums, moisturizers, glow…"
                className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-card text-sm outline-none focus:ring-1 focus:ring-champagne placeholder:text-foreground/40"
                id="shop-search"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 rounded-full border border-border bg-card text-sm outline-none cursor-pointer focus:ring-1 focus:ring-champagne"
                id="shop-sort"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm transition ${filterOpen ? "bg-foreground text-background border-foreground" : "border-border bg-card hover:bg-secondary"}`}
              id="filter-toggle"
            >
              <SlidersHorizontal className="h-4 w-4" />
             Filters {(concerns.length > 0 || priceMax < 9999) && <span className="bg-champagne text-charcoal rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold">{concerns.length + (priceMax < 9999 ? 1 : 0)}</span>}
            </button>
          </div>

          <div className="flex gap-8">
            {/* Filter sidebar */}
            {filterOpen && (
              <aside className="w-64 flex-shrink-0 animate-fade-up">
                <div className="glass rounded-3xl p-6 sticky top-28 space-y-8">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.25em] text-foreground/50 mb-3">Category</h3>
                    <div className="space-y-1.5">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCategory(c)}
                          className={`w-full text-left rounded-xl px-3 py-2 text-sm transition ${category === c ? "bg-foreground text-background font-medium" : "text-foreground/70 hover:bg-secondary"}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                     <h3 className="text-xs uppercase tracking-[0.25em] text-foreground/50 mb-3">Max Price: ₹{priceMax.toLocaleString("en-IN")}</h3>
                    <input
                      type="range"
                      min="500"
                      max="9999"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full accent-champagne"
                      id="price-range"
                    />
                    <div className="flex justify-between text-xs text-foreground/40 mt-1">
                      <span>₹500</span>
                      <span>₹9,999</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-[0.25em] text-foreground/50 mb-3">Skin Concern</h3>
                    <div className="flex flex-wrap gap-2">
                      {CONCERNS.map((c) => (
                        <button
                          key={c}
                          onClick={() => toggleConcern(c)}
                          className={`text-xs rounded-full px-3 py-1.5 border transition ${concerns.includes(c) ? "bg-foreground text-background border-foreground" : "border-border text-foreground/60 hover:border-champagne"}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(concerns.length > 0 || priceMax < 9999) && (
                    <button
                      onClick={() => { setConcerns([]); setPriceMax(9999); }}
                      className="text-xs text-foreground/50 hover:text-foreground underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </aside>
            )}

            {/* Products grid */}
            <div className="flex-1 min-w-0">
              {/* Category pills (mobile/compact) */}
              {!filterOpen && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`flex-shrink-0 rounded-full px-4 py-2 text-xs uppercase tracking-wider border transition ${category === c ? "bg-foreground text-background border-foreground" : "border-border text-foreground/60 hover:border-champagne"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {/* Results count */}
              <p className="text-sm text-foreground/50 mb-6">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}{search ? ` for "${search}"` : ""}
              </p>

              {filtered.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="font-display text-2xl">No products found</h3>
                  <p className="text-foreground/50 mt-2 text-sm">Try adjusting your filters or search term</p>
                  <button
                    onClick={() => { setSearch(""); setCategory("All"); setConcerns([]); setPriceMax(100); }}
                    className="mt-5 bg-foreground text-background rounded-full px-6 py-3 text-sm uppercase tracking-wider"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}

              {/* Benefits strip */}
              {filtered.length > 0 && (
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: "🚚", title: "Free Shipping", sub: "On orders over ₹2,999" },
                    { icon: "♻️", title: "Refillable", sub: "Sustainable packaging" },
                    { icon: "🌿", title: "Clean Beauty", sub: "No harsh chemicals" },
                    { icon: "💎", title: "Glow Points", sub: "+50 pts every order" },
                  ].map(({ icon, title, sub }) => (
                    <div key={title} className="glass rounded-2xl p-5 text-center">
                      <div className="text-3xl mb-2">{icon}</div>
                      <div className="font-display text-base">{title}</div>
                      <div className="text-xs text-foreground/50 mt-1">{sub}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-foreground text-background px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl">Get glow updates</h2>
          <p className="mt-4 text-background/60">
            Exclusive offers, new launches, and skincare tips delivered to your inbox.
          </p>
          <form className="mt-8 flex max-w-sm mx-auto rounded-full border border-background/20 bg-background/10 p-1">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-background/40"
            />
            <button type="submit" className="bg-champagne text-charcoal rounded-full px-5 py-2 text-xs uppercase tracking-widest font-medium hover:opacity-90 transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
