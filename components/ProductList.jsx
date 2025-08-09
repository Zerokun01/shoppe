// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function ProductList({ dispatch }) {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map(p => (
        <div key={p.id} className="card mb-3 shadow-sm" style={{ borderRadius: "20px", overflow: "hidden" }}>
          <div className="d-flex align-items-center p-3">
            <div className="me-3">
              {p.image ? (
                <img 
                  src={p.image} 
                  alt={p.name} 
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
              <h6 className="mb-1 fw-semibold" style={{ color: "#2c3e50" }}>{p.name}</h6>
              <p className="mb-1 text-muted small">₱{p.price} (Qty: {p.qty})</p>
              <div>
                <button 
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => dispatch({ type: "ADD_TO_CART", payload: p })}
                >
                  Add to Cart
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
