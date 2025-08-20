import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useGameMasterPersonality } from '../../hooks/useGameMasterPersonality';
import { WittItem } from './WittItem';
import { WittComments } from './WittComments';
import { ContentFilter, ContentCategory } from './ContentFilter';
import { FollowSuggestions } from './FollowSuggestions';
import { WitterHeader } from './WitterHeader';
import { ContentGenerator } from '../../services/ContentGenerator';
import { GalacticNewsGenerator, GalacticNewsContext } from '../../services/GalacticNewsGenerator';
import { SimulatedInteractionService } from '../../services/SimulatedInteractionService';
import { PlayerInteractionService, PlayerProfile } from '../../services/PlayerInteractionService';
import { ProfileCard } from './ProfileCard';
import { PopulationManager } from './PopulationManager';
import { ExplorationDashboard } from '../Exploration/ExplorationDashboard';
import { GalacticExplorationService } from '../../services/GalacticExplorationService';
import { GalacticCivilizationGenerator } from '../../services/GalacticCivilizationGenerator';
import './WitterFeed.css';

export interface Witt {
  id: string;
  authorId: string;
  authorType: 'CITIZEN' | 'PERSONALITY' | 'CITY_LEADER' | 'PLANET_LEADER' | 'DIVISION_LEADER' | 'PLAYER';
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: Date;
  metadata: {
    gameContext: string;
    relevantEntities: string[];
    personalityFactors: Record<string, number>;
  };
  metrics: {
    likes: number;
    shares: number;
    comments: number;
  };
  visibility: 'UNIVERSAL' | 'PERSONALIZED' | 'TARGETED';
  isLiked?: boolean;
  isShared?: boolean;
}

export interface Follow {
  playerId: string;
  followedId: string;
  followedType: string;
  followDate: Date;
  interactionScore: number;
}

interface WitterFeedProps {
  playerId: string;
  gameContext: {
    currentLocation?: string;
    currentActivity?: string;
    recentEvents?: string[];
  };
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const WitterFeed: React.FC<WitterFeedProps> = ({
  playerId,
  gameContext,
  className = '',
  collapsed = false,
  onToggleCollapse
}) => {
  const [witts, setWitts] = useState<Witt[]>([]);
  const [filteredWitts, setFilteredWitts] = useState<Witt[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());
  const [activeFilters, setActiveFilters] = useState<ContentCategory[]>(['ALL']);
  const [selectedWittForComments, setSelectedWittForComments] = useState<string | null>(null);
  const [selectedProfileForView, setSelectedProfileForView] = useState<string | null>(null);
  const [showPopulationManager, setShowPopulationManager] = useState<boolean>(false);
  const [showExplorationDashboard, setShowExplorationDashboard] = useState<boolean>(false);
  const [simulatedInteractions, setSimulatedInteractions] = useState<Map<string, any[]>>(new Map());
  const [playerProfiles, setPlayerProfiles] = useState<Map<string, PlayerProfile>>(new Map());

  // WebSocket connection for real-time updates
  const { isConnected, sendMessage } = useWebSocket('/api/witter/ws', {
    onMessage: handleRealtimeUpdate,
    onError: (error) => setError(`Connection error: ${error.message}`),
    reconnectAttempts: 5,
    reconnectInterval: 3000
  });

  // Game Master personality for content generation
  const { personality, isLoading: personalityLoading } = useGameMasterPersonality();

  // Content generator services
  const contentGenerator = useMemo(() => 
    new ContentGenerator(personality), 
    [personality]
  );

  const galacticNewsGenerator = useMemo(() => 
    new GalacticNewsGenerator(personality), 
    [personality]
  );

  const simulatedInteractionService = useMemo(() => 
    new SimulatedInteractionService(personality), 
    [personality]
  );

  const playerInteractionService = useMemo(() => 
    new PlayerInteractionService(personality), 
    [personality]
  );

  const galacticCivilizationGenerator = useMemo(() => 
    new GalacticCivilizationGenerator(personality), 
    [personality]
  );

  const galacticExplorationService = useMemo(() => 
    new GalacticExplorationService(personality, galacticCivilizationGenerator, playerInteractionService), 
    [personality, galacticCivilizationGenerator, playerInteractionService]
  );

  // Handle real-time WebSocket updates
  function handleRealtimeUpdate(data: any) {
    switch (data.type) {
      case 'NEW_WITT':
        setWitts(prev => [data.witt, ...prev]);
        break;
      case 'WITT_UPDATED':
        setWitts(prev => prev.map(w => w.id === data.witt.id ? { ...w, ...data.witt } : w));
        break;
      case 'WITT_DELETED':
        setWitts(prev => prev.filter(w => w.id !== data.wittId));
        break;
      case 'FOLLOW_UPDATED':
        fetchFollows();
        break;
      default:
        console.log('Unknown Witter update type:', data.type);
    }
  }

  // Fetch initial feed data
  const fetchFeed = useCallback(async (offset = 0, limit = 20) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/witter/feed?playerId=${playerId}&offset=${offset}&limit=${limit}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (offset === 0) {
        setWitts(data.witts);
      } else {
        setWitts(prev => [...prev, ...data.witts]);
      }
      
      setHasMore(data.hasMore);
      setLastFetchTime(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  // Fetch user's follows
  const fetchFollows = useCallback(async () => {
    try {
      const response = await fetch(`/api/witter/follows?playerId=${playerId}`);
      if (response.ok) {
        const data = await response.json();
        setFollows(data.follows);
      }
    } catch (err) {
      console.error('Failed to fetch follows:', err);
    }
  }, [playerId]);

  // Load more content for infinite scroll
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchFeed(witts.length);
    }
  }, [fetchFeed, loading, hasMore, witts.length]);

