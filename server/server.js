import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import morgan from 'morgan';
import cors from 'cors';
import { promises as fs } from "fs";

import { getAllProducts, getProductById, updatePrices } from './productsStore.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const SETTINGS_PATH = path.join(__dirname, "data", "settings.json");

async function readJSON(absPath) {
  const raw = await fs.readFile(absPath, "utf8");
  return JSON.parse(raw);
}
async function writeJSON(absPath, data) {
  const tmp = absPath + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, absPath);
}

// Resolve a file relative to this server file
function resolveDataPath(rel) {
  return path.join(__dirname, rel);
}

// Write JSON with pretty formatting
async function writeAll(relPath, data) {
  const abs = resolveDataPath(relPath);
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(abs, json, "utf8");
}

const {
  PORT = 8080,
  NODE_ENV = 'development',
  JWT_SECRET = 'dev_secret',
  COOKIE_NAME = 'gp_auth',
  ADMIN_EMAIL,
  ADMIN_PASSWORD_HASH,
  ADMIN_PASSWORD
} = process.env;

const isProd = NODE_ENV === 'production';

// ===== Admin credential bootstrap =====
let admin = { email: ADMIN_EMAIL || 'admin@example.com', passwordHash: ADMIN_PASSWORD_HASH || null };

async function ensureAdminHash() {
  if (!admin.passwordHash) {
    if (!ADMIN_PASSWORD) {
      console.warn('[WARN] No ADMIN_PASSWORD_HASH or ADMIN_PASSWORD provided. Using temporary dev password "changeme123"');
      admin.passwordHash = await bcrypt.hash('changeme123', 12);
    } else {
      admin.passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    }
  }
}
await ensureAdminHash();

// ===== App =====
const app = express();
app.use(helmet({ contentSecurityPolicy: false })); // turn on CSP later w/ hashes
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json());
app.use(cookieParser());

