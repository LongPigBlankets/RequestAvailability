import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import elephant from "../assets/elephant.jpg";
import Breadcrumbs from "../components/Breadcrumbs";
import { PRODUCT_TITLE } from "../constants";

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const navigate = useNavigate();

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
        <Breadcrumbs />
      </div>

      <div className="content">
        <div className="product-layout">
          <div className="product-main">
            <div className="product-id">118107722</div>
            <h1 className="title">{PRODUCT_TITLE}</h1>
            <div className="location">
              <span className="chip-icon chip-icon--pin" aria-hidden="true"></span> The Aspinall Foundation, Nr Ashford Kent, Lympne Hythe, CT21 4PD
            </div>
            <div className="validity">
              <span className="use-by">Use by 19th Aug 2026</span>
              <span className="extend" role="button" tabIndex={0}>Extend</span>
            </div>
        <div className="flexibility">
          <img src="/assets/fully-flexible-arrows.png" alt="" aria-hidden="true" className="flex-icon-img" />
          <span className="flexible-text">Fully Flexible</span>
        </div>
          </div>

          <aside className="cta-card" aria-label="Availability actions">
            <div className="cta-card-header">
              <div className="cta-card-title">Limited Availability.</div>
              <div className="cta-card-subtitle">Select your dates to check</div>
            </div>
            <div className="cta-card-actions">
              <button
                className="cta-button"
                type="button"
                onClick={() => navigate("/request-to-book")}
              >
                Check Availability
              </button>
              <button
                className="cta-button cta-button--secondary"
                type="button"
                onClick={() => setIsBookingOpen(true)}
              >
                Contact Port Lympne
              </button>
            </div>
          </aside>
        </div>

        <div className="divider"></div>
        <h2 className="section-title">About the experience</h2>
        <p className="description">
          Explore the vast 600-acre expanse of Port Lympne Reserve and its historic landscape,
          then unwind with a relaxing afternoon tea. Meet incredible animals up close and enjoy 
          a memorable day out in nature.
        </p>
        <div className="divider"></div>
        <h2 className="section-title">What's included?</h2>
        <div className="description">
          <ul>
            <li>Unforgettable 45-minute Truck Safari covering 600 acres of ancient parkland</li>
            <li>The unique chance to admire over 900 animal residents across 75 species right here in the UK</li>
            <li>Afternoon tea inside the Grade II listed Port Lympne Mansion</li>
          </ul>
        </div>

        <div className="divider"></div>
        <h2 className="section-title">What do I need to know?</h2>
        <div className="description">
          <ul>
            <li>This experience should last around 60 minutes</li>
            <li>Open from 9:30 am to 5 pm; last entry at 3:30 pm</li>
            <li>Available Sunday-Friday, year-round</li>
            <li>All dates are subject to availability</li>
            <li>Accessibility; The entrance to the park is via a ramped footbridge with designated disabled parking available at the base of the footbridge on hard-standing. The park has an on-call minibus that can transport you to any area required. (Please notify any member of staff if you require assistance and this will be arranged). Wheelchairs are also available for hire at the Gatehouse!</li>
          </ul>
        </div>
      </div>

      <div className="ctaBar">
        <div className="ctaInner">
          <div className="availability-notice">
            <div className="availability-text">Limited Availability!</div>
            <div className="book-text">Book Your Experience Today</div>
          </div>
          <div className="cta-buttons">
            <button
              className="cta-button"
              type="button"
              onClick={() => navigate("/request-to-book")}
            >
              Check Availability
            </button>
            <button
              className="cta-button cta-button--secondary"
              type="button"
              onClick={() => setIsBookingOpen(true)}
            >
              Contact Port Lympne
            </button>
          </div>
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
                  <span className="booking-info-icon" aria-hidden="true"><span className="chip-icon chip-icon--pin" aria-hidden="true"></span></span>
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
                  onClick={() => {
                    setIsBookingOpen(false);
                    navigate("/request-to-book");
                  }}
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

