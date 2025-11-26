import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import RequestToBook from "./pages/RequestToBook";
import SupplierPage from "./pages/SupplierPage";
import Checkout from "./pages/Checkout";
import FutureVersion from "./pages/FutureVersion";
import Confirmation from "./pages/Confirmation";
import Records from "./pages/Records";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FutureVersion />} />
      <Route path="/autoaccept" element={<FutureVersion />} />
      <Route path="/product" element={<FutureVersion />} />
      <Route path="/product/autoaccept" element={<FutureVersion />} />
      <Route path="/future-version" element={<FutureVersion />} />
      <Route path="/legacy" element={<Home />} />
      <Route path="/request-to-book" element={<RequestToBook />} />
      <Route path="/supplier-page" element={<SupplierPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/records" element={<Records />} />
    </Routes>
  );
}
