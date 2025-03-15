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
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-game-dark'>
      <div className='container mx-auto max-w-4xl px-4 py-10'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold text-white text-glow'>Settings</h1>
          <button
            onClick={() => navigate('/menu')}
            className='px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 transition-colors'
          >
            Back to Menu
          </button>
        </div>

        <div className='cyber-border p-1 w-full mb-8'>
          <div className='bg-game-dark rounded flex'>
            <button
              className={`px-6 py-4 text-lg font-medium transition-colors ${
                activeTab === 'game'
                  ? 'text-game-primary border-b-2 border-game-primary'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('game')}
            >
              Game Settings
            </button>
            <button
              className={`px-6 py-4 text-lg font-medium transition-colors ${
                activeTab === 'account'
                  ? 'text-game-primary border-b-2 border-game-primary'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('account')}
            >
              Account Settings
            </button>
          </div>
        </div>

        <div className='card-dark p-8 mb-8'>
          {activeTab === 'game' ? (
            <div className='space-y-8'>
              <div>
                <label className='block mb-2 text-gray-300'>
                  SFX Volume: {settings.sfxVolume}%
                </label>
                <div className='h-2 bg-gray-700 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-game-primary rounded-full'
                    style={{ width: `${settings.sfxVolume}%` }}
                  ></div>
                </div>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={settings.sfxVolume}
                  onChange={(e) =>
                    handleChange('sfxVolume', parseInt(e.target.value))
                  }
                  className='w-full mt-2'
                />
              </div>

              <div>
                <label className='block mb-2 text-gray-300'>
                  Music Volume: {settings.musicVolume}%
                </label>
                <div className='h-2 bg-gray-700 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-game-accent rounded-full'
                    style={{ width: `${settings.musicVolume}%` }}
                  ></div>
                </div>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={settings.musicVolume}
                  onChange={(e) =>
                    handleChange('musicVolume', parseInt(e.target.value))
                  }
                  className='w-full mt-2'
                />
              </div>

              <div>
                <label className='block mb-2 text-gray-300'>
                  Graphics Quality:
                </label>
                <select
                  value={settings.graphicsQuality}
                  onChange={(e) =>
                    handleChange('graphicsQuality', e.target.value)
                  }
                  className='form-control-dark w-full'
                >
                  <option value='low'>Low</option>
                  <option value='medium'>Medium</option>
                  <option value='high'>High</option>
                  <option value='ultra'>Ultra</option>
                </select>
              </div>

              <div className='flex items-center space-x-3'>
                <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                  <input
                    type='checkbox'
                    id='shadows'
                    checked={settings.shadows}
                    onChange={(e) => handleChange('shadows', e.target.checked)}
                    className='peer absolute block w-6 h-6 rounded-full bg-gray-600 appearance-none cursor-pointer border-4 border-game-dark checked:border-4 checked:border-game-dark checked:bg-game-secondary transition-all duration-200 checked:right-0'
                  />
                  <label
                    htmlFor='shadows'
                    className='block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer transition-all duration-200 peer-checked:bg-game-secondary/30'
                  ></label>
                </div>
                <label
                  htmlFor='shadows'
                  className='text-gray-300 cursor-pointer'
                >
                  Enable Shadows
                </label>
              </div>

              <div className='flex items-center space-x-3'>
                <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                  <input
                    type='checkbox'
                    id='antialiasing'
                    checked={settings.antialiasing}
                    onChange={(e) =>
                      handleChange('antialiasing', e.target.checked)
                    }
                    className='peer absolute block w-6 h-6 rounded-full bg-gray-600 appearance-none cursor-pointer border-4 border-game-dark checked:border-4 checked:border-game-dark checked:bg-game-secondary transition-all duration-200 checked:right-0'
                  />
                  <label
                    htmlFor='antialiasing'
                    className='block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer transition-all duration-200 peer-checked:bg-game-secondary/30'
                  ></label>
                </div>
                <label
                  htmlFor='antialiasing'
                  className='text-gray-300 cursor-pointer'
                >
                  Enable Anti-aliasing
                </label>
              </div>
            </div>
          ) : (
            <div className='space-y-6'>
              <div className='flex items-center space-x-3'>
                <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                  <input
                    type='checkbox'
                    id='emailNotifications'
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      handleChange('emailNotifications', e.target.checked)
                    }
                    className='peer absolute block w-6 h-6 rounded-full bg-gray-600 appearance-none cursor-pointer border-4 border-game-dark checked:border-4 checked:border-game-dark checked:bg-game-secondary transition-all duration-200 checked:right-0'
                  />
                  <label
                    htmlFor='emailNotifications'
                    className='block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer transition-all duration-200 peer-checked:bg-game-secondary/30'
                  ></label>
                </div>
                <label
                  htmlFor='emailNotifications'
                  className='text-gray-300 cursor-pointer'
                >
                  Email Notifications
                </label>
              </div>

              <div className='flex items-center space-x-3'>
                <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                  <input
                    type='checkbox'
                    id='twoFactorAuth'
                    checked={settings.twoFactorAuth}
                    onChange={(e) =>
                      handleChange('twoFactorAuth', e.target.checked)
                    }
                    className='peer absolute block w-6 h-6 rounded-full bg-gray-600 appearance-none cursor-pointer border-4 border-game-dark checked:border-4 checked:border-game-dark checked:bg-game-secondary transition-all duration-200 checked:right-0'
                  />
                  <label
                    htmlFor='twoFactorAuth'
                    className='block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer transition-all duration-200 peer-checked:bg-game-secondary/30'
                  ></label>
                </div>
                <label
                  htmlFor='twoFactorAuth'
                  className='text-gray-300 cursor-pointer'
                >
                  Two-Factor Authentication
                </label>
              </div>

              <div className='pt-4'>
                <button className='w-full p-3 bg-game-primary bg-opacity-20 border border-game-primary text-game-primary hover:bg-opacity-30 transition-colors rounded-md mb-4'>
                  Change Password
                </button>
              </div>

              <div>
                <button className='w-full p-3 bg-game-danger bg-opacity-20 border border-game-danger text-game-danger hover:bg-opacity-30 transition-colors rounded-md'>
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='flex justify-end'>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`btn-primary px-6 py-3 ${
              saveStatus === 'saving' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saveStatus === 'idle' && 'Save Settings'}
            {saveStatus === 'saving' && (
              <span className='flex items-center'>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Saving...
              </span>
            )}
            {saveStatus === 'saved' && 'Saved!'}
            {saveStatus === 'error' && 'Error Saving'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
