import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import './event-style.css';

import mapboxgl from '!mapbox-gl'; 
import Autosuggest from 'react-autosuggest';
import 'mapbox-gl/dist/mapbox-gl.css';

const Event = ({ event }) => {
  //const router = useRouter();

  const date = new Date(event.date);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const map = useRef(null);
  const mapContainer = useRef(null);
  const [_lat, setLat] = useState(21.2087);
  const [_lon, setLon] = useState(45.7489);
  const [_zoom, setZoom] = useState(10);
  const [locationName, setLocationName] = useState("");

  // useEffect(() => {
  //   if (isModalOpen) {
  //     const url = `/event/${event.id}`; 
  //     router.push(url);
  //   }
  // }, [isModalOpen]);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicnViaWM0IiwiYSI6ImNrY3Vla3R1ZjF0YnYyeXQ2c243eWVpeHEifQ.Hgj0BjhuuOAowR_pE97V_Q';

    
  }, []);

  const handleViewClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    //router.push('/'); 
  };

  return (
    <div className="event-item">
      <div className="event-info">
        <p><strong>{event.title} at {event.location.name}</strong></p>
        <p>Participants: {event.participants}</p>
      </div>
      <div className="event-time">
        <p><strong>Starting at {formattedTime}</strong></p>
        <button onClick={handleViewClick}>View</button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>Location: {event.location.name} at coordinates {event.location.coordinates[0]} and {event.location.coordinates[1]}</p>
            <p>Date: {event.date}</p>
            <p>Participants: {event.participants}</p>
           
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;
