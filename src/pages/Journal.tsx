import React, { useState } from 'react';
import { ArrowUp, Smile, Meh, Frown, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import ContextualLinks from '../components/ContextualLinks';
import PromptRotator from '../components/PromptRotator';

const Journal: React.FC = () => {
  const { isDarkMode, getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [reflection, setReflection] = useState<string | null>(null);
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
      setIsAnalyzing(false);
      setShowSuccess(false);
      setReflection(null);
      
      try {
        const { data: entryData, error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            content: journalText.trim(),
            mood: selectedMood,
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving journal entry:', error);
          alert('Failed to save journal entry. Please try again.');
          return;
        }

        // Show success state
        setShowSuccess(true);
        setIsSubmitting(false);
        
        // Start analyzing
        setIsAnalyzing(true);

        // Call deployed backend for analysis
        let apiUrl = import.meta.env.VITE_REFLECTION_API_URL;
        
        // Handle case where env var is not set or is malformed
        if (!apiUrl || apiUrl.includes('VITE_REFLECTION_API_URL')) {
          apiUrl = 'https://mind-be-ruddy.vercel.app';
        }
        
        const fullUrl = apiUrl + '/api/analyze';
        console.log('Making API request to:', fullUrl);
        
        const response = await fetch(
          fullUrl,
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ entry_text: journalText.trim() }),
          }
        );

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`Failed to analyze entry: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.mindweave_reflection) {
          setReflection(data.mindweave_reflection);
        } else {
          console.error('No reflection in API response:', data);
          setReflection('Unable to generate reflection at this time. Your journal entry has been saved successfully.');
        }

        // Save reflection to database
        if (data.mindweave_reflection && entryData) {
          console.log('Saving reflection to database:', {
            user_id: user.id,
            journal_entry_id: entryData.id,
            reflection_content: data.mindweave_reflection
          });
          
          const { data: reflectionData, error: reflectionError } = await supabase
            .from('ai_reflections')
            .insert({
              user_id: user.id,
              journal_entry_id: entryData.id,
              reflection_type: 'general',
              reflection_content: data.mindweave_reflection,
            })
            .select();

          if (reflectionError) {
            console.error('Error saving reflection:', reflectionError);
          } else {
            console.log('Reflection saved successfully:', reflectionData);
          }
        }

        // Clear form after successful submission
        setJournalText('');
        setSelectedMood(null);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
        
      } catch (error) {
        console.error('Unexpected error:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        }
        setReflection('Unable to generate reflection at this time. Your journal entry has been saved successfully.');
      } finally {
        setIsAnalyzing(false);
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

  const bgClass = `bg-gradient-to-br ${isDarkMode ? colors.darkBg : colors.lightBg}`;
  
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className={`w-40 h-40 mx-auto mb-6 bg-gradient-to-br ${colors.primary} rounded-full flex items-center justify-center shadow-2xl overflow-hidden`}>
            <img 
              src="/MindWeave.png" 
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
            className={`w-full h-32 ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-white/50' : 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'} backdrop-blur-sm border rounded-2xl p-6 resize-none focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent transition-all duration-300`}
            disabled={isSubmitting || isAnalyzing}
          />
          <button
            onClick={user ? handleSubmit : handleSubmitLegacy}
            disabled={!journalText.trim() || !selectedMood || isSubmitting || isAnalyzing}
            className={`absolute bottom-4 right-4 w-12 h-12 ${showSuccess ? 'bg-green-500' : 'bg-white'} rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
            ) : showSuccess ? (
              <CheckCircle className="w-6 h-6 text-white" />
            ) : (
              <ArrowUp className={`w-6 h-6 ${colors.text}`} />
            )}
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-green-500/20 border border-green-500/50' : 'bg-green-100 border border-green-300'} flex items-center space-x-3 animate-fade-in-up`}>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className={`${isDarkMode ? 'text-green-300' : 'text-green-700'} font-medium`}>
              Journal entry submitted successfully!
            </span>
          </div>
        )}

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-white/10 border border-white/20' : 'bg-gray-100 border border-gray-300'} flex items-center space-x-3`}>
            <Loader2 className={`w-5 h-5 ${colors.text} animate-spin`} />
            <span className={`${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
              Generating AI reflection...
            </span>
          </div>
        )}

        {/* Feedback */}
        {selectedMood && (
          <p className={`mt-4 ${textSecondaryClass} text-sm`}>
            Mood selected: {selectedMood === 'happy' ? '😊 Happy' : selectedMood === 'neutral' ? '😐 Neutral' : '😔 Sad'}
          </p>
        )}
        {/* Reflection Display */}
        {reflection && (
          <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-white/10 border border-white/20 text-white' : `bg-${colors.accent}/10 border border-${colors.accent}/30 ${colors.text}`} shadow animate-fade-in-up`}>
            <h3 className="font-bold mb-2">Reflection</h3>
            <p>{reflection}</p>
          </div>
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