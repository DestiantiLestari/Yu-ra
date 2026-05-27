import React, { useState } from 'react';
import { Check, Sparkles, Shield, Star, CreditCard, X, Gift, GraduationCap, Award } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PremiumSpaceProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export default function PremiumSpace({ user, onUpdateUser }: PremiumSpaceProps) {
  const { language, t } = useLanguage();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState('');
  const [selectedPlanPrice, setSelectedPlanPrice] = useState('');
  
  // Checkout flow state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user.name);
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const triggerCheckout = (planName: string, price: string) => {
    setSelectedPlanName(planName);
    setSelectedPlanPrice(price);
    setPaymentSuccess(false);
    setShowCheckoutModal(true);
  };

  const handleSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);

    // Simulate safe processing time
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      
      // Upgrade user profile permanently in session
      onUpdateUser({
        ...user,
        isPremium: true
      });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#2D2529]">
      {/* Title */}
      <div className="bg-gradient-to-tr from-[#FAF6F0] via-[#FAF1FA] to-[#FAF6F0] border border-white p-8 rounded-[2rem] relative overflow-hidden shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-white px-3 py-1 rounded-full border border-[#FAF1FA] shadow-3xs">
            <Sparkles className="w-4 h-4 text-[#C084FC] animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9056CC]">{t('premium', 'title')}</span>
          </div>
          <h2 className="font-serif text-3xl font-light text-[#2D2529]">{t('premium', 'subtitle')}</h2>
          <p className="text-xs text-[#82717C] max-w-lg font-light leading-relaxed">
            {t('premium', 'desc')}
          </p>
        </div>
        
        {user.isPremium ? (
          <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-4 rounded-2xl flex items-center space-x-3 max-w-xs self-start md:self-auto">
            <Award className="w-6 h-6 shrink-0" />
            <div>
              <p className="text-xs font-semibold">{t('premium', 'active_premium')}</p>
              <p className="text-[10px] opacity-90 leading-tight">{t('premium', 'active_premium_sub')}</p>
            </div>
          </div>
        ) : (
          <div className="bg-purple-100/30 text-purple-600 border border-purple-200/50 p-4 rounded-2xl flex items-center space-x-2.5 max-w-xs self-start md:self-auto text-left">
            <GraduationCap className="w-5 h-5 text-purple-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold">{t('premium', 'student_plan')}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{t('premium', 'student_plan_sub')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Plans comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Tier 1: Free Card */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">{t('premium', 'tier1_tag')}</span>
              <h3 className="font-serif text-xl font-medium text-[#2D2529] mt-1">{t('premium', 'tier1_title')}</h3>
              <p className="text-xs text-slate-400 font-light italic mt-1">{t('premium', 'tier1_sub')}</p>
            </div>

            <div className="flex items-baseline text-slate-800">
              <span className="font-serif text-3xl font-light">$</span>
              <span className="font-serif text-4xl font-semibold tracking-tight">{t('premium', 'tier1_price')}</span>
              <span className="text-xs text-slate-400 ml-1.5 font-light">{t('premium', 'tier1_freq')}</span>
            </div>

            <div className="h-px bg-slate-100" />

            <ul className="space-y-3">
              {[
                t('premium', 'benefit_free_1'),
                t('premium', 'benefit_free_2'),
                t('premium', 'benefit_free_3'),
                t('premium', 'benefit_free_4'),
                t('premium', 'benefit_free_5')
              ].map((val) => (
                <li key={val} className="flex items-start text-xs text-slate-600 font-light">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>

          <button 
            disabled 
            className="w-full py-3 bg-slate-100 text-slate-400 text-xs font-semibold rounded-xl text-center cursor-not-allowed select-none"
          >
            {t('premium', 'tier1_btn')}
          </button>
        </div>

        {/* Tier 2: Premium Student Package (Most Popular) */}
        <div className="bg-[#FAF4FB] p-6 rounded-[2rem] border-2 border-[#D8B4FE] shadow-sm relative flex flex-col justify-between space-y-8 transform hover:scale-[1.01] transition-all duration-300">
          <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#AA7BC3] to-[#C084FC] text-white text-[9px] uppercase tracking-widest font-bold py-1 px-3.5 rounded-full shadow-3xs">
            {t('premium', 'most_popular')}
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#AA7BC3]">{t('premium', 'tier2_tag')}</span>
              <h3 className="font-serif text-xl font-medium text-[#2D2529] mt-1">{t('premium', 'tier2_title')}</h3>
              <p className="text-xs text-[#AA7BC3] font-medium italic mt-1 text-sm bg-white/70 px-2 py-0.5 rounded-md inline-block">{t('premium', 'tier2_sub')}</p>
            </div>

            <div className="flex items-baseline text-slate-800">
              <span className="font-serif text-3xl font-light">$</span>
              <span className="font-serif text-4xl font-semibold tracking-tight">{t('premium', 'tier2_price')}</span>
              <span className="text-xs text-slate-400 ml-1.5 font-light">{t('premium', 'tier2_freq')}</span>
            </div>

            <div className="h-px bg-purple-100" />

            <ul className="space-y-3">
              {[
                t('premium', 'benefit_plus_1'),
                t('premium', 'benefit_plus_2'),
                t('premium', 'benefit_plus_3'),
                t('premium', 'benefit_plus_4'),
                t('premium', 'benefit_plus_5'),
                t('premium', 'benefit_plus_6')
              ].map((val) => (
                <li key={val} className="flex items-start text-xs text-slate-700 font-light">
                  <Check className="w-3.5 h-3.5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>

          {user.isPremium ? (
            <button
              disabled
              className="w-full py-3 bg-[#3F2B36] text-white text-xs font-semibold rounded-xl text-center select-none"
            >
              {t('premium', 'tier2_btn_active')}
            </button>
          ) : (
            <button 
              onClick={() => triggerCheckout(t('premium', 'tier2_title'), `$${t('premium', 'tier2_price')}`)}
              className="w-full py-3 bg-[#3F2B36] hover:bg-[#523A48] text-white text-xs font-semibold rounded-xl text-center shadow-3xs hover:scale-101 active:scale-99 transition-all cursor-pointer"
            >
              {t('premium', 'tier2_btn_buy')}
            </button>
          )}
        </div>

        {/* Tier 3: Divine Circle Pro (Annual Pass) */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">{t('premium', 'tier3_tag')}</span>
              <h3 className="font-serif text-xl font-medium text-[#2D2529] mt-1">{t('premium', 'tier3_title')}</h3>
              <p className="text-xs text-slate-400 font-light italic mt-1">{t('premium', 'tier3_sub')}</p>
            </div>

            <div className="flex items-baseline text-slate-800">
              <span className="font-serif text-3xl font-light">$</span>
              <span className="font-serif text-4xl font-semibold tracking-tight">{t('premium', 'tier3_price')}</span>
              <span className="text-xs text-slate-400 ml-1.5 font-light">{t('premium', 'tier3_freq')}</span>
            </div>

            <div className="h-px bg-slate-100" />

            <ul className="space-y-3">
              {[
                t('premium', 'benefit_pro_1'),
                t('premium', 'benefit_pro_2'),
                t('premium', 'benefit_pro_3'),
                t('premium', 'benefit_pro_4'),
                t('premium', 'benefit_pro_5'),
                t('premium', 'benefit_pro_6')
              ].map((val) => (
                <li key={val} className="flex items-start text-xs text-slate-600 font-light">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>

          {user.isPremium ? (
            <button
              disabled
              className="w-full py-3 bg-zinc-200 text-zinc-500 text-xs font-semibold rounded-xl text-center select-none"
            >
              {t('premium', 'tier3_btn_active')}
            </button>
          ) : (
            <button 
              onClick={() => triggerCheckout(t('premium', 'tier3_title'), `$${t('premium', 'tier3_price')}`)}
              className="w-full py-3 bg-white hover:bg-slate-50 hover:border-[#AA7BC3] border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer"
            >
              {t('premium', 'tier3_btn_buy')}
            </button>
          )}
        </div>

      </div>

      {/* Simulated High-Aesthetic Credit Card checkout modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-[#3F2B36]/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-purple-100 p-8 max-w-md w-full shadow-2xl relative animate-scale-in text-left">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!paymentSuccess ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-[#AA7BC3] uppercase tracking-wide">
                    <Star className="w-3.5 h-3.5 text-[#AA7BC3] fill-current" />
                    <span>{t('premium', 'modal_tag')}</span>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#2D2529] mt-1.5">
                    {t('premium', 'modal_title').replace('{plan}', selectedPlanName)}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                    {t('premium', 'modal_desc')}
                  </p>
                </div>

                {/* Simulated aesthetic high-end gold / pink credit card layout */}
                <div className="bg-gradient-to-br from-[#AA7BC3] via-[#7B5391] to-[#3F2B36] p-6 rounded-2xl text-white shadow-md space-y-8 relative overflow-hidden font-mono text-sm">
                  {/* Floating glass circle */}
                  <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="absolute right-4 top-4 text-white/40 font-serif italic text-base">{t('premium', 'card_brand')}</div>

                  <div className="flex justify-between items-center">
                    <CreditCard className="w-8 h-8 text-white/85" />
                    <span className="text-[9px] uppercase tracking-widest bg-white/15 px-2 py-0.5 rounded border border-white/20 font-sans">{t('premium', 'secure_badge')}</span>
                  </div>

                  <div className="space-y-4">
                    {/* Card number display */}
                    <div className="tracking-widest text-base font-semibold">
                      {cardNumber || "••••  ••••  ••••  ••••"}
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-white/70 uppercase font-sans">
                      <div>
                        <p className="text-[8px] uppercase font-light text-white/50">{t('premium', 'holder')}</p>
                        <p className="font-medium tracking-wide mt-0.5 text-xs text-white truncate max-w-[120px]">{cardHolder}</p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-[8px] uppercase font-light text-white/50">{t('premium', 'expiry')}</p>
                          <p className="font-medium mt-0.5 text-white">{expiry || "MM/YY"}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase font-light text-white/50">{t('premium', 'cvv')}</p>
                          <p className="font-medium mt-0.5 text-white">{cvv || "•••"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout forms */}
                <form onSubmit={handleSimulatedPayment} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('premium', 'field_number')}</label>
                    <input
                      type="text"
                      required
                      placeholder="4242  4242  4242  4242"
                      value={cardNumber}
                      onChange={(e) => {
                        // format to credit card chunks
                        let cleaned = e.target.value.replace(/\D/g, '').substring(0, 16);
                        let chunks = cleaned.match(/.{1,4}/g)?.join('  ') || cleaned;
                        setCardNumber(chunks);
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-purple-300 font-mono tracking-widest"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('premium', 'field_expiry')}</label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (val.length === 2 && !val.includes('/')) {
                            val += '/';
                          }
                          setExpiry(val);
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-purple-300 font-mono text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('premium', 'field_cvv')}</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-purple-300 font-mono text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPaying}
                    className="w-full py-3 mt-4 bg-gradient-to-r from-[#AA7BC3] to-[#7B5391] hover:opacity-95 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    {isPaying ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>{t('premium', 'btn_pay').replace('{price}', selectedPlanPrice)}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              // Success celebratory screen
              <div className="text-center space-y-6 pt-4 animate-scale-in">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-sm animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-bold text-slate-800">{t('premium', 'success_title')}</h3>
                  <p className="text-xs text-[#AA7BC3] font-semibold">{t('premium', 'success_subtitle')}</p>
                </div>

                <div className="p-4 bg-purple-50/50 rounded-2xl text-[11px] leading-relaxed text-slate-600 font-light border border-purple-100">
                  {t('premium', 'success_desc')}
                </div>

                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-full py-3 bg-[#3F2B36] hover:bg-[#523A48] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition active:scale-98"
                >
                  {t('premium', 'btn_continue')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
