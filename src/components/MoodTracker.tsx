import React, { useState } from 'react';
import { AlignLeft, Smile, Heart, Clock, Delete, Trash, Shield, HelpCircle, Activity } from 'lucide-react';
import { MoodEntry, MoodType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MoodTrackerProps {
  moodHistory: MoodEntry[];
  onAddMood: (entry: MoodEntry) => void;
  onDeleteMood: (id: string) => void;
}

export default function MoodTracker({ moodHistory = [], onAddMood, onDeleteMood }: MoodTrackerProps) {
  const { language, t } = useLanguage();

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [sensationLevel, setSensationLevel] = useState<number>(5);
  const [selectedStressors, setSelectedStressors] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  // Emojis mapping using 6 type-safe keys
  const MOOD_EMOJIS: Record<MoodType, { char: string; name: string; desc: string }> = {
    anxious: { char: '💓', name: t('mood', 'anxious_label'), desc: t('mood', 'anxious_desc') },
    burnt_out: { char: '🥀', name: t('mood', 'burnt_out_label'), desc: t('mood', 'burnt_out_desc') },
    overthinking: { char: '🌀', name: t('mood', 'overthinking_label'), desc: t('mood', 'overthinking_desc') },
    sad: { char: '🌧️', name: t('mood', 'sad_label'), desc: t('mood', 'sad_desc') },
    peaceful: { char: '☕', name: t('mood', 'peaceful_label'), desc: t('mood', 'peaceful_desc') },
    joyful: { char: '🌸', name: t('mood', 'joyful_label'), desc: t('mood', 'joyful_desc') }
  };

  // Human stressors tags matching translation keys
  const STRESSOR_OPTIONS = [
    { key: 'st_exams', label: t('mood', 'st_exams') },
    { key: 'st_career', label: t('mood', 'st_career') },
    { key: 'st_family', label: t('mood', 'st_family') },
    { key: 'st_body', label: t('mood', 'st_body') },
    { key: 'st_friendships', label: t('mood', 'st_friendships') },
    { key: 'st_social', label: t('mood', 'st_social') },
    { key: 'st_sleep', label: t('mood', 'st_sleep') },
    { key: 'st_finance', label: t('mood', 'st_finance') }
  ];

  const toggleStressor = (itemKey: string) => {
    setSelectedStressors(prev => 
      prev.includes(itemKey) 
        ? prev.filter(x => x !== itemKey) 
        : [...prev, itemKey]
    );
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    const newLog: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      score: sensationLevel,
      stressors: selectedStressors,
      notes: notes.trim(),
      timestamp: new Date().toISOString()
    };

    onAddMood(newLog);
    
    // Clear form inputs
    setSelectedMood(null);
    setSensationLevel(5);
    setSelectedStressors([]);
    setNotes('');

    // Trigger feedback popup
    setShowSuccessMsg(true);
    setTimeout(() => {
      setShowSuccessMsg(false);
    }, 4000);
  };

  // Convert stressor keys back to translation for display
  const translateStressorLabel = (key: string) => {
    const matched = STRESSOR_OPTIONS.find(o => o.key === key);
    return matched ? matched.label : key;
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#2D2529] text-left">
      
      {/* Title block */}
      <div className="bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md text-left">
        <h1 className="font-serif text-2xl font-semibold text-[#2D2529] tracking-tight">{t('mood', 'title')}</h1>
        <p className="text-xs text-[#8C7A84] mt-1 font-light">{t('mood', 'subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Creator panel */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleLogSubmit} className="bg-white/70 backdrop-blur-xl border border-white/80 p-6 md:p-8 rounded-[2rem] shadow-sm space-y-6">
            
            {/* Success notification popup banner */}
            {showSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-scale-in text-emerald-800 text-xs">
                <Smile className="w-4 h-4 text-emerald-500 fill-current" />
                <span className="font-medium">{t('mood', 'success')}</span>
              </div>
            )}

            {/* Step 1: Mood Choice */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t('mood', 'step_1')}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.keys(MOOD_EMOJIS) as MoodType[]).map((mKey) => {
                  const mObj = MOOD_EMOJIS[mKey];
                  const isSelected = selectedMood === mKey;
                  return (
                    <button
                      key={mKey}
                      type="button"
                      onClick={() => setSelectedMood(mKey)}
                      className={`p-4 rounded-2xl border transition-all duration-300 text-center cursor-pointer flex flex-col items-center justify-center ${
                        isSelected 
                          ? 'bg-[#3F2B36] border-[#3F2B36] text-white shadow-md scale-102' 
                          : 'bg-white/80 hover:bg-slate-50 border-stone-200/50 hover:border-[#D8B4FE]'
                      }`}
                    >
                      <span className="text-2xl mb-1.5 filter drop-shadow-3xs">{mObj.char}</span>
                      <span className="text-[11px] font-semibold tracking-tight block">{mObj.name}</span>
                      <span className={`text-[8px] transform mt-0.5 block leading-tight font-light ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>{mObj.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Sensation Intensity Level Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <label>{t('mood', 'step_2')}</label>
                <span className="font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">{sensationLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sensationLevel}
                onChange={(e) => setSensationLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-[#FAF6F0] rounded-full appearance-none cursor-pointer accent-[#A47CB5]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-light">
                <span>{t('mood', 'sensation_light')}</span>
                <span>{t('mood', 'sensation_heavy')}</span>
              </div>
            </div>

            {/* Step 3: Triggering factors/stressors */}
            <div className="space-y-3 pt-2 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t('mood', 'step_3')}</label>
              <div className="flex flex-wrap gap-2">
                {STRESSOR_OPTIONS.map((opt) => {
                  const active = selectedStressors.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => toggleStressor(opt.key)}
                      className={`text-xs py-1.5 px-3.5 rounded-full border cursor-pointer transition-all ${
                        active 
                          ? 'bg-purple-100 border-[#C084FC] text-purple-700 font-semibold shadow-3xs' 
                          : 'bg-white hover:bg-slate-50 border-stone-200/50 text-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Notes */}
            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                <AlignLeft className="w-3.5 h-3.5" />
                <span>{t('mood', 'step_4')}</span>
              </label>
              <textarea
                placeholder={t('mood', 'placeholder')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-[#FAF6F0]/60 border border-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:border-purple-300 text-xs text-slate-700 font-light"
                rows={3}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!selectedMood}
              className={`w-full py-3.5 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                selectedMood 
                  ? 'bg-[#3F2B36] hover:bg-[#523A48] text-white hover:scale-[1.01]' 
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>{t('mood', 'btn_commit')}</span>
            </button>

          </form>
        </div>

        {/* Dynamic history log column */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-6 rounded-[2rem] h-full shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#A47CB5]" />
                <h3 className="font-serif text-lg font-medium text-[#2D2529]">{t('mood', 'chronicle')}</h3>
              </div>
              <p className="text-xs text-[#8C7A84] font-light leading-relaxed">
                {t('mood', 'private_note')} ({moodHistory.length})
              </p>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {moodHistory.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 font-light text-xs bg-[#FAF6F0]/40 rounded-2xl border border-dashed border-stone-200/60">
                    <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p>{t('mood', 'clean_history')}</p>
                  </div>
                ) : (
                  moodHistory.map((log) => {
                    const emoDetail = MOOD_EMOJIS[log.mood] || { char: '🌸', name: log.mood };
                    const logDate = new Date(log.timestamp).toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div 
                        key={log.id} 
                        className="p-4 bg-[#FAF6F0]/60 border border-[#FAF6F0] rounded-2xl space-y-2 relative group hover:border-[#D8B4FE] transition-colors text-left"
                      >
                        <button
                          onClick={() => onDeleteMood(log.id)}
                          className="absolute right-3 top-3 p-1 rounded hover:bg-[#FAFAFA] text-slate-400 hover:text-rose-500 cursor-pointer pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Erase log"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center space-x-2">
                          <span className="text-lg filter drop-shadow-3xs">{emoDetail.char}</span>
                          <div>
                            <span className="text-xs font-semibold text-slate-700">{emoDetail.name}</span>
                            <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.25 rounded-md border border-purple-100 ml-2 font-mono">{log.score}/10</span>
                          </div>
                        </div>

                        {log.notes && (
                          <p className="text-xs text-slate-500 font-light leading-relaxed">&ldquo;{log.notes}&rdquo;</p>
                        )}

                        {log.stressors && log.stressors.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-1 self-center">{language === 'id' ? 'Tekanan' : 'Pressures'}:</span>
                            {log.stressors.map((sk) => (
                              <span key={sk} className="text-[9px] bg-slate-100 border border-slate-200 rounded px-1.5 text-slate-500">{translateStressorLabel(sk)}</span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-1 text-[9px] text-slate-400 font-mono mt-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{logDate}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 text-center">
              <span className="text-[10px] text-slate-300 tracking-wider flex items-center justify-center gap-1 select-none uppercase font-bold">
                <Shield className="w-3 h-3 text-slate-300" />
                <span>Comfort Log Shield Enabled</span>
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
