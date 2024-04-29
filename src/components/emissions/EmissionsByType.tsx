import { useEffect, useState } from 'react';

const EmissionsByType = (props: { miles: string; selectedType: string }) => {
  const [gasEmissions, setGasEmissions] = useState([]);
  const [evEmissions, setEVEmissions] = useState([]);

  let { miles, selectedType } = props;

  selectedType = !selectedType ? 'X' : selectedType;

  useEffect(() => {
    formatEmissionsData();
  }, [gasEmissions, evEmissions]);

  useEffect(() => {
    fetchData()
      .then((result) => {
        const { gasVehicles, evVehicles } = result;

        setGasEmissions(gasVehicles.data);
        setEVEmissions(evVehicles.data);
      })
      .catch((error: unknown) => {
        console.log(`Error while fetching emissions data: ${error}`);
      });
  }, [miles, selectedType]);

  async function fetchData() {
    const [gasData, evData] = await Promise.all([
      fetchGasEmissions(miles),
      fetchEVEmissions(miles),
    ]);

    return {
      gasVehicles: gasData,
      evVehicles: evData,
    };
  }

  async function fetchGasEmissions(miles: string) {
    const parsedMiles = parseInt(miles);

    const result = await fetch(
      `http://localhost:3000/api/emissions/yearly?vehicleType=${selectedType}&?miles=${parsedMiles}`
    );

    return result.json();
  }

  async function fetchEVEmissions(miles: string) {
    const parsedMiles = parseInt(miles);

    const result = await fetch(
      `http://localhost:3000/api/emissions/yearly?vehicleType=B&?miles=${parsedMiles}`
    );

    return result.json();
  }

  function formatEmissionsData() {
    console.log(gasEmissions);
    console.log(evEmissions);
    // Process the data here
  }

  return <h2>Emissions By Type</h2>;
};

export default EmissionsByType;
