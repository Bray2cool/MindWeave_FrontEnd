import React from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { JournalEntry } from '../hooks/useJournalEntries';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  selectedDate: Date;
}

const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, entries, selectedDate }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'text-green-500';
      case 'neutral': return 'text-yellow-500';
      case 'sad': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      default: return '😐';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const bgClass = isDarkMode 
    ? 'bg-black/50' 
    : 'bg-black/30';
  
  const modalClass = isDarkMode 
    ? 'bg-gray-900 border-gray-700' 
    : 'bg-white border-gray-200';
  
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`fixed inset-0 ${bgClass} backdrop-blur-sm flex items-center justify-center p-4 z-50`}>
      <div className={`${modalClass} rounded-2xl border max-w-2xl w-full max-h-[80vh] overflow-hidden`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-purple-500" />
            <div>
              <h2 className={`text-xl font-bold ${textClass}`}>Journal Entries</h2>
              <p className={`${textSecondaryClass} text-sm`}>{formatDate(selectedDate)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X className={`w-5 h-5 ${textSecondaryClass}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className={`w-12 h-12 ${textSecondaryClass} mx-auto mb-4`} />
              <p className={`${textSecondaryClass} text-lg`}>No entries for this date</p>
              <p className={`${textSecondaryClass} text-sm mt-2`}>Start journaling to see your thoughts here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                      <span className={`text-sm font-medium ${getMoodColor(entry.mood)}`}>
                        {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className={`w-4 h-4 ${textSecondaryClass}`} />
                      <span className={`text-sm ${textSecondaryClass}`}>
                        {formatTime(entry.created_at)}
                      </span>
                    </div>
                  </div>
                  <p className={`${textClass} leading-relaxed`}>{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryModal;