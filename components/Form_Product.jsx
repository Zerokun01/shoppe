// src/components/Form_Product.jsx
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Form_Product({ onProductAdded }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container mt-4">
      {/* Add Product Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Carcedo Shoppe</h1>
        <button
          className="btn btn-success"
          onClick={() => setShowModal(true)}
        >
          Add New Product
        </button>
      </div>

      {/* Modal for adding products */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 6px 18px rgba(12,12,12,0.06)",
            }}
          >
            <h3>Add New Product</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const name = e.target.name.value.trim();
                const price = parseFloat(e.target.price.value);
                const quantity = parseInt(e.target.quantity.value, 10);
                const image = e.target.image.value.trim();

                if (!name || isNaN(price) || isNaN(quantity)) {
                  alert("Please fill all fields with valid values.");
                  return;
                }

                try {
                  await addDoc(collection(db, "products"), {
                    name,
                    price,
                    quantity,
                    image: image || "",
                    createdAt: new Date(),
                  });
                  setShowModal(false);
                  alert("Product added successfully!");
                  
                  // Call callback to refresh products in parent component
                  if (onProductAdded) {
                    onProductAdded();
                  }
                } catch (error) {
                  console.error("Error adding product:", error);
                  alert("Failed to add product. Please try again.");
                }
              }}
            >
              <div className="mb-3">
                <label className="form-label">Product Name *</label>
                <input type="text" name="name" className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Price *</label>
                <input type="number" name="price" step="0" min="0" className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity *</label>
                <input type="number" name="quantity" min="0" className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Image URL (optional)</label>
                <input type="text" name="image" className="form-control" placeholder="https://example.com/image.jpg" />
              </div>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}