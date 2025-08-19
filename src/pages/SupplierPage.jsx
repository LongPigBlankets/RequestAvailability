import React from 'react';
import { useAvailability } from '../contexts/AvailabilityContext';

export default function SupplierPage() {
  const { requests } = useAvailability();

  function formatDateHuman(dateString) {
    const date = new Date(dateString);
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

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Supplier Page - Availability Requests</h1>
      
      {requests.length === 0 ? (
        <p>No availability requests yet.</p>
      ) : (
        <div>
          {requests.map((request) => (
            <div key={request.id} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <strong>{request.userName}:</strong> {request.dates.map(dateString => formatDateHuman(dateString)).join(', ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}