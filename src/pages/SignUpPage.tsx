import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup({ username, email, password });
    navigate('/login'); // Redirect to login after successful signup
  };

  return (
    <>
      <h2 className="text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* ... Form inputs ... (Same structure as LoginPage) */}
        <button type="submit" disabled={isLoading}>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
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