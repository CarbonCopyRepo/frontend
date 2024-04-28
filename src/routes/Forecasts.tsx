// src/routes/ForecastsPage.tsx
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const carMakes = ['Make A', 'Make B', 'Make C']; // Dummy car makes
const carModels = {
  'Make A': ['Model A1', 'Model A2'],
  'Make B': ['Model B1', 'Model B2'],
  'Make C': ['Model C1', 'Model C2'],
};

const dummyData = {
  labels: ['2020', '2021', '2022'],
  datasets: [
    {
      label: 'Model A1 Emissions',
      data: [120, 115, 110],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
};

const Forecasts: React.FC = () => {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const handleMakeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMake(event.target.value);
    setSelectedModel('');
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  return (
    <div>
      <h1>Vehicle Emissions Data</h1>
      <div style={{ maxWidth: 600, margin: 'auto' }}>
        <div>
          <label htmlFor="carMake">Car Make:</label>
          <select id="carMake" value={selectedMake} onChange={handleMakeChange}>
            <option value="">Select Make</option>
            {carMakes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>

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
        </div>
        <div style={{ width: '100%', height: '300px' }}>
          {' '}
          {/* Control the size of the chart here */}
          <Line data={dummyData} />
        </div>
      </div>
    </div>
  );
};

export default Forecasts;
