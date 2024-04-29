import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// eslint-disable-next-line react/prop-types
export default function AnalyticsChart({ data }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="pv" stroke="#8884d8" />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
  );
}
