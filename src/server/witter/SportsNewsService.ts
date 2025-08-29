import { Pool } from 'pg';
import { getEnhancedAIContentService } from './EnhancedAIContentService';

export interface SportsNewsPost {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'SPORTS_MEDIA' | 'ATHLETE' | 'FAN' | 'ANALYST';
  authorAvatar: string;
  content: string;
  timestamp: Date;
  metadata: {
    category: 'SPORTS_NEWS' | 'GAME_RESULTS' | 'ATHLETE_NEWS' | 'OLYMPICS' | 'LEAGUE_NEWS';
    sportType: 'GRAVITY_BALL' | 'QUANTUM_RACING' | 'ZERO_G_COMBAT' | 'NEURAL_CHESS' | 'HOLO_TENNIS' | 'SPACE_MARATHON';
    league?: string;
    teams?: string[];
    athletes?: string[];
    civilizations?: string[];
    urgency?: 'HIGH' | 'MEDIUM' | 'LOW';
    sourceCredibility?: number;
  };
  metrics: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface SportsCommentary {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorType: 'FAN' | 'ANALYST' | 'FORMER_ATHLETE' | 'CITIZEN';
  content: string;
  timestamp: Date;
  fanLoyalty: 'HOME_TEAM' | 'AWAY_TEAM' | 'NEUTRAL';
  expertise: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class SportsNewsService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Generate enhanced AI-powered sports news
  async generateSportsNews(civilizationId: number, count: number = 5): Promise<SportsNewsPost[]> {
    try {
      // Build rich sports context
      const gameContext = {
        currentEvents: [
          'Interplanetary Gravity Ball League playoffs underway',
          'Quantum Racing championship series heating up',
          'Zero-G Combat Federation introducing new weight classes'
        ],
        economicStatus: 'Sports betting markets showing record activity',
        politicalClimate: 'Inter-civilization Olympic negotiations ongoing',
        recentNews: [
          'Major athlete trade between Terra Prime and Alpha Centauri',
          'New anti-doping regulations affecting multiple leagues',
          'Fan violence incidents spark security discussions'
        ]
      };

      // Use enhanced AI content service
      const enhancedAIService = getEnhancedAIContentService();
      const aiPosts = await enhancedAIService.generateEnhancedContent({
        contentType: 'sports',
        civilizationId,
        gameContext
      }, count);

      // Convert AI posts to SportsNewsPost format
      return aiPosts.map(aiPost => ({
        id: aiPost.id,
        authorId: aiPost.authorId,
        authorName: aiPost.authorName,
        authorType: aiPost.authorType as 'SPORTS_MEDIA' | 'ATHLETE' | 'FAN' | 'ANALYST',
        authorAvatar: aiPost.authorAvatar,
        content: aiPost.content,
        timestamp: aiPost.timestamp,
        metadata: {
          category: this.randomSportsCategory(),
          sportType: this.randomSportType(),
          league: this.randomLeague(),
          teams: this.randomTeams(),
          athletes: this.randomAthletes(),
          civilizations: this.randomCivilizations(),
          urgency: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW',
          sourceCredibility: Math.floor(Math.random() * 3) + 7 // 7-9
        },
        metrics: aiPost.metrics
      }));

    } catch (error) {
      console.error('Error generating enhanced sports news:', error);
      // Fallback to a few simple posts
      return this.generateFallbackSportsNews(civilizationId, Math.min(count, 3));
    }
  }

  private randomSportsCategory(): 'SPORTS_NEWS' | 'GAME_RESULTS' | 'ATHLETE_NEWS' | 'OLYMPICS' | 'LEAGUE_NEWS' {
    const categories = ['SPORTS_NEWS', 'GAME_RESULTS', 'ATHLETE_NEWS', 'OLYMPICS', 'LEAGUE_NEWS'];
    return categories[Math.floor(Math.random() * categories.length)] as any;
  }

  private randomSportType(): 'GRAVITY_BALL' | 'QUANTUM_RACING' | 'ZERO_G_COMBAT' | 'NEURAL_CHESS' | 'HOLO_TENNIS' | 'SPACE_MARATHON' {
    const sports = ['GRAVITY_BALL', 'QUANTUM_RACING', 'ZERO_G_COMBAT', 'NEURAL_CHESS', 'HOLO_TENNIS', 'SPACE_MARATHON'];
    return sports[Math.floor(Math.random() * sports.length)] as any;
  }

  private randomLeague(): string {
    const leagues = [
      'Interplanetary Gravity Ball League',
      'Galactic Quantum Racing Circuit',
      'Zero-G Combat Federation',
      'Neural Chess Masters League',
      'Holo-Tennis Championship Series',
      'Space Marathon Association'
    ];
    return leagues[Math.floor(Math.random() * leagues.length)];
  }

  private randomTeams(): string[] {
    const teams = [
      'Terra Prime Titans', 'Alpha Centauri Comets', 'Vega Velocity', 'Proxima Predators',
      'Kepler Knights', 'Sirius Storm', 'Andromeda Aces', 'Orion Outlaws',
      'Nebula Navigators', 'Cosmos Crushers', 'Stellar Strikers', 'Galactic Guardians'
    ];
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 teams
    const shuffled = teams.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private randomAthletes(): string[] {
    const athletes = [
      'Zara "Lightning" Voss', 'Marcus "Gravity" Chen', 'Nova "Mindstorm" Patel',
      'Rex "Zero-G" Martinez', 'Luna "Quantum" Stark', 'Phoenix "Blaze" Torres',
      'Kai "Velocity" Wong', 'Aria "Storm" Blake', 'Orion "Titan" Cross',
      'Sage "Phantom" Rivers', 'Atlas "Thunder" Kane', 'Echo "Swift" Vale'
    ];
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 athletes
    const shuffled = athletes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private randomCivilizations(): string[] {
    const civilizations = [
      'Terran Republic', 'Alpha Centauri Alliance', 'Vega Federation',
      'Proxima Coalition', 'Kepler Union', 'Sirius Empire'
    ];
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 civilizations
    const shuffled = civilizations.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private async generateFallbackSportsNews(civilizationId: number, count: number): Promise<SportsNewsPost[]> {
    const fallbackPosts: SportsNewsPost[] = [];
    
    const fallbackContent = [
      "🏆 The Quantum Racing finals just delivered the most INSANE finish in galactic sports history! Three civilizations, one photo finish, and a controversy that's got everyone talking. This is why we love inter-planetary competition! 🚀 #QuantumRacing #Epic #GalacticSports",
      "⚽ Gravity Ball drama reaches new heights as the Terra Prime Titans pull off the impossible comeback! Down by 12 points in the final quarter, they somehow defied physics AND expectations. The crowd is still going wild! 🤯 #GravityBall #Comeback #Unbelievable",
      "🥇 Olympic preparations are getting spicy as athlete eligibility debates heat up between civilizations! Apparently, cybernetic enhancements are causing quite the diplomatic incident. Nothing like sports to bring out the politics! 😅 #Olympics #Drama #InterCivRivalry"
    ];

    for (let i = 0; i < Math.min(count, fallbackContent.length); i++) {
      fallbackPosts.push({
        id: `fallback_sports_${Date.now()}_${i}`,
        authorId: 'galactic_sports_network',
        authorName: 'Galactic Sports Network',
        authorType: 'SPORTS_MEDIA',
        authorAvatar: '🏆',
        content: fallbackContent[i],
        timestamp: new Date(),
        metadata: {
          category: 'SPORTS_NEWS',
          sportType: 'GRAVITY_BALL',
          urgency: 'HIGH',
          sourceCredibility: 9
        },
        metrics: {
          likes: Math.floor(Math.random() * 800) + 200,
          shares: Math.floor(Math.random() * 400) + 100,
          comments: Math.floor(Math.random() * 200) + 50
        }
      });
    }

    return fallbackPosts;
  }

  private async generateSportsPost(newsType: string, civilizationId: number): Promise<SportsNewsPost | null> {
    switch (newsType) {
      case 'game_results':
        return this.generateGameResults(civilizationId);
      
      case 'athlete_spotlight':
        return this.generateAthleteSpotlight(civilizationId);
      
      case 'league_standings':
        return this.generateLeagueStandings(civilizationId);
      
      case 'olympics_update':
        return this.generateOlympicsUpdate();
      
      case 'trade_news':
        return this.generateTradeNews(civilizationId);
      
      case 'injury_report':
        return this.generateInjuryReport(civilizationId);
      
      default:
        return null;
    }
  }

  private async generateGameResults(civilizationId: number): Promise<SportsNewsPost> {
    const sports = ['GRAVITY_BALL', 'QUANTUM_RACING', 'ZERO_G_COMBAT', 'NEURAL_CHESS'];
    const sport = sports[Math.floor(Math.random() * sports.length)];
    
    const teams = [
      'Terra Prime Titans', 'Alpha Centauri Comets', 'Vega Velocity', 'Proxima Predators',
      'Kepler Knights', 'Sirius Storm', 'Andromeda Aces', 'Orion Outlaws'
    ];
    
    const homeTeam = teams[Math.floor(Math.random() * teams.length)];
    const awayTeam = teams.filter(t => t !== homeTeam)[Math.floor(Math.random() * (teams.length - 1))];
    
    const homeScore = Math.floor(Math.random() * 50) + 20;
    const awayScore = Math.floor(Math.random() * 50) + 20;
    const winner = homeScore > awayScore ? homeTeam : awayTeam;

    const content = `🏆 GAME RESULTS: ${homeTeam} defeats ${awayTeam} ${Math.max(homeScore, awayScore)}-${Math.min(homeScore, awayScore)} in thrilling ${sport.replace('_', ' ').toLowerCase()} match! Crowd of 85,000 witnesses historic comeback in final quarter. #${sport} #GameResults`;

    return {
      id: `sports_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'galactic_sports_network',
      authorName: 'Galactic Sports Network',
      authorType: 'SPORTS_MEDIA',
      authorAvatar: '🏆',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'GAME_RESULTS',
        sportType: sport as any,
        teams: [homeTeam, awayTeam],
        urgency: 'HIGH',
        sourceCredibility: 9
      },
      metrics: {
        likes: Math.floor(Math.random() * 500) + 100,
        shares: Math.floor(Math.random() * 200) + 50,
        comments: Math.floor(Math.random() * 150) + 30
      }
    };
  }

  private async generateAthleteSpotlight(civilizationId: number): Promise<SportsNewsPost> {
    const athletes = [
      { name: 'Zara "Lightning" Voss', sport: 'QUANTUM_RACING', achievement: 'breaks speed record' },
      { name: 'Marcus "Gravity" Chen', sport: 'GRAVITY_BALL', achievement: 'scores career-high 45 points' },
      { name: 'Nova "Mindstorm" Patel', sport: 'NEURAL_CHESS', achievement: 'wins championship' },
      { name: 'Rex "Zero-G" Martinez', sport: 'ZERO_G_COMBAT', achievement: 'defeats defending champion' }
    ];

    const athlete = athletes[Math.floor(Math.random() * athletes.length)];
    
    const content = `⭐ ATHLETE SPOTLIGHT: ${athlete.name} ${athlete.achievement} in stunning ${athlete.sport.replace('_', ' ').toLowerCase()} performance! The crowd erupted as records fell and history was made. Rising star to watch this season! #${athlete.sport} #AthleteSpotlight`;

    return {
      id: `athlete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'sports_central',
      authorName: 'Sports Central',
      authorType: 'SPORTS_MEDIA',
      authorAvatar: '⭐',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'ATHLETE_NEWS',
        sportType: athlete.sport as any,
        athletes: [athlete.name],
        urgency: 'MEDIUM',
        sourceCredibility: 8
      },
      metrics: {
        likes: Math.floor(Math.random() * 300) + 75,
        shares: Math.floor(Math.random() * 120) + 30,
        comments: Math.floor(Math.random() * 80) + 20
      }
    };
  }

  private async generateLeagueStandings(civilizationId: number): Promise<SportsNewsPost> {
    const leagues = [
      'Interplanetary Gravity Ball League',
      'Galactic Quantum Racing Circuit', 
      'Zero-G Combat Federation',
      'Neural Chess Masters League'
    ];

    const league = leagues[Math.floor(Math.random() * leagues.length)];
    const weeksRemaining = Math.floor(Math.random() * 8) + 2;

    const content = `📊 LEAGUE UPDATE: Standings shake-up in the ${league} as we enter the final ${weeksRemaining} weeks of regular season! Playoff picture becoming clearer with several teams fighting for wildcard spots. #LeagueStandings #Playoffs`;

    return {
      id: `standings_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'league_insider',
      authorName: 'League Insider',
      authorType: 'SPORTS_MEDIA',
      authorAvatar: '📊',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'LEAGUE_NEWS',
        sportType: 'GRAVITY_BALL', // Default
        league,
        urgency: 'LOW',
        sourceCredibility: 7
      },
      metrics: {
        likes: Math.floor(Math.random() * 200) + 40,
        shares: Math.floor(Math.random() * 80) + 20,
        comments: Math.floor(Math.random() * 60) + 15
      }
    };
  }

  private async generateOlympicsUpdate(): Promise<SportsNewsPost> {
    const events = [
      'medal ceremony',
      'record-breaking performance',
      'opening ceremony',
      'closing ceremony',
      'athlete village news',
      'new sport introduction'
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    const daysUntil = Math.floor(Math.random() * 365) + 30;

    const content = event === 'medal ceremony'
      ? `🥇 OLYMPICS: Historic ${event} as three civilizations share podium in unprecedented display of sportsmanship! Terran Republic takes gold in Quantum Racing while Alpha Centauri claims silver. #Olympics #Unity`
      : `🌟 OLYMPICS UPDATE: ${daysUntil} days until the Galactic Olympics! Preparations underway for the most spectacular inter-civilization sporting event in history. New venues showcasing cutting-edge technology. #Olympics #Countdown`;

    return {
      id: `olympics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'olympics_official',
      authorName: 'Olympic Broadcasting Service',
      authorType: 'SPORTS_MEDIA',
      authorAvatar: '🥇',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'OLYMPICS',
        sportType: 'QUANTUM_RACING',
        civilizations: ['Terran Republic', 'Alpha Centauri', 'Vega Alliance'],
        urgency: 'HIGH',
        sourceCredibility: 10
      },
      metrics: {
        likes: Math.floor(Math.random() * 800) + 200,
        shares: Math.floor(Math.random() * 400) + 100,
        comments: Math.floor(Math.random() * 200) + 50
      }
    };
  }

  private async generateTradeNews(civilizationId: number): Promise<SportsNewsPost> {
    const teams = ['Terra Prime Titans', 'Alpha Centauri Comets', 'Vega Velocity'];
    const team1 = teams[Math.floor(Math.random() * teams.length)];
    const team2 = teams.filter(t => t !== team1)[Math.floor(Math.random() * (teams.length - 1))];

    const content = `🔄 TRADE NEWS: BREAKING - ${team1} trades star player to ${team2} in blockbuster deal! Multi-year contract includes performance bonuses and draft picks. Fans react with mixed emotions to franchise-changing move. #TradeNews #Blockbuster`;

    return {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'trade_tracker',
      authorName: 'Trade Tracker',
      authorType: 'SPORTS_MEDIA',
      authorAvatar: '🔄',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'SPORTS_NEWS',
        sportType: 'GRAVITY_BALL',
        teams: [team1, team2],
        urgency: 'HIGH',
        sourceCredibility: 8
      },
      metrics: {
        likes: Math.floor(Math.random() * 400) + 80,
        shares: Math.floor(Math.random() * 180) + 40,
        comments: Math.floor(Math.random() * 120) + 25
      }
    };
  }

  private async generateInjuryReport(civilizationId: number): Promise<SportsNewsPost> {
    const athletes = ['Zara Voss', 'Marcus Chen', 'Nova Patel', 'Rex Martinez'];
    const athlete = athletes[Math.floor(Math.random() * athletes.length)];
    const injuries = ['minor strain', 'sprained ankle', 'concussion protocol', 'equipment malfunction'];
    const injury = injuries[Math.floor(Math.random() * injuries.length)];

    const content = `🏥 INJURY REPORT: ${athlete} listed as day-to-day with ${injury}. Medical staff optimistic about quick recovery. Team adjusts lineup for upcoming matches while star player focuses on rehabilitation. #InjuryReport #PlayerHealth`;

    return {
      id: `injury_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'sports_medicine_update',
      authorName: 'Sports Medicine Update',
      authorType: 'SPORTS_MEDIA',
      authorAvatar: '🏥',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'ATHLETE_NEWS',
        sportType: 'GRAVITY_BALL',
        athletes: [athlete],
        urgency: 'MEDIUM',
        sourceCredibility: 8
      },
      metrics: {
        likes: Math.floor(Math.random() * 150) + 30,
        shares: Math.floor(Math.random() * 60) + 15,
        comments: Math.floor(Math.random() * 40) + 10
      }
    };
  }

  // Generate sports commentary from fans and analysts
  async generateSportsCommentary(sportsPost: SportsNewsPost, count: number = 3): Promise<SportsCommentary[]> {
    const comments: SportsCommentary[] = [];

    const fanTypes = [
      { type: 'FAN', expertise: 'LOW', loyalty: 'HOME_TEAM' },
      { type: 'FAN', expertise: 'LOW', loyalty: 'AWAY_TEAM' },
      { type: 'ANALYST', expertise: 'HIGH', loyalty: 'NEUTRAL' },
      { type: 'FORMER_ATHLETE', expertise: 'HIGH', loyalty: 'NEUTRAL' },
      { type: 'CITIZEN', expertise: 'MEDIUM', loyalty: 'NEUTRAL' }
    ];

    for (let i = 0; i < count; i++) {
      const fan = fanTypes[Math.floor(Math.random() * fanTypes.length)];
      const comment = await this.generateSportsComment(fan, sportsPost);
      
      if (comment) {
        comments.push(comment);
      }
    }

    return comments;
  }

  private async generateSportsComment(fan: any, post: SportsNewsPost): Promise<SportsCommentary> {
    const commentTemplates = {
      HOME_TEAM: [
        "YES! That's what I'm talking about! 🙌",
        "Our team is unstoppable this season! 💪",
        "Been a fan for 20 years, this is our year! 🏆",
        "Home field advantage showing! 🏠",
        "Championship bound! 🚀"
      ],
      AWAY_TEAM: [
        "Tough loss but we'll bounce back stronger 💪",
        "Refs clearly favored the home team 🙄",
        "Our defense needs work but offense looked good 📈",
        "Still early in the season, plenty of time ⏰",
        "Proud of the effort despite the result 👏"
      ],
      NEUTRAL: [
        "Great game by both teams! 👏",
        "The level of play keeps improving every year 📈",
        "Love seeing the sportsmanship out there 🤝",
        "This sport is getting more exciting! 🔥",
        "Amazing athletic performance from everyone 💫"
      ]
    };

    const templates = commentTemplates[fan.loyalty] || commentTemplates.NEUTRAL;
    const content = templates[Math.floor(Math.random() * templates.length)];

    return {
      id: `sports_comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId: post.id,
      authorId: `${fan.type.toLowerCase()}_${Math.random().toString(36).substr(2, 6)}`,
      authorName: `${fan.type === 'FAN' ? 'Fan' : fan.type} ${Math.floor(Math.random() * 999) + 1}`,
      authorType: fan.type,
      content,
      timestamp: new Date(Date.now() + Math.random() * 3600000),
      fanLoyalty: fan.loyalty,
      expertise: fan.expertise
    };
  }

  // Get sports news for Witter feed integration
  async getSportsNewsForFeed(civilizationId: number, limit: number = 8): Promise<SportsNewsPost[]> {
    return this.generateSportsNews(civilizationId, limit);
  }

  // Get sports commentary for a specific post
  async getSportsCommentaryForPost(postId: string, limit: number = 5): Promise<SportsCommentary[]> {
    // Generate fresh commentary for the post
    const mockPost: SportsNewsPost = {
      id: postId,
      authorId: 'mock',
      authorName: 'Mock',
      authorType: 'SPORTS_MEDIA',
      authorAvatar: '🏆',
      content: 'Mock sports news post',
      timestamp: new Date(),
      metadata: {
        category: 'SPORTS_NEWS',
        sportType: 'GRAVITY_BALL'
      },
      metrics: { likes: 0, shares: 0, comments: 0 }
    };

    return this.generateSportsCommentary(mockPost, limit);
  }
}

let sportsNewsService: SportsNewsService;

export function initializeSportsNewsService(pool: Pool): void {
  sportsNewsService = new SportsNewsService(pool);
  console.log('✅ Sports News Service initialized');
}

export function getSportsNewsService(): SportsNewsService {
  if (!sportsNewsService) {
    throw new Error('Sports News Service not initialized');
  }
  return sportsNewsService;
}

export default SportsNewsService;
