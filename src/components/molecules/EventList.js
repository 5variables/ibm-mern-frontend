import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Event from '../atoms/Event';
import '../atoms/event-style.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';


const EventList = ({ selectedDate }) => {
  const [currentDate, setCurrentDate] = useState();

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();
  const [zoom, setZoom] = useState(9);

  const [events, setEvents] = useState([]);
  const sign = "-->";

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
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/events/get-all');
        setEvents(response.data);
      } catch (error) {
        console.log('Error fetching events:', error);
      }
    };

    fetchEvents();

    mapboxgl.accessToken = 'pk.eyJ1IjoicnViaWM0IiwiYSI6ImNrY3Vla3R1ZjF0YnYyeXQ2c243eWVpeHEifQ.Hgj0BjhuuOAowR_pE97V_Q';

    if (map.current) return; // initialize map only once
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/rubic4/clk5n3pvd00j501pe0juiej4p',
        center: [21, 44],
        zoom: 4
    });

    map.current.on('load', function () {
        map.current.resize();
    });

  }, []);

  useEffect(() => {
    if (map.current && filteredEvents.length > 0) {
      // Clear existing markers
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers.length > 0) {
        markers[0].remove();
      }

      const bounds = new mapboxgl.LngLatBounds();
      // Add markers for each event in filteredEvents
      filteredEvents.forEach((event) => {
        const { coordinates } = event.location;

        const [lng, lat] = coordinates; 
        bounds.extend([lat, lng]);

        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.backgroundColor = 'black';
        markerElement.style.color = 'white';
        markerElement.style.width = 'fit-content';
        markerElement.style.paddingRight = '20px';
        markerElement.style.paddingLeft = '20px';
        markerElement.style.height = '40px';
        markerElement.style.borderRadius = '50px';
        markerElement.style.display = 'flex';
        markerElement.style.justifyContent = 'center';
        markerElement.style.alignItems = 'center';
        markerElement.innerText = event.title;

        // const marker = new mapboxgl.Marker({ element: markerElement }).setLngLat([parseFloat(suggestion[2]), parseFloat(suggestion[1])]).addTo(map.current);

        new mapboxgl.Marker({ element: markerElement })
          .setLngLat([lat, lng])
          .addTo(map.current);

        map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 }); // You can adjust the padding and maxZoom values as needed
      });
      
    }
  }, [filteredEvents]);

  function convertToRomaniaTime(utcTimeString) {
    const utcDate = new Date(utcTimeString);
    
    // Get the Romania time offset from UTC (in minutes) which is 3 hours ahead (180 minutes)
    const romaniaTimeOffset = 180;
    
    // Calculate the Romania time by adding the offset to the UTC time
    const romaniaTime = new Date(utcDate.getTime() + romaniaTimeOffset * 60000);
  
    // Get the hours and minutes from the Romania time
    const hours = romaniaTime.getUTCHours().toString().padStart(2, '0');
    const minutes = romaniaTime.getUTCMinutes().toString().padStart(2, '0');
  
    // Combine hours and minutes in "hh:mm" format
    const romaniaTimeHHMM = `${hours}:${minutes}`;
  
    return romaniaTimeHHMM;
  }

  return (
    <div className='main-view'>
      <div className="split-screen">
        <div className="left">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event" onClick={() => {
              map.current.flyTo({
                center: [event.location.coordinates[1], event.location.coordinates[0]],
                zoom: 17,
                essential: true
              });
            }}>
              <div className="top">
                <div className="name-location">
                  <div className="title">{event.title} </div>
                  <div className="location">at</div>
                  <div className="location">{event.location.name}</div>
                </div>
                <div className="starting-hour">
                  <div className="location">Starting at {convertToRomaniaTime(event.date)}</div>
                </div>
              </div>
              <div className="bottom">
                <div className='view-btn'>View {sign}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="right">
          <div className='map-container'>
            <div ref={mapContainer} className="map" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventList;
