import { useState, useEffect } from 'react';
import type { Consumption } from '../../types/emissions.types';
import { getYearlyConsumptionTypeBTU } from '../../apiCalls/getYearlyConsumptionTypeBTU';
import VehicleTypeDropdown from '../../components/dropdowns/VehicleTypeDropdown';
import MileDropdown from '../../components/dropdowns/MileDropdown';
import { XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Legend, Line } from 'recharts';

export default function CompareEmissionsByType() {
  const [selectedType1, setSelectedType1] = useState<string>();
  const [selectedType2, setSelectedType2] = useState<string>();
  const [selectedMile, setSelectedMile] = useState<string>(50);

  const [consumption, setConsumption] = useState<Array<Consumption>>();

  useEffect(() => {
    const getBTUModel = async () => {
      const consumptionData1 = await getYearlyConsumptionTypeBTU(selectedType1, selectedMile);
      const consumptionData2 = await getYearlyConsumptionTypeBTU(selectedType2, selectedMile);

      const formattedData1 = consumptionData1.data.map((d) => {
        return {
          year: d.year,
          consumption1: d.consumption,
        };
      });

      const formattedData2 = consumptionData2.data.map((d) => {
        return {
          year: d.year,
          consumption2: d.consumption,
        };
      });

      const formattedData = formattedData1.map((d) => {
        console.log(formattedData2[d.year]);
        const newPt = formattedData2.find((e) => e.year === d.year);
        if (newPt) {
          return {
            year: d.year,
            consumption1: d.consumption1,
            consumption2: newPt.consumption2,
          };
        }
      });

      setConsumption(formattedData);
    };

    if (selectedType1 && selectedType2) getBTUModel();
  }, [selectedType1, selectedType2, selectedMile]);

  return (
    <div className="bg-white rounded">
      <h1>Compare Consumption by Vehicle Type</h1>
      <div className="flex flex-row h-80 py-5 pl-2">
        <div className="w-1/3">
          <VehicleTypeDropdown selectedType={selectedType1} setSelectedType={setSelectedType1} />
          <VehicleTypeDropdown selectedType={selectedType2} setSelectedType={setSelectedType2} />
          <MileDropdown selectedMile={selectedMile} setSelectedMile={setSelectedMile} />
        </div>
        <div>
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
            <Line type="monotone" dataKey="consumption1" stroke="#8884d8" />
            <Line type="monotone" dataKey="consumption2" />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
