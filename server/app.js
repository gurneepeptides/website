// server/app.js
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import morgan from 'morgan';
import cors from 'cors';
import { promises as fs } from 'fs';

import { getAllProducts, getProductById, updatePrices } from './productsStore.js';

const {
  NODE_ENV = 'development',
  JWT_SECRET = 'dev_secret',
  COOKIE_NAME = 'gp_auth',
  ADMIN_EMAIL,
  ADMIN_PASSWORD_HASH,
  ADMIN_PASSWORD,
  NETLIFY, // truthy on Netlify
} = process.env;

console.log('process env: ', process.env)

const isProd = NODE_ENV === 'production';
const usingNetlify = !!NETLIFY;

// ----- Path helpers (no import.meta) -----
const ROOT = process.cwd();                 // project root (works in Netlify Functions & dev)
const SERVER_DIR = path.join(ROOT, 'server');
const resolveServerPath = (rel) => path.join(SERVER_DIR, rel);

// ----- Storage (FS in dev, Netlify Blobs in prod) -----
let store = null;
async function ensureStore() {
  if (usingNetlify && !store) {
    const { getStore } = await import('@netlify/blobs');
    store = getStore({ name: 'app-data', retention: 'forever' });
  }
}
function toBlobKey(relOrAbsPath) {
  // keep keys simple (e.g., settings.json, products.json)
  return path.basename(relOrAbsPath);
}
async function readJSON(relPath, fallback = null) {
  await ensureStore();
  if (usingNetlify) {
    const key = toBlobKey(relPath);
    const text = await store.get(key);
    if (!text) return fallback;
    return JSON.parse(text);
  }
  const abs = resolveServerPath(relPath);
  const raw = await fs.readFile(abs, 'utf8');
  return JSON.parse(raw);
}
async function writeJSON(relPath, data) {
  await ensureStore();
  if (usingNetlify) {
    const key = toBlobKey(relPath);
    await store.set(key, JSON.stringify(data, null, 2));
    return;
  }
  const abs = resolveServerPath(relPath);
  const tmp = abs + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, abs);
}
async function writeAll(relPath, data) {
  return writeJSON(relPath, data);
}

// Paths (used as keys for Blobs in prod; as files locally)
const SETTINGS_PATH = 'data/settings.json';
const PRODUCTS_PATH = 'data/products.json';

// ===== Admin credential bootstrap =====
let admin = { email: ADMIN_EMAIL || 'gurneepeptides@gmail.com', passwordHash: ADMIN_PASSWORD_HASH || null };
async function ensureAdminHash() {
  if (!admin.passwordHash) {
    if (!ADMIN_PASSWORD) {
      console.warn('[WARN] No ADMIN_PASSWORD_HASH or ADMIN_PASSWORD provided. Using temporary dev password "changeme123"');
      admin.passwordHash = await bcrypt.hash('admin1234', 12);
    } else {
      admin.passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    }
  }
}

// ===== App =====
const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json());
app.use(cookieParser());

// In Netlify, frontend & functions are same-origin; CORS mostly for local dev.
app.use(
  cors({
    origin: usingNetlify ? false : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

// Ensure async init completes before handling requests (no top-level await)
const init = (async () => {
  await ensureAdminHash();
  // add other boot-time async here if needed
})();

app.use(async (_req, _res, next) => {
  await init;
  next();
});

// ===== Auth helpers =====
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
  });
}
function requireAdmin(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    if (data.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.user = data;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ===== Public: global settings =====
app.get('/api/settings', async (_req, res) => {
  try {
    const settings = (await readJSON(SETTINGS_PATH)) ?? {};
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.json(settings);
  } catch (e) {
    console.error('GET /api/settings failed:', e);
    res.status(500).json({ error: 'failed_to_load_settings' });
  }
});

// ===== Admin: update settings =====
app.post('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    const current = (await readJSON(SETTINGS_PATH)) ?? {};
    const patch = req.body || {};

    const toDecimal = (v) => {
      let n = Number(v);
      if (!Number.isFinite(n)) return null;
      if (n > 1) n = n / 100;
      n = Math.max(0, Math.min(0.95, n));
      return Math.round(n * 10000) / 10000;
    };

    const next = { ...current };
    if (patch.siteName !== undefined) next.siteName = String(patch.siteName);
    if (patch.topBarMessage !== undefined) next.topBarMessage = String(patch.topBarMessage);
    if (patch.messengerLink !== undefined) next.messengerLink = String(patch.messengerLink);

    if (patch.promo !== undefined) {
      const p = patch.promo || {};
      next.promo = {
        enabled: typeof p.enabled === 'boolean' ? p.enabled : !!current.promo?.enabled,
        type: p.type === 'B2G1' || p.type === 'BOGO' ? p.type : current.promo?.type || 'B2G1',
      };
    }

    if (patch.quantityDiscounts !== undefined) {
      const incoming = patch.quantityDiscounts || {};
      const prev = current.quantityDiscounts || {};
      const qd = {
        1: prev['1'] ?? prev[1] ?? 0,
        2: prev['2'] ?? prev[2] ?? 0,
        3: prev['3'] ?? prev[3] ?? 0,
      };
      if (incoming['1'] !== undefined || incoming[1] !== undefined) {
        const d = toDecimal(incoming['1'] ?? incoming[1]);
        if (d !== null) qd[1] = d;
      }
      if (incoming['2'] !== undefined || incoming[2] !== undefined) {
        const d = toDecimal(incoming['2'] ?? incoming[2]);
        if (d !== null) qd[2] = d;
      }
      if (incoming['3'] !== undefined || incoming[3] !== undefined) {
        const d = toDecimal(incoming['3'] ?? incoming[3]);
        if (d !== null) qd[3] = d;
      }
      next.quantityDiscounts = qd;
    }

    await writeJSON(SETTINGS_PATH, next);
    res.json({ ok: true, settings: next });
  } catch (e) {
    console.error('POST /api/admin/settings failed:', e);
    res.status(500).json({ error: 'failed_to_save_settings' });
  }
});

