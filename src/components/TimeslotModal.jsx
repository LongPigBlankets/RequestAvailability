import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TimeslotModal({ isOpen, onClose, anchorRef }) {
  const navigate = useNavigate();
  const [datesSummary, setDatesSummary] = useState([]);
  const popoverRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: 0 });

  function formatHuman(date) {
    const day = date.getDate();
    const month = date.toLocaleString(undefined, { month: "long" });
    const j = day % 10, k = day % 100;
    const suffix = (j === 1 && k !== 11)
      ? "st"
      : (j === 2 && k !== 12)
        ? "nd"
        : (j === 3 && k !== 13)
          ? "rd"
          : "th";
    return `${day}${suffix} of ${month}`;
  }

  useEffect(() => {
    if (!isOpen) return;
    try {
      let dates = [];
      const draft = JSON.parse(sessionStorage.getItem('availabilityDraft') || 'null');
      if (draft && Array.isArray(draft.dates) && draft.dates.length > 0) {
        dates = draft.dates;
      } else {
        const requests = JSON.parse(sessionStorage.getItem('availabilityRequests') || '[]');
        if (Array.isArray(requests) && requests.length > 0) {
          const last = requests[requests.length - 1];
          if (last && Array.isArray(last.dates)) {
            dates = last.dates;
          }
        }
      }
      const formatted = dates.map(d => {
        if (d && typeof d === 'object') {
          if (d.formatted) return d.formatted;
          if (d.iso) {
            const dt = new Date(d.iso);
            if (!isNaN(dt.getTime())) return formatHuman(dt);
            return d.iso;
          }
        }
        return String(d);
      });
      setDatesSummary(formatted);
    } catch (e) {
      setDatesSummary([]);
    }
  }, [isOpen]);

  // Track viewport type similar to calendar popover
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  // Position popover near anchor on desktop
  useEffect(() => {
    if (!isOpen || !anchorRef?.current) return;

    function updatePosition() {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const desiredTop = rect.bottom + 8; // small offset
      const RIGHT_MARGIN = 48;
      const BOTTOM_MARGIN = 128; // leave space for CTA area
      const availableRight = window.innerWidth - rect.left;
      const maxWidth = Math.min(520, availableRight - RIGHT_MARGIN);
      const width = Math.max(380, maxWidth);
      const maxHeight = Math.max(240, window.innerHeight - desiredTop - BOTTOM_MARGIN);
      setPosition({ top: desiredTop, left: rect.left, width, maxHeight });
    }

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, anchorRef]);

  // Close on outside click and on Escape (desktop popover)
  useEffect(() => {
    if (!isOpen) return;
    function onDocClick(e) {
      const pop = popoverRef.current;
      const anchor = anchorRef?.current;
      if (!pop) return;
      if (anchor && (anchor === e.target || anchor.contains(e.target))) return;
      if (!pop.contains(e.target)) onClose?.();
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, anchorRef, onClose]);

  if (!isOpen) return null;

  const content = (
    <>
      <div className="booking-details-heading">Dates selected</div>
      {datesSummary.length > 0 ? (
        <p className="booking-description">{datesSummary.join(', ')}</p>
      ) : (
        <p className="booking-description">No dates selected yet.</p>
      )}
      <div className="booking-cta">
        <button
          type="button"
          className={`cta-button${isDesktop ? ' cta-button--pill' : ''}`}
          onClick={() => { onClose?.(); navigate('/checkout'); }}
        >
          Continue to checkout
        </button>
      </div>
    </>
  );

  return isDesktop ? (
    <div
      ref={popoverRef}
      className="cta-popover"
      style={{ top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px`, maxHeight: `${position.maxHeight}px` }}
      role="dialog"
      aria-modal="false"
    >
      <div className="calendar open">
        <div className="calendar-caption">Select timeslots</div>
        {content}
      </div>
    </div>
  ) : (
    <div className="booking-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="booking-backdrop"></div>
      <div className="booking-panel" onClick={(e) => e.stopPropagation()}>
        <div className="booking-header">
          <h3 className="booking-title">Select timeslots</h3>
          <button className="booking-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="booking-body">
          {content}
        </div>
      </div>
    </div>
  );
}

