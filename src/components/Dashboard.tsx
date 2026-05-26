import React, { useState } from 'react';
import { Sparkles, Calendar, Coffee, Droplet, CheckSquare, Compass, Brain, Quote, RefreshCw } from 'lucide-react';
import { UserProfile, Affirmation } from '../types';
import { AFFIRMATIONS } from '../data';

interface DashboardProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigate: (view: string) => void;
  totalMoodLogs: number;
  totalJournalEntries: number;
}

export default function Dashboard({ user, onUpdateUser, onNavigate, totalMoodLogs, totalJournalEntries }: DashboardProps) {
  const [currentAffi, setCurrentAffi] = useState<Affirmation>(
    AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]
  );
  
  const [showBurnoutCheck, setShowBurnoutCheck] = useState(false);

  const rotateAffirmation = () => {
    let next = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    while (next.id === currentAffi.id) {
      next = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    }
    setCurrentAffi(next);
  };

  const handleWaterDrink = () => {
    if (user.waterIntake < 12) {
      onUpdateUser({
        ...user,
        waterIntake: user.waterIntake + 1
      });
    }
  };

  const handleWaterReset = () => {
    onUpdateUser({
      ...user,
      waterIntake: 0
    });
  };

  const toggleChecklist = (key: keyof UserProfile['dailyChecklist']) => {
    onUpdateUser({
      ...user,
      dailyChecklist: {
        ...user.dailyChecklist,
        [key]: !user.dailyChecklist[key]
      }
    });
  };

  const toggleStressCheck = (key: keyof UserProfile['stressChecklist']) => {
    onUpdateUser({
      ...user,
      stressChecklist: {
        ...user.stressChecklist,
        [key]: !user.stressChecklist[key]
      }
    });
  };

  // Compute daily task progress percentage
  const checklistValues = Object.values(user.dailyChecklist);
  const completedTaskCount = checklistValues.filter(Boolean).length;
  const progressPercent = Math.round((completedTaskCount / checklistValues.length) * 100);

  // Analyze burnout indicators
  const stressValues = Object.values(user.stressChecklist);
  const stressPoints = stressValues.filter(Boolean).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-[#9F7BB8] uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Welcome Home, Sweet Soul</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#2D2529]">
            {user.name} <span className="italic font-light text-[#A47CB5]">of Yuéra</span>
          </h1>
          <p className="text-xs text-[#82717C] mt-1 font-light">
            Providing a gentle space to soothe {user.role === 'student' ? 'study pressures' : 'emotional overload'} today.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#6B5A63] bg-white/70 px-4 py-2.5 rounded-full border border-white/40 shadow-xs self-start md:self-auto">
          <Calendar className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Grid: Left column (Core wellness tools and habits), Right column (Checklists and Burnout triggers) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2 */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Aesthetic Affirmation Card */}
          <div className="bg-gradient-to-r from-[#FDFBF7] to-[#F1EAFA] p-8 rounded-[2rem] border border-white relative overflow-hidden shadow-xs flex flex-col justify-between min-h-[190px]">
            <div className="absolute right-4 top-4 text-[#E6DCF5] pointer-events-none">
              <Quote className="w-24 h-24 stroke-1 opacity-20" />
            </div>
            
            <div className="relative z-10">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B590CA] bg-white/90 px-3 py-1 rounded-full border border-purple-100 shadow-3xs">
                DAILY ANCHOR ({currentAffi.category})
              </span>
              <p className="font-serif text-xl italic font-light text-[#3A2534] leading-relaxed mt-4 max-w-lg">
                &ldquo;{currentAffi.text}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 border-t border-purple-50 pt-4 z-10">
              <button 
                onClick={rotateAffirmation}
                title="Rotate affirmation"
                className="p-2 bg-white/80 rounded-full border border-purple-100 hover:bg-white text-[#AA7BC3] transition-all duration-300 shadow-3xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-[#82717C] font-light">Draw a different daily affirmation to change your focus.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Interactive Hydration Widget */}
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Droplet className="w-4 h-4 text-sky-400 fill-current" />
                    <h3 className="font-serif text-lg font-medium text-[#2D2529]">Hydration Flow</h3>
                  </div>
                  <span className="text-xs font-mono font-medium text-sky-500 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">{user.waterIntake} / 8 Glasses</span>
                </div>
                <p className="text-xs text-[#82717C] font-light leading-relaxed mb-4">
                  Stress dehydrates the system. Sip slowly to settle anxiety and steady your body.
                </p>

                {/* Animated filling glass visualization */}
                <div className="w-full bg-slate-100 rounded-full h-3 mb-5 overflow-hidden flex border border-white">
                  <div 
                    className="bg-gradient-to-r from-sky-300 to-sky-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((user.waterIntake / 8) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleWaterDrink}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-sky-400/90 to-sky-500/90 hover:from-sky-500 hover:to-sky-600 text-white text-xs font-medium transition-all shadow-3xs hover:scale-[1.02] active:scale-[0.98]"
                >
                  Log Glass
                </button>
                <button
                  onClick={handleWaterReset}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
                  title="Reset count"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Quick Healing Space Invitation Card */}
            <div className="bg-gradient-to-br from-[#FAEDED] to-[#FFF6F6] p-6 rounded-3xl border border-rose-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-rose-400" />
                    <h3 className="font-serif text-lg font-medium text-[#2D2529]">Soothing Cocoon</h3>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-semibold text-rose-400 bg-white px-2 py-0.5 rounded-full border border-rose-100">Healing Zone</span>
                </div>
                <p className="text-xs text-[#8F747F] font-light leading-relaxed mb-4">
                  Chest feeling tight or mind racing? Synchronize your breath with our magical guide or listen to quiet forest streams.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[10px] bg-white/80 border border-rose-100 rounded-md px-2 py-0.5 text-rose-500">Breathing Bubble</span>
                  <span className="text-[10px] bg-white/80 border border-rose-100 rounded-md px-2 py-0.5 text-rose-500">Lo-Fi soundscapes</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('healing')}
                className="w-full py-2 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white text-xs font-medium transition-all shadow-3xs hover:scale-[1.02] active:scale-[0.98]"
              >
                Inhale Calm Now
              </button>
            </div>
          </div>

          {/* Quick Stats overview of the safe space */}
          <div className="bg-white/40 border border-white/60 p-6 rounded-3xl grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-serif font-light text-[#2D2529]">{totalMoodLogs}</p>
              <p className="text-[10px] text-[#8C7A84] uppercase tracking-wider font-semibold mt-1">Mood logs</p>
            </div>
            <div className="border-l border-r border-[#E9E3FF]/30">
              <p className="text-2xl font-serif font-light text-[#2D2529]">{totalJournalEntries}</p>
              <p className="text-[10px] text-[#8C7A84] uppercase tracking-wider font-semibold mt-1">Deep Journals</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-light text-sky-500">{user.waterIntake} / 8</p>
              <p className="text-[10px] text-[#8C7A84] uppercase tracking-wider font-semibold mt-1">Hydrations</p>
            </div>
          </div>

        </div>

        {/* Right Column: Daily checklist and Student Burnout warning deck */}
        <div className="space-y-8">
          
          {/* Daily Checklist Tracker widget */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-lg font-medium text-[#2D2529]">Daily Rituals</h3>
              <span className="text-xs font-mono text-[#aa84fc] bg-[#F5EDF8] px-2.5 py-0.5 rounded-full border border-purple-100 font-medium">{progressPercent}%</span>
            </div>
            <p className="text-xs text-[#82717C] font-light leading-relaxed mb-5">
              Nurture your emotional base. Small acts of check-ins solidify true mental peace over time.
            </p>

            <div className="space-y-3.5">
              <label className="flex items-center space-x-3 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] p-2.5 rounded-xl border border-white/40 cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={user.dailyChecklist.moodLog} 
                  onChange={() => toggleChecklist('moodLog')}
                  className="w-4 h-4 rounded text-[#A47CB5] focus:ring-[#A47CB5] accent-purple-400"
                />
                <div className="text-left">
                  <p className={`text-xs font-medium ${user.dailyChecklist.moodLog ? 'line-through text-slate-400' : 'text-slate-700'}`}>Check in with your mood</p>
                  <p className="text-[10px] text-slate-400">Track how your heart is feeling</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] p-2.5 rounded-xl border border-white/40 cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={user.dailyChecklist.journal} 
                  onChange={() => toggleChecklist('journal')}
                  className="w-4 h-4 rounded text-[#A47CB5] focus:ring-[#A47CB5] accent-purple-400"
                />
                <div className="text-left">
                  <p className={`text-xs font-medium ${user.dailyChecklist.journal ? 'line-through text-slate-400' : 'text-slate-700'}`}>Write in your digital journal</p>
                  <p className="text-[10px] text-slate-400">Put heavy weights onto quiet paper</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] p-2.5 rounded-xl border border-white/40 cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={user.dailyChecklist.breathe} 
                  onChange={() => toggleChecklist('breathe')}
                  className="w-4 h-4 rounded text-[#A47CB5] focus:ring-[#A47CB5] accent-purple-400"
                />
                <div className="text-left">
                  <p className={`text-xs font-medium ${user.dailyChecklist.breathe ? 'line-through text-slate-400' : 'text-slate-700'}`}>Focus on 6 breath inhales</p>
                  <p className="text-[10px] text-slate-400">Calm the amygdala</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] p-2.5 rounded-xl border border-white/40 cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={user.dailyChecklist.hydrate} 
                  onChange={() => toggleChecklist('hydrate')}
                  className="w-4 h-4 rounded text-[#A47CB5] focus:ring-[#A47CB5] accent-purple-400"
                />
                <div className="text-left">
                  <p className={`text-xs font-medium ${user.dailyChecklist.hydrate ? 'line-through text-slate-400' : 'text-slate-700'}`}>Log 8 full glasses of water</p>
                  <p className="text-[10px] text-slate-400">Physical refresh for mental fatigue</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] p-2.5 rounded-xl border border-white/40 cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={user.dailyChecklist.selfCare} 
                  onChange={() => toggleChecklist('selfCare')}
                  className="w-4 h-4 rounded text-[#A47CB5] focus:ring-[#A47CB5] accent-purple-400"
                />
                <div className="text-left">
                  <p className={`text-xs font-medium ${user.dailyChecklist.selfCare ? 'line-through text-slate-400' : 'text-slate-700'}`}>Dedicate 15m screen distancing</p>
                  <p className="text-[10px] text-slate-400">Quiet time for your beautiful eyes</p>
                </div>
              </label>
            </div>
          </div>

          {/* Student/Female Burnout Checklist Deck */}
          <div className="bg-[#FFFDFC] border border-[#F3E8FF] p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-[#A47CB5]" />
                <h3 className="font-serif text-base font-medium text-[#2D2529]">Burnout Checklist</h3>
              </div>
              <button 
                onClick={() => setShowBurnoutCheck(!showBurnoutCheck)}
                className="text-xs text-[#A47CB5] underline hover:text-[#C084FC] font-medium"
              >
                {showBurnoutCheck ? 'Collapse' : 'Assess'}
              </button>
            </div>
            
            <p className="text-xs text-[#82717C] font-light leading-relaxed">
              We frequently overlook exhaustion until we fully crash. Check indicators to find your internal warning points.
            </p>

            {/* Quick interactive expand checklist */}
            {showBurnoutCheck && (
              <div className="mt-4 space-y-3.5 pt-3 border-t border-[#F5EDF8] animate-fade-in">
                <p className="text-[11px] font-semibold text-[#8C7A84] uppercase tracking-wide">Select how you feel this week:</p>
                
                <div className="space-y-2.5">
                  <label className="flex items-start space-x-2.5 text-xs text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={user.stressChecklist.feelingExhausted} 
                      onChange={() => toggleStressCheck('feelingExhausted')}
                      className="mt-0.5 w-3.5 h-3.5 rounded text-purple-400 accent-purple-400"
                    />
                    <span className="font-light">Waking up tired even after 8 hours of sleep</span>
                  </label>

                  <label className="flex items-start space-x-2.5 text-xs text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={user.stressChecklist.frequentHeadaches} 
                      onChange={() => toggleStressCheck('frequentHeadaches')}
                      className="mt-0.5 w-3.5 h-3.5 rounded text-purple-400 accent-purple-400"
                    />
                    <span className="font-light">Frequent tension headaches or chest tightness</span>
                  </label>

                  <label className="flex items-start space-x-2.5 text-xs text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={user.stressChecklist.procrastination} 
                      onChange={() => toggleStressCheck('procrastination')}
                      className="mt-0.5 w-3.5 h-3.5 rounded text-purple-400 accent-purple-400"
                    />
                    <span className="font-light">Paralyzed by overthinking and delaying assignments</span>
                  </label>

                  <label className="flex items-start space-x-2.5 text-xs text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={user.stressChecklist.isolation} 
                      onChange={() => toggleStressCheck('isolation')}
                      className="mt-0.5 w-3.5 h-3.5 rounded text-purple-400 accent-purple-400"
                    />
                    <span className="font-light">Canceling calls and drawing back from support circles</span>
                  </label>

                  <label className="flex items-start space-x-2.5 text-xs text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={user.stressChecklist.sleepIssues} 
                      onChange={() => toggleStressCheck('sleepIssues')}
                      className="mt-0.5 w-3.5 h-3.5 rounded text-purple-400 accent-purple-400"
                    />
                    <span className="font-light">Trouble falling sleeping because your brain won't switch off</span>
                  </label>
                </div>

                <div className="bg-[#FAF6F0] p-3 rounded-2xl border border-white mt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Your Fatigue Point:</span>
                    <span>{stressPoints} / 5</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        stressPoints >= 4 ? 'bg-rose-400' : stressPoints >= 2 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${(stressPoints / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#8C7A84] mt-2 font-light">
                    {stressPoints >= 4 
                      ? "Critical burnout indicator. We strongly urge you to stop working tonight and use Aura chat to vent or log the pressure." 
                      : stressPoints >= 2 
                      ? "Gentle alert. Your system calls for soothing breathing breaks in between study blocks." 
                      : "Wonderful! Your system seems aligned. Keep logging regularly to anticipate pressures."
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
