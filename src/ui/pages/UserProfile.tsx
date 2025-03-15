import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  username: string;
  email: string;
  avatar: string;
  joinDate: string;
  gamesPlayed: number;
  highScore: number;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    username: '',
    email: '',
    avatar: '',
    joinDate: '',
    gamesPlayed: 0,
    highScore: 0,
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    // Simulate API call to get user data
    setTimeout(() => {
      // Mock user data
      const mockUserData: UserData = {
        username: 'Player1',
        email: 'player1@example.com',
        avatar: 'https://via.placeholder.com/150',
        joinDate: '2023-01-15',
        gamesPlayed: 42,
        highScore: 9850,
      };

      setUserData(mockUserData);
      setFormData({
        username: mockUserData.username,
        email: mockUserData.email,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate API call to update profile
    setIsLoading(true);

    setTimeout(() => {
      setUserData({
        ...userData,
        username: formData.username,
        email: formData.email,
      });

      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className='profile-container'>
        <div className='loading'>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className='profile-container'>
      <div className='profile-header'>
        <h1>User Profile</h1>
        <button className='back-button' onClick={() => navigate('/menu')}>
          Back to Menu
        </button>
      </div>

      <div className='profile-content'>
        <div className='profile-sidebar'>
          <div className='avatar-container'>
            <img src={userData.avatar} alt='User Avatar' className='avatar' />
            <button className='change-avatar-button'>Change Avatar</button>
          </div>

          <div className='stats-container'>
            <h3>Stats</h3>
            <div className='stat-item'>
              <span className='stat-label'>Joined:</span>
              <span className='stat-value'>
                {new Date(userData.joinDate).toLocaleDateString()}
              </span>
            </div>
            <div className='stat-item'>
              <span className='stat-label'>Games Played:</span>
              <span className='stat-value'>{userData.gamesPlayed}</span>
            </div>
            <div className='stat-item'>
              <span className='stat-label'>High Score:</span>
              <span className='stat-value'>{userData.highScore}</span>
            </div>
          </div>
        </div>

        <div className='profile-main'>
          {isEditing ? (
            <form onSubmit={handleSubmit} className='edit-form'>
              <h2>Edit Profile</h2>

              <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <input
                  type='text'
                  id='username'
                  name='username'
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className='form-actions'>
                <button
                  type='button'
                  className='cancel-button'
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type='submit' className='save-button'>
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className='profile-details'>
              <div className='profile-info-header'>
                <h2>Profile Information</h2>
                <button
                  className='edit-button'
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>

              <div className='info-group'>
                <span className='info-label'>Username:</span>
                <span className='info-value'>{userData.username}</span>
              </div>

              <div className='info-group'>
                <span className='info-label'>Email:</span>
                <span className='info-value'>{userData.email}</span>
              </div>

              <div className='profile-actions'>
                <button
                  className='action-button'
                  onClick={() => navigate('/settings')}
                >
                  Game Settings
                </button>
                <button
                  className='action-button danger'
                  onClick={() => console.log('Logout clicked')}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          .profile-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #f5f8fa;
            min-height: 100vh;
            color: #2c3e50;
          }
          
          .profile-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .profile-header h1 {
            margin: 0;
            color: #2c3e50;
          }
          
          .back-button {
            padding: 8px 16px;
            background-color: #7f8c8d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .profile-content {
            display: flex;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            overflow: hidden;
          }
          
          .profile-sidebar {
            width: 30%;
            background-color: #34495e;
            color: white;
            padding: 30px;
          }
          
          .avatar-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .avatar {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #3498db;
            margin-bottom: 15px;
          }
          
          .change-avatar-button {
            padding: 8px 16px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .stats-container {
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .stats-container h3 {
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
          }
          
          .stat-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
          }
          
          .profile-main {
            flex-grow: 1;
            padding: 30px;
          }
          
          .profile-info-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .profile-info-header h2 {
            margin: 0;
          }
          
          .edit-button {
            padding: 8px 16px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .info-group {
            margin-bottom: 20px;
          }
          
          .info-label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
            color: #7f8c8d;
          }
          
          .info-value {
            font-size: 18px;
          }
          
          .profile-actions {
            margin-top: 40px;
            display: flex;
            justify-content: flex-start;
            gap: 15px;
          }
          
          .action-button {
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .action-button.danger {
            background-color: #e74c3c;
          }
          
          .edit-form h2 {
            margin-top: 0;
            margin-bottom: 20px;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
          }
          
          .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
          }
          
          .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 15px;
            margin-top: 30px;
          }
          
          .cancel-button {
            padding: 10px 20px;
            background-color: #95a5a6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .save-button {
            padding: 10px 20px;
            background-color: #2ecc71;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
            font-size: 18px;
            color: #7f8c8d;
          }
        `}
      </style>
    </div>
  );
};

export default UserProfile;
