import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    console.log('Login attempt with:', username, password);

    // For demo purposes, just store a fake token
    localStorage.setItem('authToken', 'fake-jwt-token');

    // Navigate to the main menu
    navigate('/menu');
  };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-red-800'>
      <div className='bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/20'>
        <h1 className='text-4xl font-bold text-center mb-8 text-white'>
          Vibe Theft Auto
        </h1>

        <form onSubmit={handleLogin} className='space-y-6'>
          <div>
            <label className='block text-white mb-2 font-medium'>
              Username
            </label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter your username'
            />
          </div>

          <div>
            <label className='block text-white mb-2 font-medium'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter your password'
            />
            <div className='flex justify-end mt-1'>
              <Link
                to='/forgot-password'
                className='text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors'
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type='submit'
            className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105'
          >
            LOGIN
          </button>
        </form>

        <div className='mt-8 text-center'>
          <p className='text-gray-400 mb-4'>Demo account: guest / password</p>
          <p className='text-gray-400'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-blue-400 hover:text-blue-300 hover:underline transition-colors'
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
