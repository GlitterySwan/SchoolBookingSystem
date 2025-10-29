export enum UserRole {
  Admin = 'Admin',
  Faculty = 'Faculty',
  Student = 'Student',
}

export enum BookingStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export enum BookingCategory {
    Class = 'Class',
    Seminar = 'Seminar',
    Defense = 'Defense',
    ClubEvent = 'Club Event',
    StudySession = 'Study Session',
    Other = 'Other',
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Should not be stored in client-side state long-term in real apps
  role: UserRole;
  section?: string; // For Students
  department?: string; // For Faculty
  notificationEnabled: boolean;
}

export interface Room {
  id: string;
  name: string;
}

export interface JustificationFile {
    name: string;
    type: string;
    content: string; // base64 encoded
}

export interface Booking {
  id: number;
  roomId: string;
  userId: number;
  userName: string;
  userRole: UserRole;
  category: BookingCategory;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: number; // Hour from 0-23
  endTime: number; // Hour from 0-23
  status: BookingStatus;
  cancellationReason?: string;
  justificationFile?: JustificationFile;
}

export interface Notification {
    id: number;
    userId: number;
    message: string;
    read: boolean;
}