import React from 'react';

interface BasePageProps {
  title?: string;
  children: React.ReactNode;
  backgroundImage?: string;
  blendMode?:
    | 'soft-light'
    | 'overlay'
    | 'screen'
    | 'multiply'
    | 'darken'
    | 'lighten';
  backgroundOpacity?: number;
  withGrid?: boolean;
  withScanlines?: boolean;
  className?: string;
  maxWidth?: string;
}

export const BasePage: React.FC<BasePageProps> = ({
  title,
  children,
  backgroundImage,
  blendMode = 'soft-light',
  backgroundOpacity = 0.1,
  withGrid = false,
  withScanlines = false,
  className = '',
  maxWidth = '1200px',
}) => {
  // Use direct blend mode from Tailwind
  const blendClass = `mix-blend-${blendMode}`;

  return (
    <div
      className={`min-h-screen w-full flex flex-col bg-neon relative ${className}`}
    >
      {/* Background image with blend mode */}
      {backgroundImage && (
        <div className='absolute inset-0 z-[1]'>
          <img
            src={backgroundImage}
            alt=''
            className={`w-full h-full object-cover ${blendClass} blur-[1px]`}
            style={{ opacity: backgroundOpacity }}
          />
        </div>
      )}

      {/* Background elements */}
      <div className='absolute inset-0 overflow-hidden' aria-hidden='true'>
        {/* Background grid */}
        {withGrid && (
          <div className='grid-background opacity-30 w-full h-full'></div>
        )}

        {/* Horizontal scanlines */}
        {withScanlines && <div className='scanlines z-[2]'></div>}

        {/* Gradient overlay to ensure text remains readable */}
        <div className='absolute inset-0 bg-gradient-to-t from-[#0A0C14] via-[#1A0933]/80 to-transparent z-[3]'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 flex flex-col min-h-screen'>
        {/* Header Section */}
        {title && (
          <header className='w-full py-6'>
            <div className='container mx-auto px-4' style={{ maxWidth }}>
              <h1 className='text-4xl font-bold text-white text-glow'>
                {title}
              </h1>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main
          className='flex-grow w-full mx-auto px-4 py-6'
          style={{ maxWidth }}
        >
          {children}
        </main>

        {/* Footer Section */}
        <footer className='w-full py-4'>
          <div
            className='container mx-auto px-4 text-center text-gray-500 text-sm'
            style={{ maxWidth }}
          >
            © 2025 Vibe Theft Auto. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};
