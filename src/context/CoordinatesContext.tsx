import { createContext, useState } from 'react';
import type { Coordinates } from '../types/types';

const defaultCoordinates: Coordinates = {
  lat: 40.015,
  lng: -105.2705,
};

export const CoordinatesContext = createContext(defaultCoordinates);

export const CoordinatesContextProvider = ({ children }) => {
  const [coordinates, setCoordinates] = useState(defaultCoordinates);

  return (
    <CoordinatesContext.Provider value={{ coordinates, setCoordinates }}>
      {children}
    </CoordinatesContext.Provider>
  );
};
