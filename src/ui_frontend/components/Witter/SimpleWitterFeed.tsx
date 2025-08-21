import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { WittItem } from './WittItem';
import { ContentFilter, ContentCategory } from './ContentFilter';
import { ContentGenerator } from '../../services/ContentGenerator';
import './WitterFeed.css';

interface SimpleWitt {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'npc' | 'player' | 'system' | 'ai';
  content: string;
  timestamp: Date;
  metrics: {
    likes: number;
    reposts: number;
    comments: number;
  };
  interactions: {
    isLiked: boolean;
    isReposted: boolean;
  };
  metadata: {
    gameContext: string;
    relevantEntities: string[];
    personalityFactors: Record<string, number>;
  };
}

interface SimpleWitterFeedProps {
  playerId: string;
  gameContext: {
    currentLocation?: string;
    currentActivity?: string;
    recentEvents?: string[];
  };
  className?: string;
}

export const SimpleWitterFeed: React.FC<SimpleWitterFeedProps> = ({
  playerId,
  gameContext,
  className = ''
}) => {
  const [witts, setWitts] = useState<SimpleWitt[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [activeFilters, setActiveFilters] = useState<ContentCategory[]>(['ALL_POSTS']);
  const [selectedCivilization, setSelectedCivilization] = useState<string>('all');
  const [follows, setFollows] = useState<any[]>([]);

  // Initialize content generator
  const contentGenerator = useMemo(() => new ContentGenerator(), []);

  // Fetch witts from the real API
  const generateSampleWitts = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    if (pageNum === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      // Try to fetch from API first
      const limit = 10;
      const offset = pageNum * limit;
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        playerId: playerId
      });

      // Add filters if active
      if (activeFilters.length > 0 && activeFilters[0] !== 'ALL_POSTS') {
        const categoryMap: Record<string, string> = {
          'CITIZENS': 'citizen',
          'BUSINESS_NEWS': 'business',
          'SPORTS': 'sports',
          'OFFICIAL': 'political',
          'GOSSIP': 'social',
          'MEMES': 'humor',
          'COMPLAINTS': 'complaint',
          'CELEBRATIONS': 'celebration',
          'RANDOM_LIFE': 'random'
        };
        
        const apiCategory = categoryMap[activeFilters[0]] || 'all';
        if (apiCategory !== 'all') {
          params.append('category', apiCategory);
        }
      }

      if (selectedCivilization !== 'all') {
        params.append('civilization', selectedCivilization);
      }

      let apiWitts: SimpleWitt[] = [];
      
      try {
        console.log('Fetching Witter feed from API:', `/api/witter/feed?${params}`);
        const response = await fetch(`/api/witter/feed?${params}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          
          if (data.success && data.posts && data.posts.length > 0) {
            // Transform API response to our SimpleWitt format
            apiWitts = data.posts.map((post: any) => ({
              id: post.id || `witt-${Date.now()}-${Math.random()}`,
              authorId: post.authorId || 'unknown',
              authorName: post.author || 'Anonymous',
              authorType: post.category || 'citizen',
              content: post.content || '',
              timestamp: new Date(post.timestamp || Date.now()),
              metrics: {
                likes: post.likes || 0,
                reposts: post.shares || 0,
                comments: post.comments || 0
              },
              interactions: {
                isLiked: false,
                isReposted: false
              },
              metadata: {
                gameContext: post.civilization || gameContext.currentLocation || 'Sol System',
                relevantEntities: [post.planet, post.starSystem, post.location].filter(Boolean),
                personalityFactors: {}
              }
            }));
            console.log(`Successfully loaded ${apiWitts.length} real posts from API`);
          } else {
            console.warn('API response missing posts or success flag:', data);
          }
        } else {
          console.error('API response not OK:', response.status, response.statusText);
        }
      } catch (apiError) {
        console.error('API fetch failed:', apiError);
      }

      // If API failed or returned no content, use fallback sample content
      const sampleWitts: SimpleWitt[] = apiWitts.length > 0 ? apiWitts : [
        {
          id: '1',
          authorId: 'admiral_chen',
          authorName: 'Admiral Chen',
          authorType: 'npc',
          content: 'Fleet deployment to Kepler sector complete. All systems operational. 🚀',
          timestamp: new Date(Date.now() - 300000),
          metrics: {
            likes: 12,
            reposts: 3,
            comments: 5
          },
          interactions: {
            isLiked: false,
            isReposted: false
          },
          metadata: {
            gameContext: 'military_operations',
            relevantEntities: ['Kepler', 'fleet', 'deployment'],
            personalityFactors: { authority: 0.8, professionalism: 0.9 }
          }
        },
        {
          id: '2',
          authorId: 'dr_martinez',
          authorName: 'Dr. Sarah Martinez',
          authorType: 'npc',
          content: 'Breakthrough in quantum computing research! This could revolutionize our technological capabilities. 🔬✨',
          timestamp: new Date(Date.now() - 180000),
          metrics: {
            likes: 28,
            reposts: 8,
            comments: 12
          },
          interactions: {
            isLiked: true,
            isReposted: false
          },
          metadata: {
            gameContext: 'research_development',
            relevantEntities: ['quantum', 'computing', 'technology'],
            personalityFactors: { enthusiasm: 0.9, intelligence: 0.95 }
          }
        },
        {
          id: '3',
          authorId: 'minister_vale',
          authorName: 'Economic Minister Vale',
          authorType: 'npc',
          content: 'Trade negotiations with Centauri Alliance proceeding well. Expecting 15% GDP growth this quarter. 📈',
          timestamp: new Date(Date.now() - 120000),
          metrics: {
            likes: 15,
            reposts: 4,
            comments: 7
          },
          interactions: {
            isLiked: false,
            isReposted: false
          },
          metadata: {
            gameContext: 'economic_policy',
            relevantEntities: ['Centauri', 'trade', 'GDP'],
            personalityFactors: { optimism: 0.7, analytical: 0.8 }
          }
        },
        {
          id: '4',
          authorId: 'citizen_alex',
          authorName: 'Alex Thompson',
          authorType: 'npc',
          content: 'The new automation in the manufacturing sector is incredible! My productivity has increased by 40%. 🏭',
          timestamp: new Date(Date.now() - 60000),
          metrics: {
            likes: 22,
            reposts: 6,
            comments: 9
          },
          interactions: {
            isLiked: false,
            isReposted: true
          },
          metadata: {
            gameContext: 'citizen_feedback',
            relevantEntities: ['automation', 'manufacturing', 'productivity'],
            personalityFactors: { satisfaction: 0.8, enthusiasm: 0.7 }
          }
        }
      ];
      
      // Generate additional witts for pagination
      const additionalWitts = Array.from({ length: 10 }, (_, i) => ({
        id: `page-${pageNum}-${i}`,
        authorId: `user_${pageNum}_${i}`,
        authorName: `Citizen ${String.fromCharCode(65 + (pageNum * 10 + i) % 26)}`,
        authorType: 'npc' as const,
        content: `Galactic update from page ${pageNum + 1}: ${['Trade routes expanding', 'New colonies established', 'Scientific breakthroughs', 'Cultural exchanges', 'Diplomatic progress'][i % 5]} 🌌`,
        timestamp: new Date(Date.now() - (pageNum * 10 + i) * 60000),
        metrics: {
          likes: Math.floor(Math.random() * 20),
          reposts: Math.floor(Math.random() * 5),
          comments: Math.floor(Math.random() * 8)
        },
        interactions: {
          isLiked: false,
          isReposted: false
        },
        metadata: {
          gameContext: 'general',
          relevantEntities: ['galaxy', 'civilization'],
          personalityFactors: { engagement: Math.random() }
        }
      }));

      const allWitts = pageNum === 0 ? [...sampleWitts, ...additionalWitts] : additionalWitts;
      
      if (append) {
        setWitts(prev => [...prev, ...allWitts]);
      } else {
        setWitts(allWitts);
      }
      
      // Simulate having more pages
      setHasMore(pageNum < 5);
      
    } catch (error) {
      console.error('Error generating sample witts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Load more witts for infinite scroll
  const loadMoreWitts = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      generateSampleWitts(nextPage, true);
    }
  }, [loadingMore, hasMore, page, generateSampleWitts]);

  // Infinite scroll handler - now works with parent scrolling
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Load more when user scrolls to within 200px of bottom
    if (scrollHeight - scrollTop - clientHeight < 200 && !loadingMore && hasMore) {
      loadMoreWitts();
    }
  }, [loadMoreWitts, loadingMore, hasMore]);

  // Set up scroll listener on parent tab content when in tab mode
  useEffect(() => {
    const tabContent = document.querySelector('.tab-content');
    if (tabContent && activeFilters.length > 0) { // Only when component is active
      const handleTabScroll = (e: Event) => {
        const target = e.target as HTMLElement;
        const { scrollTop, scrollHeight, clientHeight } = target;
        
        // Load more when user scrolls to within 200px of bottom
        if (scrollHeight - scrollTop - clientHeight < 200 && !loadingMore && hasMore) {
          loadMoreWitts();
        }
      };
      
      tabContent.addEventListener('scroll', handleTabScroll);
      return () => tabContent.removeEventListener('scroll', handleTabScroll);
    }
  }, [loadMoreWitts, loadingMore, hasMore, activeFilters]);

  // Initialize feed
  useEffect(() => {
    loadInitialWitts();
  }, []);

  const loadInitialWitts = async () => {
    setLoading(true);
    const initialWitts = await fetchWitts(1);
    setWitts(initialWitts);
    setPage(1);
    setHasMore(initialWitts.length === 10); // Assume more if we got a full page
    setLoading(false);
  };

  // Reload when filters change
  useEffect(() => {
    loadInitialWitts();
  }, [activeFilters, selectedCivilization]);

  // Filter witts based on active filters and civilization
  const filteredWitts = useMemo(() => {
    let filtered = witts;
    
    // Apply civilization filter first
    if (selectedCivilization !== 'all') {
      filtered = filtered.filter(witt => {
        // Map author types to civilizations
        if (selectedCivilization === 'terran' && (witt.authorId.includes('admiral') || witt.authorId.includes('minister') || witt.authorId.includes('citizen'))) return true;
        if (selectedCivilization === 'vega' && witt.authorId.includes('vega')) return true;
        if (selectedCivilization === 'centauri' && witt.authorId.includes('centauri')) return true;
        if (selectedCivilization === 'independent' && witt.authorType === 'system') return true;
        return false;
      });
    }
    
    // Apply content filters
    if (activeFilters.includes('ALL_POSTS')) {
      return filtered;
    }
    
    return filtered.filter(witt => {
      if (activeFilters.includes('GALACTIC_NEWS') && witt.authorType === 'system') return true;
      if (activeFilters.includes('DISCOVERIES') && witt.metadata.gameContext === 'research_development') return true;
      if (activeFilters.includes('SOCIAL') && witt.authorType === 'npc') return true;
      if (activeFilters.includes('TRADE') && witt.metadata.gameContext === 'economic_policy') return true;
      if (activeFilters.includes('POLITICS') && witt.metadata.gameContext === 'political') return true;
      if (activeFilters.includes('SCIENCE') && witt.metadata.gameContext === 'research_development') return true;
      if (activeFilters.includes('EXPLORATION') && witt.metadata.relevantEntities.some(e => e.includes('sector') || e.includes('system'))) return true;
      if (activeFilters.includes('MILITARY') && witt.metadata.gameContext === 'military_operations') return true;
      if (activeFilters.includes('CULTURE') && witt.authorType === 'npc') return true;
      return false;
    });
  }, [witts, activeFilters, selectedCivilization]);

  // Handle interactions
  const handleInteraction = useCallback((wittId: string, type: string, data?: any) => {
    setWitts(prev => prev.map(witt => {
      if (witt.id === wittId) {
        switch (type) {
          case 'LIKE':
            return {
              ...witt,
              interactions: {
                ...witt.interactions,
                isLiked: !witt.interactions.isLiked
              },
              metrics: {
                ...witt.metrics,
                likes: witt.interactions.isLiked ? witt.metrics.likes - 1 : witt.metrics.likes + 1
              }
            };
          case 'REPOST':
            return {
              ...witt,
              interactions: {
                ...witt.interactions,
                isReposted: !witt.interactions.isReposted
              },
              metrics: {
                ...witt.metrics,
                reposts: witt.interactions.isReposted ? witt.metrics.reposts - 1 : witt.metrics.reposts + 1
              }
            };
          case 'COMMENT':
            return {
              ...witt,
              metrics: {
                ...witt.metrics,
                comments: witt.metrics.comments + 1
              }
            };
          default:
            return witt;
        }
      }
      return witt;
    }));
  }, []);

  const handleFollow = useCallback((userId: string, userType: string, isFollowing: boolean) => {
    // Simple follow/unfollow logic
    console.log(`${isFollowing ? 'Unfollowing' : 'Following'} ${userId}`);
  }, []);

  // Render individual witt item
  const renderWitt = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const witt = filteredWitts[index];
    if (!witt) return null;
    
    const isFollowing = follows.some(f => f.followedId === witt.authorId);

    return (
      <div style={style}>
        <WittItem
          witt={witt}
          isFollowing={isFollowing}
          onInteraction={handleInteraction}
          onFollow={handleFollow}
          onOpenComments={() => {}}
          onViewProfile={() => {}}
          gameContext={gameContext}
        />
      </div>
    );
  }, [filteredWitts, follows, handleInteraction, handleFollow, gameContext]);

  return (
    <div className={`simple-witter-feed ${className}`}>
      <div className="witter-filters">
        <div className="filter-row">
                              <select
                      className="filter-dropdown"
                      value={activeFilters[0] || 'ALL_POSTS'}
                      onChange={(e) => setActiveFilters([e.target.value as ContentCategory])}
                    >
                      <option value="ALL_POSTS">📋 All Posts</option>
                      <option value="CITIZENS">👥 Citizens</option>
                      <option value="BUSINESS_NEWS">💼 Business News</option>
                      <option value="SPORTS">⚽ Sports & Games</option>
                      <option value="OFFICIAL">🏛️ Official</option>
                      <option value="GOSSIP">🗣️ Gossip & Drama</option>
                      <option value="MEMES">😂 Memes & Jokes</option>
                      <option value="COMPLAINTS">😤 Complaints</option>
                      <option value="CELEBRATIONS">🎉 Celebrations</option>
                      <option value="RANDOM_LIFE">🌟 Random Life</option>
                    </select>
          
          <select 
            className="civilization-dropdown"
            value={selectedCivilization}
            onChange={(e) => setSelectedCivilization(e.target.value)}
          >
            <option value="all">🌌 All Civilizations</option>
            <option value="terran">🏛️ Terran Federation</option>
            <option value="vega">⭐ Vega Alliance</option>
            <option value="centauri">✨ Centauri Republic</option>
            <option value="independent">🚀 Independent Systems</option>
          </select>
        </div>
      </div>

      <div className="witter-content">
        {loading ? (
          <div className="witter-loading">
            <p>Loading galactic social network...</p>
          </div>
        ) : (
          <div className="witter-list">
            {filteredWitts.map((witt, index) => (
              <div key={witt.id} className="witt-item-container">
                <WittItem
                  witt={witt}
                  isFollowing={follows.some(f => f.followedId === witt.authorId)}
                  onInteraction={handleInteraction}
                  onFollow={handleFollow}
                  onOpenComments={() => {}}
                  onViewProfile={() => {}}
                  gameContext={gameContext}
                />
              </div>
            ))}
            
            {loadingMore && (
              <div className="loading-more">
                <p>Loading more posts...</p>
              </div>
            )}
            
            {!hasMore && filteredWitts.length > 0 && (
              <div className="end-of-feed">
                <p>🌌 You've reached the edge of the galaxy! 🌌</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};