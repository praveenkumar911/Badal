import React, { useState , useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import axios from 'axios';

const calculateCircleRadius = (count) => {
  
    const baseRadius = 1000; // Base circle radius
    const maxRadius = 10000; // Maximum circle radius
    const newRadius = Math.min(baseRadius + count * 100, maxRadius); // Adjust radius based on count value
    return newRadius; // Return the calculated radius
  };
 
function Map(selectedOrg) {
    const [locationData, setLocationData] = useState([]);
    console.log("filtered",selectedOrg)

    useEffect(() => {
      // Dummy data for Telangana cities
      const dummyData = [
        { location: 'Hyderabad', count: 18 },
        { location: 'Warangal', count: 5 },
        { location: 'Karimnagar', count: 30  },
        { location: 'Nizamabad', count: 7 },
        {location:'Suryapet', count:26}
        // Add more cities as needed
      ];
  
      calculateLocationPercentage(selectedOrg);
    }, []);
  
    const calculateLocationPercentage = async (data) => {
      console.log(data);
      try {
          const selectedOrg = data.selectedOrg; // Accessing the selectedOrg array
          console.log(selectedOrg)
          const locationCoordinates = [];
  
          for (const cityData of selectedOrg) { // Iterating over each object in the selectedOrg array
              const { latitude, longitude , projectName } = cityData;
              const cityName = await getCityName(latitude, longitude);
              locationCoordinates.push({ locationName: cityName, latitude, longitude , projectName});
              console.log(locationCoordinates)
          }
  
          setLocationData(locationCoordinates);
  
      } catch (error) {
          console.error('Error calculating location coordinates:', error);
      }
  };
  
  
  
    const getCityName = async (latitude, longitude) => {
      console.log(latitude)
      try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          console.log(response)
          const { display_name } = response.data;
          console.log(display_name)
          return display_name;
      } catch (error) {
          console.error('Error fetching city name:', error);
          return null;
      }
  };
  

  return (
    <div className="dashboard">
    <div className="chartContainer">
      <div className="chart" style={{ flex: '1', marginTop: '40px' }}>
        <MapContainer
          center={[17.1232, 79.2088]}
          zoom={7}
          style={{ height: "40vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {locationData.map((location, index) => (
            <Circle
              key={`${location.locationName}-${index}`} // Use backticks for string interpolation
              center={[parseFloat(location.latitude), parseFloat(location.longitude)]}
              fillColor="#8a2be2"
              color="black"
              fillOpacity={0.5}
              radius={100000} // Calculate circle radius based on count value
              
            >
              <Popup>
                <strong>{location.locationName}</strong>
                <br />
                {location.projectName} is happening at {location.locationName}.
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
    </div>
  </div>
  );
}

export default Map;





