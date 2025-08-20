import { Witt, WittComment } from '../components/Witter/WitterFeed';
import { GameMasterPersonality } from './ContentGenerator';

export interface SimulatedInteraction {
  id: string;
  wittId: string;
  type: 'LIKE' | 'SHARE' | 'COMMENT';
  authorId: string;
  authorName: string;
  authorType: 'CITIZEN' | 'PERSONALITY' | 'CITY_LEADER' | 'PLANET_LEADER' | 'DIVISION_LEADER' | 'AI_SIMULATED';
  authorAvatar?: string;
  content?: string; // For comments
  timestamp: Date;
  likes: number; // For comment likes
  parentCommentId?: string; // For comment replies
}

export interface InteractionPattern {
  contentType: string;
  baseEngagementRate: number; // 0-1, how likely to get interactions
  likeToShareRatio: number; // Likes per share
  likeToCommentRatio: number; // Likes per comment
  controversyMultiplier: number; // Multiplier for controversial content
  timeDecayRate: number; // How quickly engagement drops over time
}

export class SimulatedInteractionService {
  private personality: GameMasterPersonality;
  private interactionPatterns: Map<string, InteractionPattern>;
  private simulatedUsers: SimulatedUser[];
  private interactionHistory: Map<string, SimulatedInteraction[]>;

  constructor(personality: GameMasterPersonality) {
    this.personality = personality;
    this.interactionPatterns = new Map();
    this.simulatedUsers = [];
    this.interactionHistory = new Map();
    this.initializePatterns();
    this.initializeSimulatedUsers();
  }

  private initializePatterns() {
    // Different content types have different engagement patterns
    this.interactionPatterns.set('GALACTIC_NEWS', {
      contentType: 'GALACTIC_NEWS',
      baseEngagementRate: 0.8,
      likeToShareRatio: 3,
      likeToCommentRatio: 8,
      controversyMultiplier: 1.5,
      timeDecayRate: 0.1
    });

    this.interactionPatterns.set('PLAYER_ACHIEVEMENT', {
      contentType: 'PLAYER_ACHIEVEMENT',
      baseEngagementRate: 0.9,
      likeToShareRatio: 2,
      likeToCommentRatio: 5,
      controversyMultiplier: 1.0,
      timeDecayRate: 0.15
    });

    this.interactionPatterns.set('ECONOMIC_UPDATE', {
      contentType: 'ECONOMIC_UPDATE',
      baseEngagementRate: 0.6,
      likeToShareRatio: 4,
      likeToCommentRatio: 6,
      controversyMultiplier: 1.2,
      timeDecayRate: 0.2
    });

    this.interactionPatterns.set('ALLIANCE_NEWS', {
      contentType: 'ALLIANCE_NEWS',
      baseEngagementRate: 0.7,
      likeToShareRatio: 3,
      likeToCommentRatio: 4,
      controversyMultiplier: 2.0,
      timeDecayRate: 0.12
    });

    this.interactionPatterns.set('DISCOVERY', {
      contentType: 'DISCOVERY',
      baseEngagementRate: 0.85,
      likeToShareRatio: 2.5,
      likeToCommentRatio: 7,
      controversyMultiplier: 1.1,
      timeDecayRate: 0.08
    });

    this.interactionPatterns.set('ROLEPLAY', {
      contentType: 'ROLEPLAY',
      baseEngagementRate: 0.5,
      likeToShareRatio: 5,
      likeToCommentRatio: 3,
      controversyMultiplier: 1.3,
      timeDecayRate: 0.25
    });

    this.interactionPatterns.set('CITIZEN_POST', {
      contentType: 'CITIZEN_POST',
      baseEngagementRate: 0.4,
      likeToShareRatio: 6,
      likeToCommentRatio: 4,
      controversyMultiplier: 1.4,
      timeDecayRate: 0.3
    });
  }

