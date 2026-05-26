import React, { useState } from 'react';
import { Calendar, Smile, ShieldAlert, Heart, Trash2, HelpCircle, Save, Plus } from 'lucide-react';
import { MoodEntry, MoodType } from '../types';

interface MoodTrackerProps {
  moodHistory: MoodEntry[];
  onAddMood: (entry: MoodEntry) => void;
  onDeleteMood: (id: string) => void;
}

const MOOD_EMOJIS: Record<MoodType, { char: string; label: string; color: string; desc: string }> = {
  anxious: { char: '🥺', label: 'Anxious', color: 'bg-[#FFF0F2] text-rose-500 border-rose-200', desc: 'Heart racing, fluttery' },
  overthinking: { char: '😵‍💫', label: 'Overthinking', color: 'bg-[#F2F0FF] text-indigo-500 border-indigo-200', desc: 'Mind is zooming' },
  burnt_out: { char: '🥀', label: 'Burnt Out', color: 'bg-[#FFF9EE] text-amber-600 border-amber-200', desc: 'Tired, depleted energy' },
  sad: { char: '☁️', label: 'Sad', color: 'bg-[#F0F6FF] text-sky-500 border-sky-200', desc: 'Low, rainy day feelings' },
  peaceful: { char: '🍵', label: 'Peaceful', color: 'bg-[#F3FAF0] text-emerald-600 border-emerald-200', desc: 'Centered, quiet body' },
  joyful: { char: '🌸', label: 'Joyful', color: 'bg-[#FFF0F8] text-pink-500 border-pink-200', desc: 'Bright, lighter steps' }
};

const STRESSOR_OPTIONS = [
  'Exams & Projects',
  'Internship & Career',
  'Dorm/Family Issues',
  'Body Image',
  'Friendships Tension',
  'Social Media Exhaustion',
  'Sleep Shortage',
  'Financial Pressure'
];

