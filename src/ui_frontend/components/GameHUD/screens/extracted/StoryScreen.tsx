import React, { useState, useEffect, useCallback } from 'react';
import './StoryScreen.css';

interface StoryEvent {
  id: string;
  title: string;
  description: string;
  type: 'story' | 'crisis' | 'achievement' | 'discovery' | 'plot_twist' | 'climax' | 'challenge';
  storyArc: string;
  visualContent?: string; // AI-generated image URL
  videoContent?: string; // AI-generated video URL
  audioNarration?: string; // Audio file URL for TTS narration
  dramaticNarration: string; // TTS-ready dramatic text with stage directions
  cinematicDescription: string; // Rich visual description for image/video generation
  timestamp: Date;
  requiresResponse: boolean;
  playerChoices?: StoryChoice[];
  consequences?: string[];
  missionIds?: string[];
  characterIds?: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  storyPhase: 'setup' | 'rising_action' | 'climax' | 'falling_action' | 'resolution';
  mediaGenerated: boolean;
}

interface StoryChoice {
  id: string;
  text: string;
  consequences: string[];
  missionTriggers?: string[];
  characterReactions?: { characterId: string; reaction: string }[];
}

interface StoryArc {
  id: string;
  title: string;
  description: string;
  theme: string;
  currentPhase: 'setup' | 'rising_action' | 'climax' | 'falling_action' | 'resolution';
  startDate: Date;
  estimatedDuration: number;
  events: StoryEvent[];
  characters: string[];
  missions: string[];
  playerChoices: { eventId: string; choiceId: string; timestamp: Date }[];
}

interface GameMasterMessage {
  id: string;
  type: 'story_update' | 'plot_twist' | 'challenge' | 'mission_briefing' | 'character_message';
  title: string;
  content: string;
  sender: 'Game Master' | string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  relatedEventId?: string;
  relatedMissionId?: string;
  requiresAction: boolean;
  actionOptions?: { id: string; text: string; outcome: string }[];
}

interface StoryScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext: {
    currentLocation?: string;
    currentActivity?: string;
    recentEvents?: string[];
    civilizationId?: string;
  };
}

