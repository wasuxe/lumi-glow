import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, TrendingUp, LogOut, Plus,
  Pencil, Trash2, Upload, X, Check, Sparkles, DollarSign, Users, Star, AlertCircle
} from "lucide-react";
import {
  isAdminAuthenticated, adminLogout,
  AdminProduct, Order, getOrders
} from "@/lib/store";
import {
  subscribeProducts, insertProduct, updateProduct, deleteProduct,
  subscribeOrders, seedDefaultProducts
} from "@/lib/supabaseStore";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Lumi Glow 15" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

const CATEGORIES = ["Serums", "Moisturizers", "Mists", "Eye Care", "SPF", "Cleansers"];

type Tab = "overview" | "products" | "orders";

type FormState = {
  name: string; tag: string; category: string; price: string;
  offerPrice: string; offerLabel: string; size: string;
  description: string; badge: string; stock: string; image: string;
};

const emptyForm = (): FormState => ({
  name: "", tag: "", category: "Serums", price: "", offerPrice: "",
  offerLabel: "", size: "", description: "", badge: "", stock: "100", image: "",
});

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
        <Icon className="h-5 w-5 text-charcoal" />
      </div>
      <div className="font-display text-3xl">{value}</div>
      <div className="text-sm text-foreground/60 mt-1">{label}</div>
      {sub && <div className="text-xs text-champagne mt-1">{sub}</div>}
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate({ to: "/admin/login" });
      return;
    }
    
    // Initialize Supabase subscriptions and seed mock data if needed
    let unsubProducts: () => void;
    let unsubOrders: () => void;

    seedDefaultProducts().then(() => {
      unsubProducts = subscribeProducts(setProducts);
      unsubOrders = subscribeOrders(setOrders);
    });

    return () => {
      if (unsubProducts) unsubProducts();
      if (unsubOrders) unsubOrders();
    };
  }, []);

  const refreshProducts = () => { /* Now handled automatically by Supabase Realtime */ };

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalSold = products.reduce((s, p) => s + p.sold, 0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.price || !form.size) {
      setFormError("Name, price, and size are required.");
      return;
    }
    const data = {
      name: form.name, tag: form.tag, category: form.category,
      price: parseFloat(form.price),
      offerPrice: form.offerPrice ? parseFloat(form.offerPrice) : undefined,
      offerLabel: form.offerLabel || undefined,
      size: form.size, description: form.description,
      badge: form.badge || undefined,
      stock: parseInt(form.stock) || 100,
      slug: form.name.toLowerCase().replace(/\s+/g, "-"),
      image: form.image || "/product-serum.jpg",
      rating: 5.0, reviews: 0, sold: 0,
    };
    if (editId) { 
      const res = await updateProduct(editId, data); 
      if (res.ok) setFormSuccess("Product updated!");
      else setFormError(res.error ? `Failed to update product: ${res.error}` : "Failed to update product.");
    } else { 
      const newP = await insertProduct(data); 
      if (newP) setFormSuccess("Product added!");
      else setFormError("Failed to add product.");
    }
    if (!formError) {
      setTimeout(() => { setShowForm(false); setEditId(null); setForm(emptyForm()); setFormSuccess(""); }, 1200);
    }
  };

  const startEdit = (p: AdminProduct) => {
    setForm({
      name: p.name, tag: p.tag, category: p.category,
      price: String(p.price), offerPrice: p.offerPrice ? String(p.offerPrice) : "",
      offerLabel: p.offerLabel || "", size: p.size, description: p.description,
      badge: p.badge || "", stock: String(p.stock), image: p.image,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) { setDeleteConfirm(null); return; }
    setDeleting(true);
    const previous = products;
    // Optimistically remove from UI
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await deleteProduct(id);
      if (res.ok) {
        toast.success("Product deleted");
      } else {
        // revert
        setProducts(previous);
        toast.error(res.error ? `Failed to delete product: ${res.error}` : "Failed to delete product");
      }
    } catch (e) {
      setProducts(previous);
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Failed to delete product: ${msg}`);
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const field = (key: keyof FormState, label: string, type = "text", opts?: { placeholder?: string; as?: "textarea" }) => (
    <div>
      <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-1.5">{label}</label>
      {opts?.as === "textarea" ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={opts.placeholder}
          rows={3}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-champagne resize-none"
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={opts?.placeholder}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-champagne"
        />
      )}
    </div>
  );

  const navItems: { id: Tab; icon: any; label: string }[] = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "products", icon: Package, label: "Products" },
    { id: "orders", icon: ShoppingCart, label: "Orders" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col fixed h-full z-40">
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="bg-gold flex h-9 w-9 items-center justify-center rounded-full shadow-glow">
              <Sparkles className="h-4 w-4 text-charcoal" />
            </span>
            <div>
              <div className="font-display text-base leading-tight">Lumi <span className="text-gradient-gold">Glow 15</span></div>
              <div className="text-[10px] uppercase tracking-widest text-foreground/40">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${tab === id ? "bg-foreground text-background font-medium" : "text-foreground/60 hover:bg-secondary"}`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-border">
          <div className="mb-4 px-4 py-3 rounded-2xl bg-secondary">
            <div className="text-xs font-medium">Admin</div>
            <div className="text-[11px] text-foreground/50 truncate">admin@lumiglow15.com</div>
          </div>
          <button
            onClick={() => { adminLogout(); navigate({ to: "/admin/login" }); }}
            className="w-full flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-foreground/60 hover:bg-secondary transition"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl capitalize">{tab === "overview" ? "Dashboard" : tab}</h1>
              <p className="text-xs text-foreground/40 mt-0.5">
                {(() => {
                  const d = new Date();
                  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                  const weekday = weekdays[d.getDay()];
                  const day = d.getDate();
                  const month = months[d.getMonth()];
                  const year = d.getFullYear();
                  return `${weekday}, ${day} ${month} ${year}`;
                })()}
              </p>
            </div>
            {tab === "products" && (
              <button
                onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm()); }}
                id="add-product-btn"
                className="flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm hover:opacity-90 transition"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            )}
          </div>
        </header>

        <div className="px-8 py-8">
          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div className="space-y-8 animate-fade-up">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={DollarSign} label="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} sub="↑ 24% this month" color="bg-gold" />
                <StatCard icon={Package} label="Products" value={String(products.length)} sub={`${products.filter(p => p.stock < 30).length} low stock`} color="bg-champagne" />
                <StatCard icon={ShoppingCart} label="Orders" value={String(orders.length)} sub="↑ 8 this week" color="bg-glow" />
                <StatCard icon={Users} label="Units Sold" value={totalSold.toLocaleString()} sub="All time" color="bg-peach" />
              </div>

              {/* Top products */}
              <div className="glass rounded-3xl p-6">
                <h2 className="font-display text-xl mb-5">Top Performing Products</h2>
                <div className="space-y-4">
                  {[...products].sort((a, b) => b.sold - a.sold).slice(0, 5).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-4">
                      <span className="text-foreground/30 font-display text-xl w-6">#{i + 1}</span>
                      <div className="h-12 w-12 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{p.name}</div>
                        <div className="text-xs text-foreground/50">{p.sold.toLocaleString()} sold · ₹{p.price.toLocaleString("en-IN")}</div>
                      </div>
                      <div className="flex items-center gap-1 text-champagne text-sm">
                        <Star className="h-3.5 w-3.5 fill-current" /> {p.rating}
                      </div>
                      <div className="text-right">
                        <div className="font-display text-lg">₹{(p.sold * (p.offerPrice ?? p.price)).toLocaleString("en-IN")}</div>
                        <div className="text-xs text-foreground/40">revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent orders */}
              <div className="glass rounded-3xl p-6">
                <h2 className="font-display text-xl mb-5">Recent Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-10 w-10 mx-auto text-foreground/20 mb-3" />
                    <p className="text-foreground/40 text-sm">No orders yet. Orders will appear here once customers start buying.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs uppercase tracking-widest text-foreground/40 border-b border-border">
                          {["Order ID", "Customer", "Phone", "Address", "Items", "Total", "Date", "Status"].map(h => (
                            <th key={h} className="text-left pb-3 pr-6">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-secondary/30 transition">
                            <td className="py-3 pr-6 font-mono text-xs text-foreground/60">{o.id}</td>
                            <td className="py-3 pr-6 font-medium">{o.customer}</td>
                            <td className="py-3 pr-6 text-foreground/60">{o.phone || "—"}</td>
                            <td className="py-3 pr-6 text-foreground/60 text-xs break-words whitespace-normal">{o.address || "—"}</td>
                            <td className="py-3 pr-6 text-foreground/60">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                            <td className="py-3 pr-6 font-display">₹{o.total.toLocaleString("en-IN")}</td>
                            <td className="py-3 pr-6 text-foreground/50">{o.date}</td>
                            <td className="py-3">
                              <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-semibold ${
                                o.status === "delivered" ? "bg-green-100 text-green-700" :
                                o.status === "shipped" ? "bg-blue-100 text-blue-700" :
                                o.status === "processing" ? "bg-yellow-100 text-yellow-700" :
                                "bg-gray-100 text-gray-600"
                              }`}>{o.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === "products" && (
            <div className="space-y-6 animate-fade-up">
              <div className="grid gap-5">
                {products.map((p) => (
                  <div key={p.id} className="glass rounded-3xl p-5 flex items-center gap-5">
                    <div className="h-20 w-20 rounded-2xl overflow-hidden flex-shrink-0 bg-secondary">
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23f0e8d8' width='80' height='80'/%3E%3C/svg%3E"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="font-display text-lg">{p.name}</h3>
                        {p.badge && <span className="bg-gold text-charcoal text-[10px] rounded-full px-2.5 py-0.5 uppercase tracking-wider">{p.badge}</span>}
                        {p.offerLabel && <span className="bg-rose/20 text-rose text-[10px] rounded-full px-2.5 py-0.5 uppercase tracking-wider border border-rose/30">{p.offerLabel}</span>}
                      </div>
                      <div className="text-sm text-foreground/50 mt-0.5">{p.category} · {p.size}</div>
                      <div className="mt-2 flex items-center gap-4 flex-wrap">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display text-lg">₹{(p.offerPrice ?? p.price).toLocaleString("en-IN")}</span>
                          {p.offerPrice && <span className="text-sm text-foreground/40 line-through">₹{p.price.toLocaleString("en-IN")}</span>}
                        </div>
                        <span className="text-xs text-foreground/40">Stock: <strong className={p.stock < 30 ? "text-rose" : "text-foreground/70"}>{p.stock}</strong></span>
                        <span className="text-xs text-foreground/40">Sold: <strong>{p.sold.toLocaleString()}</strong></span>
                        <span className="flex items-center gap-1 text-xs text-champagne"><Star className="h-3 w-3 fill-current" />{p.rating}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => startEdit(p)} className="h-9 w-9 flex items-center justify-center rounded-full border border-border hover:bg-secondary transition" title="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="h-9 w-9 flex items-center justify-center rounded-full border border-destructive/30 text-destructive/70 hover:bg-destructive/10 transition" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-center py-20">
                    <Package className="h-12 w-12 mx-auto text-foreground/20 mb-3" />
                    <h3 className="font-display text-xl">No products yet</h3>
                    <p className="text-sm text-foreground/40 mt-1">Add your first product to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === "orders" && (
            <div className="glass rounded-3xl p-6 animate-fade-up overflow-x-auto">
              <h2 className="font-display text-xl mb-6">All Orders ({orders.length})</h2>
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="h-12 w-12 mx-auto text-foreground/20 mb-3" />
                  <h3 className="font-display text-xl">No orders yet</h3>
                  <p className="text-sm text-foreground/40 mt-1">Orders from customers will appear here.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-widest text-foreground/40 border-b border-border">
                      {["Order ID", "Customer", "Phone", "Address", "Products", "Total", "Date", "Status"].map(h => (
                        <th key={h} className="text-left pb-3 pr-6 font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-secondary/30 transition">
                        <td className="py-4 pr-6 font-mono text-xs text-foreground/60">{o.id}</td>
                        <td className="py-4 pr-6 font-medium">{o.customer}</td>
                        <td className="py-4 pr-6 text-foreground/60">{o.phone || "—"}</td>
                        <td className="py-4 pr-6 text-foreground/60 text-xs break-words whitespace-normal">{o.address || "—"}</td>
                        <td className="py-4 pr-6 text-foreground/60 break-words whitespace-normal">{o.items.map(i => i.name).join(", ")}</td>
                        <td className="py-4 pr-6 font-display">₹{o.total.toLocaleString("en-IN")}</td>
                        <td className="py-4 pr-6 text-foreground/50">{o.date}</td>
                        <td className="py-4">
                          <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-semibold ${
                            o.status === "delivered" ? "bg-green-100 text-green-700" :
                            o.status === "shipped" ? "bg-blue-100 text-blue-700" :
                            o.status === "processing" ? "bg-yellow-100 text-yellow-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Product Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
          <div className="bg-background rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-up">
            <div className="sticky top-0 bg-background border-b border-border px-8 py-5 flex items-center justify-between z-10 rounded-t-3xl">
              <h2 className="font-display text-xl">{editId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => { setShowForm(false); setEditId(null); setFormError(""); }} className="rounded-full p-2 hover:bg-secondary transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
              {formError && (
                <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" /> {formError}
                </div>
              )}
              {formSuccess && (
                <div className="flex items-center gap-2 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                  <Check className="h-4 w-4 flex-shrink-0" /> {formSuccess}
                </div>
              )}

              {/* Image upload */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-1.5">Product Image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative h-48 w-full rounded-2xl border-2 border-dashed border-border hover:border-champagne transition cursor-pointer overflow-hidden bg-secondary/30 flex items-center justify-center"
                >
                  {form.image ? (
                    <>
                      <img src={form.image} alt="preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <Upload className="h-6 w-6 text-ivory" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-foreground/30 mb-2" />
                      <p className="text-sm text-foreground/40">Click to upload image</p>
                      <p className="text-xs text-foreground/30 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} id="product-image-upload" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {field("name", "Product Name *", "text", { placeholder: "e.g. Glow Elixir Serum" })}
                {field("tag", "Tagline", "text", { placeholder: "e.g. Vitamin C 15% · Brightening" })}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-champagne"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                {field("size", "Size", "text", { placeholder: "e.g. 30ml" })}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {field("price", "Price (₹) *", "number", { placeholder: "3999" })}
                {field("offerPrice", "Offer Price (₹)", "number", { placeholder: "3199" })}
                {field("offerLabel", "Offer Label", "text", { placeholder: "20% OFF" })}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {field("badge", "Badge", "text", { placeholder: "Best Seller, New…" })}
                {field("stock", "Stock Quantity", "number", { placeholder: "100" })}
              </div>

              {field("description", "Description", "text", { placeholder: "Describe this product…", as: "textarea" })}

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-foreground text-background rounded-full py-4 text-sm uppercase tracking-wider font-medium hover:opacity-90 transition">
                  {editId ? "Update Product" : "Add Product"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-6 rounded-full border border-border hover:bg-secondary transition text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
          <div className="bg-background rounded-3xl p-8 w-full max-w-sm text-center animate-fade-up shadow-2xl">
            <div className="h-14 w-14 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="font-display text-xl">Delete product?</h3>
            <p className="text-sm text-foreground/50 mt-2">This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className={`flex-1 ${deleting ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"} bg-destructive text-white rounded-full py-3 text-sm font-medium transition`}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-border rounded-full py-3 text-sm hover:bg-secondary transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
