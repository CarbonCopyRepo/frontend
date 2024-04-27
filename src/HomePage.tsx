import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './App.css';
//@ts-ignore
import './types.ts'; 
import dotenv from "dotenv";
  
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

  function haversineDistance(coords1: { lng: any; lat: any; }, coords2: { lng: any; lat: any; }, isMiles = false) {
    function toRad(x: number) {
      return x * Math.PI / 180;
    }
  
    var lon1 = coords1.lng;
    var lat1 = coords1.lat;
  
    var lon2 = coords2.lng;
    var lat2 = coords2.lat;
  
    var R = 6371; // km
    if (isMiles) R = 3959; // miles
  
    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
  
    return d;
  }
  
  const HomePage = () => {
    const [coordinates, setCoordinates] = useState({ lat: 40.0150, lng: -105.2705 });
    const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
    const [loading, setLoading] = useState(false);
    const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 });
    const [visibleStations, setVisibleStations] = useState<{ [title: string]: boolean }>({});
    const [stationCounts, setStationCounts] = useState<Array<{ title: string; count: number }>>([]);
    const [averageDistance, setAverageDistance] = useState(0);

    const updateAverageDistance = () => {
      if (chargingStations.length > 0) {
        const totalDistance = chargingStations.reduce((acc, station) => {
          return acc + haversineDistance({ lat: coordinates.lat, lng: coordinates.lng }, { lat: station.position.lat, lng: station.position.lng });
        }, 0);
        setAverageDistance(totalDistance / chargingStations.length);
      }
    };

    useEffect(() => {
      updateAverageDistance();
    }, [chargingStations, coordinates]);

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
    const [key, setKey] = useState(Math.random());

    useEffect(() => {
        // Whenever the component mounts, set a new key
        setKey(Math.random());
      }, []);

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
        setChargingStations(data.items); // This will trigger the useEffect to recalculate distance
        setCenter({ lat, lng }); // Optionally update the map center
      } catch (error) {
        console.error('Error fetching data: ', error);
        // Optionally handle error state here
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
            <LoadScript googleMapsApiKey="AIzaSyBc1szeipPrcOZQxx0pMROa4ZfRKY_Sylc"
                  key={key}
                  >
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

