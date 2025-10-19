import React, { useLayoutEffect } from "react";

export default function TermsOfServicePage() {
  useLayoutEffect(() => {
    // ensure we start at the top when opening a product
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="page">
      <div className="container-narrow">
        <section className="hero-card">
          <h1 style={{ margin: "0 0 8px 0" }}>Terms of Service</h1>
          <p style={{ color: "var(--sub)", margin: 0 }}>
            Last Updated: October 2025
          </p>
        </section>

        <section className="section">
          <div className="section-card">
            <h2>1. Acceptance of Terms</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              By accessing or using Gurnee Peptides' services, you agree to be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not use our services.
            </p>

            <h2 style={{ marginTop: "24px" }}>2. Research Use Only</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              All products sold by Gurnee Peptides are intended strictly for
              laboratory research purposes only. Our products are NOT:
            </p>
            <ul style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              <li>Intended for human consumption or use</li>
              <li>Intended for veterinary use</li>
              <li>Intended to diagnose, treat, cure, or prevent any disease</li>
              <li>Approved by FDA for human or animal use</li>
            </ul>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              By purchasing from us, you acknowledge and agree that you will use
              products solely for research purposes in a qualified laboratory
              setting.
            </p>

            <h2 style={{ marginTop: "24px" }}>3. Age Requirement</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              You must be at least 18 years of age to purchase products from
              Gurnee Peptides. By placing an order, you represent that you meet
              this age requirement.
            </p>

            <h2 style={{ marginTop: "24px" }}>4. Product Information</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              We strive to provide accurate product descriptions,
              specifications, and pricing. However, we do not warrant that
              product descriptions or other content is accurate, complete, or
              error-free. We reserve the right to correct errors and update
              information at any time.
            </p>

            <h2 style={{ marginTop: "24px" }}>5. Orders and Payment</h2>
            <ul style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              <li>All orders are subject to acceptance and availability</li>
              <li>We reserve the right to refuse or cancel any order</li>
              <li>Prices are subject to change without notice</li>
              <li>Payment must be received before order fulfillment</li>
              <li>All sales are final - no returns or refunds</li>
            </ul>

            <h2 style={{ marginTop: "24px" }}>6. Shipping and Delivery</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              We offer same-day shipping on orders confirmed before 3PM CT.
              Shipping times are estimates and not guaranteed. We are not
              responsible for delays caused by carriers or circumstances beyond
              our control.
            </p>

            <h2 style={{ marginTop: "24px" }}>7. Returns and Refunds</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              Due to the nature of research peptides and regulatory
              requirements, all sales are final. We do not accept returns or
              provide refunds except in cases of shipping errors or defective
              products. Claims must be made within 48 hours of delivery.
            </p>

            <h2 style={{ marginTop: "24px" }}>
              8. Product Quality and Testing
            </h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              We provide third-party Certificates of Analysis (COAs) for our
              products. While we ensure quality control, we make no warranties
              regarding the suitability of products for any particular research
              application.
            </p>

            <h2 style={{ marginTop: "24px" }}>9. Limitation of Liability</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              To the maximum extent permitted by law, Gurnee Peptides shall not
              be liable for any indirect, incidental, special, consequential, or
              punitive damages, including but not limited to loss of profits,
              data, or research results.
            </p>

            <h2 style={{ marginTop: "24px" }}>10. Intellectual Property</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              All content on this website, including text, graphics, logos, and
              images, is the property of Gurnee Peptides and protected by
              copyright laws. You may not reproduce or distribute any content
              without written permission.
            </p>

            <h2 style={{ marginTop: "24px" }}>11. Compliance with Laws</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              You agree to comply with all applicable local, state, federal, and
              international laws and regulations regarding the purchase,
              storage, and use of research peptides. You are solely responsible
              for ensuring your activities comply with all applicable laws.
            </p>

            <h2 style={{ marginTop: "24px" }}>12. Prohibited Uses</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              You may not use our products or website to:
            </p>
            <ul style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              <li>Violate any laws or regulations</li>
              <li>Engage in human or animal consumption</li>
              <li>Resell products without authorization</li>
              <li>Misrepresent the intended use of products</li>
              <li>Infringe on intellectual property rights</li>
            </ul>

            <h2 style={{ marginTop: "24px" }}>13. Changes to Terms</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              We reserve the right to modify these Terms of Service at any time.
              Changes will be effective immediately upon posting to this page.
              Your continued use of our services constitutes acceptance of the
              modified terms.
            </p>

            <h2 style={{ marginTop: "24px" }}>14. Governing Law</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              These Terms of Service shall be governed by and construed in
              accordance with the laws of the United States and the State of
              Illinois, without regard to conflict of law principles.
            </p>

            <h2 style={{ marginTop: "24px" }}>15. Contact Information</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              For questions about these Terms of Service, please contact us:
            </p>
            <ul style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              <li>
                Via Messenger:{" "}
                <a
                  href="https://m.me/61580797282365"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent)" }}
                >
                  m.me/gurneepeptides
                </a>
              </li>
              <li>
                Via Email:{" "}
                <a
                  href="mailto:gurneepeptides@gmail.com"
                  style={{ color: "var(--accent)" }}
                >
                  gurneepeptides@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="hero-disc">
            <strong>Research Use Only:</strong> All products are intended for
            laboratory research purposes only. Not for human or veterinary use.
            Not intended to diagnose, treat, cure, or prevent any disease.
          </div>
        </section>
      </div>
    </div>
  );
}
