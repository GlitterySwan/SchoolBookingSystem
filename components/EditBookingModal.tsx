import React, { useState } from 'react';
import { Booking, BookingStatus } from '../types';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: Booking) => void;
  booking: Booking;
  existingBookings: Booking[];
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM (20:00)

const EditBookingModal: React.FC<EditBookingModalProps> = ({ isOpen, onClose, onSubmit, booking, existingBookings }) => {
  const [startTime, setStartTime] = useState<number>(booking.startTime);
  const [endTime, setEndTime] = useState<number>(booking.endTime);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (startTime >= endTime) {
      return setError('End time must be after start time.');
    }

    // Conflict detection
    // Fix: Added check for b.id !== booking.id to prevent a booking from conflicting with itself.
    const conflict = existingBookings.find(b =>
      b.id !== booking.id &&
      b.roomId === booking.roomId &&
      b.date === booking.date &&
      b.status === BookingStatus.Approved &&
      ((startTime >= b.startTime && startTime < b.endTime) || (endTime > b.startTime && endTime <= b.endTime) || (startTime <= b.startTime && endTime >= b.endTime))
    );

    if (conflict) {
      return setError(`Time slot conflicts with an existing approved booking.`);
    }

    onSubmit({ ...booking, startTime, endTime });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Booking Duration</h2>
        <p className="text-sm text-gray-500 mb-2">Booking for <span className="font-semibold">{booking.userName}</span> in <span className="font-semibold">{booking.roomId}</span></p>
        <p className="text-sm text-gray-500 mb-4">Date: <span className="font-semibold">{new Date(booking.date + 'T00:00:00').toLocaleDateString()}</span></p>

        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm mb-4">{error}</div>}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
              <select id="startTime" value={startTime} onChange={(e) => setStartTime(Number(e.target.value))} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                {HOURS.slice(0, -1).map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
              <select id="endTime" value={endTime} onChange={(e) => setEndTime(Number(e.target.value))} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                {HOURS.slice(1).map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;
