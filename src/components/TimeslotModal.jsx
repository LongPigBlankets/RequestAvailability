import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TimeslotModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [datesSummary, setDatesSummary] = useState([]);

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

  if (!isOpen) return null;

  return (
    <div className="booking-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="booking-backdrop"></div>
      <div className="booking-panel" onClick={(e) => e.stopPropagation()}>
        <div className="booking-header">
          <h3 className="booking-title">Select timeslots</h3>
          <button className="booking-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="booking-body">
          <div className="booking-details-heading">Dates selected</div>
          {datesSummary.length > 0 ? (
            <p className="booking-description">{datesSummary.join(', ')}</p>
          ) : (
            <p className="booking-description">No dates selected yet.</p>
          )}
          <div className="booking-cta">
            <button
              type="button"
              className="cta-button"
              onClick={() => { onClose?.(); navigate('/checkout'); }}
            >
              Continue to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

