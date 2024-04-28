export type Address = {
  label: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  state: string;
  county: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  houseNumber: string;
};

export type Position = {
  lat: number;
  lng: number;
};

export type Access = {
  lat: number;
  lng: number;
};

export type Categoryb = {
  id: string;
  name: string;
  primary: boolean;
};

export type Chain = {
  id: string;
  name: string;
};

export type ContactPhone = {
  value: string;
};

export type ContactWww = {
  value: string;
};

export type Contacts = {
  phone: ContactPhone[];
  www: ContactWww[];
};

export type ChargingStation = {
  title: string;
  id: string;
  language: string;
  resultType: string;
  address: Address;
  position: Position;
  access: Access[];
  distance: number;
  categories: Category[];
  chains: Chain[];
  contacts: Contacts[];
};

export type VisibilityMap = {
  [key: string]: boolean;
};

export type ImageMap = {
  [key: string]: string;
};

export type ElectricVehicle = {
  year: number;
  make: string;
  model: string;
  energy_per_100_km: number;
  vehicle_type: string;
  emissions_per_km: number;
  emissions_per_mile: number;
};

export type GasolineVehicle = {
  year: number;
  make: string;
  model: string;
  vehicle_type: string;
  miles_per_gallon: number;
  emissions_per_km: number;
  emissions_per_mile: number;
};

export type EmissionsChartData = {
  vehicle_type: string;
  year: number;
  emmissions_per_miles: number;
};
