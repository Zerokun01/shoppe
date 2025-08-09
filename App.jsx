// src/App.jsx
import React, { useReducer, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import CartPage from "./components/CartPage";
import Form_Product from "./components/Form_Product";
import { cartReducer, initialState } from "./reducer/cartReducer";

export default function App() {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const landingPageRef = useRef();

  const handleProductAdded = () => {
    // Refresh products in LandingPage when a new product is added
    if (landingPageRef.current) {
      landingPageRef.current.refreshProducts();
    }
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <NavLink className="navbar-brand" to="/">
          Carcedo Shoppe
        </NavLink>
        <span className="navbar-text">Premium Fashion</span>
        <div className="d-flex ms-auto">
          <NavLink className="btn btn-outline-light" to="/cart">
            <i className="bi bi-cart"></i> Cart ({state.items.length})
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Form_Product onProductAdded={handleProductAdded} />
              <LandingPage 
                ref={landingPageRef}
                addToCart={(product) => dispatch({ type: "ADD", payload: product })} 
              />
            </>
          }
        />
        <Route path="/cart" element={<CartPage cart={state.items} dispatch={dispatch} />} />
      </Routes>
    </Router>
  );
}