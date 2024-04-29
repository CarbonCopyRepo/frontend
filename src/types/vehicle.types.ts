export type Make = {
  make: string;
};

export type Model = {
  model: string;
};

export type ElectricCarData = {
  year: number;
  make: string;
  model: string;
  energy_per_100_km: number;
  vehicle_type: string;
  emissions_per_km: number;
  emissions_per_mile: number;
  battery_capacity_kWh?: number;
};

export type GasolineCarData = {
  year: number;
  make: string;
  model: string;
  vehicle_type: string;
  miles_per_gallon: number;
  emissions_per_km: number;
  emissions_per_mile: number;
};

export type VehicleData = ElectricCarData | GasolineCarData;
