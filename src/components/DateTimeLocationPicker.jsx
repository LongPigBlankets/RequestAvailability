import React, { useEffect, useRef, useState } from "react";

export default function DateTimeLocationPicker() {
  const [selectedLocation, setSelectedLocation] = useState("Port Lympne Kent");
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const locationWrapperRef = useRef(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDates, setSelectedDates] = useState(() => new Set());
  const [favouriteDates, setFavouriteDates] = useState(() => new Set());

  const monthLabel = currentMonth.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

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
    const startDayOfWeek = firstOfMonth.getDay(); // 0-6 (Sun-Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const leadingBlanks = startDayOfWeek; // number of blanks before day 1
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

  const cells = buildMonthGrid(currentMonth);

  function toggleDate(iso) {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(iso)) {
        next.delete(iso);
      } else {
        next.add(iso);
      }
      return next;
    });
  }

  const selectedCount = selectedDates.size;
  const selectedSummary = selectedCount === 0
    ? "Select dates"
    : selectedCount === 1
      ? "1 date selected"
      : `${selectedCount} dates selected`;

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

  function toggleFavourite(iso) {
    setFavouriteDates((prev) => {
      const next = new Set(prev);
      if (next.has(iso)) {
        next.delete(iso);
      } else {
        next.add(iso);
      }
      return next;
    });
  }

  // Close the custom location dropdown when clicking outside
  useEffect(() => {
    function handleDocClick(ev) {
      if (!locationWrapperRef.current) return;
      if (!locationWrapperRef.current.contains(ev.target)) {
        setIsLocationMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  // Ensure the calendar is always open on desktop
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const syncOpen = () => {
      if (mql.matches) {
        setIsCalendarOpen(true);
      }
    };
    syncOpen();
    mql.addEventListener('change', syncOpen);
    return () => mql.removeEventListener('change', syncOpen);
  }, []);

  return (
    <div className="location-picker">
      <div className="location-panel">
        <div className="location-title"><span aria-hidden>📍</span> Choose Location</div>
        <label htmlFor="location-button" className="location-label">Location</label>
        <div className="location-select-wrapper" ref={locationWrapperRef}>
          <button
            id="location-button"
            type="button"
            className="location-select"
            aria-haspopup="listbox"
            aria-expanded={isLocationMenuOpen}
            onClick={() => setIsLocationMenuOpen((o) => !o)}
          >
            {selectedLocation}
            <span className="chevron" aria-hidden>{isLocationMenuOpen ? "▲" : "▼"}</span>
          </button>
          {isLocationMenuOpen && (
            <div className="location-dropdown" role="listbox" aria-label="Choose location">
              {[
                "Port Lympne Kent",
                "Port Lympne Hampshire",
                "Port Lympne Essex",
              ].map((loc) => (
                <button
                  type="button"
                  role="option"
                  key={loc}
                  aria-selected={selectedLocation === loc}
                  className={`location-option${selectedLocation === loc ? " selected" : ""}`}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setIsLocationMenuOpen(false);
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="calendar-panel">
        <div className="date-picker">
          <label className="location-label" htmlFor="date-toggle">Dates</label>
          <button
            id="date-toggle"
            type="button"
            className="date-toggle"
            aria-expanded={isCalendarOpen}
            onClick={() => setIsCalendarOpen((o) => !o)}
          >
            <span>{selectedSummary}</span>
            <span className="chevron" aria-hidden>
              {isCalendarOpen ? "▲" : "▼"}
            </span>
          </button>

          <div className={`calendar ${isCalendarOpen ? "open" : ""}`}>
            <div className="calendar-caption">Select up to 5 dates</div>
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
              {cells.map((cell) => {
                if (cell.type === "blank") {
                  return <div key={cell.key} className="calendar-blank" />;
                }
                const isSelected = selectedDates.has(cell.iso);
                return (
                  <button
                    type="button"
                    key={cell.key}
                    className={`calendar-day${isSelected ? " selected" : ""}`}
                    onClick={() => toggleDate(cell.iso)}
                    aria-pressed={isSelected}
                  >
                    {cell.number}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDates.size > 0 && (
            <div className="selected-dates-summary" aria-live="polite">
              {Array.from(selectedDates)
                .map((iso) => ({ iso, date: new Date(iso) }))
                .sort((a, b) => a.date - b.date)
                .map(({ iso, date }) => (
                  <div key={iso} className="summary-item">
                    <div className="summary-date">{formatHuman(date)}</div>
                    <div className="summary-actions">
                      <button
                        type="button"
                        className={`summary-btn favourite${favouriteDates.has(iso) ? " active" : ""}`}
                        onClick={() => toggleFavourite(iso)}
                      >
                        ⭐ Favourite
                      </button>
                      <button
                        type="button"
                        className="summary-btn remove"
                        aria-label="Remove date"
                        onClick={() => toggleDate(iso)}
                      >
                        <span aria-hidden>🗑</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

