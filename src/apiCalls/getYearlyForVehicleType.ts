import type { Vehicle } from '../types/types';

export const getYearlyForVehicleType = async (
  vehicleType: string,
  vehicleMake: string,
  vehicleModel: string
): Promise<Vehicle[]> => {
  const response = await fetch(
    `http://localhost:3000/api/emissions/yearlyByMake?vehicleType=${vehicleType}&make=${vehicleMake}&model=${vehicleModel}`
  );
  const data = await response.json();
  return data;
};
