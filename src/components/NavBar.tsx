import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { FaSignOutAlt } from 'react-icons/fa';

const NavBar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">LinkShort</h1>
        <div className="flex items-center">
          <span className="text-gray-700 mr-4">Hello, {user?.username}</span>
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;