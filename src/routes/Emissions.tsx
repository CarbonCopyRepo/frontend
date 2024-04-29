import { useState } from 'react';

import MileDropdown from '../components/dropdowns/MileDropdown';
import EmissionsByType from '../components/emissions/EmissionsByType';
import VehicleMakes from '../components/dropdowns/VehicleTypeDropdown';

const Emissions = () => {
  const [selectedMile, setSelectedMile] = useState<string>('50');

  const [selectedType, setSelectedType] = useState<string>();

  return (
    <div>
      <h1 className="mx-4">CO2 Emissions Tracker</h1>
      <p className="m-4">Average Yearly Emissions - Gas vs EV Vehicles</p>
      {/* Avg yearly emission by vehicle type chart */}
      <div>
        <MileDropdown selectedMile={selectedMile} setSelectedMile={setSelectedMile} />
        <VehicleMakes selectedType={selectedType} setSelectedType={setSelectedType} />
        <EmissionsByType miles={selectedMile} selectedType={selectedType} />
      </div>
    </div>
  );
};

export default Emissions;
