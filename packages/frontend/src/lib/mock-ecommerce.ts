export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: Category;
  rating: number;
  reviewCount: number;
  stock: number;
  description: string;
  badge?: "New" | "Sale" | "Hot";
  color: string;
}

export type Category =
  | "Electronics"
  | "Clothing"
  | "Accessories"
  | "Home & Office"
  | "Sports";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface MockOrder {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "Delivered" | "Shipped" | "Processing";
  shippingAddress: string;
  paymentLast4: string;
}

export interface MockReview {
  id: number;
  author: string;
  initials: string;
  color: string;
  rating: number;
  date: string;
  comment: string;
}

export const gradientMap: Record<string, string> = {
  blue: "from-blue-400 to-blue-600",
  purple: "from-purple-400 to-purple-600",
  green: "from-green-400 to-green-600",
  orange: "from-orange-400 to-orange-600",
  pink: "from-pink-400 to-pink-600",
  cyan: "from-cyan-400 to-cyan-600",
  red: "from-red-400 to-red-600",
  amber: "from-amber-400 to-amber-600",
};

export const mockProducts: Product[] = [
  // Electronics
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    price: 249,
    originalPrice: 329,
    category: "Electronics",
    rating: 4.8,
    reviewCount: 312,
    stock: 45,
    description:
      "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound. Perfect for travel, work, and everyday listening.",
    badge: "Sale",
    color: "blue",
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    slug: "smart-watch-pro",
    price: 399,
    category: "Electronics",
    rating: 4.6,
    reviewCount: 189,
    stock: 28,
    description:
      "Advanced smartwatch with health monitoring, GPS, always-on display, and 7-day battery life. Compatible with iOS and Android.",
    badge: "Hot",
    color: "purple",
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    price: 89,
    category: "Electronics",
    rating: 4.4,
    reviewCount: 256,
    stock: 72,
    description:
      "Waterproof wireless speaker with 360-degree sound, 20-hour battery, and built-in microphone. Perfect for outdoor adventures.",
    color: "cyan",
  },
  {
    id: 4,
    name: "USB-C Laptop Stand",
    slug: "usb-c-laptop-stand",
    price: 49,
    category: "Electronics",
    rating: 4.3,
    reviewCount: 98,
    stock: 110,
    description:
      "Ergonomic aluminum laptop stand with 6-port USB-C hub. Elevate your screen and declutter your desk with a single cable.",
    badge: "New",
    color: "green",
  },
  {
    id: 5,
    name: "Mechanical Keyboard",
    slug: "mechanical-keyboard",
    price: 139,
    originalPrice: 179,
    category: "Electronics",
    rating: 4.7,
    reviewCount: 441,
    stock: 33,
    description:
      "Compact TKL mechanical keyboard with Cherry MX switches, RGB backlighting, and aluminum frame. Built for precision typing.",
    badge: "Sale",
    color: "orange",
  },
  // Clothing
  {
    id: 6,
    name: "Merino Wool Crewneck Sweater",
    slug: "merino-wool-crewneck-sweater",
    price: 98,
    category: "Clothing",
    rating: 4.5,
    reviewCount: 134,
    stock: 60,
    description:
      "Lightweight yet warm merino wool sweater with a classic crewneck silhouette. Naturally odor-resistant and machine washable.",
    color: "amber",
  },
  {
    id: 7,
    name: "Slim Fit Chino Pants",
    slug: "slim-fit-chino-pants",
    price: 65,
    category: "Clothing",
    rating: 4.2,
    reviewCount: 87,
    stock: 95,
    description:
      "Versatile slim-fit chinos crafted from stretch cotton blend. Perfect for office and weekend wear.",
    color: "green",
  },
  {
    id: 8,
    name: "Waterproof Shell Jacket",
    slug: "waterproof-shell-jacket",
    price: 185,
    originalPrice: 240,
    category: "Clothing",
    rating: 4.6,
    reviewCount: 203,
    stock: 22,
    description:
      "3-layer Gore-Tex shell jacket with sealed seams, adjustable hood, and multiple pockets. Lightweight and packable.",
    badge: "Sale",
    color: "blue",
  },
  {
    id: 9,
    name: "Classic Oxford Shirt",
    slug: "classic-oxford-shirt",
    price: 55,
    category: "Clothing",
    rating: 4.1,
    reviewCount: 66,
    stock: 88,
    description:
      "Timeless button-down oxford shirt in 100% cotton. A wardrobe staple that pairs with everything from jeans to dress trousers.",
    color: "pink",
  },
  {
    id: 10,
    name: "Insulated Puffer Vest",
    slug: "insulated-puffer-vest",
    price: 79,
    category: "Clothing",
    rating: 4.4,
    reviewCount: 112,
    stock: 41,
    description:
      "800-fill-power down vest with a sleek quilted finish. Packs into its own pocket for easy travel.",
    badge: "New",
    color: "red",
  },
  // Accessories
  {
    id: 11,
    name: "Leather Bifold Wallet",
    slug: "leather-bifold-wallet",
    price: 45,
    category: "Accessories",
    rating: 4.5,
    reviewCount: 178,
    stock: 120,
    description:
      "Slim full-grain leather wallet with RFID blocking and 6 card slots. Handcrafted for durability and style.",
    color: "amber",
  },
  {
    id: 12,
    name: "Polarized Aviator Sunglasses",
    slug: "polarized-aviator-sunglasses",
    price: 125,
    originalPrice: 160,
    category: "Accessories",
    rating: 4.6,
    reviewCount: 234,
    stock: 55,
    description:
      "Classic aviator sunglasses with polarized UV400 lenses and stainless steel frame. Reduces glare and protects your eyes.",
    badge: "Sale",
    color: "cyan",
  },
  {
    id: 13,
    name: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    price: 35,
    category: "Accessories",
    rating: 4.0,
    reviewCount: 59,
    stock: 150,
    description:
      "Durable waxed canvas tote with leather handles and interior zip pocket. Ideal for commuting, groceries, or everyday carry.",
    color: "green",
  },
  {
    id: 14,
    name: "Minimalist Leather Belt",
    slug: "minimalist-leather-belt",
    price: 40,
    category: "Accessories",
    rating: 4.3,
    reviewCount: 91,
    stock: 85,
    description:
      "Full-grain leather belt with a brushed nickel buckle. Available in black and tan. Cut to your exact size.",
    color: "orange",
  },
  {
    id: 15,
    name: "Wool Beanie Hat",
    slug: "wool-beanie-hat",
    price: 28,
    category: "Accessories",
    rating: 4.7,
    reviewCount: 309,
    stock: 130,
    description:
      "Soft merino wool beanie with a ribbed cuff and fold-up style. Keeps you warm without the bulk.",
    badge: "Hot",
    color: "purple",
  },
  // Home & Office
  {
    id: 16,
    name: "Ergonomic Mesh Office Chair",
    slug: "ergonomic-mesh-office-chair",
    price: 399,
    category: "Home & Office",
    rating: 4.7,
    reviewCount: 522,
    stock: 14,
    description:
      "Full-mesh ergonomic chair with lumbar support, adjustable armrests, and breathable backrest. Supports up to 300 lbs.",
    badge: "Hot",
    color: "blue",
  },
  {
    id: 17,
    name: "Bamboo Desk Organizer",
    slug: "bamboo-desk-organizer",
    price: 38,
    category: "Home & Office",
    rating: 4.4,
    reviewCount: 145,
    stock: 90,
    description:
      "Sustainable bamboo organizer with 5 compartments for pens, phones, notebooks, and accessories. Keeps your desk clutter-free.",
    color: "green",
  },
  {
    id: 18,
    name: "LED Desk Lamp with Wireless Charger",
    slug: "led-desk-lamp-wireless-charger",
    price: 75,
    originalPrice: 99,
    category: "Home & Office",
    rating: 4.5,
    reviewCount: 188,
    stock: 37,
    description:
      "Adjustable LED desk lamp with 5 color temperatures, touch dimmer, and built-in 10W wireless charging pad.",
    badge: "Sale",
    color: "amber",
  },
  {
    id: 19,
    name: "Insulated French Press",
    slug: "insulated-french-press",
    price: 42,
    category: "Home & Office",
    rating: 4.6,
    reviewCount: 271,
    stock: 68,
    description:
      "Double-wall stainless steel French press keeps coffee hot for 1 hour. 34 oz capacity with a fine-mesh plunger.",
    badge: "New",
    color: "red",
  },
  {
    id: 20,
    name: "Whiteboard Desk Pad",
    slug: "whiteboard-desk-pad",
    price: 25,
    category: "Home & Office",
    rating: 3.9,
    reviewCount: 77,
    stock: 100,
    description:
      "Reusable PET whiteboard desk pad — write, plan, and erase. Non-slip backing and ruled grid layout.",
    color: "cyan",
  },
  // Sports
  {
    id: 21,
    name: "Resistance Band Set",
    slug: "resistance-band-set",
    price: 35,
    category: "Sports",
    rating: 4.5,
    reviewCount: 486,
    stock: 140,
    description:
      "Set of 5 resistance bands in varying tensions (10–50 lbs). Includes handles, ankle straps, and door anchor. Ideal for home workouts.",
    color: "orange",
  },
  {
    id: 22,
    name: "Trail Running Shoes",
    slug: "trail-running-shoes",
    price: 129,
    originalPrice: 159,
    category: "Sports",
    rating: 4.6,
    reviewCount: 193,
    stock: 0,
    description:
      "Lightweight trail runners with aggressive grip outsole, rock plate, and breathable mesh upper. Ready for any terrain.",
    badge: "Sale",
    color: "purple",
  },
  {
    id: 23,
    name: "Stainless Steel Water Bottle",
    slug: "stainless-steel-water-bottle",
    price: 29,
    category: "Sports",
    rating: 4.8,
    reviewCount: 614,
    stock: 200,
    description:
      "32 oz vacuum-insulated bottle keeps drinks cold 24 hrs and hot 12 hrs. BPA-free with leak-proof lid.",
    color: "cyan",
  },
  {
    id: 24,
    name: "Yoga Mat with Carrying Strap",
    slug: "yoga-mat-with-carrying-strap",
    price: 48,
    category: "Sports",
    rating: 4.3,
    reviewCount: 329,
    stock: 75,
    description:
      "6mm thick non-slip yoga mat with alignment lines and moisture-wicking surface. Includes adjustable carrying strap.",
    badge: "New",
    color: "pink",
  },
];

export const mockOrders: MockOrder[] = [
  {
    id: "ORD-8821",
    date: "2026-03-15",
    items: [
      { name: "Wireless Noise-Cancelling Headphones", quantity: 1, price: 249 },
      { name: "USB-C Laptop Stand", quantity: 1, price: 49 },
    ],
    total: 298,
    status: "Delivered",
    shippingAddress: "42 Maple Street, Portland, OR 97201",
    paymentLast4: "4242",
  },
  {
    id: "ORD-8756",
    date: "2026-03-02",
    items: [
      { name: "Merino Wool Crewneck Sweater", quantity: 2, price: 98 },
      { name: "Minimalist Leather Belt", quantity: 1, price: 40 },
    ],
    total: 236,
    status: "Delivered",
    shippingAddress: "42 Maple Street, Portland, OR 97201",
    paymentLast4: "4242",
  },
  {
    id: "ORD-8903",
    date: "2026-04-01",
    items: [
      { name: "Smart Watch Pro", quantity: 1, price: 399 },
    ],
    total: 399,
    status: "Shipped",
    shippingAddress: "42 Maple Street, Portland, OR 97201",
    paymentLast4: "8310",
  },
  {
    id: "ORD-8944",
    date: "2026-04-05",
    items: [
      { name: "Trail Running Shoes", quantity: 1, price: 129 },
      { name: "Stainless Steel Water Bottle", quantity: 2, price: 29 },
    ],
    total: 187,
    status: "Shipped",
    shippingAddress: "42 Maple Street, Portland, OR 97201",
    paymentLast4: "4242",
  },
  {
    id: "ORD-8977",
    date: "2026-04-08",
    items: [
      { name: "Ergonomic Mesh Office Chair", quantity: 1, price: 399 },
      { name: "LED Desk Lamp with Wireless Charger", quantity: 1, price: 75 },
      { name: "Bamboo Desk Organizer", quantity: 1, price: 38 },
    ],
    total: 512,
    status: "Processing",
    shippingAddress: "42 Maple Street, Portland, OR 97201",
    paymentLast4: "8310",
  },
];