// Useful if your SPA runs on a dev port and server on another
app.use(cors({
  origin: isProd ? false : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// ===== Auth helpers =====
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,         // requires HTTPS in prod
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}
function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/'
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
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ===== Public API (optional) =====
// Add any public endpoints here if you need them later
// Public: everyone can read global settings
app.get("/api/settings", async (req, res) => {
  try {
    const settings = await readJSON(SETTINGS_PATH);
    // cache gently for 30s
    res.setHeader("Cache-Control", "public, max-age=30");
    console.log('settings: ', settings)
    res.json(settings);
  } catch (e) {
    console.error("GET /api/settings failed:", e);
    res.status(500).json({ error: "failed_to_load_settings" });
  }
});

// Admin-only: update settings (merge patch)
app.post("/api/admin/settings", requireAdmin, async (req, res) => {
  try {
    const patch = req.body || {};
    const current = await readJSON(SETTINGS_PATH);

    // helper: normalize number to decimal in [0, 0.95]
    const toDecimal = (v) => {
      let n = Number(v);
      if (!Number.isFinite(n)) return null;
      // allow percent inputs (e.g., 15 -> 0.15). If already decimal, keep as-is.
      if (n > 1) n = n / 100;
      // clamp
      n = Math.max(0, Math.min(0.95, n));
      // round to 4 dp to avoid floating drift
      return Math.round(n * 10000) / 10000;
    };

    const next = { ...current };

    // simple string props
    if (patch.siteName !== undefined) next.siteName = String(patch.siteName);
    if (patch.topBarMessage !== undefined) next.topBarMessage = String(patch.topBarMessage);
    if (patch.messengerLink !== undefined) next.messengerLink = String(patch.messengerLink);

    // promo (boolean + enum)
    if (patch.promo !== undefined) {
      const p = patch.promo || {};
      next.promo = {
        enabled: typeof p.enabled === "boolean" ? p.enabled : !!current.promo?.enabled,
        type:
          p.type === "B2G1" || p.type === "BOGO"
            ? p.type
            : current.promo?.type || "B2G1",
      };
    }

    // quantityDiscounts: merge patch -> current
    if (patch.quantityDiscounts !== undefined) {
      const incoming = patch.quantityDiscounts || {};
      const prev = current.quantityDiscounts || {};
      const qd = {
        1: prev["1"] ?? prev[1] ?? 0,
        2: prev["2"] ?? prev[2] ?? 0,
        3: prev["3"] ?? prev[3] ?? 0,
      };

      // apply incoming values if present (accept numeric or string)
      if (incoming["1"] !== undefined || incoming[1] !== undefined) {
        const d = toDecimal(incoming["1"] ?? incoming[1]);
        if (d !== null) qd[1] = d;
      }
      if (incoming["2"] !== undefined || incoming[2] !== undefined) {
        const d = toDecimal(incoming["2"] ?? incoming[2]);
        if (d !== null) qd[2] = d;
      }
      if (incoming["3"] !== undefined || incoming[3] !== undefined) {
        const d = toDecimal(incoming["3"] ?? incoming[3]);
        if (d !== null) qd[3] = d;
      }

      next.quantityDiscounts = qd;
    }

    await writeJSON(SETTINGS_PATH, next);
    res.json({ ok: true, settings: next });
  } catch (e) {
    console.error("POST /api/admin/settings failed:", e);
    res.status(500).json({ error: "failed_to_save_settings" });
  }
});

// ===== Admin auth endpoints (server-only auth; SPA posts from /admin) =====
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

app.post('/api/admin/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ ok: true, email: admin.email });
});

// ===== Example protected admin resource: top bar message =====
// In-memory store; swap for DB later
let topBarMessage = null;

app.get('/api/topbar', (req, res) => {
  // public read (so your site can fetch a live message instead of localStorage if you want)
  res.json({ message: topBarMessage });
});

app.post('/api/admin/topbar', requireAdmin, (req, res) => {
  const { message } = req.body ?? {};
  if (typeof message !== 'string') return res.status(400).json({ error: 'message (string) required' });
  topBarMessage = message;
  res.json({ ok: true });
});



// Public: list all products
app.get('/api/products', async (req, res) => {
  try {
    const items = await getAllProducts();
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// Public: single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const item = await getProductById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ item });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load product' });
  }
});

// Admin: bulk price update
app.post('/api/admin/product-prices', requireAdmin, async (req, res) => {
  try {
    const { prices } = req.body ?? {};
    if (!prices || typeof prices !== 'object') {
      return res.status(400).json({ error: 'prices object required' });
    }
    const result = await updatePrices(prices);
    res.json({ ok: true, ...result });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update prices' });
  }
});


app.get("/api/admin/debug-products-shape", async (req, res) => {
  try {
    const dataPath = "./data/products.json";
    const raw = await fs.readFile(resolveDataPath(dataPath), "utf8");
    const obj = JSON.parse(raw);
    res.json({
      isArray: Array.isArray(obj),
      hasItemsArray: !!(obj && Array.isArray(obj.items)),
      sampleLength: Array.isArray(obj) ? obj.length : (Array.isArray(obj?.items) ? obj.items.length : null)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/admin/products/bulk", requireAdmin, async (req, res) => {
  try {
    const { updates } = req.body || {};
    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: "updates must be an array" });
    }

    // Adjust path if your data file lives elsewhere
    const dataPath = "./data/products.json";

    // Load file (robust against empty/invalid/missing)
    let rawStr = "[]";
    try {
      rawStr = await fs.readFile(resolveDataPath(dataPath), "utf8");
      if (!rawStr || !rawStr.trim()) rawStr = "[]";
    } catch (e) {
      // If file doesn't exist yet, start with empty array
      if (e.code !== "ENOENT") {
        console.error("[bulk] read error:", e);
        return res.status(500).json({ error: "failed to read products file" });
      }
    }

    let existing;
    try {
      existing = JSON.parse(rawStr);
    } catch (e) {
      console.error("[bulk] JSON parse error:", e);
      return res.status(500).json({ error: "products file is not valid JSON" });
    }

    // Normalize to an array for editing, remember original shape to write back consistently
    const wasWrapped = !!(existing && typeof existing === "object" && Array.isArray(existing.items));
    const items = wasWrapped
      ? Array.isArray(existing.items) ? existing.items : []
      : Array.isArray(existing) ? existing : [];

    // Index by id
    const map = new Map(items.map((p) => [p.id, p]));

    // Apply safe patches
    let applied = 0;
    for (const patch of updates) {
      if (!patch || typeof patch !== "object") continue;
      const cur = map.get(patch.id);
      if (!cur) continue;

      if (patch.price !== undefined) cur.price = Number(patch.price);
      if (patch.name !== undefined) cur.name = String(patch.name);
      if (patch.description !== undefined) cur.description = String(patch.description);
      if (patch.tags !== undefined) cur.tags = Array.isArray(patch.tags) ? patch.tags : [];
      if (patch.researchGoals !== undefined)
        cur.researchGoals = Array.isArray(patch.researchGoals) ? patch.researchGoals : [];
      if (patch.synergiesWith !== undefined)
        cur.synergiesWith = Array.isArray(patch.synergiesWith) ? patch.synergiesWith : [];

      applied++;
    }

    const nextItems = Array.from(map.values());

    // Write back using the original container shape
    const toWrite = wasWrapped ? { ...existing, items: nextItems } : nextItems;
    await writeAll(dataPath, toWrite);

    return res.json({ ok: true, updated: applied });
  } catch (e) {
    console.error("[bulk] unexpected error:", e);
    return res.status(500).json({ error: "bulk save failed" });
  }
});


// ===== Static SPA serving =====
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath, { index: false }));

// Keep SPA routes working (including /admin) by always returning index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} (NODE_ENV=${NODE_ENV})`);
});
