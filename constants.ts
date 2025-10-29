import { Room, User, Booking, UserRole, BookingStatus, BookingCategory } from './types';

export const ROOMS: Room[] = [
  { id: 'L201', name: 'L201' },
  { id: 'L202', name: 'L202' },
  { id: 'L203', name: 'L203' },
  { id: 'L204', name: 'L204' },
  { id: 'L205', name: 'L205' },
  { id: 'Openlab', name: 'Openlab' },
  { id: 'IoT', name: 'IoT Lab' },
  { id: 'ITRC', name: 'ITRC' },
];

export const MOCK_USERS: User[] = [
    { 
      id: 1, 
      name: 'Admin User', 
      email: 'admin@school.edu', 
      password: 'password', 
      role: UserRole.Admin,
      notificationEnabled: true
    },
    { 
      id: 2, 
      name: 'Dr. Evelyn Reed', 
      email: 'ereed_faculty@uic.edu.ph', 
      password: 'password', 
      role: UserRole.Faculty,
      department: 'Computer Science',
      notificationEnabled: true
    },
    {
      id: 3,
      name: 'Alleah Marie G. Ariego',
      email: 'aariego_240000001167@uic.edu.ph',
      password: 'password',
      role: UserRole.Student,
      section: 'BSIT - 2A',
      notificationEnabled: true
    },
];

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const todayStr = `${yyyy}-${mm}-${dd}`;

// find a saturday for a mock weekend booking
const getNextSaturday = () => {
    const date = new Date();
    date.setDate(date.getDate() + (6 - date.getDay() + 7) % 7);
    return date.toISOString().split('T')[0];
}
const nextSaturdayStr = getNextSaturday();


export const MOCK_BOOKINGS: Booking[] = [
    {
        id: 1,
        roomId: 'L201',
        userId: 2,
        userName: 'Dr. Evelyn Reed',
        userRole: UserRole.Faculty,
        category: BookingCategory.Class,
        description: 'Lecture on Advanced Algorithms',
        date: todayStr,
        startTime: 9,
        endTime: 11,
        status: BookingStatus.Approved,
    },
    {
        id: 2,
        roomId: 'ITRC',
        userId: 3,
        userName: 'Alleah Marie G. Ariego',
        userRole: UserRole.Student,
        category: BookingCategory.StudySession,
        description: 'Group project session for finals',
        date: todayStr,
        startTime: 13,
        endTime: 15,
        status: BookingStatus.Pending,
    },
    {
        id: 4,
        roomId: 'L203',
        userId: 3,
        userName: 'Alleah Marie G. Ariego',
        userRole: UserRole.Student,
        category: BookingCategory.ClubEvent,
        description: 'Tech Club Weekend Hackathon Planning',
        date: nextSaturdayStr,
        startTime: 10,
        endTime: 14,
        status: BookingStatus.Pending,
        justificationFile: {
          name: 'Event_Approval_Letter.pdf',
          type: 'application/pdf',
          content: 'mock_pdf_content_base64' // In a real app, this would be a real base64 string
        }
    },
];

export const ROLE_CONFIG = {
  [UserRole.Student]: {
    maxDuration: 2, // hours
    allowedCategories: [BookingCategory.StudySession, BookingCategory.ClubEvent, BookingCategory.Defense],
  },
  [UserRole.Faculty]: {
    maxDuration: 4, // hours
    allowedCategories: [BookingCategory.Class, BookingCategory.Seminar, BookingCategory.Defense, BookingCategory.Other],
  },
  [UserRole.Admin]: {
    maxDuration: 8, // hours
    allowedCategories: Object.values(BookingCategory),
  }
};