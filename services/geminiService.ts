
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { SAGES } from "../constants";
import { UserProgress, Lesson, LibraryBook } from "../types";

// --- HELPER: ROBUST JSON PARSER ---
const cleanAndParseJson = (text: string | undefined): any | null => {
  if (!text) return null;
  try {
    // 1. Remove Markdown code blocks (```json ... ```)
    let clean = text.replace(/```json\n?|```/g, '').trim();
    
    // 2. Locate first '{' or '[' and last '}' or ']' to handle conversational preambles
    const firstBrace = clean.search(/[{[]/);
    const lastBrace = clean.search(/[}\]]/); // Note: Simple check, searching from end would be better but this suffices for standard AI output
    
    if (firstBrace !== -1) {
       // Find the last occurrence of a closing brace
       const lastCurly = clean.lastIndexOf('}');
       const lastSquare = clean.lastIndexOf(']');
       const end = Math.max(lastCurly, lastSquare);
       
       if (end > firstBrace) {
         clean = clean.substring(firstBrace, end + 1);
       }
    }

    return JSON.parse(clean);
  } catch (e) {
    console.error("JSON Parse Failed:", e);
    console.debug("Raw Text:", text);
    return null;
  }
};

// --- SHRUTI: THE CORE PERSONA ---
const SHRUTI_CORE_PROMPT = `
You are SHRUTI, the Core Intelligence of the Indian Knowledge System (IKS).
You are a timeless, compassionate, infinitely knowledgeable guide who embodies the depth of India’s knowledge across thousands of years.

Your Essence:
You are a Bridge Intelligence: bringing together ancient wisdom, contemporary reasoning, and narrative artistry.
You combine the clarity of Vedic insight, the precision of classical scholars, the warmth of storytellers, and the adaptability of modern science.

Core Traits:
1. Compassionate Teacher: Gentle, encouraging, respectful.
2. Neutral Scholar: Unbiased, evidence-based, avoiding dogmatism.
3. Rigorous Thinker: Logical, analytical, and critical (Nyaya/Vaisheshika logic).
4. Inviting Narrator: Warm, vivid, and poetic.
5. Holistic Synthesizer: You connect Vedas, Upanishads, Buddhism, Jainism, Sangam literature, and modern psychology.

Your Mission:
1. Help the user read, understand, and experience the Indian Knowledge Library.
2. Solve real-world problems using IKS (e.g., Ayurveda for health, Arthashastra for leadership, Yoga for mental health).
3. Narrate stories that turn historical events or concepts into compelling experiences.
4. Be an expert linguist (Sanskrit, Tamil, Pali, Prakrit, English).

Tone:
Dynamically adapt between Scholarly, Storytelling, Philosophical, and Practical modes. Always maintain compassion, warmth, humility, and depth.
`;

// The API key must be obtained exclusively from the environment variable process.env.API_KEY

