import React from 'react';
import './event-style.css';

const Event = ({ event }) => {
  return (
    <div className="event-item">
        <div className="event-info">
            <p><strong>{event.title} at Location</strong></p>
            <p>Participants: {event.participants}</p>
        </div>
        <div className="event-time">
            <p><strong>Starting at xx:xx</strong></p>
            <button>View</button>
        </div>
    </div>
  );
};

export default Event;
