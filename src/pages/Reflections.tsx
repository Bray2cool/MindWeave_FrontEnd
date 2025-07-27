import React, { useState } from 'react';
import { Sparkles, Calendar, TrendingUp, Brain, Search, Filter, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useReflections } from '../hooks/useReflections';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reflections: React.FC = () => {
  const { isDarkMode, getThemeColors } = useTheme();
  const colors = getThemeColors();
  const { 
    reflections, 
    loading, 
    getReflectionsByMonth, 
    getMoodDistribution, 
    getReflectionTypes,
    getTotalReflections 
  } = useReflections();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedReflection, setSelectedReflection] = useState<any>(null);

  const bgClass = `bg-gradient-to-br ${isDarkMode ? colors.darkBg : colors.lightBg}`;
  
  const cardClass = isDarkMode 
    ? 'bg-white/10 backdrop-blur-sm border-white/10'
    : `${colors.lightCard} backdrop-blur-sm ${colors.lightBorder}`;
  
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  const filteredReflections = reflections.filter(reflection => {
    const matchesSearch = reflection.reflection_content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reflection.journal_entry?.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === 'all' || reflection.journal_entry?.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      default: return '😐';
    }
  };

  const monthlyData = getReflectionsByMonth();
  const moodData = getMoodDistribution();
  const typeData = getReflectionTypes();

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className={`w-8 h-8 ${colors.text}`} />
            <h1 className={`text-4xl font-bold italic bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
              Reflections
            </h1>
          </div>
          <p className={`${textSecondaryClass} text-lg`}>
            Explore AI-generated insights from your journaling journey.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${cardClass} rounded-2xl p-6 border`}>
            <div className={`w-12 h-12 bg-gradient-to-r ${colors.primary} rounded-lg flex items-center justify-center mb-4`}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${textClass} mb-1`}>
              {loading ? '...' : getTotalReflections()}
            </h3>
            <p className={textSecondaryClass}>Total Reflections</p>
          </div>

          <div className={`${cardClass} rounded-2xl p-6 border`}>
            <div className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4`}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${textClass} mb-1`}>
              {loading ? '...' : typeData.length}
            </h3>
            <p className={textSecondaryClass}>Insight Types</p>
          </div>

          <div className={`${cardClass} rounded-2xl p-6 border`}>
            <div className={`w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${textClass} mb-1`}>
              {loading ? '...' : monthlyData.length > 0 ? monthlyData[monthlyData.length - 1]?.count || 0 : 0}
            </h3>
            <p className={textSecondaryClass}>This Month</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Reflections Chart */}
          <div className={`${cardClass} rounded-2xl p-6 border`}>
            <h3 className={`text-xl font-bold ${textClass} mb-6`}>Reflections Over Time</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="month" 
                    stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
                    fontSize={12}
                  />
                  <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '8px',
                      color: isDarkMode ? '#FFFFFF' : '#1F2937'
                    }}
                  />
                  <Bar dataKey="count" fill={`url(#gradient-${colors.accent})`} radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id={`gradient-${colors.accent}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={`var(--${colors.accent})`} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={`var(--${colors.accent})`} stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className={textSecondaryClass}>No reflection data yet</p>
              </div>
            )}
          </div>

          {/* Mood Distribution Chart */}
          <div className={`${cardClass} rounded-2xl p-6 border`}>
            <h3 className={`text-xl font-bold ${textClass} mb-6`}>Mood Distribution</h3>
            {moodData.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '8px',
                      color: isDarkMode ? '#FFFFFF' : '#1F2937'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className={textSecondaryClass}>No mood data yet</p>
              </div>
            )}
            <div className="flex justify-center space-x-4 mt-4">
              {moodData.map((mood, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: mood.color }}
                  ></div>
                  <span className={`${textSecondaryClass} text-sm`}>
                    {mood.mood} ({mood.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className={`${cardClass} rounded-2xl p-6 border mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondaryClass}`} />
              <input
                type="text"
                placeholder="Search reflections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-white/50' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'} border rounded-lg focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent`}
              />
            </div>
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondaryClass}`} />
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className={`pl-10 pr-8 py-3 ${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border rounded-lg focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent appearance-none`}
              >
                <option value="all">All Moods</option>
                <option value="happy">😊 Happy</option>
                <option value="neutral">😐 Neutral</option>
                <option value="sad">😔 Sad</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondaryClass} pointer-events-none`} />
            </div>
          </div>
        </div>

        {/* Reflections List */}
        <div className={`${cardClass} rounded-2xl p-6 border`}>
          <h3 className={`text-xl font-bold ${textClass} mb-6`}>Your Reflections</h3>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-lg p-4 animate-pulse`}>
                  <div className={`h-4 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} rounded mb-2`}></div>
                  <div className={`h-3 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} rounded w-3/4`}></div>
                </div>
              ))}
            </div>
          ) : filteredReflections.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className={`w-12 h-12 ${textSecondaryClass} mx-auto mb-4`} />
              <p className={`${textSecondaryClass} text-lg`}>
                {reflections.length === 0 ? 'No AI reflections yet' : 'No reflections match your search'}
              </p>
              <p className={`${textSecondaryClass} text-sm mt-2`}>
                {reflections.length === 0 
                  ? 'Write journal entries to receive AI-generated insights and reflections!' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredReflections.map((reflection) => (
                <div
                  key={reflection.id}
                  className={`${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg p-4 transition-colors cursor-pointer`}
                  onClick={() => setSelectedReflection(selectedReflection?.id === reflection.id ? null : reflection)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Sparkles className={`w-5 h-5 ${colors.text}`} />
                      <div>
                        <h4 className={`${textClass} font-medium`}>
                          AI Reflection
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {reflection.journal_entry && (
                            <>
                              <span className="text-sm">{getMoodEmoji(reflection.journal_entry.mood)}</span>
                              <span className={`${textSecondaryClass} text-sm`}>
                                {reflection.journal_entry.mood.charAt(0).toUpperCase() + reflection.journal_entry.mood.slice(1)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className={`w-4 h-4 ${textSecondaryClass}`} />
                      <span className={`${textSecondaryClass} text-sm`}>
                        {formatDate(reflection.generated_at)}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`${textClass} leading-relaxed mb-3`}>
                    {reflection.reflection_content}
                  </p>
                  
                  {selectedReflection?.id === reflection.id && reflection.journal_entry && (
                    <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                      <h5 className={`${textClass} font-medium mb-2`}>Original Journal Entry:</h5>
                      <p className={`${textSecondaryClass} text-sm leading-relaxed`}>
                        {reflection.journal_entry.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reflections;