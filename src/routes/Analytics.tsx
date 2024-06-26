import electricCarData from '../data/ev.json';
import gasolineCarData from '../data/gasoline_vehicles.json';
import './Analytics.css';
import React, { useContext, createContext, useState, useEffect } from 'react';
import VehicleMakes from '../components/dropdowns/VehicleMakes';
import { getMakesForVehicleType } from '../apiCalls/getMakesForVehicleType';
import type { Make, ElectricCarData, GasolineCarData, VehicleData } from '../types/vehicle.types';
import { Select, Label } from 'flowbite-react';
import { CoordinatesContext } from '../App';
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Legend,
  Line,
} from 'recharts';

interface YearlyConsumption {
  year: number;
  consumptionZ?: number;
  consumptionB?: number;
  consumptionX?: number;
}

const sampleGasPrice: number = 3.0; // Adjust this value as needed
const sampleChargingPrice: number = 0.15; // Adjust this value as needed
// COORDINATES TO BE CHANGED DYNAMICALLY THROUGH COORDINATECONTEXT
const startLat: number = 40.015;
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

const calculateChargingEfficiency = (carData: ElectricCarData): number => {
  // Calculate charging efficiency (km/kWh)
  return 100 / carData.energy_per_100_km;
};

const mpgToLper100km = (mpg: number) => 235.214583 / mpg; // 235.214583 is the conversion factor from mpg to L/100km

