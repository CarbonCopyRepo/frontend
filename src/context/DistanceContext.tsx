import React, { createContext, useState } from 'react';

// Create context
const DistanceContext = createContext(null);

// Provider component
// eslint-disable-next-line react/prop-types
export const DistanceProvider = ({ children }) => {
  const [averageDistance, setAverageDistance] = useState(0);

  // Context value that will be provided to the components
  const value = { averageDistance, setAverageDistance };

  return <DistanceContext.Provider value={value}>{children}</DistanceContext.Provider>;
};

// Custom hook for using this context
