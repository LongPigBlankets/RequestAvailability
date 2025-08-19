import React, { useState } from "react";
import elephant from "../assets/elephant.jpg";
import Breadcrumbs from "../components/Breadcrumbs";
import { PRODUCT_TITLE } from "../constants";
import DateTimeLocationPicker from "../components/DateTimeLocationPicker";
import Footer from "../components/Footer";
import { useAvailability } from "../contexts/AvailabilityContext";

export default function RequestToBook() {
  const [showToast, setShowToast] = useState(false);
  const [selectedDates, setSelectedDates] = useState(new Set());
  const { addRequest } = useAvailability();

  function handleCheckAvailability() {
    // Always add a request when Check Availability is clicked
    // If no dates selected, add some default test dates
    const datesToAdd = selectedDates.size > 0 ? selectedDates : new Set(['2024-12-25', '2024-12-26']);
    addRequest(datesToAdd);
    setShowToast(true);
  }

  return (
    <div className="app has-footer">
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
        <div className="product-id">118107722</div>
        <h1 className="title">{PRODUCT_TITLE}</h1>
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

      {/* Booking controls area (desktop: below description, above CTA) */}
      <div className="content">
        <DateTimeLocationPicker 
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
        />
      </div>

      <div className="ctaBar">
        <div className="ctaInner">
          <button className="cta-button" type="button" onClick={handleCheckAvailability}>
            Check Availability
          </button>
        </div>
      </div>

      {showToast && (
        <div className="toast toast-success" role="status" aria-live="polite">
          <div className="toast-content">
            Your request has been sent to Port Lympne. Please allow up to 24 hours for them to review. We will email back with their response.
          </div>
          <button className="toast-close" aria-label="Close notification" onClick={() => setShowToast(false)}>×</button>
        </div>
      )}

      <Footer />
    </div>
  );
}

