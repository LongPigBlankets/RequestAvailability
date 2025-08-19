import React from "react";
import elephant from "../assets/elephant.jpg";
import DateTimeLocationPicker from "../components/DateTimeLocationPicker";

export default function RequestToBook() {
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
            <div className="book-text">Choose Location to Request</div>
          </div>
          <DateTimeLocationPicker />
        </div>
      </div>
    </div>
  );
}