const StoryScreen: React.FC<StoryScreenProps> = ({
  screenId,
  title,
  icon,
  gameContext
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'arcs' | 'messages' | 'choices'>('current');
  const [storyEvents, setStoryEvents] = useState<StoryEvent[]>([]);
  const [storyArcs, setStoryArcs] = useState<StoryArc[]>([]);
  const [gameMasterMessages, setGameMasterMessages] = useState<GameMasterMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<StoryEvent | null>(null);
  const [isPlayingNarration, setIsPlayingNarration] = useState<string | null>(null);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [showCinematicView, setShowCinematicView] = useState<string | null>(null);

  const civilizationId = gameContext?.civilizationId || '1';

  useEffect(() => {
    fetchStoryData();
    // Set up real-time updates
    const interval = setInterval(fetchStoryData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [civilizationId]);

  const fetchStoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Record that player is viewing story screen
      recordPlayerActivity('story_screen_view', 'Player opened story screen');
      
      // Try to fetch story events from API
      try {
        const eventsResponse = await fetch(`/api/story/events/${civilizationId}`);
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setStoryEvents(eventsData.events || []);
          console.log('✅ Story events loaded from API:', eventsData.events?.length || 0);
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        console.warn('📖 Story API not available, using enhanced mock data');
        // Use enhanced mock data with proper TTS narration
        setStoryEvents(getMockStoryEvents());
      }
      
      // Try to fetch story arcs from API
      try {
        const arcsResponse = await fetch(`/api/story/arcs/${civilizationId}`);
        if (arcsResponse.ok) {
          const arcsData = await arcsResponse.json();
          setStoryArcs(arcsData.arcs || []);
          console.log('✅ Story arcs loaded from API:', arcsData.arcs?.length || 0);
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        console.warn('📖 Story arcs API not available, using mock data');
        setStoryArcs(getMockStoryArcs());
      }
      
      // Set up Game Master messages
      setGameMasterMessages([
        {
          id: 'msg1',
          type: 'story_update',
          title: '🎭 The Story Begins',
          content: 'Welcome to your galactic saga! I am your Game Master, and I will guide you through an epic story filled with choices, challenges, and consequences. Your civilization\'s destiny awaits...',
          sender: 'Game Master',
          timestamp: new Date(Date.now() - 300000),
          priority: 'high',
          requiresAction: false
        },
        {
          id: 'msg2',
          type: 'plot_twist',
          title: '⚡ Unexpected Development',
          content: 'The ancient signals you\'ve been monitoring have suddenly intensified. Something is awakening in the galactic core, and it\'s aware of your presence...',
          sender: 'Game Master',
          timestamp: new Date(Date.now() - 120000),
          priority: 'urgent',
          requiresAction: true,
          actionOptions: [
            { id: 'investigate', text: 'Send investigation fleet', outcome: 'High risk, high reward' },
            { id: 'prepare', text: 'Prepare defenses', outcome: 'Safer, but reactive' },
            { id: 'diplomatic', text: 'Attempt communication', outcome: 'Unknown consequences' }
          ]
        }
      ]);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching story data:', err);
      setError('Failed to load story data');
      // Fallback to mock data even on error
      setStoryEvents(getMockStoryEvents());
      setStoryArcs(getMockStoryArcs());
      
      // Use enhanced mock data as fallback
      setStoryEvents([
        {
          id: 'event1',
          title: 'The Galactic Convergence Begins',
          description: 'Ancient signals from the galaxy\'s core have been detected by your deep space monitoring stations. The patterns suggest an artificial origin, but the technology appears far beyond current understanding.',
          dramaticNarration: '[MYSTERIOUS TONE] Deep in the void of space, your monitoring stations have detected something... extraordinary. [PAUSE] Energy signatures unlike anything in our databases pulse from the galactic core. [RISING TENSION] The patterns suggest artificial origin, but the technology... [WHISPER] appears far beyond current understanding. [DRAMATIC PAUSE] What ancient intelligence stirs in the heart of our galaxy?',
          cinematicDescription: 'A vast galactic core pulsing with mysterious energy, ancient alien technology awakening in deep space, monitoring stations detecting strange signals, dramatic cosmic vista with swirling nebulae and distant stars',
          visualContent: 'https://picsum.photos/seed/futuristic-galactic-core-mysterious-energy-ancient-technology-cosmic-awakening/800/450',
          type: 'discovery',
          storyArc: 'arc1',
          timestamp: new Date(Date.now() - 600000),
          requiresResponse: true,
          playerChoices: [
            {
              id: 'investigate',
              text: 'Launch immediate investigation mission',
              consequences: ['High resource cost', 'Potential major discovery', 'Risk to exploration teams']
            },
            {
              id: 'monitor',
              text: 'Continue monitoring and gather more data',
              consequences: ['Lower cost', 'Delayed progress', 'Safer approach']
            },
            {
              id: 'ignore',
              text: 'Focus on internal development instead',
              consequences: ['No immediate cost', 'Missed opportunity', 'Unknown future consequences']
            }
          ],
          urgency: 'high',
          storyPhase: 'setup',
          mediaGenerated: true
        },
        {
          id: 'event2',
          title: 'The Mysterious Artifact',
          description: 'Your archaeological teams have uncovered what appears to be technology from an extinct civilization. The artifact pulses with an unknown energy signature that seems to resonate with the signals from the galactic core.',
          dramaticNarration: '[SUDDEN REVELATION] Your archaeological teams have made a discovery that will change everything! [DRAMATIC GASP] An artifact of impossible design, pulsing with energy that defies all known physics. [OMINOUS TONE] And it\'s responding... to the signals from the galactic core. [WHISPER] What have we awakened?',
          cinematicDescription: 'Ancient alien artifact glowing with mysterious energy, archaeological dig site, scientists in awe, artifact resonating with cosmic signals, dramatic lighting and shadows',
          visualContent: 'https://picsum.photos/seed/futuristic-ancient-alien-artifact-glowing-energy-archaeological-discovery-cosmic-resonance/800/450',
          videoContent: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          type: 'plot_twist',
          storyArc: 'arc1',
          timestamp: new Date(Date.now() - 300000),
          requiresResponse: true,
          urgency: 'critical',
          storyPhase: 'rising_action',
          mediaGenerated: true
        }
      ]);
      
      setStoryArcs([
        {
          id: 'arc1',
          title: 'The Galactic Convergence',
          description: 'Ancient signals from the galaxy\'s core suggest a long-dormant civilization is awakening. Your choices will determine whether this leads to enlightenment or catastrophe.',
          theme: 'ancient_mystery',
          currentPhase: 'rising_action',
          startDate: new Date(Date.now() - 86400000),
          estimatedDuration: 45,
          events: [],
          characters: [],
          missions: [],
          playerChoices: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [civilizationId]);

  const recordPlayerActivity = async (activityType: string, details?: string) => {
    try {
      await fetch('/api/witter/record-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          civilizationId: parseInt(civilizationId),
          activityType,
          details
        })
      });
    } catch (error) {
      console.warn('Could not record player activity:', error);
    }
  };

  const handlePlayerChoice = async (eventId: string, choiceId: string) => {
    try {
      // Record the player choice activity
      recordPlayerActivity('story_choice', `Selected choice ${choiceId} for event ${eventId}`);
      
      const response = await fetch('/api/story/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          civilizationId: parseInt(civilizationId),
          eventId,
          choiceId
        })
      });

      if (response.ok) {
        // Refresh story data to see consequences
        await fetchStoryData();
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error submitting choice:', error);
    }
  };

  const initializeStory = async () => {
    try {
      const response = await fetch('/api/story/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          civilizationId: parseInt(civilizationId),
          gameTheme: 'space_opera'
        })
      });

      if (response.ok) {
        await fetchStoryData();
      }
    } catch (error) {
      console.error('Error initializing story:', error);
    }
  };

  // Mock data functions
  const getMockStoryEvents = (): StoryEvent[] => [
    {
      id: 'event1',
      title: 'The Awakening Signal',
      description: 'Ancient transmissions detected from the galactic core reveal signs of a dormant civilization stirring to life.',
      type: 'discovery',
      storyArc: 'arc1',
      visualContent: 'https://picsum.photos/seed/futuristic-galactic-core-ancient-alien-signals-cosmic-awakening/800/450',
      videoContent: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      dramaticNarration: 'Deep in the cosmic void, ancient signals pierce the darkness. Something that has slept for millennia is awakening. The very fabric of space trembles with anticipation as your civilization stands on the precipice of discovery.',
      cinematicDescription: 'A vast cosmic vista showing pulsing energy waves emanating from the galactic core, with mysterious ancient structures becoming visible through swirling nebulae',
      timestamp: new Date(Date.now() - 3600000),
      requiresResponse: true,
      playerChoices: [
        {
          id: 'investigate',
          text: 'Send deep space probe to investigate',
          consequences: ['High risk discovery mission', 'Potential first contact'],
          missionTriggers: ['probe_mission_001']
        },
        {
          id: 'observe',
          text: 'Monitor from safe distance',
          consequences: ['Gather intelligence safely', 'May miss opportunity'],
        },
        {
          id: 'prepare',
          text: 'Prepare planetary defenses',
          consequences: ['Defensive posture', 'Shows caution to unknown entities']
        }
      ],
      urgency: 'high',
      storyPhase: 'rising_action',
      mediaGenerated: true
    },
    {
      id: 'event2',
      title: 'The Diplomatic Overture',
      description: 'A mysterious alien delegation arrives at the edge of your solar system, broadcasting messages of peace and ancient knowledge.',
      type: 'story',
      storyArc: 'arc1',
      visualContent: 'https://picsum.photos/seed/futuristic-alien-crystalline-ships-peaceful-delegation-space-station-aurora/800/450',
      dramaticNarration: 'The stars themselves seem to hold their breath as graceful vessels of unknown design glide through the void. Their message echoes across space and time: "We come bearing gifts of knowledge and warnings of what lies ahead." The fate of your civilization hangs in the balance of this first contact.',
      cinematicDescription: 'Elegant alien ships with crystalline structures approaching a space station, with Earth visible in the background, aurora-like energy patterns dancing between the vessels',
      timestamp: new Date(Date.now() - 1800000),
      requiresResponse: true,
      playerChoices: [
        {
          id: 'welcome',
          text: 'Welcome them with open arms',
          consequences: ['Gain alien technology', 'Risk cultural contamination'],
          characterReactions: [
            { characterId: 'ambassador_chen', reaction: 'Enthusiastic support for peaceful contact' }
          ]
        },
        {
          id: 'cautious',
          text: 'Proceed with diplomatic caution',
          consequences: ['Balanced approach', 'Slower progress but safer'],
        }
      ],
      urgency: 'medium',
      storyPhase: 'rising_action',
      mediaGenerated: true
    },
    {
      id: 'event3',
      title: 'The Shadow Conspiracy',
      description: 'Intelligence reports suggest a faction within your own government is secretly communicating with hostile alien forces.',
      type: 'crisis',
      storyArc: 'arc2',
      visualContent: 'https://picsum.photos/seed/futuristic-government-conspiracy-holographic-aliens-dark-corridors-surveillance/800/450',
      dramaticNarration: 'In the shadows of power, betrayal festers like a cancer. Your most trusted advisors may harbor dark secrets. The enemy may already be within your walls. Trust no one. Question everything. For the very soul of your civilization is at stake.',
      cinematicDescription: 'Dark government corridors with shadowy figures in secret meetings, holographic alien symbols glowing ominously, surveillance screens showing encrypted communications',
      timestamp: new Date(Date.now() - 900000),
      requiresResponse: true,
      playerChoices: [
        {
          id: 'investigate_internal',
          text: 'Launch internal investigation',
          consequences: ['Uncover the truth', 'Risk political instability'],
          missionTriggers: ['investigation_mission_002']
        },
        {
          id: 'surveillance',
          text: 'Increase surveillance secretly',
          consequences: ['Gather evidence quietly', 'May alert conspirators']
        }
      ],
      urgency: 'critical',
      storyPhase: 'climax',
      mediaGenerated: true
    }
  ];

  const getMockStoryArcs = (): StoryArc[] => [
    {
      id: 'arc1',
      title: 'First Contact Protocol',
      description: 'The discovery of ancient alien signals leads to first contact with an advanced civilization, forever changing the course of galactic history.',
      theme: 'Discovery and Diplomacy',
      currentPhase: 'rising_action',
      startDate: new Date(Date.now() - 7200000),
      estimatedDuration: 30,
      events: ['event1', 'event2'],
      characters: ['ambassador_chen', 'scientist_rodriguez'],
      missions: ['probe_mission_001'],
      playerChoices: [
        { eventId: 'event1', choiceId: 'investigate', timestamp: new Date(Date.now() - 3000000) }
      ]
    },
    {
      id: 'arc2',
      title: 'The Enemy Within',
      description: 'A conspiracy threatens to tear apart your civilization from within, as alien infiltrators work to undermine your government.',
      theme: 'Betrayal and Espionage',
      currentPhase: 'climax',
      startDate: new Date(Date.now() - 3600000),
      estimatedDuration: 20,
      events: ['event3'],
      characters: ['director_shadow', 'agent_nova'],
      missions: ['investigation_mission_002'],
      playerChoices: []
    }
  ];

  // TTS and Media Functions
  const processDramaticText = (text: string): string => {
    // Remove stage directions in brackets and asterisks
    let processedText = text
      .replace(/\[.*?\]/g, '') // Remove [stage directions]
      .replace(/\*.*?\*/g, '') // Remove *stage directions*
      .replace(/\.\.\./g, '... ') // Add space after ellipsis for natural pauses
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Add natural pauses for dramatic effect
    processedText = processedText
      .replace(/\./g, '. ') // Pause after sentences
      .replace(/,/g, ', ') // Slight pause after commas
      .replace(/;/g, '; ') // Pause after semicolons
      .replace(/:/g, ': ') // Pause after colons
      .replace(/\?/g, '? ') // Pause after questions
      .replace(/!/g, '! '); // Pause after exclamations
    
    return processedText;
  };

  const playDramaticNarration = (event: StoryEvent) => {
    // Record player activity
    recordPlayerActivity('story_narration_play', `Played narration for event: ${event.title}`);
    
    if (isPlayingNarration === event.id) {
      stopNarration();
      return;
    }

    stopNarration(); // Stop any current narration

    if ('speechSynthesis' in window) {
      // Process the dramatic narration for optimal TTS
      const processedText = processDramaticText(event.dramaticNarration);
      console.log('🎭 Processing narration:', event.title);
      console.log('📝 Original:', event.dramaticNarration);
      console.log('🎤 Processed:', processedText);
      
      const utterance = new SpeechSynthesisUtterance(processedText);
      
      // Configure voice for Hollywood cinematic effect
      utterance.rate = 0.75; // Slightly slower for cinematic gravitas
      utterance.pitch = 0.85; // Rich, authoritative pitch
      utterance.volume = 1.0; // Full volume for impact
      
      // Enhanced voice selection for Hollywood-style narration
      const selectCinematicVoice = () => {
        const voices = speechSynthesis.getVoices();
        console.log('🎬 Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        
        // Priority order for cinematic, Hollywood-style voices (avoid robotic ones)
        const cinematicVoice = voices.find(voice => 
          // Prefer natural, expressive voices
          voice.name.includes('Daniel') ||     // macOS - rich, natural voice
          voice.name.includes('Samantha') ||   // macOS - expressive female voice
          voice.name.includes('Alex') ||       // macOS - natural male voice
          voice.name.includes('Victoria') ||   // Windows - expressive female
          voice.name.includes('David') ||      // Windows - natural male
          voice.name.includes('Zira') ||       // Windows - clear female
          voice.name.includes('Mark') ||       // Windows - natural male
          voice.name.includes('Hazel') ||      // Natural British accent
          voice.name.includes('Karen') ||      // Natural Australian accent
          voice.name.includes('Moira') ||      // Natural Irish accent
          voice.name.includes('Tessa')         // Natural South African accent
        ) || voices.find(voice => 
          // Fallback: any natural-sounding English voice (avoid Microsoft voices that sound robotic)
          voice.lang.startsWith('en') && 
          !voice.name.toLowerCase().includes('microsoft') &&
          !voice.name.toLowerCase().includes('cortana') &&
          !voice.name.toLowerCase().includes('speech')
        ) || voices.find(voice => 
          // Last resort: any English voice
          voice.lang.startsWith('en-US') || voice.lang.startsWith('en-GB')
        ) || voices[0]; // Final fallback
        
        if (cinematicVoice) {
          utterance.voice = cinematicVoice;
          console.log('🎬 Selected cinematic voice:', cinematicVoice.name, cinematicVoice.lang);
        } else {
          console.log('🎬 Using default voice (no cinematic voice found)');
        }
      };

      // Handle voice loading
      if (speechSynthesis.getVoices().length > 0) {
        selectCinematicVoice();
      } else {
        speechSynthesis.onvoiceschanged = selectCinematicVoice;
      }

      utterance.onstart = () => {
        setIsPlayingNarration(event.id);
        console.log('🎭 Starting dramatic narration:', event.title);
      };

      utterance.onend = () => {
        setIsPlayingNarration(null);
        setCurrentSpeech(null);
        console.log('🎭 Narration complete for:', event.title);
      };

      utterance.onerror = (error) => {
        console.error('🎭 TTS Error:', error);
        setIsPlayingNarration(null);
        setCurrentSpeech(null);
      };

      setCurrentSpeech(utterance);
      speechSynthesis.speak(utterance);
    } else {
      alert('🎭 Speech synthesis not supported. Please use a modern browser for the full dramatic experience.');
    }
  };

  const stopNarration = () => {
    if (currentSpeech) {
      speechSynthesis.cancel();
      setCurrentSpeech(null);
    }
    setIsPlayingNarration(null);
  };

  const openCinematicView = (event: StoryEvent) => {
    setShowCinematicView(event.id);
  };

  const closeCinematicView = () => {
    setShowCinematicView(null);
    stopNarration();
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'story': return '📖';
      case 'crisis': return '⚠️';
      case 'achievement': return '🏆';
      case 'discovery': return '🔍';
      case 'plot_twist': return '⚡';
      case 'climax': return '🔥';
      case 'challenge': return '⚔️';
      default: return '📋';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '#ff4444';
      case 'high': return '#ff8800';
      case 'medium': return '#ffaa00';
      case 'low': return '#44aa44';
      default: return '#888888';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'setup': return '#4ecdc4';
      case 'rising_action': return '#ffa726';
      case 'climax': return '#ef5350';
      case 'falling_action': return '#ab47bc';
      case 'resolution': return '#66bb6a';
      default: return '#888888';
    }
  };

  const renderCurrentStoryTab = () => (
    <div className="current-story-tab">
      <div className="story-header">
        <h3>🎭 Current Story Events</h3>
        <div className="story-info">
          <span className="shared-indicator">🌐 Shared with all players</span>
          <button className="initialize-btn" onClick={initializeStory}>
            Initialize New Story
          </button>
        </div>
      </div>
      
      {storyEvents.length === 0 ? (
        <div className="no-events">
          <div className="empty-state">
            <h4>📚 No Active Story</h4>
            <p>Your galactic saga awaits! Click "Initialize New Story" to begin your epic journey.</p>
          </div>
        </div>
      ) : (
        <div className="story-events-list">
          {storyEvents.map(event => (
            <div 
              key={event.id} 
              className={`story-event ${event.type} ${event.urgency}`}
              onClick={() => setSelectedEvent(event)}
            >
              <div className="event-header">
                <div className="event-title-section">
                  <span className="event-icon">{getEventIcon(event.type)}</span>
                  <span className="event-title">{event.title}</span>
                  <span 
                    className="urgency-badge"
                    style={{ backgroundColor: getUrgencyColor(event.urgency) }}
                  >
                    {event.urgency.toUpperCase()}
                  </span>
                </div>
                <div className="event-meta">
                  <span 
                    className="story-phase"
                    style={{ color: getPhaseColor(event.storyPhase) }}
                  >
                    {event.storyPhase.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="event-time">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              {/* Visual Media */}
              {(event.visualContent || event.videoContent) && (
                <div className="event-media">
                  {event.videoContent ? (
                    <video 
                      className="event-video"
                      poster={event.visualContent}
                      controls
                      preload="metadata"
                    >
                      <source src={event.videoContent} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  ) : event.visualContent && (
                    <img 
                      src={event.visualContent} 
                      alt={event.title}
                      className="event-image"
                      onClick={() => openCinematicView(event)}
                    />
                  )}
                  
                  <div className="media-controls">
                    <button 
                      className={`narration-btn ${isPlayingNarration === event.id ? 'playing' : ''}`}
                      onClick={() => playDramaticNarration(event)}
                      title="Play dramatic narration"
                    >
                      {isPlayingNarration === event.id ? '🔊 Stop Narration' : '🎭 Play Narration'}
                    </button>
                    
                    {(event.visualContent || event.videoContent) && (
                      <button 
                        className="cinematic-btn"
                        onClick={() => openCinematicView(event)}
                        title="View in cinematic mode"
                      >
                        🎬 Cinematic View
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="event-description">
                {event.description}
              </div>

              {/* Dramatic Narration - Voice Only */}
              <div className="dramatic-narration">
                <div className="narration-header">
                  <button 
                    className={`narration-toggle ${isPlayingNarration === event.id ? 'playing' : ''}`}
                    onClick={() => playDramaticNarration(event)}
                  >
                    {isPlayingNarration === event.id ? '⏹️' : '▶️'}
                  </button>
                </div>
                <div className="narration-text">
                  {event.dramaticNarration}
                </div>
              </div>
              
              {event.requiresResponse && (
                <div className="response-indicator">
                  <span className="response-badge">⚡ Requires Decision</span>
                </div>
              )}
              
              {event.consequences && event.consequences.length > 0 && (
                <div className="consequences">
                  <strong>Consequences:</strong>
                  <ul>
                    {event.consequences.map((consequence, index) => (
                      <li key={index}>{consequence}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStoryArcsTab = () => (
    <div className="story-arcs-tab">
      <h3>📚 Active Story Arcs</h3>
      
      {storyArcs.length === 0 ? (
        <div className="no-arcs">
          <p>No active story arcs. Initialize a story to begin your saga!</p>
        </div>
      ) : (
        <div className="story-arcs-list">
          {storyArcs.map(arc => (
            <div key={arc.id} className="story-arc-card">
              <div className="arc-header">
                <h4>{arc.title}</h4>
                <div className="arc-meta">
                  <span 
                    className="arc-phase"
                    style={{ color: getPhaseColor(arc.currentPhase) }}
                  >
                    {arc.currentPhase.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="arc-theme">{arc.theme}</span>
                </div>
              </div>
              
              <div className="arc-description">
                {arc.description}
              </div>
              
              <div className="arc-progress">
                <div className="progress-info">
                  <span>Events: {arc.events.length}</span>
                  <span>Duration: {arc.estimatedDuration} days</span>
                  <span>Started: {new Date(arc.startDate).toLocaleDateString()}</span>
                </div>
                
                <div className="phase-progress">
                  <div className="phase-bar">
                    <div 
                      className="phase-fill"
                      style={{ 
                        width: `${(arc.events.length / (arc.estimatedDuration / 3)) * 100}%`,
                        backgroundColor: getPhaseColor(arc.currentPhase)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGameMasterMessagesTab = () => (
    <div className="game-master-messages-tab">
      <h3>🎭 Game Master Communications</h3>
      
      <div className="messages-list">
        {gameMasterMessages.map(message => (
          <div key={message.id} className={`gm-message ${message.priority}`}>
            <div className="message-header">
              <div className="message-title">
                <span className="message-icon">
                  {message.type === 'plot_twist' ? '⚡' : 
                   message.type === 'challenge' ? '⚔️' : 
                   message.type === 'mission_briefing' ? '📋' : '🎭'}
                </span>
                <span className="message-title-text">{message.title}</span>
              </div>
              <div className="message-meta">
                <span className="message-sender">{message.sender}</span>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div className="message-content">
              {message.content}
            </div>
            
            {message.requiresAction && message.actionOptions && (
              <div className="action-options">
                <h5>Choose your response:</h5>
                <div className="action-buttons">
                  {message.actionOptions.map(option => (
                    <button 
                      key={option.id}
                      className="action-btn"
                      onClick={() => {
                        // Handle action selection
                        console.log('Selected action:', option.id);
                      }}
                    >
                      <span className="action-text">{option.text}</span>
                      <span className="action-outcome">{option.outcome}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlayerChoicesTab = () => (
    <div className="player-choices-tab">
      <h3>🎯 Your Decisions</h3>
      
      <div className="choices-summary">
        <p>Track the consequences of your choices and their impact on the story.</p>
      </div>
      
      {selectedEvent && selectedEvent.playerChoices && (
        <div className="active-choice">
          <h4>Current Decision: {selectedEvent.title}</h4>
          <div className="choice-options">
            {selectedEvent.playerChoices.map(choice => (
              <button
                key={choice.id}
                className="choice-btn"
                onClick={() => handlePlayerChoice(selectedEvent.id, choice.id)}
              >
                <div className="choice-text">{choice.text}</div>
                <div className="choice-consequences">
                  <strong>Consequences:</strong>
                  <ul>
                    {choice.consequences.map((consequence, index) => (
                      <li key={index}>{consequence}</li>
                    ))}
                  </ul>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="story-screen loading">
        <div className="loading-spinner"></div>
        <p>Loading your galactic saga...</p>
      </div>
    );
  }

  return (
    <div className="story-screen">
      <div className="screen-header">
        <div className="header-title">
          <span className="screen-icon">{icon}</span>
          <h2>{title}</h2>
        </div>
        <div className="story-status">
          <span className="active-arcs">
            {storyArcs.length} Active Arc{storyArcs.length !== 1 ? 's' : ''}
          </span>
          <span className="recent-events">
            {storyEvents.length} Recent Event{storyEvents.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          📖 Current Story
        </button>
        <button 
          className={`tab-btn ${activeTab === 'arcs' ? 'active' : ''}`}
          onClick={() => setActiveTab('arcs')}
        >
          📚 Story Arcs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          🎭 Game Master
        </button>
        <button 
          className={`tab-btn ${activeTab === 'choices' ? 'active' : ''}`}
          onClick={() => setActiveTab('choices')}
        >
          🎯 Your Choices
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'current' && renderCurrentStoryTab()}
        {activeTab === 'arcs' && renderStoryArcsTab()}
        {activeTab === 'messages' && renderGameMasterMessagesTab()}
        {activeTab === 'choices' && renderPlayerChoicesTab()}
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={fetchStoryData}>Retry</button>
        </div>
      )}

      {/* Cinematic View Modal */}
      {showCinematicView && (
        <div className="cinematic-modal" onClick={closeCinematicView}>
          <div className="cinematic-content" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const cinematicEvent = storyEvents.find(e => e.id === showCinematicView);
              if (!cinematicEvent) return null;

              return (
                <>
                  <div className="cinematic-header">
                    <h2>{cinematicEvent.title}</h2>
                    <button className="close-cinematic" onClick={closeCinematicView}>✕</button>
                  </div>
                  
                  <div className="cinematic-media">
                    {cinematicEvent.videoContent ? (
                      <video 
                        className="cinematic-video"
                        controls
                        autoPlay
                        poster={cinematicEvent.visualContent}
                      >
                        <source src={cinematicEvent.videoContent} type="video/mp4" />
                      </video>
                    ) : cinematicEvent.visualContent && (
                      <img 
                        src={cinematicEvent.visualContent} 
                        alt={cinematicEvent.title}
                        className="cinematic-image"
                      />
                    )}
                  </div>

                  <div className="cinematic-narration">
                    <div className="narration-controls">
                      <button 
                        className={`cinematic-narration-btn ${isPlayingNarration === cinematicEvent.id ? 'playing' : ''}`}
                        onClick={() => playDramaticNarration(cinematicEvent)}
                      >
                        {isPlayingNarration === cinematicEvent.id ? '🔊 Stop Narration' : '🎭 Play Dramatic Narration'}
                      </button>
                    </div>
                    
                    <div className="cinematic-narration-text">
                      {cinematicEvent.dramaticNarration}
                    </div>
                  </div>

                  {cinematicEvent.requiresResponse && cinematicEvent.playerChoices && (
                    <div className="cinematic-choices">
                      <h3>Your Decision:</h3>
                      <div className="cinematic-choice-buttons">
                        {cinematicEvent.playerChoices.map(choice => (
                          <button
                            key={choice.id}
                            className="cinematic-choice-btn"
                            onClick={() => {
                              handlePlayerChoice(cinematicEvent.id, choice.id);
                              closeCinematicView();
                            }}
                          >
                            <div className="choice-text">{choice.text}</div>
                            <div className="choice-preview">
                              {choice.consequences.slice(0, 2).join(', ')}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryScreen;
