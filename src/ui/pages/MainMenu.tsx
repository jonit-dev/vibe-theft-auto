import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BasePage } from '../components/BasePage';
import { Button } from '../components/Button';
import { Panel } from '../components/Panel';
import { Text } from '../components/Typography';

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
            <div className='relative mb-12 md:mb-14'>
              <h1 className='text-center text-neon-pink text-5xl md:text-6xl font-bold neon-text tracking-wider uppercase px-4'>
                Vibe Theft Auto
              </h1>
              <div className='w-4/5 h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent mx-auto mt-8 opacity-70'></div>
              <Text className='text-center text-text-subdued mt-4'>
                The ultimate virtual heist experience
              </Text>
            </div>

            <div className='w-full space-y-6 px-6 md:px-8'>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={item.action}
                  fullWidth
                  size='lg'
                  variant={
                    item.primary
                      ? 'gradient'
                      : item.danger
                      ? 'primary'
                      : 'secondary'
                  }
                  className='py-5 text-xl'
                >
                  {item.title}
                </Button>
              ))}
            </div>

            <div className='mt-14 text-center'>
              <Text
                size='xs'
                color='text-text-subdued'
                className='uppercase tracking-wide'
              >
                © 2025 Vibe Theft Auto. All rights reserved.
              </Text>
            </div>
          </Panel>
        </div>
      </div>
    </BasePage>
  );
};

export default MainMenu;
