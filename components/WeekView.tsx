import React from 'react';
import { Booking, BookingStatus } from '../types';
import { getWeekDateRange } from '../utils';

interface WeekViewProps {
    bookings: Booking[];
    currentDate: Date;
    onBookingClick: (booking: Booking) => void;
}

const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Approved: return 'bg-green-100 text-green-800 hover:bg-green-200';
      case BookingStatus.Pending: return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case BookingStatus.Rejected: return 'bg-red-100 text-red-800 hover:bg-red-200';
      case BookingStatus.Cancelled: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-50';
    }
  };

const WeekView: React.FC<WeekViewProps> = ({ bookings, currentDate, onBookingClick }) => {
    const { start } = getWeekDateRange(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(start);
        day.setUTCDate(start.getUTCDate() + i);
        return day;
    });

    const bookingsByDay = days.map(day => {
        const dateStr = day.toISOString().split('T')[0];
        return bookings
            .filter(b => b.date === dateStr)
            .sort((a, b) => a.startTime - b.startTime);
    });

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 divide-x divide-gray-200">
                {days.map((day, index) => (
                    <div key={index} className="flex flex-col">
                        <div className="text-center py-2 border-b border-gray-200 bg-gray-50">
                            <p className="font-semibold text-gray-700">{day.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}</p>
                            <p className="text-2xl font-bold text-indigo-600">{day.getUTCDate()}</p>
                        </div>
                        <div className="flex-grow p-2 space-y-2 min-h-[60vh] bg-gray-50/50">
                            {bookingsByDay[index].length > 0 ? (
                                bookingsByDay[index].map(booking => (
                                    <div 
                                      key={booking.id} 
                                      className={`p-2 rounded-md text-xs cursor-pointer transition-colors ${getStatusColor(booking.status)}`}
                                      onClick={() => onBookingClick(booking)}
                                    >
                                        <p className="font-bold truncate">{booking.roomId} - {booking.category}</p>
                                        <p className="whitespace-normal text-[11px]">{booking.description}</p>
                                        <p className="text-gray-600 mt-1">{booking.startTime}:00 - {booking.endTime}:00</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-xs text-gray-400 pt-4">No bookings</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeekView;