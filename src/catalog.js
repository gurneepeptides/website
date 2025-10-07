// catalog.js

// ----- Config you can tweak -----
const DISCOUNTS = {
  1: 0.00, // 1 pack => no discount
  2: 0.15, // 2 pack => 15% off (requested)
  3: 0.25, // 3 pack => 25% off (edit if desired)
};

const PURCHASE_BLOCK = {
  headline: "How to Purchase",
  facebook: "https://www.facebook.com/people/Gurnee-Peptides/61580797282365/#",
  email: "gurneepeptides@gmail.com",
  note: "Message us on Facebook to purchase. If unavailable, email us directly.",
};

const FAQ_BLOCK = [
  {
    q: "Is this product ready to ship?",
    a: "Most items are in stock; message us to secure yours.",
  },
  {
    q: "Do you offer bulk pricing?",
    a: "Yes—include expected quantities in your message/email for a quote.",
  },
  {
    q: "How does the purchase process work?",
    a: "Customers can message us on Facebook (preferred) or email us with the items they’d like to purchase. We will then send an invoice by email, and payment can be made securely using their preferred method. Orders placed before 3 PM ship the same day, with exceptions on weekends.",
  },
];

// ----- Helpers -----
const toNumber = (v) => {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  // strip $ and commas, spaces
  const cleaned = String(v).replace(/[^0-9.\-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
};

const money = (n) =>
  Number.isFinite(n)
    ? Number((Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2))
    : null;

function buildOptions(basePriceRaw) {
  const basePrice = toNumber(basePriceRaw);
  if (basePrice == null) return []; // keep key but empty if no base price

  // Order: 3 Pack, 2 Pack, 1 Pack (like your template)
  const tiers = [
    { id: "o1", qty: 3, label: "3 Pack", badge: "BEST VALUE" },
    { id: "o2", qty: 2, label: "2 Pack", badge: "MOST POPULAR" },
    { id: "o3", qty: 1, label: "1 Pack", badge: undefined },
  ];

  return tiers.map(({ id, qty, label, badge }) => {
    const compareAt = money(basePrice * qty);
    const discount = DISCOUNTS[qty] ?? 0;
    const price = money(compareAt * (1 - discount));
    const opt = { id, label, price, compareAt };
    if (badge) opt.badge = badge;
    return opt;
  });
}

function normalizeItem(item) {
  const price = toNumber(item.price);
  return {
    id: item.id,
    name: item.name,
    dosage: item.dosage ?? null,
    volume: item.volume ?? null,
    category: item.category ?? null,
    price, // normalized numeric (or null)
    image: item.image ?? null,
    images: item.images ?? [],
    tags: Array.isArray(item.tags) ? item.tags : [],
    // IMPORTANT: Always rebuild from base price (ignore any raw item.options)
    options: buildOptions(price),
    purchase: { ...PURCHASE_BLOCK },
    faq: [...FAQ_BLOCK],
    description: item.description
  };
}

export function normalizeCatalog(raw) {
  return raw.map(normalizeItem);
}
