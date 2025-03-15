import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BasePage } from '../components/BasePage';
import { Button } from '../components/Button';
import { FormActions, FormLabel, FormRow } from '../components/Form';
import { Input } from '../components/Input';
import { Panel } from '../components/Panel';
import { Text } from '../components/Typography';

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
    <BasePage
      backgroundImage='/images/palm-tree-bkg.webp'
      blendMode='soft-light'
      backgroundOpacity={0.05}
      withGrid={true}
      withScanlines={true}
      className='bg-ocean-drive overflow-hidden p-6'
      maxWidth='1200px'
    >
      {/* Main content container with flex centering */}
      <div className='flex items-center justify-center min-h-screen w-full'>
        <div className='w-full max-w-2xl p-4 md:p-8 z-10'>
          <Panel
            variant='translucent'
            glowColor='pink'
            bordered
            className='p-8 md:p-12 w-full z-10 rounded-lg mx-auto shadow-neon-pink'
            withScanlines
          >
            {/* Title with neon effect */}
            <div className='relative mb-10 md:mb-12'>
              <h1 className='text-center text-neon-pink text-4xl md:text-5xl font-bold neon-text tracking-wider uppercase px-4'>
                Reset Password
              </h1>
              <div className='w-4/5 h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent mx-auto mt-6 opacity-70'></div>
            </div>

            {!submitted ? (
              <>
                {error && (
                  <div className='bg-[#FF3062]/20 border border-[#FF3062] text-[#FF3062] px-4 py-3 rounded-lg mb-6 mx-6'>
                    {error}
                  </div>
                )}

                <Text className='text-text-subdued text-center mb-8 px-6'>
                  Enter your email address below and we'll send you instructions
                  to reset your password.
                </Text>

                <form
                  onSubmit={handleSubmit}
                  className='space-y-6 px-6 md:px-8'
                >
                  <FormRow className='mb-5'>
                    <FormLabel
                      htmlFor='email'
                      className='text-vice-blue uppercase tracking-wider text-sm font-bold mb-3 pl-2'
                    >
                      Email
                    </FormLabel>
                    <Input
                      id='email'
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='Enter your email address'
                      fullWidth
                      className='py-4 px-6 border-neon-pink/30 focus:border-neon-pink rounded-md'
                    />
                  </FormRow>

                  <FormActions className='mt-10 flex-col items-stretch px-2'>
                    <Button
                      type='submit'
                      fullWidth
                      size='lg'
                      variant='primary'
                      className='py-5 font-bold tracking-widest uppercase'
                    >
                      Send Reset Instructions
                    </Button>
                  </FormActions>
                </form>
              </>
            ) : (
              <div className='text-center py-4 px-6'>
                <div className='w-16 h-16 bg-palm-green/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-palm-green/30'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-8 w-8 text-palm-green'
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
                <h2 className='text-2xl font-bold text-vice-blue mb-4 font-vcr tracking-wide'>
                  Check Your Email
                </h2>
                <Text className='text-text-subdued mb-6'>
                  We've sent password reset instructions to{' '}
                  <strong className='text-vice-blue'>{email}</strong>. Please
                  check your email and follow the instructions.
                </Text>
                <Text className='text-text-subdued'>
                  Didn't receive an email? Check your spam folder or{' '}
                  <button
                    onClick={() => setSubmitted(false)}
                    className='text-vice-blue hover:text-neon-pink hover:underline focus:outline-none transition-colors'
                  >
                    try again
                  </button>
                  .
                </Text>
              </div>
            )}

            <div className='mt-10 text-center px-5'>
              <Text
                size='sm'
                color='text-text-subdued'
                className='uppercase tracking-wide text-xs px-4'
              >
                <Link
                  to='/'
                  className='text-vice-blue neon-text-blue hover:text-neon-pink hover:underline transition-colors'
                >
                  Back to Login
                </Link>
              </Text>
            </div>
          </Panel>
        </div>
      </div>
    </BasePage>
  );
};

export default ForgotPassword;
