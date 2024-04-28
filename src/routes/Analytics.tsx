import electricCarData from '../data/ev.json';
import gasolineCarData from '../data/gasoline_vehicles.json';
import '../Analytics.css';
import React, { useContext, createContext } from 'react';
import { CoordinatesContextType } from '../CoordinateContext';

const sampleGasPrice: number = 3.00;  // Adjust this value as needed
const sampleChargingPrice: number = 0.15;  // Adjust this value as needed

// to be updated using Context
const startLat: number = 40.7128;
const startLon: number = -74.0060;
const endLat: number = 34.0522;
const endLon: number = -118.2437;

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R: number = 6371.0;  // approximate radius of Earth in km

  const lat1Rad: number = toRadians(lat1);
  const lon1Rad: number = toRadians(lon1);
  const lat2Rad: number = toRadians(lat2);
  const lon2Rad: number = toRadians(lon2);

  const dLon: number = lon2Rad - lon1Rad;
  const dLat: number = lat2Rad - lat1Rad;

  const a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance: number = R * c;
  return distance;
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}
const distanceKm: number = haversineDistance(startLat, startLon, endLat, endLon);

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Legend,
  Line,
} from 'recharts';

interface ElectricCarData {
  year: number;
  make: string;
  model: string;
  energy_per_100_km: number;
  vehicle_type: string;
  emissions_per_km: number;
  emissions_per_mile: number;
  battery_capacity_kWh?: number;
}

interface GasolineCarData {
  year: number;
  make: string;
  model: string;
  vehicle_type: string;
  miles_per_gallon: number;
  emissions_per_km: number;
  emissions_per_mile: number;
}

// Creating the context with a default value
const defaultState: CoordinatesContextType = {
  coordinates: { lat: '', lng: '' },
  setCoordinates: () => {},
};

const calculateChargingEfficiency = (carData: ElectricCarData): number => {
  // Calculate charging efficiency (km/kWh)
  return 100 / carData.energy_per_100_km;
};


const prepareData = (evData: ElectricCarData[], gasData: GasolineCarData[]) => {
  const evEfficiencyData = evData.map(car => ({
    make: car.make,
    model: car.model,
    type: 'EV',
    efficiency: calculateChargingEfficiency(car),
    combinedLabel: `${car.make} ${car.model}`,
  }));

  const gasEfficiencyData = gasData.map(car => {
    const litersPer100Km = mpgToLper100km(car.miles_per_gallon);
    const fuelCost = (distanceKm / 100) * litersPer100Km * sampleGasPrice; // Calculate fuel cost based on distance
    return {
      make: car.make,
      model: car.model,
      type: 'Gas',
      efficiency: car.miles_per_gallon,
      combinedLabel: `${car.make} ${car.model}`,
      fuelCost: fuelCost.toFixed(2) // Keep it to two decimal places
    };
  });

  return [...evEfficiencyData, ...gasEfficiencyData];
};

// Creating the context
const CoordinateContext = createContext(defaultState);
const mpgToLper100km = (mpg: number) => 235.214583 / mpg; // 235.214583 is the conversion factor from mpg to L/100km

const AnalyticsPage: React.FC = () => {

  const { coordinates, setCoordinates } = useContext(CoordinateContext) 

  console.log(coordinates); // Using coordinates


  const prepareData = (evData: ElectricCarData[], gasData: GasolineCarData[]) => {
    const evEfficiencyData = evData
      .map((car) => ({
        make: car.make,
        model: car.model,
        type: 'EV',
        efficiency: 100 / car.energy_per_100_km, // EV efficiency: higher is better
        combinedLabel: `${car.make} ${car.model}`,
      }))
      .sort((a, b) => b.efficiency - a.efficiency);

    const gasEfficiencyData = gasData
      .map((car) => ({
        make: car.make,
        model: car.model,
        type: 'Gas',
        efficiency: car.miles_per_gallon, // Use MPG directly to align conceptually with km/kWh
        combinedLabel: `${car.make} ${car.model}`,
      }))
      .sort((a, b) => b.efficiency - a.efficiency);

    return [...evEfficiencyData, ...gasEfficiencyData];
  };

  const chargingEfficiencyData = prepareData(electricCarData, gasolineCarData);
  const evData = chargingEfficiencyData.filter((item) => item.type === 'EV');
  const gasolineData = chargingEfficiencyData.filter((item) => item.type === 'Gas');

  const ChargingEfficiencyChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
      <div>
        <ResponsiveContainer width={1000} height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis />
            <YAxis label={{ value: 'Efficiency', angle: -90, position: 'Left' }} />
            <Tooltip />
            <Legend />
            {/* Line for EV data */}
            {/* Line for Gasoline data */}
            <Line
              type="linear"
              dataKey="efficiency"
              data={gasolineData}
              name="Gasoline (km/kWh)"
              stroke="#0088FF"
            />
            <Line
              type="linear"
              dataKey="efficiency"
              data={evData}
              name="EV (L/100km)"
              stroke="#F75B20"
            />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width={1000} height={400}>
          <LineChart data={data}>
            <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={gasolineData}>
            <Bar dataKey="fuelCost" fill="#8884d8" name="Fuel Cost" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="analyticsContainer">
      <div className="chargingEfficiencyContainer">
        <div className="chargingEfficiencySection">
          <div className="dashboardHeader">
            <h4>Analytics Dashboard</h4>
          </div>
          <div className="chartContainer">
            <ChargingEfficiencyChart data={chargingEfficiencyData} />
          </div>
        </div>
        <div className="highEfficiencyList">
          <h5>Top Charging Efficiencies</h5>
          <ul>
            {chargingEfficiencyData.map((car, index) => (
              <li key={index} className="listItem">
                <div className="carInfo">{car.combinedLabel}</div>
                <div className="efficiencyInfo">
                  {car.efficiency.toFixed(2)} {car.type === 'EV' ? 'km/kWh' : 'L/100km'}
                </div>
                <div className="typeInfo">{car.type}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
