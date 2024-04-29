import ConsumptionByModel from '../components/consumption/ConsumptionByModel';
import ConsumptionByType from '../components/consumption/ConsumptionByType';
import CompareConsumptionByType from '../components/consumption/CompareConsumptionByType';
import CompareConsumptionByModel from '../components/consumption/CompareConsumptionByModel';

export default function Consumption() {
  return (
    <>
      <ConsumptionByType />
      <ConsumptionByModel />
      <CompareConsumptionByType />
      <CompareConsumptionByModel />
    </>
  );
}
