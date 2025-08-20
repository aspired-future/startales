import React, { useState, useEffect } from 'react';
import { CivilizationLoreGenerator, NotableIndividual } from '../../services/CivilizationLoreGenerator';
import './CharacterInteraction.css';

interface CharacterInteractionProps {
  characterId: string;
  loreGenerator: CivilizationLoreGenerator;
  playerId: string;
  onClose: () => void;
}

interface ConversationMessage {
  id: string;
  sender: 'player' | 'character';
  content: string;
  timestamp: Date;
  mood?: 'friendly' | 'neutral' | 'suspicious' | 'hostile' | 'excited';
}

export const CharacterInteraction: React.FC<CharacterInteractionProps> = ({
  characterId,
  loreGenerator,
  playerId,
  onClose
}) => {
  const [character, setCharacter] = useState<NotableIndividual | null>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [relationshipLevel, setRelationshipLevel] = useState(0); // -100 to 100

  useEffect(() => {
    const foundCharacter = loreGenerator.getNotableIndividual(characterId);
    if (foundCharacter) {
      setCharacter(foundCharacter);
      initializeConversation(foundCharacter);
    }
  }, [characterId, loreGenerator]);

  const initializeConversation = (char: NotableIndividual) => {
    const greeting = generateGreeting(char);
    setConversation([{
      id: 'greeting',
      sender: 'character',
      content: greeting,
      timestamp: new Date(),
      mood: 'neutral'
    }]);
    setRelationshipLevel(char.publicReputation > 0 ? 10 : -5);
  };

  const generateGreeting = (char: NotableIndividual): string => {
    const greetings = [
      `Greetings, ${playerId}. I am ${char.name}, ${char.profession} of my people.`,
      `*nods respectfully* I am ${char.name}. What brings you to seek audience with me?`,
      `Ah, another traveler. I am ${char.name}. Your reputation precedes you, ${playerId}.`,
      `Welcome. I am ${char.name}, though you may know me by my work in ${char.profession.toLowerCase()}.`,
      `*looks up from work* ${char.name}, at your service. What matter requires my attention?`
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !character) return;

    const playerMessage: ConversationMessage = {
      id: `player_${Date.now()}`,
      sender: 'player',
      content: currentMessage,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, playerMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate character response
    setTimeout(() => {
      const response = generateCharacterResponse(currentMessage, character);
      const characterMessage: ConversationMessage = {
        id: `character_${Date.now()}`,
        sender: 'character',
        content: response.content,
        timestamp: new Date(),
        mood: response.mood
      };

      setConversation(prev => [...prev, characterMessage]);
      setRelationshipLevel(prev => Math.max(-100, Math.min(100, prev + response.relationshipChange)));
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const generateCharacterResponse = (playerMessage: string, char: NotableIndividual) => {
    const message = playerMessage.toLowerCase();
    let content = '';
    let mood: ConversationMessage['mood'] = 'neutral';
    let relationshipChange = 0;

    // Analyze player message intent
    if (message.includes('hello') || message.includes('greetings') || message.includes('hi')) {
      content = generatePoliteResponse(char);
      mood = 'friendly';
      relationshipChange = 2;
    } else if (message.includes('help') || message.includes('assist') || message.includes('aid')) {
      content = generateHelpResponse(char);
      mood = 'friendly';
      relationshipChange = 5;
    } else if (message.includes('trade') || message.includes('exchange') || message.includes('deal')) {
      content = generateTradeResponse(char);
      mood = 'neutral';
      relationshipChange = 1;
    } else if (message.includes('threat') || message.includes('attack') || message.includes('war')) {
      content = generateHostileResponse(char);
      mood = 'hostile';
      relationshipChange = -10;
    } else if (message.includes('knowledge') || message.includes('information') || message.includes('learn')) {
      content = generateKnowledgeResponse(char);
      mood = 'excited';
      relationshipChange = 3;
    } else if (message.includes('culture') || message.includes('tradition') || message.includes('history')) {
      content = generateCultureResponse(char);
      mood = 'friendly';
      relationshipChange = 4;
    } else {
      content = generateGenericResponse(char);
      mood = 'neutral';
      relationshipChange = 0;
    }

    // Modify response based on character personality
    if (char.personality.communicationStyle === 'AGGRESSIVE') {
      content = makeResponseMoreAggressive(content);
      relationshipChange -= 1;
    } else if (char.personality.communicationStyle === 'DIPLOMATIC') {
      content = makeResponseMoreDiplomatic(content);
      relationshipChange += 1;
    }

    return { content, mood, relationshipChange };
  };

  const generatePoliteResponse = (char: NotableIndividual): string => {
    const responses = [
      `The honor is mine, ${playerId}. Your travels across the galaxy are spoken of with respect.`,
      `Well met, traveler. It is rare to encounter someone of your... reputation.`,
      `*inclines head* Greetings. I trust your journey here was without incident?`,
      `Welcome, ${playerId}. Your presence here suggests matters of importance.`,
      `Ah, the famous ${playerId}. Your diplomatic efforts have not gone unnoticed.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateHelpResponse = (char: NotableIndividual): string => {
    const responses = [
      `I am willing to assist, though my expertise lies in ${char.profession.toLowerCase()}. What aid do you seek?`,
      `*considers thoughtfully* Perhaps we can find mutual benefit. What troubles you?`,
      `Help is freely given to those who prove themselves worthy. Speak your need.`,
      `As ${char.profession}, I have resources at my disposal. How might I be of service?`,
      `Your request intrigues me. Let us discuss what assistance I might provide.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateTradeResponse = (char: NotableIndividual): string => {
    const responses = [
      `Trade is the foundation of civilization. What do you offer, and what do you seek?`,
      `*eyes narrow with interest* Commerce, you say? I am always open to profitable arrangements.`,
      `Ah, a merchant's proposition. I respect those who understand the value of exchange.`,
      `Trade requires trust, ${playerId}. What assurances can you provide?`,
      `*leans forward* Speak plainly of your goods and intentions. Time is valuable.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateHostileResponse = (char: NotableIndividual): string => {
    const responses = [
      `*stance hardens* Choose your words carefully, ${playerId}. Threats are not taken lightly here.`,
      `You speak of violence? Such words reveal much about your character.`,
      `*hand moves to weapon* I suggest you reconsider your approach, traveler.`,
      `Hostility breeds hostility. Is this truly the path you wish to walk?`,
      `*voice grows cold* Your reputation may protect you elsewhere, but not from foolish words.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateKnowledgeResponse = (char: NotableIndividual): string => {
    const responses = [
      `*eyes light up* Knowledge is the greatest treasure! What wisdom do you seek?`,
      `Ah, a seeker of understanding. I respect those who value learning above material gain.`,
      `*becomes animated* Information is power, and power shared wisely benefits all. Ask your questions.`,
      `Knowledge flows like water - it must move to remain pure. What would you learn?`,
      `*nods approvingly* Few appreciate the true value of wisdom. I am pleased to share what I know.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateCultureResponse = (char: NotableIndividual): string => {
    const responses = [
      `*smile spreads across face* Our culture is our greatest achievement. What aspect interests you?`,
      `Ah, you appreciate the deeper aspects of civilization. This speaks well of your character.`,
      `*gestures expansively* Our traditions stretch back millennia. Where shall I begin?`,
      `Culture is the soul of a people. I am honored to share our heritage with you.`,
      `*becomes thoughtful* To understand our ways is to understand our hearts. Ask freely.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateGenericResponse = (char: NotableIndividual): string => {
    const responses = [
      `*considers your words* An interesting perspective, ${playerId}.`,
      `I see. Your point has merit, though I wonder about the implications.`,
      `*nods slowly* Such matters require careful thought. What leads you to this conclusion?`,
      `Hmm. Your experience across the galaxy surely informs this view.`,
      `*strokes chin thoughtfully* There is wisdom in what you say, though perhaps more to consider.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const makeResponseMoreAggressive = (content: string): string => {
    return content.replace(/\*([^*]+)\*/g, '*$1 with intensity*')
                  .replace(/perhaps/gi, 'clearly')
                  .replace(/might/gi, 'will')
                  .replace(/I wonder/gi, 'I demand to know');
  };

  const makeResponseMoreDiplomatic = (content: string): string => {
    return content.replace(/\./g, ', if I may say so.')
                  .replace(/!/g, ', with all due respect.')
                  .replace(/\?/g, ', might I inquire?');
  };

  const getMoodIcon = (mood?: ConversationMessage['mood']): string => {
    switch (mood) {
      case 'friendly': return '😊';
      case 'excited': return '🤩';
      case 'suspicious': return '🤨';
      case 'hostile': return '😠';
      default: return '😐';
    }
  };

  const getRelationshipColor = (level: number): string => {
    if (level >= 50) return '#2ecc71'; // Green
    if (level >= 20) return '#3498db'; // Blue
    if (level >= 0) return '#f39c12';  // Orange
    if (level >= -20) return '#e67e22'; // Dark orange
    return '#e74c3c'; // Red
  };

  const getRelationshipLabel = (level: number): string => {
    if (level >= 80) return 'Trusted Ally';
    if (level >= 50) return 'Close Friend';
    if (level >= 20) return 'Friendly';
    if (level >= 0) return 'Neutral';
    if (level >= -20) return 'Suspicious';
    if (level >= -50) return 'Hostile';
    return 'Enemy';
  };

  if (!character) {
    return (
      <div className="character-interaction">
        <div className="interaction-header">
          <h2>Character Not Found</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="interaction-content">
          <p>The requested character could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="character-interaction">
      <div className="interaction-header">
        <div className="character-info">
          <h2>{character.name}</h2>
          <div className="character-title">{character.profession}</div>
          <div className="character-status">{character.currentStatus}</div>
        </div>
        <div className="relationship-info">
          <div className="relationship-level">
            <div 
              className="relationship-bar"
              style={{ 
                width: `${Math.abs(relationshipLevel)}%`,
                backgroundColor: getRelationshipColor(relationshipLevel)
              }}
            />
          </div>
          <div 
            className="relationship-label"
            style={{ color: getRelationshipColor(relationshipLevel) }}
          >
            {getRelationshipLabel(relationshipLevel)}
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="conversation-area">
        <div className="messages">
          {conversation.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.sender}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">
                    {message.sender === 'player' ? playerId : character.name}
                  </span>
                  {message.mood && (
                    <span className="mood-indicator">
                      {getMoodIcon(message.mood)}
                    </span>
                  )}
                  <span className="timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-text">{message.content}</div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message character typing">
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">{character.name}</span>
                  <span className="typing-indicator">is typing...</span>
                </div>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="message-input">
          <div className="input-container">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isTyping}
              className="send-btn"
            >
              📤
            </button>
          </div>
          
          <div className="quick-responses">
            <button 
              onClick={() => setCurrentMessage("Tell me about your culture")}
              className="quick-btn"
            >
              🏛️ Culture
            </button>
            <button 
              onClick={() => setCurrentMessage("What knowledge can you share?")}
              className="quick-btn"
            >
              📚 Knowledge
            </button>
            <button 
              onClick={() => setCurrentMessage("Are you interested in trade?")}
              className="quick-btn"
            >
              💰 Trade
            </button>
            <button 
              onClick={() => setCurrentMessage("How can we help each other?")}
              className="quick-btn"
            >
              🤝 Cooperation
            </button>
          </div>
        </div>
      </div>

      <div className="character-details">
        <div className="detail-section">
          <h4>Personality Traits</h4>
          <div className="traits-list">
            {character.personality.traits.slice(0, 3).map(trait => (
              <div key={trait.name} className="trait-item">
                <span className="trait-name">{trait.name}</span>
                <div className="trait-strength">
                  <div 
                    className="trait-bar"
                    style={{ width: `${trait.strength * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h4>Motivations</h4>
          <div className="motivations-list">
            {character.motivations.slice(0, 3).map((motivation, index) => (
              <span key={index} className="motivation-tag">{motivation}</span>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h4>Communication Style</h4>
          <div className="communication-style">
            {character.personality.communicationStyle.replace('_', ' ')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterInteraction;
