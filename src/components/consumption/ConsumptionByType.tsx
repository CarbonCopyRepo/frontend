import { useState, useEffect } from 'react';
import type { Consumption } from '../../types/emissions.types';
import { getYearlyConsumptionTypeBTU } from '../../apiCalls/getYearlyConsumptionTypeBTU';
import VehicleTypeDropdown from '../../components/dropdowns/VehicleTypeDropdown';
import MileDropdown from '../../components/dropdowns/MileDropdown';
import { XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Legend, Line } from 'recharts';

export default function EmissionsByModel() {
  const [selectedType, setSelectedType] = useState<string>();
  const [selectedMile, setSelectedMile] = useState<number>(50);

  const [consumption, setConsumption] = useState<Array<Consumption>>();

  useEffect(() => {
    const getBTUModel = async () => {
      const consumptionData = await getYearlyConsumptionTypeBTU(selectedType, selectedMile);
      console.log(consumptionData);
      setConsumption(consumptionData.data);
    };

    if (selectedType) getBTUModel();

    console.log(consumption);
  }, [selectedType, selectedMile]);

  return (
    <div className="bg-white rounded">
      <h1>Consumption by Vehicle Type</h1>
      <div className="flex flex-row">
        <div className="w-1/3">
          <VehicleTypeDropdown selectedType={selectedType} setSelectedType={setSelectedType} />
          <MileDropdown selectedMile={selectedMile} setSelectedMile={setSelectedMile} />
        </div>
        <div>
          {consumption && consumption.length > 0 && (
            <LineChart
              width={730}
              height={250}
              data={consumption}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="consumption" stroke="#8884d8" />
            </LineChart>
          )}
        </div>
      </div>
    </div>
  );
}
