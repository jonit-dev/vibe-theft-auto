import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  FormActions,
  FormLabel,
  FormRow,
  Input,
  Panel,
  Text,
} from '../components';

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
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0A0C14] to-[#1A0933] overflow-hidden'>
      {/* Palm tree background image */}
      <div className='absolute inset-0 z-[1]'>
        <img
          src='/images/palm-tree-bkg.webp'
          alt=''
          className='w-full h-full object-cover opacity-10 mix-blend-soft-light blur-[1px]'
        />
      </div>
      {/* Background elements */}
      <div className='absolute inset-0 overflow-hidden' aria-hidden='true'>
        {/* Background grid */}
        <div className='grid-background opacity-30 w-full h-full'></div>

        {/* Horizontal scanlines */}
        <div className='scanlines z-[2]'></div>

        {/* Gradient overlay to ensure text remains readable */}
        <div className='absolute inset-0 bg-gradient-to-t from-[#0A0C14] via-[#1A0933]/80 to-transparent z-[3]'></div>
      </div>

      {/* Main content */}
      <Panel
        variant='translucent'
        glowColor='pink'
        bordered
        className='p-10 w-full max-w-md z-10 rounded-lg'
        withScanlines
      >
        {/* Title with neon effect */}
        <div className='relative mb-10'>
          <h1 className='text-center text-[#FF41A6] text-5xl font-bold neon-text tracking-wider uppercase'>
            Vibe Theft Auto
          </h1>
          <div className='w-1/2 h-px bg-gradient-to-r from-transparent via-[#FF41A6] to-transparent mx-auto mt-4 opacity-70'></div>
        </div>

        <Form onSubmit={handleLogin}>
          <FormRow className='mb-6'>
            <FormLabel
              htmlFor='username'
              className='text-[#00A5E5] uppercase tracking-wider text-xs font-bold mb-2'
            >
              Username
            </FormLabel>
            <Input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter your username'
              fullWidth
              className='py-3 border-[#FF41A6]/30 focus:border-[#FF41A6]'
            />
          </FormRow>

          <FormRow className='mb-6'>
            <FormLabel
              htmlFor='password'
              className='text-[#00A5E5] uppercase tracking-wider text-xs font-bold mb-2'
            >
              Password
            </FormLabel>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              fullWidth
              className='py-3 border-[#FF41A6]/30 focus:border-[#FF41A6]'
            />
            <div className='flex justify-end mt-2'>
              <Link
                to='/forgot-password'
                className='text-xs text-[#00A5E5] hover:text-[#FF41A6] hover:underline transition-colors uppercase tracking-wider'
              >
                Forgot Password?
              </Link>
            </div>
          </FormRow>

          <FormActions className='mt-8 flex-col items-stretch'>
            <Button
              type='submit'
              fullWidth
              size='lg'
              className='neon-button bg-gradient-to-r from-[#FF41A6] to-[#FF8E42] hover:from-[#FF8E42] hover:to-[#FF41A6] py-4 font-bold tracking-widest uppercase'
            >
              Login
            </Button>
          </FormActions>
        </Form>

        <div className='mt-10 text-center'>
          <div className='px-5 py-3 bg-[#1A1133]/80 rounded-md mb-5 border border-[#9D98B3]/20'>
            <Text size='sm' color='text-[#00E574]' className='font-mono'>
              Demo account: guest / password
            </Text>
          </div>
          <Text
            size='sm'
            color='text-[#9D98B3]'
            className='uppercase tracking-wide text-xs'
          >
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-[#00A5E5] neon-text-blue hover:text-[#FF41A6] hover:underline transition-colors'
            >
              Register
            </Link>
          </Text>
        </div>
      </Panel>
    </div>
  );
};

export default Login;
