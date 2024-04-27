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
