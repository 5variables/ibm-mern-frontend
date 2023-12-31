import React, { useState } from 'react';
import DateDisplay from '../atoms/DateDisplay';
import '../atoms/date-style.css';
import EventList from '../molecules/EventList';

const DateSelector = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transition, setTransition] = useState(false);

  const handlePreviousDay = () => {
    setTransition(true);
    setTimeout(() => {
      setSelectedDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setDate(prevDate.getDate() - 1);
        return newDate;
      });
      setTransition(false);
    }, 300);
  };

  const handleNextDay = () => {
    setTransition(true);
    setTimeout(() => {
      setSelectedDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setDate(prevDate.getDate() + 1);
        return newDate;
      });
      setTransition(false);
    }, 300);
  };

  return (
    <div className='container'>
      <div className="date-preview">
        <button onClick={handlePreviousDay} className='leftButton'>&lt;--</button>
        <p>{getPreviewDate(selectedDate, -2)}</p>
        <p>{getPreviewDate(selectedDate, -1)}</p>
        <DateDisplay date={selectedDate} isActive={!transition} />
        <p>{getPreviewDate(selectedDate, 1)}</p>
        <p>{getPreviewDate(selectedDate, 2)}</p>
        <button onClick={handleNextDay} className='rightButton'>--&gt;</button>
      </div>
      <EventList selectedDate={selectedDate} />
    </div>
  );
};

const getPreviewDate = (date, offset) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + offset);

  const formattedDate = newDate.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return formattedDate;
};

export default DateSelector;
