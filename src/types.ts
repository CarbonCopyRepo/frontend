interface Address {
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
  }
  
  interface Position {
    lat: number;
    lng: number;
  }
  
  interface Access {
    lat: number;
    lng: number;
  }
  
  interface Category {
    id: string;
    name: string;
    primary: boolean;
  }
  
  interface Chain {
    id: string;
    name: string;
  }
  
  interface ContactPhone {
    value: string;
  }
  
  interface ContactWww {
    value: string;
  }
  
  interface Contacts {
    phone: ContactPhone[];
    www: ContactWww[];
  }
  
  interface ChargingStation {
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
  }
  
  interface VisibilityMap {
    [key: string]: boolean;
  }
  
  interface ImageMap {
    [key: string]: string;
  }