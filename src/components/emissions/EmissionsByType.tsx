import { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

type chartType = { name: string; gas: number; ev: number };
type emissionType = { year: number; emissions: number };

const EmissionsByType = (props: { miles: string; selectedType: string }) => {
  const [gasEmissions, setGasEmissions] = useState([]);
  const [evEmissions, setEVEmissions] = useState([]);
  const [chartData, setChartData] = useState([] as chartType[]);

  let { miles, selectedType } = props;

  selectedType = !selectedType ? 'X' : selectedType;

  useEffect(() => {
    const formattedChartData = formatEmissionsData();
    setChartData(formattedChartData);
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
    if (gasEmissions && evEmissions) {
      const gasRecords: emissionType[] = [...gasEmissions];
      const evRecords: emissionType[] = [...evEmissions];

      const isGas = gasRecords.length >= evRecords.length;

      let commonYears: number[];

      if (isGas) {
        const gasYears = gasRecords.map((record) => record.year);
        commonYears = evRecords
          .filter((data) => gasYears.includes(data.year))
          .map((record) => record.year);
      } else {
        const evYears = evRecords.map((record) => record.year);
        commonYears = gasRecords
          .filter((data) => evYears.includes(data.year))
          .map((record) => record.year);
      }

      return prepareChartData(gasRecords, evRecords, commonYears);
    }

    return [];
  }

  function prepareChartData(
    gasRecords: emissionType[],
    evRecords: emissionType[],
    years: number[]
  ) {
    const chartData: chartType[] = [];

    years.forEach((year) => {
      const gasRecord = gasRecords.filter((record) => record.year === year);
      const evRecord = evRecords.filter((record) => record.year === year);

      chartData.push({
        name: year.toString(),
        gas: gasRecord[0].emissions,
        ev: evRecord[0].emissions,
      });
    });

    return chartData;
  }

  return (
    <>
      <h2 className="text-center m-4">Emissions By Type</h2>
      {chartData && chartData.length > 0 && (
        <div className="flex justify-center items-center">
          <LineChart
            width={730}
            height={250}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="gas" stroke="#1A4D2E" />
            <Line type="monotone" dataKey="ev" stroke="#4793AF" />
          </LineChart>
        </div>

      )}
    </>
  );
};

export default EmissionsByType;
