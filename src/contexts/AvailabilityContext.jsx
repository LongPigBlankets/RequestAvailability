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
  const [requests, setRequests] = useState([]);

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
      timestamp: new Date()
    };

    setRequests(prev => [...prev, newRequest]);
  };

  const value = {
    requests,
    addRequest
  };

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
}