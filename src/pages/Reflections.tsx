import React, { useState, useEffect } from 'react';
import { Trash2, Trophy, TrendingUp, Calendar, Sparkles, Target, Award, Star, Zap, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface JournalEntry {
  id: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad';
  created_at: string;
}

interface AIReflection {
  id: string;
  reflection_content: string;
  generated_at: string;
  journal_entry_id: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  target: number;
  current: number;
  completed: boolean;
}

const Reflections: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [reflections, setReflections] = useState<AIReflection[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const bgClass = `bg-gradient-to-br ${isDarkMode ? colors.darkBg : colors.lightBg}`;
  const cardClass = isDarkMode 
    ? 'bg-white/10 backdrop-blur-sm border-white/10'
    : `${colors.lightCard} backdrop-blur-sm ${colors.lightBorder}`;
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch reflections
      const { data: reflectionsData, error: reflectionsError } = await supabase
        .from('ai_reflections')
        .select('*')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false });

      if (reflectionsError) throw reflectionsError;

      // Fetch journal entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (entriesError) throw entriesError;

      setReflections(reflectionsData || []);
      setJournalEntries(entriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReflection = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ai_reflections')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setReflections(prev => prev.filter(r => r.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting reflection:', error);
    }
  };

  // Calculate achievements
  const calculateAchievements = (): Achievement[] => {
    const totalEntries = journalEntries.length;
    const happyEntries = journalEntries.filter(e => e.mood === 'happy').length;
    const neutralEntries = journalEntries.filter(e => e.mood === 'neutral').length;
    const sadEntries = journalEntries.filter(e => e.mood === 'sad').length;
    const totalReflections = reflections.length;
    
    // Calculate streaks (simplified - consecutive days with entries)
    const sortedEntries = [...journalEntries].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    let currentStreak = 0;
    let maxStreak = 0;
    let lastDate: Date | null = null;
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.created_at);
      entryDate.setHours(0, 0, 0, 0);
      
      if (!lastDate) {
        currentStreak = 1;
        maxStreak = 1;
      } else {
        const dayDiff = (entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else if (dayDiff > 1) {
          currentStreak = 1;
        }
      }
      lastDate = entryDate;
    }

    const hasAllMoods = happyEntries > 0 && neutralEntries > 0 && sadEntries > 0;
    const hasEachMood10 = happyEntries >= 10 && neutralEntries >= 10 && sadEntries >= 10;

    return [
      {
        id: 'first-entry',
        title: 'First Steps',
        description: 'Write your first journal entry',
        icon: Target,
        target: 1,
        current: Math.min(totalEntries, 1),
        completed: totalEntries >= 1
      },
      {
        id: 'happy-thoughts',
        title: 'Happy Thoughts',
        description: 'Write 3 happy entries',
        icon: Star,
        target: 3,
        current: Math.min(happyEntries, 3),
        completed: happyEntries >= 3
      },
      {
        id: 'centurion',
        title: 'Centurion',
        description: 'Make 100 entries',
        icon: Crown,
        target: 100,
        current: Math.min(totalEntries, 100),
        completed: totalEntries >= 100
      },
      {
        id: 'week-streak',
        title: 'Consistent Writer',
        description: 'Maintain a 7-day streak',
        icon: Calendar,
        target: 7,
        current: Math.min(maxStreak, 7),
        completed: maxStreak >= 7
      },
      {
        id: 'mood-explorer',
        title: 'Emotional Explorer',
        description: 'Write entries with all 3 moods',
        icon: Sparkles,
        target: 3,
        current: (happyEntries > 0 ? 1 : 0) + (neutralEntries > 0 ? 1 : 0) + (sadEntries > 0 ? 1 : 0),
        completed: hasAllMoods
      },
      {
        id: 'reflection-master',
        title: 'Reflection Master',
        description: 'Generate 25 AI reflections',
        icon: Zap,
        target: 25,
        current: Math.min(totalReflections, 25),
        completed: totalReflections >= 25
      },
      {
        id: 'dedicated-journaler',
        title: 'Dedicated Journaler',
        description: 'Write 50 entries',
        icon: Award,
        target: 50,
        current: Math.min(totalEntries, 50),
        completed: totalEntries >= 50
      },
      {
        id: 'mood-tracker',
        title: 'Mood Tracker',
        description: 'Write 10 entries of each mood',
        icon: TrendingUp,
        target: 30,
        current: Math.min(happyEntries, 10) + Math.min(neutralEntries, 10) + Math.min(sadEntries, 10),
        completed: hasEachMood10
      },
      {
        id: 'marathon-writer',
        title: 'Marathon Writer',
        description: 'Maintain a 30-day streak',
        icon: Trophy,
        target: 30,
        current: Math.min(maxStreak, 30),
        completed: maxStreak >= 30
      },
      {
        id: 'wisdom-seeker',
        title: 'Wisdom Seeker',
        description: 'Generate 100 AI reflections',
        icon: Crown,
        target: 100,
        current: Math.min(totalReflections, 100),
        completed: totalReflections >= 100
      }
    ];
  };

  // Calculate average sentiment
  const calculateAverageSentiment = () => {
    if (journalEntries.length === 0) return { label: 'No Data', score: 0, color: 'text-gray-500' };
    
    const moodScores = journalEntries.map(entry => {
      switch (entry.mood) {
        case 'happy': return 3;
        case 'neutral': return 2;
        case 'sad': return 1;
        default: return 2;
      }
    });
    
    const average = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;
    
    if (average >= 2.5) {
      return { label: 'Positive', score: average, color: 'text-green-500' };
    } else if (average >= 1.5) {
      return { label: 'Neutral', score: average, color: 'text-yellow-500' };
    } else {
      return { label: 'Reflective', score: average, color: 'text-blue-500' };
    }
  };

  const achievements = calculateAchievements();
  const completedAchievements = achievements.filter(a => a.completed).length;
  const sentiment = calculateAverageSentiment();

  if (loading) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className={textSecondaryClass}>Loading reflections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} p-8`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Reflections</h1>
          <p className={textSecondaryClass}>Explore your AI-generated insights and achievements</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Achievements */}
          <div className={`${cardClass} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${textClass}`}>Achievements</h3>
              <Trophy className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.completed 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${textClass} ${achievement.completed ? '' : 'opacity-60'}`}>
                        {achievement.title}
                      </p>
                      <p className={`text-xs ${textSecondaryClass} ${achievement.completed ? '' : 'opacity-60'}`}>
                        {achievement.current}/{achievement.target}
                      </p>
                    </div>
                    {achievement.completed && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className={`text-sm ${textSecondaryClass}`}>
                {completedAchievements}/{achievements.length} completed
              </p>
            </div>
          </div>

          {/* Average Sentiment */}
          <div className={`${cardClass} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${textClass}`}>Average Sentiment</h3>
              <TrendingUp className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${sentiment.color} mb-2`}>
                {sentiment.label}
              </div>
              <p className={`text-sm ${textSecondaryClass}`}>
                Based on {journalEntries.length} entries
              </p>
              {journalEntries.length > 0 && (
                <div className="mt-4">
                  <div className={`text-xs ${textSecondaryClass} mb-1`}>
                    Score: {sentiment.score.toFixed(1)}/3.0
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        sentiment.score >= 2.5 ? 'bg-green-500' : 
                        sentiment.score >= 1.5 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(sentiment.score / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Total Reflections */}
          <div className={`${cardClass} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${textClass}`}>Total Reflections</h3>
              <Sparkles className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${colors.text} mb-2`}>
                {reflections.length}
              </div>
              <p className={`text-sm ${textSecondaryClass}`}>
                AI-generated insights
              </p>
            </div>
          </div>
        </div>

        {/* Reflections List */}
        <div className={`${cardClass} rounded-xl p-6 border`}>
          <h3 className={`text-lg font-semibold ${textClass} mb-6`}>Your Reflections</h3>
          
          {reflections.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className={`w-12 h-12 ${textSecondaryClass} mx-auto mb-4`} />
              <p className={`${textSecondaryClass} mb-2`}>No reflections yet</p>
              <p className={`text-sm ${textSecondaryClass}`}>
                Start journaling to generate AI-powered insights
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reflections.map((reflection) => (
                <div key={reflection.id} className={`p-4 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} relative group`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-8">
                      <p className={`${textClass} mb-2`}>{reflection.reflection_content}</p>
                      <p className={`text-sm ${textSecondaryClass}`}>
                        {new Date(reflection.generated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(reflection.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${cardClass} rounded-xl p-6 border max-w-md w-full mx-4`}>
              <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Delete Reflection</h3>
              <p className={`${textSecondaryClass} mb-6`}>
                Are you sure you want to delete this reflection? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} ${textClass} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReflection(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reflections;