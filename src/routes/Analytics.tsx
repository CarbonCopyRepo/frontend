import React from 'react';
import { CoordinatesContextType } from '@/CoordinateContext';
import electricCarData from '../data/ev.json';
import gasolineCarData from '../data/gasoline_vehicles.json'
import '../Analytics.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Legend, Line} from 'recharts';




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



const mpgToLper100km = (mpg : number) => 235.214583 / mpg;  // 235.214583 is the conversion factor from mpg to L/100km

const AnalyticsPage: React.FC = () => {

    const calculateChargingEfficiency = (carData: ElectricCarData): number => {
        // Calculate charging efficiency (km/kWh)
        return 100 / carData.energy_per_100_km;
      };

    // const chargingEfficiencyData = electricCarData.map((car) => ({
    //     make: car.make,
    //     model: car.model,
    //     charging_efficiency: calculateChargingEfficiency(car),
    //     combinedLabel : `${car.make}`
    // }))
    // .sort((a, b) => b.charging_efficiency - a.charging_efficiency);  // Sorting by efficiency descending

    const prepareData = (evData : ElectricCarData[] , gasData : GasolineCarData[]) => {
 const evEfficiencyData = evData.map((car) => ({
        make: car.make,
        model: car.model,
        type: 'EV',
        efficiency: 100 / car.energy_per_100_km,  // EV efficiency: higher is better
        combinedLabel: `${car.make} ${car.model}`
    })).sort((a, b) => b.efficiency - a.efficiency);

    const gasEfficiencyData = gasData.map(car => ({
        make: car.make,
        model: car.model,
        type: 'Gas',
        efficiency: car.miles_per_gallon,  // Use MPG directly to align conceptually with km/kWh
        combinedLabel: `${car.make} ${car.model}`
    })).sort((a, b) => b.efficiency - a.efficiency);

    return [...evEfficiencyData, ...gasEfficiencyData];
  };
  
  const chargingEfficiencyData = prepareData(electricCarData, gasolineCarData);
  const evData = chargingEfficiencyData.filter((item) => item.type === 'EV');
  const gasolineData = chargingEfficiencyData.filter((item) => item.type === 'Gas');

    const ChargingEfficiencyChart: React.FC<{ data: any[] }> = ({ data }) => {
        return (
          <ResponsiveContainer width={1000} height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis  />
              <YAxis label={{ value: 'Efficiency', angle: -90, position: 'Left'}} />
              <Tooltip />
              <Legend />
              {/* Line for EV data */}
              {/* Line for Gasoline data */}
              <Line type="linear" dataKey="efficiency" data={gasolineData} name="Gasoline (km/kWh)" stroke="#0088FF" />
              <Line type="linear" dataKey="efficiency" data={evData} name="EV (L/100km)" stroke = "#F75B20" />

            </LineChart>
          </ResponsiveContainer>
        );
      };

      return (
        <div className='analyticsContainer'>
            <div className = 'chargingEfficiencyContainer'>
                <div className = 'chargingEfficiencySection'>
                    <div className="dashboardHeader">
                        <h4>Analytics Dashboard</h4>
                    </div>
                    <div className = "chartContainer">
                        <ChargingEfficiencyChart data={chargingEfficiencyData} />
                    </div>
                </div>
                <div className="highEfficiencyList">
                    <h5>Top Charging Efficiencies</h5>
                    <ul>
                        {chargingEfficiencyData.map((car, index) => (
                            <li key={index} className="listItem">
                                <div className="carInfo">{car.combinedLabel}</div>
                                <div className="efficiencyInfo">{car.efficiency.toFixed(2)} {car.type === 'EV' ? 'km/kWh' : 'L/100km'}</div>
                                <div className="typeInfo">{car.type}</div>

                            </li>
                        ))}
                    </ul> 
                </div>
            </div>
        </div>
    );
    
  }    

export default AnalyticsPage;
