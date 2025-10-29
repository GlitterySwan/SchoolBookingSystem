import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { BellIcon, BellSlashIcon, EyeIcon, EyeSlashIcon } from './Icons';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (user: User, oldPassword?: string) => { success: boolean; message?: string };
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [section, setSection] = useState(user.section || '');
  const [department, setDepartment] = useState(user.department || '');
  const [notificationEnabled, setNotificationEnabled] = useState(user.notificationEnabled);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setPasswordError('');

    let finalUser = {
      ...user,
      name,
      section: user.role === UserRole.Student ? section : undefined,
      department: user.role === UserRole.Faculty ? department : undefined,
      notificationEnabled,
    };
    
    let oldPasswordForCheck: string | undefined = undefined;

    // Handle password change if fields are filled
    if (showPasswordChange && (newPassword || currentPassword)) {
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        if (!currentPassword) {
            setPasswordError("Current password is required to set a new one.");
            return;
        }
        if (newPassword.length < 6) {
             setPasswordError("New password must be at least 6 characters long.");
            return;
        }
        finalUser.password = newPassword;
        oldPasswordForCheck = currentPassword;
    }
    
    const result = onUpdateUser(finalUser, oldPasswordForCheck);

    if (result.success) {
        setSuccessMessage('Profile updated successfully!');
        // Clear password fields on success
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordChange(false);
        setTimeout(() => {
            setSuccessMessage('');
            onClose();
        }, 1500);
    } else {
        setPasswordError(result.message || 'An unknown error occurred.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Profile</h2>
        <form onSubmit={handleSubmit}>
          {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm mb-4">{successMessage}</div>}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={user.email} disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md py-2 px-3"/>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
          </div>

          {user.role === UserRole.Student && (
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Section</label>
                <input type="text" value={section} onChange={(e) => setSection(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
            </div>
          )}
          {user.role === UserRole.Faculty && (
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
            </div>
          )}
          
          {user.role !== UserRole.Admin && (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
                <button type="button" onClick={() => setNotificationEnabled(!notificationEnabled)} className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${notificationEnabled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'}`}>
                    {notificationEnabled ? <BellIcon className="w-5 h-5 mr-2" /> : <BellSlashIcon className="w-5 h-5 mr-2" />}
                    {notificationEnabled ? 'Email Notifications are ON' : 'Email Notifications are OFF'}
                </button>
            </div>
          )}

          <div className="border-t pt-4 mt-4">
            <button type="button" onClick={() => setShowPasswordChange(!showPasswordChange)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
            </button>

            {showPasswordChange && (
                 <div className="mt-4 space-y-4">
                    {passwordError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">{passwordError}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                         <div className="relative mt-1">
                            <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm pr-10"/>
                             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                    </div>
                 </div>
            )}
           
          </div>


          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
