import React from 'react';
import { Notification } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface NotificationPanelProps {
    notifications: Notification[];
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose }) => {
    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-3 border-b">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-gray-100 flex items-start gap-3 hover:bg-gray-50">
                            {n.message.includes('approved') ? (
                                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                                <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            )}
                            <p className="text-sm text-gray-700">{n.message}</p>
                        </div>
                    ))
                ) : (
                    <p className="p-4 text-center text-sm text-gray-500">You have no new notifications.</p>
                )}
            </div>
             <div className="p-2 bg-gray-50 text-center">
                <button onClick={onClose} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    Close
                </button>
            </div>
        </div>
    );
};

export default NotificationPanel;
