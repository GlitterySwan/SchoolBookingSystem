import React from 'react';
import { Room, Booking, BookingStatus } from '../types';

interface RoomScheduleProps {
  rooms: Room[];
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.Approved: return 'bg-green-500 border-green-700';
    case BookingStatus.Pending: return 'bg-yellow-400 border-yellow-600';
    case BookingStatus.Rejected: return 'bg-red-500 border-red-700';
    case BookingStatus.Cancelled: return 'bg-gray-400 border-gray-600';
    default: return 'bg-gray-200';
  }
};

const RoomSchedule: React.FC<RoomScheduleProps> = ({ rooms, bookings, onBookingClick }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
      <div className="min-w-[1200px]">
        {/* Header */}
        <div className="grid grid-cols-[100px_repeat(13,_1fr)] gap-1 text-center font-bold text-sm text-gray-600">
          <div className="sticky left-0 bg-white z-10 p-2">Room</div>
          {HOURS.map(hour => (
            <div key={hour} className="p-2">{hour % 12 || 12} {hour < 12 || hour === 24 ? 'AM' : 'PM'}</div>
          ))}
        </div>

        {/* Schedule Grid */}
        <div className="divide-y divide-gray-200">
          {rooms.map(room => (
            <div key={room.id} className="grid grid-cols-[100px_repeat(13,_1fr)] gap-1 relative h-20">
              <div className="sticky left-0 bg-white z-10 flex items-center justify-center font-semibold text-indigo-700 p-2 border-r">
                {room.name}
              </div>
              {/* This is the timeline background */}
              {HOURS.map((hour, index) => (
                  <div key={index} className="border-r border-gray-200 h-full"></div>
              ))}
              
              {/* Render Bookings */}
              {bookings
                .filter(b => b.roomId === room.id)
                .map(booking => {
                  const duration = booking.endTime - booking.startTime;
                  const startOffset = booking.startTime - 8;
                  
                  if (startOffset < 0 || startOffset + duration > HOURS.length) return null;

                  const title = `${booking.category}: ${booking.description} (${booking.startTime}:00 - ${booking.endTime}:00) - ${booking.status}` +
                                (booking.status === BookingStatus.Cancelled && booking.cancellationReason ? `\nReason: ${booking.cancellationReason}` : '');

                  return (
                    <div
                      key={booking.id}
                      className={`absolute top-2 bottom-2 z-20 rounded-md p-2 text-white text-xs flex flex-col justify-start shadow-md cursor-pointer ${getStatusColor(booking.status)}`}
                      style={{
                        left: `${100 + startOffset * (100 / HOURS.length) * (12/11)}px`,
                        width: `${duration * (100 / HOURS.length) * (12/11)}px`
                      }}
                       title={title}
                       onClick={() => onBookingClick(booking)}
                    >
                      <p className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">{booking.category}</p>
                      <p className="opacity-90 whitespace-normal break-words leading-tight">{booking.description}</p>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>Approved</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>Pending</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>Rejected</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-400 mr-2"></span>Cancelled</div>
      </div>
    </div>
  );
};

export default RoomSchedule;