  // Handle interactions (like, share, comment)
  const handleInteraction = useCallback(async (wittId: string, type: 'LIKE' | 'SHARE' | 'COMMENT', content?: string) => {
    try {
      const response = await fetch('/api/witter/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          wittId,
          type,
          content
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${type.toLowerCase()}`);
      }

      const updatedWitt = await response.json();
      setWitts(prev => prev.map(w => w.id === wittId ? { ...w, ...updatedWitt } : w));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${type.toLowerCase()}`);
    }
  }, [playerId]);

  // Handle follow/unfollow
  const handleFollow = useCallback(async (entityId: string, entityType: string, isFollowing: boolean) => {
    try {
      const response = await fetch('/api/witter/follow', {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          followedId: entityId,
          followedType: entityType
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isFollowing ? 'unfollow' : 'follow'}`);
      }

      await fetchFollows();
      await fetchFeed(0); // Refresh feed with new following preferences
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isFollowing ? 'unfollow' : 'follow'}`);
    }
  }, [playerId, fetchFollows, fetchFeed]);

  // Filter witts based on active filters
  const applyContentFilters = useCallback((allWitts: Witt[]) => {
    if (activeFilters.includes('ALL')) {
      return allWitts;
    }

    return allWitts.filter(witt => {
      const wittCategory = determineWittCategory(witt);
      return activeFilters.some(filter => filter === wittCategory);
    });
  }, [activeFilters]);

  // Determine witt category for filtering
  const determineWittCategory = (witt: Witt): ContentCategory => {
    const content = witt.content.toLowerCase();
    
    if (content.includes('breaking') || content.includes('alert') || content.includes('faction')) {
      return 'GALACTIC_NEWS';
    }
    if (content.includes('achievement') || content.includes('victory') || content.includes('colonized')) {
      return 'PLAYER_ACHIEVEMENTS';
    }
    if (content.includes('trade') || content.includes('market') || content.includes('economic')) {
      return 'ECONOMIC_UPDATES';
    }
    if (content.includes('alliance') || content.includes('guild') || content.includes('diplomatic')) {
      return 'ALLIANCE_COMMUNICATIONS';
    }
    if (content.includes('discovery') || content.includes('scientific') || content.includes('breakthrough')) {
      return 'DISCOVERIES';
    }
    if (witt.authorType === 'PLAYER' || content.includes('civilization') || content.includes('roleplay')) {
      return 'ROLEPLAY';
    }
    
    return 'CITIZEN_POSTS';
  };

