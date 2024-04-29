import { useState } from 'react';

import MileDropdown from '../components/dropdowns/MileDropdown';
import EmissionsByType from '../components/emissions/EmissionsByType';
import VehicleMakes from '../components/dropdowns/VehicleTypeDropdown';

const Emissions = () => {
  const [selectedMile, setSelectedMile] = useState<string>('50');

  const [selectedType, setSelectedType] = useState<string>('X');

  return (
    <>
      <h1 className="m-4 text-center">CO2 Emissions Tracker</h1>
      {/* Avg yearly emission by vehicle type chart */}
      <div className="flex flex-col justify-center items-center">
        <p className="m-4">Average Yearly Emissions - Gas vs EV Vehicles</p>
        <div className="flex flex-row justify-between items-center">
          <MileDropdown selectedMile={selectedMile} setSelectedMile={setSelectedMile} />
          <VehicleMakes selectedType={selectedType} setSelectedType={setSelectedType} />
        </div>
        <EmissionsByType miles={selectedMile} selectedType={selectedType} />
      </div>
    </>
  );
};

export default Emissions;
