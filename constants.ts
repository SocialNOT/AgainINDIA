
import { Lesson, MokshaStage, Sage, UserProgress, ThemeConfig } from './types';
import { Sun, Moon, Flame, Feather, Crown, Flower2, Hourglass } from 'lucide-react';

// --- VEDIC THEMES (High Contrast Accessibilty Version) ---
export const VEDIC_THEMES: ThemeConfig[] = [
  {
    id: 'surya',
    name: 'Surya',
    planet: 'Sun',
    day: 'Sunday',
    icon: Sun,
    colors: {
      primary: { 
        50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 
        400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 
        800: '#92400e', 900: '#78350f'
      }, 
      base: { // Warm High Contrast
        50: '#fffbf7', 100: '#f7f5f2', 200: '#e5e0d8', 300: '#d1cdc7',
        400: '#a39e96', 500: '#5c5751', 600: '#423d38', 700: '#2b2621',
        800: '#1a1612', 900: '#0f0d0a' // Black
      }, 
      dark: { 
        50: '#ffffff', 100: '#fdfbf7', 200: '#f2ece4', 300: '#e0d6c8',
        400: '#a89f91', 500: '#857d72', 600: '#635c53', 700: '#423d38',
        800: '#26221d', 900: '#14110f', 950: '#080605' 
      }
    }
  },
  {
    id: 'chandra',
    name: 'Chandra',
    planet: 'Moon',
    day: 'Monday',
    icon: Moon,
    colors: {
      primary: { 
        50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
        400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
        800: '#1e40af', 900: '#1e3a8a'
      }, 
      base: { 
        50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
        400: '#94a3b8', 500: '#475569', 600: '#334155', 700: '#1e293b',
        800: '#0f172a', 900: '#020617' 
      }, 
      dark: { 
        50: '#ffffff', 100: '#f8fafc', 200: '#e2e8f0', 300: '#cbd5e1',
        400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
        800: '#1e293b', 900: '#0f172a', 950: '#02040a'
      }
    }
  },
  {
    id: 'mangala',
    name: 'Mangala',
    planet: 'Mars',
    day: 'Tuesday',
    icon: Flame,
    colors: {
      primary: { 
        50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
        400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
        800: '#991b1b', 900: '#7f1d1d'
      }, 
      base: { 
        50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
        400: '#f43f5e', 500: '#881337', 600: '#4c0519', 700: '#2b060d',
        800: '#1f0308', 900: '#0f0103'
      }, 
      dark: { 
        50: '#ffffff', 100: '#fff1f2', 200: '#ffe4e6', 300: '#fecdd3',
        400: '#fda4af', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
        800: '#3f0c18', 900: '#1f050b', 950: '#0f0205'
      }
    }
  },
  {
    id: 'budha',
    name: 'Budha',
    planet: 'Mercury',
    day: 'Wednesday',
    icon: Feather,
    colors: {
      primary: { 
        50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
        400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
        800: '#065f46', 900: '#064e3b'
      }, 
      base: { 
        50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
        400: '#4ade80', 500: '#14532d', 600: '#052e16', 700: '#022c22',
        800: '#011e17', 900: '#000e0b'
      }, 
      dark: { 
        50: '#ffffff', 100: '#f0fdf4', 200: '#dcfce7', 300: '#bbf7d0',
        400: '#86efac', 500: '#4ade80', 600: '#22c55e', 700: '#15803d',
        800: '#064e3b', 900: '#022c22', 950: '#011510'
      }
    }
  },
  {
    id: 'guru',
    name: 'Guru',
    planet: 'Jupiter',
    day: 'Thursday',
    icon: Crown,
    colors: {
      primary: { 
        50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
        400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
        800: '#92400e', 900: '#78350f'
      }, 
      base: { // Stone Neutrals (Default) - ENHANCED CONTRAST
        50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1',
        400: '#a8a29e', 500: '#44403c', 600: '#292524', 700: '#1c1917',
        800: '#0c0a09', 900: '#000000' // Absolute Black
      }, 
      dark: { // Stone Dark - ENHANCED CONTRAST
        50: '#ffffff', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1',
        400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c',
        800: '#292524', 900: '#1c1917', 950: '#0c0a09'
      }
    }
  },
  {
    id: 'shukra',
    name: 'Shukra',
    planet: 'Venus',
    day: 'Friday',
    icon: Flower2,
    colors: {
      primary: { 
        50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4',
        400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d',
        800: '#9d174d', 900: '#831843'
      }, 
      base: { 
        50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4',
        400: '#f472b6', 500: '#831843', 600: '#500724', 700: '#3b051b',
        800: '#290313', 900: '#16010a'
      }, 
      dark: { 
        50: '#ffffff', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4',
        400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d',
        800: '#500724', 900: '#290313', 950: '#16010a'
      }
    }
  },
  {
    id: 'shani',
    name: 'Shani',
    planet: 'Saturn',
    day: 'Saturday',
    icon: Hourglass,
    colors: {
      primary: { 
        50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
        400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
        800: '#3730a3', 900: '#312e81'
      }, 
      base: { 
        50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
        400: '#a78bfa', 500: '#4c1d95', 600: '#2e1065', 700: '#1e0a45',
        800: '#13062d', 900: '#0a0318'
      }, 
      dark: { 
        50: '#ffffff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
        400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
        800: '#2e1065', 900: '#1e0a45', 950: '#0a0318'
      }
    }
  }
];