  private initializeSimulatedUsers() {
    // Create a diverse set of simulated users with different personalities
    this.simulatedUsers = [
      // Enthusiastic Citizens
      { id: 'citizen_1', name: 'Zara Stardust', type: 'CITIZEN', personality: 'ENTHUSIASTIC', engagementRate: 0.8 },
      { id: 'citizen_2', name: 'Kai Nebula', type: 'CITIZEN', personality: 'ANALYTICAL', engagementRate: 0.6 },
      { id: 'citizen_3', name: 'Nova Prism', type: 'CITIZEN', personality: 'SUPPORTIVE', engagementRate: 0.7 },
      { id: 'citizen_4', name: 'Orion Flux', type: 'CITIZEN', personality: 'SKEPTICAL', engagementRate: 0.5 },
      { id: 'citizen_5', name: 'Luna Echo', type: 'CITIZEN', personality: 'CURIOUS', engagementRate: 0.9 },

      // Personalities and Influencers
      { id: 'personality_1', name: 'The Cosmic Sage', type: 'PERSONALITY', personality: 'WISE', engagementRate: 0.4 },
      { id: 'personality_2', name: 'Stellar Visionary', type: 'PERSONALITY', personality: 'INSPIRATIONAL', engagementRate: 0.3 },
      { id: 'personality_3', name: 'Quantum Philosopher', type: 'PERSONALITY', personality: 'THOUGHTFUL', engagementRate: 0.5 },

      // Leaders (engage less frequently but with more weight)
      { id: 'leader_1', name: 'Commander Voidstrike', type: 'DIVISION_LEADER', personality: 'AUTHORITATIVE', engagementRate: 0.2 },
      { id: 'leader_2', name: 'Mayor Starweaver', type: 'CITY_LEADER', personality: 'DIPLOMATIC', engagementRate: 0.3 },
      { id: 'leader_3', name: 'Governor Cosmicwind', type: 'PLANET_LEADER', personality: 'STRATEGIC', engagementRate: 0.25 },

      // AI Simulated Users (for consistent background activity)
      { id: 'ai_1', name: 'GalacticBot Alpha', type: 'AI_SIMULATED', personality: 'NEUTRAL', engagementRate: 1.0 },
      { id: 'ai_2', name: 'NewsAnalyzer Beta', type: 'AI_SIMULATED', personality: 'ANALYTICAL', engagementRate: 0.8 },
      { id: 'ai_3', name: 'TrendTracker Gamma', type: 'AI_SIMULATED', personality: 'OBSERVANT', engagementRate: 0.9 }
    ];
  }

