import React, { useEffect, useMemo, useRef, useState } from "react";

const LOCATIONS = [
  "Port Lympne Kent",
  "Port Lympne Hampshire",
  "Port Lympne Essex",
];

export default function LocationActionSheet({ anchorRef, isOpen, onClose, onSelect, selected }) {
  const panelRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isOpen || !anchorRef?.current) return;
    function updatePosition() {
      const rect = anchorRef.current.getBoundingClientRect();
      const top = rect.bottom + 8;
      const width = Math.max(260, Math.min(360, rect.width));
      setPosition({ top, left: rect.left, width });
    }
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (!isOpen) return;
    function onDocClick(e) {
      const panel = panelRef.current;
      const anchor = anchorRef?.current;
      if (!panel) return;
      if (anchor && (anchor === e.target || anchor.contains(e.target))) return;
      if (!panel.contains(e.target)) onClose?.();
    }
    function onKeyDown(e) { if (e.key === 'Escape') onClose?.(); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, anchorRef, onClose]);

  if (!isOpen) return null;

  if (!isDesktop) {
    return (
      <div className="booking-overlay" role="dialog" aria-modal="true" onClick={onClose}>
        <div className="booking-backdrop"></div>
        <div className="booking-panel" onClick={(e) => e.stopPropagation()}>
          <div className="booking-header">
            <h3 className="booking-title">Choose Location</h3>
            <button className="booking-close" aria-label="Close" onClick={onClose}>×</button>
          </div>
          <div className="booking-body">
            <div role="listbox" aria-label="Choose location" className="location-dropdown" style={{ position: 'static', border: 'none', boxShadow: 'none' }}>
              {LOCATIONS.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  role="option"
                  aria-selected={selected === loc}
                  className={`location-option${selected === loc ? ' selected' : ''}`}
                  onClick={() => { onSelect?.(loc); onClose?.(); }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={panelRef} className="location-popover" style={{ top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px` }} role="listbox" aria-label="Choose location">
      {LOCATIONS.map((loc) => (
        <button
          type="button"
          key={loc}
          role="option"
          aria-selected={selected === loc}
          className={`location-option${selected === loc ? ' selected' : ''}`}
          onClick={() => { onSelect?.(loc); onClose?.(); }}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}