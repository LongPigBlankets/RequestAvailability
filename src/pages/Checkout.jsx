import React, { useState, useEffect } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import { PRODUCT_TITLE } from "../constants";

export default function Checkout() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentRequest, setCurrentRequest] = useState(null);

  // Load the most recent availability request from session storage
  useEffect(() => {
    const requests = JSON.parse(sessionStorage.getItem('availabilityRequests') || '[]');
    if (requests.length > 0) {
      // Get the most recent request (last in array)
      setCurrentRequest(requests[requests.length - 1]);
    }
  }, []);

  // Whether any date has been favourited in the current request
  const anyFavourited = currentRequest?.dates?.some(d => d.isFavourite);

  // Toggle favorite status for a specific date
  const toggleFavorite = (dateIso) => {
    if (!currentRequest) return;

    const target = currentRequest.dates.find(d => d.iso === dateIso);
    const willBeFavourite = !target?.isFavourite;
    const updatedRequest = {
      ...currentRequest,
      dates: currentRequest.dates.map(date => ({
        ...date,
        isFavourite: date.iso === dateIso ? willBeFavourite : false
      }))
    };

    setCurrentRequest(updatedRequest);

    // Update session storage
    const requests = JSON.parse(sessionStorage.getItem('availabilityRequests') || '[]');
    const updatedRequests = requests.map(request => 
      request.id === currentRequest.id ? updatedRequest : request
    );
    sessionStorage.setItem('availabilityRequests', JSON.stringify(updatedRequests));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendRequest = () => {
    if (validateForm()) {
      // Store form data (in a real app, this would be sent to a server)
      sessionStorage.setItem('checkoutData', JSON.stringify(formData));
      // Attach contact details to the corresponding availability request
      const requests = JSON.parse(sessionStorage.getItem('availabilityRequests') || '[]');
      if (currentRequest) {
        const updatedRequests = requests.map(request => 
          request.id === currentRequest.id ? { ...request, contact: { ...formData } } : request
        );
        sessionStorage.setItem('availabilityRequests', JSON.stringify(updatedRequests));
      }
      setShowToast(true);
    }
  };

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
        <h1 className="title">Complete Your Request</h1>
        <p className="description">
          Please provide your contact details to send the availability request for {PRODUCT_TITLE}.
        </p>
      </div>

      <div className="content">
        <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`form-input ${errors.firstName ? 'error' : ''}`}
              placeholder="Enter your first name"
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`form-input ${errors.lastName ? 'error' : ''}`}
              placeholder="Enter your last name"
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>
        </form>
      </div>

      {currentRequest && (
        <div className="content">
          <h2 className="section-title">Summary</h2>
          
          <div className="summary-section">
            <div className="summary-location">
              <span className="summary-label">📍 Location:</span>
              <span className="summary-value">{currentRequest.location}</span>
            </div>
            
            <div className="summary-dates">
              <span className="summary-label">📅 Selected Dates:</span>
              <p className="description" style={{ marginTop: 8 }}>
                Mark one Favourite so the supplier knows which date to prioritise.
              </p>
              <div className="dates-summary-list">
                {currentRequest.dates.map((date) => (
                  <div key={date.iso} className="date-summary-item">
                    <span className="date-summary-text">{date.formatted}</span>
                    {(!anyFavourited || date.isFavourite) && (
                      <button
                        type="button"
                        className={`favorite-btn ${date.isFavourite ? 'active' : ''}`}
                        onClick={() => toggleFavorite(date.iso)}
                        aria-label={date.isFavourite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <span className="star-icon">⭐</span>
                        <span className="favorite-text">Favourite</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ctaBar">
        <div className="ctaInner">
          <div className="cta-microcopy">
            This will send a request to check these dates' availability with the experience provider. 
            Expect an email with the response within 24h of requesting.
          </div>
          <button 
            className="cta-button" 
            type="button" 
            onClick={handleSendRequest}
          >
            Send Request
          </button>
        </div>
      </div>

      {showToast && (
        <div className="toast toast-success" role="status" aria-live="polite">
          <div className="toast-content">
            Your request has been sent successfully! We will email you with the availability response within 24 hours.
          </div>
          <button className="toast-close" aria-label="Close notification" onClick={() => setShowToast(false)}>×</button>
        </div>
      )}

      <Footer />
    </div>
  );
}