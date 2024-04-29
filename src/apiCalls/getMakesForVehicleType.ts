import type { Make } from '../types/vehicle.types';

export const getMakesForVehicleType = async (vehicleType: string): Promise<Array<Make>> => {
  const response = await fetch(
    `http://localhost:3000/api/vehicles/makes?vehicleType=${vehicleType}`
  );
  const data = await response.json();
  return data;
};
