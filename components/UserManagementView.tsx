import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { TrashIcon, UserIcon } from './Icons';
import EditUserModal from './EditUserModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface UserManagementViewProps {
  users: User[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

const UserManagementView: React.FC<UserManagementViewProps> = ({ users, onUpdateUser, onDeleteUser }) => {
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const nonAdminUsers = users.filter(u => u.role !== UserRole.Admin);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">User Management</h2>
          <p className="text-sm text-gray-500">Total Users: {nonAdminUsers.length}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nonAdminUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.role === UserRole.Student ? `Section: ${user.section}` : `Dept: ${user.department}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-4">
                        <button onClick={() => setUserToEdit(user)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => setUserToDelete(user)} className="text-red-600 hover:text-red-900">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {userToEdit && (
        <EditUserModal
          isOpen={!!userToEdit}
          onClose={() => setUserToEdit(null)}
          user={userToEdit}
          onUpdateUser={(updatedUser) => {
            onUpdateUser(updatedUser);
            setUserToEdit(null);
          }}
        />
      )}

      {userToDelete && (
        <DeleteConfirmationModal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={() => {
            onDeleteUser(userToDelete.id);
            setUserToDelete(null);
          }}
          title="Delete User"
          message={`Are you sure you want to delete the user "${userToDelete.name}"? This action will also remove all their associated bookings and cannot be undone.`}
        />
      )}
    </>
  );
};

export default UserManagementView;
