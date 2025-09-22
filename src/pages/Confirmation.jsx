import React, { useEffect, useMemo } from "react";
import BrandLogo from "../components/BrandLogo";
import Footer from "../components/Footer";

export default function Confirmation() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const lastRequest = useMemo(() => {
    const requests = JSON.parse(sessionStorage.getItem('availabilityRequests') || '[]');
    if (requests.length === 0) return null;
    return requests[requests.length - 1];
  }, []);

  const requestedDates = lastRequest?.dates ?? [];
  const location = lastRequest?.location || 'Port Lympne, Kent';

  return (
    <div className="app has-footer">
      <div className="header" role="banner">
        <div className="right-actions">
          <button className="nav-button" aria-label="Share">
            <span className="share-icon">↗</span>
          </button>
          <button className="help-button">Help</button>
        </div>
      </div>

      <div className="content">
        <BrandLogo />
      </div>

      <div className="content">
        <div className="confirmation-hero" role="status" aria-live="polite">
          <div className="confetti-icon" aria-hidden>🎉</div>
          <h1 className="title">Request sent</h1>
          <p className="confirmation-message">
            Your booking request has been sent to Port Lympne. Expect a response confirming or rejecting the dates in the next 24 hours.
          </p>
          <div className="request-id">Request ID: 1234567890</div>
        </div>
      </div>

      <div className="content">
        <div className="confirmation-details">
          <div className="confirmation-left">
            <div className="summary-section">
              <div className="summary-location">
                <span className="summary-label"><span className="chip-icon chip-icon--pin" aria-hidden="true"></span> Location:</span>
                <span className="summary-value">{location}</span>
              </div>
              <div className="summary-dates">
                <span className="summary-label"><span className="chip-icon chip-icon--calendar" aria-hidden="true"></span> Requested dates:</span>
                <div className="dates-summary-list">
                  {requestedDates.length > 0 ? (
                    requestedDates.map(date => (
                      <div key={date.iso} className="date-summary-item">
                        <span className="date-summary-text">{date.formatted || date.iso}</span>
                        {date.isFavourite && (
                          <span className="favorite-text" aria-label="Top preference date">⭐ Top preference</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="date-summary-item">
                      <span className="date-summary-text">No dates found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-right">
            <div className="uk-map" aria-label="Mocked map of the UK with a pin in the south east">
              <div className="uk-map-label">UK Map (mock)</div>
              <div className="uk-pin" title="South East"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

