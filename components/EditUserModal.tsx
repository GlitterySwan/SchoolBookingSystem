import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { EyeIcon, EyeSlashIcon } from './Icons';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (user: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [section, setSection] = useState(user.section || '');
  const [department, setDepartment] = useState(user.department || '');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setName(user.name);
    setSection(user.section || '');
    setDepartment(user.department || '');
    setNewPassword(''); // Reset on user change
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      name,
      section: user.role === UserRole.Student ? section : user.section,
      department: user.role === UserRole.Faculty ? department : user.department,
    };
    if (newPassword) {
      updatedUser.password = newPassword;
    }
    onUpdateUser(updatedUser);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit User</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="mb-4 border-t pt-4">
            <label className="block text-sm font-medium text-gray-700">Reset Password</label>
            <p className="text-xs text-gray-500 mb-1">Leave blank to keep the current password.</p>
            <div className="relative mt-1">
                <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="block w-full border-gray-300 rounded-md shadow-sm pr-10"
                    placeholder="Enter new password"
                />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
            </div>
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

export default EditUserModal;
