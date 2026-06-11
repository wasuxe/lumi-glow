// Global state store using localStorage for persistence

export type Customer = {
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  image: string;
  qty: number;
  size: string;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  tag: string;
  price: number;
  offerPrice?: number;
  offerLabel?: string;
  rating: number;
  reviews: number;
  size: string;
  description: string;
  image: string; // base64 or URL
  category: string;
  badge?: string;
  stock: number;
  sold: number;
  createdAt: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  customer: string;
  phone: string;
  address: string;
  status: "pending" | "processing" | "shipped" | "delivered";
};

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: "waseemraza01423@gmail.com",
  password: "Waseem@14",
};

// --- Admin Auth helpers ---
export function adminLogin(username: string, password: string): boolean {
  if (
    username.trim().toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() &&
    password === ADMIN_CREDENTIALS.password
  ) {
    sessionStorage.setItem("lumi_admin_auth", "true");
    return true;
  }
  return false;
}

export function isAdminCredentials(username: string, password: string): boolean {
  return (
    username.trim().toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() &&
    password === ADMIN_CREDENTIALS.password
  );
}

export function adminLogout() {
  sessionStorage.removeItem("lumi_admin_auth");
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem("lumi_admin_auth") === "true";
}

// --- Customer Auth helpers ---
const CUSTOMERS_KEY = "lumi_customers";
const CUSTOMER_SESSION_KEY = "lumi_customer_session";

export function getCustomers(): Customer[] {
  try {
    const stored = localStorage.getItem(CUSTOMERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function registerCustomer(name: string, email: string, password: string): { ok: boolean; error?: string } {
  const customers = getCustomers();
  if (customers.find((c) => c.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists." };
  }
  customers.push({ name, email, password, createdAt: new Date().toISOString() });
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  return { ok: true };
}

export function customerLogin(email: string, password: string): { ok: boolean; customer?: Customer; error?: string } {
  const customers = getCustomers();
  const customer = customers.find(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );
  if (customer) {
    sessionStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(customer));
    return { ok: true, customer };
  }
  return { ok: false, error: "Invalid email or password." };
}

export function customerLogout() {
  sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
}

export function getLoggedInCustomer(): Customer | null {
  try {
    const s = sessionStorage.getItem(CUSTOMER_SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

// --- Product store ---
const PRODUCTS_KEY = "lumi_admin_products";

const defaultProducts: AdminProduct[] = [
  {
    id: "1",
    slug: "aura-glow-serum",
    name: "Aura Glow Serum",
    tag: "Vitamin C 15% · Brightening",
    price: 3999,
    offerPrice: 3199,
    offerLabel: "20% OFF",
    rating: 5.0,
    reviews: 0,
    size: "30ml",
    badge: "Best Seller",
    description:
      "A weightless, golden-hued serum infused with stabilized 15% Vitamin C, niacinamide, and peptides — engineered to wake up dull, tired skin.",
    image: "/product-serum.jpg",
    category: "Serums",
    stock: 142,
    sold: 0,
    createdAt: new Date().toISOString().split("T")[0],
  },
  {
    id: "2",
    slug: "velvet-light-cream",
    name: "Velvet Light Cream",
    tag: "Peptide Hydration",
    price: 4499,
    rating: 5.0,
    reviews: 0,
    size: "50ml",
    description:
      "A whipped, cloud-soft moisturizer that floods skin with peptide-rich hydration and locks it in for 72 hours.",
    image: "/product-cream.jpg",
    category: "Moisturizers",
    stock: 98,
    sold: 0,
    createdAt: new Date().toISOString().split("T")[0],
  },
  {
    id: "3",
    slug: "halo-essence-mist",
    name: "Halo Essence Mist",
    tag: "Niacinamide Glow",
    price: 2999,
    offerPrice: 2349,
    offerLabel: "Flash Sale",
    rating: 5.0,
    reviews: 0,
    size: "100ml",
    badge: "New",
    description:
      "A pearlescent essence mist that sets makeup, refreshes skin, and leaves a champagne-soft halo on every cheekbone.",
    image: "/product-mist.jpg",
    category: "Mists",
    stock: 256,
    sold: 0,
    createdAt: new Date().toISOString().split("T")[0],
  },
];

export function getAdminProducts(): AdminProduct[] {
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultProducts;
}

export function saveAdminProducts(products: AdminProduct[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  try { window.dispatchEvent(new Event("products-updated")); } catch {}
}

export function addAdminProduct(product: Omit<AdminProduct, "id" | "createdAt">): AdminProduct {
  const products = getAdminProducts();
  const newProduct: AdminProduct = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  };
  products.push(newProduct);
  saveAdminProducts(products);
  return newProduct;
}

export function updateAdminProduct(id: string, updates: Partial<AdminProduct>) {
  const products = getAdminProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...updates };
    saveAdminProducts(products);
  }
}

export function deleteAdminProduct(id: string) {
  const products = getAdminProducts();
  saveAdminProducts(products.filter((p) => p.id !== id));
}

// --- Cart store ---
const CART_KEY = "lumi_cart";

export function getCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item: Omit<CartItem, "qty"> & { qty?: number }) {
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id);
  const addQty = item.qty || 1;
  if (existing) {
    existing.qty += addQty;
  } else {
    cart.push({ ...item, qty: addQty });
  }
  saveCart(cart);
  window.dispatchEvent(new Event("cart-updated"));
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((c) => c.id !== id);
  saveCart(cart);
  window.dispatchEvent(new Event("cart-updated"));
}

export function updateCartQty(id: string, qty: number) {
  const cart = getCart();
  const item = cart.find((c) => c.id === id);
  if (item) {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    item.qty = qty;
    saveCart(cart);
    window.dispatchEvent(new Event("cart-updated"));
  }
}

export function clearCart() {
  saveCart([]);
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => {
    const price = item.offerPrice ?? item.price;
    return sum + price * item.qty;
  }, 0);
}

// --- Orders store ---
const ORDERS_KEY = "lumi_orders";

export function getOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function saveOrder(order: Omit<Order, "id" | "date" | "status">) {
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]") as Order[];
  const newOrder: Order = {
    ...order,
    id: `ORD-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    status: "pending",
  };
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}
