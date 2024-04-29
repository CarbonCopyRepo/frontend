import { Select, Label } from 'flowbite-react';

export default function MileDropdown({ selectedMile, setSelectedMile }: { selectedMile: string }) {
  return (
    <div className="w-1/5">
      <Label className="w-max">
        Miles:
        <Select onChange={(e) => setSelectedMile(e.target.value)}>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="150">150</option>
          <option value="200">200</option>
          <option value="250">250</option>
        </Select>
      </Label>
    </div>
  );
}
