import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { container } from 'tsyringe';
import { Application } from '../../Application';

const GameContainer: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [app, setApp] = useState<Application | null>(null);

  useEffect(() => {
    // Initialize the game engine
    const initGame = async () => {
      try {
        setIsLoading(true);
        console.log('Initializing game engine...');

        // Resolve and start the application
        const gameApp = container.resolve(Application);
        setApp(gameApp);

        // Start the game engine
        gameApp.start();

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize game engine:', error);
        setIsLoading(false);
      }
    };

    initGame();

    // Cleanup function
    return () => {
      if (app) {
        console.log('Cleaning up game engine...');
        // Add cleanup logic here if needed
        // For example: app.stop();
      }
    };
  }, []);

  // Handle back to menu button
  const handleBackToMenu = () => {
    // Add any cleanup needed before navigating away
    navigate('/menu');
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#000',
          color: 'white',
        }}
      >
        <h2>Loading Game Engine...</h2>
        <div
          style={{
            width: '200px',
            height: '5px',
            background: '#333',
            borderRadius: '5px',
            overflow: 'hidden',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              width: '50%',
              height: '100%',
              background: '#3498db',
              animation: 'loading 1.5s infinite',
            }}
          />
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Game canvas will be automatically added to the DOM by Three.js */}

      {/* Menu button */}
      <button
        onClick={handleBackToMenu}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        Back to Menu
      </button>
    </div>
  );
};

export default GameContainer;
