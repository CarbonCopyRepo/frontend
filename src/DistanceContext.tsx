import React, { createContext, useContext, useState } from 'react';

// Create context
const DistanceContext = createContext(null);

// Provider component
export const DistanceProvider = ({ children }) => {
    const [averageDistance, setAverageDistance] = useState(0);

    // Context value that will be provided to the components
    const value = { averageDistance, setAverageDistance };

    return (
        <DistanceContext.Provider value={value}>
            {children}
        </DistanceContext.Provider>
    );
};

// Custom hook for using this context
export const useDistance = () => useContext(DistanceContext);
