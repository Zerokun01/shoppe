// src/components/LandingPage.jsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const LandingPage = forwardRef(({ addToCart }, ref) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "products"));
      const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(fetchedProducts);
      
      // Save products to localStorage for offline access
      localStorage.setItem('carcedo-shoppe-products', JSON.stringify(fetchedProducts));
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Try to load products from localStorage if Firebase fails
      try {
        const savedProducts = localStorage.getItem('carcedo-shoppe-products');
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        }
      } catch (localError) {
        console.error('Error loading products from localStorage:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshProducts: fetchProducts
  }));

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product, event) => {
    addToCart(product);
    // Show a brief success message
    const button = event.target;
    const originalText = button.textContent;
    const originalBg = button.style.background;
    
    button.textContent = "✅ Added!";
    button.style.background = "linear-gradient(45deg, #28a745, #20c997)";
    button.disabled = true;
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = originalBg;
      button.disabled = product.quantity <= 0;
    }, 1500);
  };

  if (loading) {
    return (
      <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh", padding: "2rem 0" }}>
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-white" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="mt-4 text-white">✨ Loading amazing products...</h3>
            <p className="text-white-50">Please wait while we fetch the latest items</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh", padding: "2rem 0" }}>
      <div className="container">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-3 text-white fw-bold mb-3">🛍️ Premium Products</h1>
          <p className="lead text-white-50 mb-4">Discover our curated collection of amazing products</p>
          <div className="d-inline-block px-4 py-2" style={{ 
            background: "rgba(255, 255, 255, 0.1)", 
            borderRadius: "50px",
            backdropFilter: "blur(10px)"
          }}>
            <span className="text-white fw-semibold">💫 {products.length} Products Available</span>
          </div>
        </div>
        
        {products.length === 0 ? (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-0 shadow-lg" style={{ borderRadius: "25px" }}>
                <div className="card-body text-center py-5">
                  <div style={{ fontSize: "4rem" }} className="mb-4">📦</div>
                  <h3 className="text-muted mb-3">No Products Yet</h3>
                  <p className="text-muted">Start adding amazing products to showcase your store!</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Product Grid */
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {products.map(prod => (
              <div key={prod.id} className="col">
                <div className="card h-100 border-0 shadow-lg" style={{ borderRadius: "25px", overflow: "hidden" }}>
                  {/* Product Image */}
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    {prod.image ? (
                      <img 
                        src={prod.image} 
                        className="card-img-top" 
                        alt={prod.name} 
                        style={{ height: "250px", objectFit: "cover", transition: "transform 0.3s ease" }} 
                      />
                    ) : (
                      <div 
                        className="card-img-top d-flex align-items-center justify-content-center" 
                        style={{ 
                          height: "250px", 
                          background: "linear-gradient(45deg, #f8f9fa, #e9ecef)" 
                        }}
                      >
                        <span style={{ fontSize: "4rem", opacity: 0.5 }}>📷</span>
                      </div>
                    )}
                    {/* Stock Badge */}
                    <div style={{ 
                      position: "absolute", 
                      top: "15px", 
                      right: "15px",
                      background: prod.quantity > 10 ? "linear-gradient(45deg, #28a745, #20c997)" : 
                                 prod.quantity > 0 ? "linear-gradient(45deg, #ffc107, #fd7e14)" : 
                                 "linear-gradient(45deg, #dc3545, #c82333)",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "bold"
                    }}>
                      {prod.quantity > 10 ? "✅ In Stock" : 
                       prod.quantity > 0 ? `⚠️ ${prod.quantity} Left` : 
                       "❌ Out of Stock"}
                    </div>
                  </div>
                  
                  <div className="card-body p-4 d-flex flex-column">
                    <h5 className="card-title fw-bold mb-3" style={{ color: "#2c3e50" }}>{prod.name}</h5>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <span className="h4 fw-bold text-success mb-0">₱{prod.price}</span>
                        </div>
                        <div className="text-end">
                          <small className="text-muted">Stock: {prod.quantity}</small>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className="btn btn-primary mt-auto w-100 py-3 fw-bold"
                      disabled={prod.quantity <= 0}
                      onClick={(e) => handleAddToCart(prod, e)}
                      style={{ 
                        borderRadius: "15px",
                        fontSize: "1rem",
                        background: prod.quantity <= 0 ? 
                          "linear-gradient(45deg, #6c757d, #495057)" :
                          "linear-gradient(45deg, #007bff, #0056b3)",
                        border: "none",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {prod.quantity <= 0 ? "🚫 Out of Stock" : "🛒 Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

LandingPage.displayName = 'LandingPage';

export default LandingPage;