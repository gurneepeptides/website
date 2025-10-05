import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../products.json";

const Placeholder = "/placeholder.svg";

/**
 * A product can optionally include an "options" array in products.json, e.g.:
 * "options": [
 *   { "id":"o1","label":"3 Pack","price":35.97,"compareAt":75.00,"badge":"BEST VALUE" },
 *   { "id":"o2","label":"2 Pack","price":27.18,"compareAt":50.00,"badge":"MOST POPULAR" },
 *   { "id":"o3","label":"1 Pack","price":15.99 }
 * ]
 */

export default function ProductPage() {
  const { id } = useParams();
  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  // graceful 404
  if (!product) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
        <h2>Product not found</h2>
        <p style={{ color: "var(--sub)" }}>
          The item you’re looking for doesn’t exist in the catalog.
        </p>
        <Link to="/" style={{ color: "var(--accent)" }}>← Back to catalog</Link>
      </div>
    );
  }

  // Use options from JSON or fallback demo options
  const fallbackOptions = [
    { id: "opt-3", label: "3 Pack", price: 35.97, compareAt: 75.0, badge: "BEST VALUE" },
    { id: "opt-2", label: "2 Pack", price: 27.18, compareAt: 50.0, badge: "MOST POPULAR" },
    { id: "opt-1", label: "1 Pack", price: 15.99 }
  ];
  const options = Array.isArray(product.options) && product.options.length > 0
    ? product.options
    : fallbackOptions;

  const [selected, setSelected] = useState(options[0]?.id);

  return (
    <div style={{ maxWidth: "980px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link to="/" style={{ color: "var(--accent)", textDecoration: "none" }}>← Back</Link>
        <span style={{ color: "var(--sub)", fontSize: 12 }}>
          {product.category ? `• ${product.category}` : ""}
        </span>
      </div>

      {/* Top hero block */}
      <section
        style={{
          marginTop: 16,
          background: "linear-gradient(135deg,#0e1a2e,#12213a)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 20,
          display: "grid",
          gap: 20,
          gridTemplateColumns: "minmax(240px, 320px) 1fr"
        }}
      >
        <div style={{ display: "grid", placeItems: "center" }}>
          <img
            src={product.image || Placeholder}
            alt={product.name}
            style={{ width: "85%", maxWidth: 360, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}
          />
        </div>

        <div>
          <h1 style={{ margin: "0 0 8px 0", lineHeight: 1.2 }}>{product.name}</h1>
          <div style={{ color: "var(--sub)" }}>
            {[product.dosage, product.volume].filter(Boolean).join(" • ") || "Specs forthcoming"}
          </div>

          <p style={{ marginTop: 14, fontSize: 15 }}>
            Add a short, elegant description here about research context, form, and storage.
            Keep it simple and reassuring. You can edit this copy later per product.
          </p>

          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 12,
              background: "#13223a",
              color: "#c7d2fe",
              fontSize: 13
            }}
          >
            ⚠️ For Research Use Only • Not for Human Use • No medical benefit suggested.
          </div>
        </div>
      </section>

      {/* Options section */}
      <section style={{ marginTop: 20 }}>
        <h3 style={{ margin: "0 0 8px 0" }}>1. Choose Your Quantity</h3>
        <div className="options">
          {options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <div
                key={opt.id}
                className={`option ${isSelected ? "selected" : ""}`}
                onClick={() => setSelected(opt.id)}
              >
                {/* left: thumb */}
                <div className="thumb">
                  <img src={product.image || Placeholder} alt="" />
                </div>

                {/* middle: labels */}
                <div>
                  <div className="title">
                    {opt.label}
                    {opt.badge && (
                      <span className={`badge ${opt.badge.includes("BEST") ? "blue" : "gray"}`}>
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <div className="sub">
                    {product.name}
                  </div>
                </div>

                {/* right: price */}
                <div className="right">
                  <div className="price">
                    {typeof opt.price === "number" ? `$${opt.price.toFixed(2)}` : "—"}
                  </div>
                  {typeof opt.compareAt === "number" && (
                    <div className="compare">${opt.compareAt.toFixed(2)}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Placeholder CTA row (no checkout, just UI) */}
      <section
        style={{
          marginTop: 20,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <button
          type="button"
          disabled
          title="Catalog only"
          style={{
            background: "var(--accent)",
            color: "#0b1220",
            border: "none",
            padding: "10px 16px",
            borderRadius: 12,
            fontWeight: 700,
            cursor: "not-allowed",
            opacity: .8
          }}
        >
          Catalog Only (No Checkout)
        </button>
        <span style={{ color: "var(--sub)", fontSize: 12 }}>
          Selected: {options.find(o => o.id === selected)?.label}
        </span>
      </section>
    </div>
  );
}
