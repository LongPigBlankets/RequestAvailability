import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import elephant from "../assets/elephant.jpg";
import Breadcrumbs from "../components/Breadcrumbs";
import { PRODUCT_TITLE } from "../constants";
import LocationActionSheet from "../components/LocationActionSheet";
import CalendarPopover from "../components/CalendarPopover";

export default function FutureVersion() {
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState("Port Lympne Kent");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const ctaDesktopRef = useRef(null);
  const ctaMobileRef = useRef(null);
  const locationChipInlineRef = useRef(null);
  const locationChipCardRef = useRef(null);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

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
        <div className="product-layout">
          <div className="product-main">
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

            {/* Mobile inline controls with divider above and below; hidden on desktop via CSS */}
            <div className="divider"></div>
            <div className="future-inline-controls" aria-label="Choose options">
              <button
                type="button"
                className="chip-button"
                ref={locationChipInlineRef}
                onClick={() => setIsLocationOpen(true)}
                aria-haspopup="dialog listbox"
                aria-expanded={isLocationOpen}
              >
                <span>{selectedLocation ? selectedLocation : "Add location"}</span>
              </button>
            </div>
            <div className="divider"></div>

            <h2 className="section-title">About the experience</h2>
            <p className="description">
              Explore the vast 600-acre expanse of Port Lympne Reserve and its historic landscape,
              then unwind with a relaxing afternoon tea. Meet incredible animals up close and enjoy 
              a memorable day out in nature.
            </p>
            {/* Page footer under description */}
            <div className="footer" aria-hidden="true"></div>
          </div>

          {/* Desktop: remade container with Date, Location and Check availability */}
          <aside className="cta-card future-cta-card" aria-label="Availability actions">
            <div className="cta-card-header">
              <div className="cta-card-title">Limited Availability.</div>
              <div className="cta-card-subtitle">Select your dates to check</div>
            </div>
            <div className="future-card-fields">
              <button
                type="button"
                className="chip-button"
                ref={locationChipCardRef}
                onClick={() => setIsLocationOpen(true)}
                aria-haspopup="dialog listbox"
                aria-expanded={isLocationOpen}
              >
                <span>{selectedLocation ? selectedLocation : "Add location"}</span>
              </button>
            </div>
            <div className="future-card-cta">
              <button
                ref={ctaDesktopRef}
                className="cta-button cta-button--pill"
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isCalendarOpen}
              >
                Check Availability
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="ctaBar">
        <div className="ctaInner">
          <button
            className="cta-button"
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isCalendarOpen}
            ref={ctaMobileRef}
          >
            Check availability
          </button>
        </div>
      </div>

      {/* Overlays/Popovers */}
      <LocationActionSheet
        anchorRef={isDesktop ? locationChipCardRef : locationChipInlineRef}
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onSelect={(loc) => setSelectedLocation(loc)}
        selected={selectedLocation}
      />

      {isCalendarOpen && (
        <CalendarPopover anchorRef={isDesktop ? ctaDesktopRef : ctaMobileRef} onClose={() => setIsCalendarOpen(false)} />
      )}
    </div>
  );
}

