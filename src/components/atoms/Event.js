import React from 'react';

const EventItem = ({ event }) => {
  return (
    <div className="event-item">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Location: {event.location.coordinates.join(', ')}</p>
      <p>Participants: {event.participants.join(', ')}</p>
    </div>
  );
};

export default EventItem;
