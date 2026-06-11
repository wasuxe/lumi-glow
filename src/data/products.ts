import serum from "@/assets/product-serum.jpg";
import serum2 from "@/assets/product-serum-2.jpg";
import serum3 from "@/assets/product-serum-3.jpg";
import cream from "@/assets/product-cream.jpg";
import mist from "@/assets/product-mist.jpg";
import hero from "@/assets/hero-product.png";

export type Ingredient = { name: string; pct: string; benefit: string };
export type Product = {
  slug: string;
  name: string;
  tag: string;
  price: number;
  rating: number;
  reviews: number;
  size: string;
  description: string;
  gallery: string[];
  ingredients: Ingredient[];
  science: string;
  badge?: string;
  swatch: string;
};

export const products: Product[] = [
  {
    slug: "aura-glow-serum",
    name: "Aura Glow Serum",
    tag: "Vitamin C 15% · Brightening",
    price: 3999,
    rating: 4.9,
    reviews: 2418,
    size: "30ml",
    badge: "Best Seller",
    swatch: "from-champagne/40 to-glow/40",
    description:
      "A weightless, golden-hued serum infused with stabilized 15% Vitamin C, niacinamide, and peptides — engineered to wake up dull, tired skin and unlock that lit-from-within glow in 14 days.",
    gallery: [serum, serum2, serum3, hero],
    ingredients: [
      { name: "Vitamin C", pct: "15%", benefit: "Brightens & evens tone" },
      { name: "Niacinamide", pct: "5%", benefit: "Refines pores & texture" },
      { name: "Peptide Complex", pct: "2%", benefit: "Firms & smooths" },
      { name: "Hyaluronic Acid", pct: "1%", benefit: "Deep hydration" },
    ],
    science:
      "Our 15% Vitamin C is encapsulated in a slow-release lipid carrier — clinically shown to deliver 4× the absorption of standard L-ascorbic acid, with zero irritation.",
  },
  {
    slug: "velvet-light-cream",
    name: "Velvet Light Cream",
    tag: "Peptide Hydration",
    price: 4499,
    rating: 4.8,
    reviews: 1604,
    size: "50ml",
    swatch: "from-peach/50 to-cream/40",
    description:
      "A whipped, cloud-soft moisturizer that floods skin with peptide-rich hydration and locks it in for 72 hours. Your dewy filter, in a jar.",
    gallery: [cream, hero, serum2],
    ingredients: [
      { name: "Bio-Peptides", pct: "8%", benefit: "Plumps fine lines" },
      { name: "Squalane", pct: "5%", benefit: "Restores barrier" },
      { name: "Ceramides", pct: "3%", benefit: "Locks in moisture" },
    ],
    science:
      "Encapsulated peptides penetrate the upper dermis to stimulate collagen synthesis, validated in an 8-week independent clinical study.",
  },
  {
    slug: "halo-essence-mist",
    name: "Halo Essence Mist",
    tag: "Niacinamide Glow",
    price: 2999,
    rating: 4.9,
    reviews: 2891,
    size: "100ml",
    swatch: "from-rose/40 to-peach/40",
    description:
      "A pearlescent essence mist that sets makeup, refreshes skin, and leaves a champagne-soft halo on every cheekbone.",
    gallery: [mist, serum3, hero],
    ingredients: [
      { name: "Niacinamide", pct: "4%", benefit: "Glow & clarity" },
      { name: "Rose Water", pct: "10%", benefit: "Soothes & calms" },
      { name: "Pearl Extract", pct: "1%", benefit: "Subtle luminosity" },
    ],
    science:
      "Ultra-fine micro-mist particles distribute actives evenly without disrupting makeup, tested across 12 skin tones.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
