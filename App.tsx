import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import Dashboard from './components/Dashboard';
import { MOCK_USERS, MOCK_BOOKINGS, ROOMS } from './constants';
import { User, Booking, Notification, BookingStatus, UserRole } from './types';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const savedBookings = localStorage.getItem('bookings');
    return savedBookings ? JSON.parse(savedBookings) : MOCK_BOOKINGS;
  });
   const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard'>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);
  
  const addNotification = (userId: number, message: string) => {
    const user = users.find(u => u.id === userId);
    if (user && user.notificationEnabled) {
      setNotifications(prev => [...prev, { id: Date.now(), userId, message, read: false }]);
    }
  };

  const handleLogin = (email: string, password: string): boolean => {
    setAuthError(null);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('dashboard');
      return true;
    }
    setAuthError('Invalid email or password.');
    return false;
  };

  const handleRegister = (newUser: Omit<User, 'id'>): boolean => {
    setAuthError(null);
    if (users.some(u => u.email === newUser.email)) {
      setAuthError('An account with this email already exists.');
      return false;
    }
    const userWithId = { ...newUser, id: Date.now() };
    setUsers(prevUsers => [...prevUsers, userWithId]);
    setCurrentUser(userWithId);
    setCurrentPage('dashboard');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };
  
  const handleAddBooking = (newBookingData: Omit<Booking, 'id' | 'userId' | 'userName' | 'userRole' | 'status'| 'cancellationReason'>) => {
      if(!currentUser) return;
      const newBooking: Booking = {
          ...newBookingData,
          id: Date.now(),
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          status: currentUser.role === UserRole.Admin ? BookingStatus.Approved : BookingStatus.Pending,
      };
      setBookings(prev => [...prev, newBooking]);
      if (newBooking.status === BookingStatus.Pending) {
         const admin = users.find(u => u.role === UserRole.Admin);
         if(admin) {
            addNotification(admin.id, `${currentUser.name} has requested a booking for ${newBooking.roomId} on ${newBooking.date}.`);
         }
      }
  };
  
  const handleUpdateBookingStatus = (bookingId: number, status: BookingStatus, reason?: string) => {
      setBookings(prev => prev.map(b => {
          if (b.id === bookingId) {
              const updatedBooking = { ...b, status, cancellationReason: reason };
              if (status === BookingStatus.Approved) addNotification(b.userId, `Your booking for ${b.roomId} on ${b.date} has been approved.`);
              if (status === BookingStatus.Rejected) addNotification(b.userId, `Your booking for ${b.roomId} on ${b.date} has been rejected.`);
              if (status === BookingStatus.Cancelled) addNotification(b.userId, `Your booking for ${b.roomId} on ${b.date} has been cancelled. Reason: ${reason}`);
              return updatedBooking;
          }
          return b;
      }));
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
      setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };
  
  const handleUpdateUser = (updatedUser: User, oldPassword?: string): { success: boolean; message?: string } => {
    const originalUser = users.find(u => u.id === updatedUser.id);
    if (!originalUser) {
        return { success: false, message: "User not found." };
    }

    // If oldPassword is provided, it's a self-update. Validate it.
    if (oldPassword) {
        if (originalUser.password !== oldPassword) {
            return { success: false, message: "Incorrect current password." };
        }
    }

    // Apply all updates. The password from updatedUser will be used if present.
    // If not present, the original password is kept.
    const finalUser = {
        ...originalUser,
        ...updatedUser,
    };

    setUsers(prev => prev.map(u => u.id === finalUser.id ? finalUser : u));
    if (currentUser && currentUser.id === finalUser.id) {
        setCurrentUser(finalUser);
    }
    return { success: true };
  };

  const handleDeleteUser = (userId: number) => {
    // Admins cannot be deleted.
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.role === UserRole.Admin) return;
  
    // Cancel all bookings associated with the user
    setBookings(prev =>
      prev.map(b =>
        b.userId === userId && (b.status === BookingStatus.Approved || b.status === BookingStatus.Pending)
          ? { ...b, status: BookingStatus.Cancelled, cancellationReason: 'User account deleted.' }
          : b
      )
    );
    // Then, delete the user
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  if (currentPage === 'login') {
    return <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => { setAuthError(null); setCurrentPage('register'); }} error={authError} />;
  }

  if (currentPage === 'register') {
    return <RegistrationScreen onRegister={handleRegister} onNavigateToLogin={() => { setAuthError(null); setCurrentPage('login'); }} error={authError} />;
  }

  if (currentUser) {
    return (
      <Dashboard
        currentUser={currentUser}
        users={users}
        bookings={bookings}
        rooms={ROOMS}
        notifications={notifications.filter(n => n.userId === currentUser.id && !n.read)}
        onLogout={handleLogout}
        onAddBooking={handleAddBooking}
        onUpdateBookingStatus={handleUpdateBookingStatus}
        onUpdateBooking={handleUpdateBooking}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onClearNotifications={() => setNotifications(prev => prev.map(n => n.userId === currentUser.id ? {...n, read: true} : n))}
      />
    );
  }

  return <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage('register')} error={authError} />;
};

export default App;
