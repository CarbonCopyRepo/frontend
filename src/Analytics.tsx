import React from 'react';
import electricCarData from './data/ev.json';
import './Analytics.css';
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

const AnalyticsPage: React.FC = () => {
  const calculateChargingEfficiency = (carData: ElectricCarData): number => {
    // Calculate charging efficiency (km/kWh)
    return 100 / carData.energy_per_100_km;
  };

  const chargingEfficiencyData = electricCarData.map((car) => ({
    make: car.make,
    model: car.model,
    charging_efficiency: calculateChargingEfficiency(car),
    combinedLabel: '${charging_efficiency}, ${car.make}',
  }));

  const ChargingEfficiencyChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
      <ResponsiveContainer width={600} height={500}>
        <BarChart
          className="charging-efficiency-chart"
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          title="Charging Efficiency"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="model" angle={-45} textAnchor="end" interval={0} />
          <YAxis value="Charging Efficiency (km/kWh)" position="insideLeft" angle={-90} />
          <Tooltip />
          <Bar dataKey="charging_efficiency" fill="orange" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="chargingEfficiencyContainer">
      <div>
        <div className="dashboardHeader">
          <h4>Analytics Dashboard</h4>
        </div>
        <div className="chartContainer">
          <ChargingEfficiencyChart data={chargingEfficiencyData} />
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default AnalyticsPage;
