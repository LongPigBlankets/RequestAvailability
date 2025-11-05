import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PRODUCT_TITLE } from "../constants";

export default function Breadcrumbs() {
  const location = useLocation();
  const isRequestPage = location.pathname === "/request-to-book";
  const isProductExperience = location.pathname === "/product" || location.pathname === "/product/autoaccept";
  const currentTitle = isProductExperience ? "Unforgettable Experience for Two" : PRODUCT_TITLE;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <span className="crumb">
        <Link to="/">My Voucher</Link>
      </span>
      <span className="separator">{" -> "}</span>
      {isRequestPage ? (
        <>
          <span className="crumb">
            <Link to="/">{currentTitle}</Link>
          </span>
          <span className="separator">{" -> "}</span>
          <span className="crumb current" aria-current="page">Request Availability</span>
        </>
      ) : (
        <span className="crumb current" aria-current="page">{currentTitle}</span>
      )}
    </nav>
  );
}

