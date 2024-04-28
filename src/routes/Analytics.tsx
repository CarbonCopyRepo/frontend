import React from 'react';
import { Button } from 'flowbite-react';
import AnalyticsChart from '../components/AnalyticsChart';
import type { EmissionsChartData } from '@/types/types';

const AnalyticsPage: React.FC = () => {
  const testdata = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 300, pv: 1398, amt: 2210 },
    // More data can be added here
  ];

  const data: Array<EmissionsChartData> = [
    {
      vehicle_type: 'B',
      year: 2015,
      emissions_per_miles: 0.5,
    },
    {
      vehicle_type: 'B',
      year: 2016,
      emissions_per_miles: 0.6,
    },
    {
      vehicle_type: 'B',
      year: 2017,
      emissions_per_miles: 0.7,
    },
    {
      vehicle_type: 'B',
      year: 2018,
      emissions_per_miles: 0.8,
    },
    {
      vehicle_type: 'B',
      year: 2019,
      emissions_per_miles: 0.9,
    },
    {
      vehicle_type: 'Z',
      year: 2015,
      emissions_per_miles: 0.1,
    },
    {
      vehicle_type: 'Z',
      year: 2016,
      emissions_per_miles: 0.2,
    },
    {
      vehicle_type: 'Z',
      year: 2017,
      emissions_per_miles: 0.3,
    },
    {
      vehicle_type: 'Z',
      year: 2018,
      emissions_per_miles: 0.4,
    },
    {
      vehicle_type: 'Z',
      year: 2019,
      emissions_per_miles: 0.5,
    },
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
