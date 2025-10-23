import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeIcon from '../../../assets/icons/other/clock.svg?react';
import CalendarIcon from '../../../assets/icons/other/calendar.svg?react';

const timeSlots = Array.from({ length: 12 }, (_, index) => {
  const hours = 8 + Math.floor(index / 2);
  const minutes = index % 2 === 0 ? '00' : '30';
  return `${hours}:${minutes} AM`;
});
timeSlots[timeSlots.length - 1] = '2:30 PM';

export default function TimeAndDate({
  onNext,
  userTime,
  setUserTime,
  userDate,
  setUserDate,
}) {
  const [selectedDate, setSelectedDate] = useState(userDate || null);
  const [selectedTime, setSelectedTime] = useState(userTime || '');

  const handleTimeChange = (e) => {
    setUserTime(e.target.value);
    setSelectedTime(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setUserDate(date);
  };

  return (
    <div className="booker-form-container">
      <div className="service-request-container">
        <h2 className="title">Date And Time</h2>
        <p className="paragraph">
          What day and hour would you like to book for?
        </p>
        <div className="input-container">
          <CalendarIcon width="20" height="20" className="calendar-icon" />
          <DatePicker
            selected={userDate}
            onChange={handleDateChange}
            className="date-picker"
            placeholderText="Select a date"
            minDate={new Date()}
          />
        </div>
        <div className="dropdown-container">
          <TimeIcon width="20" height="20" className="time-icon" />
          <select
            className="time-picker"
            onChange={handleTimeChange}
            value={selectedTime}
          >
            <option value="" disabled>
              Select a time
            </option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          <FaChevronDown className="dropdown-icon" />
        </div>
        <button
          className="request-button"
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
        >
          Next
        </button>
      </div>
    </div>
  );
}
