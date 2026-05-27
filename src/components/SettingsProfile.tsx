import React, { useState } from 'react';
import { User, Shield, Key, Bell, Trash2, Heart, GraduationCap, Briefcase, EyeOff, Save, Globe } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SettingsProfileProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onClearData: () => void;
}

export default function SettingsProfile({ user, onUpdateUser, onClearData }: SettingsProfileProps) {
  const { language, setLanguage, t } = useLanguage();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      role
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#2D2529]">
      {/* Title */}
      <div className="bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md text-left">
        <h2 className="font-serif text-2xl font-semibold text-[#2D2529]">{t('settings', 'title')}</h2>
        <p className="text-xs text-[#82717C] mt-1 font-light">
          {t('settings', 'desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Profile Details Form */}
        <form onSubmit={handleSave} className="lg:col-span-3 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#FAF6F0]">
            <User className="w-5 h-5 text-purple-400" />
            <h3 className="font-serif text-lg font-medium">{t('settings', 'section_title')}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('settings', 'field_name')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-3 border border-slate-100 rounded-xl bg-[#FAF6F0]/50 focus:outline-[#C084FC] focus:bg-white text-slate-700"
              />
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('settings', 'field_email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-3 border border-slate-100 rounded-xl bg-[#FAF6F0]/50 focus:outline-[#C084FC] focus:bg-white text-slate-700 font-mono"
              />
            </div>
          </div>

          {/* Language Switcher pill panel requested */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>{t('settings', 'lang_label')}</span>
            </label>
            <p className="text-[10px] text-slate-400 font-light font-sans">{t('settings', 'lang_desc')}</p>
            <div className="flex gap-2.5 max-w-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  language === 'en' 
                    ? 'bg-[#3F2B36] border-[#3F2B36] text-white shadow-3xs' 
                    : 'bg-white border-stone-200/50 hover:border-purple-200 text-slate-600'
                }`}
              >
                <span>🇺🇸</span>
                <span>English (EN)</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('id')}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  language === 'id' 
                    ? 'bg-[#3F2B36] border-[#3F2B36] text-white shadow-3xs' 
                    : 'bg-white border-stone-200/50 hover:border-purple-200 text-slate-600'
                }`}
              >
                <span>🇮🇩</span>
                <span>Indonesia (ID)</span>
              </button>
            </div>
          </div>

          {/* Role adjustment */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t('settings', 'field_focus')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'student', label: t('settings', 'student_role'), desc: t('settings', 'student_role_desc'), icon: GraduationCap },
                { id: 'professional', label: t('settings', 'professional_role'), desc: t('settings', 'professional_role_desc'), icon: Briefcase },
                { id: 'other', label: t('settings', 'other_role'), desc: t('settings', 'other_role_desc'), icon: Heart }
              ].map((item) => {
                const active = role === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id as any)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2 cursor-pointer transition-all ${
                      active 
                        ? 'bg-purple-100/40 border-[#C084FC] text-[#9056CC]' 
                        : 'bg-white/80 border-slate-100 text-slate-600 hover:border-purple-200'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-current" />
                    <div>
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className="text-[9px] text-slate-400 mt-1 leading-normal font-light">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy confirmation details */}
          <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-dashed border-purple-200 flex items-start space-x-3 text-left">
            <Shield className="w-5 h-5 text-[#AA7BC3] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700">{t('settings', 'security_tag')}</span>
              <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                {t('settings', 'security_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {success ? (
              <span className="text-xs text-emerald-500 font-semibold animate-pulse">{t('settings', 'save_success')}</span>
            ) : (
              <span className="text-[10px] text-slate-400">{t('settings', 'save_info')}</span>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#3F2B36] hover:bg-[#523A48] text-white rounded-full text-xs font-semibold shadow-xs flex items-center space-x-1 transition cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{t('settings', 'btn_save')}</span>
            </button>
          </div>
        </form>

        {/* Right column: dangerous zone and general support parameters */}
        <div className="lg:col-span-2 space-y-8 flex flex-col justify-between text-left">
          
          {/* Notifications config */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-[#FAF6F0]">
              <Bell className="w-4 h-4 text-purple-400" />
              <h3 className="font-serif text-base font-semibold">{t('settings', 'notification_title')}</h3>
            </div>
            
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              {t('settings', 'notification_desc')}
            </p>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-purple-400 focus:ring-purple-400 accent-purple-400" />
                <span className="font-light">{t('settings', 'rem_1')}</span>
              </label>
              
              <label className="flex items-center space-x-3 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-purple-400 focus:ring-purple-400 accent-purple-400" />
                <span className="font-light">{t('settings', 'rem_2')}</span>
              </label>

              <label className="flex items-center space-x-3 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-purple-400 focus:ring-purple-400 accent-purple-400" />
                <span className="font-light">{t('settings', 'rem_3')}</span>
              </label>
            </div>
          </div>

          {/* Erase Sandbox Memory Dangerous zone */}
          <div className="p-6 rounded-3xl bg-[#FFF5F5] border border-[#FFD2D2] space-y-4 text-left">
            <div className="flex items-center space-x-2 text-rose-500">
              <Trash2 className="w-4 h-4" />
              <h3 className="font-serif text-base font-semibold">{t('settings', 'crisis_title')}</h3>
            </div>

            <p className="text-xs text-slate-600 font-light leading-relaxed">
              {t('settings', 'crisis_desc')}
            </p>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(t('settings', 'erase_confirm'))) {
                  onClearData();
                }
              }}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('settings', 'btn_erase')}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
