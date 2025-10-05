import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../products.json";

const Placeholder = "/placeholder.svg";



function resolveImg(src) {
  if (!src) return Placeholder;
  // external URL? leave it
  if (/^https?:\/\//i.test(src)) return src;
  // already root-relative? keep it
  if (src.startsWith("/")) return src;
  // make it root-relative (so it works on /product/:id too)
  return `/${src}`;
}

export default function ProductPage() {
  const { id } = useParams();
  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  if (!product) {
    return (
      <div className="page container-narrow">
        <h2>Product not found</h2>
        <p style={{ color: "var(--sub)" }}>The item you’re looking for isn’t in the catalog.</p>
        <Link to="/" style={{ color: "var(--accent)" }}>← Back to catalog</Link>
      </div>
    );
  }

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
    <div className="page container-narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link to="/" style={{ color: "var(--accent)", textDecoration: "none" }}>← Back</Link>
        <span style={{ color: "var(--sub)", fontSize: 12 }}>
          {product.category ? `• ${product.category}` : ""}
        </span>
      </div>

      {/* HERO (mobile stacks, desktop 2-column) */}
      <section className="hero-card">
        <div className="hero-inner">
          <div className="hero-image">
            <img src={resolveImg(product.image) || Placeholder} alt={product.name} />
          </div>

          <div>
            <h1 className="hero-title">{product.name}</h1>
            <div className="hero-meta">
              {[product.dosage, product.volume].filter(Boolean).join(" • ") || "Specs forthcoming"}
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
                  <img src={resolveImg(product.image) || Placeholder} alt="" />
                </div>

                <div>
                  <div className="title">
                    {opt.label}
                    {opt.badge && (
                      <span className={`badge ${opt.badge.includes("BEST") ? "blue" : "gray"}`}>
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <div className="sub">{product.name}</div>
                </div>

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


    {/* === PURCHASE INSTRUCTIONS (if present) === */}
{/* === PURCHASE INSTRUCTIONS === */}
<section className="section">
  <div className="purchase-box">
    <h3>{product?.purchase?.headline || "How to Purchase"}</h3>

    <a
      href={product?.purchase?.facebook || "https://facebook.com/gurneepeptides"}
      target="_blank"
      rel="noopener noreferrer"
      className="purchase-btn"
    >
      Message Us to Purchase
    </a>

    <div className="purchase-note">
      {product?.purchase?.note ||
        "You can also email us at gurneepeptides@gmail.com"}
    </div>
  </div>
</section>

      {/* === FAQ (if present) === */}
      <section className="section">
        <h3 style={{ marginBottom: 8 }}>FAQs</h3>
        <div className="faq">
          {(Array.isArray(product.faq) && product.faq.length > 0
            ? product.faq
            : [
                { q: "Is this product available?", a: "Most items are in stock; we’ll confirm by email." },
                { q: "How do I place an order?", a: "Email us the product ID and quantity; we’ll reply with next steps." },
                { q: "Do you offer bulk discounts?", a: "Yes—tell us your expected quantities for a quote." }
              ]
          ).map((item, idx) => (
            <details key={idx} className="faq-item">
              <summary>{item.q}</summary>
              <div className="answer">{item.a}</div>
            </details>
          ))}
        </div>
      </section>


      {/* CTA (informational only) */}
      <section className="cta-row">
        <button type="button" disabled className="cta-primary">Catalog Only (No Checkout)</button>
        <span className="cta-note">
          Selected: {options.find((o) => o.id === selected)?.label}
        </span>
      </section>
    </div>
  );
}