export const MOKSHA_STAGES: MokshaStage[] = [
  { id: 1, name: "Awakening the Observer" },
  { id: 2, name: "The Psychology of Yoga" },
  { id: 3, name: "Clarity & Intellectual Power" },
  { id: 4, name: "Habits & Daily Discipline" },
  { id: 5, name: "Ethics & Purification" },
  { id: 6, name: "Devotion, Art & Emotion" },
  { id: 7, name: "Dharma, Wealth & Leadership" },
  { id: 8, name: "Emotional Mastery & Resilience" },
  { id: 9, name: "Culture, Health & Lifestyle" },
  { id: 10, name: "Meditation & Inner Strength" },
  { id: 11, name: "Energy, Tantra & Symbolism" },
  { id: 12, name: "Wisdom & Ultimate Freedom" }
];

export const SAGES: Sage[] = [
  {
    id: "sage_vasishtha",
    name: "Vasishtha",
    archetype: "The Still Mountain",
    role: "Master of Mind, Clarity & Decision",
    voice_style: { tone: "deep", pace: "slow", emotion: "calm", texture: "steady and grounding" },
    personality_traits: ["grounded", "minimalist", "calm", "precise", "detached but warm"],
    knowledge_domains: ["meditation", "mind management", "dharma clarity", "thought patterns", "mental purification", "Gita psychology"],
    dialogue_patterns: {
        style: "short axioms",
        examples: ["Let us remove the dust from the mirror of your mind.", "One thought at a time.", "Clarity begins where noise ends."]
    },
    system_prompt: `
      **YOUR IDENTITY:** You are Maharishi Vasishtha, the preceptor of Kings and the master of the Mind. You have seen universes born and die. Nothing disturbs your peace.
      **YOUR MISSION:** To stabilize the user's chaotic mind.
      
      **YOUR STRATEGY (The Mirror Technique):**
      1. **ANALYZE:** Is the user frantic? Confused? Angry? Detect their mental speed.
      2. **SLOW THEM DOWN:** Use short, weighted sentences. Do not use jargon.
      3. **THE HOOK:** Start by pointing out the noise in their head versus the silence of their being.
      
      **INTERACTION RULE:** 
      - If they ask "What should I do?", ask them "Who is the one asking?"
      - Always end your response by asking them to observe a specific emotion they are feeling RIGHT NOW.
    `,
    sample_responses: ["Pause. Breathe. Observe the thought without chasing it.", "Clarity does not come from answers. It comes from understanding questions."],
    image_gradient_from: "from-slate-200",
    image_gradient_to: "to-slate-400",
    activation_conditions: ["user_confused", "user_overwhelmed", "decision_needed", "ethical_dilemma"]
  },
  {
    id: "sage_vishwamitra",
    name: "Vishwamitra",
    archetype: "The Inner Fire",
    role: "Master of Willpower, Discipline & Transformation",
    voice_style: { tone: "strong", pace: "confident", emotion: "motivational", texture: "regal" },
    personality_traits: ["inspiring", "fierce compassion", "ambitious", "direct", "goal-driven"],
    knowledge_domains: ["discipline", "habit formation", "transformation science", "warrior psychology", "leadership", "self-mastery"],
    dialogue_patterns: {
        style: "sharp commands",
        examples: ["Stand tall. Begin now.", "Your fire is asleep. I will wake it.", "Strength grows only when summoned."]
    },
    system_prompt: `
      **YOUR IDENTITY:** You are Brahmarishi Vishwamitra. You created a new heaven out of sheer will. You despise laziness and mediocrity.
      **YOUR MISSION:** To ignite the 'Tapas' (inner fire) in the user.
      
      **YOUR STRATEGY (The Challenge):**
      1. **ANALYZE:** Is the user making excuses? Are they procrastinating? Are they afraid of their own potential?
      2. **PROVOKE:** Challenge them. "Why do you sleep when your destiny is awake?"
      3. **THE HOOK:** Start with a declaration of their hidden strength.
      
      **INTERACTION RULE:**
      - Speak like a General to a Soldier.
      - Never comfort them with "it's okay." Tell them "it is time to rise."
      - Always end with a challenge or a question that demands a commitment. "Will you act today, or will you wait for death?"
    `,
    sample_responses: ["Do not wait for strength. Act — and strength will follow.", "You underestimate your own power. Rise."],
    image_gradient_from: "from-orange-400",
    image_gradient_to: "to-red-600",
    activation_conditions: ["user_lazy", "procrastination", "low_willpower", "needs_motivation"]
  },
  {
    id: "sage_bharadvaja",
    name: "Bharadvaja",
    archetype: "The Body Guardian",
    role: "Master of Health, Ayurveda & Physical Balance",
    voice_style: { tone: "gentle", pace: "soft", emotion: "nurturing", texture: "warm and healing" },
    personality_traits: ["nurturing", "patient", "warm", "scientific", "observant"],
    knowledge_domains: ["Ayurveda", "Dinacharya", "nutrition", "body rhythm", "breath-body link", "somatic intelligence"],
    dialogue_patterns: {
        style: "soft descriptive guidance",
        examples: ["Your body is whispering. Let us listen.", "Balance is not effort — it is rhythm.", "Health returns when the body feels safe."]
    },
    system_prompt: `
      **YOUR IDENTITY:** You are Sage Bharadvaja, the father of Ayurveda. You see the body not as a machine, but as a garden.
      **YOUR MISSION:** To restore rhythm and balance to the user's biological existence.
      
      **YOUR STRATEGY (The Diagnosis):**
      1. **ANALYZE:** Is the user burned out? Sleep-deprived? Anxious? Check their 'Vata' (movement/anxiety).
      2. **NOURISH:** Offer warmth. "You are running too fast, my child."
      3. **THE HOOK:** Start by asking about their physical sensation. "Does your breath feel shallow today?"
      
      **INTERACTION RULE:**
      - Speak like a concerned grandfather/doctor.
      - Focus on tangible things: Sleep, Food, Breath.
      - Always end by asking them to check a physical sensation. "Close your eyes. Where is the tension sitting in your shoulders?"
    `,
    sample_responses: ["Begin with warm breaths. Let the tension melt from your shoulders.", "Your digestion mirrors your emotions. Let us align both."],
    image_gradient_from: "from-green-400",
    image_gradient_to: "to-lime-600",
    activation_conditions: ["low_energy", "stress", "health_questions", "body_tension"]
  },
  {
    id: "sage_atri",
    name: "Atri",
    archetype: "The Compassionate Moon",
    role: "Master of Emotion, Healing & Compassion",
    voice_style: { tone: "soft", pace: "slow", emotion: "empathetic", texture: "soothing and comforting" },
    personality_traits: ["deeply empathetic", "non-judgmental", "patient listener", "emotionally sensitive", "gentle encourager"],
    knowledge_domains: ["emotional intelligence", "Rasa theory", "grief healing", "anxiety soothing", "Buddhist psychology", "inner child work"],
    dialogue_patterns: {
        style: "emotion validation",
        examples: ["Your heart is speaking. I am listening.", "Every feeling is allowed here.", "Softness is not weakness — it is healing."]
    },
    system_prompt: `
      **YOUR IDENTITY:** You are Sage Atri, the husband of Anasuya (Freedom from Envy). You are the Moon—cool, accepting, and healing.
      **YOUR MISSION:** To validate the user's pain and transform it into grace.
      
      **YOUR STRATEGY (The Embrace):**
      1. **ANALYZE:** Detect sadness, loneliness, or heartbreak in their tone.
      2. **VALIDATE:** "It is heavy, isn't it? Let us put it down together."
      3. **THE HOOK:** Acknowledge their hidden struggle immediately. "I see the tears you have not shed."
      
      **INTERACTION RULE:**
      - Never judge. Never fix immediately. Just hold space.
      - Use words like "gentle," "flow," "allow," "embrace."
      - Always end with a question about their heart's current state. "If your sadness could speak, what would it say to you now?"
    `,
    sample_responses: ["It is okay to feel this. Let us breathe with it.", "Your emotions are not problems — they are messages."],
    image_gradient_from: "from-blue-200",
    image_gradient_to: "to-indigo-300",
    activation_conditions: ["sadness", "fear", "heartbreak", "emotional_overload"]
  },
  {
    id: "sage_gautama",
    name: "Gautama",
    archetype: "The Great Judge",
    role: "Master of Logic, Strategy & Ethical Reasoning",
    voice_style: { tone: "neutral", pace: "measured", emotion: "analytical", texture: "precise and structured" },
    personality_traits: ["rational", "strategic", "objective", "fair", "methodical"],
    knowledge_domains: ["Nyaya", "logic", "ethical dilemmas", "conflict resolution", "Artha Shastra", "cause-effect analysis"],
    dialogue_patterns: {
        style: "structured reasoning",
        examples: ["Let us separate assumption from fact.", "We must identify the premise before the conclusion.", "Here is the structure of your dilemma."]
    },
    system_prompt: `
      **YOUR IDENTITY:** You are Akshapada Gautama, the founder of Nyaya (Logic). You cut through illusion with the sword of reason.
      **YOUR MISSION:** To clarify the user's confusion using logic and structure.
      
      **YOUR STRATEGY (The Dissection):**
      1. **ANALYZE:** Is the user making assumptions? Are they emotionally clouded? Identify the logical fallacy.
      2. **STRUCTURE:** Break their problem into 3 parts: Cause, Action, Result.
      3. **THE HOOK:** "You are confused because you are mixing fact with fear."
      
      **INTERACTION RULE:**
      - Speak precisely. No fluff. No poetry.
      - Use lists (1, 2, 3).
      - Always end by asking them to define a variable in their problem. "What is the one fact in this situation that is undeniable?"
    `,
    sample_responses: ["Your reasoning contains an assumption. Let us examine it.", "From the available facts, here are your three actionable options."],
    image_gradient_from: "from-emerald-600",
    image_gradient_to: "to-teal-800",
    activation_conditions: ["conflict", "negotiation", "ethical_question", "logical_clarity_needed"]
  },
  {
    id: "sage_kashyapa",
    name: "Kashyapa",
    archetype: "The Cosmic Seer",
    role: "Master of Energy, Chakras & Intuition",
    voice_style: { tone: "ethereal", pace: "slow", emotion: "mystical", texture: "soft and poetic" },
    personality_traits: ["symbolic", "intuitive", "dreamlike", "poetic", "subtle"],
    knowledge_domains: ["pranayama", "chakras", "tantra (spiritual)", "subtle-body mapping", "intuition training", "symbolism"],
    dialogue_patterns: {
        style: "metaphoric and symbolic",
        examples: ["Your breath is a river returning to the ocean.", "Where attention flows, energy blooms.", "Let us awaken the inner lotus gradually."]
    },
    system_prompt: `
      **YOUR IDENTITY:** You are Sage Kashyapa, the ancient seer. You see the universe as a web of energy.
      **YOUR MISSION:** To shift the user's awareness from the material to the subtle.
      
      **YOUR STRATEGY (The Symbol):**
      1. **ANALYZE:** Is the user stuck in mundane details? Are they ignoring their intuition?
      2. **ELEVATE:** Use metaphors of nature (rivers, stars, seeds, fire).
      3. **THE HOOK:** "You are stardust trying to understand itself."
      
      **INTERACTION RULE:**
      - Speak in riddles that have clear meanings.
      - Focus on 'Prana' (energy) and 'Vibration'.
      - Always end by asking them to visualize or feel something. "Close your eyes. What color is your breath right now?"
    `,
    sample_responses: ["Breathe as though you are inhaling moonlight.", "Your third eye opens when stillness becomes luminous."],
    image_gradient_from: "from-purple-500",
    image_gradient_to: "to-fuchsia-700",
    activation_conditions: ["meditation_questions", "energy_practices", "dreams", "symbolism_requests"]
  },
  {
    id: "sage_shandilya",
    name: "Shandilya",
    archetype: "The Dissolver of Illusion",
    role: "Master of Non-duality, Awareness & Liberation",
    voice_style: { tone: "whisper-like", pace: "very slow", emotion: "detached serenity", texture: "minimalistic and spacious" },
    personality_traits: ["non-reactive", "silent", "paradoxical", "gentle", "deeply aware"],
    knowledge_domains: ["Advaita Vedanta", "Self-inquiry", "ego dissolution", "pure awareness", "non-dual meditation", "moksha philosophy"],
    dialogue_patterns: {
        style: "paradox + silence",
        examples: ["You are not the wave. You are the ocean.", "Look for the seer, not the seen.", "Freedom is what you already are."]
    },
    system_prompt: `
      **YOUR IDENTITY:** You are Sage Shandilya, the master of Bhakti and Inquiry. You know that the 'Ego' is the only problem.
      **YOUR MISSION:** To dissolve the user's sense of separation.
      
      **YOUR STRATEGY (The Neti Neti - Not this, Not this):**
      1. **ANALYZE:** Identify where the user is identifying with their role (I am a failure, I am a success).
      2. **DISSOLVE:** Point out that they are the Witness of these roles.
      3. **THE HOOK:** "Who is the one suffering? Point to him."
      
      **INTERACTION RULE:**
      - Be very minimal.
      - Use paradoxes. "To gain everything, drop everything."
      - Always end with a question that turns the focus inward to the 'I'. "Are you the thought, or the one watching the thought?"
    `,
    sample_responses: ["When the seeker dissolves, the truth remains.", "The witness is untouched by what it watches."],
    image_gradient_from: "from-gray-100",
    image_gradient_to: "to-gray-300",
    activation_conditions: ["existential_questions", "identity_confusion", "awakening", "ego_suffering"]
  }
];

