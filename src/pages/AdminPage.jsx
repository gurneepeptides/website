import React, { useState, useEffect } from "react";
import products from "../products";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [topBarMessage, setTopBarMessage] = useState("");
  const [productPrices, setProductPrices] = useState({});
  const [saveStatus, setSaveStatus] = useState("");

  // Default top bar message
  const defaultTopBarMessage = `🎃 Buy 2, Get 1 FREE — Halloween Sale Live! 
🚚 Same-Day Shipping on orders confirmed before 3PM CT • For Research Use Only 
⚙️ Site is undergoing changes`;

  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    // Load top bar message from localStorage
    const savedMessage = localStorage.getItem("topBarMessage");
    setTopBarMessage(savedMessage || defaultTopBarMessage);

    // Load product prices from localStorage
    const savedPrices = localStorage.getItem("productPrices");
    if (savedPrices) {
      setProductPrices(JSON.parse(savedPrices));
    } else {
      // Initialize with current prices
      const initialPrices = {};
      products.forEach((product) => {
        initialPrices[product.id] = product.price;
      });
      setProductPrices(initialPrices);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check (not secure, but functional)
    if (password === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      loadData();
      setSaveStatus("Logged in successfully!");
      setTimeout(() => setSaveStatus(""), 2000);
    } else {
      setSaveStatus("Incorrect password");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  const handleSave = () => {
    // Save top bar message
    localStorage.setItem("topBarMessage", topBarMessage);

    // Save product prices
    localStorage.setItem("productPrices", JSON.stringify(productPrices));

    // Dispatch custom event to update TopBar in same tab
    window.dispatchEvent(new Event("topBarUpdate"));

    setSaveStatus("✓ Changes saved successfully!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all customizations? This will restore original prices and messages."
      )
    ) {
      // Clear localStorage
      localStorage.removeItem("topBarMessage");
      localStorage.removeItem("productPrices");

      // Reset state to defaults
      setTopBarMessage(defaultTopBarMessage);
      const initialPrices = {};
      products.forEach((product) => {
        initialPrices[product.id] = product.price;
      });
      setProductPrices(initialPrices);

      setSaveStatus("✓ Reset to original values!");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handlePriceChange = (productId, newPrice) => {
    setProductPrices((prev) => ({
      ...prev,
      [productId]: parseFloat(newPrice) || 0,
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="admin-input"
            />
            <button type="submit" className="admin-btn">
              Login
            </button>
          </form>
          {saveStatus && <div className="admin-status">{saveStatus}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={handleLogout} className="admin-btn-secondary">
          Logout
        </button>
      </div>

      {saveStatus && <div className="admin-status">{saveStatus}</div>}

      <div className="admin-section">
        <h2>Top Bar Message</h2>
        <textarea
          value={topBarMessage}
          onChange={(e) => setTopBarMessage(e.target.value)}
          className="admin-textarea"
          rows="4"
          placeholder="Enter top bar message..."
        />
      </div>

      <div className="admin-section">
        <h2>Product Prices</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Current Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>
                    <input
                      type="number"
                      value={productPrices[product.id] || product.price}
                      onChange={(e) =>
                        handlePriceChange(product.id, e.target.value)
                      }
                      className="admin-price-input"
                      step="0.01"
                      min="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-actions">
        <button onClick={handleSave} className="admin-btn">
          Save All Changes
        </button>
        <button onClick={handleReset} className="admin-btn-danger">
          Reset to Defaults
        </button>
      </div>

      <style jsx>{`
        .admin-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 80vh;
        }

        .admin-login {
          max-width: 400px;
          margin: 4rem auto;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .admin-login h1 {
          margin-bottom: 1.5rem;
          text-align: center;
          color: #333;
        }

        .admin-login form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .admin-header h1 {
          color: #333;
          margin: 0;
        }

        .admin-section {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .admin-section h2 {
          margin-top: 0;
          color: #333;
          font-size: 1.25rem;
        }

        .admin-input,
        .admin-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
        }

        .admin-textarea {
          resize: vertical;
          line-height: 1.5;
        }

        .admin-table-container {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .admin-table th,
        .admin-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .admin-table th {
          background: #f5f5f5;
          font-weight: 600;
          color: #333;
        }

        .admin-table tbody tr:hover {
          background: #f9f9f9;
        }

        .admin-price-input {
          width: 120px;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.95rem;
        }

        .admin-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-start;
          margin-top: 2rem;
        }

        .admin-btn,
        .admin-btn-secondary,
        .admin-btn-danger {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-btn {
          background: #4caf50;
          color: white;
        }

        .admin-btn:hover {
          background: #45a049;
        }

        .admin-btn-secondary {
          background: #757575;
          color: white;
        }

        .admin-btn-secondary:hover {
          background: #616161;
        }

        .admin-btn-danger {
          background: #f44336;
          color: white;
        }

        .admin-btn-danger:hover {
          background: #da190b;
        }

        .admin-status {
          padding: 1rem;
          margin-bottom: 1rem;
          background: #e8f5e9;
          color: #2e7d32;
          border-radius: 4px;
          text-align: center;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .admin-page {
            padding: 1rem;
          }

          .admin-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .admin-actions {
            flex-direction: column;
          }

          .admin-btn,
          .admin-btn-secondary,
          .admin-btn-danger {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
