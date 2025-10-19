import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-title">About Us</h3>
            <p className="footer-text">
              Gurnee Peptides provides high-quality research peptides with
              third-party testing and transparent COAs. We serve the research
              community with reliable products and professional service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <nav className="footer-links">
              <Link to="/" className="footer-link">
                Catalog
              </Link>
              <Link to="/faq" className="footer-link">
                FAQ
              </Link>
              <Link to="/reviews" className="footer-link">
                Reviews
              </Link>
              <Link to="/contact" className="footer-link">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3 className="footer-title">Legal</h3>
            <nav className="footer-links">
              <Link to="/privacy-policy" className="footer-link">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="footer-link">
                Terms of Service
              </Link>
            </nav>

            <h3 className="footer-title" style={{ marginTop: "20px" }}>
              Contact
            </h3>
            <nav className="footer-links">
              <a
                href="https://m.me/61580797282365"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Facebook Messenger
              </a>
              <a
                href="mailto:contact@gurneepeptides.com"
                className="footer-link"
              >
                Email Us
              </a>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Gurnee Peptides • For Research Use
            Only
          </p>
          <p className="footer-disclaimer">
            Not intended for human or veterinary use. Not intended to diagnose,
            treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}
