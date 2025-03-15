import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BasePage } from '../components/BasePage';
import { Button } from '../components/Button';
import { FormActions, FormLabel, FormRow } from '../components/Form';
import { Input } from '../components/Input';
import { Panel } from '../components/Panel';
import { Text } from '../components/Typography';

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
                Create Account
              </h1>
              <div className='w-4/5 h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent mx-auto mt-6 opacity-70'></div>
            </div>

            {error && (
              <div className='bg-[#FF3062]/20 border border-[#FF3062] text-[#FF3062] px-4 py-3 rounded-lg mb-6 mx-6'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6 px-6 md:px-8'>
              <FormRow className='mb-5'>
                <FormLabel
                  htmlFor='username'
                  className='text-vice-blue uppercase tracking-wider text-sm font-bold mb-3 pl-2'
                >
                  Username
                </FormLabel>
                <Input
                  id='username'
                  name='username'
                  type='text'
                  value={formData.username}
                  onChange={handleChange}
                  placeholder='Enter your username'
                  fullWidth
                  className='py-4 px-6 border-neon-pink/30 focus:border-neon-pink rounded-md'
                />
              </FormRow>

              <FormRow className='mb-5'>
                <FormLabel
                  htmlFor='email'
                  className='text-vice-blue uppercase tracking-wider text-sm font-bold mb-3 pl-2'
                >
                  Email
                </FormLabel>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter your email address'
                  fullWidth
                  className='py-4 px-6 border-neon-pink/30 focus:border-neon-pink rounded-md'
                />
              </FormRow>

              <FormRow className='mb-5'>
                <FormLabel
                  htmlFor='password'
                  className='text-vice-blue uppercase tracking-wider text-sm font-bold mb-3 pl-2'
                >
                  Password
                </FormLabel>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                  fullWidth
                  className='py-4 px-6 border-neon-pink/30 focus:border-neon-pink rounded-md'
                />
              </FormRow>

              <FormRow className='mb-5'>
                <FormLabel
                  htmlFor='confirmPassword'
                  className='text-vice-blue uppercase tracking-wider text-sm font-bold mb-3 pl-2'
                >
                  Confirm Password
                </FormLabel>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='Confirm your password'
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
                  Register
                </Button>
              </FormActions>
            </form>

            <div className='mt-10 text-center px-5'>
              <Text
                size='sm'
                color='text-text-subdued'
                className='uppercase tracking-wide text-xs px-4'
              >
                Already have an account?{' '}
                <Link
                  to='/'
                  className='text-vice-blue neon-text-blue hover:text-neon-pink hover:underline transition-colors ml-2'
                >
                  Login
                </Link>
              </Text>
            </div>
          </Panel>
        </div>
      </div>
    </BasePage>
  );
};

export default Register;
