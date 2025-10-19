import React from "react";

export default function ContactPage() {
  return (
    <div className="page">
      <div className="container-narrow">
        <section className="hero-card">
          <h1 style={{ margin: "0 0 8px 0" }}>Contact Us</h1>
          <p style={{ color: "var(--sub)", margin: 0 }}>
            Get in touch with our team for orders, inquiries, or support.
          </p>
        </section>

        <section className="section">
          <div className="section-card">
            <h3 style={{ marginTop: 0 }}>Preferred Contact Method</h3>
            <div
              style={{
                background: "linear-gradient(135deg,#0e1a2e,#12213a)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "#0084ff",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 36 36"
                    style={{ width: "28px", height: "28px", fill: "white" }}
                  >
                    <path d="M18 0C8.06 0 0 7.56 0 16.89c0 5.32 2.71 10.05 6.93 13.08V36l6.35-3.48c1.53.42 3.17.65 4.87.65 9.94 0 18-7.56 18-16.89S27.94 0 18 0zm1.8 22.82l-4.84-5.15-9.58 5.15 10.47-11.16 4.91 5.15 9.52-5.15-10.48 11.16z" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px 0" }}>Facebook Messenger</h4>
                  <p style={{ margin: 0, color: "var(--sub)", fontSize: "13px" }}>
                    Fast responses • Order tracking • Real-time support
                  </p>
                </div>
              </div>
              <a
                href="https://m.me/61580797282365"
                target="_blank"
                rel="noopener noreferrer"
                className="purchase-btn"
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Message Us on Messenger
              </a>
            </div>

            <h3>Alternative Contact</h3>
            <div
              style={{
                background: "rgba(15,26,43,.65)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "20px",
                  }}
                >
                  ✉
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px 0" }}>Email</h4>
                  <a
                    href="mailto:contact@gurneepeptides.com"
                    style={{
                      color: "var(--accent)",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    contact@gurneepeptides.com
                  </a>
                </div>
              </div>
              <p style={{ margin: "8px 0 0 0", color: "var(--sub)", fontSize: "13px" }}>
                Response time: Within 24 hours
              </p>
            </div>

            <h3>Business Hours</h3>
            <div
              style={{
                background: "rgba(15,26,43,.65)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div style={{ display: "grid", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Monday - Friday</span>
                  <span style={{ color: "var(--sub)" }}>9:00 AM - 6:00 PM CT</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Saturday</span>
                  <span style={{ color: "var(--sub)" }}>10:00 AM - 4:00 PM CT</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Sunday</span>
                  <span style={{ color: "var(--sub)" }}>Closed</span>
                </div>
              </div>
              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px dashed var(--border)",
                  color: "var(--sub)",
                  fontSize: "13px",
                }}
              >
                Same-day shipping on orders confirmed before 3:00 PM CT
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div
            className="section-card"
            style={{ background: "linear-gradient(135deg,#0e1a2e,#12213a)" }}
          >
            <h3 style={{ marginTop: 0 }}>What to Include in Your Message</h3>
            <div className="steps">
              <div className="step">
                <div>
                  <strong>Product Interest</strong>
                  <p style={{ color: "var(--sub)", margin: "4px 0 0 0" }}>
                    Let us know which product(s) you're interested in and quantities
                  </p>
                </div>
              </div>
              <div className="step">
                <div>
                  <strong>Shipping Information</strong>
                  <p style={{ color: "var(--sub)", margin: "4px 0 0 0" }}>
                    Provide your shipping address and preferred delivery method
                  </p>
                </div>
              </div>
              <div className="step">
                <div>
                  <strong>Questions</strong>
                  <p style={{ color: "var(--sub)", margin: "4px 0 0 0" }}>
                    Ask any questions about products, testing, or documentation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="hero-disc">
            <strong>Research Use Only:</strong> All products are intended for
            laboratory research purposes only. Not for human or veterinary use. Not
            intended to diagnose, treat, cure, or prevent any disease.
          </div>
        </section>
      </div>
    </div>
  );
}
