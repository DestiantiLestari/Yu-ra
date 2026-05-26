export type MoodType = 'anxious' | 'burnt_out' | 'overthinking' | 'sad' | 'peaceful' | 'joyful';

export interface MoodEntry {
  id: string;
  score: number; // 1-5
  mood: MoodType;
  notes: string;
  timestamp: string; // ISO string
  stressors: string[]; // e.g. "Exams", "Relationship", "Family", "Job Search", "Self-image"
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  category: 'Overthinking' | 'Burnout' | 'Self-Love' | 'Deep Thoughts' | 'Gratitude' | 'General';
  isPrivate: boolean;
  pinCode?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'aura';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'student' | 'professional' | 'other';
  isPremium: boolean;
  joinedAt: string;
  dailyChecklist: {
    breathe: boolean;
    journal: boolean;
    moodLog: boolean;
    hydrate: boolean;
    selfCare: boolean;
  };
  stressChecklist: {
    feelingExhausted: boolean;
    frequentHeadaches: boolean;
    procrastination: boolean;
    isolation: boolean;
    sleepIssues: boolean;
  };
  waterIntake: number; // glasses (goal: 8)
}

export interface Affirmation {
  id: string;
  text: string;
  category: 'strength' | 'peace' | 'self-love' | 'academics' | 'burnout';
}
