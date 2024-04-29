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

export default function EmissionsByModel() {
  const [makes, setMakes] = useState<Array<Make>>([{ make: 'Acura' }]);
  const [models, setModels] = useState<Array<Model>>();

  const [selectedType, setSelectedType] = useState<string>();
  const [selectedMake, setSelectedMake] = useState<string>();
  const [selectedModel, setSelectedModel] = useState<string>();
  const [selectedMile, setSelectedMile] = useState<number>(50);

  const [consumption, setConsumption] = useState<Array<Consumption>>();

  useEffect(() => {
    const getMakes = async () => {
      setMakes(null);
      setSelectedMake(null);
      setModels(null);
      setSelectedModel(null);

      const vehicleMakes = await getMakesForVehicleType(selectedType);
      setMakes(vehicleMakes.data);
    };

    if (selectedType) getMakes();
  }, [selectedType]);

  useEffect(() => {
    const getModels = async () => {
      setModels(null);
      setSelectedModel(null);

      const vehicleModels = await getModelsForVehicleMake(selectedType, selectedMake);
      setModels(vehicleModels.data);
    };

    if (selectedMake) getModels();
  }, [selectedMake]);

  useEffect(() => {
    const getBTUModel = async () => {
      console.log(selectedMile);
      const consumptionData = await getYearlyConsumptionModelBTU(
        selectedType,
        selectedMake,
        selectedModel,
        selectedMile
      );
      setConsumption(consumptionData.data);
    };

    if (selectedModel) getBTUModel();
  }, [selectedModel, selectedMile]);

  return (
    <div className="bg-white rounded">
      <h1>Consumption by Model</h1>
      <div className="flex flex-row">
        <div className="w-1/3">
          <VehicleTypeDropdown selectedType={selectedType} setSelectedType={setSelectedType} />
          <VehicleMakesDropdown makes={makes} setSelectedMake={setSelectedMake} />
          <VehicleModelDropdown models={models} setSelectedModel={setSelectedModel} />
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
            <Line type="monotone" dataKey="consumption" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
