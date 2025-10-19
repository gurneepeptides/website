import React from "react";

export default function FAQPage() {
  const faqs = [
    {
      question: "What are peptides?",
      answer:
        "Peptides are short chains of amino acids that serve as building blocks of proteins. Research peptides are synthesized for laboratory and research purposes only.",
    },
    {
      question: "Are these products for human consumption?",
      answer:
        "No. All products are strictly for research use only and are not intended for human consumption, medical use, or to diagnose, treat, cure, or prevent any disease.",
    },
    {
      question: "How should I store peptides?",
      answer:
        "Lyophilized (freeze-dried) peptides should be stored in a freezer at -20°C or colder. Once reconstituted, they should be stored in a refrigerator at 2-8°C and used within the recommended timeframe.",
    },
    {
      question: "Do you provide Certificates of Analysis (COA)?",
      answer:
        "Yes, we provide third-party laboratory testing certificates of analysis for our peptides. These documents verify purity and composition.",
    },
    {
      question: "What is your shipping policy?",
      answer:
        "We offer same-day shipping on orders confirmed before 3PM CT. All orders are shipped via tracked courier services to ensure safe delivery.",
    },
    {
      question: "How do I place an order?",
      answer:
        "Orders are processed through Facebook Messenger or email. Simply message us with the product(s) you're interested in, and we'll guide you through the ordering process.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "Payment methods will be discussed during the order process via Messenger or email. We work to accommodate various secure payment options.",
    },
    {
      question: "Can I return or exchange products?",
      answer:
        "Due to the nature of research peptides and regulatory requirements, all sales are final. Please ensure you're ordering the correct product before confirming your purchase.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we primarily ship within the United States. For international inquiries, please contact us via Messenger to discuss options.",
    },
    {
      question: "How can I verify product authenticity?",
      answer:
        "Each product comes with proper labeling and documentation. We provide COAs from accredited third-party laboratories. You can verify batch numbers and testing results upon request.",
    },
  ];

  return (
    <div className="page">
      <div className="container-narrow">
        <section className="hero-card">
          <h1 style={{ margin: "0 0 8px 0" }}>Frequently Asked Questions</h1>
          <p style={{ color: "var(--sub)", margin: 0 }}>
            Find answers to common questions about our research peptides,
            ordering process, and policies.
          </p>
        </section>

        <section className="section">
          <div className="faq">
            {faqs.map((faq, index) => (
              <details key={index} className="faq-item">
                <summary>{faq.question}</summary>
                <div className="answer">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-card">
            <h3>Still have questions?</h3>
            <p style={{ color: "var(--sub)", marginBottom: "12px" }}>
              Contact us via Facebook Messenger or email for personalized
              assistance.
            </p>
            <a
              href="https://m.me/61580797282365"
              target="_blank"
              rel="noopener noreferrer"
              className="purchase-btn"
              style={{ display: "inline-block", textDecoration: "none" }}
            >
              Message Us on Messenger
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