// ===== Admin auth =====
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (email !== admin.email) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ sub: 'admin', email, role: 'admin' });
  setAuthCookie(res, token);
  res.json({ ok: true, email });
});
app.post('/api/admin/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});
app.get('/api/admin/me', requireAdmin, (_req, res) => {
  res.json({ ok: true, email: admin.email });
});

// ===== Top bar message (example) =====
let topBarMessage = null;
app.get('/api/topbar', (_req, res) => res.json({ message: topBarMessage }));
app.post('/api/admin/topbar', requireAdmin, (req, res) => {
  const { message } = req.body ?? {};
  if (typeof message !== 'string') return res.status(400).json({ error: 'message (string) required' });
  topBarMessage = message;
  res.json({ ok: true });
});

// ===== Products =====
app.get('/api/products', async (_req, res) => {
  try {
    const items = await getAllProducts();
    res.json({ items });
  } catch {
    res.status(500).json({ error: 'Failed to load products' });
  }
});
app.get('/api/products/:id', async (req, res) => {
  try {
    const item = await getProductById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ item });
  } catch {
    res.status(500).json({ error: 'Failed to load product' });
  }
});

// Bulk price update
app.post('/api/admin/product-prices', requireAdmin, async (req, res) => {
  try {
    const { prices } = req.body ?? {};
    if (!prices || typeof prices !== 'object') {
      return res.status(400).json({ error: 'prices object required' });
    }
    const result = await updatePrices(prices);
    res.json({ ok: true, ...result });
  } catch {
    res.status(500).json({ error: 'Failed to update prices' });
  }
});

app.get('/api/admin/debug-products-shape', async (_req, res) => {
  try {
    const obj = (await readJSON(PRODUCTS_PATH)) ?? [];
    res.json({
      isArray: Array.isArray(obj),
      hasItemsArray: !!(obj && Array.isArray(obj.items)),
      sampleLength: Array.isArray(obj) ? obj.length : Array.isArray(obj?.items) ? obj.items.length : null,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Bulk patch products.json (same shape logic as before)
app.post('/api/admin/products/bulk', requireAdmin, async (req, res) => {
  try {
    const { updates } = req.body || {};
    if (!Array.isArray(updates)) return res.status(400).json({ error: 'updates must be an array' });

    let existing = (await readJSON(PRODUCTS_PATH)) ?? [];
    const wasWrapped = !!(existing && typeof existing === 'object' && Array.isArray(existing.items));
    const items = wasWrapped
      ? (Array.isArray(existing.items) ? existing.items : [])
      : Array.isArray(existing)
      ? existing
      : [];

    const map = new Map(items.map((p) => [p.id, p]));
    let applied = 0;
    for (const patch of updates) {
      if (!patch || typeof patch !== 'object') continue;
      const cur = map.get(patch.id);
      if (!cur) continue;

      if (patch.price !== undefined) cur.price = Number(patch.price);
      if (patch.name !== undefined) cur.name = String(patch.name);
      if (patch.description !== undefined) cur.description = String(patch.description);
      if (patch.tags !== undefined) cur.tags = Array.isArray(patch.tags) ? patch.tags : [];
      if (patch.researchGoals !== undefined) cur.researchGoals = Array.isArray(patch.researchGoals) ? patch.researchGoals : [];
      if (patch.synergiesWith !== undefined) cur.synergiesWith = Array.isArray(patch.synergiesWith) ? patch.synergiesWith : [];

      applied++;
    }

    const nextItems = Array.from(map.values());
    const toWrite = wasWrapped ? { ...existing, items: nextItems } : nextItems;
    await writeAll(PRODUCTS_PATH, toWrite);

    res.json({ ok: true, updated: applied });
  } catch (e) {
    console.error('[bulk] unexpected error:', e);
    res.status(500).json({ error: 'bulk save failed' });
  }
});

// IMPORTANT: Do NOT serve /dist here (Netlify serves static). No app.listen().
export default app;
