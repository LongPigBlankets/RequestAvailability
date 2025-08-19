import React, { useState } from "react";

export default function DateTimeLocationPicker() {
  const [selectedLocation, setSelectedLocation] = useState("Port Lympne Kent");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDates, setSelectedDates] = useState(() => new Set());

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

  return (
    <div className="location-picker">
      <label htmlFor="location-select" className="location-label">Location</label>
      <select
        id="location-select"
        className="location-select"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
      >
        <option value="Port Lympne Kent">Port Lympne Kent</option>
        <option value="Port Lympne Hampshire">Port Lympne Hampshire</option>
        <option value="Port Lympne Essex">Port Lympne Essex</option>
      </select>

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
      </div>
    </div>
  );
}

