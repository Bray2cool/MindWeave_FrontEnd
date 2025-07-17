import React from 'react';
import { Bell, Moon, Globe, Shield, Palette, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const settingsSections = [
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
        { name: 'Theme Color', description: 'Choose your accent color', type: 'select', value: 'Purple' },
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
        { name: 'Private Mode', description: 'Hide journal content in previews', type: 'toggle', value: false },
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

  const bgClass = isDarkMode 
    ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900' 
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
  
  const cardClass = isDarkMode 
    ? 'bg-white/10 backdrop-blur-sm border-white/10' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';
  
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  return (
    <div className={`p-8 min-h-screen ${bgClass}`}>
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
                    <div key={settingIndex} className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
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
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                            {setting.value}
                          </button>
                        )}
                      </div>
                    </div>
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