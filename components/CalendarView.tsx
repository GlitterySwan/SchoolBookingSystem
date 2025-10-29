import React from 'react';
import { Booking, Room } from '../types';
import { CalendarViewType } from './Dashboard';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';

interface CalendarViewProps {
    calendarView: CalendarViewType;
    currentDate: Date;
    bookings: Booking[];
    rooms: Room[];
    onBookingClick: (booking: Booking) => void;
    onDateChange: (date: Date) => void;
    onViewChange: (view: CalendarViewType) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
    calendarView, 
    currentDate, 
    bookings, 
    rooms, 
    onBookingClick,
    onDateChange,
    onViewChange
}) => {
    switch(calendarView) {
        case 'day':
            return <DayView 
                        rooms={rooms} 
                        bookings={bookings} 
                        currentDate={currentDate} 
                        onBookingClick={onBookingClick}
                    />;
        case 'week':
            return <WeekView 
                        bookings={bookings} 
                        currentDate={currentDate} 
                        onBookingClick={onBookingClick}
                    />;
        case 'month':
            return <MonthView 
                        bookings={bookings} 
                        currentDate={currentDate}
                        onDateChange={onDateChange}
                        onViewChange={onViewChange}
                    />;
        default:
            return null;
    }
};

export default CalendarView;
