import React, { useState } from 'react';
import { Sparkles, Calendar, Coffee, Droplet, CheckSquare, Compass, Brain, Quote, RefreshCw } from 'lucide-react';
import { UserProfile, Affirmation } from '../types';
import { AFFIRMATIONS } from '../data';
import { useLanguage } from '../context/LanguageContext';

interface DashboardProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigate: (view: string) => void;
  totalMoodLogs: number;
  totalJournalEntries: number;
}

export default function Dashboard({ user, onUpdateUser, onNavigate, totalMoodLogs, totalJournalEntries }: DashboardProps) {
  const { language, t } = useLanguage();

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

  // Real-time affirmation translation map
  const translateAffiText = (text: string) => {
    if (language !== 'id') return text;
    const mapObj: Record<string, string> = {
      "Your worth is not measured by your productivity. It is okay to rest.": "Harga dirimu tidak diukur dari produktivitasmu. Tidak apa-apa untuk beristirahat.",
      "I release the pressure to hold everything together. I am allowed to just be.": "Aku melepaskan tekanan untuk menahan segala hal sendirian. Aku diizinkan untuk sekadar menikmati hidup.",
      "I deserve the same gentle compassion that I so freely give to others.": "Aku layak mendapatkan kasih sayang lembut yang sama seperti yang aku berikan kepada orang lain.",
      "My growth isn't linear. Every small step, even a pause, is progress.": "Pertumbuhanku tidak berjalan lurus. Setiap langkah kecil, bahkan situasi jeda, adalah kemajuan.",
      "I stand securely in my intelligence. I call in wisdom, not perfection.": "Aku berdiri teguh dalam kecerdasanku. Aku menyelaraskan kebijaksanaan, bukan kesempurnaan.",
      "Exams and grades do not define the brilliant light inside of me.": "Ujian dan nilai tidak menentukan cahaya cemerlang yang ada di dalam diriku.",
      "I am breathing in peace, and breathing out the need to controls everything.": "Aku menghirup kedamaian, dan menghembuskan kebutuhan untuk mengendalikan segala sesuatu.",
      "My heart is beautiful, my mind is resilient, and I am safely held.": "Hatiku indah, pikiranku tangguh, dan aku dilindungi dengan aman.",
      "It's safe to say no. Protecting my energy is an act of deep reverence.": "Sangat aman untuk berkata tidak. Melindungi energiku adalah tindakan penghormatan yang mendalam.",
      "I am healing from expectations. I bloom beautifully in my own time.": "Aku sedang pulih dari berbagai ekspektasi. Aku akan mekar dengan indah pada waktuku sendiri."
    };
    return mapObj[text] || text;
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#2D2529]">
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-[#9F7BB8] uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{t('dashboard', 'tag')}</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#2D2529]">
            {user.name} <span className="italic font-light text-[#A47CB5]">{t('dashboard', 'welcome')}</span>
          </h1>
          <p className="text-xs text-[#82717C] mt-1 font-light">
            {t('dashboard', 'sub_greeting', {
              focus: user.role === 'student' 
                ? t('common', 'studyPressures') 
                : (user.role === 'professional' ? t('common', 'emotionalOverload') : t('common', 'other'))
            })}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#6B5A63] bg-white/70 px-4 py-2.5 rounded-full border border-white/40 shadow-xs self-start md:self-auto select-none">
          <Calendar className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>{new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Grid */}
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
                {t('dashboard', 'daily_anchor')} ({currentAffi.category})
              </span>
              <p className="font-serif text-xl italic font-light text-[#3A2534] leading-relaxed mt-4 max-w-lg">
                &ldquo;{translateAffiText(currentAffi.text)}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 border-t border-purple-50 pt-4 z-10">
              <button 
                onClick={rotateAffirmation}
                title="Rotate affirmation"
                className="p-2 bg-white/80 rounded-full border border-purple-100 hover:bg-white text-[#AA7BC3] transition-all duration-300 shadow-3xs hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-[#82717C] font-light">{t('dashboard', 'draw_different')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Interactive Hydration Widget */}
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Droplet className="w-4 h-4 text-sky-400 fill-current" />
                    <h3 className="font-serif text-lg font-medium text-[#2D2529]">{t('dashboard', 'hydration_title')}</h3>
                  </div>
                  <span className="text-xs font-mono font-medium text-sky-500 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">{user.waterIntake} / 8 {t('dashboard', 'glasses')}</span>
                </div>
                <p className="text-xs text-[#82717C] font-light leading-relaxed mb-4">
                  {t('dashboard', 'hydration_desc')}
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
                  className="flex-1 py-3 sm:py-2 rounded-xl bg-gradient-to-r from-sky-400/90 to-sky-500/90 hover:from-sky-500 hover:to-sky-600 text-white text-xs sm:text-[11px] font-semibold transition-all shadow-3xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  {t('dashboard', 'log_glass')}
                </button>
                <button
                  onClick={handleWaterReset}
                  className="p-3 sm:p-2 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
                  title="Reset count"
                >
                  {t('dashboard', 'reset')}
                </button>
              </div>
            </div>

            {/* Quick Healing Space Invitation Card */}
            <div className="bg-gradient-to-br from-[#FAEDED] to-[#FFF6F6] p-6 rounded-3xl border border-rose-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-rose-400" />
                    <h3 className="font-serif text-lg font-medium text-[#2D2529]">{t('dashboard', 'cocoon_title')}</h3>
                  </div>
                  <span className="text-xs sm:text-[9px] uppercase tracking-widest font-bold text-rose-400 bg-white px-2.5 py-1 rounded-full border border-rose-100">{t('dashboard', 'cocoon_tag')}</span>
                </div>
                <p className="text-sm sm:text-xs text-[#8F747F] font-light leading-relaxed mb-4">
                  {t('dashboard', 'cocoon_desc')}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-[11px] sm:text-[10px] bg-white/80 border border-rose-100 rounded-md px-2.5 py-1 text-rose-500 font-medium">{t('dashboard', 'cocoon_bubble')}</span>
                  <span className="text-[11px] sm:text-[10px] bg-white/80 border border-rose-100 rounded-md px-2.5 py-1 text-rose-500 font-medium">{t('dashboard', 'cocoon_lofi')}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('healing')}
                className="w-full py-3 sm:py-2.5 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white text-sm sm:text-xs font-semibold transition-all shadow-3xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer min-h-[44px] flex items-center justify-center"
              >
                {t('dashboard', 'cocoon_btn')}
              </button>
            </div>
          </div>

          {/* Quick Stats overview */}
          <div className="bg-white/40 border border-white/60 p-6 rounded-3xl grid grid-cols-3 gap-4 text-center select-none">
            <div>
              <p className="text-2xl font-serif font-light text-[#2D2529]">{totalMoodLogs}</p>
              <p className="text-xs sm:text-[10px] text-[#8C7A84] uppercase tracking-wider font-semibold mt-1">{t('dashboard', 'mood_logs_stat')}</p>
            </div>
            <div className="border-l border-r border-[#E9E3FF]/30">
              <p className="text-2xl font-serif font-light text-[#2D2529]">{totalJournalEntries}</p>
              <p className="text-xs sm:text-[10px] text-[#8C7A84] uppercase tracking-wider font-semibold mt-1">{t('dashboard', 'deep_journals_stat')}</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-light text-sky-500">{user.waterIntake} / 8</p>
              <p className="text-xs sm:text-[10px] text-[#8C7A84] uppercase tracking-wider font-semibold mt-1">{t('dashboard', 'hydrations_stat')}</p>
            </div>
          </div>

        </div>

        {/* Right Column: Daily checklist */}
        <div className="space-y-8">
          
          {/* Daily Checklist Tracker widget */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-lg font-medium text-[#2D2529]">{t('dashboard', 'rituals_title')}</h3>
              <span className="text-xs font-mono text-[#aa84fc] bg-[#F5EDF8] px-2.5 py-0.5 rounded-full border border-purple-100 font-medium">{progressPercent}%</span>
            </div>
            <p className="text-sm sm:text-xs text-[#82717C] font-light leading-relaxed mb-5">
              {t('dashboard', 'rituals_desc')}
            </p>

            <div className="space-y-3.5 text-left">
              <label className="flex items-center space-x-3 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] p-3.5 sm:p-2.5 rounded-xl border border-white/40 cursor-pointer transition-colors min-h-[48px]">
                <input 
                  type="checkbox" 
                  checked={user.dailyChecklist.moodLog} 
                  onChange={() => toggleChecklist('moodLog')}
                  className="w-5 h-5 sm:w-4 sm:h-4 rounded text-[#A47CB5] focus:ring-[#A47CB5] accent-purple-400"
                />
                <div className="text-left flex-1">
                  <p className={`text-sm sm:text-xs font-semibold ${user.dailyChecklist.moodLog ? 'line-through text-slate-400' : 'text-slate-700'}`}>{t('dashboard', 'ritual_mood')}</p>
                  <p className="text-xs sm:text-[10px] text-slate-400">{t('dashboard', 'ritual_mood_sub')}</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] p-3.5 sm:p-2.5 rounded-xl border border-white/40 cursor-pointer transition-colors min-h-[48px]">
                <input 
                  type="checkbox" 
                  checked={user.dailyChecklist.journal} 
                  onChange={() => toggleChecklist('journal')}
                  className="w-5 h-5 sm:w-4 sm:h-4 rounded text-[#A47CB5] focus:ring-[#A47CB5] accent-purple-400"
                />
                <div className="text-left flex-1">
                  <p className={`text-sm sm:text-xs font-semibold ${user.dailyChecklist.journal ? 'line-through text-slate-400' : 'text-slate-700'}`}>{t('dashboard', 'ritual_journal')}</p>
                  <p className="text-xs sm:text-[10px] text-slate-400">{t('dashboard', 'ritual_journal_sub')}</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] p-3.5 sm:p-2.5 rounded-xl border border-white/40 cursor-pointer transition-colors min-h-[48px]">
                <input 
                  type="checkbox" 
                  checked={user.dailyChecklist.breathe} 
                  onChange={() => toggleChecklist('breathe')}
                  className="w-5 h-5 sm:w-4 sm:h-4 rounded text-[#A47CB5] focus:ring-[#A47CB5] accent-purple-400"
                />
                <div className="text-left flex-1">
                  <p className={`text-sm sm:text-xs font-semibold ${user.dailyChecklist.breathe ? 'line-through text-slate-400' : 'text-slate-700'}`}>{t('dashboard', 'ritual_breath')}</p>
                  <p className="text-xs sm:text-[10px] text-slate-400">{t('dashboard', 'ritual_breath_sub')}</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] p-3.5 sm:p-2.5 rounded-xl border border-white/40 cursor-pointer transition-colors min-h-[48px]">
                <input 
                  type="checkbox" 
                  checked={user.dailyChecklist.hydrate} 
                  onChange={() => toggleChecklist('hydrate')}
                  className="w-5 h-5 sm:w-4 sm:h-4 rounded text-[#A47CB5] focus:ring-[#A47CB5] accent-purple-400"
                />
                <div className="text-left flex-1">
                  <p className={`text-sm sm:text-xs font-semibold ${user.dailyChecklist.hydrate ? 'line-through text-slate-400' : 'text-slate-700'}`}>{t('dashboard', 'ritual_hydrate')}</p>
                  <p className="text-xs sm:text-[10px] text-slate-400">{t('dashboard', 'ritual_hydrate_sub')}</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] p-3.5 sm:p-2.5 rounded-xl border border-white/40 cursor-pointer transition-colors min-h-[48px]">
                <input 
                  type="checkbox" 
                  checked={user.dailyChecklist.selfCare} 
                  onChange={() => toggleChecklist('selfCare')}
                  className="w-5 h-5 sm:w-4 sm:h-4 rounded text-[#A47CB5] focus:ring-[#A47CB5] accent-purple-400"
                />
                <div className="text-left flex-1">
                  <p className={`text-sm sm:text-xs font-semibold ${user.dailyChecklist.selfCare ? 'line-through text-slate-400' : 'text-slate-700'}`}>{t('dashboard', 'ritual_selfcare')}</p>
                  <p className="text-xs sm:text-[10px] text-slate-400">{t('dashboard', 'ritual_selfcare_sub')}</p>
                </div>
              </label>
            </div>
          </div>

          {/* Student/Female Burnout Checklist Deck */}
          <div className="bg-[#FFFDFC] border border-[#F3E8FF] p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-[#A47CB5]" />
                <h3 className="font-serif text-base font-medium text-[#2D2529]">{t('dashboard', 'burnout_title')}</h3>
              </div>
              <button 
                onClick={() => setShowBurnoutCheck(!showBurnoutCheck)}
                className="text-xs text-[#A47CB5] underline hover:text-[#C084FC] font-medium cursor-pointer"
              >
                {showBurnoutCheck ? t('dashboard', 'collapse') : t('dashboard', 'assess')}
              </button>
            </div>
            
            <p className="text-xs text-[#82717C] font-light leading-relaxed">
              {t('dashboard', 'burnout_desc')}
            </p>

            {/* Quick interactive expand checklist */}
            {showBurnoutCheck && (
              <div className="mt-4 space-y-3.5 pt-3 border-t border-[#F5EDF8] animate-fade-in text-left font-sans">
                <p className="text-xs sm:text-[11px] font-bold text-[#8C7A84] uppercase tracking-wide">{t('dashboard', 'select_stressors')}</p>
                
                <div className="space-y-2.5">
                  <label className="flex items-center space-x-3 text-sm sm:text-xs text-slate-700 cursor-pointer p-3 sm:p-2 bg-slate-50/50 rounded-xl border border-stone-100 hover:bg-slate-50 min-h-[44px]">
                    <input 
                      type="checkbox" 
                      checked={user.stressChecklist.feelingExhausted} 
                      onChange={() => toggleStressCheck('feelingExhausted')}
                      className="w-5 h-5 sm:w-4 sm:h-4 rounded text-purple-400 accent-purple-400"
                    />
                    <span className="font-medium text-slate-700">{t('dashboard', 'stressor_exhausted')}</span>
                  </label>

                  <label className="flex items-center space-x-3 text-sm sm:text-xs text-slate-700 cursor-pointer p-3 sm:p-2 bg-slate-50/50 rounded-xl border border-stone-100 hover:bg-slate-50 min-h-[44px]">
                    <input 
                      type="checkbox" 
                      checked={user.stressChecklist.frequentHeadaches} 
                      onChange={() => toggleStressCheck('frequentHeadaches')}
                      className="w-5 h-5 sm:w-4 sm:h-4 rounded text-purple-400 accent-purple-400"
                    />
                    <span className="font-medium text-slate-700">{t('dashboard', 'stressor_headaches')}</span>
                  </label>

                  <label className="flex items-center space-x-3 text-sm sm:text-xs text-slate-700 cursor-pointer p-3 sm:p-2 bg-slate-50/50 rounded-xl border border-stone-100 hover:bg-slate-50 min-h-[44px]">
                    <input 
                      type="checkbox" 
                      checked={user.stressChecklist.procrastination} 
                      onChange={() => toggleStressCheck('procrastination')}
                      className="w-5 h-5 sm:w-4 sm:h-4 rounded text-purple-400 accent-purple-400"
                    />
                    <span className="font-medium text-slate-700">{t('dashboard', 'stressor_procrastination')}</span>
                  </label>

                  <label className="flex items-center space-x-3 text-sm sm:text-xs text-slate-700 cursor-pointer p-3 sm:p-2 bg-slate-50/50 rounded-xl border border-stone-100 hover:bg-slate-50 min-h-[44px]">
                    <input 
                      type="checkbox" 
                      checked={user.stressChecklist.isolation} 
                      onChange={() => toggleStressCheck('isolation')}
                      className="w-5 h-5 sm:w-4 sm:h-4 rounded text-purple-400 accent-purple-400"
                    />
                    <span className="font-medium text-slate-700">{t('dashboard', 'stressor_isolation')}</span>
                  </label>

                  <label className="flex items-center space-x-3 text-sm sm:text-xs text-slate-700 cursor-pointer p-3 sm:p-2 bg-slate-50/50 rounded-xl border border-stone-100 hover:bg-slate-50 min-h-[44px]">
                    <input 
                      type="checkbox" 
                      checked={user.stressChecklist.sleepIssues} 
                      onChange={() => toggleStressCheck('sleepIssues')}
                      className="w-5 h-5 sm:w-4 sm:h-4 rounded text-purple-400 accent-purple-400"
                    />
                    <span className="font-medium text-slate-700">{t('dashboard', 'stressor_sleep')}</span>
                  </label>
                </div>

                <div className="bg-[#FAF6F0] p-3 rounded-2xl border border-white mt-1">
                  <div className="flex items-center justify-between text-xs sm:text-[11px] font-semibold text-slate-600 mb-1">
                    <span>{t('dashboard', 'fatigue_point')}:</span>
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
                  <p className="text-[10px] text-[#8C7A84] mt-2 font-light leading-relaxed">
                    {stressPoints >= 4 
                      ? t('dashboard', 'analysis_critical') 
                      : (stressPoints >= 2 ? t('dashboard', 'analysis_amber') : t('dashboard', 'analysis_normal'))
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
