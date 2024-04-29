import { Select, Label } from 'flowbite-react';

export default function VehicleMakes({ selectedType, setSelectedType }: { selectedType: string }) {
  return (
    <div className="w-1/5">
      <Label className="w-max">
        <Select onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="X">Gasoline Car (X)</option>
          <option value="Z">Premium (Z)</option>
          <option value="D">Diesel (D)</option>
          <option value="B">Battery (B)</option>
        </Select>
      </Label>
    </div>
  );
}
