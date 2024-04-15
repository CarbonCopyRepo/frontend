import { useState , useEffect} from 'react';
import './App.css';
import { 
  GoogleMap, 
  LoadScript, 
  Marker
   } from '@react-google-maps/api';
<script
src="https://maps.googleapis.com/maps/api/js?key=NF2ZNxJaEA5ex5EqB2rGRm8A&callback=initMap&v=weekly&libraries=marker"
defer
></script>

interface Address {
  label: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  state: string;
  county: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  houseNumber: string;
}

interface Position {
  lat: number;
  lng: number;
}

interface Access {
  lat: number;
  lng: number;
}

interface Category {
  id: string;
  name: string;
  primary: boolean;
}

interface Chain {
  id: string;
  name: string;
}

interface ContactPhone {
  value: string;
}

interface ContactWww {
  value: string;
}

interface Contacts {
  phone: ContactPhone[];
  www: ContactWww[];
}

interface ChargingStation {
  title: string;
  id: string;
  language: string;
  resultType: string;
  address: Address;
  position: Position;
  access: Access[];
  distance: number;
  categories: Category[];
  chains: Chain[];
  contacts: Contacts[];
}

const libraries = ['places'];
const mapContainerStyle = {
  width: '600px',
  height: '450px',
};
const center = { lat: -3.745, lng: -38.523 };
const customMarkerIcon = 'images/markerIcon.svg';

function App() {
  const [coordinates, setCoordinates] = useState({ lat: '40.0150', lng: '-105.2705'});
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]); 
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 }); 

  useEffect(() => {
    setCenter({ lat: parseFloat(coordinates.lat), lng: parseFloat(coordinates.lng) });
  }, [coordinates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoordinates({ ... coordinates, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const apiKey = 'n1uBlB9jeB_7i-xw0I-NF2ZNxJaEA5ex5EqB2rGRm8A';
    const category = '700-7600-0322,700-7600-0325'; // EV charging station and EV battery swap station
    const { lat, lng } = coordinates;
    const url = `https://browse.search.hereapi.com/v1/browse?at=${lat},${lng}&limit=20&categories=${category}&apiKey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setChargingStations(data.items);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <section className = "userLocationInputSection">
        <h1 className="mb-4">Determine Your Electric <span>Car Eligibility</span></h1>
        <form onSubmit={handleSubmit} className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            name="lat"
            value={coordinates.lat}
            onChange={handleChange}
            placeholder="Latitude"
          />
          <input
            type="text"
            className="form-control"
            name="lng"
            value={coordinates.lng}
            onChange={handleChange}
            placeholder="Longitude"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Find Stations'}
            </button>
          </div>
        </form>
        <div>
          {chargingStations.length > 0 ? (
            <div className="card-columns">
              {chargingStations.map((station) => (
                <div className="card" key={station.id}>
                  <div className="card-body">
                    <h5 className="card-title">{station.title}</h5>
                    <p className="card-text">{station.address.label}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No charging stations found.</p>
          )}
        </div>
      </section>

      <section className ="map">
      <LoadScript
        googleMapsApiKey='AIzaSyBc1szeipPrcOZQxx0pMROa4ZfRKY_Sylc'>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center = {center}
              zoom = {14}
              >
              <Marker
                position={center}>
                
              </Marker>
              </GoogleMap>
        </LoadScript>
      </section>
    </div>




  );
}

export default App;
