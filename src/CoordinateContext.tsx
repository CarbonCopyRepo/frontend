// src/types/coordinatesContextTypes.ts

export interface Coordinates {
    lat: string;
    lng: string;
}

export interface CoordinatesContextType {
    coordinates: Coordinates;
    setCoordinates: (coordinates: Coordinates) => void;
}
 
// src/context/CoordinatesContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

const CoordinatesContext = createContext

// src/context/CoordinatesContext.tsx

const defaultState: CoordinatesContextType = {
    coordinates: { lat: '', lng: '' },
    setCoordinates: () => {}
};

const CoordinateContext = createContext
