
import React from 'react';

export enum ModuleType {
  LEARN = 'learn',
  PRACTICE = 'practice',
  LIBRARY = 'library',
  SAGETALK = 'sageTalk',
  REFLECT = 'reflect'
}

export type ThemeId = 'surya' | 'chandra' | 'mangala' | 'budha' | 'guru' | 'shukra' | 'shani';

// --- ACCESS CONTROL TYPES ---
export type AccessLevel = 'guest' | 'seeker' | 'sadhaka'; // Guest, LoggedIn, Premium

export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  isPremium: boolean;
  joinedDate: number;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  planet: string; // The Graha
  day: string; // Day of week
  icon: React.ElementType; // New: Icon for the theme
  colors: {
    primary: { // The "Saffron" replacement (Accent)
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    base: { // The "Stone" replacement (Day Backgrounds)
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    dark: { // The "Slate" replacement (High Contrast Elements)
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    }
  }
}

export interface Lesson {
  id: number;
  stage: number; // 1-12
  title: string;
  summary: {
    short: string;
    medium: string;
    long: string;
  };
  quiz: QuizQuestion[];
  flow: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface MokshaStage {
  id: number;
  name: string;
  description?: string;
}

export interface Sage {
  id: string;
  name: string;
  archetype: string;
  role: string;
  voice_style: {
    tone: string;
    pace: string;
    emotion: string;
    texture: string;
  };
  personality_traits: string[];
  knowledge_domains: string[];
  dialogue_patterns?: {
    style: string;
    examples: string[];
  };
  system_prompt: string;
  sample_responses?: string[];
  image_gradient_from: string;
  image_gradient_to: string;
  activation_conditions?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sageId: string; // Mandatory for session tracking
  timestamp: number;
}

// --- NEW SESSION TYPES ---

export interface BookSession {
  bookId: string;
  chapters: string[]; // The Table of Contents
  completedChapters: number[];
  chapterContentCache: Record<number, string>; // Index -> Markdown Content
  lastActiveIndex: number | null;
  richDescription?: string;
  lastAccessed: number;
}

export interface LessonSession {
  lessonId: number;
  completedSteps: number[];
  stepContentCache: Record<number, string>; // Index -> Markdown Content
  lastAccessed: number;
}

export interface UserProgress {
  userProfile?: UserProfile; // New: Holds auth details
  dailyUsageMinutes: number; // New: Tracks minutes used today
  lastResetTimestamp: number; // New: Tracks when usage was last reset
  
  completedLessons: number[];
  quizScores: Record<number, number>; // lessonId -> score
  journalEntries: JournalEntry[];
  settings: {
    activeSageId: string; // 'auto' or specific ID
    theme: 'day'; // Fixed to day
    activeThemeId: ThemeId; // New: Persisted Theme ID
    autoThemeMode: boolean; // New: Whether to auto-switch based on day/time
  };
  mastery_score: number;
  streaks: {
    current_streak: number;
    longest_streak: number;
  };
  last_active_lesson: number;
  // New Session Storage
  bookSessions: Record<string, BookSession>;
  lessonSessions: Record<number, LessonSession>;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood: string;
  tags: string[];
}

export interface LibraryBook {
  id: string;
  title: string;
  author?: string;
  category: string; // Layer 1 Category
  subCategory?: string; // From the catalog text
  description?: string;
  color: string;
}
