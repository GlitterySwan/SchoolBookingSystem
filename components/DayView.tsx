import React from 'react';
import RoomSchedule from './RoomSchedule';
import { Room, Booking } from '../types';

interface DayViewProps {
  rooms: Room[];
  bookings: Booking[];
  currentDate: Date;
  onBookingClick: (booking: Booking) => void;
}

const DayView: React.FC<DayViewProps> = ({ rooms, bookings, currentDate, onBookingClick }) => {
  const toYYYYMMDD = (date: Date) => {
    // Use UTC methods to avoid timezone shift issues
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateStr = toYYYYMMDD(currentDate);
  const dayBookings = bookings.filter(b => b.date === dateStr);

  return <RoomSchedule rooms={rooms} bookings={dayBookings} onBookingClick={onBookingClick} />;
};

export default DayView;
