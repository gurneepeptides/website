import React, { useMemo, useState, useRef, useLayoutEffect, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../products.js";
import { normalizeCatalog } from "../catalog.js";

const Placeholder = "/placeholder.svg";

/** =========================
 *  GLOBAL PROMO CONFIG
 *  ========================= */
const PROMO = {
  enabled: true,                 // turn the global promo on/off
  type: "B2G1",                  // "B2G1" | "BOGO" | null
  isEligible: (p) => true,       // e.g., (p) => p.category === "Metabolic"
};

const PROMO_STRINGS = {
  B2G1: "Buy 2, Get 1 FREE — Auto-applied",
  BOGO: "Buy 1, Get 1 FREE — Auto-applied",
};

/** =========================
 *  HELPERS
 *  ========================= */
function resolveImg(src) {
  if (!src) return Placeholder;
  if (/^https?:\/\//i.test(src)) return src; // external URL
  if (src.startsWith("/")) return src;       // already root-relative
  return `/${src}`;                          // make root-relative
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function money(n) {
  return typeof n === "number" && !Number.isNaN(n) ? `$${n.toFixed(2)}` : "—";
}

// Infer pack quantity from explicit qty or from "X Pack" label
function inferQty(opt) {
  if (typeof opt.qty === "number") return opt.qty;
  const m = String(opt.label || "").match(/(\d+)\s*pack/i);
  return m ? parseInt(m[1], 10) : 1;
}

// Determine “unit” price for savings math (prefer a 1-Pack option)
function getUnitPriceFromOptionsOrProduct(options, product) {
  const one = options.find((o) => inferQty(o) === 1 && typeof o.price === "number");
  if (one) return one.price;
  if (typeof product.price === "number") return product.price;
  return undefined;
}

// Compute bonus free units per promo type
function computeBonus(qty, promoType) {
  if (promoType === "B2G1") return qty >= 2 ? 1 : 0;
  if (promoType === "BOGO") return qty >= 1 ? qty : 0;
  return 0;
}

/** =========================
 *  PAGE
 *  ========================= */
export default function ProductPage() {
  const { id } = useParams();

  // normalize once
  const normalized = useMemo(() => normalizeCatalog(products), []);
  const product = useMemo(() => normalized.find((p) => p.id === id), [id, normalized]);

  useLayoutEffect(() => {
    // ensure we start at the top when opening a product
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

  if (!product) {
    return (
      <div className="page container-narrow">
        <h2>Product not found</h2>
        <p style={{ color: "var(--sub)" }}>
          The item you’re looking for isn’t in the catalog.
        </p>
        <Link to="/" style={{ color: "var(--accent)" }}>
          ← Back to catalog
        </Link>
      </div>
    );
  }

  // ----- IMAGES / CAROUSEL -----
  const imgs = (
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || Placeholder]
  )
    .filter(Boolean)
    .map(resolveImg);

  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const startX = useRef(0);
  const deltaX = useRef(0);
  const touching = useRef(false);

  function goTo(i) {
    setIndex((prev) => clamp(i, 0, imgs.length - 1));
  }
  function prev() { goTo(index - 1); }
  function next() { goTo(index + 1); }

  function onTouchStart(e) {
    touching.current = true;
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  }
  function onTouchMove(e) {
    if (!touching.current) return;
    deltaX.current = e.touches[0].clientX - startX.current;
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translateX(calc(${-index * 100}% + ${deltaX.current}px))`;
    }
  }
  function onTouchEnd() {
    touching.current = false;
    const threshold = 50;
    if (Math.abs(deltaX.current) > threshold) {
      if (deltaX.current < 0) next();
      else prev();
    }
    if (trackRef.current) {
      trackRef.current.style.transition = "transform .25s ease";
      trackRef.current.style.transform = `translateX(${-index * 100}%)`;
    }
    deltaX.current = 0;
  }

  function onKeyDown(e) {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }

  // ----- OPTIONS -----
  const options =
    Array.isArray(product.options) && product.options.length > 0
      ? product.options
      : [];

  const unitPrice = useMemo(
    () => getUnitPriceFromOptionsOrProduct(options, product),
    [options, product]
  );

  const [selected, setSelected] = useState(options[0]?.id);
  useEffect(() => {
    if (!options.find((o) => o.id === selected)) {
      setSelected(options[0]?.id);
    }
  }, [options, selected]);

  // ----- PURCHASE fallbacks -----
  const purchaseHeadline = product.purchase?.headline || "How to Purchase";
  const purchaseFacebook =
    product.purchase?.facebook || "https://facebook.com/gurneepeptides";
  const purchaseNote =
    product.purchase?.note ||
    "Message us on Facebook to purchase. If unavailable, email us directly at gurneepeptides@gmail.com";

  // ----- FAQ fallback -----
  const faqs = Array.isArray(product.faq) ? product.faq : [];

  return (
    <div
      className="page container-narrow"
      onKeyDown={onKeyDown}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link to="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Back
        </Link>
        <span style={{ color: "var(--sub)", fontSize: 12 }}>
          {product.category ? `• ${product.category}` : ""}
        </span>
      </div>

      {/* HERO (with carousel) */}
      <section className="hero-card">
        <div className="hero-inner">
          <div>
            <div
              className="carousel"
              aria-roledescription="carousel"
              aria-label={`${product.name} images`}
            >
              <div
                ref={trackRef}
                className="carousel-track"
                style={{ transform: `translateX(${-index * 100}%)` }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {imgs.map((src, i) => (
                  <div className="carousel-slide" key={i} aria-hidden={i !== index}>
                    <img src={src} alt={`${product.name} ${i + 1}`} />
                  </div>
                ))}
              </div>

              {imgs.length > 1 && (
                <>
                  <button
                    className="carousel-arrow left"
                    type="button"
                    onClick={prev}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    className="carousel-arrow right"
                    type="button"
                    onClick={next}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>

          <div>
            <h1 className="hero-title">{product.name}</h1>
            <div className="hero-meta">
              {[product.dosage, product.volume].filter(Boolean).join(" • ") ||
                "Specs forthcoming"}
            </div>

            <p className="hero-desc">{product.description}</p>

            {PROMO.enabled && PROMO.type && PROMO.isEligible(product) && (
              <div className="hero-promo" style={{ marginTop: 8, color: "var(--accent)" }}>
                🎃 {PROMO_STRINGS[PROMO.type]}
              </div>
            )}

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
            const qty = inferQty(opt);

            // Promo reflection: add FREE units, keep price the same
            let bonus = 0;
            if (PROMO.enabled && PROMO.type && PROMO.isEligible(product)) {
              bonus = computeBonus(qty, PROMO.type);
            }
            const totalUnits = qty + bonus;

            // Optional savings line (only if we can infer a unit price cleanly)
            let savingsText = "";
            if (unitPrice && bonus > 0 && typeof opt.price === "number") {
              const valueWithoutPromo = unitPrice * totalUnits;
              const savings = valueWithoutPromo - opt.price;
              if (savings > 0.009) {
                savingsText = ` • Save ${money(savings)}`;
              }
            }

            // Bonus phrase
            let bonusText = "";
            if (bonus > 0) {
              if (PROMO.type === "B2G1") {
                // e.g., Pay for 2 • Get 3
                bonusText = `• Pay for ${qty} • Get ${totalUnits}`;
              } else if (PROMO.type === "BOGO") {
                // e.g., Pay for 2 • Get 4
                bonusText = `• Pay for ${qty} • Get ${totalUnits}`;
              }
            }

            // Badge (keep existing if present)
            const badge =
              opt.badge ||
              (bonus > 0 ? (PROMO.type === "B2G1" ? "B2G1 FREE" : "BOGO") : null);

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
                    {badge && (
                      <span
                        className={`badge ${
                          String(badge).toUpperCase().includes("BEST") ? "blue" : "gray"
                        }`}
                        style={{ marginLeft: 8 }}
                      >
                        {badge}
                      </span>
                    )}
                  </div>
                  <div className="sub">
                    {product.name}
                    {bonus > 0 ? ` • Receive ${totalUnits} total ${totalUnits > 1 ? "vials" : "vial"}` : ""}
                    {bonusText ? ` ${bonusText}` : ""}
                    {savingsText}
                  </div>
                </div>

                <div className="right">
                  <div className="price">
                    {typeof opt.price === "number" ? money(opt.price) : "—"}
                  </div>
                  {typeof opt.compareAt === "number" &&
                    opt.compareAt > (opt.price ?? 0) && (
                      <div className="compare">{money(opt.compareAt)}</div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PURCHASE INSTRUCTIONS (full-width) */}
      <section className="section">
        <div className="purchase-box">
          <h3>{purchaseHeadline}</h3>
          <a
            href={purchaseFacebook}
            target="_blank"
            rel="noopener noreferrer"
            className="purchase-btn"
          >
            Message Us to Purchase
          </a>
          <div className="purchase-note">{purchaseNote}</div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <h3 style={{ marginBottom: 8 }}>FAQs</h3>
        <div className="faq">
          {faqs.map((item, idx) => (
            <details key={idx} className="faq-item">
              <summary>{item.q}</summary>
              <div className="answer">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-row">
        <a
          href={purchaseFacebook}
          target="_blank"
          rel="noopener noreferrer"
          className="purchase-btn"
          style={{ textDecoration: "none" }}
        >
          Message Us to Purchase
        </a>
        <span className="cta-note">
          Selected: {options.find((o) => o.id === selected)?.label || "—"}
        </span>
      </section>
    </div>
  );
}