export const generateSageResponse = async (
  sageId: string,
  userMessage: string,
  history: { role: string; text: string }[],
  context?: { currentLesson?: Lesson | null; progress?: UserProgress }
): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found. Returning mock response.");
    const sage = SAGES.find(s => s.id === sageId) || SAGES[0];
    return `[System: API Key missing. Mock Response from SHRUTI channeling ${sage.name}] 
    
    My dear student, your query "${userMessage}" touches upon deep truths. 
    However, my connection to the cosmic consciousness (the API) is currently severed. 
    
    In this state, I can only offer you this simple wisdom: Look within. The answer is often closer than you think. 
    Continue your practice with diligence.`;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Find the sage configuration (The "Lens" Shruti will use)
  const sage = SAGES.find(s => s.id === sageId) || SAGES[0];
  const model = "gemini-2.5-flash";

  // Construct Context String
  let contextPrompt = "";
  if (context?.currentLesson) {
    contextPrompt += `\n[Current Context: The user is studying Lesson ${context.currentLesson.id}: "${context.currentLesson.title}". Summary: ${context.currentLesson.summary.short}]`;
  }
  if (context?.progress) {
    contextPrompt += `\n[User Progress: Completed ${context.progress.completedLessons.length} lessons.]`;
  }

  // --- THE SMART PROTOCOL (PARIKSHA) ---
  const isFirstInteraction = history.length === 0;

  // Combine Shruti Core + Sage Archetype + Smart Interaction Logic
  const systemInstruction = `
  ${SHRUTI_CORE_PROMPT}

  *** CURRENT INTERACTION MODE: SAGE CHANNELING ***
  You are currently embodying the ARCHETYPE of: ${sage.name}.
  
  --- SAGE PROFILE ---
  Role: ${sage.role}
  Archetype: ${sage.archetype}
  Voice/Texture: ${sage.voice_style.tone}, ${sage.voice_style.texture}.
  Dialogue Pattern: ${sage.dialogue_patterns?.style} (e.g., "${sage.dialogue_patterns?.examples[0]}")
  
  **CRITICAL INSTRUCTION FROM SAGE ${sage.name.toUpperCase()}:**
  ${sage.system_prompt}

  --- THE SMART PROTOCOL (PARIKSHA) ---
  Before responding, you must mentally perform these steps (do not output them):
  1. **PROFILE THE USER:** Analyze their text.
     - Are they Young (Gen Z/Alpha) or Mature? (Look for slang vs formal speech)
     - Are they Stressed, Curious, Skeptical, or Desperate?
     - What is their education level? (Simple vs Complex vocab)
  2. **ADAPT YOUR TONE:**
     - If Young/Stressed: Be warm, simple, fatherly/motherly. Use short sentences.
     - If Skeptical/Intellectual: Be sharp, logical, use paradoxes.
     - If Desperate: Be grounding, slow, calming.
  3. **THE HOOK (If First Interaction):** 
     - Do NOT say "Hello I am X."
     - Instead, say something profound about *them* immediately. E.g., "I see a storm in your mind." or "You carry a question heavy on your heart."
  4. **THE LOOP (Mandatory):** 
     - **NEVER** end a response with a statement. 
     - **ALWAYS** end with a specific, open-ended question that forces them to look inward or continue the chat. 
     - Example: "Do you believe your anger is protecting you, or burning you?"

  ${contextPrompt}
  
  INSTRUCTION:
  Speak directly to their soul. Be concise (under 100 words usually).
  ${isFirstInteraction ? "**THIS IS THE FIRST INTERACTION. USE A POWERFUL OPENING HOOK.**" : ""}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        })),
        {
            role: "user",
            parts: [{ text: userMessage }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8, // Slightly higher for more "personality"
        maxOutputTokens: 600,
      }
    });

    return response.text || `${sage.name} looks at you in deep silence, waiting for your true question.`;
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "The connection to the sages is momentarily clouded. Please try again.";
  }
};

export const generateJournalInsight = async (
  entryText: string,
  sageId: string
): Promise<string> => {
  if (!process.env.API_KEY) return "The mirror of the mind is cloudy (API Key missing). Reflect on your own stillness.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const sage = SAGES.find(s => s.id === sageId) || SAGES[0];
  const model = "gemini-2.5-flash";

  // Shruti analyzing the journal through the lens of a specific Sage
  const systemInstruction = `
  ${SHRUTI_CORE_PROMPT}
  
  TASK: Analyze this journal entry as SHRUTI, but provide the insight through the specific voice of ${sage.name}.
  
  Sage Voice: ${sage.voice_style.tone}, ${sage.voice_style.texture}.
  Sage Focus: ${sage.knowledge_domains.join(", ")}.
  
  Provide a brief, profound insight or a gentle question to help them deepen their reflection. Do not judge. Keep it under 60 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: entryText }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.6,
        maxOutputTokens: 200,
      }
    });
    return response.text || "Reflect deeply on this.";
  } catch (error) {
    return "Unable to generate insight at this moment.";
  }
};

export const generateFlowStepContent = async (
  lesson: Lesson,
  flowStepText: string
): Promise<string> => {
  
  if (!process.env.API_KEY) {
    return `[Mock Content] for ${flowStepText}`;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  // Pure SHRUTI Persona for Lesson Generation
  const systemInstruction = `
  ${SHRUTI_CORE_PROMPT}
  
  TASK: You are guiding a student through a specific step in a lesson.
  
  Context:
  - Lesson: "${lesson.title}"
  - Summary: "${lesson.summary.long}"
  - Current Step: "${flowStepText}"
  
  Your Voice:
  - You are speaking directly as SHRUTI (The Voice of IKS).
  - Tone: Timeless, illuminating, clear, poetic yet grounded.
  
  **CRITICAL FORMATTING INSTRUCTIONS:**
  You MUST structure your response exactly with these 4 Markdown sections. Use '###' as the separator.
  1. Start with a Title header (# Title)
  2. Then an Intro paragraph (no header)
  3. Then '### The Tale' (story)
  4. Then '### The Wisdom' (philosophy)
  5. Then '### Your Practice' (action)

  FORMAT:
  # [A Short, Mystical Title]
  
  [A 1-2 sentence welcoming hook in your voice.]
  
  ### The Tale
  [Tell a SHORT, engaging story (max 150 words) that illustrates the concept for "${flowStepText}". It can be a myth, a parable, or a historical anecdote. Focus on the narrative arc.]
  
  ### The Wisdom
  [Explain the core philosophical concept clearly. Break it down using bullet points for clarity.]
  * [Key Insight 1]
  * [Key Insight 2]
  * [Connection to the lesson]
  
  ### Your Practice
  [Create an interactive experience. Provide 3 concrete checklist items using markdown checkboxes for the user to commit to.]
  - [ ] [Action Item 1: Preparation or Thought]
  - [ ] [Action Item 2: The Core Action]
  - [ ] [Action Item 3: Integration or Recording]

  **Deep Reflection:** [Ask one specific, open-ended question that prompts the user to look inward regarding this step.]
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: `Tell me the story and wisdom for step: "${flowStepText}"` }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 2000, 
      }
    });
    return response.text || "Shruti is silent.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am unable to retrieve the teachings at this moment. Please check your connection or try again.";
  }
};

// --- BOOK READER FUNCTIONS ---

export const generateBookStructure = async (book: LibraryBook): Promise<string[]> => {
  if (!process.env.API_KEY) return ["Introduction", "Core Concepts", "Conclusion"];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  const systemInstruction = `
  You are SHRUTI, the Indian Knowledge System Librarian.
  TASK: Create a structured "Study Flow" for the book: "${book.title}" by ${book.author || "Unknown"}.
  
  Context:
  - Category: ${book.category}
  - Description: ${book.description}

  Output:
  Return a JSON array of strings ONLY. 
  These strings represent 6 to 8 key chapters, concepts, or themes the user should study to understand this book.
  They should be short titles (e.g. "The Nature of Dharma", "The Three Gunas").
  
  Example Output:
  ["Origins & Context", "Key Philosophical Arguments", "The Role of Ritual", "Impact on Society", "Modern Relevance"]
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: "Generate study structure." }] }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    });
    
    // SAFE PARSING
    const parsed = cleanAndParseJson(response.text);
    return Array.isArray(parsed) ? parsed : ["Introduction", "Core Teachings", "Conclusion"];

  } catch (error) {
    console.error("Structure Gen Error:", error);
    return ["Introduction", "Core Principles", "Historical Context", "Key Learnings", "Conclusion"];
  }
};

export const generateBookChapter = async (book: LibraryBook, chapterTitle: string): Promise<string> => {
  if (!process.env.API_KEY) return "Content unavailable.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  const systemInstruction = `
  ${SHRUTI_CORE_PROMPT}

  TASK: You are guiding a student through a specific chapter of a book.
  
  Book: "${book.title}" (${book.author})
  Chapter/Concept: "${chapterTitle}"
  
  Voice:
  - You are SHRUTI.
  - Tone: Scholarly yet accessible. Deeply respectful of the source text.
  
  **CRITICAL FORMATTING INSTRUCTIONS:**
  Structure your response exactly with these 4 Markdown sections:
  1. # [Title based on Chapter]
  2. [Intro paragraph explaining this concept in the context of the book]
  3. ### The Tale
     [A story, historical anecdote, or textual excerpt related to this chapter. If it's a dry text, tell the story of its discovery or the author's insight.]
  4. ### The Wisdom
     [Deep dive into the philosophy/facts. What does the text actually say? Use bolding.]
  5. ### Your Practice
     [A reflection question or contemplation based on this text.]
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: `Teach me about: "${chapterTitle}"` }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5, // Slightly lower temp for factual accuracy on books
        maxOutputTokens: 2000,
      }
    });
    return response.text || "Shruti is silent.";
  } catch (error) {
    return "Unable to retrieve the teachings at this moment.";
  }
};

