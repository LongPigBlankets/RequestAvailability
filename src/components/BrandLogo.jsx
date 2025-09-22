import React from "react";
import logo from "../assets/buyagift-by-moonpig.svg";

export default function BrandLogo() {
  return (
    <div aria-label="Brand" role="img" style={{ display: 'inline-block' }}>
      <img src={logo} alt="buyagift by moonpig" className="brand-logo" />
    </div>
  );
}

