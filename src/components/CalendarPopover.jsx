import React, { useEffect, useMemo, useRef, useState } from "react";

export default function CalendarPopover({ anchorRef, onClose }) {
  const popoverRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const MAX_SELECTED_DATES = 5;
  const [selectedDates, setSelectedDates] = useState(() => new Set());
  const [showMaxWarning, setShowMaxWarning] = useState(false);

  function addMonths(baseDate, delta) {
    return new Date(baseDate.getFullYear(), baseDate.getMonth() + delta, 1);
  }

  function formatISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function buildMonthGrid(firstOfMonth) {
    const year = firstOfMonth.getFullYear();
    const month = firstOfMonth.getMonth();
    const startDayOfWeek = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const leadingBlanks = startDayOfWeek;
    const totalCells = leadingBlanks + daysInMonth;
    const trailingBlanks = (7 - (totalCells % 7)) % 7;
    const gridSize = totalCells + trailingBlanks;

    const cells = [];
    for (let i = 0; i < gridSize; i += 1) {
      const dayNumber = i - leadingBlanks + 1;
      if (i < leadingBlanks || dayNumber > daysInMonth) {
        cells.push({ key: `blank-${i}`, type: "blank" });
      } else {
        const dateObj = new Date(year, month, dayNumber);
        const iso = formatISO(dateObj);
        cells.push({ key: iso, type: "day", date: dateObj, iso, number: dayNumber });
      }
    }
    return cells;
  }

  const monthLabel = useMemo(() => currentMonth.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  }), [currentMonth]);

  const firstMonthCells = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);
  const secondMonthCells = useMemo(() => buildMonthGrid(addMonths(currentMonth, 1)), [currentMonth]);

  function toggleDate(iso, isDisabled) {
    if (isDisabled) return;
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(iso)) {
        next.delete(iso);
        return next;
      }
      if (next.size >= MAX_SELECTED_DATES) {
        setShowMaxWarning(true);
        return next;
      }
      next.add(iso);
      return next;
    });
  }

  useEffect(() => {
    if (selectedDates.size < MAX_SELECTED_DATES) {
      setShowMaxWarning(false);
    }
  }, [selectedDates]);

  // Track viewport type and open behavior
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  // Position popover near anchor on desktop and update on scroll/resize
  useEffect(() => {
    if (!anchorRef?.current) return;

    function updatePosition() {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const desiredTop = rect.bottom + 8; // 8px offset
      const availableRight = window.innerWidth - rect.left;
      const maxWidth = Math.min(420, availableRight - 16); // keep within viewport
      setPosition({ top: desiredTop, left: rect.left, width: Math.max(300, maxWidth) });
    }

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorRef]);

  // Close on outside click (desktop) and on Escape
  useEffect(() => {
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
  }, [anchorRef, onClose]);

  const isMobile = !isDesktop;

  return (
    <>
      {isDesktop ? (
        <div
          ref={popoverRef}
          className="cta-popover"
          style={{ top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px` }}
          role="dialog"
          aria-modal="false"
        >
          <div className="calendar open">
            <div className="calendar-caption">Select up to 5 dates</div>
            <div className="calendar-desktop-container">
              <div className="calendar-month">
                <div className="calendar-header">
                  <button
                    type="button"
                    className="calendar-nav"
                    aria-label="Previous month"
                    onClick={() => setCurrentMonth((m) => addMonths(m, -1))}
                  >
                    ‹
                  </button>
                  <div className="calendar-title">{monthLabel}</div>
                  <div className="calendar-nav-spacer"></div>
                </div>
                <div className="calendar-weekdays">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>
                <div className="calendar-grid">
                  {firstMonthCells.map((cell) => {
                    if (cell.type === 'blank') return <div key={cell.key} className="calendar-blank" />;
                    const isSelected = selectedDates.has(cell.iso);
                    const isSaturday = cell.date.getDay() === 6;
                    return (
                      <button
                        type="button"
                        key={cell.key}
                        className={`calendar-day${isSelected ? ' selected' : ''}${isSaturday ? ' disabled' : ''}`}
                        onClick={() => toggleDate(cell.iso, isSaturday)}
                        aria-pressed={isSelected}
                        aria-disabled={isSaturday}
                        disabled={isSaturday}
                      >
                        {cell.number}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="calendar-month">
                <div className="calendar-header">
                  <div className="calendar-nav-spacer"></div>
                  <div className="calendar-title">{addMonths(currentMonth, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
                  <button
                    type="button"
                    className="calendar-nav"
                    aria-label="Next month"
                    onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                  >
                    ›
                  </button>
                </div>
                <div className="calendar-weekdays">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>
                <div className="calendar-grid">
                  {secondMonthCells.map((cell) => {
                    if (cell.type === 'blank') return <div key={cell.key} className="calendar-blank" />;
                    const isSelected = selectedDates.has(cell.iso);
                    const isSaturday = cell.date.getDay() === 6;
                    return (
                      <button
                        type="button"
                        key={cell.key}
                        className={`calendar-day${isSelected ? ' selected' : ''}${isSaturday ? ' disabled' : ''}`}
                        onClick={() => toggleDate(cell.iso, isSaturday)}
                        aria-pressed={isSelected}
                        aria-disabled={isSaturday}
                        disabled={isSaturday}
                      >
                        {cell.number}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="calendar-microcopy">Note: This voucher cannot be booked on Saturdays</div>
            {showMaxWarning && (
              <div className="calendar-warning" role="alert" aria-live="assertive">
                Please select a maximum of 5 dates
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="booking-overlay" role="dialog" aria-modal="true" onClick={onClose}>
          <div className="booking-backdrop"></div>
          <div className="booking-panel" onClick={(e) => e.stopPropagation()}>
            <div className="booking-header">
              <h3 className="booking-title">Choose Dates</h3>
              <button className="booking-close" aria-label="Close" onClick={onClose}>×</button>
            </div>
            <div className="booking-body">
              <div className="calendar open">
                <div className="calendar-header">
                  <button
                    type="button"
                    className="calendar-nav"
                    aria-label="Previous month"
                    onClick={() => setCurrentMonth((m) => addMonths(m, -1))}
                  >
                    ‹
                  </button>
                  <div className="calendar-title">{monthLabel}</div>
                  <button
                    type="button"
                    className="calendar-nav"
                    aria-label="Next month"
                    onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                  >
                    ›
                  </button>
                </div>
                <div className="calendar-weekdays">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>
                <div className="calendar-grid">
                  {firstMonthCells.map((cell) => {
                    if (cell.type === 'blank') return <div key={cell.key} className="calendar-blank" />;
                    const isSelected = selectedDates.has(cell.iso);
                    const isSaturday = cell.date.getDay() === 6;
                    return (
                      <button
                        type="button"
                        key={cell.key}
                        className={`calendar-day${isSelected ? ' selected' : ''}${isSaturday ? ' disabled' : ''}`}
                        onClick={() => toggleDate(cell.iso, isSaturday)}
                        aria-pressed={isSelected}
                        aria-disabled={isSaturday}
                        disabled={isSaturday}
                      >
                        {cell.number}
                      </button>
                    );
                  })}
                </div>
                <div className="calendar-microcopy">Note: This voucher cannot be booked on Saturdays</div>
                {showMaxWarning && (
                  <div className="calendar-warning" role="alert" aria-live="assertive">
                    Please select a maximum of 5 dates
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}