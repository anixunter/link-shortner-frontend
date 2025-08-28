import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <>
      <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <input id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username"/>
          </div>
          <div>
            <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password"/>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-semibold cursor-pointer rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>
       <p className="mt-2 text-center text-sm text-gray-600">
        Or{' '}
        <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
          create a new account
        </Link>
      </p>
    </>
  );
};

export default LoginPage;