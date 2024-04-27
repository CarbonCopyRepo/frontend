import React from 'react';
import electricCarData from '../data/ev.json';
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

const AnalyticsPage: React.FC = () => {

    const calculateChargingEfficiency = (carData: ElectricCarData): number => {
        // Calculate charging efficiency (km/kWh)
        return 100 / carData.energy_per_100_km;
      };

    const chargingEfficiencyData = electricCarData.map((car) => ({
        make: car.make,
        model: car.model,
        charging_efficiency: calculateChargingEfficiency(car),
        combinedLabel : `${car.make}`
    }))
    .sort((a, b) => b.charging_efficiency - a.charging_efficiency);  // Sorting by efficiency descending

    const ChargingEfficiencyChart: React.FC<{ data: any[] }> = ({ data }) => {
        return (
          <ResponsiveContainer width={1000} height={400} >
            <BarChart className="charging-efficiency-chart" data={data} margin={{ top: 0, right: 30, left: 20, bottom: 0 }} title='Charging Efficiency'>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis  />
              <YAxis value = "Charging Efficiency (km/kWh)" position="insideLeft"/>
              <Tooltip />
              <Bar dataKey = "charging_efficiency" fill="#F75B20" />
            </BarChart>
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
                    {chargingEfficiencyData.map((car, index) => (
                      <li key={index} className="listItem">
                          <div className="carInfo">{car.combinedLabel}   :   {car.model}</div>
                          <div className="efficiencyInfo">{car.charging_efficiency.toFixed(2)} km/kWh</div>
                      </li>
 
                  ))}
                </div>
            </div>
        </div>
    );
  }    

export default AnalyticsPage;
