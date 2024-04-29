import { useState, useEffect } from 'react';
import type { Make, Model } from '../../types/vehicle.types';
import type { Consumption } from '../../types/emissions.types';
import { getMakesForVehicleType } from '../../apiCalls/getMakesForVehicleType';
import { getModelsForVehicleMake } from '../../apiCalls/getModelsForVehicleMake';
import { getYearlyConsumptionModelBTU } from '../../apiCalls/getYearlyConsumptionModelBTU';
import VehicleMakesDropdown from '../../components/dropdowns/VehicleMakesDropdown';
import VehicleModelDropdown from '../../components/dropdowns/VehicleModelDropdown';
import VehicleTypeDropdown from '../../components/dropdowns/VehicleTypeDropdown';
import MileDropdown from '../../components/dropdowns/MileDropdown';
import { XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Legend, Line } from 'recharts';

export default function CompareConsumptionByModel() {
  const [makes1, setMakes1] = useState<Array<Make>>([{ make: 'Acura' }]);
  const [models1, setModels1] = useState<Array<Model>>();

  const [selectedType1, setSelectedType1] = useState<string>();
  const [selectedMake1, setSelectedMake1] = useState<string>();
  const [selectedModel1, setSelectedModel1] = useState<string>();
  const [selectedMile1, setSelectedMile1] = useState<number>(50);

  const [makes2, setMakes2] = useState<Array<Make>>([{ make: 'Acura' }]);
  const [models2, setModels2] = useState<Array<Model>>();

  const [selectedType2, setSelectedType2] = useState<string>();
  const [selectedMake2, setSelectedMake2] = useState<string>();
  const [selectedModel2, setSelectedModel2] = useState<string>();
  const [selectedMile2, setSelectedMile2] = useState<number>(50);

  const [consumption, setConsumption] = useState<Array<Consumption>>();

  useEffect(() => {
    const getMakes = async () => {
      setMakes1(null);
      setSelectedMake1(null);
      setModels1(null);
      setSelectedModel1(null);

      const vehicleMakes = await getMakesForVehicleType(selectedType1);
      setMakes1(vehicleMakes.data);
    };

    if (selectedType1) getMakes();
  }, [selectedType1]);

  useEffect(() => {
    const getModels = async () => {
      setModels1(null);
      setSelectedModel1(null);

      const vehicleModels = await getModelsForVehicleMake(selectedType1, selectedMake1);
      setModels1(vehicleModels.data);
    };

    if (selectedMake1) getModels();
  }, [selectedMake1]);

  useEffect(() => {
    const getMakes = async () => {
      setMakes2(null);
      setSelectedMake2(null);
      setModels2(null);
      setSelectedModel2(null);

      const vehicleMakes = await getMakesForVehicleType(selectedType2);
      setMakes2(vehicleMakes.data);
    };

    if (selectedType2) getMakes();
  }, [selectedType2]);

  useEffect(() => {
    const getModels = async () => {
      setModels2(null);
      setSelectedModel2(null);

      const vehicleModels = await getModelsForVehicleMake(selectedType2, selectedMake2);
      setModels2(vehicleModels.data);
    };

    if (selectedMake2) getModels();
  }, [selectedMake2]);

  useEffect(() => {
    const getBTUModel = async () => {
      const consumptionData1 = await getYearlyConsumptionModelBTU(
        selectedType1,
        selectedMake1,
        selectedModel1,
        selectedMile1
      );

      const consumptionData2 = await getYearlyConsumptionModelBTU(
        selectedType2,
        selectedMake2,
        selectedModel2,
        selectedMile2
      );

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

    if (selectedModel1) getBTUModel();
  }, [selectedModel1, selectedMile1, selectedModel2, selectedMile2]);

  return (
    <div className="bg-white rounded">
      <h1>Comapre Consumption by Model</h1>
      <div className="flex flex-row">
        <div className="w-1/3">
          <VehicleTypeDropdown selectedType={selectedType1} setSelectedType={setSelectedType1} />
          <VehicleMakesDropdown makes={makes1} setSelectedMake={setSelectedMake1} />
          <VehicleModelDropdown models={models1} setSelectedModel={setSelectedModel1} />
          <MileDropdown selectedMile={selectedMile1} setSelectedMile={setSelectedMile1} />
        </div>
        <div className="w-1/3">
          <VehicleTypeDropdown selectedType={selectedType2} setSelectedType={setSelectedType2} />
          <VehicleMakesDropdown makes={makes2} setSelectedMake={setSelectedMake2} />
          <VehicleModelDropdown models={models2} setSelectedModel={setSelectedModel2} />
          <MileDropdown selectedMile={selectedMile2} setSelectedMile={setSelectedMile2} />
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
