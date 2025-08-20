import { Witt } from '../components/Witter/WitterFeed';

export interface ContentGenerationOptions {
  authorId: string;
  authorName: string;
  authorType: 'CITIZEN' | 'PERSONALITY' | 'CITY_LEADER' | 'PLANET_LEADER' | 'DIVISION_LEADER' | 'PLAYER';
  gameContext: string;
  location: string;
  personality?: string;
  topics?: string[];
}

export class ContentGenerator {
  private static instance: ContentGenerator;

  public static getInstance(): ContentGenerator {
    if (!ContentGenerator.instance) {
      ContentGenerator.instance = new ContentGenerator();
    }
    return ContentGenerator.instance;
  }

  public generateContent(options: ContentGenerationOptions): Witt {
    const templates = [
      `Exploring the wonders of ${options.location}! The future is bright! #Exploration`,
      `Amazing discoveries happening in ${options.location}. Science never sleeps! #Discovery`,
      `Great meeting with fellow citizens in ${options.location}. Unity through diversity! #Community`,
      `The trade opportunities in ${options.location} are incredible! #Business`,
      `Cultural exchange in ${options.location} enriches us all! #Culture`
    ];

    const content = templates[Math.floor(Math.random() * templates.length)];

    return {
      id: `witt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: options.authorId,
      authorType: options.authorType,
      authorName: options.authorName,
      content,
      timestamp: new Date(),
      metadata: {
        gameContext: options.gameContext,
        location: options.location,
        category: 'social',
        topics: options.topics || ['general'],
        personality: options.personality || 'neutral'
      },
      likes: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 20),
      comments: Math.floor(Math.random() * 15),
      isLiked: false,
      isShared: false
    };
  }

  public generateBulkContent(count: number, baseOptions: Partial<ContentGenerationOptions>): Witt[] {
    const witts: Witt[] = [];
    
    for (let i = 0; i < count; i++) {
      const options: ContentGenerationOptions = {
        authorId: baseOptions.authorId || `npc_${i}`,
        authorName: baseOptions.authorName || `Citizen ${i}`,
        authorType: baseOptions.authorType || 'CITIZEN',
        gameContext: baseOptions.gameContext || 'Galactic Social Network',
        location: baseOptions.location || 'Sol System',
        personality: baseOptions.personality,
        topics: baseOptions.topics
      };

      witts.push(this.generateContent(options));
    }

    return witts;
  }
}