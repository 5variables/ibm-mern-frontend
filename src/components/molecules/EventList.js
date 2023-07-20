import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import Event from '../atoms/Event';
import '../atoms/event-style.css';

mapboxgl.accessToken = 'pk.eyJ1IjoicnViaWM0IiwiYSI6ImNrY3Vla3R1ZjF0YnYyeXQ2c243eWVpeHEifQ.Hgj0BjhuuOAowR_pE97V_Q';

const EventList = ({ selectedDate }) => {
  const [events, setEvents] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    fetchEvents();
    initMap();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/events/get-all');
      setEvents(response.data);
    } catch (error) {
      console.log('Error fetching events:', error);
    }
  };

  const initMap = () => {
    // Create a new Map object
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-96, 37.8],
      zoom: 3,
    });

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/Sydney.json?access_token=${mapboxgl.accessToken}`
      )
      .then((response) => {
        if (response.data.features.length > 0) {
          map.setCenter([21, 45]);
        } else {
          console.log('No results found for the given address');
        }
      })
      .catch((error) => {
        console.log('Error geocoding address:', error);
      });

    setMap(map);
  };

  // Filter events based on the selected date, only if it's defined
  const filteredEvents = selectedDate
    ? events.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

    useEffect(() => {
      if (map) {
        // Add a marker to the map for each event
        events.forEach((event) => {
          if (event.location && event.location.coordinates) {
            var lat = event.location.coordinates[0];
            var lng = event.location.coordinates[1];
            new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
            // console.log(lat, lng)
          }
        });
      }
    }, [events, map]);

  return (
    <div className="container">
      <div className="event-list">
        {filteredEvents.map((event) => (
          <div key={event._id.$oid} className="event-wrapper">
            <div className="event-container">
              <Event event={event} />
            </div>
          </div>
        ))}
      </div>
      <div id="map" className="map-square">
      </div>
    </div>
  );
};

export default EventList;