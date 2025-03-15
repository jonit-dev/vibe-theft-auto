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
        app.stop();
      }
    };
  }, []);

  // Handle back to menu button
  const handleBackToMenu = () => {
    // Add any cleanup needed before navigating away
    if (app) {
      app.stop();
    }
    navigate('/menu');
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-black flex flex-col items-center justify-center'>
        <div className='w-16 h-16 mb-8 relative'>
          <div className='absolute inset-0 border-4 border-game-primary/30 rounded-full'></div>
          <div className='absolute inset-0 border-4 border-t-game-primary rounded-full animate-spin'></div>
        </div>
        <h2 className='text-2xl font-title text-white mb-4 text-glow'>
          LOADING GAME ENGINE
        </h2>
        <div className='w-64 h-2 bg-gray-800 rounded-full overflow-hidden'>
          <div className='h-full bg-game-primary animate-pulse-slow'></div>
        </div>
        <p className='text-gray-500 mt-6 text-sm'>
          Preparing virtual heist environment...
        </p>
      </div>
    );
  }

  return (
    <div className='w-full h-full relative'>
      {/* Game canvas will be automatically added to the DOM by Three.js */}

      {/* Menu button */}
      <button
        onClick={handleBackToMenu}
        className='absolute top-4 right-4 z-50 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white px-4 py-2 rounded border border-game-primary/50 transition-all hover:border-game-primary group'
      >
        <span className='relative'>
          Back to Menu
          <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-game-primary transition-all duration-300 group-hover:w-full'></span>
        </span>
      </button>
    </div>
  );
};

export default GameContainer;
