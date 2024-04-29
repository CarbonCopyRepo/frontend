import { Select, Label } from 'flowbite-react';
import type { Model } from '../../types/vehicle.types';

export default function VehicleModelDropdown({
  models,
  setSelectedModel,
}: {
  makes: Array<Model>;
}) {
  return (
    <div className="w-1/5">
      <Label className="w-max">
        <Select onChange={(e) => setSelectedModel(e.target.value)}>
          <option value="">Select Model</option>
          {models?.map((model) => {
            return (
              <option value={model.model} key={model.model}>
                {model.model}
              </option>
            );
          })}
        </Select>
      </Label>
    </div>
  );
}
