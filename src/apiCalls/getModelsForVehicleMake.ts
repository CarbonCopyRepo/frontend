import type { Make } from '../types/types';

export const getModelsForVehicleMake = async (
  vehicleType: string,
  vehicleModel: string
): Promise<Make[]> => {
  const response = await fetch(
    `http://localhost:3000/api/vehicles/models?vehicleType=${vehicleType}&make=${vehicleModel}`
  );
  const data = await response.json();
  return data;
};
