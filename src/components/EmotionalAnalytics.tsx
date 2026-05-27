import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Compass, Heart, Activity, Brain, ShieldAlert } from 'lucide-react';
import { MoodEntry } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface EmotionalAnalyticsProps {
  moodHistory: MoodEntry[];
}

export default function EmotionalAnalytics({ moodHistory }: EmotionalAnalyticsProps) {
  const { t, language } = useLanguage();
  
  // 1. Process line chart data (mood trend)
  const lineChartData = [...moodHistory]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((log) => {
      const dateObj = new Date(log.timestamp);
      return {
        date: dateObj.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' }),
        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intensity: log.score,
        moodLabel: language === 'id' 
          ? (log.mood === 'happy' ? 'Senang' : log.mood === 'calm' ? 'Tenang' : log.mood === 'tired' ? 'Lelah' : log.mood === 'anxious' ? 'Cemas' : 'Burnout')
          : log.mood.toUpperCase().replace('_', ' ')
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
  const primaryStressor = barChartData[0]?.name || (language === 'id' ? 'Belum terdata' : 'None logged yet');

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md text-left">
        <h2 className="font-serif text-2xl font-semibold text-[#2D2529]">{t('analytics', 'title')}</h2>
        <p className="text-xs text-[#82717C] mt-1 font-light">
          {t('analytics', 'desc')}
        </p>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('analytics', 'meter_index')}</p>
            <p className="text-xl font-serif font-medium text-slate-800 mt-0.5">{burnoutPercentage}%</p>
            <p className="text-[9px] text-[#8C7A84] mt-1">{t('analytics', 'meter_sub')}</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-pink-50 rounded-2xl text-pink-500">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('analytics', 'channel_pull')}</p>
            <p className="text-xl font-serif font-medium text-slate-800 mt-0.5 truncate max-w-[170px]" title={primaryStressor}>
              {primaryStressor}
            </p>
            <p className="text-[9px] text-[#8C7A84] mt-1">{t('analytics', 'channel_sub')}</p>
          </div>
        </div>

        <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-white flex items-center space-x-4 animate-fade-in">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('analytics', 'consistency')}</p>
            <p className="text-xl font-serif font-medium text-slate-800 mt-0.5">
              {totalLogs >= 5 
                ? t('analytics', 'high_anchor') 
                : totalLogs >= 2 
                ? t('analytics', 'gentle_steady') 
                : t('analytics', 'starting_path')}
            </p>
            <p className="text-[9px] text-[#8C7A84] mt-1">{totalLogs} {t('analytics', 'checkpoints')}</p>
          </div>
        </div>
      </div>

      {/* Recharts visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        
        {/* Mood progression LineChart */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs">
          <h3 className="font-serif text-lg font-medium text-[#2D2529] mb-1">{t('analytics', 'fluency')}</h3>
          <p className="text-xs text-slate-400 font-light mb-6">{t('analytics', 'fluency_desc')}</p>

          {lineChartData.length < 2 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs text-center p-6 bg-[#FAF6F0]/40">
              <Activity className="w-8 h-8 opacity-40 mb-2" />
              <p>{t('analytics', 'progress_err')}</p>
            </div>
          ) : (
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8C7A84' }} stroke="#E9E3FF" />
                  <YAxis domain={[1, 5]} allowDecimals={false} tick={{ fontSize: 10, fill: '#8C7A84' }} stroke="#E9E3FF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E9E3FF', fontSize: '11px' }}
                    formatter={(value, name, props) => [`Level: ${value} (${props.payload.moodLabel})`, language === 'id' ? 'Status Perasaan' : 'Feeling State']}
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
          <h3 className="font-serif text-lg font-medium text-[#2D2529] mb-1">{t('analytics', 'pressure')}</h3>
          <p className="text-xs text-slate-400 font-light mb-6">{t('analytics', 'pressure_desc')}</p>

          {barChartData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs text-center p-6 bg-[#FAF6F0]/40">
              <ShieldAlert className="w-8 h-8 opacity-40 mb-2" />
              <p>{t('analytics', 'pressure_err')}</p>
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
      <div className="p-6 rounded-[2rem] bg-gradient-to-r from-[#FAF6F0] via-[#FDF9F4] to-[#FAF6F0] border border-stone-200 text-left flex flex-col md:flex-row md:items-center gap-4 animate-fade-in">
        <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
          <Compass className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <h4 className="font-serif text-sm font-semibold text-[#2D2529]">
            {language === 'id' ? "Saran Pemulihan Aura berdasarkan pemicu" : "Aura's Healing Suggestion based on triggers"}
          </h4>
          <p className="text-xs text-slate-600 font-light mt-0.5 leading-relaxed">
            {burnoutPercentage >= 60 
              ? (language === 'id' 
                  ? "Indeks kelelahan (Burnout) Anda sedang tinggi saat ini. Kami sangat menyarankan untuk menghentikan seluruh aktivitas belajar di atas jam 8 malam hari ini. Sediakan paling tidak 10 menit di Kepompong Penyejuk dengan gelombang suara laut."
                  : "Your current Burnout Index is elevated. We recommend halting academic duties after 8:00 PM today. Let us spend at least 10 minutes in the Soothing Cocoon with lofi wind waves.")
              : primaryStressor.toLowerCase().includes('exam') || primaryStressor.toLowerCase().includes('ujian')
              ? (language === 'id'
                  ? "Ujian atau tugas terasa memberatkanmu saat ini, jiwa yang indah. Ingatlah bahwa nilai bersinar dalam dirimu jauh melampaui kertas nilai ujian. Terapkan batas belajar 30 menit, diselingi 5 menit jingle bernapas santai."
                  : "Exams or assignments feel heavy right now, sweet soul. Remember that your brilliant core exists completely independent of grade papers. Schedule strict 30-minute study limits, with a 5-minute breathing walk in between.")
              : (language === 'id'
                  ? "Siklus emosi Anda sedang terurai dengan sangat indah. Untuk menjaga sinar hangat ini, ketuk buku harian Anda dan tuliskan 3 hal kecil yang Anda hargai dalam karakter diri Anda hari ini."
                  : "Your emotional cycle is flowing beautifully. To hold this light, write a small list in your journal of three things you appreciate in your character that are completely unrelated to grades or careers.")
            }
          </p>
        </div>
      </div>

    </div>
  );
}
