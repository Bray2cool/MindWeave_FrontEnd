import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad';
  created_at: string;
  updated_at: string;
}

export const useJournalEntries = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEntries = async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching entries:', fetchError);
        setError('Failed to fetch journal entries');
        return;
      }

      setEntries(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const getEntriesForDate = (date: Date) => {
    const dateStr = date.getFullYear() + '-' + 
      String(date.getMonth() + 1).padStart(2, '0') + '-' + 
      String(date.getDate()).padStart(2, '0');
    return entries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      const entryDateStr = entryDate.getFullYear() + '-' + 
        String(entryDate.getMonth() + 1).padStart(2, '0') + '-' + 
        String(entryDate.getDate()).padStart(2, '0');
      return entryDateStr === dateStr;
    });
  };

  const getTotalEntries = () => entries.length;

  const getEntriesThisWeek = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    return entries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= weekStart;
    }).length;
  };

  const getCurrentStreak = () => {
    if (entries.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Get unique dates
    const uniqueDates = Array.from(new Set(
      sortedEntries.map(entry => 
        new Date(entry.created_at).toISOString().split('T')[0]
      )
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (uniqueDates.length === 0) return 0;

    // Check if there's an entry today or yesterday
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let streak = 0;
    let currentDate = new Date();

    // Start from today or yesterday if there's an entry
    if (uniqueDates[0] === todayStr) {
      currentDate = today;
    } else if (uniqueDates[0] === yesterdayStr) {
      currentDate = yesterday;
    } else {
      return 0; // No recent entries
    }

    // Count consecutive days
    for (const dateStr of uniqueDates) {
      const entryDate = new Date(dateStr);
      const currentDateStr = currentDate.toISOString().split('T')[0];
      
      if (dateStr === currentDateStr) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const getAverageMood = () => {
    if (entries.length === 0) return 0;

    const moodValues = { happy: 10, neutral: 6, sad: 2 };
    const total = entries.reduce((sum, entry) => sum + moodValues[entry.mood], 0);
    return Number((total / entries.length).toFixed(1));
  };

  return {
    entries,
    loading,
    error,
    refetch: fetchEntries,
    getEntriesForDate,
    getTotalEntries,
    getEntriesThisWeek,
    getCurrentStreak,
    getAverageMood,
  };
};