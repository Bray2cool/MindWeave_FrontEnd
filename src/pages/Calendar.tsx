import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useJournalEntries } from '../hooks/useJournalEntries';
import EntryModal from '../components/EntryModal';
import ContextualLinks from '../components/ContextualLinks';

const Calendar: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { getEntriesForDate } = useJournalEntries();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentYear, currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentDate.getMonth(), day);
    const entries = getEntriesForDate(date);
    const hasEntry = entries.length > 0;
    const mood = hasEntry ? entries[0].mood : null; // Use first entry's mood for display
    
    calendarDays.push({
      day,
      date,
      hasEntry,
      mood,
      entryCount: entries.length
    });
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDayClick = (dayData: any) => {
    if (dayData && dayData.hasEntry) {
      setSelectedDate(dayData.date);
      setIsModalOpen(true);
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-500';
      case 'neutral': return 'bg-yellow-500';
      case 'sad': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const bgClass = isDarkMode 
    ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900' 
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
  
  const cardClass = isDarkMode 
    ? 'bg-white/10 backdrop-blur-sm border-white/10' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';
  
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2`}>
            Calendar
          </h1>
          <p className={`${textSecondaryClass} text-lg`}>Track your journaling journey through time.</p>
          <div className="mt-4">
            <ContextualLinks context="calendar" />
          </div>
        </div>

        <div className={`${cardClass} rounded-2xl p-6 border`}>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${textClass}`}>
              {currentMonth} {currentYear}
            </h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigateMonth('prev')}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                <ChevronLeft className={`w-5 h-5 ${textClass}`} />
              </button>
              <button 
                onClick={() => navigateMonth('next')}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                <ChevronRight className={`w-5 h-5 ${textClass}`} />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysOfWeek.map((day) => (
              <div key={day} className={`text-center ${textSecondaryClass} font-medium py-2`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayData, index) => (
              <div
                key={index}
                onClick={() => handleDayClick(dayData)}
                className={`aspect-square rounded-lg ${
                  dayData 
                    ? `${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} transition-colors ${dayData.hasEntry ? 'cursor-pointer' : 'cursor-default'}` 
                    : ''
                } flex flex-col items-center justify-center relative`}
              >
                {dayData && (
                  <>
                    <span className={`${textClass} font-medium`}>{dayData.day}</span>
                    {dayData.hasEntry && (
                      <div className="flex items-center space-x-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${getMoodColor(dayData.mood)}`}></div>
                        {dayData.entryCount > 1 && (
                          <span className={`text-xs ${textSecondaryClass}`}>+{dayData.entryCount - 1}</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <h3 className={`${textClass} font-medium mb-3`}>Mood Legend</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className={`${textSecondaryClass} text-sm`}>Happy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className={`${textSecondaryClass} text-sm`}>Neutral</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className={`${textSecondaryClass} text-sm`}>Sad</span>
              </div>
            </div>
            <p className={`${textSecondaryClass} text-sm mt-2`}>
              Click on days with entries to view your journal entries
            </p>
          </div>
        </div>
      </div>

      {/* Entry Modal */}
      {selectedDate && (
        <EntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          entries={getEntriesForDate(selectedDate)}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default Calendar;