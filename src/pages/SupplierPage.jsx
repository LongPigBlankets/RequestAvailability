import React, { useState, useEffect } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";

export default function SupplierPage() {
  const [availabilityRequests, setAvailabilityRequests] = useState([]);

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
            {availabilityRequests.map((request, index) => (
              <div key={request.id} className="request-item">
                <h3 className="user-name">{getUserName(index)}</h3>
                <div className="requested-dates">
                  <strong>Requested dates:</strong>
                  <ul className="dates-list">
                    {request.dates.map((dateInfo, dateIndex) => (
                      <li key={dateIndex} className="date-item-wrapper">
                        {dateInfo.isFavourite && (
                          <div className="favourited-label">favourited</div>
                        )}
                        <div className="date-item">
                          {dateInfo.formatted}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="request-timestamp">
                  Requested: {new Date(request.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}