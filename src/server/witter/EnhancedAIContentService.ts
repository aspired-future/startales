import { Pool } from 'pg';

export interface AIContentRequest {
  contentType: 'business' | 'sports' | 'entertainment' | 'culture' | 'technology' | 'politics' | 'science';
  civilizationId: number;
  gameContext?: {
    currentEvents?: string[];
    economicStatus?: string;
    politicalClimate?: string;
    recentNews?: string[];
  };
  characterPersonality?: 'witty' | 'serious' | 'sarcastic' | 'enthusiastic' | 'cynical' | 'optimistic';
}

export interface AIGeneratedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'MEDIA' | 'CITIZEN' | 'ANALYST' | 'CELEBRITY' | 'OFFICIAL' | 'INFLUENCER';
  authorAvatar: string;
  content: string;
  timestamp: Date;
  metadata: {
    category: string;
    contentType: string;
    aiGenerated: true;
    temperature: number;
    personality: string;
    gameContext?: any;
  };
  metrics: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export class EnhancedAIContentService {
  private pool: Pool;
  private aiServiceUrl: string;

  constructor(pool: Pool, aiServiceUrl: string = process.env.AI_SERVICE_URL || 'http://localhost:8001') {
    this.pool = pool;
    this.aiServiceUrl = aiServiceUrl;
  }

  async generateEnhancedContent(request: AIContentRequest, count: number = 5): Promise<AIGeneratedPost[]> {
    const posts: AIGeneratedPost[] = [];

    for (let i = 0; i < count; i++) {
      const personality = this.getRandomPersonality();
      const authorInfo = this.generateAuthorInfo(request.contentType, personality);
      
      try {
        const content = await this.generateAIContent(request, personality, authorInfo);
        
        if (content && content.length > 10) {
          posts.push({
            id: `ai_${request.contentType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorId: authorInfo.id,
            authorName: authorInfo.name,
            authorType: authorInfo.type,
            authorAvatar: authorInfo.avatar,
            content,
            timestamp: new Date(Date.now() - Math.random() * 3600000), // Random time in last hour
            metadata: {
              category: request.contentType.toUpperCase(),
              contentType: 'AI_GENERATED',
              aiGenerated: true,
              temperature: 0.9,
              personality,
              gameContext: request.gameContext
            },
            metrics: {
              likes: Math.floor(Math.random() * 1000) + 50,
              shares: Math.floor(Math.random() * 300) + 20,
              comments: Math.floor(Math.random() * 150) + 10
            }
          });
        }
      } catch (error) {
        console.error(`Failed to generate AI content for ${request.contentType}:`, error);
        // Continue with other posts
      }
    }

    return posts;
  }

  private async generateAIContent(
    request: AIContentRequest, 
    personality: string, 
    authorInfo: any
  ): Promise<string> {
    const prompt = this.buildEnhancedPrompt(request, personality, authorInfo);

    try {
      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          maxTokens: 200,
          temperature: 0.9, // High temperature for maximum creativity
          model: 'gpt-4o-mini'
        })
      });

      if (!response.ok) {
        throw new Error(`AI service responded with ${response.status}`);
      }

      const result = await response.json();
      return result.content || result.text || '';
      
    } catch (error) {
      console.error('AI content generation failed:', error);
      return this.generateFallbackContent(request, personality, authorInfo);
    }
  }

  private buildEnhancedPrompt(request: AIContentRequest, personality: string, authorInfo: any): string {
    const baseContext = this.buildGameContext(request.gameContext);
    
    const personalityInstructions = {
      witty: "Be clever, use wordplay, make unexpected connections, include subtle humor",
      serious: "Be professional but engaging, focus on implications and analysis", 
      sarcastic: "Use dry humor, subtle irony, and clever observations",
      enthusiastic: "Be energetic, use exclamation points, show genuine excitement",
      cynical: "Be skeptical, point out flaws, use dark humor appropriately",
      optimistic: "Focus on positive aspects, future potential, silver linings"
    };

    const contentTypePrompts = {
      business: `You are ${authorInfo.name}, a ${personality} ${authorInfo.profession} writing about galactic business and economics. ${baseContext}

Write a social media post that:
- Discusses current market trends, corporate news, or economic developments
- Shows your ${personality} personality clearly
- Includes specific details about companies, sectors, or financial instruments
- References inter-civilization trade or economic relationships
- Is 3-4 sentences long and genuinely entertaining
- Uses appropriate emojis and hashtags naturally
- Avoids generic templates - be creative and unexpected
- ${personalityInstructions[personality]}

Write ONLY the post content, nothing else.`,

      sports: `You are ${authorInfo.name}, a ${personality} ${authorInfo.profession} covering galactic sports. ${baseContext}

Write a social media post that:
- Covers sports news, games, athletes, or fan culture
- Shows your ${personality} personality clearly  
- Includes specific team names, player details, or game statistics
- References inter-civilization sports rivalries or competitions
- Is 3-4 sentences long and highly entertaining
- Uses sports emojis and hashtags creatively
- Avoids predictable game recap formats - be original
- ${personalityInstructions[personality]}

Write ONLY the post content, nothing else.`,

      entertainment: `You are ${authorInfo.name}, a ${personality} ${authorInfo.profession} covering galactic entertainment and celebrity culture. ${baseContext}

Write a social media post that:
- Discusses celebrities, movies, music, or entertainment industry news
- Shows your ${personality} personality clearly
- Includes specific celebrity names or entertainment properties
- References cross-civilization cultural trends or collaborations
- Is 3-4 sentences long and gossip-worthy
- Uses entertainment emojis and hashtags
- Creates intrigue or surprise - avoid boring announcements
- ${personalityInstructions[personality]}

Write ONLY the post content, nothing else.`,

      culture: `You are ${authorInfo.name}, a ${personality} ${authorInfo.profession} discussing galactic culture and society. ${baseContext}

Write a social media post that:
- Explores cultural trends, social issues, or inter-species relationships
- Shows your ${personality} personality clearly
- Includes specific cultural practices or social phenomena
- References how different civilizations approach cultural topics
- Is 3-4 sentences long and thought-provoking
- Uses cultural emojis and hashtags appropriately
- Sparks discussion or debate - avoid bland observations
- ${personalityInstructions[personality]}

Write ONLY the post content, nothing else.`,

      technology: `You are ${authorInfo.name}, a ${personality} ${authorInfo.profession} covering galactic technology and innovation. ${baseContext}

Write a social media post that:
- Discusses new technologies, scientific breakthroughs, or digital trends
- Shows your ${personality} personality clearly
- Includes specific tech companies, innovations, or research developments
- References how technology affects different civilizations
- Is 3-4 sentences long and fascinating
- Uses tech emojis and hashtags creatively
- Reveals surprising implications or connections
- ${personalityInstructions[personality]}

Write ONLY the post content, nothing else.`,

      politics: `You are ${authorInfo.name}, a ${personality} ${authorInfo.profession} commenting on galactic politics and governance. ${baseContext}

Write a social media post that:
- Discusses political developments, policies, or inter-civilization relations
- Shows your ${personality} personality clearly
- Includes specific political figures, policies, or diplomatic events
- References tensions or cooperation between civilizations
- Is 3-4 sentences long and insightful
- Uses political emojis and hashtags appropriately
- Offers unique perspective or analysis - avoid generic takes
- ${personalityInstructions[personality]}

Write ONLY the post content, nothing else.`,

      science: `You are ${authorInfo.name}, a ${personality} ${authorInfo.profession} sharing galactic science and discovery news. ${baseContext}

Write a social media post that:
- Discusses scientific discoveries, research, or space exploration
- Shows your ${personality} personality clearly
- Includes specific research findings, space missions, or scientific phenomena
- References collaborative or competitive research between civilizations
- Is 3-4 sentences long and mind-blowing
- Uses science emojis and hashtags effectively
- Explains complex topics in accessible, engaging ways
- ${personalityInstructions[personality]}

Write ONLY the post content, nothing else.`
    };

    return contentTypePrompts[request.contentType] || contentTypePrompts.business;
  }

  private buildGameContext(gameContext?: any): string {
    if (!gameContext) return "The galaxy is bustling with activity across multiple civilizations.";

    let context = "";
    if (gameContext.currentEvents?.length > 0) {
      context += `Current galactic events: ${gameContext.currentEvents.slice(0, 2).join(', ')}. `;
    }
    if (gameContext.economicStatus) {
      context += `Economic climate: ${gameContext.economicStatus}. `;
    }
    if (gameContext.politicalClimate) {
      context += `Political atmosphere: ${gameContext.politicalClimate}. `;
    }
    if (gameContext.recentNews?.length > 0) {
      context += `Recent headlines: ${gameContext.recentNews.slice(0, 1).join(', ')}.`;
    }

    return context || "The galaxy continues to evolve with new developments across all sectors.";
  }

  private getRandomPersonality(): string {
    const personalities = ['witty', 'serious', 'sarcastic', 'enthusiastic', 'cynical', 'optimistic'];
    return personalities[Math.floor(Math.random() * personalities.length)];
  }

  private generateAuthorInfo(contentType: string, personality: string): any {
    const authorTemplates = {
      business: [
        { profession: 'Financial Analyst', type: 'ANALYST', avatar: '📊' },
        { profession: 'Market Reporter', type: 'MEDIA', avatar: '💼' },
        { profession: 'Economic Commentator', type: 'INFLUENCER', avatar: '💰' },
        { profession: 'Trade Specialist', type: 'ANALYST', avatar: '📈' },
        { profession: 'Investment Blogger', type: 'CITIZEN', avatar: '💎' }
      ],
      sports: [
        { profession: 'Sports Journalist', type: 'MEDIA', avatar: '🏆' },
        { profession: 'Former Athlete', type: 'CELEBRITY', avatar: '⭐' },
        { profession: 'Sports Fan', type: 'CITIZEN', avatar: '🎯' },
        { profession: 'Team Analyst', type: 'ANALYST', avatar: '📊' },
        { profession: 'Sports Blogger', type: 'INFLUENCER', avatar: '🏅' }
      ],
      entertainment: [
        { profession: 'Entertainment Reporter', type: 'MEDIA', avatar: '🎬' },
        { profession: 'Celebrity', type: 'CELEBRITY', avatar: '⭐' },
        { profession: 'Culture Critic', type: 'INFLUENCER', avatar: '🎭' },
        { profession: 'Fan Account', type: 'CITIZEN', avatar: '💫' },
        { profession: 'Industry Insider', type: 'ANALYST', avatar: '🎪' }
      ],
      culture: [
        { profession: 'Cultural Anthropologist', type: 'ANALYST', avatar: '🌍' },
        { profession: 'Social Commentator', type: 'INFLUENCER', avatar: '💭' },
        { profession: 'Community Leader', type: 'OFFICIAL', avatar: '🏛️' },
        { profession: 'Artist', type: 'CELEBRITY', avatar: '🎨' },
        { profession: 'Cultural Observer', type: 'CITIZEN', avatar: '👁️' }
      ],
      technology: [
        { profession: 'Tech Journalist', type: 'MEDIA', avatar: '💻' },
        { profession: 'Software Engineer', type: 'CITIZEN', avatar: '⚙️' },
        { profession: 'Innovation Analyst', type: 'ANALYST', avatar: '🔬' },
        { profession: 'Tech Influencer', type: 'INFLUENCER', avatar: '🚀' },
        { profession: 'Research Scientist', type: 'OFFICIAL', avatar: '🧪' }
      ],
      politics: [
        { profession: 'Political Reporter', type: 'MEDIA', avatar: '🏛️' },
        { profession: 'Policy Analyst', type: 'ANALYST', avatar: '📋' },
        { profession: 'Diplomat', type: 'OFFICIAL', avatar: '🤝' },
        { profession: 'Political Commentator', type: 'INFLUENCER', avatar: '🗳️' },
        { profession: 'Concerned Citizen', type: 'CITIZEN', avatar: '🏴' }
      ],
      science: [
        { profession: 'Science Journalist', type: 'MEDIA', avatar: '🔬' },
        { profession: 'Research Director', type: 'OFFICIAL', avatar: '🧬' },
        { profession: 'Space Explorer', type: 'CELEBRITY', avatar: '🚀' },
        { profession: 'Science Communicator', type: 'INFLUENCER', avatar: '🌌' },
        { profession: 'Graduate Student', type: 'CITIZEN', avatar: '🎓' }
      ]
    };

    const templates = authorTemplates[contentType] || authorTemplates.business;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const firstNames = [
      'Zara', 'Marcus', 'Nova', 'Rex', 'Luna', 'Kai', 'Aria', 'Phoenix', 'Sage', 'Orion',
      'Vega', 'Atlas', 'Iris', 'Juno', 'Neo', 'Echo', 'Raven', 'Storm', 'Blaze', 'Frost'
    ];
    
    const lastNames = [
      'Stardust', 'Vortex', 'Quantum', 'Nebula', 'Cosmos', 'Stellar', 'Galaxy', 'Void',
      'Prism', 'Flux', 'Zenith', 'Apex', 'Nexus', 'Vector', 'Matrix', 'Cipher', 'Echo',
      'Pulse', 'Wave', 'Spark'
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return {
      id: `${contentType}_${personality}_${Math.random().toString(36).substr(2, 8)}`,
      name: `${firstName} ${lastName}`,
      profession: template.profession,
      type: template.type,
      avatar: template.avatar
    };
  }

  private generateFallbackContent(request: AIContentRequest, personality: string, authorInfo: any): string {
    const fallbacks = {
      business: [
        `💰 The galactic markets are absolutely wild today! ${personality === 'witty' ? 'My portfolio is doing more flips than a zero-g acrobat 🤸‍♂️' : 'Major shifts happening across all sectors.'} Time to buckle up for this economic rollercoaster! #GalacticMarkets #Investing`,
        `📊 Breaking: Inter-civilization trade talks just got spicy! ${personality === 'sarcastic' ? 'Because nothing says "diplomatic progress" like a 3-hour argument over space tariffs 🙄' : 'Significant implications for all sectors.'} This could reshape the entire galactic economy. #TradeWars #Economics`,
        `🚀 Startup culture in the outer rim is absolutely exploding right now! ${personality === 'enthusiastic' ? 'Innovation everywhere you look - it\'s like the wild west but with better WiFi! 🌟' : 'Remarkable growth in emerging markets.'} The future is being built in the frontier systems. #Innovation #Startups`
      ],
      sports: [
        `🏆 The Quantum Racing finals were absolutely INSANE! ${personality === 'enthusiastic' ? 'I\'m still shaking from that last-second victory! 🤯' : 'Unprecedented performance from both teams.'} Best inter-civilization competition I've seen in decades! #QuantumRacing #Epic`,
        `⚽ Gravity Ball drama continues to unfold! ${personality === 'witty' ? 'The only thing more twisted than the ball\'s trajectory is this season\'s storylines 😂' : 'Complex dynamics affecting multiple teams.'} Can't wait to see how this rivalry plays out. #GravityBall #Drama`,
        `🥇 Olympic preparations are revealing some serious inter-species athletic politics! ${personality === 'cynical' ? 'Nothing brings civilizations together like arguing over who gets the bigger locker rooms 🙄' : 'Fascinating diplomatic challenges emerging.'} This is going to be one memorable games. #Olympics #Politics`
      ]
    };

    const categoryFallbacks = fallbacks[request.contentType] || fallbacks.business;
    return categoryFallbacks[Math.floor(Math.random() * categoryFallbacks.length)];
  }
}

let enhancedAIContentService: EnhancedAIContentService;

export function initializeEnhancedAIContentService(pool: Pool): void {
  enhancedAIContentService = new EnhancedAIContentService(pool);
  console.log('✅ Enhanced AI Content Service initialized');
}

export function getEnhancedAIContentService(): EnhancedAIContentService {
  if (!enhancedAIContentService) {
    throw new Error('Enhanced AI Content Service not initialized');
  }
  return enhancedAIContentService;
}

export default EnhancedAIContentService;
