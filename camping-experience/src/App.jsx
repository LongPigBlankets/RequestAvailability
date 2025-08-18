import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const handleRequestAvailability = () => {
    setIsActionSheetOpen(true);
  };

  const closeActionSheet = () => {
    setIsActionSheetOpen(false);
  };

  return (
    <div className="app">
      {/* Header Navigation */}
      <div className="header">
        <button className="nav-button">
          <span className="arrow-left">←</span>
        </button>
        <button className="nav-button">
          <span className="share-icon">↗</span>
        </button>
        <button className="help-button">Help</button>
      </div>

      {/* Main Image with Carousel Dots */}
      <div className="main-image">
        <img 
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Camping experience with fire pit"
        />
        <div className="carousel-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        <div className="product-id">109111267</div>
        
        <h1 className="title">
          Pinewood Pod Stay for Up To Four with Safari at Port Lympne Hotel and Reserve
        </h1>
        
        <div className="location">
          📍 C/O Port Lympne Hotel &amp; Reserve, C/O Port Lympne Hotel &amp; Reserve, Aldington Road, Lympne, CT21 4PD
        </div>
        
        <div className="validity">
          <span className="use-by">Use by 18th Aug 2026</span>
          <span className="extend">Extend</span>
        </div>
        
        <div className="flexibility">
          🔗 <span className="flexible-text">Fully Flexible</span>
        </div>
        
        <div className="divider"></div>
        
        <h2 className="section-title">About the experience</h2>
        
        <p className="description">
          Get ready for a glamping escape that's got lions, tigers, and toasted marshmallows! At t...
        </p>
        
        <div className="availability-notice">
          <div className="availability-text">Limited Availability!</div>
          <div className="book-text">Book Your Experience Today</div>
        </div>
        
        <button 
          className="cta-button"
          onClick={handleRequestAvailability}
        >
          Request Availability
        </button>
      </div>

      {/* Action Sheet Overlay */}
      {isActionSheetOpen && (
        <div className="action-sheet-overlay" onClick={closeActionSheet}>
          <div className="action-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="action-sheet-handle"></div>
            <div className="action-sheet-content">
              <p>placeholder</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;