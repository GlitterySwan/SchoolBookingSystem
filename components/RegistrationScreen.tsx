import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { BuildingOfficeIcon, EyeIcon, EyeSlashIcon } from './Icons';

interface RegistrationScreenProps {
  onRegister: (newUser: Omit<User, 'id'>) => boolean;
  onNavigateToLogin: () => void;
  error: string | null;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegister, onNavigateToLogin, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.Student);
  const [section, setSection] = useState('');
  const [department, setDepartment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (role === UserRole.Student && !section.trim()) {
        setFormError('Section is required for students.');
        return;
    }
    if (role === UserRole.Faculty && !department.trim()) {
        setFormError('Department is required for faculty.');
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        setFormError('Please enter a valid email address.');
        return;
    }
     const uicEmailRegex = /_(\d{12})@uic\.edu\.ph$/;
    if (role === UserRole.Student && !uicEmailRegex.test(email)) {
        setFormError('Student email must follow the format: name_IDnumber@uic.edu.ph');
        return;
    }


    const newUser: Omit<User, 'id'> = {
        name,
        email,
        password,
        role,
        section: role === UserRole.Student ? section : undefined,
        department: role === UserRole.Faculty ? department : undefined,
        notificationEnabled: true,
    };
    onRegister(newUser);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
            <BuildingOfficeIcon className="w-16 h-16 mx-auto text-indigo-500" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join the School Booking System
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">{error}</div>}
          {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">{formError}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value={UserRole.Student}>Student</option>
                <option value={UserRole.Faculty}>Faculty</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>

          {role === UserRole.Student ? (
             <div>
                <label className="block text-sm font-medium text-gray-700">Section (e.g., BSIT - 2A)</label>
                <input type="text" required value={section} onChange={(e) => setSection(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
          ) : (
             <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input type="text" required value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
             <div className="relative mt-1">
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10"/>
                 <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
            </div>
          </div>

          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700">
              Register
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <button onClick={onNavigateToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegistrationScreen;