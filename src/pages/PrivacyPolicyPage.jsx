import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="page">
      <div className="container-narrow">
        <section className="hero-card">
          <h1 style={{ margin: "0 0 8px 0" }}>Privacy Policy</h1>
          <p style={{ color: "var(--sub)", margin: 0 }}>
            Last Updated: January 2025
          </p>
        </section>

        <section className="section">
          <div className="section-card">
            <h2>1. Information We Collect</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              We collect information you provide directly to us when you place
              orders, contact us, or interact with our services. This may
              include:
            </p>
            <ul style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              <li>Name and contact information (email, phone, address)</li>
              <li>Order history and preferences</li>
              <li>Communication history with our team</li>
              <li>Payment information (processed securely)</li>
            </ul>

            <h2 style={{ marginTop: "24px" }}>2. How We Use Your Information</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              We use the information we collect to:
            </p>
            <ul style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about products and services</li>
              <li>Improve our products and customer service</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and maintain security</li>
            </ul>

            <h2 style={{ marginTop: "24px" }}>3. Information Sharing</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              We do not sell or rent your personal information to third parties.
              We may share your information only in the following circumstances:
            </p>
            <ul style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              <li>With shipping carriers to fulfill orders</li>
              <li>With payment processors to complete transactions</li>
              <li>When required by law or legal process</li>
              <li>To protect our rights, property, or safety</li>
            </ul>

            <h2 style={{ marginTop: "24px" }}>4. Data Security</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              We implement appropriate security measures to protect your
              personal information from unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>

            <h2 style={{ marginTop: "24px" }}>5. Cookies and Tracking</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              We may use cookies and similar tracking technologies to enhance
              your browsing experience, analyze site traffic, and understand
              user preferences. You can control cookies through your browser
              settings.
            </p>

            <h2 style={{ marginTop: "24px" }}>6. Your Rights</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              You have the right to:
            </p>
            <ul style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your personal data</li>
            </ul>

            <h2 style={{ marginTop: "24px" }}>7. Children's Privacy</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              Our services are not intended for individuals under 18 years of
              age. We do not knowingly collect personal information from
              children.
            </p>

            <h2 style={{ marginTop: "24px" }}>8. Changes to This Policy</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              with an updated "Last Updated" date.
            </p>

            <h2 style={{ marginTop: "24px" }}>9. Contact Us</h2>
            <p style={{ color: "var(--sub)", lineHeight: "1.6" }}>
              If you have questions about this privacy policy or our data
              practices, please contact us:
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
                  href="mailto:contact@gurneepeptides.com"
                  style={{ color: "var(--accent)" }}
                >
                  contact@gurneepeptides.com
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="hero-disc">
            <strong>Research Use Only:</strong> All products are intended for
            laboratory research purposes only. Not for human or veterinary use.
          </div>
        </section>
      </div>
    </div>
  );
}
