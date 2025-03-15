import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    console.log('Login attempt with:', username, password);

    // For demo purposes, just navigate to the main menu
    navigate('/menu');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '40px',
          borderRadius: '10px',
          width: '300px',
          color: 'white',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Vibe Theft Auto
        </h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Username
            </label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              }}
            />
          </div>

          <button
            type='submit'
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '5px',
              border: 'none',
              background: '#e74c3c',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#c0392b')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#e74c3c')}
          >
            Login
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          Demo account: guest / password
        </p>
      </div>
    </div>
  );
};

export default Login;
