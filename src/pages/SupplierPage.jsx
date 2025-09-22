import React, { useState, useEffect } from "react";
import BrandLogo from "../components/BrandLogo";
import Footer from "../components/Footer";

export default function SupplierPage() {
  const [availabilityRequests, setAvailabilityRequests] = useState([]);
  const [requestStates, setRequestStates] = useState({});
  const [cancelModalRequestId, setCancelModalRequestId] = useState(null);

  // Predefined user names for the first 5 users
  const getUserName = (index) => {
    const predefinedNames = [
      "John Smith",
      "Jane Doe", 
      "Joe Bloggs",
      "Gary Webb",
      "Luciano Goncalves"
    ];
    
    if (index < predefinedNames.length) {
      return predefinedNames[index];
    }
    
    return `User ${index + 1}`;
  };

  // Generate email from name
  const getUserEmail = (name) => {
    const parts = name.toLowerCase().split(' ');
    if (parts.length >= 2) {
      return `${parts[0]}.${parts[1]}@email.com`;
    }
    return `${parts[0]}@email.com`;
  };

  // Handle rejecting all dates for a request
  const handleRejectAll = (requestId) => {
    setRequestStates(prev => ({
      ...prev,
      [requestId]: { status: 'rejected', selectedDateIndex: null }
    }));
  };

  // Handle accepting a specific date
  const handleAcceptDate = (requestId, dateIndex) => {
    setRequestStates(prev => ({
      ...prev,
      [requestId]: { status: 'accepted', selectedDateIndex: dateIndex }
    }));
  };

  // Handle radio button selection (doesn't accept yet, just selects)
  const handleDateSelection = (requestId, dateIndex) => {
    const currentState = requestStates[requestId];
    if (currentState?.status === 'rejected' || currentState?.status === 'accepted') {
      return; // Don't allow changes if already decided
    }
    
    setRequestStates(prev => ({
      ...prev,
      [requestId]: { ...prev[requestId], selectedDateIndex: dateIndex }
    }));
  };

  // Hardcoded older booking requests that should always appear at the top
  const hardcodedRequests = [
    {
      id: -3001,
      contact: { firstName: 'John', lastName: 'Smith', phoneNumber: '0712345678', email: 'email@email.com' },
      dates: [
        { iso: '2025-12-01', formatted: '1 Dec', isFavourite: false },
        { iso: '2025-12-02', formatted: '2 Dec', isFavourite: false },
        { iso: '2025-12-03', formatted: '3 Dec', isFavourite: false },
        { iso: '2025-12-04', formatted: '4 Dec', isFavourite: false },
        { iso: '2025-12-10', formatted: '10 Dec', isFavourite: true }
      ],
      timestamp: new Date('2025-09-15T15:03:00').toISOString(),
      bookedAtDisplay: 'Booked at 15:03:00 on 15th of September'
    },
    {
      id: -3002,
      contact: { firstName: 'Janet', lastName: 'Jackson', phoneNumber: '0712345678', email: 'email@email.com' },
      dates: [
        { iso: '2026-01-05', formatted: '5 Jan', isFavourite: false },
        { iso: '2026-01-10', formatted: '10 Jan', isFavourite: false },
        { iso: '2026-01-11', formatted: '11 Jan', isFavourite: false },
        { iso: '2026-01-12', formatted: '12 Jan', isFavourite: true },
        { iso: '2026-01-13', formatted: '13 Jan', isFavourite: false }
      ],
      timestamp: new Date('2025-09-16T14:51:09').toISOString(),
      bookedAtDisplay: 'Booked at 14:51:09 on 16th of September'
    },
    {
      id: -3003,
      contact: { firstName: 'Edward', lastName: 'Andrews', phoneNumber: '0712345678', email: 'email@email.com' },
      dates: [
        { iso: '2026-01-05', formatted: '5 Jan', isFavourite: false },
        { iso: '2026-01-10', formatted: '10 Jan', isFavourite: false },
        { iso: '2026-01-11', formatted: '11 Jan', isFavourite: false },
        { iso: '2026-01-12', formatted: '12 Jan', isFavourite: true },
        { iso: '2026-01-13', formatted: '13 Jan', isFavourite: false }
      ],
      timestamp: new Date('2025-09-16T14:51:09').toISOString(),
      bookedAtDisplay: 'Booked at 14:51:09 on 16th of September'
    }
  ];

  // Cancel booking flow
  const handleOpenCancelModal = (requestId) => {
    setCancelModalRequestId(requestId);
  };

  const handleCloseCancelModal = () => {
    setCancelModalRequestId(null);
  };

  const handleConfirmCancel = () => {
    if (cancelModalRequestId === null) return;
    const requestId = cancelModalRequestId;
    setRequestStates(prev => ({
      ...prev,
      [requestId]: { status: 'cancelled', selectedDateIndex: null }
    }));
    setCancelModalRequestId(null);
  };

  useEffect(() => {
    // Load availability requests from session storage
    const requests = JSON.parse(sessionStorage.getItem('availabilityRequests') || '[]');
    setAvailabilityRequests(requests);
  }, []);

  return (
    <div className="app has-footer">
      <div className="header" role="banner">
        <BrandLogo />
        <div className="right-actions">
          <button className="nav-button" aria-label="Share">
            <span className="share-icon">↗</span>
          </button>
          <button className="help-button">Help</button>
        </div>
      </div>


      <div className="content">
        <h1 className="title">Supplier Dashboard</h1>
        <h2 className="section-title">Availability Requests</h2>
        
        {([...hardcodedRequests, ...availabilityRequests]).length === 0 ? (
          <p className="description">No availability requests yet.</p>
        ) : (
          <div className="requests-list">
            {[...hardcodedRequests, ...availabilityRequests].map((request, index) => {
              const contact = request.contact || null;
              const userName = contact && (contact.firstName || contact.lastName)
                ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                : getUserName(index);
              const phoneValue = contact?.phoneNumber || "07123456789";
              const emailValue = contact?.email || getUserEmail(userName);
              const requestState = requestStates[request.id] || {};
              const isRejected = requestState.status === 'rejected';
              const isAccepted = requestState.status === 'accepted';
              const isCancelled = requestState.status === 'cancelled';
              const selectedDateIndex = requestState.selectedDateIndex;
              
              return (
                <div key={request.id} className="request-item">
                  <div className="user-info">
                    <h3 className="user-name">{userName}</h3>
                    <div className="contact-info">
                      <div className="phone-info">
                        <span className="contact-label">Phone:</span>
                        <span className="contact-value">{phoneValue}</span>
                      </div>
                      <div className="email-info">
                        <span className="contact-label">Email:</span>
                        <span className="contact-value">{emailValue}</span>
                      </div>
                      <div className="voucher-info">
                        <span className="contact-label">Voucher:</span>
                        <span className="contact-value">400000000000</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="requested-dates">
                    <strong>Requested dates:</strong>
                    <ul className="dates-list">
                      {request.dates.map((dateInfo, dateIndex) => {
                        const formattedForPill = (() => {
                          const iso = dateInfo.iso;
                          if (iso) {
                            const d = new Date(iso + 'T00:00:00');
                            if (!isNaN(d)) {
                              const day = d.getDate();
                              const month = d.toLocaleString(undefined, { month: 'long' });
                              const ordinal = (n) => {
                                const s = ["th","st","nd","rd"]; const v = n % 100; return n + (s[(v-20)%10] || s[v] || s[0]);
                              };
                              return `${ordinal(day)} of ${month}`;
                            }
                          }
                          // Fallback to existing formatted
                          return dateInfo.formatted;
                        })();
                        const isSelected = selectedDateIndex === dateIndex;
                        const isThisAccepted = isAccepted && isSelected;
                        const isDisabled = isRejected || isCancelled || (isAccepted && !isSelected);
                        
                        return (
                          <li key={dateIndex} className={`date-item-wrapper ${isDisabled ? 'disabled' : ''} ${isThisAccepted ? 'accepted' : ''}`}>
                            <div className="favourited-label-space">
                              {dateInfo.isFavourite && (
                                <div className="favourited-label">top preference</div>
                              )}
                            </div>
                            <div className="date-selection">
                              <input
                                type="radio"
                                name={`request-${request.id}`}
                                checked={isSelected}
                                onChange={() => handleDateSelection(request.id, dateIndex)}
                                disabled={isDisabled}
                                className="date-radio"
                              />
                              <div className={`date-item ${isThisAccepted ? 'accepted' : ''} ${isDisabled ? 'disabled' : ''}`}>
                                {formattedForPill}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    
                    <div className="date-actions">
                      {!isRejected && !isAccepted && !isCancelled && (
                        <>
                          <button 
                            className="reject-all-btn"
                            onClick={() => handleRejectAll(request.id)}
                          >
                            Reject All Dates
                          </button>
                          {selectedDateIndex !== null && selectedDateIndex !== undefined && (
                            <button 
                              className="accept-selected-btn"
                              onClick={() => handleAcceptDate(request.id, selectedDateIndex)}
                            >
                              Accept Selected Date
                            </button>
                          )}
                        </>
                      )}
                      {isRejected && (
                        <div className="status-message rejected">All dates rejected</div>
                      )}
                      {isAccepted && (
                        <>
                          <div className="status-message accepted">Date accepted</div>
                          <div className="redemption-message">
                            This voucher has been booked and redeemed. It will be paid as part of the regular payment run.
                          </div>
                          <button 
                            className="reject-all-btn"
                            onClick={() => handleOpenCancelModal(request.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {isCancelled && (
                        <div className="status-message cancelled">Cancelled</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="request-timestamp">
                    {request.bookedAtDisplay ? (
                      <>
                        {request.bookedAtDisplay}
                      </>
                    ) : (
                      <>Requested: {new Date(request.timestamp).toLocaleString()}</>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {cancelModalRequestId !== null && (
        <div className="booking-overlay" role="dialog" aria-modal="true">
          <div className="booking-backdrop" onClick={handleCloseCancelModal}></div>
          <div className="booking-panel">
            <div className="booking-header">
              <div className="booking-title">Cancel booking</div>
              <button className="booking-close" aria-label="Close" onClick={handleCloseCancelModal}>×</button>
            </div>
            <div className="booking-body">
              <div className="booking-description">Are you sure you want to cancel and unredeem this voucher?</div>
              <div className="booking-cta" style={{ display: 'flex', gap: '12px' }}>
                <button className="reject-all-btn" onClick={handleConfirmCancel}>Yes, cancel booking</button>
                <button className="accept-selected-btn" onClick={handleCloseCancelModal}>No, keep booking</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}