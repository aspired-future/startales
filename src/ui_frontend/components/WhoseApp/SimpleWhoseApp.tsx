/**
 * Simple WhoseApp - Minimal implementation that just works
 * Bypasses all complex state management and external context
 */

import React, { useState, useEffect } from 'react';
import { UnifiedConversationInterface } from './UnifiedConversationInterface';

interface SimpleCharacter {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
}

export const SimpleWhoseApp: React.FC = () => {
  console.log('🚀 SimpleWhoseApp: Component mounting!');
  
  const [characters, setCharacters] = useState<SimpleCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<SimpleCharacter | null>(null);
  const [conversationMode, setConversationMode] = useState<'text' | 'voice' | null>(null);

  // Fetch characters from API
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        console.log('🔄 SimpleWhoseApp: Fetching characters...');
        const response = await fetch('http://localhost:4000/api/characters/profiles');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.characters) {
            const simpleCharacters = data.characters.map((char: any) => ({
              id: char.id,
              name: char.name,
              title: char.title,
              department: char.department,
              avatar: char.avatar
            }));
            setCharacters(simpleCharacters);
            console.log(`✅ SimpleWhoseApp: Loaded ${simpleCharacters.length} characters`);
          }
        } else {
          console.error('❌ SimpleWhoseApp: Failed to fetch characters');
        }
      } catch (error) {
        console.error('❌ SimpleWhoseApp: Error fetching characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  // Handle starting a conversation
  const handleStartConversation = (character: SimpleCharacter, mode: 'text' | 'voice') => {
    console.log(`🚀 SimpleWhoseApp: Starting ${mode} conversation with ${character.name}`);
    setSelectedCharacter(character);
    setConversationMode(mode);
  };

  // Handle going back to character list
  const handleBack = () => {
    console.log('⬅️ SimpleWhoseApp: Going back to character list');
    setSelectedCharacter(null);
    setConversationMode(null);
  };

  // If in conversation mode, show the conversation interface
  if (selectedCharacter && conversationMode) {
    const characterProfile = {
      id: selectedCharacter.id,
      name: selectedCharacter.name,
      role: selectedCharacter.title,
      department: selectedCharacter.department,
      avatar: selectedCharacter.avatar,
      personality: {
        currentMood: 'professional',
        traits: ['diplomatic', 'analytical']
      }
    };

    return (
      <UnifiedConversationInterface
        character={characterProfile}
        conversationId={`conv_${selectedCharacter.id}_${Date.now()}`}
        currentUserId="player_001"
        civilizationId="civ_001"
        onBack={handleBack}
        initialInputMode={conversationMode}
        gameContext={{
          currentCampaign: {},
          playerResources: {},
          recentEvents: []
        }}
      />
    );
  }

  // Show character list
  return (
    <div style={{ 
      padding: '20px', 
      background: 'rgba(26, 26, 46, 0.9)', 
      color: '#4ecdc4',
      minHeight: '600px',
      borderRadius: '8px'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#4ecdc4' }}>
        📱 WhoseApp - Character Directory
      </h2>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          <div>Loading characters...</div>
        </div>
      ) : characters.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>❌</div>
          <div>No characters available</div>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '20px', color: '#b8bcc8' }}>
            Select a character to start a conversation:
          </p>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            {characters.map(character => (
              <div 
                key={character.id}
                style={{
                  background: 'rgba(15, 15, 35, 0.8)',
                  border: '1px solid rgba(78, 205, 196, 0.3)',
                  borderRadius: '8px',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <img 
                  src={character.avatar}
                  alt={character.name}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/api/characters/avatars/default.jpg';
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: '#4ecdc4', fontSize: '16px' }}>
                    {character.name}
                  </h3>
                  <p style={{ margin: '5px 0 0 0', color: '#b8bcc8', fontSize: '14px' }}>
                    {character.title} • {character.department}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleStartConversation(character, 'text')}
                    style={{
                      background: '#4ecdc4',
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    💬 Message
                  </button>
                  
                  <button
                    onClick={() => handleStartConversation(character, 'voice')}
                    style={{
                      background: '#10b981',
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    📞 Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
