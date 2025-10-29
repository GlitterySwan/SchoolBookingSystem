import React from 'react';
import { Booking } from '../types';
import { CalendarViewType } from './Dashboard';

interface MonthViewProps {
    bookings: Booking[];
    currentDate: Date;
    onDateChange: (date: Date) => void;
    onViewChange: (view: CalendarViewType) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ bookings, currentDate, onDateChange, onViewChange }) => {
    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth();

    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0));

    const startDayOfWeek = firstDay.getUTCDay(); 
    const totalDays = lastDay.getUTCDate();

    const calendarDays = [];
    
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));


    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
        calendarDays.push(new Date(Date.UTC(year, month, i)));
    }
    while (calendarDays.length % 7 !== 0) {
        calendarDays.push(null);
    }
    
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const bookingsByDate = bookings.reduce((acc, booking) => {
        (acc[booking.date] = acc[booking.date] || []).push(booking);
        return acc;
    }, {} as Record<string, Booking[]>);

    const handleDayClick = (day: Date) => {
        onDateChange(day);
        onViewChange('day');
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-7 text-center font-semibold text-gray-600 border-b mb-2">
                {weekDays.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 gap-1">
                {calendarDays.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} className="border rounded-md bg-gray-50"></div>;

                    const dateStr = day.toISOString().split('T')[0];
                    const dayBookings = bookingsByDate[dateStr] || [];
                    const isToday = day.getTime() === todayUTC.getTime();

                    return (
                        <div 
                            key={index} 
                            className="border rounded-md p-2 min-h-[120px] flex flex-col hover:bg-indigo-50 cursor-pointer transition-colors"
                            onClick={() => handleDayClick(day)}
                        >
                            <span className={`font-bold ${isToday ? 'bg-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-gray-800'}`}>
                                {day.getUTCDate()}
                            </span>
                            <div className="mt-1 space-y-1 overflow-y-auto text-xs">
                                {dayBookings.slice(0, 3).map(b => (
                                    <div key={b.id} className="bg-indigo-100 text-indigo-800 p-1 rounded truncate">
                                        {b.roomId}: {b.category}
                                    </div>
                                ))}
                                {dayBookings.length > 3 && (
                                    <div className="text-gray-500 font-medium">+{dayBookings.length - 3} more</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthView;