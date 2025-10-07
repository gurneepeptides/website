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

export default function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </>
  );
}
