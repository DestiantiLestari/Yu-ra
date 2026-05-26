import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Award, Compass, Heart, Activity, Brain, ShieldAlert } from 'lucide-react';
import { MoodEntry, MoodType } from '../types';

interface EmotionalAnalyticsProps {
  moodHistory: MoodEntry[];
}

export default function EmotionalAnalytics({ moodHistory }: EmotionalAnalyticsProps) {
  
  // 1. Process line chart data (mood trend)
  const lineChartData = [...moodHistory]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((log) => {
      const dateObj = new Date(log.timestamp);
      return {
        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intensity: log.score,
        moodLabel: log.mood.toUpperCase().replace('_', ' ')
      };
    });

  // 2. Process stressor frequencies
  const stressorCount: Record<string, number> = {};
  moodHistory.forEach((log) => {
    log.stressors.forEach((st) => {
      stressorCount[st] = (stressorCount[st] || 0) + 1;
    });
  });

  const barChartData = Object.keys(stressorCount).map((st) => ({
    name: st.length > 15 ? st.substring(0, 15) + "..." : st,
    frequency: stressorCount[st]
  })).sort((a, b) => b.frequency - a.frequency);

  // Compute burn out index score (percentage of heavy stress logs)
  const heavyLogs = moodHistory.filter((log) => log.mood === 'burnt_out' || log.mood === 'anxious' || log.score <= 2);
  const totalLogs = moodHistory.length;
  const burnoutPercentage = totalLogs > 0 ? Math.round((heavyLogs.length / totalLogs) * 100) : 0;

  // Primary stressor lookup
  const primaryStressor = barChartData[0]?.name || "None logged yet";

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md">
        <h2 className="font-serif text-2xl font-semibold text-[#2D2529]">Emotional Navigation Center</h2>
        <p className="text-xs text-[#82717C] mt-1 font-light">
          Translating logged micro-feelings into clear thermal maps to locate which triggers pull your energy.
        </p>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Burnout Meter index</p>
            <p className="text-xl font-serif font-medium text-slate-800 mt-0.5">{burnoutPercentage}%</p>
            <p className="text-[9px] text-[#8C7A84] mt-1">Based on anxiety / fatigue levels</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-pink-50 rounded-2xl text-pink-500">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Primary Channel pull</p>
            <p className="text-xl font-serif font-medium text-slate-800 mt-0.5 truncate max-w-[170px]" title={primaryStressor}>
              {primaryStressor}
            </p>
            <p className="text-[9px] text-[#8C7A84] mt-1">Stressor flagged most frequently</p>
          </div>
        </div>

        <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-white flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Calming Consistency</p>
            <p className="text-xl font-serif font-medium text-slate-800 mt-0.5">
              {totalLogs >= 5 ? 'High Anchor' : totalLogs >= 2 ? 'Gentle Steady' : 'Starting Path'}
            </p>
            <p className="text-[9px] text-[#8C7A84] mt-1">{totalLogs} historical checkpoints logs</p>
          </div>
        </div>
      </div>

      {/* Recharts visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Mood progression LineChart */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs">
          <h3 className="font-serif text-lg font-medium text-[#2D2529] mb-1">Fluency Progression</h3>
          <p className="text-xs text-slate-400 font-light mb-6">Historical chart tracking the warmth index (1-Heavy, 5-Sunny) of your logs.</p>

          {lineChartData.length < 2 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs text-center p-6 bg-[#FAF6F0]/40">
              <Activity className="w-8 h-8 opacity-40 mb-2" />
              <p>Log your mood over at least 2 separate calendar checkpoints to chart interactive progression line lines.</p>
            </div>
          ) : (
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8C7A84' }} stroke="#E9E3FF" />
                  <YAxis domain={[1, 5]} allowDecimals={false} tick={{ fontSize: 10, fill: '#8C7A84' }} stroke="#E9E3FF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E9E3FF', fontSize: '11px' }}
                    formatter={(value, name, props) => [`Level: ${value} (${props.payload.moodLabel})`, "Feeling State"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="#AA7BC3" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#3F2B36', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 7 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Stressor frequencies BarChart */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs">
          <h3 className="font-serif text-lg font-medium text-[#2D2529] mb-1">Pressure Channel Frequency</h3>
          <p className="text-xs text-slate-400 font-light mb-6">Which avenues are extracting the most mental energy this cycle.</p>

          {barChartData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs text-center p-6 bg-[#FAF6F0]/40">
              <ShieldAlert className="w-8 h-8 opacity-40 mb-2" />
              <p>You haven't checked any pressure channels or stress contributing factors in your mood logs yet.</p>
            </div>
          ) : (
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8C7A84' }} stroke="#E9E3FF" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#8C7A84' }} stroke="#E9E3FF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E9E3FF', fontSize: '11px' }}
                  />
                  <Bar dataKey="frequency" radius={[6, 6, 0, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#AA7BC3' : '#BF99D4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

      {/* Wellness counsel brief */}
      <div className="p-6 rounded-[2rem] bg-gradient-to-r from-[#FAF6F0] via-[#FDF9F4] to-[#FAF6F0] border border-stone-200 text-left flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-serif text-sm font-semibold text-[#2D2529]">Aura's Healing Suggestion based on triggers</h4>
          <p className="text-xs text-slate-600 font-light mt-0.5 leading-relaxed">
            {burnoutPercentage >= 60 
              ? "Your current Burnout Index is elevated. We recommend halting academic duties after 8:00 PM today. Let us spend at least 10 minutes in the Soothing Cocoon with lofi wind waves."
              : primaryStressor.includes('Exams')
              ? "Exams or assignments feel heavy right now, sweet soul. Remember that your brilliant core exists completely independent of grade papers. Schedule strict 30-minute study limits, with a 5-minute breathing walk in between."
              : "Your emotional cycle is flowing beautifully. To hold this light, write a small list in your journal of three things you appreciate in your character that are completely unrelated to grades or careers."
            }
          </p>
        </div>
      </div>

    </div>
  );
}
