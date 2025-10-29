import React from 'react';
import { Booking, BookingStatus, User, UserRole } from '../types';
import { BuildingOfficeIcon, CheckCircleIcon, ClockIcon, QuestionMarkCircleIcon, TrashIcon, XCircleIcon } from './Icons';

interface BookingListProps {
  bookings: Booking[];
  currentUser: User;
  onUpdateStatus: (bookingId: number, status: BookingStatus) => void;
  onCancel: (bookingId: number) => void;
  onBookingClick: (booking: Booking) => void;
}

const StatusIndicator: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const statusMap = {
    [BookingStatus.Approved]: { text: 'Approved', color: 'text-green-600', Icon: CheckCircleIcon },
    [BookingStatus.Pending]: { text: 'Pending', color: 'text-yellow-600', Icon: QuestionMarkCircleIcon },
    [BookingStatus.Rejected]: { text: 'Rejected', color: 'text-red-600', Icon: XCircleIcon },
    [BookingStatus.Cancelled]: { text: 'Cancelled', color: 'text-gray-600', Icon: XCircleIcon },
  };
  const { text, color, Icon } = statusMap[status];
  return (
    <span className={`flex items-center text-sm font-medium ${color}`}>
      <Icon className="w-5 h-5 mr-1.5" />
      {text}
    </span>
  );
};

const BookingList: React.FC<BookingListProps> = ({ bookings, currentUser, onUpdateStatus, onCancel, onBookingClick }) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No bookings to display.</p>
      </div>
    );
  }
  
  const sortedBookings = [...bookings].sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.startTime - b.startTime;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedBookings.map((booking) => {
                const canFacultyApprove = currentUser.role === UserRole.Faculty && booking.userRole === UserRole.Student && booking.status === BookingStatus.Pending;
                const canAdminApprove = currentUser.role === UserRole.Admin && booking.status === BookingStatus.Pending;
                const canCancel = (currentUser.role === UserRole.Admin || currentUser.id === booking.userId) && ![BookingStatus.Cancelled, BookingStatus.Rejected].includes(booking.status);

                return (
                  <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onBookingClick(booking)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0"/>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{booking.roomId}: <span className="font-medium">{booking.category}</span></p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">{booking.description}</p>
                          <p className="text-xs text-gray-500">{booking.userName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-700">{new Date(booking.date + 'T00:00:00').toLocaleDateString()}</div>
                        <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {booking.startTime}:00 - {booking.endTime}:00
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={booking.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end items-center gap-2">
                            {(canAdminApprove || canFacultyApprove) && (
                                <>
                                <button onClick={() => onUpdateStatus(booking.id, BookingStatus.Approved)} className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs">Approve</button>
                                <button onClick={() => onUpdateStatus(booking.id, BookingStatus.Rejected)} className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs">Reject</button>
                                </>
                            )}
                            {canCancel && (
                                <button onClick={() => onCancel(booking.id)} className="text-gray-600 hover:text-red-600" title="Cancel Booking">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </td>
                  </tr>
                )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;