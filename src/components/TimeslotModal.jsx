import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TimeslotModal({ isOpen, onClose, anchorRef }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAutoAccept = pathname === '/autoaccept' || pathname === '/product/autoaccept';
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

  function generateTimeOptions(startHour = 9, startMinute = 0, endHour = 17, endMinute = 0, stepMinutes = 30) {
    const options = [];
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    for (let t = startTotal; t < endTotal; t += stepMinutes) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      options.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
    return options;
  }

  const timeOptions = useMemo(() => generateTimeOptions(9, 0, 17, 0, 30), []);
  const ensureValidTime = (value) => (value && timeOptions.includes(value) ? value : null);

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
            time: ensureValidTime(d.time),
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
        initial[item.iso] = ensureValidTime(item.time) || timeOptions[0];
      });
      setSelectedTimesByIso(initial);
      // also persist immediately so desktop CTA gating can enable
      try {
        const draft = JSON.parse(sessionStorage.getItem('availabilityDraft') || 'null') || {};
        const updatedDraft = {
          ...draft,
          dates: normalized.map(d => ({ ...d, time: initial[d.iso] })),
          source: isAutoAccept ? 'autoaccept' : (draft.source || 'regular'),
        };
        sessionStorage.setItem('availabilityDraft', JSON.stringify(updatedDraft));
        window.dispatchEvent(new Event('draftUpdated'));
      } catch (e) {
        // no-op
      }
    } catch (e) {
      setDates([]);
      setSelectedTimesByIso({});
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
    if (!isOpen) return;

    function updatePosition() {
      const RIGHT_MARGIN = 48;
      const LEFT_MARGIN = 24;
      const BOTTOM_MARGIN = 128; // leave space for CTA area
      const MAX_WIDTH = 700;
      const MIN_WIDTH = 420;
      const winW = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const winH = typeof window !== 'undefined' ? window.innerHeight : 768;
      if (!anchorRef?.current) {
        const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.floor(winW * 0.8)));
        const left = Math.max(LEFT_MARGIN, winW - width - RIGHT_MARGIN);
        const desiredTop = 120;
        const maxHeight = Math.max(240, winH - desiredTop - BOTTOM_MARGIN);
        setPosition({ top: desiredTop, left, width, maxHeight });
        return;
      }
      const rect = anchorRef.current.getBoundingClientRect();
      const desiredTop = rect.bottom + 8; // small offset
      const availableRight = winW - rect.left - RIGHT_MARGIN;
      const availableLeft = rect.right - LEFT_MARGIN;
      const candidate = Math.max(availableLeft, availableRight);
      const width = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, candidate));
      const left = Math.max(LEFT_MARGIN, rect.right - width);
      const maxHeight = Math.max(240, winH - desiredTop - BOTTOM_MARGIN);
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

  // Persist times on every change to selectedTimesByIso
  useEffect(() => {
    if (!isOpen) return;
    try {
      const draft = JSON.parse(sessionStorage.getItem('availabilityDraft') || 'null') || {};
      const nextDates = (dates || []).map(d => {
        const selected = ensureValidTime(selectedTimesByIso[d.iso]) || ensureValidTime(d.time) || timeOptions[0];
        return { ...d, time: selected };
      });
      const updatedDraft = {
        ...draft,
        dates: nextDates,
        source: isAutoAccept ? 'autoaccept' : (draft.source || 'regular'),
      };
      sessionStorage.setItem('availabilityDraft', JSON.stringify(updatedDraft));
      window.dispatchEvent(new Event('draftUpdated'));
    } catch (e) {
      // no-op
    }
  }, [selectedTimesByIso, dates, isOpen, isAutoAccept, timeOptions]);

  if (!isOpen) return null;

  function persistTimesAndClose() {
    try {
      // update draft if present; otherwise update the latest availability request
      const draft = JSON.parse(sessionStorage.getItem('availabilityDraft') || 'null');
      if (draft && Array.isArray(draft.dates)) {
        const updatedDraft = {
          ...draft,
          dates: draft.dates.map(d => ({
            ...d,
            time: ensureValidTime(selectedTimesByIso[d.iso]) || ensureValidTime(d.time) || timeOptions[0],
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
                time: ensureValidTime(selectedTimesByIso[d.iso]) || ensureValidTime(d.time) || timeOptions[0],
              }))
            };
            const next = [...requests];
            next[lastIndex] = updatedLast;
            sessionStorage.setItem('availabilityRequests', JSON.stringify(next));
            // Also set a draft so checkout reads it first
            sessionStorage.setItem('availabilityDraft', JSON.stringify({ ...updatedLast, id: 'draft', source: isAutoAccept ? 'autoaccept' : 'regular' }));
          }
        }
      }
    } catch (e) {
      // no-op
    }
    onClose?.();
  }

  const showGridLayout = isDesktop && dates.length > 1;

  const content = (
    <>
      {isDesktop && <div className="booking-details-heading">Select timeslots</div>}
      {dates.length === 0 ? (
        <p className="booking-description">No dates selected yet.</p>
      ) : (
        <div className={`timeslot-sections${showGridLayout ? ' timeslot-sections--grid' : ''}`}>
          {dates.map((d) => (
            <div key={d.iso} className="timeslot-card">
              <div className="timeslot-card-header">
                <div className="timeslot-date">{d.formatted}</div>
              </div>
              <div
                className="timeslot-grid"
                role="radiogroup"
                aria-label={`Select time for ${d.formatted}`}
              >
                {timeOptions.map((t) => {
                  const isSelected = selectedTimesByIso[d.iso] === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`timeslot-pill${isSelected ? ' selected' : ''}`}
                      onClick={() => {
                        setSelectedTimesByIso(prev => ({ ...prev, [d.iso]: t }));
                        if (isAutoAccept && isDesktop) onClose?.();
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      {!isAutoAccept && (
        <div className="booking-cta">
          <button
            type="button"
            className={`cta-button cta-button--pill`}
            onClick={persistTimesAndClose}
          >
            Select timeslots
          </button>
        </div>
      )}
    </>
  );

  return isDesktop ? (
    <div
      ref={popoverRef}
      className="cta-popover timeslot-popover"
      style={{
        top: `${position.top || 120}px`,
        left: `${position.left || 24}px`,
        width: `${position.width || 520}px`
      }}
      role="dialog"
      aria-modal="false"
    >
      <div className="timeslot-modal-content">
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

