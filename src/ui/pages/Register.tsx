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
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-red-800'>
      <div className='bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-lg border border-white/20'>
        <h2 className='text-3xl font-bold text-center mb-8 text-white'>
          Create Your Account
        </h2>

        {error && (
          <div className='bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label
              htmlFor='username'
              className='block text-white mb-2 font-medium'
            >
              Username
            </label>
            <input
              type='text'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='Enter username'
              className='w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-white mb-2 font-medium'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter email'
              className='w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-white mb-2 font-medium'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter password'
              className='w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-white mb-2 font-medium'
            >
              Confirm Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='Confirm password'
              className='w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <button
            type='submit'
            className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/50 transition duration-300 ease-in-out transform hover:-translate-y-1 mt-4'
          >
            REGISTER
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-gray-400'>
            Already have an account?{' '}
            <Link
              to='/'
              className='text-blue-400 hover:text-blue-300 hover:underline transition-colors'
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
