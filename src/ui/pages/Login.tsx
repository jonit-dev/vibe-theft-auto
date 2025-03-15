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
    <div className='min-h-screen w-full flex items-center justify-center bg-cyberpunk'>
      <div className='cyber-border p-1 w-full max-w-md'>
        <div className='bg-game-dark p-8 rounded-md'>
          <h1 className='text-4xl font-bold text-center mb-8 text-white text-glow'>
            Vibe Theft Auto
          </h1>

          <form onSubmit={handleLogin} className='space-y-6'>
            <div>
              <label className='label-dark'>Username</label>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='form-control-dark'
                placeholder='Enter your username'
              />
            </div>

            <div>
              <label className='label-dark'>Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='form-control-dark'
                placeholder='Enter your password'
              />
              <div className='flex justify-end mt-1'>
                <Link
                  to='/forgot-password'
                  className='text-sm text-game-primary hover:text-game-primary hover:underline transition-colors'
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button type='submit' className='btn-neon w-full py-3 text-lg'>
              LOGIN
            </button>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-gray-400 mb-4'>Demo account: guest / password</p>
            <p className='text-gray-400'>
              Don't have an account?{' '}
              <Link
                to='/register'
                className='text-game-primary hover:text-game-primary hover:underline transition-colors'
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
