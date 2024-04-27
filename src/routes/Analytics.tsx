import React from 'react';
import { Button } from 'flowbite-react';
import AnalyticsChart from '../components/AnalyticsChart';

const AnalyticsPage: React.FC = () => {
  const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 300, pv: 1398, amt: 2210 },
    // More data can be added here
  ];

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <Button>Click me</Button>
      <AnalyticsChart data={data} />
    </div>
  );
};

export default AnalyticsPage;
