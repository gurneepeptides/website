import React from "react";

export default function ReviewsPage() {
  const reviews = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Research Laboratory Director",
      rating: 5,
      text: "Outstanding quality and consistency. We've been using Gurnee Peptides for our research projects for over a year. The COAs are thorough and the purity levels consistently meet specifications.",
      date: "January 2025",
    },
    {
      name: "Michael Chen",
      role: "Independent Researcher",
      rating: 5,
      text: "Fast shipping and excellent communication. Products arrive well-packaged and properly stored. The team is responsive and knowledgeable about their products.",
      date: "December 2024",
    },
    {
      name: "Dr. Jennifer Rodriguez",
      role: "Biochemistry Lab",
      rating: 5,
      text: "Professional service from start to finish. Same-day shipping is a game-changer for our research timelines. Highly recommend for serious researchers.",
      date: "November 2024",
    },
    {
      name: "David Thompson",
      role: "Research Facility Manager",
      rating: 5,
      text: "Reliable supplier with transparent testing documentation. Every batch comes with proper COAs and the quality is consistent across orders.",
      date: "October 2024",
    },
    {
      name: "Dr. Amanda Foster",
      role: "Clinical Research Associate",
      rating: 5,
      text: "Best peptide supplier I've worked with. Clear communication, quick responses via Messenger, and products that meet our research standards.",
      date: "September 2024",
    },
    {
      name: "Robert Kim",
      role: "Laboratory Technician",
      rating: 5,
      text: "Great selection and fair pricing. The ordering process through Messenger is surprisingly efficient and the team is very helpful with product selection.",
      date: "August 2024",
    },
  ];

  return (
    <div className="page">
      <div className="container-narrow">
        <section className="hero-card">
          <h1 style={{ margin: "0 0 8px 0" }}>Customer Reviews</h1>
          <p style={{ color: "var(--sub)", margin: 0 }}>
            See what researchers are saying about our products and service.
          </p>
        </section>

        <section className="section">
          <div style={{ display: "grid", gap: "14px" }}>
            {reviews.map((review, index) => (
              <div key={index} className="section-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>
                      {review.name}
                    </h3>
                    <div style={{ color: "var(--sub)", fontSize: "13px" }}>
                      {review.role}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[...Array(review.rating)].map((_, i) => (
                      <span
                        key={i}
                        style={{ color: "#27a7b4", fontSize: "16px" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p
                  style={{
                    color: "var(--ink)",
                    lineHeight: "1.5",
                    margin: "0 0 8px 0",
                  }}
                >
                  "{review.text}"
                </p>
                <div style={{ color: "var(--sub)", fontSize: "12px" }}>
                  {review.date}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div
            className="section-card"
            style={{
              textAlign: "center",
              background: "linear-gradient(135deg,#0e1a2e,#12213a)",
            }}
          >
            <h3>Share Your Experience</h3>
            <p style={{ color: "var(--sub)", marginBottom: "12px" }}>
              We value feedback from our research community. Let us know about
              your experience with our products.
            </p>
            <a
              href="https://m.me/61580797282365"
              target="_blank"
              rel="noopener noreferrer"
              className="purchase-btn"
              style={{ display: "inline-block", textDecoration: "none" }}
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
