import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import products from "../products.js";
import { normalizeCatalog } from "../catalog.js";

const Placeholder = "/placeholder.svg";

export default function CatalogPage() {
  const [q, setQ] = useState("");

  // Normalize once (e.g., fix image paths, defaults)
  const normalized = useMemo(() => normalizeCatalog(products), []);

  // Filter by search query
  const filtered = useMemo(() => {
    const v = q.trim().toLowerCase();
    if (!v) return normalized;
    return normalized.filter((p) => p.name.toLowerCase().includes(v));
  }, [q, normalized]);

  return (
    <div>
      {/* HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          backdropFilter: "blur(8px)",
          background: "rgba(11,18,32,0.9)",
          borderBottom: "1px solid var(--border)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/logo.png"
              alt="Gurnee Peptides"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                boxShadow: "0 4px 14px rgba(0,0,0,.35)",
              }}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: "18px" }}>Gurnee Peptides</h1>
              <small style={{ color: "var(--sub)" }}>
                Research Catalog • No Checkout
              </small>
            </div>
          </div>

          {/* Search bar */}
          <div className="search" style={{ marginLeft: "auto" }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name (e.g. Retatrutide)"
            />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="catalog-page">
        {/* Hero */}
        <section
          style={{
            background: "linear-gradient(135deg,#0e1a2e,#12213a)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ margin: "0 0 6px 0" }}>Catalog</h2>
          <p style={{ color: "var(--sub)", fontSize: "14px" }}>
            For Research Use Only • Not for Human Use • No medical benefit
            suggested.
          </p>
        </section>

        {/* Product Grid */}
        <section>
          <div className="catalog-grid">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article
                  className="card"
                  style={{
                    background: "var(--panel)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition:
                      "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
                  }}
                >
                  <div
                    className="imgwrap"
                    style={{
                      aspectRatio: "1/1",
                      display: "grid",
                      placeItems: "center",
                      background: "#101c31",
                    }}
                  >
                    <img
                      src={p.image || Placeholder}
                      alt={p.name}
                      style={{ width: "75%", height: "75%", objectFit: "contain" }}
                    />
                  </div>
                  <div style={{ padding: "12px" }}>
                    <h3 style={{ margin: "0 0 4px 0", fontWeight: "600" }}>
                      {p.name}
                    </h3>
                    <div style={{ color: "var(--sub)", fontSize: "12px" }}>
                      {[p.dosage, p.volume].filter(Boolean).join(" • ") || "Specs forthcoming"}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <div style={{ color: "var(--sub)", fontSize: "12px" }}>
                        {p.price ? `$${p.price}` : "Price on request"}
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {(p.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="chip"
                            style={{
                              fontSize: "10px",
                              padding: "3px 8px",
                              borderRadius: "999px",
                              background: "#13223a",
                              color: "#c7d2fe",
                              border: "1px solid #21355a",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ color: "var(--sub)", marginTop: "12px" }}>
              No products match “{q}”.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
