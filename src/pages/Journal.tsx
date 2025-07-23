import React, { useState } from 'react';
import { ArrowUp, Smile, Meh, Frown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import ContextualLinks from '../components/ContextualLinks';

const Journal: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const { user } = useAuth();

  const journalPrompts = [
    "What's something you've been putting off?",
    "How did you challenge yourself today?",
    "What made you smile this week?",
    "What are you most grateful for right now?",
    "Describe a moment when you felt truly proud of yourself",
    "What would you tell your younger self?",
    "What's one thing you learned today?",
    "How do you want to feel tomorrow?",
    "What's been weighing on your mind lately?",
    "What small victory can you celebrate today?",
    "What's something you're looking forward to?",
    "How have you grown in the past month?",
    "What would make today feel complete?",
    "What's a fear you've been facing lately?",
    "What brings you the most peace?",
  ];

  // Rotate prompts every 4 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % journalPrompts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [journalPrompts.length]);
  const moods = [
    { id: 'happy', icon: Smile, color: 'text-green-500 hover:text-green-400', bgColor: 'bg-green-500/20 border-green-500' },
    { id: 'neutral', icon: Meh, color: 'text-yellow-500 hover:text-yellow-400', bgColor: 'bg-yellow-500/20 border-yellow-500' },
    { id: 'sad', icon: Frown, color: 'text-red-500 hover:text-red-400', bgColor: 'bg-red-500/20 border-red-500' },
  ];

  const handleSubmit = async () => {
    if (journalText.trim() && selectedMood && user) {
      setIsSubmitting(true);
      
      try {
        const { error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            content: journalText.trim(),
            mood: selectedMood,
          });

        if (error) {
          console.error('Error saving journal entry:', error);
          alert('Failed to save journal entry. Please try again.');
          return;
        }

        alert('Journal entry saved successfully!');
        setJournalText('');
        setSelectedMood(null);
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmitLegacy = () => {
    if (journalText.trim() && selectedMood && !user) {
      console.log('Submitting journal entry (legacy):', { text: journalText, mood: selectedMood });
      setJournalText('');
      setSelectedMood(null);
      alert('Journal entry saved successfully!');
    }
  };

  const bgClass = isDarkMode 
    ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900' 
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
  
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
            <img 
              src="/src/components/MindWeave.png" 
              alt="MindWeave Logo" 
              className="w-36 h-36 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            MindWeave
          </h1>
          <div className="h-8 flex items-center justify-center mb-2">
            <p 
              key={currentPromptIndex}
              className={`${textSecondaryClass} text-lg italic text-center max-w-md animate-fade-in-up`}
            >
              {journalPrompts[currentPromptIndex]}
            </p>
          </div>
        </div>

        {/* Mood Selection */}
        <div className="flex justify-center space-x-6 mb-8">
          {moods.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id as 'happy' | 'neutral' | 'sad')}
                className={`w-16 h-16 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isSelected 
                    ? mood.bgColor 
                    : `${isDarkMode ? 'border-white/30 hover:border-white/50 bg-white/10' : 'border-gray-300 hover:border-gray-400 bg-gray-100'}`
                }`}
              >
                <Icon className={`w-8 h-8 transition-colors ${
                  isSelected ? mood.color.replace('hover:', '') : `${isDarkMode ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`
                }`} />
              </button>
            );
          })}
        </div>

        {/* Journal Input */}
        <div className="relative">
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Write your thoughts here..."
            className={`w-full h-32 ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-white/50' : 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'} backdrop-blur-sm border rounded-2xl p-6 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
          />
          <button
            onClick={user ? handleSubmit : handleSubmitLegacy}
            disabled={!journalText.trim() || !selectedMood || isSubmitting}
            className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ArrowUp className={`w-6 h-6 text-purple-600 ${isSubmitting ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        {/* Feedback */}
        {selectedMood && (
          <p className={`mt-4 ${textSecondaryClass} text-sm`}>
            Mood selected: {selectedMood === 'happy' ? '😊 Happy' : selectedMood === 'neutral' ? '😐 Neutral' : '😔 Sad'}
          </p>
        )}

        {/* Contextual Navigation */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <ContextualLinks context="journal" className="justify-center" />
        </div>
      </div>
    </div>
  );
};

export default Journal;