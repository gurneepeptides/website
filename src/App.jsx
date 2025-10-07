import React from "react";
import { Routes, Route } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";

function TopBar() {
  return (
    <div className="topbar">
      🚚 <strong>Same-Day Shipping</strong> on orders confirmed before 3PM CT •
      For Research Use Only <br/> SITE IS UNDER CONSTRUCTION 
    </div>
  );
}



function MessengerButton() {
  return (
    <a
      href="https://m.me/61580797282365" // ✅ Messenger link
      target="_blank"
      rel="noopener noreferrer"
      className="messenger-btn"
      title="Message us on Messenger"
    >
      {/* Messenger SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
      >
        <path d="M18 0C8.06 0 0 7.56 0 16.89c0 5.32 2.71 10.05 6.93 13.08V36l6.35-3.48c1.53.42 3.17.65 4.87.65 9.94 0 18-7.56 18-16.89S27.94 0 18 0zm1.8 22.82l-4.84-5.15-9.58 5.15 10.47-11.16 4.91 5.15 9.52-5.15-10.48 11.16z"/>
      </svg>
    </a>
  );
}

export default function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <MessengerButton />

    </>
  );
}
