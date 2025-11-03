import React, { useEffect, useMemo, useState, useCallback } from "react";

/**
 * Admin Page — focus-safe & maintainable
 * - ProductRow is memoized and receives only stable, minimal props
 * - Inputs are memoized subcomponents
 * - Row body always mounted; visibility toggled via CSS (no remount => focus kept)
 */

export default function AdminPage() {
  // ---------- Auth ----------
  const [authedEmail, setAuthedEmail] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---------- UI / status ----------
  const [saveStatus, setSaveStatus] = useState("");

  // ---------- Top bar ----------
  const DEFAULT_TOPBAR = `
🚚 Same-Day Shipping on orders confirmed before 3PM CT • For Research Use Only
⚙️ Site is undergoing changes`;
  const [topBarMessage, setTopBarMessage] = useState(DEFAULT_TOPBAR);

  // ---------- Products ----------
  const [products, setProducts] = useState([]);      // from server
  const [edited, setEdited] = useState({});          // { [id]: partialPatch }
  const [openMap, setOpenMap] = useState({});        // { [id]: boolean }
  const [query, setQuery] = useState("");

  // ---------- Global Settings (Quantity Discounts) ----------
  const [settings, setSettings] = useState(null); // full server settings blob
  const [disc1, setDisc1] = useState("0");        // % as string for input
  const [disc2, setDisc2] = useState("15");
  const [disc3, setDisc3] = useState("25");

  // ===== Helpers: CSV <-> array =====
  const arrToCSV = useCallback(
    (arr) => (Array.isArray(arr) ? arr.join(", ") : ""),
    []
  );
  const csvToArr = useCallback(
    (s) =>
      String(s || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    []
  );

  // ===== Auth =====
  const checkMe = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/me", { credentials: "include" });
      if (!res.ok) return setAuthedEmail(null);
      const data = await res.json();
      setAuthedEmail(data.email || "admin");
    } catch {
      setAuthedEmail(null);
    }
  }, []);

  const login = useCallback(
    async (e) => {
      e.preventDefault();
      setSaveStatus("Logging in…");
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setSaveStatus(err.error || "Login failed");
          return;
        }
        setPassword("");
        await checkMe();
        await loadData();
        setSaveStatus("Logged in!");
        setTimeout(() => setSaveStatus(""), 1200);
      } catch {
        setSaveStatus("Network error");
        setTimeout(() => setSaveStatus(""), 1200);
      }
    },
    [checkMe, email, password]
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    } catch {}
    setAuthedEmail(null);
    setEmail("");
    setPassword("");
  }, []);

  // ===== Data load =====
  const loadData = useCallback(async () => {
    // top bar (local)
    const saved = localStorage.getItem("topBarMessage");
    setTopBarMessage(saved || DEFAULT_TOPBAR);

    // settings (server)
    try {
      const sres = await fetch("/api/settings");
      if (sres.ok) {
        const s = await sres.json();
        setSettings(s || {});
        const qd = (s && s.quantityDiscounts) || {};
        // numbers -> percent strings
        setDisc1(String(Math.round(((qd["1"] ?? 0) * 100))));
        setDisc2(String(Math.round(((qd["2"] ?? 0.15) * 100))));
        setDisc3(String(Math.round(((qd["3"] ?? 0.25) * 100))));
      } else {
        setSettings(null);
        setDisc1("0"); setDisc2("15"); setDisc3("25");
      }
    } catch {
      setSettings(null);
      setDisc1("0"); setDisc2("15"); setDisc3("25");
    }

    // products (server)
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        setProducts([]);
        return;
      }
      const { items } = await res.json();
      setProducts(items || []);
      setEdited({});
      // sync prices for legacy pages
      const priceMap = {};
      (items || []).forEach((p) => (priceMap[p.id] = Number(p.price) || 0));
      localStorage.setItem("productPrices", JSON.stringify(priceMap));
    } catch {
      setProducts([]);
    }
  }, [DEFAULT_TOPBAR]);

  useEffect(() => {
    checkMe().then(loadData);
  }, [checkMe, loadData]);

  // ===== Editing helpers =====
  const getDraftValue = useCallback(
    (p, key) => {
      const patch = edited[p.id] || {};
      return patch[key] !== undefined ? patch[key] : p[key];
    },
    [edited]
  );

  const setDraft = useCallback((id, key, value) => {
    setEdited((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value },
    }));
  }, []);

  // ===== Save =====
  const saveAll = useCallback(async () => {
    setSaveStatus("Saving…");

    // Topbar: local + server
    localStorage.setItem("topBarMessage", topBarMessage);
    window.dispatchEvent(new Event("topBarUpdate"));
    if (authedEmail) {
      try {
        const topRes = await fetch("/api/admin/topbar", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: topBarMessage }),
        });
        if (!topRes.ok) {
          const err = await topRes.json().catch(() => ({}));
          console.warn("Topbar sync failed:", err.error || topRes.status);
        }
      } catch (e) {
        console.warn("Topbar sync error:", e);
      }
    }

    // ✅ Push global quantity discounts to server (admin)
    if (authedEmail) {
      // clamp and convert % -> decimal
      const p1 = Math.max(0, Math.min(95, Number(disc1) || 0)) / 100;
      const p2 = Math.max(0, Math.min(95, Number(disc2) || 0)) / 100;
      const p3 = Math.max(0, Math.min(95, Number(disc3) || 0)) / 100;

      const nextSettings = {
        ...(settings || {}),
        quantityDiscounts: { "1": p1, "2": p2, "3": p3 },
      };

      console.log('next: ', nextSettings)

      try {
        const sres = await fetch("/api/admin/settings", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextSettings),
        });
        if (!sres.ok) {
          const err = await sres.json().catch(() => ({}));
          console.warn("Settings save failed:", err.error || sres.status);
        } else {
          setSettings(nextSettings);
        }
      } catch (e) {
        console.warn("Settings save error:", e);
      }
    }

    // Build diffs for products
    const updates = [];
    for (const p of products) {
      const e = edited[p.id];
      if (!e) continue;

      const patch = { id: p.id };
      let dirty = false;

      if (e.name !== undefined && e.name !== p.name) {
        patch.name = String(e.name);
        dirty = true;
      }
      if (e.price !== undefined && e.price !== p.price) {
        const n = Number(e.price);
        if (!Number.isNaN(n)) {
          patch.price = n;
          dirty = true;
        }
      }
      if (e.description !== undefined && e.description !== p.description) {
        patch.description = String(e.description);
        dirty = true;
      }
      if (e.tags !== undefined) {
        const next = Array.isArray(e.tags) ? e.tags : csvToArr(e.tags);
        const prev = Array.isArray(p.tags) ? p.tags : [];
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
          patch.tags = next;
          dirty = true;
        }
      }
      if (e.researchGoals !== undefined) {
        const next = Array.isArray(e.researchGoals) ? e.researchGoals : csvToArr(e.researchGoals);
        const prev = Array.isArray(p.researchGoals) ? p.researchGoals : [];
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
          patch.researchGoals = next;
          dirty = true;
        }
      }
      if (e.synergiesWith !== undefined) {
        const next = Array.isArray(e.synergiesWith) ? e.synergiesWith : csvToArr(e.synergiesWith);
        const prev = Array.isArray(p.synergiesWith) ? p.synergiesWith : [];
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
          patch.synergiesWith = next;
          dirty = true;
        }
      }

      if (dirty) updates.push(patch);
    }

    if (updates.length === 0) {
      setSaveStatus("✓ Saved settings");
      setTimeout(() => setSaveStatus(""), 1000);
      return;
    }

    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setSaveStatus(err.error || "Failed to save");
        return;
      }
      await loadData();
      setEdited({});
      setSaveStatus("✓ Saved");
      setTimeout(() => setSaveStatus(""), 1000);
    } catch {
      setSaveStatus("Network error");
      setTimeout(() => setSaveStatus(""), 1000);
    }
  }, [authedEmail, csvToArr, disc1, disc2, disc3, edited, loadData, products, settings, topBarMessage]);

  const resetLocalEdits = useCallback(() => {
    if (!window.confirm("Clear all local edits (server will not change)?")) return;
    setEdited({});
    setSaveStatus("Local edits cleared");
    setTimeout(() => setSaveStatus(""), 1000);
  }, []);

  // ===== Search / Filter =====
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((p) => {
      const hay = `${p.id} ${p.name} ${p.category || ""} ${p.description || ""} ${arrToCSV(p.tags)}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [arrToCSV, products, query]);

  // ===== Toggle helpers (stable) =====
  const isOpen = useCallback((id) => !!openMap[id], [openMap]);
  const toggleOpen = useCallback((id) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // ===== Login screen =====
  if (!authedEmail) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>Admin Login</h1>
          <form onSubmit={login}>
            <input
              type="email"
              className="admin-input"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="admin-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="admin-btn">Login</button>
          </form>
          {saveStatus && <div className="admin-status">{saveStatus}</div>}
        </div>

        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="header-actions">
          <button className="admin-btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {saveStatus && <div className="admin-status">{saveStatus}</div>}

      {/* Top Bar */}
      <section className="card">
        <h2>Top Bar Message</h2>
        <textarea
          className="admin-textarea"
          rows={4}
          value={topBarMessage}
          onChange={(e) => setTopBarMessage(e.target.value)}
          placeholder="Enter top bar message…"
        />
      </section>

      {/* Quantity Discounts */}
      <section className="card">
        <h2>Quantity Discounts</h2>
        <p className="muted" style={{ marginTop: ".25rem" }}>
          Enter percentages. These apply to 1-Pack, 2-Pack, and 3-Pack pricing across the site.
        </p>

        <div className="qd-grid">
          <label className="field">
            <span>1 Pack Discount (%)</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="95"
              value={disc1}
              onChange={(e) => setDisc1(e.target.value)}
              placeholder="0"
            />
          </label>
          <label className="field">
            <span>2 Pack Discount (%)</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="95"
              value={disc2}
              onChange={(e) => setDisc2(e.target.value)}
              placeholder="15"
            />
          </label>
          <label className="field">
            <span>3 Pack Discount (%)</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="95"
              value={disc3}
              onChange={(e) => setDisc3(e.target.value)}
              placeholder="25"
            />
          </label>
        </div>
      </section>

      {/* Products */}
      <section className="card">
        <div className="products-head">
          <h2>Products</h2>
          <input
            className="admin-input search"
            placeholder="Search by id/name/tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="rows">
          {filtered.map((p) => {
            // Precompute stable draft values to avoid recalcs in row
            const rowDraft = {
              id: p.id,
              name: getDraftValue(p, "name") || "",
              price:
                getDraftValue(p, "price") === undefined || getDraftValue(p, "price") === null
                  ? ""
                  : getDraftValue(p, "price"),
              description: getDraftValue(p, "description") || "",
              tags:
                typeof getDraftValue(p, "tags") === "string"
                  ? getDraftValue(p, "tags")
                  : arrToCSV(getDraftValue(p, "tags")),
              researchGoals:
                typeof getDraftValue(p, "researchGoals") === "string"
                  ? getDraftValue(p, "researchGoals")
                  : arrToCSV(getDraftValue(p, "researchGoals")),
              synergiesWith:
                typeof getDraftValue(p, "synergiesWith") === "string"
                  ? getDraftValue(p, "synergiesWith")
                  : arrToCSV(getDraftValue(p, "synergiesWith")),
              priceDisplay: Number(getDraftValue(p, "price") ?? 0).toFixed(2),
            };

            return (
              <ProductRow
                key={p.id}
                open={isOpen(p.id)}
                onToggle={() => toggleOpen(p.id)}
                rowDraft={rowDraft}
                onEdit={setDraft}
              />
            );
          })}
          {filtered.length === 0 && (
            <div className="muted">No products match your search.</div>
          )}
        </div>
      </section>

      <div className="admin-actions">
        <button className="admin-btn" onClick={saveAll}>
          Save All Changes
        </button>
        <button className="admin-btn-danger" onClick={resetLocalEdits}>
          Reset Local Edits
        </button>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

/** ================= Subcomponents (memoized) ================= */

const ProductRow = React.memo(function ProductRow({ open, onToggle, rowDraft, onEdit }) {
  const stop = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const onChange = useCallback(
    (field) => (e) => {
      const val = e.target.value;
      onEdit(rowDraft.id, field, val);
    },
    [onEdit, rowDraft.id]
  );

  return (
    <div className="row" data-open={open ? "true" : "false"}>
      <div
        className="row-head"
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="row-head-main">
          <code className="code">{rowDraft.id}</code>
          <strong className="title">{rowDraft.name || "(untitled)"}</strong>
        </div>
        <div className="row-head-side">
          <span className="price">${rowDraft.priceDisplay}</span>
          <span className="chev">{open ? "▴" : "▾"}</span>
        </div>
      </div>

      {/* Body stays mounted; visibility via CSS */}
      <div className="row-body" onClick={stop} onMouseDown={stop}>
        <FieldInput
          label="Title"
          placeholder="Product title"
          value={rowDraft.name}
          onChange={onChange("name")}
        />
        <FieldInput
          label="Price (USD)"
          placeholder="0.00"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={rowDraft.price}
          onChange={onChange("price")}
        />
        <FieldTextArea
          label="Description"
          placeholder="Product description"
          rows={4}
          full
          value={rowDraft.description}
          onChange={onChange("description")}
        />
        <FieldInput
          label="Tags (comma-separated)"
          placeholder="popular, combo"
          value={rowDraft.tags || ""}
          onChange={onChange("tags")}
        />
        <FieldInput
          label="Research Goals (comma-separated)"
          placeholder="weight-management, metabolism"
          value={rowDraft.researchGoals || ""}
          onChange={onChange("researchGoals")}
        />
        <FieldInput
          label="Synergies With (comma-separated)"
          placeholder="MOTSC-10mg, NAD-500mg"
          value={rowDraft.synergiesWith || ""}
          onChange={onChange("synergiesWith")}
        />
      </div>
    </div>
  );
});

const FieldInput = React.memo(function FieldInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  inputMode,
  step,
  min,
  full = false,
}) {
  return (
    <label className={`field ${full ? "field-full" : ""}`}>
      <span>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        step={step}
        min={min}
      />
    </label>
  );
});

const FieldTextArea = React.memo(function FieldTextArea({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  full = false,
}) {
  return (
    <label className={`field ${full ? "field-full" : ""}`}>
      <span>{label}</span>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
      />
    </label>
  );
});

/* ===== Styles (simple + consistent colors) ===== */
const styles = `
  :root {
    --ink: #0f172a;
    --sub: #616e7c;
    --panel: #ffffff;
    --border: #e5e7eb;
    --navy: #1c2b3a;
    --navy-hover: #243a53;
    --accent: #4caf50;
    --accent-ink: #ffffff;
    --danger: #f44336;
    --bg-soft: #fafafa;
  }

  .admin-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 80vh;
    color: var(--ink);
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }
  .admin-header h1 { margin: 0; font-weight: 700; }

  .card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  .card h2 {
    margin: 0 0 .5rem 0;
  }

  .admin-input, .admin-textarea {
    width: 100%;
    padding: .65rem .7rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: .95rem;
    background: #fff;
  }
  .admin-textarea { resize: vertical; line-height: 1.45; }

  .admin-btn, .admin-btn-secondary, .admin-btn-danger {
    padding: .7rem 1rem;
    border: 0;
    border-radius: 8px;
    font-size: .95rem;
    cursor: pointer;
  }
  .admin-btn { background: var(--accent); color: var(--accent-ink); }
  .admin-btn:hover { filter: brightness(0.95); }

  .admin-btn-secondary { background: #757575; color: #fff; }
  .admin-btn-secondary:hover { filter: brightness(0.95); }

  .admin-btn-danger { background: var(--danger); color: #fff; }
  .admin-btn-danger:hover { filter: brightness(0.95); }

  .admin-actions { display: flex; gap: .6rem; margin-top: 1rem; }

  .admin-status {
    background: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
    padding: .7rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
  }

  .admin-login {
    max-width: 420px; margin: 4rem auto; padding: 2rem;
    background: var(--panel); border: 1px solid var(--border); border-radius: 10px;
  }
  .admin-login h1 { text-align: center; margin-top: 0; }

  .products-head {
    display: flex; align-items: center; gap: .8rem; margin-bottom: .5rem;
  }
  .products-head h2 { margin: 0; flex: 1; }
  .products-head .search { max-width: 320px; }

  .rows { display: flex; flex-direction: column; gap: .5rem; }

  .row {
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }

  .row-head {
    width: 100%;
    padding: .8rem .9rem;
    background: var(--navy);
    color: #fff;
    display: flex; align-items: center; justify-content: space-between;
    cursor: pointer;
    text-align: left;
    user-select: none;
  }
  .row-head-main {
    display: flex; gap: .6rem; align-items: center; min-width: 0;
  }
  .row-head .code {
    background: rgba(255,255,255,.12);
    color: #e2e8f0;
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 12px;
  }
  .row-head .title {
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .row-head-side { display: flex; align-items: center; gap: .6rem; }
  .row-head .price { color: #c8e6c9; font-weight: 600; min-width: 90px; text-align: right; }
  .row-head .chev { opacity: .9; }
  .row-head:hover { background: var(--navy-hover); }

  /* Body stays mounted; we toggle height/visibility for smooth UX and stable focus */
  .row-body {
    display: grid;
    gap: .75rem;
    padding: 0 .9rem;
    border-top: 1px solid var(--border);
    grid-template-columns: repeat(12, 1fr);
    background: var(--bg-soft);

    max-height: 0;
    overflow: hidden;
    visibility: hidden;
    padding-top: 0;
    padding-bottom: 0;
    transition: max-height .25s ease, padding .2s ease, visibility .2s ease;
  }
  .row[data-open="true"] .row-body {
    padding-top: .9rem;
    padding-bottom: .9rem;
    max-height: 700px; /* large enough for fields */
    visibility: visible;
  }

  .field { display: flex; flex-direction: column; gap: .4rem; grid-column: span 6; }
  .field-full { grid-column: 1 / -1; }
  .field > span { font-size: 12px; color: var(--sub); }

  .muted { color: var(--sub); padding: .4rem; }

  /* Quantity discounts grid */
  .qd-grid {
    display: grid;
    gap: .75rem;
    grid-template-columns: repeat(12, 1fr);
    margin-top: .5rem;
  }
  .qd-grid .field { grid-column: span 4; }

  @media (max-width: 800px) {
    .row-body { grid-template-columns: repeat(6, 1fr); }
    .field { grid-column: span 6; }

    .qd-grid { grid-template-columns: repeat(6, 1fr); }
    .qd-grid .field { grid-column: span 6; }
  }
`;
