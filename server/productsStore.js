// server/productsStore.js
import fs from "fs/promises";
import path from "path";

const usingNetlify = !!process.env.NETLIFY;

// ---- FS paths (for local dev) ----
const ROOT = process.cwd();
const SERVER_DIR = path.join(ROOT, "server");
const DATA_PATH = path.join(SERVER_DIR, "data", "products.json");

// ---- Blobs (prod on Netlify) ----
let blobsStore = null;
async function ensureBlobs() {
  if (usingNetlify && !blobsStore) {
    const { getStore } = await import("@netlify/blobs");
    blobsStore = getStore({ name: "app-data", retention: "forever" });
  }
}
const PRODUCTS_KEY = "products.json";

async function readAll() {
  if (usingNetlify) {
    await ensureBlobs();
    const text = await blobsStore.get(PRODUCTS_KEY);
    if (!text) return [];                     // first deploy = empty
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed; // tolerate {items:[]}
    if (parsed && Array.isArray(parsed.items)) return parsed.items;
    return [];
  }
  // local dev (FS)
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.items)) return parsed.items;
    return [];
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

async function writeAll(products) {
  if (usingNetlify) {
    await ensureBlobs();
    await blobsStore.set(PRODUCTS_KEY, JSON.stringify(products, null, 2));
    return;
  }
  // local dev (FS)
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  const tmp = DATA_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(products, null, 2), "utf8");
  await fs.rename(tmp, DATA_PATH);
}

export async function getAllProducts() {
  return await readAll();
}

export async function getProductById(id) {
  const all = await readAll();
  const target = String(id);
  return all.find((p) => String(p.id) === target) || null;
}

// Bulk price update { "RET-10": 49, "TIRZ-30": 99, ... }
export async function updatePrices(priceMap) {
  if (!priceMap || typeof priceMap !== "object") throw new Error("prices object required");
  const all = await readAll();
  let changed = 0;

  for (const p of all) {
    if (Object.prototype.hasOwnProperty.call(priceMap, p.id)) {
      const n = Number(priceMap[p.id]);
      if (Number.isFinite(n) && p.price !== n) {
        p.price = n;
        changed++;
      }
    }
  }

  if (changed > 0) await writeAll(all);
  return { changed };
}
