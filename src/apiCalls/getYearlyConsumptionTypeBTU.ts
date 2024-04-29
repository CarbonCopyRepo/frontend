export const getYearlyConsumptionTypeBTU = async (type, miles) => {
  let response;

  if (miles) {
    response = await fetch(
      `http://localhost:3000/api/consumption/yearly?vehicleType=${type}&miles=${miles}`
    );
  } else {
    response = await fetch(`http://localhost:3000/api/consumption/yearly?vehicleType=${type}`);
  }
  const data = await response.json();
  return data;
};
