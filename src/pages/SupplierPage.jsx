import React from 'react';
import { useAvailability } from '../contexts/AvailabilityContext';

export default function SupplierPage() {
  const { requests, clearRequests, addRequest } = useAvailability();

  const handleTestRequest = () => {
    // Add a test request to verify the system works
    const testDates = new Set(['2024-08-20', '2024-07-10', '2024-08-31']);
    addRequest(testDates);
  };

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
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleTestRequest}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Add Test Request
        </button>
        <button 
          onClick={clearRequests}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#ff6b6b', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear All Requests
        </button>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <strong>Debug Info:</strong>
        <div>Requests array length: {requests.length}</div>
        <div>Requests data: {JSON.stringify(requests, null, 2)}</div>
        <div>LocalStorage data: {localStorage.getItem('availabilityRequests') || 'None'}</div>
      </div>

      {requests.length === 0 ? (
        <p>No availability requests yet. Go to <a href="/request-to-book">/request-to-book</a> and click "Check Availability" to test.</p>
      ) : (
        <div>
          <p><strong>Total requests: {requests.length}</strong></p>
          {requests.map((request) => (
            <div key={request.id} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <strong>{request.userName}:</strong> {request.dates.length > 0 ? request.dates.map(dateString => formatDateHuman(dateString)).join(', ') : 'No dates selected'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}