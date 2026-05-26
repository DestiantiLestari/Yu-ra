import { Affirmation } from './types';

export const AFFIRMATIONS: Affirmation[] = [
  { id: '1', text: "Your worth is not measured by your productivity. It is okay to rest.", category: 'burnout' },
  { id: '2', text: "I release the pressure to hold everything together. I am allowed to just be.", category: 'peace' },
  { id: '3', text: "I deserve the same gentle compassion that I so freely give to others.", category: 'self-love' },
  { id: '4', text: "My growth isn't linear. Every small step, even a pause, is progress.", category: 'strength' },
  { id: '5', text: "I stand securely in my intelligence. I call in wisdom, not perfection.", category: 'academics' },
  { id: '6', text: "Exams and grades do not define the brilliant light inside of me.", category: 'academics' },
  { id: '7', text: "I am breathing in peace, and breathing out the need to controls everything.", category: 'peace' },
  { id: '8', text: "My heart is beautiful, my mind is resilient, and I am safely held.", category: 'self-love' },
  { id: '9', text: "It's safe to say no. Protecting my energy is an act of deep reverence.", category: 'strength' },
  { id: '10', text: "I am healing from expectations. I bloom beautifully in my own time.", category: 'burnout' }
];

export const JOURNAL_PROMPTS = [
  { category: 'Overthinking', prompt: "What is one scenario I am rehashing in my head right now, and how can I gently let it sink into the background?" },
  { category: 'Burnout', prompt: "If my body could speak to me right now in a soft whisper, what would it ask me to do?" },
  { category: 'Self-Love', prompt: "Write down 3 things you deeply appreciate about your personality that are completely unrelated to achievement." },
  { category: 'Gratitude', prompt: "Describe a small sensory delight from today—a warm cup of tea, a soft blanket, or the smell of rain." },
  { category: 'Deep Thoughts', prompt: "What is a boundary I want to establish this week to preserve my peace of mind?" }
];

export const SOUNDSCAPES = [
  { id: 'rain', name: 'Garden Rain', icon: 'CloudRain', url: 'rain-simulated' },
  { id: 'forest', name: 'Forest Streams', icon: 'Trees', url: 'forest-simulated' },
  { id: 'harp', name: 'Celestial Harp', icon: 'Music4', url: 'harp-simulated' },
  { id: 'waves', name: 'Sunset Waves', icon: 'Waves', url: 'waves-simulated' },
  { id: 'white', name: 'Cosmic Blush Noise', icon: 'Sparkles', url: 'white-simulated' }
];

export const INITIAL_MOOD_HISTORY = [
  { id: 'm1', score: 2, mood: 'burnt_out', notes: 'Had back-to-back group project reviews. Feeling totally depleted.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), stressors: ['Exams & Projects', 'Fatigue'] },
  { id: 'm2', score: 3, mood: 'overthinking', notes: 'Worrying about internships. Constantly refreshing emails.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), stressors: ['Career Anxiety', 'Social Media'] },
  { id: 'm3', score: 4, mood: 'peaceful', notes: 'Took a morning walk through the botanical gardens. Quiet mind.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), stressors: [] },
  { id: 'm4', score: 5, mood: 'joyful', notes: 'Had an amazing video call with mom and childhood friends.', timestamp: new Date().toISOString(), stressors: [] }
];

export const INITIAL_JOURNAL_ENTRIES = [
  {
    id: 'j1',
    title: 'The Unspoken Weight of Perfectionism',
    content: "Today I realized how much I fear failure. In college, we are constantly graded and sorted. It feels like every test is a judgment on my destiny. But as I wrote today, I reminded myself that my heart is independent of GPAs. I am gentle with myself.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Burnout',
    isPrivate: false
  },
  {
    id: 'j2',
    title: 'My Sanctuary of Calm',
    content: "I want to recall the cozy smell of lavender tea on my desk tonight. The lighting is warm and amber. I am resting. Aura suggested I put my phone away and focus on deep abdominal breathing. It actually helped settle my chest tight feelings.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: 'Self-Love',
    isPrivate: true,
    pinCode: '1111'
  }
];