  // Generate galactic news content
  const generateGalacticNews = useCallback(async () => {
    if (!personality || personalityLoading) return;

    try {
      // Create mock galactic news context (in real app, this would come from game state)
      const newsContext: GalacticNewsContext = {
        factionMovements: [
          {
            factionId: 'stellar_empire',
            factionName: 'Stellar Empire',
            movementType: 'MILITARY',
            location: 'Nebula Sector',
            description: 'Fleet deployment detected',
            impact: 'HIGH'
          }
        ],
        playerAchievements: [
          {
            playerId: 'player_123',
            playerName: 'Commander Nova',
            achievementType: 'COLONIZATION',
            description: 'successfully colonized the Kepler-442b system',
            location: 'Kepler System',
            impact: 'REGIONAL',
            timestamp: new Date()
          }
        ],
        economicData: {
          marketTrends: [
            {
              commodity: 'Quantum Crystals',
              priceChange: 15.5,
              volume: 1250000,
              trend: 'RISING',
              forecast: 'continued growth expected'
            }
          ],
          resourceDiscoveries: [
            {
              resourceType: 'Rare Earth Elements',
              location: 'Proxima Mining Station',
              quantity: 'LARGE',
              discoveredBy: 'Mining Guild Alpha',
              marketImpact: 'SIGNIFICANT'
            }
          ],
          tradeOpportunities: []
        }
      };

      const newsItems = await galacticNewsGenerator.generateGalacticNews(newsContext, 5);
      
      // Generate simulated interactions for news items
      for (const newsItem of newsItems) {
        const interactions = await simulatedInteractionService.generateInteractionsForWitt({
          ...newsItem,
          timestamp: new Date(),
          metrics: { likes: 0, shares: 0, comments: 0 }
        } as Witt);
        
        setSimulatedInteractions(prev => new Map(prev.set(newsItem.authorId, interactions)));
      }

      // Add news items to feed
      setWitts(prev => [...newsItems.map(item => ({
        ...item,
        id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        metrics: { likes: 0, shares: 0, comments: 0 }
      })), ...prev]);

    } catch (err) {
      console.error('Failed to generate galactic news:', err);
    }
  }, [personality, personalityLoading, galacticNewsGenerator, simulatedInteractionService]);

