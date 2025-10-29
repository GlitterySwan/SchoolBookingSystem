import React, { useState, useMemo } from 'react';
import { User, Booking, Room, Notification, BookingStatus, UserRole } from '../types';
import { ArrowLeftOnRectangleIcon, BellIcon, Cog6ToothIcon, UserIcon } from './Icons';
import AdminNav from './AdminNav';
import UserNav from './UserNav';
import CalendarControls from './CalendarControls';
import CalendarView from './CalendarView';
import BookingList from './BookingList';
import BookingForm from './BookingForm';
import AdminReport from './AdminReport';
import CancellationModal from './CancellationModal';
import BookingDetailsModal from './BookingDetailsModal';
import ProfileModal from './ProfileModal';
import UserManagementView from './UserManagementView';
import EditBookingModal from './EditBookingModal';

export type CalendarViewType = 'day' | 'week' | 'month';
type MainView = 'calendar' | 'list' | 'users';

interface DashboardProps {
  currentUser: User;
  users: User[];
  bookings: Booking[];
  rooms: Room[];
  notifications: Notification[];
  onLogout: () => void;
  onAddBooking: (bookingData: Omit<Booking, 'id' | 'userId' | 'userName' | 'userRole' | 'status' | 'cancellationReason'>) => void;
  onUpdateBookingStatus: (bookingId: number, status: BookingStatus, reason?: string) => void;
  onUpdateBooking: (booking: Booking) => void;
  onUpdateUser: (user: User, oldPassword?: string) => { success: boolean; message?: string };
  onDeleteUser: (userId: number) => void;
  onClearNotifications: () => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { currentUser, onLogout, bookings, rooms, onAddBooking, onUpdateBookingStatus, onUpdateBooking, notifications, onClearNotifications } = props;

  const [mainView, setMainView] = useState<MainView>('calendar');
  const [calendarView, setCalendarView] = useState<CalendarViewType>('day');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  
  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleCancelClick = (bookingId: number) => {
    setBookingToCancel(bookingId);
    setIsCancellationModalOpen(true);
  };

  const handleConfirmCancel = (reason: string) => {
    if (bookingToCancel) {
      onUpdateBookingStatus(bookingToCancel, BookingStatus.Cancelled, reason);
    }
    setIsCancellationModalOpen(false);
    setBookingToCancel(null);
    setIsDetailsModalOpen(false);
  };
  
  const handleEditClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
    onUpdateBooking(updatedBooking);
    setIsEditModalOpen(false);
    setSelectedBooking(null);
  };
  
  const filteredBookings = useMemo(() => {
    if (currentUser.role === UserRole.Admin) return bookings;
    if (currentUser.role === UserRole.Faculty) {
        return bookings.filter(b => b.userRole === UserRole.Faculty || b.userRole === UserRole.Student);
    }
    return bookings.filter(b => b.userId === currentUser.id);
  }, [bookings, currentUser]);

  const header = (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center">
        <UserIcon className="w-8 h-8 text-indigo-600 mr-3" />
        <div>
          <h1 className="text-xl font-bold text-gray-800">{currentUser.name}</h1>
          <p className="text-sm text-gray-500">{currentUser.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => setIsProfileModalOpen(true)} className="p-2 rounded-full hover:bg-gray-100">
            <Cog6ToothIcon className="w-6 h-6 text-gray-600"/>
        </button>
        <button onClick={onLogout} className="flex items-center text-sm text-gray-600 hover:text-indigo-600">
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-1" />
          Logout
        </button>
      </div>
    </header>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {header}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                {currentUser.role === UserRole.Admin ? (
                    <AdminNav 
                        currentView={mainView}
                        onSetView={setMainView}
                        onRequestBookingClick={() => setIsBookingFormOpen(true)}
                        onGenerateReportClick={() => setIsReportModalOpen(true)}
                    />
                ) : (
                    <UserNav
                         currentView={mainView as 'calendar' | 'list'}
                         onSetView={view => setMainView(view)}
                         onRequestBookingClick={() => setIsBookingFormOpen(true)}
                    />
                )}
            </div>
            {mainView === 'calendar' && (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <CalendarControls 
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            calendarView={calendarView}
                            setCalendarView={setCalendarView}
                        />
                    </div>
                    <CalendarView
                        calendarView={calendarView}
                        currentDate={currentDate}
                        bookings={bookings}
                        rooms={rooms}
                        onBookingClick={handleBookingClick}
                        onDateChange={setCurrentDate}
                        onViewChange={setCalendarView}
                    />
                </div>
            )}
            {mainView === 'list' && (
                <BookingList 
                    bookings={filteredBookings}
                    currentUser={currentUser}
                    onUpdateStatus={onUpdateBookingStatus}
                    onCancel={handleCancelClick}
                    onBookingClick={handleBookingClick}
                />
            )}
            {mainView === 'users' && currentUser.role === UserRole.Admin && (
                <UserManagementView {...props} />
            )}
        </div>
      </main>

      <BookingForm
        isOpen={isBookingFormOpen}
        onClose={() => setIsBookingFormOpen(false)}
        onSubmit={onAddBooking}
        rooms={rooms}
        existingBookings={bookings}
        selectedDate={currentDate}
        user={currentUser}
      />

      <AdminReport
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        bookings={bookings.filter(b => b.date === currentDate.toISOString().split('T')[0])}
      />
      
      <CancellationModal
        isOpen={isCancellationModalOpen}
        onClose={() => setIsCancellationModalOpen(false)}
        onSubmit={handleConfirmCancel}
      />

      {selectedBooking && (
          <BookingDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            booking={selectedBooking}
            currentUser={currentUser}
            onUpdateStatus={onUpdateBookingStatus}
            onCancel={handleCancelClick}
            onEdit={handleEditClick}
          />
      )}
      
       {selectedBooking && (
          <EditBookingModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            booking={selectedBooking}
            existingBookings={bookings}
            onSubmit={handleUpdateBooking}
          />
      )}

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        onUpdateUser={props.onUpdateUser}
      />
    </div>
  );
};

export default Dashboard;
