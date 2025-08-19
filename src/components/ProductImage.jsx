import React from "react";

export default function ProductCard() {
  return (
    <div style={{ width: "100%", height: 280, overflow: "hidden", borderRadius: 12, background: "#e2e8f0" }}>
      <img src={elephant} alt="Safari landscape with an elephant" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}