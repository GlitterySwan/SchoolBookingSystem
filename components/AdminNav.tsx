import React from 'react';
import { PlusIcon, ChartBarIcon, UsersIcon } from './Icons';

type MainView = 'calendar' | 'list' | 'users';

interface AdminNavProps {
    onRequestBookingClick: () => void;
    onGenerateReportClick: () => void;
    onSetView: (view: MainView) => void;
    currentView: MainView;
}

const AdminNav: React.FC<AdminNavProps> = ({ onRequestBookingClick, onGenerateReportClick, onSetView, currentView }) => {
    return (
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <button onClick={onRequestBookingClick} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-semibold">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Booking
                </button>
                <button onClick={onGenerateReportClick} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-semibold">
                    <ChartBarIcon className="w-5 h-5 mr-2" />
                    Generate Report
                </button>
            </div>
            <div className="flex items-center bg-gray-200 rounded-lg p-1">
                <button 
                    onClick={() => onSetView('calendar')}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md ${currentView === 'calendar' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    Calendar
                </button>
                <button 
                    onClick={() => onSetView('list')}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md ${currentView === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    All Bookings
                </button>
                 <button 
                    onClick={() => onSetView('users')}
                    className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-md ${currentView === 'users' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    <UsersIcon className="w-4 h-4" />
                    Manage Users
                </button>
            </div>
        </div>
    );
};

export default AdminNav;
