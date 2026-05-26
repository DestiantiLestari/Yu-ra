import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Sparkles, Compass, Volume2, Music, CloudRain, Wind, Heart, Sparkle } from 'lucide-react';
import { Affirmation } from '../types';
import { AFFIRMATIONS } from '../data';

export default function HealingSpace() {
  // Breathing Bubble State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);

  // Audio / Soundscape State
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.4);

  // Web Audio Synth references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{ 
    osc1?: OscillatorNode; 
    osc2?: OscillatorNode; 
    noiseNode?: AudioWorkletNode | AudioNode; 
    gainNode?: GainNode;
    filterNode?: BiquadFilterNode;
  }>({});

  // Affirmation draw state
  const [currentAffi, setCurrentAffi] = useState<string>("Take a gentle pause. Let your hands relax, drop your shoulders, and clear your brow.");

  // 1. Box Breathing Interval manager
  useEffect(() => {
    let timer: any;
    if (breathingActive) {
      timer = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 4; // hold for 4
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 4; // exhale for 4
            } else {
              setBreathPhase('Inhale');
              return 4; // inhale for 4
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('Inhale');
      setPhaseSecondsLeft(4);
    }
    return () => clearInterval(timer);
  }, [breathingActive, breathPhase]);

  // Try to clean up audio synthetics on unmount
  useEffect(() => {
    return () => {
      stopSynthesizer();
    };
  }, []);

  // Update volume live if synth is running
  useEffect(() => {
    if (synthNodesRef.current.gainNode) {
      synthNodesRef.current.gainNode.gain.setValueAtTime(volume * 0.15, audioCtxRef.current?.currentTime || 0);
    }
  }, [volume]);

  // Real Web Audio API synthesizer for relaxing frequencies
  const startSynthesizer = (trackId: string) => {
    try {
      stopSynthesizer(); // Stop any legacy sounds

      // Initialize audio context
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 1. Create primary master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);

      // 2. Create Lowpass Filter to make the sound warm and soft
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      
      if (trackId === 'rain') {
        // Soft white noise mimicking rainfall
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Add slow LFO to make the rain swell
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // slow wave
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(120, ctx.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        whiteNoise.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        whiteNoise.start();
        lfo.start();

        synthNodesRef.current = { 
          osc1: whiteNoise as any, 
          osc2: lfo,
          gainNode: masterGain, 
          filterNode: filter 
        };

      } else if (trackId === 'harp') {
        // Celestial harp: cozy soft sine-wave chords
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(146.83, ctx.currentTime); // D3

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(220.00, ctx.currentTime); // A3

        // Animate/Modulate notes slowly
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // very slow swell
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(4, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(osc2.frequency); // pitch shifts A3 slightly to give a chorus harmony effect

        filter.frequency.setValueAtTime(450, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        lfo.start();

        synthNodesRef.current = { 
          osc1, 
          osc2, 
          gainNode: masterGain, 
          filterNode: filter 
        };

      } else if (trackId === 'waves') {
        // Sunset Beach Waves: deeply soft modulated noise
        filter.frequency.setValueAtTime(180, ctx.currentTime);
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Heavy wave modulator (Slow LFO changing master gain of wave)
        const waveLfo = ctx.createOscillator();
        waveLfo.type = 'sine';
        waveLfo.frequency.setValueAtTime(0.12, ctx.currentTime); // Wave period: 8 seconds
        
        const waveGain = ctx.createGain();
        waveGain.gain.setValueAtTime(0.08, ctx.currentTime);
        
        // Connect LFO to control filter frequency dynamically for 'crushing' wave sounds
        const filterLfoGain = ctx.createGain();
        filterLfoGain.gain.setValueAtTime(180, ctx.currentTime);
        waveLfo.connect(filterLfoGain);
        filterLfoGain.connect(filter.frequency);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        whiteNoise.start();
        waveLfo.start();

        synthNodesRef.current = { 
          osc1: whiteNoise as any, 
          osc2: waveLfo, 
          gainNode: masterGain, 
          filterNode: filter 
        };

      } else {
        // Cosmic Blush Noise: warm, low rumbling sine pad
        const osc1 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(80.00, ctx.currentTime); // deep bass hum

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(120.00, ctx.currentTime); // perfect fifth

        filter.frequency.setValueAtTime(200, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        synthNodesRef.current = { 
          osc1, 
          osc2, 
          gainNode: masterGain, 
          filterNode: filter 
        };
      }

      setPlayingTrackId(trackId);
    } catch (e) {
      console.warn("AudioContext failed to start:", e);
    }
  };

  const stopSynthesizer = () => {
    try {
      if (synthNodesRef.current.osc1) {
        synthNodesRef.current.osc1.stop();
      }
      if (synthNodesRef.current.osc2) {
        synthNodesRef.current.osc2.stop();
      }
    } catch (err) {}
    synthNodesRef.current = {};
    setPlayingTrackId(null);
  };

  const toggleTrack = (trackId: string) => {
    if (playingTrackId === trackId) {
      stopSynthesizer();
    } else {
      startSynthesizer(trackId);
    }
  };

  const drawCard = () => {
    const list = AFFIRMATIONS;
    const drawn = list[Math.floor(Math.random() * list.length)].text;
    setCurrentAffi(drawn);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md">
        <h2 className="font-serif text-2xl font-semibold text-[#2D2529]">The Soothing Cocoon</h2>
        <p className="text-xs text-[#82717C] mt-1 font-light">
          A physical pause point designed to drop high cortisol levels, silent panic attacks, and study overthinking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Side: Breathing Guide (Spans 3 col) */}
        <div className="lg:col-span-3 bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-white/60 shadow-xs flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
          <div className="absolute right-4 top-4 text-purple-100/50 pointer-events-none">
            <Wind className="w-40 h-40 stroke-1" />
          </div>

          <div className="text-center relative z-10 max-w-sm">
            <span className="text-[9px] uppercase tracking-widest font-bold text-rose-400 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              Box Regulator
            </span>
            <p className="text-xs text-slate-500 font-light mt-3">
              Stress alters our breathing patterns first. Ground your heartbeat using our 4-4-4 expander loop.
            </p>
          </div>

          {/* Interactive Breathing Bubble */}
          <div className="my-10 relative z-10 flex items-center justify-center">
            
            <div 
              className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-center transition-all duration-[4000ms] ease-in-out border-2 border-dashed ${
                breathingActive 
                  ? breathPhase === 'Inhale' 
                    ? 'scale-122 bg-purple-100/50 border-purple-400/60 shadow-md' 
                    : breathPhase === 'Hold'
                    ? 'scale-122 bg-pink-100/40 border-pink-400/50 shadow-md'
                    : 'scale-90 bg-[#FAF6F0] border-slate-300'
                  : 'scale-100 bg-[#FAF6F0] border-slate-300'
              }`}
            >
              {breathingActive ? (
                <div className="animate-fade-in space-y-1">
                  <p className="font-serif text-xl font-semibold text-slate-800 tracking-wide">{breathPhase}</p>
                  <p className="text-2xl font-mono text-[#AA7BC3] font-bold">{phaseSecondsLeft}s</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">
                    {breathPhase === 'Inhale' ? 'Sip air in' : breathPhase === 'Hold' ? 'Rest in pause' : 'Let it go'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <Heart className="w-8 h-8 text-rose-300 mx-auto animate-pulse" />
                  <p className="text-xs font-semibold text-slate-600">Bubble Ready</p>
                  <p className="text-[10px] text-slate-400 font-light">Press start below</p>
                </div>
              )}
            </div>

            {/* Echo Ring */}
            {breathingActive && (
              <div className="absolute inset-0 rounded-full border-2 border-purple-300/20 scale-125 animate-ping opacity-15 pointer-events-none" />
            )}
          </div>

          {/* Breathing button controls */}
          <button
            onClick={() => {
              setBreathingActive(!breathingActive);
              setBreathPhase('Inhale');
              setPhaseSecondsLeft(4);
            }}
            className={`w-full max-w-xs py-3 rounded-full text-xs font-medium tracking-wide shadow-3xs transition-all duration-300 relative z-10 cursor-pointer ${
              breathingActive 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-100' 
                : 'bg-[#3F2B36] hover:bg-[#523A48] text-white shadow-purple-100'
            }`}
          >
            {breathingActive ? 'Stop Breath Loop' : 'Activate Breath Loop'}
          </button>
        </div>

        {/* Right Side Column (Ambient sounds and affirmations) */}
        <div className="lg:col-span-2 space-y-8 flex flex-col justify-between">
          
          {/* Web Audio Pure frequency Generator panel */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xs space-y-5">
            <div>
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4 text-purple-400" />
                <h3 className="font-serif text-lg font-medium text-[#2D2529]">Ambient Frequency Player</h3>
              </div>
              <p className="text-xs text-slate-400 font-light mt-1">
                Synthesized live in your browser using pure therapeutic soundwaves. Volume slider below.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'rain', name: 'Warm Garden Rain', icon: CloudRain, color: 'hover:border-sky-300 hover:bg-sky-50/20' },
                { id: 'harp', name: 'Celestial Synth Harp', icon: Sparkle, color: 'hover:border-purple-300 hover:bg-purple-50/20' },
                { id: 'waves', name: 'Sunset Ocean Waves', icon: Wind, color: 'hover:border-teal-300 hover:bg-teal-50/20' },
                { id: 'cosmic', name: 'Cosmic Blush Noise', icon: Volume2, color: 'hover:border-pink-300 hover:bg-pink-50/20' }
              ].map((trk) => {
                const playing = playingTrackId === trk.id;
                const Icon = trk.icon;
                return (
                  <button
                    key={trk.id}
                    onClick={() => toggleTrack(trk.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${
                      playing 
                        ? 'bg-[#3F2B36] text-white border-[#3F2B36]' 
                        : `bg-white/80 border-slate-100 text-slate-700 ${trk.color}`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-lg ${playing ? 'bg-white/10' : 'bg-slate-50'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">{trk.name}</span>
                    </div>

                    <div>
                      {playing ? (
                        <div className="flex items-center space-x-1 pr-1.5">
                          {/* Simulated mini visualizers */}
                          <div className="w-0.5 h-3.5 bg-emerald-300 rounded-full animate-pulse" />
                          <div className="w-0.5 h-2.5 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                          <div className="w-0.5 h-4 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                          <Pause className="w-3.5 h-3.5 ml-2 text-rose-300" />
                        </div>
                      ) : (
                        <Play className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Volume slider */}
            <div className="flex items-center space-x-3 pt-2.5 border-t border-slate-100/80">
              <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 accent-purple-400 h-1 bg-slate-100 rounded-full"
                title={`Volume: ${Math.round(volume * 100)}%`}
              />
              <span className="text-[10px] font-mono text-slate-400 font-medium">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          {/* Calm Card affirmative draw deck */}
          <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-white flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-purple-400 block mb-2.5">
                🌸 GENTLE FOCUS DECK
              </span>
              <p className="text-xs text-slate-600 italic font-light leading-relaxed">
                &ldquo;{currentAffi}&rdquo;
              </p>
            </div>
            
            <button
              onClick={drawCard}
              className="mt-5 w-full py-2 bg-white hover:bg-slate-50 border border-purple-200 text-purple-600 text-xs font-semibold rounded-xl transition duration-300 shadow-3xs cursor-pointer active:scale-98 flex items-center justify-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Pull Healing Card</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
