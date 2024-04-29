export const getYearlyConsumptionModelBTU = async (type, make, model, miles) => {
  let response;

  if (miles) {
    response = await fetch(
      `http://localhost:3000/api/consumption/yearlyByMake?make=${make}&model=${model}&vehicleType=${type}&miles={miles}`
    );
  } else {
    response = await fetch(
      `http://localhost:3000/api/consumption/yearlyByMake?make=${make}&model=${model}&vehicleType=${type}`
    );
  }
  const data = await response.json();
  return data;
};
