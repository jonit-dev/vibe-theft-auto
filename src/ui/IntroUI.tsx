import React, { useState } from 'react';

interface IntroUIProps {
  onSceneSelect: (sceneName: string) => void;
}

export const IntroUI: React.FC<IntroUIProps> = ({ onSceneSelect }) => {
  const [hoverButton, setHoverButton] = useState<string | null>(null);

  const buttonStyle = (sceneName: string): React.CSSProperties => ({
    backgroundColor: hoverButton === sceneName ? '#3498db' : '#2c3e50',
    color: '#ecf0f1',
    border: '4px solid #3498db',
    borderRadius: '8px',
    padding: '20px',
    margin: '15px',
    width: '300px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '50px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        }}
      >
        ThreeJS Game Engine
      </div>

      <button
        style={buttonStyle('eventDemo')}
        onClick={() => onSceneSelect('eventDemo')}
        onMouseEnter={() => setHoverButton('eventDemo')}
        onMouseLeave={() => setHoverButton(null)}
      >
        Event System Demo
      </button>

      <button
        style={buttonStyle('main')}
        onClick={() => onSceneSelect('main')}
        onMouseEnter={() => setHoverButton('main')}
        onMouseLeave={() => setHoverButton(null)}
      >
        Main Scene Demo
      </button>

      <button
        style={buttonStyle('resource-demo')}
        onClick={() => onSceneSelect('resource-demo')}
        onMouseEnter={() => setHoverButton('resource-demo')}
        onMouseLeave={() => setHoverButton(null)}
      >
        Resource Management Demo
      </button>
    </div>
  );
};
