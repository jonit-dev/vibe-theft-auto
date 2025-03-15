import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    // Game settings
    sfxVolume: 80,
    musicVolume: 60,
    graphicsQuality: 'high',
    shadows: true,
    antialiasing: true,

    // Account settings
    emailNotifications: true,
    twoFactorAuth: false,
  });

  const [activeTab, setActiveTab] = useState<'game' | 'account'>('game');
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  const handleChange = (setting: string, value: any) => {
    setSettings({
      ...settings,
      [setting]: value,
    });
  };

  const handleSave = () => {
    setSaveStatus('saving');

    // Simulate API call to save settings
    setTimeout(() => {
      // Save to localStorage for demo purposes
      localStorage.setItem('gameSettings', JSON.stringify(settings));
      setSaveStatus('saved');

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 1000);
  };

  return (
    <div className='settings-container'>
      <div className='settings-header'>
        <h1>Settings</h1>
        <button className='back-button' onClick={() => navigate('/menu')}>
          Back to Menu
        </button>
      </div>

      <div className='settings-tabs'>
        <button
          className={`tab-button ${activeTab === 'game' ? 'active' : ''}`}
          onClick={() => setActiveTab('game')}
        >
          Game Settings
        </button>
        <button
          className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account Settings
        </button>
      </div>

      <div className='settings-content'>
        {activeTab === 'game' ? (
          <div className='game-settings'>
            <div className='setting-group'>
              <label>
                SFX Volume: {settings.sfxVolume}%
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={settings.sfxVolume}
                  onChange={(e) =>
                    handleChange('sfxVolume', parseInt(e.target.value))
                  }
                />
              </label>
            </div>

            <div className='setting-group'>
              <label>
                Music Volume: {settings.musicVolume}%
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={settings.musicVolume}
                  onChange={(e) =>
                    handleChange('musicVolume', parseInt(e.target.value))
                  }
                />
              </label>
            </div>

            <div className='setting-group'>
              <label>Graphics Quality:</label>
              <select
                value={settings.graphicsQuality}
                onChange={(e) =>
                  handleChange('graphicsQuality', e.target.value)
                }
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
                <option value='ultra'>Ultra</option>
              </select>
            </div>

            <div className='setting-group checkbox'>
              <label>
                <input
                  type='checkbox'
                  checked={settings.shadows}
                  onChange={(e) => handleChange('shadows', e.target.checked)}
                />
                Enable Shadows
              </label>
            </div>

            <div className='setting-group checkbox'>
              <label>
                <input
                  type='checkbox'
                  checked={settings.antialiasing}
                  onChange={(e) =>
                    handleChange('antialiasing', e.target.checked)
                  }
                />
                Enable Anti-aliasing
              </label>
            </div>
          </div>
        ) : (
          <div className='account-settings'>
            <div className='setting-group checkbox'>
              <label>
                <input
                  type='checkbox'
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleChange('emailNotifications', e.target.checked)
                  }
                />
                Email Notifications
              </label>
            </div>

            <div className='setting-group checkbox'>
              <label>
                <input
                  type='checkbox'
                  checked={settings.twoFactorAuth}
                  onChange={(e) =>
                    handleChange('twoFactorAuth', e.target.checked)
                  }
                />
                Two-Factor Authentication
              </label>
            </div>

            <div className='setting-group'>
              <button className='change-button'>Change Password</button>
            </div>

            <div className='setting-group'>
              <button className='danger-button'>Delete Account</button>
            </div>
          </div>
        )}
      </div>

      <div className='settings-footer'>
        <button
          className='save-button'
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'idle' && 'Save Settings'}
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'Saved!'}
          {saveStatus === 'error' && 'Error Saving'}
        </button>
      </div>

      <style>
        {`
          .settings-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #f5f8fa;
            min-height: 100vh;
            color: #2c3e50;
          }
          
          .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .settings-header h1 {
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
          
          .settings-tabs {
            display: flex;
            margin-bottom: 30px;
            border-bottom: 2px solid #ddd;
          }
          
          .tab-button {
            padding: 10px 20px;
            background: none;
            border: none;
            font-size: 16px;
            font-weight: 500;
            color: #7f8c8d;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            margin-right: 20px;
          }
          
          .tab-button.active {
            color: #3498db;
            border-bottom: 3px solid #3498db;
          }
          
          .settings-content {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            margin-bottom: 30px;
          }
          
          .setting-group {
            margin-bottom: 20px;
          }
          
          .setting-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
          }
          
          .setting-group input[type="range"] {
            width: 100%;
            margin-top: 10px;
          }
          
          .setting-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          
          .setting-group.checkbox label {
            display: flex;
            align-items: center;
            cursor: pointer;
          }
          
          .setting-group.checkbox input {
            margin-right: 10px;
          }
          
          .change-button {
            width: 100%;
            padding: 10px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .danger-button {
            width: 100%;
            padding: 10px;
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .settings-footer {
            display: flex;
            justify-content: flex-end;
          }
          
          .save-button {
            padding: 10px 30px;
            background-color: #2ecc71;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
          }
          
          .save-button:disabled {
            background-color: #95a5a6;
            cursor: not-allowed;
          }
        `}
      </style>
    </div>
  );
};

export default Settings;
