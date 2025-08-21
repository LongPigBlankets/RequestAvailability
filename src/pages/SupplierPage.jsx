import React, { useState, useEffect } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";

export default function SupplierPage() {
  const [availabilityRequests, setAvailabilityRequests] = useState([]);
  const [requestStates, setRequestStates] = useState({});

  // Fallback user names for requests without user info
  const getFallbackUserName = (index) => {
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

  // Get user display info from request or fallback
  const getUserInfo = (request, index) => {
    if (request.userInfo) {
      return {
        name: `${request.userInfo.firstName} ${request.userInfo.lastName}`,
        email: request.userInfo.email,
        phone: request.userInfo.phoneNumber
      };
    }
    
    // Fallback for old requests without user info
    const fallbackName = getFallbackUserName(index);
    const parts = fallbackName.toLowerCase().split(' ');
    const fallbackEmail = parts.length >= 2 
      ? `${parts[0]}.${parts[1]}@email.com`
      : `${parts[0]}@email.com`;
    
    return {
      name: fallbackName,
      email: fallbackEmail,
      phone: "07123456789"
    };
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

  useEffect(() => {
    // Load availability requests from session storage
    const requests = JSON.parse(sessionStorage.getItem('availabilityRequests') || '[]');
    setAvailabilityRequests(requests);
  }, []);

  return (
    <div className="app has-footer">
      <div className="header" role="banner">
        <button className="nav-button" aria-label="Go back">
          <span className="arrow-left">←</span>
        </button>
        <div className="right-actions">
          <button className="nav-button" aria-label="Share">
            <span className="share-icon">↗</span>
          </button>
          <button className="help-button">Help</button>
        </div>
      </div>

      <div className="content">
        <Breadcrumbs />
      </div>

      <div className="content">
        <h1 className="title">Supplier Dashboard</h1>
        <h2 className="section-title">Availability Requests</h2>
        
        {availabilityRequests.length === 0 ? (
          <p className="description">No availability requests yet.</p>
        ) : (
          <div className="requests-list">
            {availabilityRequests.map((request, index) => {
              const userInfo = getUserInfo(request, index);
              const requestState = requestStates[request.id] || {};
              const isRejected = requestState.status === 'rejected';
              const isAccepted = requestState.status === 'accepted';
              const selectedDateIndex = requestState.selectedDateIndex;
              
              return (
                <div key={request.id} className="request-item">
                  <div className="user-info">
                    <div className="user-header">
                      <h3 className="user-name">{userInfo.name}</h3>
                      <div className="voucher-info">
                        <span className="voucher-label">Voucher number:</span>
                        <span className="voucher-number">400000000000</span>
                      </div>
                    </div>
                    <div className="contact-info">
                      <div className="phone-info">
                        <span className="contact-label">Phone:</span>
                        <span className="contact-value">{userInfo.phone}</span>
                      </div>
                      <div className="email-info">
                        <span className="contact-label">Email:</span>
                        <span className="contact-value">{userInfo.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="requested-dates">
                    <strong>Requested dates:</strong>
                    <ul className="dates-list">
                      {request.dates.map((dateInfo, dateIndex) => {
                        const isSelected = selectedDateIndex === dateIndex;
                        const isThisAccepted = isAccepted && isSelected;
                        const isDisabled = isRejected || (isAccepted && !isSelected);
                        
                        return (
                          <li key={dateIndex} className={`date-item-wrapper ${isDisabled ? 'disabled' : ''} ${isThisAccepted ? 'accepted' : ''}`}>
                            <div className="favourited-label-space">
                              {dateInfo.isFavourite && (
                                <div className="favourited-label">favourited</div>
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
                                {dateInfo.formatted}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    
                    <div className="date-actions">
                      {!isRejected && !isAccepted && (
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
                        <div className="status-message accepted">
                          <div>Date accepted</div>
                          <div className="booking-confirmation">
                            This voucher has been booked and redeemed. It will be paid as part of the regular payment run.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="request-timestamp">
                    Requested: {new Date(request.timestamp).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}