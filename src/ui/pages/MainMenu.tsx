import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  const menuItemStyle = {
    padding: '15px 30px',
    margin: '10px 0',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    border: '2px solid #3498db',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '300px',
    textAlign: 'center' as const,
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = 'rgba(52, 152, 219, 0.3)';
    e.currentTarget.style.transform = 'scale(1.05)';
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    e.currentTarget.style.transform = 'scale(1)';
  };

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('authToken');
    // Navigate to login page
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: 'linear-gradient(135deg, #16222A, #3A6073)',
        color: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            marginBottom: '50px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          Vibe Theft Auto
        </h1>

        <div
          style={menuItemStyle}
          onClick={() => navigate('/game')}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Start Game
        </div>

        <div
          style={menuItemStyle}
          onClick={() => navigate('/settings')}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Settings
        </div>

        <div
          style={menuItemStyle}
          onClick={() => navigate('/profile')}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          User Profile
        </div>

        <div
          style={menuItemStyle}
          onClick={() => handleLogout()}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
