import { Select, Label } from 'flowbite-react';
import type { Make } from '../../types/vehicle.types';

export default function VehicleMakesDropdown({ makes, setSelectedMake }: { makes: Array<Make> }) {
  return (
    <div className="w-1/5">
      <Label className="w-max">
        <Select onChange={(e) => setSelectedMake(e.target.value)}>
          <option value="">Select Make</option>
          {makes?.map((make) => {
            return (
              <option value={make.make} key={make.make}>
                {make.make}
              </option>
            );
          })}
        </Select>
      </Label>
    </div>
  );
}
