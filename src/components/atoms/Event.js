import React from 'react';
import './event-style.css';

const Event = ({ event }) => {
  const date = new Date(event.date);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  
  return (
    <div className="event-item">
      <div className="event-info">
        <p><strong>{event.title} at {event.location.name}</strong></p>
        <p>Participants: {event.participants}</p>
      </div>
      <div className="event-time">
        <p><strong>Starting at {formattedTime}</strong></p>
        <button>View</button>
      </div>
    </div>
  );
};

export default Event;
