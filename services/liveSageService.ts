
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Sage, UserProgress } from '../types';

interface LiveSageConfig {
  sage: Sage;
  userProgress: UserProgress;
  onAudioData: (data: ArrayBuffer) => void;
  onTranscription: (text: string, isUser: boolean) => void;
  onDisconnect: () => void;
}

export class LiveSageService {
  private session: any = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private nextStartTime: number = 0;

  async connect(config: LiveSageConfig) {
    if (!process.env.API_KEY) {
      console.error("API Key missing");
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Build the system prompt based on the Sage Persona
    const systemInstruction = `
    You are ${config.sage.name}, the ${config.sage.archetype}.
    Role: ${config.sage.role}
    
    Your Personality: ${config.sage.personality_traits.join(', ')}.
    Your Voice Style: ${config.sage.voice_style.tone}, ${config.sage.voice_style.pace}, ${config.sage.voice_style.emotion}.
    
    Dialogue Patterns to use:
    Style: ${config.sage.dialogue_patterns?.style}
    Examples: ${config.sage.dialogue_patterns?.examples.join(' | ')}
    
    Specific Instruction: ${config.sage.system_prompt}
    
    Context: The user has completed ${config.userProgress.completedLessons.length} lessons on the path to Moksha.
    
    Goal: Converse with the user in real-time. Be brief, profound, and "alive". Do not lecture endlessly. Listen and respond dynamically.
    `;

    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    this.nextStartTime = this.outputAudioContext.currentTime;

    try {
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: async () => {
            console.log("Connected to Sage");
            await this.startMicrophone(sessionPromise);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              config.onAudioData(new Uint8Array(atob(base64Audio).split("").map(c => c.charCodeAt(0))).buffer);
              await this.playAudioChunk(base64Audio);
            }

            // Handle Transcription
            if (message.serverContent?.outputTranscription?.text) {
              config.onTranscription(message.serverContent.outputTranscription.text, false);
            } else if (message.serverContent?.inputTranscription?.text) {
              config.onTranscription(message.serverContent.inputTranscription.text, true);
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              this.stopAudioPlayback();
            }
          },
          onclose: () => {
            console.log("Sage Disconnected");
            config.onDisconnect();
            this.cleanup();
          },
          onerror: (e) => {
            console.error("Sage Error", e);
            config.onDisconnect();
            this.cleanup();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: this.mapSageToVoice(config.sage.id) } }
          },
          systemInstruction: systemInstruction,
        }
      });

      this.session = sessionPromise;
    } catch (e) {
      console.error("Connection failed", e);
      config.onDisconnect();
    }
  }

  private async startMicrophone(sessionPromise: Promise<any>) {
    try {
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
      this.processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBlob = this.createBlob(inputData);
        
        sessionPromise.then(session => {
          session.sendRealtimeInput({ media: pcmBlob });
        });
      };

      source.connect(this.processor);
      this.processor.connect(this.inputAudioContext.destination);
    } catch (e) {
      console.error("Microphone access denied or error", e);
    }
  }

  private async playAudioChunk(base64Audio: string) {
    if (!this.outputAudioContext) return;

    try {
      const audioData = this.base64ToArrayBuffer(base64Audio);
      const float32Array = new Float32Array(audioData.byteLength / 2);
      const dataView = new DataView(audioData);

      for (let i = 0; i < float32Array.length; i++) {
        float32Array[i] = dataView.getInt16(i * 2, true) / 32768;
      }

      const audioBuffer = this.outputAudioContext.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputAudioContext.destination);

      // Schedule playback - Fix for gaps/overlap
      if (this.nextStartTime < this.outputAudioContext.currentTime) {
        this.nextStartTime = this.outputAudioContext.currentTime;
      }
      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
    } catch (e) {
      console.error("Error decoding audio chunk", e);
    }
  }

  private stopAudioPlayback() {
    if (this.outputAudioContext) {
      this.nextStartTime = this.outputAudioContext.currentTime;
    }
  }

  // Robust Cleanup to prevent buzzing or memory leaks
  private cleanup() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
      this.processor = null;
    }

    if (this.inputAudioContext) {
      this.inputAudioContext.close().catch(console.error);
      this.inputAudioContext = null;
    }

    if (this.outputAudioContext) {
      this.outputAudioContext.close().catch(console.error);
      this.outputAudioContext = null;
    }
  }

  disconnect() {
    if (this.session) {
      // Best effort close
      this.session.then((s: any) => {
        try { s.close(); } catch(e) {}
      });
      this.session = null;
    }
    this.cleanup();
  }

  // Utilities
  private mapSageToVoice(sageId: string): string {
    switch (sageId) {
      case 'sage_vasishtha': return 'Fenrir';
      case 'sage_vishwamitra': return 'Zephyr';
      case 'sage_bharadvaja': return 'Puck';
      case 'sage_atri': return 'Kore';
      case 'sage_gautama': return 'Charon';
      case 'sage_kashyapa': return 'Aoede';
      default: return 'Puck';
    }
  }

  private createBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return {
      data: btoa(binary),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  private base64ToArrayBuffer(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
