// Supabase-backed data store for products, orders, and auth
import { supabase } from "./supabase";
import type { AdminProduct, Order, CartItem, Customer } from "./store";
import { getAdminProducts, addAdminProduct, saveOrder, getOrders, deleteAdminProduct, updateAdminProduct } from "./store";
import serumImg from "@/assets/product-serum.jpg";
import creamImg from "@/assets/product-cream.jpg";
import mistImg from "@/assets/product-mist.jpg";
import heroImg from "@/assets/hero-product.png";

// ─── Products ──────────────────────────────────────────────────────

/** Fetch all products from Supabase, fallback to localStorage */
export async function fetchProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.warn("Supabase products fetch failed:", error.message);
    // Fallback to local admin products when Supabase table is missing or unreachable
    try {
      return getAdminProducts();
    } catch {
      return [];
    }
  }

  return (data || []).map(mapDbProduct);
}

/** Fetch a single product by slug */
export async function fetchProductBySlug(slug: string): Promise<AdminProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }
  return mapDbProduct(data);
}

/** Insert a new product */
export async function insertProduct(product: Omit<AdminProduct, "id" | "createdAt">): Promise<AdminProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .insert(mapToDb(product))
    .select()
    .single();

  if (error) {
    console.error("Insert product error:", error.message);
    // If Supabase isn't available, persist the product locally so admin UX still works.
    try {
      const local = addAdminProduct(product);
      return local;
    } catch (e) {
      return null;
    }
  }
  return mapDbProduct(data);
}

/** Update an existing product */
export async function updateProduct(id: string, updates: Partial<AdminProduct>): Promise<{ ok: boolean; error?: string }> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
  if (updates.tag !== undefined) dbUpdates.tag = updates.tag;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.offerPrice !== undefined) dbUpdates.offer_price = updates.offerPrice;
  if (updates.offerLabel !== undefined) dbUpdates.offer_label = updates.offerLabel;
  if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
  if (updates.reviews !== undefined) dbUpdates.reviews = updates.reviews;
  if (updates.size !== undefined) dbUpdates.size = updates.size;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.image !== undefined) dbUpdates.image = updates.image;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.badge !== undefined) dbUpdates.badge = updates.badge;
  if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
  if (updates.sold !== undefined) dbUpdates.sold = updates.sold;

  const { error } = await supabase.from("products").update(dbUpdates).eq("id", id);
  if (error) {
    console.error("Update product error:", error.message);
    // Supabase failed — update local admin products so admin UX still works
    try {
      updateAdminProduct(id, {
        name: updates.name,
        slug: updates.slug,
        tag: updates.tag,
        price: updates.price,
        offerPrice: updates.offerPrice,
        offerLabel: updates.offerLabel,
        rating: updates.rating,
        reviews: updates.reviews,
        size: updates.size,
        description: updates.description,
        image: updates.image,
        category: updates.category,
        badge: updates.badge,
        stock: updates.stock,
        sold: updates.sold,
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: (error && error.message) || String(e) };
    }
  }
  return { ok: true };
}

/** Delete a product */
export async function deleteProduct(id: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Delete product error:", error.message);
    // If Supabase is unavailable or table missing, remove from local admin products so UI stays consistent
    try {
      deleteAdminProduct(id);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: (error && error.message) || String(e) };
    }
  }
  return { ok: true };
}

/** Subscribe to real-time product changes */
export function subscribeProducts(callback: (products: AdminProduct[]) => void) {
  // Initial fetch
  fetchProducts().then(callback);

  // Real-time subscription
  try {
    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          // On any change, re-fetch all products for simplicity
          fetchProducts().then(callback);
        }
      )
      .subscribe();

    // Also listen for local product updates when Supabase isn't available
    const onLocal = () => { fetchProducts().then(callback); };
    window.addEventListener("products-updated", onLocal);

    return () => {
      try { window.removeEventListener("products-updated", onLocal); } catch {}
      supabase.removeChannel(channel);
    };
  } catch (err) {
    // If realtime isn't available or table doesn't exist, noop the subscription
    console.warn("Realtime products subscription unavailable:", (err as Error).message);
    // Fallback: listen to local storage changes only
    const onLocal = () => { fetchProducts().then(callback); };
    window.addEventListener("products-updated", onLocal);
    return () => { try { window.removeEventListener("products-updated", onLocal); } catch {} };
  }
}

// ─── Orders ────────────────────────────────────────────────────────

/** Fetch all orders from Supabase */
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Supabase orders fetch failed:", error.message);
    // Fallback to local orders when Supabase is unreachable
    try {
      return getOrders();
    } catch {
      return [];
    }
  }

  return (data || []).map(mapDbOrder);
}

/** Insert a new order */
export async function insertOrder(
  order: Omit<Order, "id" | "date" | "status">
): Promise<Order | null> {
  const newOrder = {
    id: `ORD-${Date.now()}`,
    customer: order.customer,
    phone: order.phone,
    address: order.address,
    items: order.items,
    total: order.total,
    status: "pending",
    date: new Date().toISOString().split("T")[0],
  };

  const { data, error } = await supabase
    .from("orders")
    .insert(newOrder)
    .select()
    .single();

  if (error) {
    console.error("Insert order error:", error.message);
    // Supabase failed — persist the order locally so admin UI can read it from localStorage
    try {
      const saved = saveOrder(order);
      return saved;
    } catch (e) {
      return null;
    }
  }

  return mapDbOrder(data);
}

