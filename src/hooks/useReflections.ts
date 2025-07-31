import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface AIReflection {
  id: string;
  user_id: string;
  journal_entry_id: string | null;
  reflection_type: string;
  reflection_content: string;
  generated_at: string;
}

export interface ReflectionWithEntry extends AIReflection {
  journal_entry?: {
    id: string;
    content: string;
    mood: 'happy' | 'neutral' | 'sad';
    created_at: string;
  };
}

export const useReflections = () => {
  const [reflections, setReflections] = useState<ReflectionWithEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchReflections = async () => {
    if (!user) {
      setReflections([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('ai_reflections')
        .select(`
          *,
          journal_entry:journal_entries(
            id,
            content,
            mood,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching reflections:', fetchError);
        setError('Failed to fetch reflections');
        return;
      }

      setReflections(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReflections();
  }, [user]);

  const getReflectionsByMonth = () => {
    const monthlyData: { [key: string]: number } = {};
    
    reflections.forEach(reflection => {
      const date = new Date(reflection.generated_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  };

  const getMoodDistribution = () => {
    const moodCounts = { happy: 0, neutral: 0, sad: 0 };
    
    reflections.forEach(reflection => {
      if (reflection.journal_entry?.mood) {
        moodCounts[reflection.journal_entry.mood]++;
      }
    });

    return [
      { mood: 'Happy', count: moodCounts.happy, color: '#10B981' },
      { mood: 'Neutral', count: moodCounts.neutral, color: '#F59E0B' },
      { mood: 'Sad', count: moodCounts.sad, color: '#EF4444' }
    ];
  };

  const getReflectionTypes = () => {
    const typeCounts: { [key: string]: number } = {};
    
    reflections.forEach(reflection => {
      typeCounts[reflection.reflection_type] = (typeCounts[reflection.reflection_type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count
    }));
  };

  return {
    reflections,
    loading,
    error,
    refetch: fetchReflections,
    getReflectionsByMonth,
    getMoodDistribution,
    getReflectionTypes,
    getTotalReflections: () => reflections.length,
  };
};