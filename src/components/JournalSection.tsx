import React, { useState } from 'react';
import { Search, Lock, Unlock, Trash2, Edit3, Compass, Calendar, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { JournalEntry } from '../types';
import { JOURNAL_PROMPTS } from '../data';
import { useLanguage } from '../context/LanguageContext';

interface JournalSectionProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export default function JournalSection({ entries, onAddEntry, onDeleteEntry }: JournalSectionProps) {
  const { t, language } = useLanguage();

  // Navigation & Sorters state
  const [activeCategory, setActiveCategory] = useState<'All' | JournalEntry['category']>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<JournalEntry['category']>('General');
  const [isPrivateInput, setIsPrivateInput] = useState(false);
  const [pinInput, setPinInput] = useState('1111');

  // Random Prompt state
  const [currentPrompt, setCurrentPrompt] = useState(JOURNAL_PROMPTS[0]);

  // Private Lock State
  const [lockedItemToUnlock, setLockedItemToUnlock] = useState<JournalEntry | null>(null);
  const [inputPinCode, setInputPinCode] = useState('');
  const [unlockedEntries, setUnlockedEntries] = useState<string[]>([]); // list of entry IDs unlocked in this session
  const [pinError, setPinError] = useState(false);

  const rotatePrompt = () => {
    let nextIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length);
    while (JOURNAL_PROMPTS[nextIndex].prompt === currentPrompt.prompt) {
      nextIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length);
    }
    setCurrentPrompt(JOURNAL_PROMPTS[nextIndex]);
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const entry: JournalEntry = {
      id: 'j_' + Date.now(),
      title: newTitle,
      content: newContent,
      timestamp: new Date().toISOString(),
      category: newCategory,
      isPrivate: isPrivateInput,
      pinCode: isPrivateInput ? pinInput : undefined
    };

    onAddEntry(entry);

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setIsPrivateInput(false);
    setPinInput('1111');
    setShowAddForm(false);
  };

  const handleUnlockAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockedItemToUnlock) return;

    if (inputPinCode === (lockedItemToUnlock.pinCode || '1111')) {
      // Unlocked successfully! Add to session list
      setUnlockedEntries([...unlockedEntries, lockedItemToUnlock.id]);
      setLockedItemToUnlock(null);
      setInputPinCode('');
      setPinError(false);
    } else {
      setPinError(true);
      setInputPinCode('');
    }
  };

  const handleQuickPromptClick = () => {
    const localizedCat = t('journal', 'cat_' + currentPrompt.category);
    setNewTitle(`${language === 'id' ? 'Refleksi' : 'Reflection'}: ${localizedCat}`);
    setNewContent(`⭐ ${language === 'id' ? 'Pertanyaan Panduan' : 'Prompt question'}: ${currentPrompt.translations?.[language] || currentPrompt.prompt}\n\n${language === 'id' ? 'Refleksi tenang saya:' : 'My quiet reflection:'}\n`);
    setNewCategory(currentPrompt.category as any);
    setShowAddForm(true);
  };

  // Filter list
  const filteredEntries = entries.filter((e) => {
    const matchesCat = activeCategory === 'All' || e.category === activeCategory;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 relative">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md text-left">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#2D2529]">{t('journal', 'title')}</h2>
          <p className="text-xs text-[#82717C] mt-1 font-light">
            {t('journal', 'desc')}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-3 rounded-full bg-[#3F2B36] hover:bg-[#523A48] text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5 self-start md:self-auto cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{t('journal', 'new_entry')}</span>
        </button>
      </div>

      {/* Interactive Helper Prompt Card */}
      <div className="bg-[#FAF6F0] border border-[#F3E8FF] p-6 rounded-3xl relative overflow-hidden shadow-2xs text-left">
        <div className="absolute right-4 top-4 text-purple-200 pointer-events-none">
          <Compass className="w-16 h-16 opacity-35" />
        </div>
        
        <div>
          <span className="text-[10px] font-bold tracking-widest bg-purple-100 text-[#AA7BC3] px-2.5 py-0.5 rounded-full border border-purple-200">
            {t('journal', 'prompt_label')} ({t('journal', 'cat_' + currentPrompt.category)})
          </span>
          <p className="text-xs text-slate-700 italic mt-3 font-light leading-relaxed max-w-2xl">
            &ldquo;{currentPrompt.translations?.[language] || currentPrompt.prompt}&ldquo;
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-5 pt-3.5 border-t border-purple-50">
          <button
            onClick={handleQuickPromptClick}
            className="text-[11px] font-semibold bg-[#AA7BC3] hover:bg-[#9769B0] text-white px-4 py-2 rounded-xl shadow-3xs transition-all duration-300 flex items-center space-x-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>{t('journal', 'draw_prompt')}</span>
          </button>
          
          <button
            onClick={rotatePrompt}
            className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer bg-transparent border-0"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span>{language === 'id' ? 'Ganti Pertanyaan' : 'Give me another'}</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs text-left">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder={t('journal', 'search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-3 bg-white/70 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#C084FC] focus:bg-white text-slate-700 transition-all placeholder-slate-400"
          />
        </div>

        {/* Categories filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2 max-w-full font-sans scrollbar-none">
          {['All', 'Overthinking', 'Burnout', 'Self-Love', 'Gratitude', 'Deep Thoughts', 'General'].map((cat) => {
            const active = activeCategory === cat;
            const label = cat === 'All' 
              ? (language === 'id' ? 'Semua' : 'All')
              : t('journal', 'cat_' + cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`text-sm sm:text-xs px-5 py-3 sm:px-3.5 sm:py-2.5 rounded-full border transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
                  active 
                    ? 'bg-[#3F2B36] text-[#FEFDFB] border-[#3F2B36] font-semibold shadow-xs' 
                    : 'bg-white/80 border-slate-150 text-slate-705 hover:border-purple-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main journal list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {filteredEntries.length === 0 ? (
          <div className="md:col-span-2 text-center p-16 bg-white/70 border border-white/60 rounded-3xl flex flex-col items-center justify-center text-slate-400">
            <Edit3 className="w-12 h-12 stroke-1 mb-3 text-slate-300" />
            <p className="text-xs">{t('journal', 'no_entries')}</p>
          </div>
        ) : (
          filteredEntries.map((e) => {
            const isLocked = e.isPrivate && !unlockedEntries.includes(e.id);
            return (
              <div 
                key={e.id}
                className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 hover:shadow-sm transition-all duration-300 relative group"
              >
                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-pink-500 bg-pink-50 p-1 px-2.5 border border-pink-100 rounded-full">
                      {t('journal', 'cat_' + e.category)}
                    </span>
                    <button
                      onClick={() => onDeleteEntry(e.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all p-1"
                      title={language === 'id' ? 'Hapus catatan rahasia' : 'Erase journal entry'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-slate-800 mt-3 flex items-center space-x-1.5">
                    {e.isPrivate && (
                      isLocked ? (
                        <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <Unlock className="w-4 h-4 text-emerald-400 shrink-0" />
                      )
                    )}
                    <span className="truncate">{e.title}</span>
                  </h3>
                  
                  <p className="text-[10px] text-slate-400 flex items-center space-x-1 font-mono mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(e.timestamp).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </p>
                </div>

                {/* Content body */}
                {isLocked ? (
                  <div className="bg-[#FAF6F0] border border-dashed border-purple-200 p-5 rounded-2xl text-center space-y-3">
                    <Lock className="w-6 h-6 text-[#AA7BC3] mx-auto animate-pulse" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700">{t('journal', 'pin_protected')}</p>
                      <p className="text-[10px] text-slate-400">{language === 'id' ? 'Terkunci rapat secara privat. Memerlukan kode PIN rahasia Anda.' : 'Locked down in absolute encryption. Requires entering your secret code.'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setLockedItemToUnlock(e);
                        setInputPinCode('');
                        setPinError(false);
                      }}
                      className="px-4 py-1.5 bg-gradient-to-tr from-[#BF99D4] to-[#9E6EB6] text-white rounded-xl text-[11px] font-semibold hover:opacity-95 transition-all flex items-center space-x-1 mx-auto cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{t('journal', 'reveal_btn')}</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 font-light leading-relaxed whitespace-pre-wrap flex-1 italic">
                    {e.content}
                  </p>
                )}

                {/* Locked feedback indicator */}
                {e.isPrivate && !isLocked && (
                  <div className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl flex items-center space-x-1.5 self-start border border-emerald-100">
                    <Unlock className="w-3 h-3" />
                    <span>{language === 'id' ? 'Sandi terbuka pada sesi ini' : 'Unlocked for this session'}</span>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Form Drawer Modal to Add Entry */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-[#3F2B36]/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-purple-100 p-6 max-w-xl w-full shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 border-b border-[#FAF6F0] pb-3 mb-4 text-left">
              <Edit3 className="w-4 h-4 text-[#AA7BC3]" />
              <h3 className="font-serif text-lg font-semibold text-[#2D2529]">{t('journal', 'new_entry')}</h3>
            </div>            <form onSubmit={handleCreateEntry} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'id' ? 'Judul Halaman' : 'Entry Title'}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('journal', 'entry_title')}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-sm sm:text-xs p-3.5 sm:p-3 border border-slate-100 rounded-xl bg-[#FAF6F0]/50 focus:outline-[#C084FC] h-12 sm:h-auto"
                  />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs sm:text-[10px] font-bold text-slate-[#404040]/70 uppercase tracking-widest">{t('journal', 'entry_category')}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-sm sm:text-xs p-3 border border-slate-100 rounded-xl bg-[#FAF6F0]/50 focus:outline-[#C084FC] h-12 sm:h-10.5"
                  >
                    <option value="General">{t('journal', 'cat_General')}</option>
                    <option value="Overthinking">{t('journal', 'cat_Overthinking')}</option>
                    <option value="Burnout">{t('journal', 'cat_Burnout')}</option>
                    <option value="Self-Love">{t('journal', 'cat_Self-Love')}</option>
                    <option value="Gratitude">{t('journal', 'cat_Gratitude')}</option>
                    <option value="Deep Thoughts">{t('journal', 'cat_DeepThoughts')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'id' ? 'Isi Luapan Pikiran Rahasia' : 'Raw Unedited Thoughts'}</label>
                <textarea
                  required
                  placeholder={t('journal', 'entry_content')}
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-sm sm:text-xs p-4 border border-slate-100 rounded-xl focus:outline-[#C084FC]"
                />
              </div>

              {/* Private Code settings */}
              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-dashed border-purple-200">
                <label className="flex items-center space-x-3 cursor-pointer p-1">
                  <input 
                    type="checkbox" 
                    checked={isPrivateInput}
                    onChange={(e) => setIsPrivateInput(e.target.checked)}
                    className="w-5 h-5 sm:w-4 sm:h-4 rounded text-purple-400 focus:ring-purple-400 accent-purple-400"
                  />
                  <div>
                    <p className="text-sm sm:text-xs font-semibold text-slate-700">{t('journal', 'privacy_lock')}</p>
                    <p className="text-xs sm:text-[10px] text-slate-400">{t('journal', 'privacy_private')}</p>
                  </div>
                </label>

                {isPrivateInput && (
                  <div className="mt-3.5 space-y-2 animate-fade-in text-left">
                    <span className="text-xs sm:text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">{language === 'id' ? 'Sandi PIN 4 Angka:' : 'Specify 4-digit Lock PIN:'}</span>
                    <input
                      type="text"
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                      className="w-28 text-center font-mono font-bold tracking-widest bg-white border border-slate-200 p-3 sm:p-2 rounded-xl text-sm sm:text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-3 sm:px-4 sm:py-2 border border-slate-200 hover:bg-slate-50 rounded-full text-sm sm:text-xs text-slate-600 transition cursor-pointer min-h-[44px]"
                >
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 sm:px-6 sm:py-2 bg-[#3F2B36] hover:bg-[#523A48] text-white rounded-full text-sm sm:text-xs font-semibold transition cursor-pointer min-h-[44px]"
                >
                  {t('journal', 'btn_save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Private keypad PIN verification Modal */}
      {lockedItemToUnlock && (
        <div className="fixed inset-0 z-50 bg-[#3F2B36]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] rounded-[2rem] border-2 border-[#D8B4FE] p-6 max-w-sm w-full shadow-2xl relative text-center">
            <button
              onClick={() => setLockedItemToUnlock(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-[#AA7BC3]" />
            </div>

            <h3 className="font-serif text-lg font-semibold text-[#2D2529]">{language === 'id' ? 'Kunci Kerahasiaan' : 'Private Verification'}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('journal', 'pin_prompt')} &ldquo;{lockedItemToUnlock.title}&rdquo;</p>

            <form onSubmit={handleUnlockAttempt} className="mt-5 space-y-4">
              {/* Display code spheres */}
              <div className="flex justify-center space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      inputPinCode.length > i 
                        ? 'bg-[#AA7BC3] border-[#AA7BC3] scale-110' 
                        : 'bg-white border-slate-300'
                    }`}
                  />
                ))}
              </div>

              {/* Secret numeric pad log */}
              <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      if (inputPinCode.length < 4) {
                        setInputPinCode(inputPinCode + num);
                        setPinError(false);
                      }
                    }}
                    className="w-12 h-12 rounded-full bg-white hover:bg-purple-100 border border-slate-100 text-sm font-semibold transition-all shadow-3xs cursor-pointer active:scale-90 flex items-center justify-center mx-auto"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setInputPinCode('')}
                  className="w-12 h-12 rounded-full hover:bg-slate-200 text-[10px] font-bold text-slate-500 transition flex items-center justify-center mx-auto cursor-pointer"
                >
                  {language === 'id' ? 'Set Ulang' : 'Clear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (inputPinCode.length < 4) {
                      setInputPinCode(inputPinCode + '0');
                      setPinError(false);
                    }
                  }}
                  className="w-12 h-12 rounded-full bg-white hover:bg-purple-100 border border-slate-100 text-sm font-semibold transition flex items-center justify-center mx-auto cursor-pointer"
                >
                  0
                </button>
                <button
                  type="submit"
                  disabled={inputPinCode.length < 4}
                  className="w-12 h-12 rounded-full bg-[#1e0717] hover:bg-[#32172a] disabled:bg-slate-200 disabled:text-slate-400 text-white text-[11px] font-bold transition flex items-center justify-center mx-auto cursor-pointer"
                >
                  OK
                </button>
              </div>

              {pinError && (
                <div className="flex items-center justify-center space-x-1.5 text-[10px] text-rose-500 font-semibold animate-shake">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{t('journal', 'error_pin')}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
