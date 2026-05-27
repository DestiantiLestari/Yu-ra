import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Heart, Compass, MessageSquare, BookOpen, 
  BarChart2, Award, Settings, UserCheck, Menu, X, 
  LogOut, Shield, ChevronLeft, ChevronRight, HelpCircle, 
  Leaf, User, Mail, ShieldAlert
} from 'lucide-react';

import { UserProfile, MoodEntry, JournalEntry } from './types';
import { INITIAL_MOOD_HISTORY, INITIAL_JOURNAL_ENTRIES } from './data';
import { useLanguage } from './context/LanguageContext';

import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import MoodTracker from './components/MoodTracker';
import AIAssistant from './components/AIAssistant';
import JournalSection from './components/JournalSection';
import HealingSpace from './components/HealingSpace';
import EmotionalAnalytics from './components/EmotionalAnalytics';
import PremiumSpace from './components/PremiumSpace';
import SettingsProfile from './components/SettingsProfile';

const DEFAULT_USER: UserProfile = {
  name: "Destia",
  email: "destiantilestari12@gmail.com",
  role: "student",
  isPremium: false,
  joinedAt: new Date().toISOString(),
  dailyChecklist: {
    breathe: false,
    journal: false,
    moodLog: true,
    hydrate: false,
    selfCare: true
  },
  stressChecklist: {
    feelingExhausted: false,
    frequentHeadaches: false,
    procrastination: false,
    isolation: false,
    sleepIssues: false
  },
  waterIntake: 3
};

export default function App() {
  const { language, setLanguage, t } = useLanguage();

  // Authentication & Navigation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('yuera_authenticated') === 'true';
  });
  const [authView, setAuthView] = useState<'signin' | 'signup' | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Mobile drawer trigger
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Persistent State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('yuera_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('yuera_moods');
    return saved ? JSON.parse(saved) : INITIAL_MOOD_HISTORY;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('yuera_journals');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
  });

  // Auth form manual variables
  const [authName, setAuthName] = useState('Destia');
  const [authEmail, setAuthEmail] = useState('destiantilestari12@gmail.com');
  const [authPassword, setAuthPassword] = useState('password');

  // Trigger Local Storage synchronization
  useEffect(() => {
    localStorage.setItem('yuera_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('yuera_moods', JSON.stringify(moodHistory));
  }, [moodHistory]);

  useEffect(() => {
    localStorage.setItem('yuera_journals', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('yuera_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Actions
  const handleAddMood = (entry: MoodEntry) => {
    setMoodHistory(prev => [entry, ...prev]);
    // Check-off the daily checkpoint for mood log
    setUser(prev => ({
      ...prev,
      dailyChecklist: {
        ...prev.dailyChecklist,
        moodLog: true
      }
    }));
  };

  const handleDeleteMood = (id: string) => {
    setMoodHistory(prev => prev.filter(m => m.id !== id));
  };

  const handleAddJournal = (entry: JournalEntry) => {
    setJournalEntries(prev => [entry, ...prev]);
    // Check-off daily checklist for journaling
    setUser(prev => ({
      ...prev,
      dailyChecklist: {
        ...prev.dailyChecklist,
        journal: true
      }
    }));
  };

  const handleDeleteJournal = (id: string) => {
    setJournalEntries(prev => prev.filter(j => j.id !== id));
  };

  const handleClearAllData = () => {
    localStorage.clear();
    setUser(DEFAULT_USER);
    setMoodHistory([]);
    setJournalEntries([]);
    setIsAuthenticated(false);
    setAuthView(null);
    setActiveTab('dashboard');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      email: authEmail,
      name: authName || prev.name
    }));
    setIsAuthenticated(true);
    setAuthView(null);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setAuthView(null);
    localStorage.removeItem('yuera_authenticated');
  };

  // Nav items configuration dynamically fetched for live translations
  const navigationItems = [
    { id: 'dashboard', label: t('common', 'dashboard'), icon: Compass },
    { id: 'mood', label: t('common', 'mood'), icon: Heart },
    { id: 'chat', label: t('common', 'chat'), icon: MessageSquare },
    { id: 'journal', label: t('common', 'journal'), icon: BookOpen },
    { id: 'healing', label: t('common', 'healing'), icon: Leaf },
    { id: 'analytics', label: t('common', 'analytics'), icon: BarChart2 },
    { id: 'premium', label: t('common', 'premium'), icon: Award },
    { id: 'settings', label: t('common', 'settings'), icon: Settings }
  ];

  // Renders the sub-view selection
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            onUpdateUser={setUser} 
            onNavigate={(view) => {
              setActiveTab(view);
              setMobileMenuOpen(false);
            }} 
            totalMoodLogs={moodHistory.length}
            totalJournalEntries={journalEntries.length}
          />
        );
      case 'mood':
        return (
          <MoodTracker 
            moodHistory={moodHistory} 
            onAddMood={handleAddMood}
            onDeleteMood={handleDeleteMood}
          />
        );
      case 'chat':
        return <AIAssistant user={user} />;
      case 'journal':
        return (
          <JournalSection 
            entries={journalEntries} 
            onAddEntry={handleAddJournal}
            onDeleteEntry={handleDeleteJournal}
          />
        );
      case 'healing':
        return <HealingSpace />;
      case 'analytics':
        return <EmotionalAnalytics moodHistory={moodHistory} />;
      case 'premium':
        return <PremiumSpace user={user} onUpdateUser={setUser} />;
      case 'settings':
        return (
          <SettingsProfile 
            user={user} 
            onUpdateUser={setUser} 
            onClearData={handleClearAllData}
          />
        );
      default:
        return <Dashboard user={user} onUpdateUser={setUser} onNavigate={setActiveTab} totalMoodLogs={moodHistory.length} totalJournalEntries={journalEntries.length} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FAF6F0] via-[#FAF1FA] to-[#FAF6F0] text-[#2D2529] font-sans antialiased">
      {!isAuthenticated ? (
        authView ? (
          // Beautiful interactive auth screen module
          <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#E9E3FF]/30 blur-3xl pointer-events-none float-slow animate-pulse" />
            <div className="absolute -bottom-45 -right-45 w-[500px] h-[500px] rounded-full bg-[#F3E8FF]/40 blur-3xl pointer-events-none float-delay" />

            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative z-10 animate-scale-in">
              {/* Back button */}
              <button 
                onClick={() => setAuthView(null)}
                className="absolute top-6 left-6 text-xs text-[#8C7A84] hover:text-[#2D2529] flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{t('common', 'return')}</span>
              </button>

              <div className="text-center space-y-2 mt-8 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-[#A47CB5] shadow-xs italic font-serif text-lg font-bold">Y</div>
                <h2 className="font-serif text-2xl font-semibold text-[#3F2B36]">
                  {authView === 'signin' 
                    ? (language === 'id' ? 'Selamat Datang Kembali' : 'Welcome Back') 
                    : (language === 'id' ? 'Gabung di Yuéra Sanctuary' : 'Join Yuera Sanctuary')
                  }
                </h2>
                <p className="text-xs text-[#8C7A84] font-light leading-relaxed">
                  {authView === 'signin' 
                    ? (language === 'id' ? 'Langkah masuk kembali ke dalam gelembung pribadi tenang Anda.' : 'Step back into your cozy, private bubble of quiet reflection.') 
                    : (language === 'id' ? 'Rawat kesehatan emosional Anda selama kuliah. Masuk dengan aman tanpa pelacak.' : 'Nurture your emotional self in University. Enter safely with zero trackers.')
                  }
                </p>
              </div>

              {/* Interactive simulated Authentication form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs text-left">
                {authView === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{t('settings', 'field_name')}</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya or Elena"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF6F0]/60 border border-slate-100 rounded-xl focus:bg-white focus:outline-none focus:border-purple-300"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{t('settings', 'field_email')}</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="destiantilestari12@gmail.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF6F0]/60 border border-stone-100 rounded-xl focus:bg-white focus:outline-none focus:border-purple-300 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>{language === 'id' ? 'Sandi Kunci Pengaman' : 'Comfort Lock Password'}</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF6F0]/60 border border-stone-100 rounded-xl focus:bg-white focus:outline-none focus:border-purple-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#3F2B36] hover:bg-[#523A48] text-white rounded-xl text-xs font-semibold shadow-xs hover:scale-[1.01] transition-all cursor-pointer mt-2"
                >
                  {authView === 'signin' 
                    ? (language === 'id' ? 'Verifikasi Kredensial Aman' : 'Verify Secure Credentials') 
                    : (language === 'id' ? 'Buka Sanctuary Ruang Aman Saya' : 'Open My Safe Space Sanctuary')
                  }
                </button>
              </form>

              {/* Demo auto bypass helper details */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setIsAuthenticated(true);
                    setAuthView(null);
                  }}
                  className="text-xs text-[#AA7BC3] font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'id' ? 'Masuk Cepat Demo Interaktif' : 'Interactive Quick demo Sign-In'}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 mt-6 text-center leading-relaxed font-light">
                {authView === 'signin' 
                  ? (language === 'id' ? 'Pertama kali di sini?' : 'First time here?') 
                  : (language === 'id' ? 'Sudah punya kunci sekuritas?' : 'Already have a secure key?')
                }
                <button
                  onClick={() => setAuthView(authView === 'signin' ? 'signup' : 'signin')}
                  className="text-[#9664B1] hover:underline ml-1 font-semibold cursor-pointer"
                >
                  {authView === 'signin' 
                    ? (language === 'id' ? 'Buat akun lokal baru' : 'Create a local account') 
                    : (language === 'id' ? 'Verifikasi login masuk' : 'Verify login key')
                  }
                </button>
              </p>
            </div>
          </div>
        ) : (
          <LandingPage onEnterApp={(isSignUp) => setAuthView(isSignUp ? 'signup' : 'signin')} />
        )
      ) : (
        // Full dashboard authenticated layout
        <div className="flex min-h-screen relative overflow-hidden">
          
          {/* Decorative ambient blurred nodes */}
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#E9E3FF]/30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#FAF0F8]/40 blur-3xl pointer-events-none" />

          {/* SIDEBAR - permanent on desktop (lg+), hidden on mobile */}
          <aside className="hidden lg:flex w-72 bg-white/70 backdrop-blur-xl border-r border-[#E9E3FF]/20 flex-col justify-between shrink-0 h-screen sticky top-0 z-20">
            <div className="p-6 space-y-7 flex-1 flex flex-col justify-between">
              
              <div className="space-y-6">
                {/* Brand Identity Header & Language Switcher */}
                <div className="flex items-center justify-between gap-2 border-b border-[#FAF6F0] pb-4">
                  <div className="flex items-center space-x-3 select-none">
                    <div className="w-9 h-9 rounded-full bg-[#D8B4FE] flex items-center justify-center shadow-xs">
                      <span className="font-serif text-base font-bold text-white italic">Y</span>
                    </div>
                    <div>
                      <span className="font-serif text-xl font-semibold tracking-wide text-[#3F2B36]">Yuéra</span>
                      <span className="text-[8px] uppercase tracking-widest font-bold text-[#AA7BC3] block leading-none">{t('common', 'appSubtitle')}</span>
                    </div>
                  </div>

                  {/* Tiny Elegant Language Selector Pills */}
                  <div className="flex items-center bg-[#FAF6F0] p-0.5 rounded-full border border-stone-200/50">
                    <button 
                      onClick={() => setLanguage('en')}
                      className={`text-[9px] font-semibold py-1 px-2 rounded-full transition-all duration-300 cursor-pointer ${language === 'en' ? 'bg-[#3F2B36] text-white shadow-3xs' : 'text-stone-400 hover:text-slate-800'}`}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => setLanguage('id')}
                      className={`text-[9px] font-semibold py-1 px-2 rounded-full transition-all duration-300 cursor-pointer ${language === 'id' ? 'bg-[#3f2b36] text-white shadow-3xs' : 'text-stone-400 hover:text-slate-800'}`}
                    >
                      ID
                    </button>
                  </div>
                </div>

                {/* Nav links */}
                <nav className="space-y-1.5 text-xs text-left">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full px-4 py-3 rounded-2xl flex items-center space-x-3.5 transition-all text-left cursor-pointer ${
                          active 
                            ? 'bg-[#3F2B36] text-[#FEFDFB] font-medium shadow-sm translate-x-1' 
                            : 'text-[#6B5A63] hover:bg-purple-50/50 hover:text-[#AA7BC3]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-pink-300' : 'text-[#8C7A84]'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom active profile info card */}
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-tr from-[#FAF6F0] to-[#FAF1FA] rounded-2xl border border-purple-50 flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-bl from-pink-300 via-purple-300 to-indigo-300 flex items-center justify-center text-white italic font-serif font-bold relative shadow-3xs">
                    {user.name.charAt(0)}
                    {user.isPremium && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border border-white flex items-center justify-center text-[8px] font-bold not-italic">★</span>
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate" title={user.name}>{user.name}</p>
                    {user.isPremium ? (
                      <span className="text-[9px] uppercase font-bold text-indigo-500 font-mono tracking-widest flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-indigo-400 fill-current" />
                        <span>{language === 'id' ? 'Lingkaran Ilahi' : 'Divine Premium'}</span>
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-widest block">{language === 'id' ? 'Pengguna Gratis' : 'Yuéra Free User'}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 border border-slate-200 hover:bg-slate-100 hover:text-rose-500 rounded-xl text-[11px] font-semibold text-slate-500 transition duration-300 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('common', 'lockSanctum')}</span>
                </button>
              </div>

            </div>
          </aside>

          {/* MOBILE NAVIGATION HEADER */}
          <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-md border-b border-purple-50 px-6 flex items-center justify-between z-30 shadow-2xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D8B4FE] flex items-center justify-center shadow-xs">
                <span className="font-serif text-sm font-bold text-white italic">Y</span>
              </div>
              <span className="font-serif text-lg font-semibold tracking-wide text-[#3F2B36]">Yuéra</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-xs text-purple-400 font-serif italic truncate max-w-[100px]">{user.name}</span>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 text-slate-600 hover:bg-purple-50 rounded"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* MOBILE SLIDE-OUT DRAWER */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-20 bg-slate-900/10 backdrop-blur-xs flex justify-end">
              <div className="w-72 bg-white h-screen p-6 flex flex-col justify-between pt-20 animate-slide-in shadow-2xl overflow-y-auto">
                <div className="space-y-6">
                  <nav className="space-y-1.5 text-xs text-left">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full px-4 py-3 rounded-2xl flex items-center space-x-3.5 transition-all text-left cursor-pointer ${
                            active 
                              ? 'bg-[#3F2B36] text-[#FEFDFB] font-semibold' 
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  {/* Mobile language selector */}
                  <div className="flex items-center space-x-1.5 bg-[#FAF6F0] p-1 rounded-xl border border-stone-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">{language === 'id' ? 'BAHASA' : 'LANG'}</span>
                    <button 
                      onClick={() => setLanguage('en')}
                      className={`text-[9px] font-semibold px-2.5 py-1 rounded-md transition-all ${language === 'en' ? 'bg-[#3F2B36] text-white shadow-3xs' : 'text-slate-500 bg-white/70'}`}
                    >
                      🇺🇸 EN
                    </button>
                    <button 
                      onClick={() => setLanguage('id')}
                      className={`text-[9px] font-semibold px-2.5 py-1 rounded-md transition-all ${language === 'id' ? 'bg-[#3F2B36] text-white shadow-3xs' : 'text-slate-500 bg-white/70'}`}
                    >
                      🇮🇩 ID
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-200 to-purple-300 flex items-center justify-center font-serif text-white italic font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                      <p className="text-[9px] text-[#AA7BC3] uppercase font-bold">{user.isPremium ? (language === 'id' ? 'Premium Ilahi' : 'Divine Premium') : (language === 'id' ? 'Sesi Gratis' : 'Free Sandbox')}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full py-2.5 border border-slate-100 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('common', 'lockPortal')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN PLATFORM DISPLAY PORT */}
          <main className="flex-1 min-h-screen pt-20 lg:pt-0 overflow-y-auto relative z-10 px-6 py-6 lg:px-12 lg:py-10 max-w-7xl mx-auto flex flex-col justify-between">
            {/* Dynamic tab contents load */}
            <div className="flex-1 pb-12">
              {renderTabContent()}
            </div>

            {/* Inner footer */}
            <footer className="text-center text-[10px] text-[#A4949C] shrink-0 pt-6 border-t border-[#E9E3FF]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-auto">
              <p>&copy; {new Date().getFullYear()} Yuéra Wellness Platform. {language === 'id' ? 'Dirawat dengan cinta persaudaraan.' : 'Grounded with sisterly love.'}</p>
              <div className="flex items-center justify-center space-x-4">
                <a href="#" className="hover:text-[#AA7BC3]">{t('common', 'privacyPolicy')}</a>
                <span>•</span>
                <a href="#" className="hover:text-[#AA7BC3]">{t('common', 'support')}</a>
              </div>
            </footer>
          </main>

        </div>
      )}
    </div>
  );
}
