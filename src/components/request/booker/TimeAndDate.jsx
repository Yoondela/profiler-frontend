import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeIcon from '../../../assets/icons/other/clock.svg?react';
import CalendarIcon from '../../../assets/icons/other/calendar.svg?react';
import { useServiceBooking } from '../contexts/ServiceBookingContext';

const timeSlots = [
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
];

export default function TimeAndDate({
  onNext,
  // userTime,
  // setUserTime,
  // userDate,
  // setUserDate,
}) {
  const { userDate, userTime, setUserDate, setUserTime } = useServiceBooking();

  const [selectedDate, setSelectedDate] = useState(userDate || null);
  const [selectedTime, setSelectedTime] = useState(userTime || '');

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setSelectedTime(value);
    setUserTime(value);
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
            selected={selectedDate}
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
