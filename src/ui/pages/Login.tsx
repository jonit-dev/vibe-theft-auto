import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  FormActions,
  FormLabel,
  FormRow,
  Heading,
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
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0A0C14] to-[#1A0933]'>
      <div className='absolute inset-0 overflow-hidden' aria-hidden='true'>
        <div className='grid-background opacity-30 w-full h-full'></div>
      </div>

      <Panel
        variant='translucent'
        glowColor='pink'
        bordered
        className='p-8 w-full max-w-md z-10'
        withScanlines
      >
        <Heading level={1} color='text-[#FF41A6]' className='text-center mb-8'>
          Vibe Theft Auto
        </Heading>

        <Form onSubmit={handleLogin}>
          <FormRow>
            <FormLabel htmlFor='username'>Username</FormLabel>
            <Input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter your username'
              fullWidth
            />
          </FormRow>

          <FormRow>
            <FormLabel htmlFor='password'>Password</FormLabel>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              fullWidth
            />
            <div className='flex justify-end'>
              <Link
                to='/forgot-password'
                className='text-sm text-[#00A5E5] hover:text-[#FF41A6] hover:underline transition-colors'
              >
                Forgot Password?
              </Link>
            </div>
          </FormRow>

          <FormActions className='mt-8 flex-col items-stretch'>
            <Button type='submit' fullWidth size='lg'>
              LOGIN
            </Button>
          </FormActions>
        </Form>

        <div className='mt-8 text-center'>
          <Text size='sm' color='text-[#9D98B3]' className='mb-4'>
            Demo account: guest / password
          </Text>
          <Text size='sm' color='text-[#9D98B3]'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-[#00A5E5] hover:text-[#FF41A6] hover:underline transition-colors'
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
