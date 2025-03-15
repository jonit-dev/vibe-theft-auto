import React, { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BasePage } from '../components/BasePage';
import { Button } from '../components/Button';
import { FormActions, FormLabel, FormRow } from '../components/Form';
import { Input } from '../components/Input';
import { Panel } from '../components/Panel';
import { Text } from '../components/Typography';

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
    <BasePage
      backgroundImage='/images/palm-tree-bkg.webp'
      blendMode='soft-light'
      backgroundOpacity={0.05}
      withGrid={true}
      withScanlines={true}
      className='bg-gradient-to-b from-[#0A0C14] to-[#1A0933] overflow-hidden p-6'
      maxWidth='1200px'
    >
      {/* Main content container with flex centering */}
      <div className='flex items-center justify-center min-h-screen w-full'>
        <div className='w-full max-w-2xl p-4 md:p-8 z-10'>
          <Panel
            variant='translucent'
            glowColor='pink'
            bordered
            className='p-8 md:p-12 w-full z-10 rounded-lg mx-auto'
            withScanlines
          >
            {/* Title with neon effect */}
            <div className='relative mb-10 md:mb-12'>
              <h1 className='text-center text-[#FF41A6] text-4xl md:text-5xl font-bold neon-text tracking-wider uppercase px-4'>
                Vibe Theft Auto
              </h1>
              <div className='w-3/4 h-px bg-gradient-to-r from-transparent via-[#FF41A6] to-transparent mx-auto mt-6 opacity-70'></div>
            </div>

            <form onSubmit={handleLogin} className='space-y-8 px-4'>
              <FormRow className='mb-6'>
                <FormLabel
                  htmlFor='username'
                  className='text-[#00A5E5] uppercase tracking-wider text-xs font-bold mb-3 pl-2'
                >
                  Username
                </FormLabel>
                <Input
                  id='username'
                  type='text'
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  placeholder='Enter your username'
                  fullWidth
                  className='py-4 px-6 border-[#FF41A6]/30 focus:border-[#FF41A6] rounded-md'
                />
              </FormRow>

              <FormRow className='mb-4'>
                <FormLabel
                  htmlFor='password'
                  className='text-[#00A5E5] uppercase tracking-wider text-xs font-bold mb-3 pl-2'
                >
                  Password
                </FormLabel>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder='Enter your password'
                  fullWidth
                  className='py-4 px-6 border-[#FF41A6]/30 focus:border-[#FF41A6] rounded-md'
                />
                <div className='flex justify-end mt-3 pr-2'>
                  <Link
                    to='/forgot-password'
                    className='text-xs text-[#00A5E5] hover:text-[#FF41A6] hover:underline transition-colors uppercase tracking-wider'
                  >
                    Forgot Password?
                  </Link>
                </div>
              </FormRow>

              <FormActions className='mt-10 flex-col items-stretch px-2'>
                <Button
                  type='submit'
                  fullWidth
                  size='lg'
                  className='neon-button bg-gradient-to-r from-[#FF41A6] to-[#FF8E42] hover:from-[#FF8E42] hover:to-[#FF41A6] py-5 font-bold tracking-widest uppercase'
                >
                  Login
                </Button>
              </FormActions>
            </form>

            <div className='mt-10 text-center px-5'>
              <div className='px-6 py-4 bg-[#1A1133]/80 rounded-md mb-6 border border-[#9D98B3]/20'>
                <Text size='sm' color='text-[#00E574]' className='font-mono'>
                  Demo account: guest / password
                </Text>
              </div>
              <Text
                size='sm'
                color='text-[#9D98B3]'
                className='uppercase tracking-wide text-xs px-4'
              >
                Don't have an account?{' '}
                <Link
                  to='/register'
                  className='text-[#00A5E5] neon-text-blue hover:text-[#FF41A6] hover:underline transition-colors ml-2'
                >
                  Register
                </Link>
              </Text>
            </div>
          </Panel>
        </div>
      </div>
    </BasePage>
  );
};

export default Login;
