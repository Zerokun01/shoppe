import React from "react";
import { db, serverTimestamp } from "../firebase";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";

export default function Cart({ state, dispatch }) {
  const total = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    for (const item of state.items) {
      const productRef = doc(db, "products", item.id);
      await updateDoc(productRef, {
        quantity: item.quantity - item.qty,
      });
    }

    await addDoc(collection(db, "orders"), {
      items: state.items,
      total,
      createdAt: serverTimestamp(),
    });

    dispatch({ type: "CLEAR_CART" });
    alert("Checkout successful!");
  };

  return (
    <div className="cart-card">
      <h2 className="cart-title">Shopping Cart</h2>
      {state.items.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          {state.items.map(i => (
            <div className="cart-item" key={i.id}>
              <div className="cart-item-info">
                <span className="cart-item-name">{i.name}</span>
                <span className="cart-item-price">${i.price.toFixed(2)} each</span>
              </div>
              <div className="cart-item-controls">
                <button className="cart-btn" onClick={() => dispatch({ type: "DECREASE_QTY", id: i.id })}>-</button>
                <span className="cart-qty">{i.qty}</span>
                <button className="cart-btn" onClick={() => dispatch({ type: "INCREASE_QTY", id: i.id })}>+</button>
                <button className="cart-remove" onClick={() => dispatch({ type: "REMOVE_FROM_CART", id: i.id })}>×</button>
              </div>
            </div>
          ))}
          <hr />
          <div className="cart-total-row">
            <span>Total:</span>
            <span className="cart-total">${total.toFixed(2)}</span>
          </div>
          <button className="cart-checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}