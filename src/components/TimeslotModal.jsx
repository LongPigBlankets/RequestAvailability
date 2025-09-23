import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TimeslotModal({ isOpen, onClose, anchorRef, onTimesUpdated }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAutoAccept = pathname === '/autoaccept';
  const [dates, setDates] = useState([]); // [{ iso, formatted }]
  const [selectedTimesByIso, setSelectedTimesByIso] = useState({}); // { [iso]: 'HH:MM' }
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

  function generateTimeOptions(startHour = 9, startMinute = 30, endHour = 17, endMinute = 0, stepMinutes = 30) {
    const options = [];
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    for (let t = startTotal; t <= endTotal; t += stepMinutes) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      options.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
    return options;
  }

  const timeOptions = useMemo(() => generateTimeOptions(9, 30, 17, 0, 30), []);

  useEffect(() => {
    if (!isOpen) return;
    try {
      let dateObjs = [];
      const draft = JSON.parse(sessionStorage.getItem('availabilityDraft') || 'null');
      if (draft && Array.isArray(draft.dates) && draft.dates.length > 0) {
        dateObjs = draft.dates;
      } else {
        const requests = JSON.parse(sessionStorage.getItem('availabilityRequests') || '[]');
        if (Array.isArray(requests) && requests.length > 0) {
          const last = requests[requests.length - 1];
          if (last && Array.isArray(last.dates)) {
            dateObjs = last.dates;
          }
        }
      }
      const normalized = (Array.isArray(dateObjs) ? dateObjs : []).map(d => {
        if (d && typeof d === 'object' && d.iso) {
          const dt = new Date(d.iso);
          return {
            iso: d.iso,
            formatted: d.formatted || (!isNaN(dt.getTime()) ? formatHuman(dt) : String(d.iso)),
            time: d.time || null,
          };
        }
        const asDate = new Date(d);
        const iso = !isNaN(asDate.getTime()) ? asDate.toISOString().slice(0, 10) : String(d);
        return { iso, formatted: !isNaN(asDate.getTime()) ? formatHuman(asDate) : String(d), time: null };
      });
      setDates(normalized);

      // initialize selected times from stored values or default to first option
      const initial = {};
      normalized.forEach(item => {
        initial[item.iso] = item.time || timeOptions[0];
      });
      setSelectedTimesByIso(initial);
    } catch (e) {
      setDates([]);
      setSelectedTimesByIso({});
    }
  }, [isOpen]);

  // Persist times to draft and notify parent on every change in autoaccept
  useEffect(() => {
    if (!isAutoAccept) return;
    if (!dates || dates.length === 0) {
      onTimesUpdated?.(false);
      return;
    }
    const hasAllTimes = dates.every(d => !!selectedTimesByIso[d.iso]);
    try {
      const draft = JSON.parse(sessionStorage.getItem('availabilityDraft') || 'null');
      if (draft && Array.isArray(draft.dates)) {
        const updatedDraft = {
          ...draft,
          dates: draft.dates.map(d => ({
            ...d,
            time: selectedTimesByIso[d.iso] || d.time || null,
          }))
        };
        sessionStorage.setItem('availabilityDraft', JSON.stringify(updatedDraft));
      }
    } catch (e) {
      // no-op
    }
    onTimesUpdated?.(hasAllTimes);
  }, [isAutoAccept, dates, selectedTimesByIso]);

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
      const LEFT_MARGIN = 24;
      const BOTTOM_MARGIN = 128; // leave space for CTA area
      const availableRight = window.innerWidth - rect.left - RIGHT_MARGIN;
      const availableLeft = rect.right - LEFT_MARGIN;
      const MAX_WIDTH = 700;
      const MIN_WIDTH = 420;
      const candidate = Math.max(availableLeft, availableRight);
      const width = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, candidate));
      const left = Math.max(LEFT_MARGIN, rect.right - width);
      const maxHeight = Math.max(240, window.innerHeight - desiredTop - BOTTOM_MARGIN);
      setPosition({ top: desiredTop, left, width, maxHeight });
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

  function persistTimesAndGoToCheckout() {
    try {
      // update draft if present; otherwise update the latest availability request
      const draft = JSON.parse(sessionStorage.getItem('availabilityDraft') || 'null');
      if (draft && Array.isArray(draft.dates)) {
        const updatedDraft = {
          ...draft,
          dates: draft.dates.map(d => ({
            ...d,
            time: selectedTimesByIso[d.iso] || d.time || timeOptions[0],
          }))
        };
        sessionStorage.setItem('availabilityDraft', JSON.stringify(updatedDraft));
      } else {
        const requests = JSON.parse(sessionStorage.getItem('availabilityRequests') || '[]');
        if (Array.isArray(requests) && requests.length > 0) {
          const lastIndex = requests.length - 1;
          const last = requests[lastIndex];
          if (last && Array.isArray(last.dates)) {
            const updatedLast = {
              ...last,
              dates: last.dates.map(d => ({
                ...d,
                time: selectedTimesByIso[d.iso] || d.time || timeOptions[0],
              }))
            };
            const next = [...requests];
            next[lastIndex] = updatedLast;
            sessionStorage.setItem('availabilityRequests', JSON.stringify(next));
            // Also set a draft so checkout reads it first
            sessionStorage.setItem('availabilityDraft', JSON.stringify({ ...updatedLast, id: 'draft' }));
          }
        }
      }
    } catch (e) {
      // no-op
    }
    onClose?.();
    navigate('/checkout');
  }

  const content = (
    <>
      <div className="booking-details-heading">Select timeslots</div>
      {dates.length === 0 ? (
        <p className="booking-description">No dates selected yet.</p>
      ) : (
        <div className="timeslot-sections">
          {dates.map((d, idx) => (
            <div key={d.iso} className="timeslot-section">
              <div className="timeslot-date">{d.formatted}</div>
              <div className="timeslot-carousel" role="radiogroup" aria-label={`Select time for ${d.formatted}`}>
                {timeOptions.map((t) => {
                  const isSelected = selectedTimesByIso[d.iso] === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`timeslot-pill${isSelected ? ' selected' : ''}`}
                      onClick={() => setSelectedTimesByIso(prev => ({ ...prev, [d.iso]: t }))}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              {idx < dates.length - 1 && <div className="divider"></div>}
            </div>
          ))}
        </div>
      )}
      {!isAutoAccept && (
        <div className="booking-cta">
          <button
            type="button"
            className={`cta-button cta-button--pill`}
            onClick={persistTimesAndGoToCheckout}
          >
            Continue to checkout
          </button>
        </div>
      )}
    </>
  );

  return isDesktop ? (
    <div
      ref={popoverRef}
      className="cta-popover"
      style={{ top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px` }}
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

