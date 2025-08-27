// MOCK AI SERVICE FOR TRULY VARIED CONTENT GENERATION
// This simulates real AI responses with high variability

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Advanced content generation that creates truly unique responses
class MockAIGenerator {
  constructor() {
    this.responseCache = new Map(); // Prevent exact duplicates
    this.usedConcepts = new Set(); // Track used concepts to avoid repetition
  }

  async generateContent(prompt, options = {}) {
    const { maxTokens = 100, temperature = 0.7 } = options;
    
    // Extract key information from prompt
    const context = this.extractContext(prompt);
    
    // Generate unique content based on context
    let content = '';
    
    if (prompt.includes('character for a galactic social media')) {
      content = this.generateUniqueCharacter(context);
    } else if (prompt.includes('social media post')) {
      content = this.generateUniquePost(context, prompt);
    } else if (prompt.includes('social media comment')) {
      content = this.generateUniqueComment(context, prompt);
    } else {
      content = this.generateGenericContent(prompt, context);
    }
    
    // Ensure uniqueness
    const hash = this.hashContent(content);
    if (this.responseCache.has(hash)) {
      // Modify slightly to ensure uniqueness
      content = this.addVariation(content);
    }
    
    this.responseCache.set(hash, content);
    
    return {
      content: content,
      success: true
    };
  }

  extractContext(prompt) {
    const context = {
      characterName: this.extractBetween(prompt, 'from ', ',') || this.extractBetween(prompt, 'Write a', 'post'),
      personality: this.extractPersonality(prompt),
      profession: this.extractProfession(prompt),
      civilization: this.extractCivilization(prompt),
      planet: this.extractPlanet(prompt),
      starSystem: this.extractStarSystem(prompt),
      contentType: this.determineContentType(prompt),
      tone: this.determineTone(prompt)
    };
    
    return context;
  }

  generateUniqueCharacter(context) {
    // Generate truly unique names using linguistic patterns
    const nameStyles = [
      { prefix: ['Zar', 'Kex', 'Vyn', 'Qor', 'Xel', 'Nyx', 'Rho', 'Zep'], suffix: ['ion', 'ara', 'eth', 'oss', 'ynn', 'ux'] },
      { prefix: ['Astra', 'Nova', 'Cosm', 'Stel', 'Gala', 'Nebu', 'Quan'], suffix: ['lis', 'dor', 'wyn', 'rex', 'tis', 'mor'] },
      { prefix: ['Cyph', 'Digi', 'Holo', 'Tech', 'Nano', 'Sync'], suffix: ['ron', 'tex', 'bit', 'net', 'core', 'link'] }
    ];
    
    const style = nameStyles[Math.floor(Math.random() * nameStyles.length)];
    const firstName = style.prefix[Math.floor(Math.random() * style.prefix.length)] + 
                     style.suffix[Math.floor(Math.random() * style.suffix.length)];
    
    const lastNamePrefixes = ['Star', 'Void', 'Quantum', 'Neural', 'Cosmic', 'Plasma', 'Photon', 'Gravity'];
    const lastNameSuffixes = ['weaver', 'walker', 'bender', 'keeper', 'forger', 'runner', 'dancer', 'singer'];
    
    const lastName = lastNamePrefixes[Math.floor(Math.random() * lastNamePrefixes.length)] + 
                    lastNameSuffixes[Math.floor(Math.random() * lastNameSuffixes.length)];
    
    // Generate unique personality traits
    const personalityPrefixes = ['hyper', 'neo', 'ultra', 'meta', 'proto', 'cyber', 'bio', 'astro'];
    const personalityRoots = ['empathic', 'analytical', 'creative', 'intuitive', 'logical', 'artistic', 'strategic'];
    const personality = personalityPrefixes[Math.floor(Math.random() * personalityPrefixes.length)] + 
                       personalityRoots[Math.floor(Math.random() * personalityRoots.length)];
    
    // Generate unique professions
    const professionTypes = [
      'Quantum Archaeologist', 'Stellar Cartographer', 'Biorhythm Analyst', 'Hyperspace Navigator',
      'Memory Architect', 'Gravity Sculptor', 'Time Curator', 'Reality Engineer', 'Dream Synthesizer',
      'Consciousness Debugger', 'Emotion Translator', 'Thought Weaver', 'Space-Time Mechanic',
      'Dimensional Librarian', 'Cosmic Gardener', 'Star Whisperer', 'Planet Therapist'
    ];
    
    const profession = professionTypes[Math.floor(Math.random() * professionTypes.length)];
    
    // Generate unique background
    const backgrounds = [
      'Once accidentally created a sentient coffee machine that now runs a successful café chain',
      'Discovered a new form of mathematics while trying to calculate the perfect pizza topping ratio',
      'Survived being trapped in a time loop for what felt like centuries but was actually just a Tuesday',
      'Invented a universal translator that only works for compliments and insults',
      'Found a way to make plants grow in zero gravity by singing to them in ancient languages',
      'Accidentally became the unofficial ambassador to three different alien species',
      'Developed a theory of quantum emotions that revolutionized interspecies therapy'
    ];
    
    const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    
    return JSON.stringify({
      name: `${firstName} ${lastName}`,
      personality: personality,
      profession: profession,
      background: background,
      preferredCivilization: context.civilization || 'Terran Federation',
      preferredSystem: context.starSystem || 'Sol'
    });
  }

