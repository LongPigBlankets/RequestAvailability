import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PRODUCT_TITLE } from "../constants";

export default function Breadcrumbs() {
  const location = useLocation();
  const isRequestPage = location.pathname === "/request-to-book";

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <span className="crumb">
        <Link to="/">My Voucher</Link>
      </span>
      <span className="separator">{" -> "}</span>
      {isRequestPage ? (
        <>
          <span className="crumb">
            <Link to="/">{PRODUCT_TITLE}</Link>
          </span>
          <span className="separator">{" -> "}</span>
          <span className="crumb current" aria-current="page">Request Availability</span>
        </>
      ) : (
        <span className="crumb current" aria-current="page">{PRODUCT_TITLE}</span>
      )}
    </nav>
  );
}

