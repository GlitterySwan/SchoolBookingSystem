import React from 'react';
import { Booking, BookingStatus, User, UserRole } from '../types';
import { BuildingOfficeIcon, CalendarIcon, ClockIcon, QuestionMarkCircleIcon, CheckCircleIcon, XCircleIcon, UserIcon, TrashIcon, DocumentArrowDownIcon } from './Icons';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  currentUser: User;
  onUpdateStatus: (bookingId: number, status: BookingStatus) => void;
  onCancel: (bookingId: number) => void;
  onEdit: (booking: Booking) => void;
}

const StatusDisplay: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const statusMap = {
    [BookingStatus.Approved]: { text: 'Approved', color: 'text-green-700 bg-green-100', Icon: CheckCircleIcon },
    [BookingStatus.Pending]: { text: 'Pending Approval', color: 'text-yellow-700 bg-yellow-100', Icon: QuestionMarkCircleIcon },
    [BookingStatus.Rejected]: { text: 'Rejected', color: 'text-red-700 bg-red-100', Icon: XCircleIcon },
    [BookingStatus.Cancelled]: { text: 'Cancelled', color: 'text-gray-700 bg-gray-100', Icon: XCircleIcon },
  };
  const { text, color, Icon } = statusMap[status];
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      <Icon className="w-5 h-5 mr-2" />
      {text}
    </div>
  );
};


const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ isOpen, onClose, booking, currentUser, onUpdateStatus, onCancel, onEdit }) => {
  if (!isOpen) return null;

  const canApprove = (currentUser.role === UserRole.Admin && booking.status === BookingStatus.Pending) ||
                     (currentUser.role === UserRole.Faculty && booking.userRole === UserRole.Student && booking.status === BookingStatus.Pending);

  const canCancel = (currentUser.role === UserRole.Admin || currentUser.id === booking.userId) && 
                    booking.status !== BookingStatus.Cancelled && 
                    booking.status !== BookingStatus.Rejected;
                    
  const canEdit = currentUser.role === UserRole.Admin && booking.userRole === UserRole.Student;


  const handleDownloadJustification = () => {
    if(!booking.justificationFile) return;
    const link = document.createElement('a');
    link.href = booking.justificationFile.content;
    link.download = booking.justificationFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{booking.category}: {booking.roomId}</h2>
                <p className="text-sm text-gray-500 mt-1">Booking Details</p>
            </div>
            <StatusDisplay status={booking.status} />
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-base text-gray-700 mb-4">{booking.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                    <UserIcon className="w-5 h-5 mr-3 text-indigo-500"/>
                    <span>Booked by: <span className="font-medium text-gray-800">{booking.userName}</span></span>
                </div>
                <div className="flex items-center text-gray-600">
                    <BuildingOfficeIcon className="w-5 h-5 mr-3 text-indigo-500"/>
                    <span>Facility: <span className="font-medium text-gray-800">{booking.roomId}</span></span>
                </div>
                 <div className="flex items-center text-gray-600">
                    <CalendarIcon className="w-5 h-5 mr-3 text-indigo-500"/>
                    <span>Date: <span className="font-medium text-gray-800">{new Date(booking.date + 'T00:00:00').toLocaleDateString()}</span></span>
                </div>
                <div className="flex items-center text-gray-600">
                    <ClockIcon className="w-5 h-5 mr-3 text-indigo-500"/>
                    <span>Time: <span className="font-medium text-gray-800">{booking.startTime}:00 - {booking.endTime}:00</span></span>
                </div>
            </div>

            {booking.justificationFile && (
                <div className="mt-4">
                    <button onClick={handleDownloadJustification} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        <DocumentArrowDownIcon className="w-5 h-5" />
                        Download Justification ({booking.justificationFile.name})
                    </button>
                </div>
            )}

             {booking.status === BookingStatus.Cancelled && booking.cancellationReason && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-3">
                    <p className="text-sm font-semibold text-red-800">Cancellation Reason:</p>
                    <p className="text-sm text-red-700 italic">{booking.cancellationReason}</p>
                </div>
             )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 order-last sm:order-1">Close</button>
            {canCancel && (
                 <button onClick={() => onCancel(booking.id)} className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 order-3 sm:order-2">
                    <TrashIcon className="w-4 h-4" />
                    Cancel Booking
                </button>
             )}
            {canEdit && (
                 <button onClick={() => { onClose(); onEdit(booking); }} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 order-2 sm:order-3">Edit</button>
            )}
            {canApprove && (
                <>
                    <button onClick={() => onUpdateStatus(booking.id, BookingStatus.Rejected)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 order-2 sm:order-4">Reject</button>
                    <button onClick={() => onUpdateStatus(booking.id, BookingStatus.Approved)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 order-1 sm:order-5">Approve</button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
