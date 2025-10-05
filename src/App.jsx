import React from "react";
import { Routes, Route } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
    </Routes>
  );
}
