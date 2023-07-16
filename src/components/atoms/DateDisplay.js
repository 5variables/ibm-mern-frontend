import React from 'react';

const DateDisplay = ({ date, isActive }) => {
  return (
    <div className={`date-rectangle ${isActive ? 'active' : 'inactive'}`}>
      <p>{date.toDateString()}</p>
    </div>
  );
};

export default DateDisplay;
