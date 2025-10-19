import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Catalog" },
    { path: "/faq", label: "FAQ" },
    { path: "/reviews", label: "Reviews" },
    { path: "/contact", label: "Contact Us" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav className="navigation">
        <div className="nav-container">
          {/* Desktop Navigation */}
          <div className="nav-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "active" : ""}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div className="nav-overlay" onClick={() => setIsOpen(false)} />
          <div className="nav-drawer">
            <button
              className="nav-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
            <div className="nav-drawer-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-drawer-link ${
                    isActive(link.path) ? "active" : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