export default function MoodTracker({ moodHistory, onAddMood, onDeleteMood }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType>('peaceful');
  const [score, setScore] = useState<number>(4); // 1-5
  const [notes, setNotes] = useState<string>('');
  const [selectedStressors, setSelectedStressors] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState(false);

  const toggleStressor = (tag: string) => {
    if (selectedStressors.includes(tag)) {
      setSelectedStressors(selectedStressors.filter(t => t !== tag));
    } else {
      setSelectedStressors([...selectedStressors, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: MoodEntry = {
      id: 'm_' + Date.now(),
      score,
      mood: selectedMood,
      notes,
      timestamp: new Date().toISOString(),
      stressors: selectedStressors
    };
    onAddMood(newEntry);
    
    // Reset form
    setNotes('');
    setSelectedStressors([]);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Tracker Hero Title */}
      <div className="bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md">
        <h2 className="font-serif text-2xl font-semibold text-[#2D2529]">Emotional Path Logger</h2>
        <p className="text-xs text-[#82717C] mt-1 font-light">
          Charting the rising and falling tides of your energy. Remember: all feelings are welcome teachers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Side Logger Form (Spans 3 Columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs space-y-6">
          
          {/* Step 1: Mood Type */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8C7A84] block">
              1. What is the key color of your mood right now?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(MOOD_EMOJIS) as MoodType[]).map((mKey) => {
                const item = MOOD_EMOJIS[mKey];
                const active = selectedMood === mKey;
                return (
                  <button
                    key={mKey}
                    type="button"
                    onClick={() => {
                      setSelectedMood(mKey);
                      // Auto pick sensitive defaults for scores
                      if (mKey === 'joyful') setScore(5);
                      else if (mKey === 'peaceful') setScore(4);
                      else if (mKey === 'sad') setScore(2);
                      else if (mKey === 'burnt_out') setScore(2);
                      else if (mKey === 'anxious') setScore(2);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative flex items-center space-x-3 cursor-pointer select-none ${
                      active 
                        ? `${item.color} shadow-xs scale-102 border-current font-semibold` 
                        : 'bg-white/80 border-slate-100 text-slate-600 hover:bg-white hover:border-purple-200'
                    }`}
                  >
                    <span className="text-2xl">{item.char}</span>
                    <div className="min-w-0">
                      <p className="text-xs truncate">{item.label}</p>
                      <p className="text-[9px] text-slate-400 truncate leading-tight font-light">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Feeling Intensity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8C7A84]">
                2. Sensation Level
              </label>
              <span className="text-xs text-[#AA7BC3] font-semibold">{score} / 5 ({score >= 4 ? 'Light, Calm' : score === 3 ? 'Uncomfortable' : 'Heavy, Tight'})</span>
            </div>
            <div className="flex items-center space-x-3 bg-[#FAF6F0]/60 p-3 rounded-2xl border border-white">
              <span className="text-xs text-[#8C7A84] font-medium font-mono">1 (Heavy)</span>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="flex-1 accent-purple-400 tracking-wider h-1"
              />
              <span className="text-xs text-[#8C7A84] font-medium font-mono">5 (Sunny/Balanced)</span>
            </div>
          </div>

          {/* Step 3: Emotional Triggers / Pressure contributors */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8C7A84]">
              3. Is there a specific pressure channel pulling your energy? (Select all)
            </label>
            <div className="flex flex-wrap gap-2">
              {STRESSOR_OPTIONS.map((tag) => {
                const added = selectedStressors.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleStressor(tag)}
                    className={`text-xs px-3.5 py-2 rounded-full border transition-all duration-300 cursor-pointer ${
                      added 
                        ? 'bg-[#AA7BC3] border-[#AA7BC3] text-white shadow-3xs hover:bg-[#9769B0]' 
                        : 'bg-white/80 border-slate-100 text-slate-600 hover:border-purple-200 hover:bg-white'
                    }`}
                  >
                    {added && <span className="mr-1">✓</span>}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Sincere Notes */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8C7A84] block">
              4. Whispers of the heart (Notes)
            </label>
            <textarea
              placeholder="Dump whatever overthinking patterns or small wins occur in your system..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-4 rounded-2xl border border-slate-100 bg-white/90 focus:outline-[#C084FC] transition-all placeholder-slate-400 text-slate-700 leading-relaxed"
            />
          </div>

          {/* Button Submit and confirmation */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100">
            {successMsg ? (
              <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5 animate-pulse">
                <span>✓ Verified & saved into your calming path index.</span>
              </p>
            ) : (
              <p className="text-xs text-[#8C7A84] font-light">Your history is held private in your local deck.</p>
            )}
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#3F2B36] hover:bg-[#523A48] text-white text-xs font-medium shadow-sm transition-all duration-300 flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Commit Entry</span>
            </button>
          </div>

        </form>

        {/* Right Side: Log History List (Spans 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs flex flex-col h-full max-h-[660px]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FAF6F0]">
              <h3 className="font-serif text-lg font-medium text-[#2D2529]">Chronicle of Tides</h3>
              <span className="text-[10px] bg-[#FAF6F0] border border-slate-200 px-2.5 py-0.5 rounded-full font-semibold uppercase text-slate-500 font-mono">
                {moodHistory.length} logs
              </span>
            </div>

            {moodHistory.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <Smile className="w-12 h-12 stroke-1 mb-3 text-slate-300" />
                <p className="text-xs">Your chronicle is clean. Log your initial mood on the left to start charting.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                {moodHistory.map((log) => {
                  const emojiObj = MOOD_EMOJIS[log.mood] || { char: '🌸', label: log.mood, color: 'bg-white', desc: '' };
                  return (
                    <div 
                      key={log.id} 
                      className="p-4 rounded-2xl bg-white/70 border border-slate-100 hover:border-purple-200 transition-all flex flex-col justify-between space-y-3 relative group"
                    >
                      {/* Trash action */}
                      <button
                        onClick={() => onDeleteMood(log.id)}
                        className="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all absolute top-4 right-4 p-1.5 rounded-md hover:bg-slate-50 bg-white border border-slate-100"
                        title="Delete log permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center space-x-3">
                        <span className="text-3xl bg-white/80 p-1.5 rounded-xl border border-slate-50">{emojiObj.char}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-semibold text-slate-700">{emojiObj.label}</h4>
                            <span className="text-[10px] text-purple-400 font-bold bg-[#FAF6F0] px-2 py-0.2 rounded-full font-mono">{log.score} / 5</span>
                          </div>
                          <p className="text-[10px] text-slate-400 flex items-center space-x-1 font-mono mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </p>
                        </div>
                      </div>

                      {log.notes && (
                        <p className="text-xs text-slate-600 font-light italic leading-relaxed pl-1">
                          &ldquo;{log.notes}&rdquo;
                        </p>
                      )}

                      {log.stressors.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                          {log.stressors.map(st => (
                            <span key={st} className="text-[9px] bg-indigo-50/50 text-indigo-500 rounded-md py-0.5 px-2 border border-indigo-100">
                              {st}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