/** Subscribe to real-time order changes */
export function subscribeOrders(callback: (orders: Order[]) => void) {
  fetchOrders().then(callback);

  const channel = supabase
    .channel("orders-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      () => {
        fetchOrders().then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ─── Auth ──────────────────────────────────────────────────────────

/** Register a new customer via Supabase Auth */
export async function supabaseRegister(
  name: string,
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  // Insert into profiles table
  if (data.user) {
    await supabase.from("profiles").insert({ id: data.user.id, name });
  }

  return { ok: true };
}

/** Login via Supabase Auth */
export async function supabaseLogin(
  email: string,
  password: string
): Promise<{ ok: boolean; customer?: Customer; error?: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const user = data.user;
  const customer: Customer = {
    name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    password: "", // Not stored client-side
    createdAt: user.created_at || new Date().toISOString(),
  };

  return { ok: true, customer };
}

/** Logout via Supabase Auth */
export async function supabaseLogout() {
  await supabase.auth.signOut();
}

/** Get the currently logged-in customer from Supabase session */
export async function getSupabaseCustomer(): Promise<Customer | null> {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;

  return {
    name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    password: "",
    createdAt: user.created_at || new Date().toISOString(),
  };
}

/** Listen for Supabase auth state changes */
export function onAuthChange(callback: (customer: Customer | null) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const user = session.user;
      callback({
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        password: "",
        createdAt: user.created_at || new Date().toISOString(),
      });
    } else {
      callback(null);
    }
  });
}

// ─── Seed defaults if table is empty ───────────────────────────────

export async function seedDefaultProducts() {
  const existing = await fetchProducts();
  if (existing.length > 0) return; // Already seeded

  const defaults = [
    {
      slug: "aura-glow-serum",
      name: "Aura Glow Serum",
      tag: "Vitamin C 15% · Brightening",
      price: 3999,
      offer_price: 3199,
      offer_label: "20% OFF",
      rating: 5.0,
      reviews: 0,
      size: "30ml",
      badge: "Best Seller",
      description: "A weightless, golden-hued serum infused with stabilized 15% Vitamin C, niacinamide, and peptides — engineered to wake up dull, tired skin.",
      image: serumImg,
      category: "Serums",
      stock: 142,
      sold: 0,
    },
    {
      slug: "velvet-light-cream",
      name: "Velvet Light Cream",
      tag: "Peptide Hydration",
      price: 4499,
      rating: 5.0,
      reviews: 0,
      size: "50ml",
      description: "A whipped, cloud-soft moisturizer that floods skin with peptide-rich hydration and locks it in for 72 hours.",
      image: creamImg,
      category: "Moisturizers",
      stock: 98,
      sold: 0,
    },
    {
      slug: "halo-essence-mist",
      name: "Halo Essence Mist",
      tag: "Niacinamide Glow",
      price: 2999,
      offer_price: 2349,
      offer_label: "Flash Sale",
      rating: 5.0,
      reviews: 0,
      size: "100ml",
      badge: "New",
      description: "A pearlescent essence mist that sets makeup, refreshes skin, and leaves a champagne-soft halo on every cheekbone.",
      image: mistImg,
      category: "Mists",
      stock: 256,
      sold: 0,
    },
  ];

  const { error } = await supabase.from("products").insert(defaults);
  if (error) {
    console.warn("Seed products failed:", error.message);
    // If inserting into Supabase fails (e.g., missing table), seed local store instead
    try {
      for (const d of defaults) {
        // map to addAdminProduct shape
        addAdminProduct({
          slug: d.slug,
          name: d.name,
          tag: d.tag,
          price: d.price,
          offerPrice: (d as any).offer_price ?? undefined,
          offerLabel: (d as any).offer_label ?? undefined,
          rating: d.rating,
          reviews: d.reviews,
          size: d.size,
          description: d.description,
          image: d.image,
          category: d.category,
          badge: d.badge ?? undefined,
          stock: d.stock,
          sold: d.sold || 0,
        });
      }
    } catch (e) {
      console.warn("Local seeding failed:", (e as Error).message);
    }
  }
}

// ─── DB mapping helpers ────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapDbProduct(row: any): AdminProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tag: row.tag || "",
    price: row.price,
    offerPrice: row.offer_price ?? undefined,
    offerLabel: row.offer_label ?? undefined,
    rating: Number(row.rating) || 0,
    reviews: row.reviews || 0,
    size: row.size || "",
    description: row.description || "",
    image: row.image || "",
    category: row.category || "",
    badge: row.badge ?? undefined,
    stock: row.stock || 0,
    sold: row.sold || 0,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  };
}

function mapDbOrder(row: any): Order {
  return {
    id: row.id,
    items: (row.items || []) as CartItem[],
    total: row.total || 0,
    date: row.date || "",
    customer: row.customer || "",
    phone: row.phone || "",
    address: row.address || "",
    status: row.status || "pending",
  };
}

function mapToDb(product: Omit<AdminProduct, "id" | "createdAt">): Record<string, unknown> {
  return {
    slug: product.slug,
    name: product.name,
    tag: product.tag,
    price: product.price,
    offer_price: product.offerPrice ?? null,
    offer_label: product.offerLabel ?? null,
    rating: product.rating,
    reviews: product.reviews,
    size: product.size,
    description: product.description,
    image: product.image,
    category: product.category,
    badge: product.badge ?? null,
    stock: product.stock,
    sold: product.sold,
  };
}
