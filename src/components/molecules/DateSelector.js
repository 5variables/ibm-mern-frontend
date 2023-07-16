import React, { useState } from 'react';
import DateDisplay from '../atoms/DateDisplay';
import '../atoms/date-style.css'

const DateSelector = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transition, setTransition] = useState(false);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setTransition(true);
    setTimeout(() => {
      setSelectedDate(newDate);
      setTransition(false);
    }, 300);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setTransition(true);
    setTimeout(() => {
      setSelectedDate(newDate);
      setTransition(false);
    }, 300);
  };

  return (
    <div>
      <div className="date-buttons">
        <button onClick={handlePreviousDay}>&lt;</button>
        <button onClick={handleNextDay}>&gt;</button>
      </div>
      <div className="date-preview">
        <p>{getPreviewDate(selectedDate, -1)}</p>
        <DateDisplay date={selectedDate} isActive={!transition} />
        <p>{getPreviewDate(selectedDate, 1)}</p>
      </div>
    </div>
  );
};

const getPreviewDate = (date, offset) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + offset);
  return newDate.toDateString();
};

export default DateSelector;
