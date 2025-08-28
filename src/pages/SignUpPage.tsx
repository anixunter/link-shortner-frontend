import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup({ username, password });
    navigate('/login'); // Redirect to login after successful signup
  };

  return (
    <>
      <h2 className="text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
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
        <div></div>
        <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-semibold cursor-pointer rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors" disabled={isLoading}>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
      </form>
      <p className="mt-2 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUpPage; // The form inputs are omitted for brevity but would be similar to LoginPage