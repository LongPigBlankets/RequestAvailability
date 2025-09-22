import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import elephant from "../assets/elephant.jpg";
import Breadcrumbs from "../components/Breadcrumbs";
import { PRODUCT_TITLE } from "../constants";
import LocationActionSheet from "../components/LocationActionSheet";
import CalendarPopover from "../components/CalendarPopover";
import TimeslotModal from "../components/TimeslotModal";

export default function FutureVersion() {
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeslotOpen, setIsTimeslotOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedDatesCount, setSelectedDatesCount] = useState(0);
  const ctaDesktopRef = useRef(null);
  const ctaMobileRef = useRef(null);
  const timeslotDesktopRef = useRef(null);
  const timeslotMobileRef = useRef(null);
  const locationChipInlineRef = useRef(null);
  const locationChipCardRef = useRef(null);
  const { search } = useLocation();
  const hasTimeslotParam = new URLSearchParams(search).has('timeslot');

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  return (
    <div className="app has-footer future-version">
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

            {/* Mobile inline controls with divider above and below; hide entire section on desktop */}
            <div className="future-inline-section">
              <div className="divider"></div>
              <div className="future-inline-controls" aria-label="Choose options">
                {/* Location pill (full width) */}
                <button
                  type="button"
                  className="chip-button chip-button--full"
                  ref={locationChipInlineRef}
                  onClick={() => setIsLocationOpen(true)}
                  aria-haspopup="dialog listbox"
                  aria-expanded={isLocationOpen}
                >
                  <span className="chip-icon chip-icon--pin" aria-hidden="true"></span>
                  <span>{selectedLocation ? selectedLocation : "Choose location"}</span>
                </button>

                {/* Dates pill */}
                <button
                  type="button"
                  className="chip-button"
                  ref={ctaMobileRef}
                  onClick={() => setIsCalendarOpen(true)}
                  aria-haspopup="dialog"
                  aria-expanded={isCalendarOpen}
                >
                  <span className="chip-icon chip-icon--calendar" aria-hidden="true"></span>
                  <span>Select date</span>
                </button>

                {/* Times pill */}
                <button
                  type="button"
                  className="chip-button"
                  ref={timeslotMobileRef}
                  onClick={() => setIsTimeslotOpen(true)}
                >
                  <span className="chip-icon chip-icon--clock" aria-hidden="true"></span>
                  <span>Select time</span>
                </button>
              </div>
              <div className="divider"></div>
            </div>

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
                <span className="chip-icon chip-icon--pin" aria-hidden="true"></span>
                <span>{selectedLocation ? selectedLocation : "Choose location"}</span>
              </button>
            </div>
            <div className="future-card-cta">
              <button
                ref={ctaDesktopRef}
                className="cta-button cta-button--pill cta-button--date"
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isCalendarOpen}
              >
                <span className="chip-icon" aria-hidden="true"></span>
                {selectedDatesCount === 0
                  ? "Choose date"
                  : selectedDatesCount === 1
                    ? "1 date selected"
                    : `${selectedDatesCount} dates selected`}
              </button>
              {hasTimeslotParam && (
                <button
                  className="cta-button cta-button--secondary cta-button--pill cta-button--timeslot"
                  type="button"
                  onClick={() => setIsTimeslotOpen(true)}
                  ref={timeslotDesktopRef}
                >
                  <span className="chip-icon" aria-hidden="true"></span>
                  Select timeslots
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA removed in favor of inline pills */}

      {/* Overlays/Popovers */}
      <LocationActionSheet
        anchorRef={isDesktop ? locationChipCardRef : locationChipInlineRef}
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onSelect={(loc) => setSelectedLocation(loc)}
        selected={selectedLocation}
      />

      {isCalendarOpen && (
        <CalendarPopover 
          anchorRef={isDesktop ? ctaDesktopRef : ctaMobileRef} 
          onClose={() => setIsCalendarOpen(false)} 
          selectedLocation={selectedLocation}
          onSelectedCountChange={(n) => setSelectedDatesCount(n)}
          onProceed={hasTimeslotParam ? () => setIsTimeslotOpen(true) : undefined}
        />
      )}
      <TimeslotModal 
        isOpen={isTimeslotOpen} 
        onClose={() => setIsTimeslotOpen(false)} 
        anchorRef={isDesktop ? timeslotDesktopRef : timeslotMobileRef}
      />
    </div>
  );
}

