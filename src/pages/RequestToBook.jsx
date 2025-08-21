import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import elephant from "../assets/elephant.jpg";
import Breadcrumbs from "../components/Breadcrumbs";
import { PRODUCT_TITLE } from "../constants";
import DateTimeLocationPicker from "../components/DateTimeLocationPicker";
import Footer from "../components/Footer";

export default function RequestToBook() {
  const [showToast, setShowToast] = useState(false);
  const datePickerRef = useRef(null);
  const navigate = useNavigate();

  function handleCheckAvailability() {
    // Get selected dates, favourite information, and location from the DateTimeLocationPicker component
    const selectedDates = datePickerRef.current?.getSelectedDates();
    const favouriteDates = datePickerRef.current?.getFavouriteDates();
    const selectedLocation = datePickerRef.current?.getSelectedLocation();
    
    if (selectedDates && selectedDates.length > 0) {
      // Get existing availability requests from session storage
      const existingRequests = JSON.parse(sessionStorage.getItem('availabilityRequests') || '[]');
      
      // Create new request entry with favourite and location information
      const newRequest = {
        id: Date.now(), // Simple ID based on timestamp
        location: selectedLocation,
        dates: selectedDates.map(date => ({
          ...date,
          isFavourite: favouriteDates && favouriteDates.has(date.iso)
        })),
        timestamp: new Date().toISOString()
      };
      
      // Add to existing requests
      const updatedRequests = [...existingRequests, newRequest];
      
      // Store back in session storage
      sessionStorage.setItem('availabilityRequests', JSON.stringify(updatedRequests));
      
      // Navigate to checkout page
      navigate('/checkout');
    } else {
      // Show toast if no dates selected
      setShowToast(true);
    }
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
        <DateTimeLocationPicker ref={datePickerRef} />
      </div>

      <div className="ctaBar">
        <div className="ctaInner">
          <button className="cta-button" type="button" onClick={handleCheckAvailability}>
            Send Request
          </button>
        </div>
      </div>

      {showToast && (
        <div className="toast toast-warning" role="status" aria-live="polite">
          <div className="toast-content">
            Please select at least one date before sending your request.
          </div>
          <button className="toast-close" aria-label="Close notification" onClick={() => setShowToast(false)}>×</button>
        </div>
      )}

      <Footer />
    </div>
  );
}

