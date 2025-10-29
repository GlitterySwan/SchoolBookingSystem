import React, { useState, useEffect, useMemo } from 'react';
import { Room, Booking, BookingStatus, BookingCategory, User, JustificationFile } from '../types';
import { ROLE_CONFIG } from '../constants';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: Omit<Booking, 'id' | 'userId' | 'userName' | 'userRole' | 'status' | 'cancellationReason'>) => void;
  rooms: Room[];
  existingBookings: Booking[];
  selectedDate: Date;
  user: User;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM (20:00)

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

const BookingForm: React.FC<BookingFormProps> = ({ isOpen, onClose, onSubmit, rooms, existingBookings, selectedDate, user }) => {
  const [roomId, setRoomId] = useState<string>(rooms[0]?.id || '');
  const [category, setCategory] = useState<BookingCategory>(BookingCategory.Class);
  const [description, setDescription] = useState('');
  const [bookingDate, setBookingDate] = useState(toYYYYMMDD(selectedDate));
  const [startTime, setStartTime] = useState<number>(9);
  const [endTime, setEndTime] = useState<number>(10);
  const [justificationFile, setJustificationFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const isWeekend = useMemo(() => {
    const date = new Date(bookingDate);
    const day = date.getUTCDay(); // Use UTC day to avoid timezone issues
    return day === 0 || day === 6; // Sunday or Saturday
  }, [bookingDate]);

  const roleConfig = ROLE_CONFIG[user.role];
  const todayStrForMin = toYYYYMMDD(new Date());

  useEffect(() => {
      setCategory(roleConfig.allowedCategories[0]);
  }, [roleConfig.allowedCategories]);
  
  useEffect(() => {
    setBookingDate(toYYYYMMDD(selectedDate));
  }, [selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!description.trim()) { return setError('Description is required.'); }
    if (startTime >= endTime) { return setError('End time must be after start time.'); }
    
    const duration = endTime - startTime;
    if (duration > roleConfig.maxDuration) {
        return setError(`Your role allows a maximum booking duration of ${roleConfig.maxDuration} hours.`);
    }

    if (isWeekend && !justificationFile) {
        return setError('A justification file is required for weekend bookings.');
    }

    // Conflict detection
    const conflict = existingBookings.find(b =>
      b.roomId === roomId && b.date === bookingDate && b.status === BookingStatus.Approved &&
      ((startTime >= b.startTime && startTime < b.endTime) || (endTime > b.startTime && endTime <= b.endTime) || (startTime <= b.startTime && endTime >= b.endTime))
    );
    if (conflict) { return setError(`Time slot conflicts with an existing booking.`); }

    let fileData: JustificationFile | undefined = undefined;
    if(justificationFile) {
        const base64Content = await fileToBase64(justificationFile);
        fileData = {
            name: justificationFile.name,
            type: justificationFile.type,
            content: base64Content
        }
    }

    onSubmit({ roomId, category, description, date: bookingDate, startTime, endTime, justificationFile: fileData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{user.role === 'Admin' ? 'Create Booking' : 'Request Booking'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm mb-4">{error}</div>}
          
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input 
                type="date" 
                id="date" 
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={todayStrForMin}
                required
                className="mt-1 block w-full border-gray-300 rounded-md py-2 px-3 shadow-sm"
            />
          </div>
          
           {isWeekend && 
                <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-800">Bookings on weekends require special approval and a justification file.</p>
                </div>
            }

          <div className="mb-4">
            <label htmlFor="room" className="block text-sm font-medium text-gray-700">Room</label>
            <select id="room" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as BookingCategory)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                {roleConfig.allowedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Midterm review session" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
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
           {isWeekend && (
              <div className="mb-6">
                <label htmlFor="justificationFile" className="block text-sm font-medium text-gray-700">Justification File</label>
                <input 
                    type="file" 
                    id="justificationFile"
                    onChange={(e) => setJustificationFile(e.target.files ? e.target.files[0] : null)}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    accept=".pdf,.doc,.docx"
                />
                <p className="text-xs text-gray-500 mt-1">Required for weekend bookings. PDF or Word doc.</p>
              </div>
            )}
          
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                {user.role === 'Admin' ? 'Create Booking' : 'Request Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;