  // Generate contextual content based on game state
  const generateContextualContent = useCallback(async () => {
    if (!personality || personalityLoading) return;

    try {
      const newContent = await contentGenerator.generateContextualWitts({
        gameContext,
        recentWitts: witts.slice(0, 5),
        playerFollows: follows,
        maxWitts: 3
      });

      // Send new content to backend for processing and distribution
      await fetch('/api/witter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          generatedWitts: newContent,
          gameContext
        })
      });
    } catch (err) {
      console.error('Failed to generate contextual content:', err);
    }
  }, [personality, personalityLoading, contentGenerator, gameContext, witts, follows, playerId]);

  // Handle comment interactions
  const handleCommentInteraction = useCallback(async (commentId: string, type: 'LIKE' | 'REPLY', content?: string) => {
    try {
      const response = await fetch('/api/witter/comments/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          commentId,
          type,
          content
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${type.toLowerCase()} comment`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${type.toLowerCase()} comment`);
    }
  }, [playerId]);

  // Handle profile viewing
  const handleViewProfile = useCallback((profileId: string) => {
    setSelectedProfileForView(profileId);
  }, []);

  // Handle profile follow from profile card
  const handleProfileFollow = useCallback(async (profileId: string, isFollowing: boolean) => {
    await handleFollow(profileId, 'PLAYER', isFollowing);
    
    // Update local profile data
    const profile = playerProfiles.get(profileId) || playerInteractionService.getProfile(profileId);
    if (profile) {
      const updatedProfile = {
        ...profile,
        stats: {
          ...profile.stats,
          followerCount: isFollowing ? profile.stats.followerCount - 1 : profile.stats.followerCount + 1
        }
      };
      setPlayerProfiles(prev => new Map(prev.set(profileId, updatedProfile)));
    }
  }, [handleFollow, playerProfiles, playerInteractionService]);

  // Initialize feed and follows
  useEffect(() => {
    fetchFeed();
    fetchFollows();
  }, [fetchFeed, fetchFollows]);

  // Initialize player profiles from PlayerInteractionService
  useEffect(() => {
    if (playerInteractionService) {
      const allProfiles = playerInteractionService.getAllProfiles();
      const profileMap = new Map<string, PlayerProfile>();
      allProfiles.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
      setPlayerProfiles(profileMap);
    }
  }, [playerInteractionService]);

  // Apply content filters when witts or filters change
  useEffect(() => {
    setFilteredWitts(applyContentFilters(witts));
  }, [witts, applyContentFilters]);

  // Generate galactic news periodically
  useEffect(() => {
    const interval = setInterval(generateGalacticNews, 60000); // Every minute
    generateGalacticNews(); // Initial generation
    return () => clearInterval(interval);
  }, [generateGalacticNews]);

  // Generate contextual content periodically
  useEffect(() => {
    const interval = setInterval(generateContextualContent, 45000); // Every 45 seconds
    return () => clearInterval(interval);
  }, [generateContextualContent]);

  // Subscribe to WebSocket updates
  useEffect(() => {
    if (isConnected) {
      sendMessage({
        type: 'SUBSCRIBE_FEED',
        playerId,
        gameContext
      });
    }
  }, [isConnected, sendMessage, playerId, gameContext]);

  // Render individual witt item
  const renderWitt = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const witt = filteredWitts[index];
    const isFollowing = follows.some(f => f.followedId === witt.authorId);

    // Load more when near the end
    if (index === filteredWitts.length - 5) {
      loadMore();
    }

    return (
      <div style={style}>
        <WittItem
          witt={witt}
          isFollowing={isFollowing}
          onInteraction={handleInteraction}
          onFollow={handleFollow}
          onOpenComments={(wittId) => setSelectedWittForComments(wittId)}
          onViewProfile={handleViewProfile}
          gameContext={gameContext}
        />
      </div>
    );
  }, [filteredWitts, follows, handleInteraction, handleFollow, gameContext, loadMore]);

  if (collapsed) {
    return (
      <div className={`witter-feed collapsed ${className}`}>
        <WitterHeader
          collapsed={true}
          onToggleCollapse={onToggleCollapse}
          connectionStatus={isConnected ? 'connected' : 'disconnected'}
          unreadCount={0} // TODO: Implement unread count
        />
      </div>
    );
  }

  return (
    <div className={`witter-feed ${className}`}>
      <WitterHeader
        collapsed={false}
        onToggleCollapse={onToggleCollapse}
        connectionStatus={isConnected ? 'connected' : 'disconnected'}
        unreadCount={0} // TODO: Implement unread count
        onOpenPopulationManager={() => setShowPopulationManager(true)}
        onOpenExplorationDashboard={() => setShowExplorationDashboard(true)}
      />

      {error && (
        <div className="witter-error">
          <p>⚠️ {error}</p>
          <button onClick={() => fetchFeed(0)}>Retry</button>
        </div>
      )}

      <div className="witter-content">
        <ContentFilter
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          className="witter-content-filter"
        />

        {follows.length === 0 && !loading && (
          <FollowSuggestions
            playerId={playerId}
            gameContext={gameContext}
            onFollow={handleFollow}
          />
        )}

        {filteredWitts.length > 0 ? (
          <List
            height={500}
            itemCount={filteredWitts.length}
            itemSize={120}
            className="witter-list"
          >
            {renderWitt}
          </List>
        ) : loading ? (
          <div className="witter-loading">
            <div className="loading-spinner" />
            <p>Loading your Witter feed...</p>
          </div>
        ) : (
          <div className="witter-empty">
            <p>🌌 Your galaxy is quiet...</p>
            <p>Follow some personalities to see their Witts!</p>
          </div>
        )}
      </div>

      {/* Comments Modal */}
      <WittComments
        wittId={selectedWittForComments || ''}
        playerId={playerId}
        isVisible={!!selectedWittForComments}
        onClose={() => setSelectedWittForComments(null)}
        onInteraction={handleCommentInteraction}
      />

      {/* Profile Modal */}
      {selectedProfileForView && (
        <ProfileCard
          profile={playerProfiles.get(selectedProfileForView) || playerInteractionService.getProfile(selectedProfileForView)!}
          isFollowing={follows.some(f => f.followedId === selectedProfileForView)}
          onFollow={handleProfileFollow}
          onClose={() => setSelectedProfileForView(null)}
        />
      )}

      {/* Population Manager Modal */}
      <PopulationManager
        playerInteractionService={playerInteractionService}
        isVisible={showPopulationManager}
        onClose={() => setShowPopulationManager(false)}
      />

      {/* Exploration Dashboard Modal */}
      <ExplorationDashboard
        explorationService={galacticExplorationService}
        playerId={playerId}
        isVisible={showExplorationDashboard}
        onClose={() => setShowExplorationDashboard(false)}
      />
    </div>
  );
};

export default WitterFeed;
