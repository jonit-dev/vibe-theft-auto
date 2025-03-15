import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('authToken');
    // Navigate to login page
    navigate('/');
  };

  const menuItems = [
    { title: 'START GAME', action: () => navigate('/game'), primary: true },
    { title: 'SETTINGS', action: () => navigate('/settings') },
    { title: 'PROFILE', action: () => navigate('/profile') },
    { title: 'LOGOUT', action: handleLogout, danger: true },
  ];

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-neon'>
      <div className='text-center mb-12'>
        <h1 className='text-6xl font-bold text-white text-glow animate-pulse-slow mb-4'>
          Vibe Theft Auto
        </h1>
        <p className='text-gray-400 text-xl'>
          The ultimate virtual heist experience
        </p>
      </div>

      <div className='w-full max-w-md space-y-4'>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`w-full py-4 px-6 rounded-md text-xl font-semibold border-2 transition-all duration-300 transform hover:scale-105 
              ${
                item.primary
                  ? 'border-game-accent bg-game-accent/20 text-game-accent shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.8)]'
                  : item.danger
                  ? 'border-game-danger bg-game-danger/20 text-game-danger shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]'
                  : 'border-game-primary bg-game-primary/20 text-game-primary shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]'
              }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className='absolute bottom-4 text-gray-500 text-sm'>
        © 2025 Vibe Theft Auto. All rights reserved.
      </div>
    </div>
  );
};

export default MainMenu;