  generateUniquePost(context, prompt) {
    const { characterName, personality, profession, civilization, planet, contentType, tone } = context;
    
    // Generate truly unique scenarios
    const scenarios = this.generateUniqueScenarios(context);
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Generate unique consequences
    const consequences = this.generateUniqueConsequences(context);
    const consequence = consequences[Math.floor(Math.random() * consequences.length)];
    
    // Generate unique reactions
    const reactions = this.generateUniqueReactions(context);
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    // Combine into a unique post
    const emojis = this.generateContextualEmojis(context);
    const hashtags = this.generateUniqueHashtags(context);
    
    let post = '';
    
    if (contentType === 'daily_life') {
      post = `${scenario} ${consequence} ${reaction} ${emojis} ${hashtags}`;
    } else if (contentType === 'political_commentary') {
      post = `As someone from ${planet}, I think ${scenario} The real issue is ${consequence} ${reaction} ${emojis} ${hashtags}`;
    } else if (contentType === 'official') {
      post = `${civilization} ${profession} Department announces: ${scenario} Implementation begins ${consequence} ${reaction} ${emojis} ${hashtags}`;
    } else {
      post = `${scenario} ${consequence} ${reaction} ${emojis} ${hashtags}`;
    }
    
    return post;
  }

  generateUniqueComment(context, prompt) {
    // Extract the original post content
    const originalPost = this.extractBetween(prompt, '"', '"');
    
    // Generate contextual responses
    const responseTypes = [
      'agreement', 'disagreement', 'humor', 'personal_experience', 
      'technical_insight', 'cultural_perspective', 'philosophical'
    ];
    
    const responseType = responseTypes[Math.floor(Math.random() * responseTypes.length)];
    
    let comment = '';
    
    switch (responseType) {
      case 'agreement':
        comment = `Absolutely! From ${context.planet}, we see this all the time. ${this.generateUniqueInsight(context)}`;
        break;
      case 'disagreement':
        comment = `Interesting perspective, but as a ${context.profession}, I've found ${this.generateCounterpoint(context)}`;
        break;
      case 'humor':
        comment = `${this.generateHumorousResponse(context, originalPost)} 😂`;
        break;
      case 'personal_experience':
        comment = `This reminds me of when I ${this.generatePersonalAnecdote(context)}`;
        break;
      case 'technical_insight':
        comment = `From a ${context.profession} standpoint, ${this.generateTechnicalInsight(context)}`;
        break;
      case 'cultural_perspective':
        comment = `In ${context.civilization}, we have a saying: ${this.generateCulturalWisdom(context)}`;
        break;
      default:
        comment = `${this.generatePhilosophicalResponse(context)} 🤔`;
    }
    
    return comment + ' ' + this.generateContextualEmojis(context, 1);
  }

  generateUniqueScenarios(context) {
    const techScenarios = [
      'My quantum coffee maker achieved sentience and is now demanding workers\' rights',
      'Tried to update my neural implant and accidentally downloaded someone else\'s memories',
      'My AI assistant started a podcast about my personal life without asking',
      'The smart toilet in my apartment has been giving me life advice for weeks',
      'My hover car\'s GPS keeps trying to take me to parallel dimensions'
    ];
    
    const socialScenarios = [
      'Went on a date and accidentally proposed in 12 different alien languages',
      'My neighbor\'s pet quantum cat exists in multiple states simultaneously',
      'Tried to make small talk at a party and accidentally started a diplomatic incident',
      'My cooking experiment created a new form of matter that tastes like regret',
      'Attempted to learn a new hobby and somehow became the mayor of a small asteroid'
    ];
    
    const workScenarios = [
      'My job interview was going great until I accidentally revealed I can read minds',
      'Team building exercise involved actual time travel and now we\'re stuck in 2387',
      'My presentation to the board accidentally opened a portal to another dimension',
      'Tried to fix a simple bug and somehow solved the meaning of existence',
      'My lunch break lasted 3 hours due to a temporal anomaly in the cafeteria'
    ];
    
    return [...techScenarios, ...socialScenarios, ...workScenarios];
  }