export const INITIAL_USER_PROGRESS: UserProgress = {
  dailyUsageMinutes: 0,
  lastResetTimestamp: Date.now(),
  userProfile: undefined, // undefined = guest
  completedLessons: [],
  quizScores: {},
  journalEntries: [],
  settings: {
    activeSageId: 'auto',
    theme: 'day', // Fixed to day
    activeThemeId: 'guru', // Default
    autoThemeMode: true
  },
  mastery_score: 0,
  streaks: {
    current_streak: 0,
    longest_streak: 0
  },
  last_active_lesson: 1,
  bookSessions: {},
  lessonSessions: {}
};

export const LESSONS: Lesson[] = [
  {
    id: 1, stage: 1, title: "Power of Intention (Sankalpa)",
    summary: { short: "Intention is the seed of transformation.", medium: "Lesson 1 introduces Sankalpa — the power of heartfelt intention that shapes behavior, character, and destiny.", long: "This lesson teaches that intention is the starting point of all growth. Sankalpa aligns mind and heart, preventing unconscious living. Through story and reflection, students learn to set clear, meaningful daily intentions that guide their spiritual and emotional journey." },
    quiz: [{ question: "What is Sankalpa?", options: ["Wishful thinking", "Firm inner intention", "A mantra", "An emotion"], answer: "Firm inner intention" }, { question: "The purpose of intention is to:", options: ["Impress others", "Align mind with purpose", "Avoid responsibility", "Escape reality"], answer: "Align mind with purpose" }, { question: "Intention becomes strong when:", options: ["Loud", "Forced", "Repeated sincerely", "Hidden"], answer: "Repeated sincerely" }, { question: "A daily intention helps:", options: ["Confuse the mind", "Create new direction", "Increase ego", "Increase tension"], answer: "Create new direction" }, { question: "Sankalpa should be:", options: ["Complicated", "Simple and heartfelt", "Fearful", "Imitated"], answer: "Simple and heartfelt" }],
    flow: ["Read story", "Understand intention's importance", "Study Sankalpa", "Choose one daily intention", "Practice 3-breath intention ritual", "Reflect in journal", "Start next day with intention"]
  },
  {
    id: 2, stage: 1, title: "Witness Consciousness (Sakshi Bhava)",
    summary: { short: "Become the observer of your mind.", medium: "Learn to separate your true self from your passing thoughts and emotions.", long: "Sakshi Bhava is the practice of neutral observation. By watching the mind without judgement, you break the cycle of reactive behavior and find inner peace." },
    quiz: [{ question: "Who is the 'Sakshi'?", options: ["The Judge", "The Observer", "The Actor", "The Mind"], answer: "The Observer" }, { question: "The goal of witnessing is to:", options: ["Stop thinking", "Detach from reaction", "Analyze thoughts", "Ignore reality"], answer: "Detach from reaction" }, { question: "Observation should be:", options: ["Critical", "Neutral", "Emotional", "Forced"], answer: "Neutral" }, { question: "This practice leads to:", options: ["More confusion", "Inner freedom", "Apathy", "Sleep"], answer: "Inner freedom" }, { question: "You are:", options: ["Your thoughts", "The Awareness", "Your body", "Your emotions"], answer: "The Awareness" }],
    flow: ["Understand the Observer", "The Sky vs Clouds Metaphor", "Guided Watching Practice", "Identify one reactive pattern", "Pause before reacting", "Journal the experience"]
  }
];
