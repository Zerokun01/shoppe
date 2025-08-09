// src/components/CartPage.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { doc, updateDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function CartPage({ cart = [], dispatch }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0);

  // Fetch products for the available products section
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch({ type: "ADD", payload: product });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const confirmCheckout = window.confirm(
      `Proceed with checkout for ₱${totalPrice.toFixed(2)}?`
    );
    
    if (!confirmCheckout) return;

    try {
      // Update product quantities in Firebase
      for (let item of cart) {
        const productRef = doc(db, "products", item.id);
        await updateDoc(productRef, {
          quantity: Math.max((item.quantity || 0) - (item.qty || 1), 0),
        });
      }

      // Save order to Firebase
      await addDoc(collection(db, "orders"), {
        items: cart,
        total: totalPrice,
        createdAt: new Date(),
      });

      // Clear the cart
      dispatch({ type: "CLEAR_CART" });
      alert("Order successful! Thank you for your purchase.");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  const handleRemove = (itemId) => {
    dispatch({ type: "REMOVE_FROM_CART", id: itemId });
  };

  return (
    <div className="container mt-4" style={{ minHeight: "100vh" }}>
      {/* Available Products Section */}
      {/* Removed Available Products Section as per user request */}
      {/* <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Available Products</h5>
          
          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <p className="text-muted text-center py-3">No products available</p>
          ) : (
            <div className="row g-3">
              {products.map(product => (
                <div key={product.id} className="col-12">
                  <div className="d-flex align-items-center p-3 border rounded">
                    <div className="me-3">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={{ 
                            width: "60px", 
                            height: "60px", 
                            objectFit: "cover",
                            borderRadius: "8px"
                          }}
                        />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center"
                          style={{ 
                            width: "60px", 
                            height: "60px", 
                            backgroundColor: "#e9ecef",
                            borderRadius: "8px"
                          }}
                        >
                          <span style={{ fontSize: "1.5rem" }}>📦</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{product.name}</h6>
                      <p className="mb-1 text-muted small">{product.description || "Latest model with advanced features"}</p>
                      <p className="mb-0 text-primary fw-bold">₱{product.price}</p>
                    </div>
                    <div>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.quantity <= 0}
                      >
                        {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div> 
      */}

      {/* Your Cart Section */}
      <div className="card border-0 shadow-lg" style={{ borderRadius: "25px" }}>
        <div className="card-body p-4">
          <h5 className="card-title mb-4 fw-bold" style={{ color: "#2c3e50" }}>Your Cart</h5>
          
          {cart.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "3rem", color: "#6c757d", marginBottom: "1rem" }}>🛒</div>
              <h6 className="text-muted">Your cart is empty</h6>
              <p className="text-muted small">Add some products to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              {cart.map(item => (
                <div key={item.id} className="card mb-3 shadow-sm" style={{ borderRadius: "20px", overflow: "hidden" }}>
                  <div className="d-flex align-items-center p-3">
                    <div className="me-3">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ 
                            width: "120px", 
                            height: "120px", 
                            objectFit: "contain",
                            borderRadius: "15px"
                          }}
                        />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center"
                          style={{ 
                            width: "60px", 
                            height: "60px", 
                            backgroundColor: "#e9ecef",
                            borderRadius: "15px"
                          }}
                        >
                          <span style={{ fontSize: "1.5rem" }}>📦</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold" style={{ color: "#2c3e50" }}>{item.name}</h6>
                      <div className="d-flex align-items-center mb-2">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => dispatch({ type: "DECREASE_QTY", id: item.id })}
                          style={{ borderRadius: "10px", width: "30px", height: "30px", padding: "0" }}
                        >
                          -
                        </button>
                        <span className="fw-bold">{item.qty}</span>
                        <button
                          className="btn btn-outline-primary btn-sm ms-2"
                          onClick={() => dispatch({ type: "INCREASE_QTY", id: item.id })}
                          style={{ borderRadius: "10px", width: "30px", height: "30px", padding: "0" }}
                        >
                          +
                        </button>
                      </div>
                      <strong className="text-primary">₱{(item.price * item.qty).toFixed(2)}</strong>
                    </div>
                    <div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemove(item.id)}
                        style={{ borderRadius: "15px" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Cart Total and Checkout */}
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Total:</h5>
              <h5 className="mb-0 text-primary">₱{totalPrice.toFixed(2)}</h5>
            </div>
            <button 
              className={`btn w-100 ${cart.length === 0 ? 'btn-secondary' : 'btn-success'}`}
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}