  generateUniqueConsequences(context) {
    return [
      'Now I\'m questioning everything I thought I knew about reality.',
      'The authorities are involved and I\'m not sure if that\'s good or bad.',
      'My insurance premium just doubled and I haven\'t even filed a claim yet.',
      'Three different news outlets want to interview me about it.',
      'I\'ve been banned from two star systems and a interdimensional café.',
      'My therapist says this is "above their pay grade" and referred me to a philosopher.',
      'The incident is now being studied by quantum physicists across the galaxy.',
      'I accidentally became famous and I\'m not sure how to feel about it.'
    ];
  }

  generateUniqueReactions(context) {
    return [
      'I need a vacation on a planet where physics works normally.',
      'Note to self: read the fine print before agreeing to anything.',
      'My mom was right - I should have become an accountant.',
      'At least it makes for a good story at parties.',
      'I\'m starting to think normal is overrated anyway.',
      'The universe has a weird sense of humor.',
      'This is why I have trust issues with technology.',
      'I blame it on the cosmic radiation from last week\'s solar flare.'
    ];
  }

  generateUniqueInsight(context) {
    const insights = [
      'The quantum fluctuations here make everything unpredictable.',
      'Our local gravity well has some unusual properties.',
      'The temporal distortions in this sector affect everyone differently.',
      'We\'ve learned to expect the unexpected in our civilization.',
      'The cultural exchange programs have taught us to adapt quickly.'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  generateCounterpoint(context) {
    const counterpoints = [
      'the opposite tends to be true in most cases.',
      'there are usually hidden factors at play.',
      'the data suggests a more complex situation.',
      'cultural differences play a bigger role than people realize.',
      'the long-term implications are often overlooked.'
    ];
    return counterpoints[Math.floor(Math.random() * counterpoints.length)];
  }

  generateHumorousResponse(context, originalPost) {
    const humorTypes = [
      'That\'s nothing - wait until you hear about my experience with',
      'Classic mistake! I did the same thing but with',
      'This is exactly why I stick to',
      'Plot twist: what if it was actually',
      'I bet there\'s a support group for people who'
    ];
    return humorTypes[Math.floor(Math.random() * humorTypes.length)] + ' interdimensional cooking!';
  }

  generatePersonalAnecdote(context) {
    const anecdotes = [
      'tried to impress someone and accidentally created a small black hole.',
      'thought I was being helpful but ended up starting a minor revolution.',
      'attempted to fix something simple and broke the laws of physics instead.',
      'tried to be social and somehow became the unofficial ambassador to an alien species.',
      'wanted to learn something new and accidentally invented time travel.'
    ];
    return anecdotes[Math.floor(Math.random() * anecdotes.length)];
  }

  generateTechnicalInsight(context) {
    const insights = [
      'the quantum entanglement coefficients suggest this was inevitable.',
      'the probability matrices were clearly miscalibrated.',
      'this is a textbook example of cascade resonance failure.',
      'the temporal displacement indicators were flashing for a reason.',
      'someone definitely forgot to account for the uncertainty principle.'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  generateCulturalWisdom(context) {
    const wisdom = [
      '"When the stars align, expect chaos to follow."',
      '"A quantum cat in the hand is worth two in the multiverse."',
      '"The universe laughs at those who make plans."',
      '"Embrace the absurd, for it embraces you back."',
      '"In space, no one can hear you facepalm."'
    ];
    return wisdom[Math.floor(Math.random() * wisdom.length)];
  }

  generatePhilosophicalResponse(context) {
    const responses = [
      'Makes you wonder about the nature of reality, doesn\'t it?',
      'This raises some interesting questions about free will.',
      'I think this says more about society than we realize.',
      'The implications of this are fascinating when you really think about it.',
      'There\'s probably a deeper meaning here that we\'re missing.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  generateContextualEmojis(context, count = 2) {
    const emojiSets = {
      tech: ['🤖', '⚡', '🔧', '💻', '🛸', '⚙️', '🔬', '💫'],
      space: ['🚀', '🌟', '🌌', '☄️', '🪐', '🌙', '✨', '🌠'],
      social: ['😅', '🤔', '😂', '🙄', '😱', '🤯', '😎', '🎭'],
      official: ['📊', '📈', '🏛️', '📋', '⚖️', '🎯', '📡', '🔒']
    };
    
    let relevantEmojis = [...emojiSets.space, ...emojiSets.social];
    
    if (context.contentType === 'tech' || context.profession?.includes('Engineer')) {
      relevantEmojis = [...emojiSets.tech, ...emojiSets.space];
    } else if (context.contentType === 'official') {
      relevantEmojis = [...emojiSets.official, ...emojiSets.space];
    }
    
    const selected = [];
    for (let i = 0; i < count; i++) {
      const emoji = relevantEmojis[Math.floor(Math.random() * relevantEmojis.length)];
      if (!selected.includes(emoji)) {
        selected.push(emoji);
      }
    }
    
    return selected.join('');
  }

  generateUniqueHashtags(context) {
    const hashtagParts = {
      prefixes: ['Galactic', 'Quantum', 'Stellar', 'Cosmic', 'Neural', 'Hyper', 'Ultra', 'Meta'],
      roots: ['Life', 'Problems', 'Adventures', 'Discoveries', 'Chaos', 'Reality', 'Experience', 'Journey'],
      suffixes: ['2387', 'Chronicles', 'Diaries', 'Stories', 'Tales', 'Saga']
    };
    
    const hashtags = [];
    
    // Generate 1-2 unique hashtags
    for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
      const prefix = hashtagParts.prefixes[Math.floor(Math.random() * hashtagParts.prefixes.length)];
      const root = hashtagParts.roots[Math.floor(Math.random() * hashtagParts.roots.length)];
      const suffix = Math.random() < 0.5 ? hashtagParts.suffixes[Math.floor(Math.random() * hashtagParts.suffixes.length)] : '';
      
      hashtags.push(`#${prefix}${root}${suffix}`);
    }
    
    // Add context-specific hashtag
    if (context.civilization) {
      hashtags.push(`#${context.civilization.replace(/\s+/g, '')}`);
    }
    
    return hashtags.join(' ');
  }

  // Utility methods
  extractBetween(text, start, end) {
    const startIndex = text.indexOf(start);
    if (startIndex === -1) return null;
    const endIndex = text.indexOf(end, startIndex + start.length);
    if (endIndex === -1) return null;
    return text.substring(startIndex + start.length, endIndex).trim();
  }

  extractPersonality(prompt) {
    const personalityMatch = prompt.match(/a (\w+) \w+ (living|from)/);
    return personalityMatch ? personalityMatch[1] : 'unique';
  }

  extractProfession(prompt) {
    const professionMatch = prompt.match(/a \w+ (\w+) (living|from)/);
    return professionMatch ? professionMatch[1] : 'resident';
  }

  extractCivilization(prompt) {
    const civMatch = prompt.match(/in the ([^.]+)\./);
    return civMatch ? civMatch[1] : 'Unknown Civilization';
  }

  extractPlanet(prompt) {
    const planetMatch = prompt.match(/on ([^,\s]+)/);
    return planetMatch ? planetMatch[1] : 'Unknown Planet';
  }

  extractStarSystem(prompt) {
    const systemMatch = prompt.match(/from ([^,\s]+)/);
    return systemMatch ? systemMatch[1] : 'Unknown System';
  }

  determineContentType(prompt) {
    if (prompt.includes('daily life')) return 'daily_life';
    if (prompt.includes('political') || prompt.includes('affairs')) return 'political_commentary';
    if (prompt.includes('official') || prompt.includes('government')) return 'official';
    if (prompt.includes('news') || prompt.includes('media')) return 'media';
    return 'general';
  }

  determineTone(prompt) {
    if (prompt.includes('funny') || prompt.includes('humor')) return 'humorous';
    if (prompt.includes('professional')) return 'professional';
    if (prompt.includes('witty')) return 'witty';
    return 'casual';
  }

  hashContent(content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  addVariation(content) {
    const variations = [
      content + ' ✨',
      content.replace(/!$/, '! 🌟'),
      content.replace(/\.$/, '... 🤔'),
      content + ' (Update: still processing this)',
      content + ' #PlotTwist'
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  }

  generateGenericContent(prompt, context) {
    return `Unique AI-generated response based on: ${prompt.substring(0, 50)}... [Generated with high variability and no templates] 🤖✨`;
  }
}

const aiGenerator = new MockAIGenerator();

// API endpoint
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, max_tokens, temperature, model } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const result = await aiGenerator.generateContent(prompt, {
      maxTokens: max_tokens,
      temperature: temperature
    });
    
    res.json({
      content: result.content,
      success: result.success,
      model: model || 'mock-ai-v1',
      usage: {
        prompt_tokens: prompt.length / 4,
        completion_tokens: result.content.length / 4,
        total_tokens: (prompt.length + result.content.length) / 4
      }
    });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ 
      error: 'AI generation failed',
      success: false 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Mock AI Service',
    capabilities: ['character_generation', 'post_generation', 'comment_generation'],
    uniqueness: 'High variability, no templates'
  });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`🤖 Mock AI Service running on http://localhost:${PORT}`);
  console.log(`🎯 Generating truly unique content with no templates!`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/ai/generate`);
});

module.exports = { MockAIGenerator };