const getFuelCost = (evData: ElectricCarData[], gasData: GasolineCarData[], distance: number) => {
  const evEfficiencyData = evData.map((car) => ({
    chargingCost: (car.energy_per_100_km / 100) * 100 * sampleChargingPrice,
    make: car.make,
    model: car.model,
    type: 'EV',
    efficiency: calculateChargingEfficiency(car),
    combinedLabel: `${car.make} ${car.model}`,
  }));

  const gasEfficiencyData = gasData.map((car) => {
    const litersPer100Km = mpgToLper100km(car.miles_per_gallon);
    const fuelCost = (100 / 100) * litersPer100Km * sampleGasPrice; // Calculate fuel cost based on distance
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

const gasolineCarCost = getFuelCost(electricCarData, gasolineCarData, distanceKm).filter(
  (item) => item.type === 'Gas'
);

const hasChargingCost = (obj: unknown): obj is { chargingCost: number } => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return 'chargingCost' in obj;
};
const evCarCost = getFuelCost(electricCarData, gasolineCarData, distanceKm).filter(hasChargingCost);

const AnalyticsPage: React.FC = () => {
  // State
  const [makes, setMakes] = useState<Array<Make>>([{ make: '' }]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const [distanceKm, setDistanceKm] = useState(() =>
    haversineDistance(startLat, startLon, endLat, endLon)
  );
  const [fuelData, setFuelData] = useState<VehicleData[]>([]);

  const handleMakeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMake(event.target.value);
    setSelectedModel('');
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  useEffect(() => {
    const setMakeData = async () => {
      const makes = await getMakesForVehicleType('X');
      setMakes(makes.data);
    };

    setMakeData();
  }, []);

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

  // Consts
  const evData = chargingEfficiencyData.filter((item) => item.type === 'EV');
  const gasolineData = chargingEfficiencyData.filter((item) => item.type === 'Gas');

  const carModels = {
    'Make A': ['Model A1', 'Model A2'],
    'Make B': ['Model B1', 'Model B2'],
    'Make C': ['Model C1', 'Model C2'],
  };

  const EVCostChart: React.FC<{ data: any[] }> = ({ data }) => {
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
    const [vehicleMakes, setVehicleMakes] = useState([]);

    useEffect(() => {
      fetch(
        'http://localhost:3000/api/emissions/yearlyByMake?vehicleType=B&make=Audi&model=e-tron%20GT'
      )
        .then((response) => response.json())
        .then((data) => {
          // Update the state with the fetched data
          setVehicleMakes(data);
        })
        .catch((error) => console.error('Error loading the data:', error));
    }, []); // The empty array makes sure this effect runs only once after the component mounts

    return (
      <div>
        <ResponsiveContainer width={1000} height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis />
            <YAxis label={{ value: 'Efficiency', angle: -90, position: 'Left' }} />
            <Tooltip />
            <Legend />
            <Line
              type="linear"
              dataKey="efficiency"
              data={vehicleMakes}
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

  const YearlyConsumptionChart: React.FC = () => {
    // const [YearlyConsumptionTypeZ, setYearlyConsumptionTypeZ] = useState<YearlyConsumption[]>([]);
    // const [YearlyConsumptionTypeB, setYearlyConsumptionTypeB] = useState<YearlyConsumptionTypeB[]>([]);

    const [combinedData, setCombinedData] = useState<YearlyConsumption[]>([]);

    useEffect(() => {
      Promise.all([
        fetch('http://localhost:3000/api/consumption/yearly?vehicleType=Z').then((res) =>
          res.json()
        ),
        fetch('http://localhost:3000/api/consumption/yearly?vehicleType=B').then((res) =>
          res.json()
        ),
        fetch('http://localhost:3000/api/consumption/yearly?vehicleType=X').then((res) =>
          res.json()
        ),
      ])
        .then(([dataZ, dataB, dataX]) => {
          const map = new Map<number, YearlyConsumption>();

          dataZ.data.forEach((item: { year: number; consumption: number }) => {
            map.set(item.year, {
              ...map.get(item.year),
              year: item.year,
              consumptionZ: item.consumption,
            });
          });

          dataB.data.forEach((item: { year: number; consumption: number }) => {
            map.set(item.year, {
              ...map.get(item.year),
              year: item.year,
              consumptionB: item.consumption,
            });
          });

          dataX.data.forEach((item: { year: number; consumption: number }) => {
            map.set(item.year, {
              ...map.get(item.year),
              year: item.year,
              consumptionX: item.consumption,
            });
          });
          setCombinedData(Array.from(map.values()));
        })
        .catch((error) => {
          console.error('Error loading data:', error);
        });
    }, []);
    return (
      <div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              label={{
                value: 'Consumption',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                dx: -30,
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="consumptionX"
              stroke="#1F5FFF"
              name="Type X (Gasoline)"
            />
            <Line
              type="monotone"
              dataKey="consumptionZ"
              stroke="#0088FF"
              name="Type Z (Gasoline)"
            />
            <Line
              type="monotone"
              dataKey="consumptionB"
              stroke="#FF0000"
              name="Type B (Electric)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="analyticsContainer">
      <div className="chargingEfficiencyContainer">
        <div className="chargingEfficiencySection">
          <div className="dashboardHeader">
            <h4>Yearly Consumption (in BTUs) for Different Vehicle Types</h4>
          </div>
          <div className="chartContainer">
            <label htmlFor="carModel">Car Model:</label>
            <select
              id="carModel"
              value={selectedModel}
              onChange={handleModelChange}
              disabled={!selectedMake}
            >
              <option value="">Select Model</option>
              {selectedMake &&
                carModels[selectedMake as keyof typeof carModels].map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
            </select>
            <div className="w-1/5">
              <Label htmlFor="make" value="Make" />
              <Select value={selectedMake} onChange={handleMakeChange} disabled={!selectedModel}>
                {makes.map((make) => {
                  return <option key={make.make}>{make.make}</option>;
                })}
              </Select>
            </div>
            <ChargingEfficiencyChart data={chargingEfficiencyData} />
          </div>
        </div>
      </div>

      <div className="chargingEfficiencyContainer">
        <div className="chargingEfficiencySection">
          <div className="dashboardHeader">
            <h4>Yearly Consumption (in BTUs) for Different Vehicle Types</h4>
          </div>
          <div className="chartContainer">
            <label htmlFor="carModel">Car Model:</label>

            <YearlyConsumptionChart />
          </div>
        </div>
      </div>

      <div className="costChartContainer">
        <div className="chargingEfficiencySection">
          <div className="dashboardHeader">
            <h4>EV Costs for 100 KM Journey</h4>
          </div>
          <div className="chartContainer">
            <EVCostChart data={evCarCost} />
          </div>
        </div>

        <div className="highEfficiencyList">
          <h5>Models</h5>
          <ul>
            {evCarCost.map((car, index) => (
              <li key={index} className="listItem">
                <div className="carInfo">{car.combinedLabel}</div>
                <div className="efficiencyInfo">
                  {'chargingCost' in car ? `$ ${car.chargingCost.toFixed(2)}` : 'No Data'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="costChartContainerGasoline">
        <div className="chargingEfficiencySection">
          <div className="dashboardHeader">
            <h4>Gasoline Costs for 100 KM Journey</h4>
          </div>
          <div className="chartContainer">
            <CostChart data={gasolineCarCost} />
          </div>
        </div>

        <div className="highEfficiencyList">
          <h5>Gaosoline Models</h5>
          <ul>
            {gasolineCarCost.map((car, index) => (
              <li key={index} className="listItem">
                <div className="carInfo">{car.model}</div>
                <div className="efficiencyInfo">
                  {'fuelCost' in car ? `$ ${car.fuelCost}` : 'No Data'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="costChartContainer">
        <div className="chargingEfficiencySection">
          <div className="dashboardHeader">
            <h4>Efficiencies For Electric & Gas Vehicles</h4>
          </div>
          <div className="chartContainer">
            <ChargingEfficiencyChart data={chargingEfficiencyData} />
          </div>
        </div>
        <div className="highEfficiencyList">
          <h5>EV Costs for 100 KM Journey</h5>
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
