import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { EmissionsChartData } from '@/types/types';

export default function AnalyticsChart({ data }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="emissions_per_miles" stroke="#8884d8" name="Electric Cars" />
      <Line type="monotone" dataKey="emissions_per_miles" stroke="#82ca9d" name="Gas Cars" />
    </LineChart>
  );
}
