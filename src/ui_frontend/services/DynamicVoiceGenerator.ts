/**
 * Dynamic Voice Generator
 * Generates character voices based on character traits and attributes
 */

import { CharacterVoice } from './VoiceService';

export interface CharacterTraits {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  age: number;
  personality: string[];
  background: string;
  role: string;
  department?: string;
  nationality?: string;
  education?: string;
  experience?: string;
}

export interface VoiceProfile {
  voiceName: string;
  rate: number;
  pitch: number;
  volume: number;
  language: string;
  accent?: string;
  tone?: string;
}

class DynamicVoiceGenerator {
  private availableVoices: SpeechSynthesisVoice[] = [];
  private voiceCategories: Map<string, SpeechSynthesisVoice[]> = new Map();

  constructor() {
    this.initializeVoices();
  }

  private initializeVoices() {
    const loadVoices = () => {
      this.availableVoices = speechSynthesis.getVoices();
      this.categorizeVoices();
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  private categorizeVoices() {
    // Clear existing categories
    this.voiceCategories.clear();

    // Categorize voices by gender and language
    this.availableVoices.forEach(voice => {
      const lang = voice.lang.split('-')[0];
      
      // Gender categorization (heuristic based on voice names)
      const isFemale = this.isFemaleVoice(voice.name);
      const genderKey = isFemale ? 'female' : 'male';
      const categoryKey = `${genderKey}_${lang}`;

      if (!this.voiceCategories.has(categoryKey)) {
        this.voiceCategories.set(categoryKey, []);
      }
      this.voiceCategories.get(categoryKey)!.push(voice);

      // Also add to general gender category
      if (!this.voiceCategories.has(genderKey)) {
        this.voiceCategories.set(genderKey, []);
      }
      this.voiceCategories.get(genderKey)!.push(voice);

      // Language category
      if (!this.voiceCategories.has(lang)) {
        this.voiceCategories.set(lang, []);
      }
      this.voiceCategories.get(lang)!.push(voice);
    });
  }

  private isFemaleVoice(voiceName: string): boolean {
    const femaleNames = [
      'zira', 'hazel', 'aria', 'eva', 'helen', 'linda', 'paulina', 'susan',
      'samantha', 'victoria', 'allison', 'ava', 'serena', 'alex', 'karen',
      'moira', 'tessa', 'veena', 'rishi', 'female', 'woman', 'girl'
    ];
    
    const lowerName = voiceName.toLowerCase();
    return femaleNames.some(name => lowerName.includes(name));
  }

  public generateVoiceProfile(traits: CharacterTraits): CharacterVoice {
    // Select appropriate voice based on traits
    const selectedVoice = this.selectVoiceByTraits(traits);
    
    // Generate voice parameters based on character traits
    const voiceParams = this.generateVoiceParameters(traits);

    return {
      characterId: traits.id,
      voiceName: selectedVoice?.name || 'Default',
      rate: voiceParams.rate,
      pitch: voiceParams.pitch,
      volume: voiceParams.volume,
      language: voiceParams.language
    };
  }

  private selectVoiceByTraits(traits: CharacterTraits): SpeechSynthesisVoice | null {
    // Determine preferred language
    const language = this.getLanguageFromTraits(traits);
    
    // Get gender-specific voices
    const genderKey = traits.gender === 'female' ? 'female' : 'male';
    const languageGenderKey = `${genderKey}_${language}`;

    // Priority order: gender+language, gender, language, any
    const voiceCandidates = 
      this.voiceCategories.get(languageGenderKey) ||
      this.voiceCategories.get(genderKey) ||
      this.voiceCategories.get(language) ||
      this.availableVoices;

    if (voiceCandidates.length === 0) {
      return null;
    }

    // Select voice based on role/personality
    return this.selectVoiceByRole(voiceCandidates, traits);
  }

  private getLanguageFromTraits(traits: CharacterTraits): string {
    // Map nationality/background to language codes
    const nationalityLanguageMap: { [key: string]: string } = {
      'american': 'en',
      'british': 'en',
      'canadian': 'en',
      'australian': 'en',
      'french': 'fr',
      'german': 'de',
      'spanish': 'es',
      'italian': 'it',
      'japanese': 'ja',
      'chinese': 'zh',
      'russian': 'ru',
      'arabic': 'ar'
    };

    const nationality = traits.nationality?.toLowerCase();
    if (nationality && nationalityLanguageMap[nationality]) {
      return nationalityLanguageMap[nationality];
    }

    // Default to English
    return 'en';
  }

  private selectVoiceByRole(voices: SpeechSynthesisVoice[], traits: CharacterTraits): SpeechSynthesisVoice {
    // Role-based voice selection preferences
    const rolePreferences: { [key: string]: string[] } = {
      'diplomat': ['eloquent', 'refined', 'sophisticated'],
      'military': ['authoritative', 'commanding', 'strong'],
      'scientist': ['precise', 'analytical', 'clear'],
      'engineer': ['technical', 'practical', 'steady'],
      'economist': ['analytical', 'measured', 'professional'],
      'advisor': ['wise', 'experienced', 'calm'],
      'minister': ['authoritative', 'diplomatic', 'confident'],
      'commander': ['commanding', 'decisive', 'strong'],
      'doctor': ['caring', 'professional', 'reassuring']
    };

    const role = traits.role.toLowerCase();
    const preferences = rolePreferences[role] || ['neutral'];

    // For now, use a deterministic selection based on character ID
    // This ensures consistency while providing variety
    const index = this.hashString(traits.id) % voices.length;
    return voices[index];
  }

  private generateVoiceParameters(traits: CharacterTraits): VoiceProfile {
    // Base parameters
    let rate = 1.0;
    let pitch = 1.0;
    let volume = 0.8;

    // Age-based adjustments
    if (traits.age < 30) {
      pitch += 0.1; // Younger voices tend to be higher
      rate += 0.05; // Slightly faster
    } else if (traits.age > 60) {
      pitch -= 0.1; // Older voices tend to be lower
      rate -= 0.1; // Slightly slower
    }

    // Gender-based adjustments
    if (traits.gender === 'female') {
      pitch += 0.15; // Generally higher pitch
    } else if (traits.gender === 'male') {
      pitch -= 0.1; // Generally lower pitch
    }

    // Personality-based adjustments
    if (traits.personality.includes('energetic') || traits.personality.includes('enthusiastic')) {
      rate += 0.1;
      volume += 0.1;
    }
    
    if (traits.personality.includes('calm') || traits.personality.includes('measured')) {
      rate -= 0.05;
    }
    
    if (traits.personality.includes('authoritative') || traits.personality.includes('commanding')) {
      pitch -= 0.05;
      volume += 0.1;
    }
    
    if (traits.personality.includes('gentle') || traits.personality.includes('soft-spoken')) {
      volume -= 0.1;
      rate -= 0.05;
    }

    // Role-based adjustments
    const roleAdjustments: { [key: string]: Partial<VoiceProfile> } = {
      'diplomat': { rate: 0.9, pitch: 1.05 },
      'military': { rate: 1.1, pitch: 0.85, volume: 0.9 },
      'scientist': { rate: 0.95, pitch: 1.0 },
      'engineer': { rate: 1.05, pitch: 0.95 },
      'economist': { rate: 1.0, pitch: 0.9 },
      'commander': { rate: 1.1, pitch: 0.8, volume: 0.9 }
    };

    const roleKey = traits.role.toLowerCase();
    if (roleAdjustments[roleKey]) {
      const adj = roleAdjustments[roleKey];
      if (adj.rate) rate = adj.rate;
      if (adj.pitch) pitch = adj.pitch;
      if (adj.volume) volume = adj.volume;
    }

    // Ensure values are within reasonable bounds
    rate = Math.max(0.5, Math.min(2.0, rate));
    pitch = Math.max(0.5, Math.min(2.0, pitch));
    volume = Math.max(0.1, Math.min(1.0, volume));

    return {
      voiceName: 'Generated',
      rate,
      pitch,
      volume,
      language: this.getLanguageFromTraits(traits)
    };
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Generate voice preview text based on character
  public generatePreviewText(traits: CharacterTraits): string {
    const roleGreetings: { [key: string]: string } = {
      'diplomat': `Greetings. I am ${traits.name}, representing our diplomatic interests. I look forward to productive discussions.`,
      'military': `${traits.name} reporting for duty. Ready to discuss strategic operations and security matters.`,
      'scientist': `Hello, I'm Dr. ${traits.name}. I'm here to share our latest research findings and scientific insights.`,
      'engineer': `${traits.name}, Chief Engineer. Let's discuss our technical capabilities and infrastructure needs.`,
      'economist': `Good day. ${traits.name} here. I'm ready to analyze our economic situation and financial strategies.`,
      'advisor': `${traits.name}, Senior Advisor. I'm here to provide guidance based on my experience and expertise.`,
      'minister': `Minister ${traits.name} speaking. I'm prepared to discuss policy matters and governmental affairs.`,
      'commander': `Commander ${traits.name}. Ready to coordinate operations and strategic planning.`,
      'doctor': `Dr. ${traits.name} at your service. I'm here to discuss health and medical matters.`
    };

    const roleKey = traits.role.toLowerCase();
    return roleGreetings[roleKey] || `Hello, I'm ${traits.name}. This is my voice preview.`;
  }

  // Get available voice categories for debugging
  public getVoiceCategories(): Map<string, SpeechSynthesisVoice[]> {
    return this.voiceCategories;
  }

  // Get all available voices
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices;
  }
}

export const dynamicVoiceGenerator = new DynamicVoiceGenerator();

