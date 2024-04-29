import ConsumptionByModel from '../components/consumption/ConsumptionByModel';
import ConsumptionByType from '../components/consumption/ConsumptionByType';
import CompareConsumptionByType from '../components/consumption/CompareConsumptionByType';

export default function Consumption() {
  return (
    <>
      <ConsumptionByType />
      <CompareConsumptionByType />
      <ConsumptionByModel />
    </>
  );
}
