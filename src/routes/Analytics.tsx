import electricCarData from '../data/ev.json';
import gasolineCarData from '../data/gasoline_vehicles.json';
import '../Analytics.css';
import React, { useContext, createContext , useState, useEffect} from 'react';
const sampleGasPrice: number = 3.0; // Adjust this value as needed
const sampleChargingPrice: number = 0.15; // Adjust this value as needed



// COORDINATES TO BE CHANGED DYNAMICALLY THROUGH COORDINATECONTEXT
const startLat: number = 40.0150;
const startLon: number = -105.2705;
const endLat: number = 36.7783;
const endLon: number = -119.4179;

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R: number = 6371.0; // approximate radius of Earth in km

  const lat1Rad: number = toRadians(lat1);
  const lon1Rad: number = toRadians(lon1);
  const lat2Rad: number = toRadians(lat2);
  const lon2Rad: number = toRadians(lon2);

  const dLon: number = lon2Rad - lon1Rad;
  const dLat: number = lat2Rad - lat1Rad;

  const a: number =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance: number = R * c;
  return distance;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
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

type VehicleData = ElectricCarData | GasolineCarData;

// const defaultState: CoordinatesContextType = {
//   coordinates: { lat: '', lng: '' },
//   setCoordinates: () => {},
// };

const calculateChargingEfficiency = (carData: ElectricCarData): number => {
  // Calculate charging efficiency (km/kWh)
  return 100 / carData.energy_per_100_km;
};

const mpgToLper100km = (mpg: number) => 235.214583 / mpg; // 235.214583 is the conversion factor from mpg to L/100km

const getFuelCost = (evData: ElectricCarData[], gasData: GasolineCarData[], distance :number) => {

  const evEfficiencyData = evData.map((car) => ({
    chargingCost : (((car.energy_per_100_km / 100) * distanceKm) * sampleChargingPrice),
    make: car.make,
    model: car.model,
    type: 'EV',
    efficiency: calculateChargingEfficiency(car),
    combinedLabel: `${car.make} ${car.model}`,
  }));

  const gasEfficiencyData = gasData.map((car) => {
    const litersPer100Km = mpgToLper100km(car.miles_per_gallon);
    const fuelCost = (distance / 100) * litersPer100Km * sampleGasPrice; // Calculate fuel cost based on distance
    return {
      make: car.make,
      model: car.model,
      type: 'Gas',
      efficiency: car.miles_per_gallon,
      combinedLabel: `${car.make} ${car.model}`,
      fuelCost: fuelCost.toFixed(2), // Keep it to two decimal places
    };
  });

  return [...evEfficiencyData, ...gasEfficiencyData];
};

const gasolineCarCost = getFuelCost(electricCarData, gasolineCarData, distanceKm).filter((item) => item.type === 'Gas');

const hasChargingCost = (obj: any): obj is { chargingCost: number } => {
  return 'chargingCost' in obj;
};
const evCarCost = getFuelCost(electricCarData, gasolineCarData, distanceKm).filter(hasChargingCost);

const AnalyticsPage: React.FC = () => {

  const [coordinates, setCoordinates] = useState({ lat: 40.015, lng: -105.2705 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoordinates({ ...coordinates, [e.target.name]: parseFloat(e.target.value) });

  };


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

  const EVCostChart: React.FC<{ data: any[] }> = ({ data }) => {

    
    const [vehicleMakes, setVehicleMakes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/vehicles/makes?vehicleType=Z')
            .then(response => response.json())
            .then(data => {
                // Update the state with the fetched data
                setVehicleMakes(data);
                console.log("First entry in the response:", data[0]);  // Log the first entry to the console

            })
            .catch(error => console.error('Error loading the data:', error));
    }, []);  // The empty array makes sure this effect runs only once after the component mounts


    return (
      <ResponsiveContainer width={1000} height={400}>
        <LineChart data={evCarCost}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis />
          <YAxis label={{ value: 'Charging Cost($)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="linear" dataKey="chargingCost" stroke="#F75B20" name="Dollars" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const CostChart: React.FC<{ data: any[] }> = ({ data }) => {

    const [coordinates, setCoordinates] = useState({ lat: 40.0150, lng: -105.2705 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCoordinates(prevCoords => ({
        ...prevCoords,
        [e.target.name]: parseFloat(e.target.value) || 0 // Ensuring valid float or defaulting to 0
      }));
    };    
    const [distanceKm, setDistanceKm] = useState(() => haversineDistance(startLat, startLon, endLat, endLon));
    const [fuelData, setFuelData] = useState<VehicleData[]>([]);
    
    
      
    return (

    <div>       
      <ResponsiveContainer width={1000} height={400}>
        <LineChart data={gasolineCarCost}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis />
          <YAxis label={{ value: 'Fuel Cost ($)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="linear" dataKey="fuelCost" stroke="#0088FF" name="Dollars" />
        </LineChart>
      </ResponsiveContainer>
    </div>      
    );
  };

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
      </div>
    );
  };

  return (

    
    <div className="analyticsContainer">
{/* 
        <div className="form-container">
          <form className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              name="lat"
              value={coordinates.lat.toString()}
              onChange={handleChange}
              placeholder="Latitude"
            />
            <input
              type="text"
              className="form-control"
              name="lng"
              value={coordinates.lng.toString()}
              onChange={handleChange}
              placeholder="Longitude"
            />

             <div className="input-group-append">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Find Stations'}
              </button>
            </div> 
          </form>
        </div> */}


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

      <div className="costChartContainer">
        <div className="chargingEfficiencySection">
          <div className="dashboardHeader">
            <h4>Analytics Dashboard</h4>
          </div>
          <div className="chartContainer">
            <EVCostChart data = {evCarCost}/>
            </div>
          </div>
          
          <div className="highEfficiencyList">
            <h5>Charging Costs</h5>
            <ul>
              {evCarCost.map((car, index) => (
                <li key={index} className="listItem">
                  <div className="carInfo">{car.combinedLabel}</div>
                    <div className="efficiencyInfo">
                    {('chargingCost' in car) ? `$ ${car.chargingCost.toFixed(2)}`  : 'No Data'}
                    </div>                    
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="costChartContainerGasoline">
          <div className="chargingEfficiencySection">
            <div className="dashboardHeader">
              <h4>Analytics Dashboard</h4>
            </div>
            <div className="chartContainer">
              <CostChart data = {gasolineCarCost}/>
              </div>
            </div>
            
            <div className="highEfficiencyList">
              <h5>Charging Costs for Gasoline Vehicles</h5>
              <ul>
                {gasolineCarCost.map((car, index) => (
                  <li key={index} className="listItem">
                    <div className="carInfo">{car.model}</div>
                      <div className="efficiencyInfo">
                      {('fuelCost' in car) ? `$ ${car.fuelCost}`  : 'No Data'}
                      </div>                    
                  </li>
                ))}
              </ul>
            </div>
        </div>
    </div>
  );
};

export default AnalyticsPage;
