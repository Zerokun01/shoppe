// src/components/Orders.jsx
import React, { useEffect, useState } from "react";
import { db } from "../src/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      {orders.map(o => (
        <div key={o.id}>
          <p>Order ID: {o.id}</p>
          <p>Total: ₱{o.total}</p>
        </div>
      ))}
    </div>
  );
}
