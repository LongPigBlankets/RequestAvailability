import React, { useState } from "react";

export default function DateTimeLocationPicker() {
  const [selectedLocation, setSelectedLocation] = useState("Port Lympne Kent");

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
    </div>
  );
}

