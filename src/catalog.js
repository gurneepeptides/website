// catalog.js

// ----- Default (fallback) config -----
export const DEFAULT_DISCOUNTS = {
  1: 0.00, // 1 pack => no discount
  2: 0.15, // 2 pack => 15% off (requested)
  3: 0.25, // 3 pack => 25% off
};

const PURCHASE_BLOCK = {
  headline: "How to Purchase",
  facebook: "https://m.me/61580797282365",
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
  const cleaned = String(v).replace(/[^0-9.\-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
};

const money = (n) =>
  Number.isFinite(n)
    ? Number((Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2))
    : null;

function roundToNearest5(num) {
  return Math.round(num / 5) * 5;
}

// ✅ NEW: pull discounts from global settings when provided
function getDiscountsFromSettings(settings) {
  // Expecting settings?.quantityDiscounts like: { "1": 0, "2": 0.15, "3": 0.25 }
  const src = settings?.quantityDiscounts;
  if (!src || typeof src !== "object") return DEFAULT_DISCOUNTS;

  const out = {};
  for (const [k, v] of Object.entries(src)) {
    const qty = Number(k);
    const disc = Number(v);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    // clamp discount between 0 and 0.95 to avoid nonsensical values
    if (!Number.isFinite(disc)) continue;
    out[qty] = Math.max(0, Math.min(0.95, disc));
  }

  // If nothing valid, fall back
  return Object.keys(out).length ? out : DEFAULT_DISCOUNTS;
}

function buildOptions(basePriceRaw, discounts) {
  const basePrice = toNumber(basePriceRaw);
  if (basePrice == null) return []; // keep key but empty if no base price

  const tiers = [
    { id: "o1", qty: 3, label: "3 Pack", badge: "BEST VALUE" },
    { id: "o2", qty: 2, label: "2 Pack", badge: "MOST POPULAR" },
    { id: "o3", qty: 1, label: "1 Pack" },
  ];

  return tiers.map(({ id, qty, label, badge }) => {
    const compareAtRaw = basePrice * qty;
    const discount = discounts[qty] ?? 0;
    const priceRaw = compareAtRaw * (1 - discount);

    // ✅ Round to nearest 5 and remove decimals
    const compareAtRounded = roundToNearest5(compareAtRaw);
    const priceRounded = roundToNearest5(priceRaw);

    const opt = {
      id,
      label,
      price: money(priceRounded),
      compareAt: money(compareAtRounded),
    };

    if (badge) opt.badge = badge;
    return opt;
  });
}

function normalizeItem(item, settings) {
  const discounts = getDiscountsFromSettings(settings);
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
    // IMPORTANT: Always rebuild from base price using discounts (server or default)
    options: buildOptions(price, discounts),
    purchase: { ...PURCHASE_BLOCK },
    faq: [...FAQ_BLOCK],
    description: item.description,
  };
}

// ✅ NEW: optional second arg `settings` (pass your global settings here)
export function normalizeCatalog(raw, settings) {
  return raw.map((item) => normalizeItem(item, settings));
}
