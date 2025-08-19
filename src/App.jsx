import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import RequestToBook from "./pages/RequestToBook";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/request-to-book" element={<RequestToBook />} />
    </Routes>
  );
}