export const mockReviews: MockReview[] = [
  {
    id: 1,
    author: "Jordan T.",
    initials: "JT",
    color: "blue",
    rating: 5,
    date: "2026-03-20",
    comment:
      "Absolutely love these headphones. The noise cancellation is incredible — I use them every day on my commute and they block out everything. Battery easily lasts two days with my usage.",
  },
  {
    id: 2,
    author: "Maria S.",
    initials: "MS",
    color: "pink",
    rating: 4,
    date: "2026-03-14",
    comment:
      "Really solid product. Sound quality is great and they're very comfortable for long sessions. Took one star off because the case feels a bit flimsy, but the headphones themselves are excellent.",
  },
  {
    id: 3,
    author: "David K.",
    initials: "DK",
    color: "green",
    rating: 5,
    date: "2026-02-28",
    comment:
      "Best headphones I've owned. Crystal-clear sound, great build quality, and the ANC works better than my previous pair that cost twice as much. Highly recommend.",
  },
  {
    id: 4,
    author: "Priya N.",
    initials: "PN",
    color: "purple",
    rating: 4,
    date: "2026-02-10",
    comment:
      "Comfortable, great sound, and the battery life is exceptional. My only complaint is that the earpads get a little warm after a couple of hours. Still a fantastic buy.",
  },
  {
    id: 5,
    author: "Alex R.",
    initials: "AR",
    color: "orange",
    rating: 5,
    date: "2026-01-30",
    comment:
      "I was skeptical about the price, but these headphones are absolutely worth it. The call quality is superb and the noise cancellation lets me focus completely in an open office.",
  },
  {
    id: 6,
    author: "Chen W.",
    initials: "CW",
    color: "cyan",
    rating: 3,
    date: "2026-01-18",
    comment:
      "Good headphones overall, but I had connectivity issues the first week. After a firmware update things stabilized. Sound quality is great now, but the initial experience was frustrating.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count: number): Product[] {
  const related = mockProducts.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const others = mockProducts.filter(
    (p) => p.id !== product.id && p.category !== product.category
  );
  return [...related, ...others].slice(0, count);
}
