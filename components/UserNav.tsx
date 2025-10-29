import React from 'react';
import { PlusIcon } from './Icons';

type MainView = 'calendar' | 'list';

interface UserNavProps {
    onRequestBookingClick: () => void;
    onSetView: (view: MainView) => void;
    currentView: MainView;
}

const UserNav: React.FC<UserNavProps> = ({ onRequestBookingClick, onSetView, currentView }) => {
    return (
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <button onClick={onRequestBookingClick} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-semibold">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Request Booking
                </button>
            </div>
             <div className="flex items-center bg-gray-200 rounded-lg p-1">
                <button 
                    onClick={() => onSetView('calendar')}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md ${currentView === 'calendar' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    Calendar View
                </button>
                 <button 
                    onClick={() => onSetView('list')}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md ${currentView === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    My Bookings
                </button>
            </div>
        </div>
    );
};

export default UserNav;
