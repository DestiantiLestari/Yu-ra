import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart, Trash2, ArrowRight, Sparkles, MessageSquare, Compass, ShieldCheck } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface AIAssistantProps {
  user: UserProfile;
}

const CHIP_SUGGESTIONS = [
  "My mind is frozen in overthinking. Can you guide me through a 2-minute releases?",
  "I am deeply exhausted with finals stress. How can I practice guilt-free rest tonight?",
  "I had an uncomfortable talk with a friend and my chest feels so tight.",
  "Give me a poetic daily affirmation for self-love."
];

export default function AIAssistant({ user }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'aura',
      text: `Hello, precious soul. I am Aura, your sisterly confidante. I am holding a warm, peaceful space for you right here. Whether you seek comforting words during study pressure, help dismantling a heavy panic, or simply want to speak into the quiet, I am here. Tell me, what is inside your heart today?`,
      timestamp: new Date().toISOString()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Build active chat payload to forward
      const thread = [...messages, userMsg];
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: thread.slice(-10), // Send last 10 messages for continuous flow
          userProfile: user
        })
      });

      if (!res.ok) {
        throw new Error("Sanctuary pipeline error");
      }

      const data = await res.json();
      
      const auraMsg: ChatMessage = {
        id: 'aura_' + Date.now(),
        sender: 'aura',
        text: data.text || "I am sitting quietly beside you. Go on when you are ready.",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, auraMsg]);
    } catch (e) {
      console.error(e);
      // Beautiful offline comforting fallback message
      setMessages(prev => [
        ...prev, 
        {
          id: 'error_' + Date.now(),
          sender: 'aura',
          text: "I am feeling your energy deeply, but my star pathways are quiet right now (system is slow to respond). Squeeze your eyes shut, breathe in slowly for 4, and let everything go for just a moment. I am right here with you.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const clearHistory = () => {
    setMessages([
      {
        id: 'init_reset',
        sender: 'aura',
        text: `The slate is clean, dear. Draw a fresh breath, set a new focus, and share whatever is in your heart.`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="space-y-6 flex flex-col h-[78vh] max-h-[800px]">
      
      {/* Header Info Banner */}
      <div className="bg-white/40 border border-white/60 px-6 py-4 rounded-3xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#C084FC] to-[#FBCFE8] flex items-center justify-center font-serif text-white italic font-bold">A</div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border border-white rounded-full" title="Online space" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif text-lg font-medium text-[#2D2529]">Confidante Aura</span>
              <span className="text-[9px] uppercase tracking-widest font-semibold bg-[#F3E8FF] text-[#9056CC] px-2 py-0.5 rounded-full border border-purple-200">Emotional AI</span>
            </div>
            <p className="text-[11px] text-[#8C7A84] font-light leading-relaxed">
              Whispering soft wisdom, therapeutic breathing, and comforting bounds. Always confidential.
            </p>
          </div>
        </div>

        <button
          onClick={clearHistory}
          className="text-xs text-rose-400 hover:text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 transition-all flex items-center space-x-1.5 self-start md:self-auto cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Slate</span>
        </button>
      </div>

      {/* Main Sandbox Box */}
      <div className="flex-1 bg-white/70 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-xs flex flex-col overflow-hidden relative">
        <div className="absolute right-0 top-0 p-5 text-slate-300 pointer-events-none opacity-20">
          <MessageSquare className="w-72 h-72 stroke-1" />
        </div>

        {/* Messaging Logs Node */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div 
                key={m.id} 
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-3xs ${
                  isUser 
                    ? 'bg-[#3F2B36] text-[#FEFDFB] rounded-tr-none' 
                    : 'bg-[#FAF6F0]/90 border border-[#F3E8FF] text-[#2D2529] rounded-tl-none font-light leading-relaxed'
                }`}>
                  <p className="text-xs">{m.text}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F5EDF8]/20 text-[9px] opacity-60">
                    <span className="font-serif tracking-tight font-medium italic">
                      {isUser ? user.name : 'Confidante Aura'}
                    </span>
                    <span>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing state */}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-[#FAF6F0] border border-stone-200 text-[#8C7A84] rounded-2xl rounded-tl-none p-4 max-w-[140px]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] text-slate-400 font-serif italic pl-1 leading-none">Listening...</span>
                </div>
              </div>
            </div>
          )}

          {/* Scrolling Anchor */}
          <div ref={scrollRef} />
        </div>

        {/* Fixed footer: Suggestions list & Form Input box */}
        <div className="bg-gradient-to-t from-[#FFFDF9] via-white to-white/95 border-t border-[#F3E8FF] px-6 py-4 shrink-0 relative z-10 space-y-4">
          
          {/* Helpful suggestions chips */}
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none items-center">
            <span className="text-[9px] uppercase font-semibold text-slate-400 block tracking-widest shrink-0 mr-1.5">
              Suggestions:
            </span>
            {CHIP_SUGGESTIONS.map((chip, index) => (
              <button
                key={index}
                onClick={() => sendMessage(chip)}
                className="text-[11px] font-medium bg-purple-50/50 hover:bg-purple-50 hover:border-[#C084FC] border border-purple-100 text-purple-600 px-3.5 py-1.5 rounded-full shrink-0 transition-all duration-300 cursor-pointer active:scale-95"
              >
                {chip.length > 50 ? chip.substring(0, 50) + "..." : chip}
              </button>
            ))}
          </div>

          {/* Form input bar */}
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Tell Aura whatever is on your mind... (e.g. 'Help me check overthinking' or 'feeling exhausted')"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 text-xs px-4 py-3 bg-[#FAF6F0]/70 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#C084FC] focus:bg-white text-slate-700 placeholder-slate-400 transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-3 bg-[#3F2B36] hover:bg-[#523A48] disabled:bg-[#FAF6F0] disabled:text-slate-300 text-white rounded-2xl shadow-3xs transition-all duration-300 cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Security and confidence disclaimer */}
          <div className="flex items-center justify-center space-x-1.5 text-[9px] text-[#8C7A84] font-light">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Connection. Your emotional logs are 100% confidential and processed safely.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
