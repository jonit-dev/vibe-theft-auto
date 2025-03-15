import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // For demo purposes, just save to localStorage and navigate to login
    try {
      // This would be a registration API call in a real app
      localStorage.setItem(
        'registeredUser',
        JSON.stringify({
          username: formData.username,
          email: formData.email,
        })
      );

      // Navigate to login page after successful registration
      navigate('/', {
        state: { message: 'Registration successful! Please log in.' },
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-cyberpunk'>
      <div className='cyber-border p-1 w-full max-w-lg'>
        <div className='bg-game-dark p-8 rounded-md'>
          <h2 className='text-3xl font-bold text-center mb-8 text-white text-glow'>
            Create Your Account
          </h2>

          {error && (
            <div className='bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label htmlFor='username' className='label-dark'>
                Username
              </label>
              <input
                type='text'
                id='username'
                name='username'
                value={formData.username}
                onChange={handleChange}
                placeholder='Enter username'
                className='form-control-dark'
              />
            </div>

            <div>
              <label htmlFor='email' className='label-dark'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Enter email'
                className='form-control-dark'
              />
            </div>

            <div>
              <label htmlFor='password' className='label-dark'>
                Password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter password'
                className='form-control-dark'
              />
            </div>

            <div>
              <label htmlFor='confirmPassword' className='label-dark'>
                Confirm Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='Confirm password'
                className='form-control-dark'
              />
            </div>

            <button type='submit' className='btn-neon w-full py-3 text-lg mt-4'>
              REGISTER
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-gray-400'>
              Already have an account?{' '}
              <Link
                to='/'
                className='text-game-primary hover:text-game-primary hover:underline transition-colors'
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
