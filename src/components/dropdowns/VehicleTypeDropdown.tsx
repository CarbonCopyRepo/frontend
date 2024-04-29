import { Select, Label } from 'flowbite-react';

export default function VehicleMakes(props: {
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  return (
    <div className="w-1/5">
      <Label className="w-max">
        Vehicle Type:
        <Select onChange={(e) => props.setSelectedType(e.target.value)}>
          <option value="X">Gasoline Car (X)</option>
          <option value="Z">Premium (Z)</option>
          <option value="D">Diesel (D)</option>
          <option value="B">Battery (B)</option>
        </Select>
      </Label>
    </div>
  );
}
