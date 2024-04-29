import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const vehicleTypes = [
  { label: 'Regular (X)', value: 'X' },
  { label: 'Premium (Z)', value: 'Z' },
  { label: 'Diesel (D)', value: 'D' },
  { label: 'Battery (B)', value: 'B' }
];

const Forecasts = () => {
  const [vehicleType, setVehicleType] = useState('');
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [emissionsData, setEmissionsData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (vehicleType) {
      fetchMakes(vehicleType);
    }
  }, [vehicleType]);

  useEffect(() => {
    if (selectedMake && vehicleType) {
      fetchModels(selectedMake, vehicleType);
    }
  }, [selectedMake, vehicleType]);

  const fetchMakes = async (vehicleType) => {
    const response = await axios.get(`http://localhost:3000/api/vehicles/makes?vehicleType=${vehicleType}`);
    setMakes(response.data);
  };

  const fetchModels = async (make, vehicleType) => {
    const response = await axios.get(`http://localhost:3000/api/vehicles/models?make=${make}&vehicleType=${vehicleType}`);
    setModels(response.data);
  };

  const fetchEmissionsData = async () => {
    if (selectedModel && vehicleType) {
      const response = await axios.get(`http://localhost:3000/api/emissions/yearlyByMake?vehicleType=${vehicleType}&make=${selectedMake}&model=${selectedModel}`);
      const data = response.data.data.map(yearData => ({
        x: yearData.year,
        y: yearData.emissions
      }));
      setEmissionsData({
        labels: response.data.data.map(d => d.year),
        datasets: [{
          label: `${selectedModel} Emissions`,
          data: data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }]
      });
    }
  };

  useEffect(() => {
    fetchEmissionsData();
  }, [selectedModel]);

  return (
    <div>
      <h1>Vehicle Emissions Data</h1>
      <div style={{ maxWidth: 600, margin: 'auto' }}>
        <div>
          <label htmlFor="vehicleType">Vehicle Type:</label>
          <select id="vehicleType" value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
            <option value="">Select Vehicle Type</option>
            {vehicleTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <label htmlFor="carMake">Car Make:</label>
          <select id="carMake" value={selectedMake} onChange={e => setSelectedMake(e.target.value)}>
            <option value="">Select Make</option>
            {makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>

          <label htmlFor="carModel">Car Model:</label>
          <select
            id="carModel"
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            disabled={!selectedMake}
          >
            <option value="">Select Model</option>
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        <div style={{ width: '100%', height: '300px' }}>
          <Line data={emissionsData} />
        </div>
      </div>
    </div>
  );
};

export default Forecasts;
