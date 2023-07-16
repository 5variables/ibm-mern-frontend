import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Event from '../atoms/Event';
import '../atoms/event-style.css';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/events/get-all');
      setEvents(response.data);
    } catch (error) {
      console.log('Error fetching events:', error);
    }
  };

  return (
    <div className="container">
      <div className="event-list">
        {events.map((event) => (
          <div key={event._id.$oid} className="event-wrapper">
            <div className="event-container">
              <Event event={event} />
            </div>
          </div>
        ))}
      </div>
      <div className="map-square">
        <h2>Future Map</h2>
      </div>
    </div>
  );
};

export default EventList;
