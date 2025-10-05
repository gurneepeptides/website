import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../products.json";
import { normalizeCatalog } from "../catalog.js";

const Placeholder = "/placeholder.svg";

function resolveImg(src) {
  if (!src) return Placeholder;
  if (/^https?:\/\//i.test(src)) return src; // external URL
  if (src.startsWith("/")) return src;       // already root-relative
  return `/${src}`;                          // make root-relative
}

export default function ProductPage() {
  const { id } = useParams();

  // normalize once
  const normalized = useMemo(() => normalizeCatalog(products), []);
  const product = useMemo(() => normalized.find((p) => p.id === id), [id, normalized]);

  if (!product) {
    return (
      <div className="page container-narrow">
        <h2>Product not found</h2>
        <p style={{ color: "var(--sub)" }}>
          The item you’re looking for isn’t in the catalog.
        </p>
        <Link to="/" style={{ color: "var(--accent)" }}>← Back to catalog</Link>
      </div>
    );
  }

  const options = product.options.length > 0 ? product.options : [];

  const [selected, setSelected] = useState(options[0]?.id);

  return (
    <div className="page container-narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link to="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Back
        </Link>
        <span style={{ color: "var(--sub)", fontSize: 12 }}>
          {product.category ? `• ${product.category}` : ""}
        </span>
      </div>

      {/* HERO */}
      <section className="hero-card">
        <div className="hero-inner">
          <div className="hero-image">
            <img src={resolveImg(product.image)} alt={product.name} />
          </div>

          <div>
            <h1 className="hero-title">{product.name}</h1>
            <div className="hero-meta">
              {[product.dosage, product.volume].filter(Boolean).join(" • ") ||
                "Specs forthcoming"}
            </div>

            <p className="hero-desc">
              Add a short, elegant description here about research context, form, and storage.
              Keep it simple and reassuring. You can edit this per product later.
            </p>

            <div className="hero-disc">
              ⚠️ For Research Use Only • Not for Human Use • No medical benefit suggested.
            </div>
          </div>
        </div>
      </section>

      {/* OPTIONS */}
      <section style={{ marginTop: 16 }}>
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
                <div className="thumb">
                  <img src={resolveImg(product.image)} alt="" />
                </div>

                <div>
                  <div className="title">
                    {opt.label}
                    {opt.badge && (
                      <span
                        className={`badge ${
                          opt.badge.includes("BEST") ? "blue" : "gray"
                        }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <div className="sub">{product.name}</div>
                </div>

                <div className="right">
                  <div className="price">
                    {typeof opt.price === "number"
                      ? `$${opt.price.toFixed(2)}`
                      : "—"}
                  </div>
                  {typeof opt.compareAt === "number" && opt.compareAt > opt.price && (
                    <div className="compare">${opt.compareAt.toFixed(2)}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PURCHASE INSTRUCTIONS */}
      <section className="section">
        <div className="purchase-box">
          <h3>{product.purchase.headline}</h3>
          <a
            href={product.purchase.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="purchase-btn"
          >
            Message Us to Purchase
          </a>
          <div className="purchase-note">{product.purchase.note}</div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <h3 style={{ marginBottom: 8 }}>FAQs</h3>
        <div className="faq">
          {product.faq.map((item, idx) => (
            <details key={idx} className="faq-item">
              <summary>{item.q}</summary>
              <div className="answer">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-row">
        <button type="button" disabled className="cta-primary">
          Catalog Only (No Checkout)
        </button>
        <span className="cta-note">
          Selected: {options.find((o) => o.id === selected)?.label}
        </span>
      </section>
    </div>
  );
}
