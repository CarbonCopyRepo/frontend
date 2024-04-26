import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './App.css';
import NavBar from './NavBar'; // Adjust path if different
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnalyticsPage from './Analytics';

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
  
  interface VisibilityMap {
    [key: string]: boolean;
  }
  
  interface ImageMap {
    [key: string]: string;
  }
  
  const libraries = ['places'];
  const mapContainerStyle = {
    width: '700px',
    height: '350px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden' // Important for applying border-radius to a map
  };
  const center = { lat: -3.745, lng: -38.523 };
  const customMarkerIcon = 'images/markerIcon.svg';


const HomePage: React.FC = () => {
    const [coordinates, setCoordinates] = useState({ lat: 40.0150, lng: -105.2705 });
    const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
    const [loading, setLoading] = useState(false);
    const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 });
    const [visibleStations, setVisibleStations] = useState<{ [title: string]: boolean }>({});
    const [stationCounts, setStationCounts] = useState<Array<{ title: string; count: number }>>([]);
    const imageMap = {
      "ChargePoint" : "images/station_logos/ChargePoint Logo.jpeg",
      "EVmatch" : "images/station_logos/EVmatch logo.jpg",
      "EV Connect" : "images/station_logos/EVConnect logo.png",
      "Electrify America" : "images/station_logos/Electrify America logo.png",
      "EVCS" : "images/station_logos/EVCS logo.svg",
      "Powerflex" : "images/station_logos/powerflex.png",
      "Shell Recharge" : "images/station_logos/Shell Recharge.png",
      "Tesla" : "images/station_logos/Tesla.jpg",
      "EVgo" : "images/station_logos/EVgo.png",
      "blink" : "images/station_logos/blink logo.png",
      "Blink Charging" : "images/station_logos/blink logo.png",
      "AmpUp" : "images/station_logos/ampUp.jpg",
      "Rivian Adventure Network" : "images/station_logos/Rivian.jpg",
      "Caltrans" : "images/station_logos/Caltrans.jpg",
      "Rivian Waypoints" : "images/station_logos/Rivian.jpg",
      "Volta" : "images/station_logos/volta.png",
      "FLO" : "images/station_logos/flo.png",
      "LADWP" : "images/station_logos/LA.webp",
    }
  
    useEffect(() => {
      const counts = new Map();
      const visibility: VisibilityMap = {};
    
      chargingStations.forEach(station => {
        let count = counts.get(station.title) || 0;
        counts.set(station.title, count + 1);
        visibility[station.title] = true;  // Default all titles to visible
      });
    
      setStationCounts(Array.from(counts).map(([title, count]) => ({ title, count })));
      setVisibleStations(visibility);
    }, [chargingStations]);
    
    function getImageForTitle(title: string): string {
      const lowerCaseTitle = title.toLowerCase();
      const keys = Object.keys(imageMap) as (keyof typeof imageMap)[];
    
      for (let key of keys) {
        if (lowerCaseTitle.includes(key.toLowerCase())) {
          return imageMap[key]; // TypeScript understands that key is a valid key of imageMap
        }
      }
      return "images/station_logos/Default.png";
    }
    
    
    const handleCheckboxChange = (title: string) => {
      setVisibleStations(prevStations => ({
        ...prevStations,
        [title]: !prevStations[title] // Toggle visibility based on title
      }));
    };  
  
    useEffect(() => {
      setCenter({ lat: (coordinates.lat), lng: (coordinates.lng) });
    }, [coordinates]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCoordinates({ ...coordinates, [e.target.name]: parseFloat(e.target.value) });
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
        setCenter({ lat, lng }); // Update map center to user input
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="container my-5">
        <section className="userLocationInputSection">
          <h1 className="mb-4">Determine Your Electric <span>Car Eligibility</span></h1>
  
          <div className='form-container'>
            <form onSubmit={handleSubmit} className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                name="lat"
                value={coordinates.lat.toString()}
                onChange={handleChange}
                placeholder="Latitude"
              />
              <input
                type="text"
                className="form-control"
                name="lng"
                value={coordinates.lng.toString()}
                onChange={handleChange}
                placeholder="Longitude"
              />
              <div className="input-group-append">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Loading...' : 'Find Stations'}
                </button>
              </div>
            </form>
          </div>
          <div>
            {chargingStations.length > 0 ? (
              <div className="card-container">
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
              <div className="card">
                <div className="card-body">
                  No charging stations found.
                </div>
              </div>
            )}
          </div>
  
        </section>
  
        <section className="map">
          {/* station cards */}
          <div className="station_cards-container">
              {stationCounts.map(({ title, count }) => (
                <div key={title} className="station_card">
                  <img src={getImageForTitle(title)} alt={title} className="card-img-top"/>
                  <div className="card-body">
                    <p className="station-card-text-count">{count}</p>
                    <p className="station-card-text">stations</p>
  
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className = "form-check-input"
                        id={`checkbox-${title}`}
                        checked={visibleStations[title]}
                        onChange={() => handleCheckboxChange(title)}
                      />
                      <label className="form-check-label" htmlFor={`checkbox-${title}`}></label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Google Map */}
            <LoadScript googleMapsApiKey="AIzaSyBc1szeipPrcOZQxx0pMROa4ZfRKY_Sylc">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={14} 
            >
              {chargingStations.filter(station => visibleStations[station.title]).map(station => (
                <Marker
                  key={station.id}
                  position={{ lat: station.position.lat, lng: station.position.lng }}
                  title={station.title}
                />
              ))}
  
              <Marker
                position={center}
                icon={customMarkerIcon}
              />
            </GoogleMap>
  
            </LoadScript>
          </section>
        </div>
    );

}

export default HomePage;