  async generateInteractionsForWitt(witt: Witt): Promise<SimulatedInteraction[]> {
    const interactions: SimulatedInteraction[] = [];
    const contentType = this.determineContentType(witt);
    const pattern = this.interactionPatterns.get(contentType) || this.interactionPatterns.get('CITIZEN_POST')!;
    
    // Calculate base engagement based on content type and age
    const ageInHours = (Date.now() - new Date(witt.timestamp).getTime()) / (1000 * 60 * 60);
    const timeDecay = Math.exp(-pattern.timeDecayRate * ageInHours);
    const adjustedEngagementRate = pattern.baseEngagementRate * timeDecay;

    // Determine if this is controversial content
    const isControversial = this.isControversialContent(witt.content);
    const finalEngagementRate = isControversial 
      ? adjustedEngagementRate * pattern.controversyMultiplier 
      : adjustedEngagementRate;

    // Calculate number of interactions
    const baseInteractions = Math.floor(finalEngagementRate * 100); // Scale to reasonable numbers
    const likes = this.randomizeCount(baseInteractions);
    const shares = Math.floor(likes / pattern.likeToShareRatio);
    const comments = Math.floor(likes / pattern.likeToCommentRatio);

    // Generate likes
    for (let i = 0; i < likes; i++) {
      const user = this.selectRandomUser();
      if (Math.random() < user.engagementRate) {
        interactions.push({
          id: `like_${witt.id}_${i}`,
          wittId: witt.id,
          type: 'LIKE',
          authorId: user.id,
          authorName: user.name,
          authorType: user.type as any,
          timestamp: this.generateRealisticTimestamp(witt.timestamp),
          likes: 0
        });
      }
    }

    // Generate shares
    for (let i = 0; i < shares; i++) {
      const user = this.selectRandomUser();
      if (Math.random() < user.engagementRate * 0.3) { // Shares are less common
        interactions.push({
          id: `share_${witt.id}_${i}`,
          wittId: witt.id,
          type: 'SHARE',
          authorId: user.id,
          authorName: user.name,
          authorType: user.type as any,
          timestamp: this.generateRealisticTimestamp(witt.timestamp),
          likes: 0
        });
      }
    }

    // Generate comments
    for (let i = 0; i < comments; i++) {
      const user = this.selectRandomUser();
      if (Math.random() < user.engagementRate * 0.4) { // Comments require more engagement
        const comment = this.generateComment(witt, user, contentType);
        interactions.push({
          id: `comment_${witt.id}_${i}`,
          wittId: witt.id,
          type: 'COMMENT',
          authorId: user.id,
          authorName: user.name,
          authorType: user.type as any,
          content: comment,
          timestamp: this.generateRealisticTimestamp(witt.timestamp),
          likes: this.randomizeCount(Math.floor(Math.random() * 10)) // Comments can get likes too
        });
      }
    }

    // Store interactions for consistency
    this.interactionHistory.set(witt.id, interactions);
    
    return interactions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async generateCommentReplies(comment: WittComment, maxReplies: number = 3): Promise<SimulatedInteraction[]> {
    const replies: SimulatedInteraction[] = [];
    const replyCount = Math.floor(Math.random() * maxReplies);

    for (let i = 0; i < replyCount; i++) {
      const user = this.selectRandomUser();
      if (Math.random() < user.engagementRate * 0.2) { // Replies are even less common
        const replyContent = this.generateCommentReply(comment, user);
        
        replies.push({
          id: `reply_${comment.id}_${i}`,
          wittId: comment.wittId,
          type: 'COMMENT',
          authorId: user.id,
          authorName: user.name,
          authorType: user.type as any,
          content: replyContent,
          timestamp: new Date(new Date(comment.timestamp).getTime() + Math.random() * 3600000), // Within an hour
          likes: this.randomizeCount(Math.floor(Math.random() * 5)),
          parentCommentId: comment.id
        });
      }
    }

    return replies;
  }

  private determineContentType(witt: Witt): string {
    const content = witt.content.toLowerCase();
    
    if (content.includes('breaking') || content.includes('alert') || content.includes('update')) {
      return 'GALACTIC_NEWS';
    }
    if (content.includes('achievement') || content.includes('victory') || content.includes('breakthrough')) {
      return 'PLAYER_ACHIEVEMENT';
    }
    if (content.includes('trade') || content.includes('market') || content.includes('economic')) {
      return 'ECONOMIC_UPDATE';
    }
    if (content.includes('alliance') || content.includes('faction') || content.includes('diplomatic')) {
      return 'ALLIANCE_NEWS';
    }
    if (content.includes('discovery') || content.includes('scientific') || content.includes('research')) {
      return 'DISCOVERY';
    }
    if (witt.authorType === 'PLAYER') {
      return 'ROLEPLAY';
    }
    
    return 'CITIZEN_POST';
  }

  private isControversialContent(content: string): boolean {
    const controversialKeywords = [
      'conflict', 'war', 'dispute', 'tension', 'crisis', 'threat',
      'controversial', 'debate', 'opposition', 'protest', 'scandal'
    ];
    
    return controversialKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
  }

  private selectRandomUser(): SimulatedUser {
    // Weight selection based on engagement rates
    const totalWeight = this.simulatedUsers.reduce((sum, user) => sum + user.engagementRate, 0);
    let random = Math.random() * totalWeight;
    
    for (const user of this.simulatedUsers) {
      random -= user.engagementRate;
      if (random <= 0) {
        return user;
      }
    }
    
    return this.simulatedUsers[0]; // Fallback
  }

  private generateRealisticTimestamp(originalTimestamp: Date): Date {
    const original = new Date(originalTimestamp).getTime();
    const now = Date.now();
    const maxAge = now - original;
    
    // Most interactions happen within the first few hours
    const timeOffset = Math.random() * Math.min(maxAge, 24 * 60 * 60 * 1000); // Max 24 hours
    const skewedOffset = Math.pow(Math.random(), 2) * timeOffset; // Skew towards earlier times
    
    return new Date(original + skewedOffset);
  }

  private generateComment(witt: Witt, user: SimulatedUser, contentType: string): string {
    const commentTemplates = this.getCommentTemplates(user.personality, contentType);
    const template = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
    
    return this.fillCommentTemplate(template, witt, user);
  }

  private generateCommentReply(comment: WittComment, user: SimulatedUser): string {
    const replyTemplates = this.getReplyTemplates(user.personality);
    const template = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];
    
    return this.fillReplyTemplate(template, comment, user);
  }

