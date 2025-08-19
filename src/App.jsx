import React, { useEffect, useState } from "react";
import "./App.css";
import elephant from "./assets/elephant.jpg";

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setIsBookingOpen(false);
      }
    }
    if (isBookingOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isBookingOpen]);

  return (
    <div className="app">
      <div className="header" role="banner">
        <button className="nav-button" aria-label="Go back">
          <span className="arrow-left">←</span>
        </button>
        <div className="right-actions">
          <button className="nav-button" aria-label="Share">
            <span className="share-icon">↗</span>
          </button>
          <button className="help-button">Help</button>
        </div>
      </div>

      <div className="main-image">
        <img src={elephant} alt="Giraffes and safari trucks at Port Lympne" />
        <div className="carousel-dots" aria-hidden="true">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      <div className="content">
        <div className="product-id">118107722</div>
        <h1 className="title">
          A Visit to Port Lympne Reserve, Truck Safari and Afternoon Tea for Two
        </h1>
        <div className="location">
          📍 The Aspinall Foundation, Nr Ashford Kent, Lympne Hythe, CT21 4PD
        </div>
        <div className="validity">
          <span className="use-by">Use by 19th Aug 2026</span>
          <span className="extend" role="button" tabIndex={0}>Extend</span>
        </div>
        <div className="flexibility">
          🔁 <span className="flexible-text">Fully Flexible</span>
        </div>
        <div className="divider"></div>
        <h2 className="section-title">About the experience</h2>
        <p className="description">
          Explore the vast 600-acre expanse of Port Lympne Reserve and its historic landscape,
          then unwind with a relaxing afternoon tea. Meet incredible animals up close and enjoy 
          a memorable day out in nature.
        </p>
      </div>

      <div className="ctaBar">
        <div className="ctaInner">
          <div className="availability-notice">
            <div className="availability-text">Limited Availability!</div>
            <div className="book-text">Book Your Experience Today</div>
          </div>
          <button
            className="cta-button"
            type="button"
            onClick={() => setIsBookingOpen(true)}
          >
            Book Now
          </button>
        </div>
      </div>

      {isBookingOpen && (
        <div
          className="booking-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bookingTitle"
          onClick={() => setIsBookingOpen(false)}
        >
          <div className="booking-backdrop"></div>
          <div
            className="booking-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="booking-header">
              <h3 id="bookingTitle" className="booking-title">Book now</h3>
              <button
                className="booking-close"
                aria-label="Close"
                onClick={() => setIsBookingOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="booking-body">
              <div className="booking-details-heading">Booking details</div>
              <p className="booking-description">
                Use these booking details to check availability and secure your spot. Have your voucher number and pin code read to complete your booking!
              </p>

              <div className="booking-info">
                <div className="booking-info-row">
                  <span className="booking-info-icon" aria-hidden="true">📍</span>
                  <span>Port Lympne, Kent, England</span>
                </div>
                <div className="booking-info-row">
                  <span className="booking-info-icon" aria-hidden="true">✉️</span>
                  <span>info@supplier.co.uk</span>
                </div>
              </div>

              <div className="booking-cta">
                <button
                  type="button"
                  className="cta-button"
                  onClick={() => setIsBookingOpen(false)}
                >
                  Request Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
