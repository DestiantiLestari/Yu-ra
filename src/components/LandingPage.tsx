import React from 'react';
import { Sparkles, Heart, HeartHandshake, Shield, Star, GraduationCap, Flower, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: (isSignUp: boolean) => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FAF6F0] via-[#F5EDF8] to-[#FAF6F0] text-[#2D2529] relative overflow-hidden">
      {/* Decorative Blur Background Circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#E9E3FF]/50 blur-3xl float-slow pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-[#FBCFE8]/30 blur-3xl float-delay pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-80 h-80 rounded-full bg-[#F3E8FF]/40 blur-3xl float-medium pointer-events-none" />

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-full bg-[#D8B4FE] flex items-center justify-center shadow-sm">
            <span className="font-serif text-lg font-bold text-white italic">Y</span>
          </div>
          <span className="font-serif text-2xl font-semibold tracking-wide text-[#3F2B36]">Yuéra</span>
        </div>
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => onEnterApp(false)} 
            className="text-sm font-medium hover:text-[#C084FC] transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => onEnterApp(true)} 
            className="text-sm font-medium bg-[#3F2B36] text-white px-5 py-2.5 rounded-full hover:bg-[#523A48] transition-all shadow-sm duration-300"
          >
            Join Yuéra
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center relative z-10 flex flex-col items-center">
        {/* Aesthetic tag label */}
        <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/60 shadow-xs mb-8">
          <Flower className="w-3.5 h-3.5 text-[#C084FC]" />
          <span className="text-xs tracking-wider font-semibold uppercase text-[#6B5A63]">A Safe Space to Bloom</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-serif text-5xl md:text-7xl font-light text-[#2D2529] tracking-tight leading-tight max-w-4xl mb-6">
          Heal, reflect, and <span className="italic font-medium text-[#AA7BC3]">feel understood</span> in your busy calendar.
        </h1>

        {/* Hero Description */}
        <p className="text-lg text-[#6B5A63] max-w-2xl font-light mb-10 leading-relaxed">
          A premium emotional wellness sanctuary meticulously designed for busy women and female students. Untangle burnout, soothe academic stress, and write in absolute absolute secrecy.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button 
            onClick={() => onEnterApp(true)}
            className="w-full sm:w-auto px-8 py-4 bg-[#3F2B36] hover:bg-[#523A48] text-white rounded-full font-medium shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Begin Your Healing Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onEnterApp(false)}
            className="w-full sm:w-auto px-8 py-4 bg-white/75 hover:bg-white/95 text-[#2D2529] border border-white/80 rounded-full font-medium shadow-sm backdrop-blur-md transition-all duration-300"
          >
            Explore Dashboard
          </button>
        </div>

        {/* Preview Highlights Dashboard */}
        <div className="w-full max-w-4xl bg-white/60 backdrop-blur-xl border border-white/60 p-5 rounded-[2rem] shadow-xl relative mt-4">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#E9E3FF] rounded-full opacity-30" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left p-2">
            <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-white/50">
              <div className="w-8 h-8 rounded-full bg-[#E9E3FF] flex items-center justify-center text-[#aa84fc] mb-3">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-sm font-medium text-[#2D2529]">Aura Companion</h3>
              <p className="text-[11px] text-[#6B5A63] mt-1.5 font-light">Warm sisterhood guidance fueled by emotional AI.</p>
            </div>
            <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-white/50">
              <div className="w-8 h-8 rounded-full bg-[#FDE2E4] flex items-center justify-center text-[#e08a90] mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-sm font-medium text-[#2D2529]">Healing Cocoon</h3>
              <p className="text-[11px] text-[#6B5A63] mt-1.5 font-light">Deep breathing regulators and calming lo-fi rain waves.</p>
            </div>
            <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-white/50">
              <div className="w-8 h-8 rounded-full bg-[#EAF4F4] flex items-center justify-center text-[#7caaa8] mb-3">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-sm font-medium text-[#2D2529]">Locked Diary</h3>
              <p className="text-[11px] text-[#6B5A63] mt-1.5 font-light">Secure writing with quick visual PIN padlock protections.</p>
            </div>
            <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-white/50">
              <div className="w-8 h-8 rounded-full bg-[#FFF0F5] flex items-center justify-center text-[#df6792] mb-3">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-sm font-medium text-[#2D2529]">Student Care</h3>
              <p className="text-[11px] text-[#6B5A63] mt-1.5 font-light">Specialized tools for burnout and academic stress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials or Emotional Connection */}
      <section className="bg-[#FFFDF9]/60 backdrop-blur-md py-20 border-t border-b border-[#E9E3FF]/30">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-center text-[#2D2529] font-light mb-12">
            Why women and medical/law students <span className="italic text-[#AA7BC3]">love Yuéra</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-7 rounded-3xl bg-white border border-[#E9E3FF]/40 shadow-xs relative">
              <div className="flex text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-sm font-light text-[#52444C] leading-relaxed italic">
                &ldquo;Between finals and law review, I was dry crying into my pillow. Aura helped me stop overthinking and taught me to set real emotional boundaries.&rdquo;
              </p>
              <div className="mt-5">
                <p className="text-xs font-semibold text-[#2D2529]">Clarissa V.</p>
                <p className="text-[10px] text-[#8C7A84]">L2 Law Student, Chicago</p>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E9E3FF]/40 shadow-xs relative">
              <div className="flex text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-sm font-light text-[#52444C] leading-relaxed italic">
                &ldquo;I love the aesthetic. It feels like stepping into a peaceful lavender field, miles away from my corporate anxiety. The PIN-locked journal is genius.&rdquo;
              </p>
              <div className="mt-5">
                <p className="text-xs font-semibold text-[#2D2529]">Maya Al-Hassan</p>
                <p className="text-[10px] text-[#8C7A84]">Senior Brand Manager, NYC</p>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E9E3FF]/40 shadow-xs relative">
              <div className="flex text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-sm font-light text-[#52444C] leading-relaxed italic">
                &ldquo;Yuéra is my morning ritual. Doing the breathing bubble with the lofi garden rain prepares my heart so I can enter clinicals with peace.&rdquo;
              </p>
              <div className="mt-5">
                <p className="text-xs font-semibold text-[#2D2529]">Dr. Elena Rostova</p>
                <p className="text-[10px] text-[#8C7A84]">Resident Medical Doctor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-xs text-[#8C7A84]">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:text-[#C084FC]">Privacy Policy</a>
          <a href="#" className="hover:text-[#C084FC]">Terms of Service</a>
          <a href="#" className="hover:text-[#C084FC]">Support</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Yuéra Wellness. Nurtured with care.</p>
      </footer>
    </div>
  );
}