  private getCommentTemplates(personality: string, contentType: string): string[] {
    const baseTemplates = {
      ENTHUSIASTIC: [
        "This is amazing! 🚀",
        "Incredible news! Thanks for sharing! ⭐",
        "Wow, this changes everything! 🌟",
        "So excited about this development! 🎉"
      ],
      ANALYTICAL: [
        "Interesting implications for {topic}. What are your thoughts on {aspect}?",
        "The data suggests {observation}. Worth monitoring closely.",
        "This aligns with recent trends in {area}. Good analysis.",
        "Key factors to consider: {factors}."
      ],
      SUPPORTIVE: [
        "Great work, everyone involved! 👏",
        "This is exactly what we needed. Well done! ✨",
        "Proud to see such progress! Keep it up! 💪",
        "Supporting this initiative 100%! 🤝"
      ],
      SKEPTICAL: [
        "Hmm, not sure about this. Need more details.",
        "Sounds too good to be true. What's the catch?",
        "I'll believe it when I see the results.",
        "Cautiously optimistic, but we'll see..."
      ],
      CURIOUS: [
        "Tell me more about {detail}! 🤔",
        "How does this affect {related_topic}?",
        "What's the timeline for implementation?",
        "Any plans for {follow_up}?"
      ],
      WISE: [
        "As expected. The signs were there for those who looked.",
        "This reminds me of similar events in {historical_context}.",
        "Wisdom suggests we {advice}.",
        "The implications reach far beyond what most realize."
      ],
      INSPIRATIONAL: [
        "This shows what we can achieve together! 🌟",
        "Let this inspire us to reach even higher! 🚀",
        "The future is bright with developments like this! ✨",
        "Together, we're building something amazing! 🌌"
      ],
      THOUGHTFUL: [
        "This raises important questions about {philosophical_aspect}.",
        "Worth considering the long-term implications.",
        "A thoughtful approach to {challenge}.",
        "The deeper meaning here is {insight}."
      ],
      AUTHORITATIVE: [
        "Strategic implications are significant. Monitoring closely.",
        "This aligns with our operational priorities.",
        "Noted. Will coordinate appropriate response.",
        "Acknowledged. Proceeding according to protocol."
      ],
      DIPLOMATIC: [
        "Excellent progress through cooperation and dialogue.",
        "This demonstrates the value of working together.",
        "A positive step forward for all parties involved.",
        "Diplomatic solutions yield the best outcomes."
      ],
      STRATEGIC: [
        "This fits our long-term strategic objectives.",
        "Calculating optimal response parameters.",
        "Resource allocation will need adjustment.",
        "Timeline aligns with projected milestones."
      ],
      NEUTRAL: [
        "Acknowledged. Data logged for analysis.",
        "Information processed. Standing by for updates.",
        "Confirmed. Monitoring situation.",
        "Update received. Continuing observation."
      ],
      OBSERVANT: [
        "Interesting pattern emerging in recent events.",
        "This correlates with {trend} we've been tracking.",
        "Notable development. Adding to trend analysis.",
        "Observation: {pattern} continues to hold."
      ]
    };

    return baseTemplates[personality as keyof typeof baseTemplates] || baseTemplates.NEUTRAL;
  }

