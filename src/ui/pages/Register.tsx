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
        <div className='w-full max-w-4xl p-3 md:p-6 z-10'>
          <Panel
            variant='translucent'
            glowColor='pink'
            bordered
            className='p-6 md:p-8 w-full z-10 rounded-lg mx-auto shadow-neon-pink'
            withScanlines
          >
            {/* Title with neon effect */}
            <div className='relative mb-6 md:mb-8'>
              <h1 className='text-center text-neon-pink text-2xl md:text-3xl font-bold neon-text tracking-wider uppercase px-3'>
                Create Account
              </h1>
              <div className='w-4/5 h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent mx-auto mt-3 opacity-70'></div>
            </div>

            {error && (
              <div className='bg-[#FF3062]/20 border border-[#FF3062] text-[#FF3062] px-2 py-1 rounded-lg mb-3 mx-3 text-xs'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-3 px-3 md:px-4'>
              <FormRow className='mb-3'>
                <FormLabel
                  htmlFor='username'
                  className='text-vice-blue uppercase tracking-wider text-xs font-bold mb-1 pl-1'
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
                  className='py-2 px-3 text-sm border-neon-pink/30 focus:border-neon-pink rounded-md'
                />
              </FormRow>

              <FormRow className='mb-3'>
                <FormLabel
                  htmlFor='email'
                  className='text-vice-blue uppercase tracking-wider text-xs font-bold mb-1 pl-1'
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
                  className='py-2 px-3 text-sm border-neon-pink/30 focus:border-neon-pink rounded-md'
                />
              </FormRow>

              <FormRow className='mb-3'>
                <FormLabel
                  htmlFor='password'
                  className='text-vice-blue uppercase tracking-wider text-xs font-bold mb-1 pl-1'
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
                  className='py-2 px-3 text-sm border-neon-pink/30 focus:border-neon-pink rounded-md'
                />
              </FormRow>

              <FormRow className='mb-3'>
                <FormLabel
                  htmlFor='confirmPassword'
                  className='text-vice-blue uppercase tracking-wider text-xs font-bold mb-1 pl-1'
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
                  className='py-2 px-3 text-sm border-neon-pink/30 focus:border-neon-pink rounded-md'
                />
              </FormRow>

              <FormActions className='mt-4 flex-col items-stretch px-1'>
                <Button
                  type='submit'
                  fullWidth
                  size='sm'
                  variant='primary'
                  className='py-2 font-bold tracking-wider uppercase text-sm'
                >
                  Register
                </Button>
              </FormActions>
            </form>

            <div className='mt-4 text-center px-3'>
              <Text
                size='sm'
                color='text-text-subdued'
                className='uppercase tracking-wide text-[10px] px-2'
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
