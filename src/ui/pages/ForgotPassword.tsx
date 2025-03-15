import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email) {
      setError('Email is required');
      return;
    }

    // Simulate API call to request password reset
    // In a real app, this would call an API endpoint
    setTimeout(() => {
      console.log(`Password reset requested for: ${email}`);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-red-800'>
      <div className='bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/20'>
        {!submitted ? (
          <>
            <h2 className='text-3xl font-bold text-center mb-6 text-white'>
              Reset Your Password
            </h2>

            {error && (
              <div className='bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6'>
                {error}
              </div>
            )}

            <p className='text-gray-300 text-center mb-8'>
              Enter your email address below and we'll send you instructions to
              reset your password.
            </p>

            <form onSubmit={handleSubmit} className='space-y-6'>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <button
                type='submit'
                className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105'
              >
                SEND RESET INSTRUCTIONS
              </button>
            </form>
          </>
        ) : (
          <div className='text-center py-4'>
            <div className='w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-green-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-white mb-4'>
              Check Your Email
            </h2>
            <p className='text-gray-300 mb-6'>
              We've sent password reset instructions to{' '}
              <strong className='text-blue-400'>{email}</strong>. Please check
              your email and follow the instructions.
            </p>
            <p className='text-gray-400'>
              Didn't receive an email? Check your spam folder or{' '}
              <button
                onClick={() => setSubmitted(false)}
                className='text-blue-400 hover:underline focus:outline-none'
              >
                try again
              </button>
              .
            </p>
          </div>
        )}

        <div className='mt-8 text-center'>
          <Link
            to='/'
            className='text-blue-400 hover:text-blue-300 hover:underline transition-colors'
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
