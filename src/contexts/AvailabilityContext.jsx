import React, { createContext, useContext, useState } from 'react';

const AvailabilityContext = createContext();

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error('useAvailability must be used within an AvailabilityProvider');
  }
  return context;
}

export function AvailabilityProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    // Load from localStorage on initialization
    try {
      const saved = localStorage.getItem('availabilityRequests');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved requests:', error);
      return [];
    }
  });

  const predefinedNames = [
    'John Smith',
    'Jane Doe', 
    'Joe Bloggs',
    'Gary Webb',
    'Luciano Goncalves'
  ];

  const addRequest = (selectedDates) => {
    const requestNumber = requests.length + 1;
    const userName = requestNumber <= 5 
      ? predefinedNames[requestNumber - 1]
      : `User ${requestNumber}`;

    const newRequest = {
      id: requestNumber,
      userName,
      dates: Array.from(selectedDates),
      timestamp: new Date().toISOString()
    };

    setRequests(prev => {
      const updated = [...prev, newRequest];
      
      // Save to localStorage
      try {
        localStorage.setItem('availabilityRequests', JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      return updated;
    });
  };

  const clearRequests = () => {
    setRequests([]);
    localStorage.removeItem('availabilityRequests');
    console.log('Cleared all requests');
  };

  const value = {
    requests,
    addRequest,
    clearRequests
  };

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
}