  private getReplyTemplates(personality: string): string[] {
    const replyTemplates = {
      ENTHUSIASTIC: [
        "Exactly! Couldn't agree more! 🎯",
        "Yes! That's the spirit! 🚀",
        "Absolutely right! 💯"
      ],
      ANALYTICAL: [
        "Good point. Have you considered {aspect}?",
        "That's one perspective. Another angle might be {alternative}.",
        "Interesting analysis. The data also shows {additional_info}."
      ],
      SUPPORTIVE: [
        "Well said! 👍",
        "I'm with you on this! 🤝",
        "Couldn't have put it better myself! ✨"
      ],
      SKEPTICAL: [
        "I'm not convinced. What evidence supports that?",
        "That seems optimistic. What about {concern}?",
        "Maybe, but we should be cautious about {risk}."
      ],
      CURIOUS: [
        "Can you elaborate on that?",
        "What makes you think that?",
        "How did you come to that conclusion?"
      ],
      NEUTRAL: [
        "Noted.",
        "Understood.",
        "Acknowledged."
      ]
    };

    return replyTemplates[personality as keyof typeof replyTemplates] || replyTemplates.NEUTRAL;
  }

  private fillCommentTemplate(template: string, witt: Witt, user: SimulatedUser): string {
    const replacements = {
      '{topic}': this.extractMainTopic(witt.content),
      '{aspect}': this.getRandomAspect(),
      '{observation}': this.getRandomObservation(),
      '{area}': this.getRandomArea(),
      '{factors}': this.getRandomFactors(),
      '{detail}': this.getRandomDetail(),
      '{related_topic}': this.getRandomRelatedTopic(),
      '{follow_up}': this.getRandomFollowUp(),
      '{historical_context}': this.getRandomHistoricalContext(),
      '{advice}': this.getRandomAdvice(),
      '{philosophical_aspect}': this.getRandomPhilosophicalAspect(),
      '{challenge}': this.getRandomChallenge(),
      '{insight}': this.getRandomInsight(),
      '{trend}': this.getRandomTrend(),
      '{pattern}': this.getRandomPattern()
    };

    let result = template;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      result = result.replace(placeholder, value);
    });

    return result;
  }

  private fillReplyTemplate(template: string, comment: WittComment, user: SimulatedUser): string {
    const replacements = {
      '{aspect}': this.getRandomAspect(),
      '{alternative}': this.getRandomAlternative(),
      '{additional_info}': this.getRandomAdditionalInfo(),
      '{concern}': this.getRandomConcern(),
      '{risk}': this.getRandomRisk()
    };

    let result = template;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      result = result.replace(placeholder, value);
    });

    return result;
  }

  private randomizeCount(baseCount: number): number {
    // Add some randomness to make interactions feel more natural
    const variance = 0.3; // 30% variance
    const min = Math.floor(baseCount * (1 - variance));
    const max = Math.floor(baseCount * (1 + variance));
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Helper methods for generating realistic content
  private extractMainTopic(content: string): string {
    const topics = ['trade', 'exploration', 'diplomacy', 'technology', 'culture', 'security'];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private getRandomAspect(): string {
    const aspects = ['economic impact', 'strategic implications', 'cultural significance', 'technological advancement'];
    return aspects[Math.floor(Math.random() * aspects.length)];
  }

  private getRandomObservation(): string {
    const observations = ['a clear upward trend', 'some interesting correlations', 'potential for growth', 'room for improvement'];
    return observations[Math.floor(Math.random() * observations.length)];
  }

  private getRandomArea(): string {
    const areas = ['galactic commerce', 'interstellar relations', 'technological development', 'cultural exchange'];
    return areas[Math.floor(Math.random() * areas.length)];
  }

  private getRandomFactors(): string {
    const factors = ['resource availability, political stability', 'market conditions, technological readiness', 'diplomatic relations, economic factors'];
    return factors[Math.floor(Math.random() * factors.length)];
  }

  private getRandomDetail(): string {
    const details = ['the implementation timeline', 'the resource requirements', 'the potential challenges', 'the expected outcomes'];
    return details[Math.floor(Math.random() * details.length)];
  }

  private getRandomRelatedTopic(): string {
    const topics = ['other sectors', 'similar initiatives', 'long-term planning', 'resource allocation'];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private getRandomFollowUp(): string {
    const followUps = ['expansion to other regions', 'similar projects', 'community involvement', 'long-term sustainability'];
    return followUps[Math.floor(Math.random() * followUps.length)];
  }

  private getRandomHistoricalContext(): string {
    const contexts = ['the Great Expansion Era', 'the Unity Wars period', 'the Golden Age of Trade', 'the Discovery Renaissance'];
    return contexts[Math.floor(Math.random() * contexts.length)];
  }

  private getRandomAdvice(): string {
    const advice = ['proceed with caution', 'embrace the opportunity', 'prepare for challenges', 'build strong foundations'];
    return advice[Math.floor(Math.random() * advice.length)];
  }

  private getRandomPhilosophicalAspect(): string {
    const aspects = ['the nature of progress', 'our place in the galaxy', 'the meaning of cooperation', 'the value of diversity'];
    return aspects[Math.floor(Math.random() * aspects.length)];
  }

  private getRandomChallenge(): string {
    const challenges = ['resource management', 'cultural integration', 'technological adaptation', 'diplomatic balance'];
    return challenges[Math.floor(Math.random() * challenges.length)];
  }

  private getRandomInsight(): string {
    const insights = ['true strength comes from unity', 'innovation drives progress', 'diversity enriches us all', 'patience yields wisdom'];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private getRandomTrend(): string {
    const trends = ['increased cooperation', 'technological acceleration', 'cultural exchange', 'economic growth'];
    return trends[Math.floor(Math.random() * trends.length)];
  }

  private getRandomPattern(): string {
    const patterns = ['collaborative success', 'innovation cycles', 'diplomatic progress', 'economic stability'];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  private getRandomAlternative(): string {
    const alternatives = ['focusing on sustainability', 'prioritizing community needs', 'emphasizing long-term benefits', 'considering environmental impact'];
    return alternatives[Math.floor(Math.random() * alternatives.length)];
  }

  private getRandomAdditionalInfo(): string {
    const info = ['similar success in other sectors', 'positive feedback from stakeholders', 'strong community support', 'promising early indicators'];
    return info[Math.floor(Math.random() * info.length)];
  }

  private getRandomConcern(): string {
    const concerns = ['resource constraints', 'implementation challenges', 'potential side effects', 'timeline pressures'];
    return concerns[Math.floor(Math.random() * concerns.length)];
  }

  private getRandomRisk(): string {
    const risks = ['overextension', 'market volatility', 'technological dependencies', 'political changes'];
    return risks[Math.floor(Math.random() * risks.length)];
  }

  // Public method to get consistent interactions for a witt
  async getInteractionsForWitt(wittId: string): Promise<SimulatedInteraction[]> {
    return this.interactionHistory.get(wittId) || [];
  }

  // Method to ensure all players see the same interactions
  async synchronizeInteractions(wittIds: string[]): Promise<Map<string, SimulatedInteraction[]>> {
    const syncedInteractions = new Map<string, SimulatedInteraction[]>();
    
    for (const wittId of wittIds) {
      const interactions = this.interactionHistory.get(wittId);
      if (interactions) {
        syncedInteractions.set(wittId, interactions);
      }
    }
    
    return syncedInteractions;
  }
}

interface SimulatedUser {
  id: string;
  name: string;
  type: 'CITIZEN' | 'PERSONALITY' | 'CITY_LEADER' | 'PLANET_LEADER' | 'DIVISION_LEADER' | 'AI_SIMULATED';
  personality: string;
  engagementRate: number; // 0-1, how likely to interact
}

export default SimulatedInteractionService;
