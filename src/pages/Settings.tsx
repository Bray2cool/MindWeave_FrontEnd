import React from 'react';
import { Bell, Shield, Palette, Download, User, Save } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode, themeColor, setThemeColor, getThemeColors, isPrivacyMode, togglePrivacyMode } = useTheme();
  const { getUserDisplayName, updateUsername } = useAuth();
  const colors = getThemeColors();
  const [newUsername, setNewUsername] = React.useState(getUserDisplayName());
  const [isUpdatingUsername, setIsUpdatingUsername] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = React.useState(false);

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim() || newUsername.trim().length < 2) {
      setUsernameError('Username must be at least 2 characters long');
      return;
    }

    if (newUsername.trim().length > 30) {
      setUsernameError('Username must be less than 30 characters');
      return;
    }

    setIsUpdatingUsername(true);
    setUsernameError(null);
    setUsernameSuccess(false);

    try {
      const { error } = await updateUsername(newUsername.trim());
      
      if (error) {
        setUsernameError(error.message || 'Failed to update username');
      } else {
        setUsernameSuccess(true);
        setTimeout(() => setUsernameSuccess(false), 3000);
      }
    } catch (err) {
      setUsernameError('An unexpected error occurred');
    } finally {
      setIsUpdatingUsername(false);
    }
  };
  const themeOptions = [
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'sage', name: 'Sage Green', color: 'bg-emerald-500' },
    { id: 'ocean', name: 'Ocean Blue', color: 'bg-cyan-500' },
    { id: 'sunset', name: 'Warm Sunset', color: 'bg-rose-500' },
    { id: 'lavender', name: 'Lavender', color: 'bg-violet-500' },
    { id: 'forest', name: 'Forest', color: 'bg-lime-500' },
    { id: 'midnight', name: 'Midnight', color: 'bg-slate-500' }
  ];

  const settingsSections = [
    {
      title: 'Profile',
      icon: User,
      settings: [
        { 
          name: 'Username', 
          description: 'Your display name shown in the app', 
          type: 'username-input',
          value: newUsername,
          action: setNewUsername
        },
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        { 
          name: 'Dark Mode', 
          description: 'Enable dark theme', 
          type: 'toggle', 
          value: isDarkMode,
          action: toggleDarkMode
        },
        { 
          name: 'Theme Color', 
          description: 'Choose your accent color', 
          type: 'color-select', 
          value: themeColor,
          action: setThemeColor
        },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { name: 'Daily Reminders', description: 'Get reminded to journal daily', type: 'toggle', value: true },
        { name: 'Reminder Time', description: 'When to send daily reminders', type: 'time', value: '8:00 PM' },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      settings: [
        { 
          name: 'Private Mode', 
          description: 'Hide journal content in previews', 
          type: 'toggle', 
          value: isPrivacyMode,
          action: togglePrivacyMode
        },
        { name: 'Auto-lock', description: 'Lock app after inactivity', type: 'select', value: 'Never' },
      ]
    },
    {
      title: 'Data & Storage',
      icon: Download,
      settings: [
        { name: 'Auto Backup', description: 'Automatically backup your entries', type: 'toggle', value: true },
        { name: 'Export Data', description: 'Download all your journal entries', type: 'button', value: 'Export' },
      ]
    }
  ];

  const bgClass = `bg-gradient-to-br ${isDarkMode ? colors.darkBg : colors.lightBg}`;
  
  const cardClass = isDarkMode 
    ? 'bg-white/10 backdrop-blur-sm border-white/10'
    : `${colors.lightCard} backdrop-blur-sm ${colors.lightBorder}`;
  
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className={`${textSecondaryClass} text-lg`}>Customize your MindWeave experience.</p>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <div key={sectionIndex} className={`${cardClass} rounded-2xl p-6 border`}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-xl font-bold ${textClass}`}>{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <React.Fragment key={settingIndex}>
                      <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
                      <div>
                        <h3 className={`${textClass} font-medium`}>{setting.name}</h3>
                        <p className={`${textSecondaryClass} text-sm`}>{setting.description}</p>
                      </div>
                      <div>
                        {setting.type === 'toggle' && (
                          <button 
                            onClick={setting.action}
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                              setting.value ? 'bg-purple-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${
                              setting.value ? 'translate-x-6' : 'translate-x-0.5'
                            }`}></div>
                          </button>
                        )}
                        {setting.type === 'color-select' && (
                          <div className="flex items-center space-x-2">
                            {themeOptions.map((option) => (
                              <button
                                key={option.id}
                                onClick={() => setting.action(option.id)}
                                className={`w-8 h-8 rounded-full ${option.color} transition-all duration-300 ${
                                  setting.value === option.id 
                                    ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' 
                                    : 'hover:scale-105'
                                }`}
                                title={option.name}
                                aria-label={`Select ${option.name} theme`}
                              />
                            ))}
                          </div>
                        )}
                        {setting.type === 'select' && (
                          <select className={`${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border rounded-lg px-3 py-2`}>
                            <option>{setting.value}</option>
                          </select>
                        )}
                        {setting.type === 'time' && (
                          <input 
                            type="time" 
                            defaultValue="20:00"
                            className={`${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border rounded-lg px-3 py-2`}
                          />
                        )}
                        {setting.type === 'button' && (
                          <button className={`${colors.bg} hover:${colors.bg.replace('600', '700')} text-white px-4 py-2 rounded-lg transition-colors`}>
                            {setting.value}
                          </button>
                        )}
                        {setting.type === 'username-input' && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}
                              className={`${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border rounded-lg px-3 py-2 min-w-0 flex-1`}
                              placeholder="Enter username"
                              minLength={2}
                              maxLength={30}
                            />
                            <button
                              onClick={handleUsernameUpdate}
                              disabled={isUpdatingUsername || newUsername === getUserDisplayName()}
                              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                                usernameSuccess 
                                  ? 'bg-green-500 text-white' 
                                  : `${colors.bg} hover:${colors.bg.replace('600', '700')} text-white disabled:opacity-50 disabled:cursor-not-allowed`
                              }`}
                            >
                              {isUpdatingUsername ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : usernameSuccess ? (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-sm">Saved</span>
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4" />
                                  <span className="text-sm">Save</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      </div>
                    {setting.type === 'username-input' && (usernameError || usernameSuccess) &&
                      <div className={`mt-2 text-sm ${usernameError ? 'text-red-400' : 'text-green-400'}`}>
                        {usernameError || (usernameSuccess ? 'Username updated successfully!' : '')}
                      </div>
                    }
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Settings;