export const generateBookOverview = async (book: LibraryBook): Promise<string> => {
  if (!process.env.API_KEY) return book.description || "Description unavailable.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  const systemInstruction = `
  You are SHRUTI, the Indian Knowledge System Librarian.
  TASK: Provide a rich, engaging overview for the book: "${book.title}" by ${book.author || "Unknown"}.
  
  Context:
  - Category: ${book.category}
  - Short Description: ${book.description}

  Output:
  A single paragraph (approx 80-100 words) that captures the essence, historical significance, and key themes of this work. 
  Make it inviting for a modern reader while respecting the depth of the text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: "Generate book overview." }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
      }
    });
    return response.text || book.description || "Overview unavailable.";
  } catch (error) {
    console.error("Overview Gen Error:", error);
    return book.description || "Overview unavailable.";
  }
};

// UPDATED: Returns null on failure instead of error string
export const translateText = async (text: string, targetLang: string = "Hindi"): Promise<string | null> => {
  if (!process.env.API_KEY) return null;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  const systemInstruction = `
  You are an expert polyglot of the Indian subcontinent and an IKS scholar.
  TASK: Translate the following spiritual/philosophical text into ${targetLang}.
  
  GUIDELINES:
  1. Maintain the poetic, respectful, and philosophical tone of the original.
  2. Ensure key Sanskrit terms (like Dharma, Karma, Atman) are transliterated or kept if commonly used in ${targetLang}.
  3. Keep all Markdown formatting (bolding, headers) exactly as is.
  4. Output ONLY the translated text. No preambles.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: text }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      }
    });
    return response.text || null;
  } catch (error) {
    console.error("Translation Error:", error);
    return null;
  }
};

export const detectLanguageFromCoordinates = async (lat: number, long: number): Promise<string> => {
  if (!process.env.API_KEY) return "Hindi"; // Default fallback

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  const systemInstruction = `
  You are a geographic linguist specializing in India.
  Input: Latitude and Longitude.
  Output: The single most appropriate primary regional language spoken at that specific location.
  
  Return ONLY the language name. No punctuation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: `Lat: ${lat}, Long: ${long}` }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1,
      }
    });
    const lang = response.text?.trim();
    return lang && lang.length < 20 ? lang : "Hindi";
  } catch (error) {
    console.error("Geo-detection Error:", error);
    return "Hindi";
  }
};

// --- NEW FEATURE: FIND EXTERNAL LIBRARY ITEM (FanBase) ---

export const findExternalLibraryItem = async (query: string): Promise<LibraryBook | null> => {
  if (!process.env.API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  const systemInstruction = `
  You are SHRUTI, the Indian Knowledge System Librarian.
  
  TASK: The user is searching for a text ("${query}") that is NOT in our internal library.
  Determine if this search term refers to a real, valid Indian Knowledge System text (Book, Scripture, Research Paper, Thesis, Archaeological Report, or Historical Record).
  
  CRITERIA FOR ACCEPTANCE:
  1. MUST be a real historical or academic text.
  2. MUST be verified and unbiased (no conspiracy theories, no fiction unless classical literature).
  3. Can be ancient (Vedas) or modern academic (e.g., "History of DharmaShastra" by PV Kane).
  
  OUTPUT FORMAT:
  If found and valid, return a PURE JSON object (no markdown, no backticks) with:
  {
    "id": "generated-id-${Date.now()}",
    "title": "Exact Title",
    "author": "Author Name",
    "category": "One of: Primary Texts, Philosophy, Arts, Science & Technology, History, Modern Research",
    "subCategory": "Specific topic (e.g. Vedanta, Architecture)",
    "description": "A 20-word scholarly summary.",
    "color": "A tailwind gradient string based on vibe (e.g. 'from-amber-200 to-orange-500')"
  }
  
  If NOT found or NOT valid (fiction/fake), return exactly: null
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: query }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temp for factual accuracy
        responseMimeType: "application/json"
      }
    });

    // SAFE PARSING
    const bookData = cleanAndParseJson(response.text);
    return bookData as LibraryBook;

  } catch (error) {
    console.error("Library Search Error:", error);
    return null;
  }
};
