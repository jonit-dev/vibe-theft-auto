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
    <div className='min-h-screen w-full flex items-center justify-center bg-cyberpunk'>
      <div className='cyber-border p-1 w-full max-w-md'>
        <div className='bg-game-dark p-8 rounded-md'>
          {!submitted ? (
            <>
              <h2 className='text-3xl font-bold text-center mb-6 text-white text-glow'>
                Reset Your Password
              </h2>

              {error && (
                <div className='bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6'>
                  {error}
                </div>
              )}

              <p className='text-gray-400 text-center mb-8'>
                Enter your email address below and we'll send you instructions
                to reset your password.
              </p>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label htmlFor='email' className='label-dark'>
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    className='form-control-dark'
                  />
                </div>

                <button type='submit' className='btn-neon w-full py-3'>
                  SEND RESET INSTRUCTIONS
                </button>
              </form>
            </>
          ) : (
            <div className='text-center py-4'>
              <div className='w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8 text-game-secondary'
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
              <h2 className='text-2xl font-bold text-white mb-4 text-glow'>
                Check Your Email
              </h2>
              <p className='text-gray-300 mb-6'>
                We've sent password reset instructions to{' '}
                <strong className='text-game-primary'>{email}</strong>. Please
                check your email and follow the instructions.
              </p>
              <p className='text-gray-400'>
                Didn't receive an email? Check your spam folder or{' '}
                <button
                  onClick={() => setSubmitted(false)}
                  className='text-game-primary hover:underline focus:outline-none'
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
              className='text-game-primary hover:text-game-primary hover:underline transition-colors'
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
