import React, { useState } from 'react';
import { Check, Sparkles, Shield, Star, CreditCard, X, Gift, GraduationCap, Award } from 'lucide-react';
import { UserProfile } from '../types';

interface PremiumSpaceProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export default function PremiumSpace({ user, onUpdateUser }: PremiumSpaceProps) {
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
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#9056CC]">Yuéra Divine Space</span>
          </div>
          <h2 className="font-serif text-3xl font-light text-[#2D2529]">Enhance Your Sanctuary</h2>
          <p className="text-xs text-[#82717C] max-w-lg font-light leading-relaxed">
            Gain absolute, unrestricted keyways into Aura's healing chats, academic strain clinics, and unlimited locked secret journals.
          </p>
        </div>
        
        {user.isPremium ? (
          <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-4 rounded-2xl flex items-center space-x-3 max-w-xs self-start md:self-auto">
            <Award className="w-6 h-6 shrink-0" />
            <div>
              <p className="text-xs font-semibold">Divine Circle Active</p>
              <p className="text-[10px] opacity-90 leading-tight">Your client holds absolute premium permissions.</p>
            </div>
          </div>
        ) : (
          <div className="bg-purple-100/30 text-purple-600 border border-purple-200/50 p-4 rounded-2xl flex items-center space-x-2.5 max-w-xs self-start md:self-auto text-left">
            <GraduationCap className="w-5 h-5 text-purple-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold">Special student plan</p>
              <p className="text-[10px] text-slate-500 leading-tight">Discounted subscriptions for female university/college students.</p>
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
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Gentle Path</span>
              <h3 className="font-serif text-xl font-medium text-[#2D2529] mt-1">Yuéra Free</h3>
              <p className="text-xs text-slate-400 font-light italic mt-1">Standard calming routine loggers</p>
            </div>

            <div className="flex items-baseline text-slate-800">
              <span className="font-serif text-3xl font-light">$</span>
              <span className="font-serif text-4xl font-semibold tracking-tight">0</span>
              <span className="text-xs text-slate-400 ml-1.5 font-light">/ free eternal</span>
            </div>

            <div className="h-px bg-slate-100" />

            <ul className="space-y-3">
              {[
                "Daily emotional tracker",
                "2 standard locked secret journals",
                "Box breathing bubble guide",
                "Simulated ocean rain soundscape",
                "Daily affirmation focus draws"
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
            Active Gentle Tier
          </button>
        </div>

        {/* Tier 2: Premium Student Package (Most Popular) */}
        <div className="bg-[#FAF4FB] p-6 rounded-[2rem] border-2 border-[#D8B4FE] shadow-sm relative flex flex-col justify-between space-y-8 transform hover:scale-[1.01] transition-all duration-300">
          <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#AA7BC3] to-[#C084FC] text-white text-[9px] uppercase tracking-widest font-bold py-1 px-3.5 rounded-full shadow-3xs">
            Most Popular
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#AA7BC3]">Student Sanctuary</span>
              <h3 className="font-serif text-xl font-medium text-[#2D2529] mt-1">Yuéra Plus</h3>
              <p className="text-xs text-[#AA7BC3] font-medium italic mt-1 text-sm bg-white/70 px-2 py-0.5 rounded-md inline-block">University & High School Care</p>
            </div>

            <div className="flex items-baseline text-slate-800">
              <span className="font-serif text-3xl font-light">$</span>
              <span className="font-serif text-4xl font-semibold tracking-tight">3.99</span>
              <span className="text-xs text-slate-400 ml-1.5 font-light">/ monthly bill</span>
            </div>

            <div className="h-px bg-purple-100" />

            <ul className="space-y-3">
              {[
                "Unlimited Aura companion consultations",
                "Unlimited PIN-locked secret journals",
                "Academic stress / burnout tracker metric",
                "All 5 ambient synthesizer sound waves",
                "Custom stress counseling prompts",
                "Erase history instantly triggers"
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
              Unlocked Active Sanctuary
            </button>
          ) : (
            <button 
              onClick={() => triggerCheckout('Yuéra Plus Student Edition', '$3.99')}
              className="w-full py-3 bg-[#3F2B36] hover:bg-[#523A48] text-white text-xs font-semibold rounded-xl text-center shadow-3xs hover:scale-101 active:scale-99 transition-all cursor-pointer"
            >
              Acquire Student Pass
            </button>
          )}
        </div>

        {/* Tier 3: Divine Circle Pro (Annual Pass) */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Total Nurture</span>
              <h3 className="font-serif text-xl font-medium text-[#2D2529] mt-1">Divine Circle Pro</h3>
              <p className="text-xs text-slate-400 font-light italic mt-1">Full annual private security circle</p>
            </div>

            <div className="flex items-baseline text-slate-800">
              <span className="font-serif text-3xl font-light">$</span>
              <span className="font-serif text-4xl font-semibold tracking-tight">29</span>
              <span className="text-xs text-slate-400 ml-1.5 font-light">/ annually bill</span>
            </div>

            <div className="h-px bg-slate-100" />

            <ul className="space-y-3">
              {[
                "All Student Sanctuary privileges",
                "Aesthetic offline print exports of logs",
                "Aura priority servers (Faster answers)",
                "Full early-access to body sleep meditations",
                "Beautiful custom themes overrides",
                "Share calming card features"
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
              Unlocked Active Pro
            </button>
          ) : (
            <button 
              onClick={() => triggerCheckout('Divine Circle Pro Annual', '$29.00')}
              className="w-full py-3 bg-white hover:bg-slate-50 hover:border-[#AA7BC3] border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer"
            >
              Enter Circle
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
                    <span>Secure Sanctuary Checkout</span>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#2D2529] mt-1.5">Acquire {selectedPlanName}</h3>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                    Test our check-out flow with simulated credentials. Zero real dollars are charged. Clicking pay immediately upgrades status in the active portal.
                  </p>
                </div>

                {/* Simulated aesthetic high-end gold / pink credit card layout */}
                <div className="bg-gradient-to-br from-[#AA7BC3] via-[#7B5391] to-[#3F2B36] p-6 rounded-2xl text-white shadow-md space-y-8 relative overflow-hidden font-mono text-sm">
                  {/* Floating glass circle */}
                  <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="absolute right-4 top-4 text-white/40 font-serif italic text-base">Yuéra Card</div>

                  <div className="flex justify-between items-center">
                    <CreditCard className="w-8 h-8 text-white/85" />
                    <span className="text-[9px] uppercase tracking-widest bg-white/15 px-2 py-0.5 rounded border border-white/20 font-sans">Simulated Secure</span>
                  </div>

                  <div className="space-y-4">
                    {/* Card number display */}
                    <div className="tracking-widest text-base font-semibold">
                      {cardNumber || "••••  ••••  ••••  ••••"}
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-white/70 uppercase font-sans">
                      <div>
                        <p className="text-[8px] uppercase font-light text-white/50">Holder</p>
                        <p className="font-medium tracking-wide mt-0.5 text-xs text-white truncate max-w-[120px]">{cardHolder}</p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-[8px] uppercase font-light text-white/50">Expiry</p>
                          <p className="font-medium mt-0.5 text-white">{expiry || "MM/YY"}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase font-light text-white/50">cvv</p>
                          <p className="font-medium mt-0.5 text-white">{cvv || "•••"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout forms */}
                <form onSubmit={handleSimulatedPayment} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Card number</label>
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
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiry date</label>
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
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security CVV</label>
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
                        <span>Authorize Safe Secure Charge ({selectedPlanPrice})</span>
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
                  <h3 className="font-serif text-2xl font-bold text-slate-800">You are Divine Circle!</h3>
                  <p className="text-xs text-[#AA7BC3] font-semibold">Payment Confirmed & Verified</p>
                </div>

                <div className="p-4 bg-purple-50/50 rounded-2xl text-[11px] leading-relaxed text-slate-600 font-light border border-purple-100">
                  💖 Welcome into Yuéra Divine Circle, beautiful. Click continue below to unlock Aura's unlimited counseling chats, priority processing, and absolute secret compartments instantly.
                </div>

                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-full py-3 bg-[#3F2B36] hover:bg-[#523A48] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition active:scale-98"
                >
                  Enter Expanded Sanctuary
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
