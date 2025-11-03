import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, './data/products.json');

async function readAll() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeAll(products) {
  const tmp = DATA_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(products, null, 2), 'utf8');
  await fs.rename(tmp, DATA_PATH);
}

export async function getAllProducts() {
  return await readAll();
}

export async function getProductById(id) {
  const all = await readAll();
  return all.find(p => p.id === id) || null;
}

// Bulk price update { "RET-10": 49, "TIRZ-30": 99, ... }
export async function updatePrices(priceMap) {
  const all = await readAll();
  let changed = 0;
  for (const p of all) {
    if (Object.prototype.hasOwnProperty.call(priceMap, p.id)) {
      const val = priceMap[p.id];
      if (typeof val === 'number' && !Number.isNaN(val)) {
        if (p.price !== val) {
          p.price = val;
          changed++;
        }
      }
    }
  }
  if (changed > 0) await writeAll(all);
  return { changed };
}
