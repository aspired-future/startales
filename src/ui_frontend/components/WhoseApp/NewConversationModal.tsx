/**
 * New Conversation Modal for WhoseApp
 * 
 * Allows users to start new conversations with characters,
 * create group conversations, or join channels
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Character } from './WhoseAppMain';
import '../GameHUD/screens/shared/StandardDesign.css';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  onStartConversation: (characterIds: string[], type: 'direct' | 'group', mode: 'text' | 'voice') => void;
  currentUserId: string;
}

interface CharacterFilter {
  search: string;
  department: string;
  status: 'all' | 'online' | 'available';
  category: string;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  characters,
  onStartConversation,
  currentUserId
}) => {
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(new Set());
  const [conversationType, setConversationType] = useState<'direct' | 'group'>('direct');
  const [communicationMode, setCommunicationMode] = useState<'text' | 'voice'>('text');
  const [filter, setFilter] = useState<CharacterFilter>({
    search: '',
    department: '',
    status: 'all',
    category: ''
  });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedCharacters(new Set());
      setConversationType('direct');
      setCommunicationMode('text');
      setFilter({ search: '', department: '', status: 'all', category: '' });
    }
  }, [isOpen]);

  // Get unique departments and categories
  const departments = useMemo(() => {
    const depts = new Set(characters.map(c => c.department));
    return Array.from(depts).sort();
  }, [characters]);

  const categories = useMemo(() => {
    const cats = new Set(characters.map(c => (c as any).category || 'general'));
    return Array.from(cats).sort();
  }, [characters]);

  // Filter characters
  const filteredCharacters = useMemo(() => {
    let filtered = characters.filter(c => c.id !== currentUserId);

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.title.toLowerCase().includes(searchLower) ||
        c.department.toLowerCase().includes(searchLower)
      );
    }

    if (filter.department) {
      filtered = filtered.filter(c => c.department === filter.department);
    }

    if (filter.category) {
      filtered = filtered.filter(c => (c as any).category === filter.category);
    }

    if (filter.status !== 'all') {
      filtered = filtered.filter(c => {
        const status = c.whoseAppProfile?.status;
        if (filter.status === 'online') {
          return status === 'online';
        } else if (filter.status === 'available') {
          return status === 'online' || status === 'away';
        }
        return true;
      });
    }

    return filtered.sort((a, b) => {
      // Sort by online status first, then by name
      const aOnline = a.whoseAppProfile?.status === 'online';
      const bOnline = b.whoseAppProfile?.status === 'online';
      
      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, [characters, currentUserId, filter]);

  // Handle character selection
  const handleCharacterToggle = (characterId: string) => {
    const newSelected = new Set(selectedCharacters);
    
    if (newSelected.has(characterId)) {
      newSelected.delete(characterId);
    } else {
      if (conversationType === 'direct' && newSelected.size >= 1) {
        // For direct conversations, only allow one character
        newSelected.clear();
      }
      newSelected.add(characterId);
    }
    
    setSelectedCharacters(newSelected);
  };

  // Handle conversation type change
  const handleConversationTypeChange = (type: 'direct' | 'group') => {
    setConversationType(type);
    if (type === 'direct' && selectedCharacters.size > 1) {
      // Keep only the first selected character for direct conversations
      const firstSelected = Array.from(selectedCharacters)[0];
      setSelectedCharacters(new Set([firstSelected]));
    }
  };

  // Handle start conversation
  const handleStartConversation = () => {
    if (selectedCharacters.size === 0) return;
    
    onStartConversation(
      Array.from(selectedCharacters),
      conversationType,
      communicationMode
    );
    onClose();
  };

  // Get status indicator
  const getStatusIndicator = (character: Character) => {
    const status = character.whoseAppProfile?.status;
    const colors = {
      online: '#4ecdc4',
      away: '#f39c12',
      busy: '#e74c3c',
      offline: '#95a5a6'
    };
    
    return (
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: colors[status || 'offline'],
          display: 'inline-block'
        }}
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        padding: '20px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="standard-card-title">Start New Conversation</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Conversation type and mode selection */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#ccc' }}>
                Conversation Type
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className={`standard-btn ${conversationType === 'direct' ? 'social-theme' : ''}`}
                  onClick={() => handleConversationTypeChange('direct')}
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  Direct (1-on-1)
                </button>
                <button
                  className={`standard-btn ${conversationType === 'group' ? 'social-theme' : ''}`}
                  onClick={() => handleConversationTypeChange('group')}
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  Group
                </button>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#ccc' }}>
                Communication Mode
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className={`standard-btn ${communicationMode === 'text' ? 'social-theme' : ''}`}
                  onClick={() => setCommunicationMode('text')}
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  💬 Text
                </button>
                <button
                  className={`standard-btn ${communicationMode === 'voice' ? 'social-theme' : ''}`}
                  onClick={() => setCommunicationMode('voice')}
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  🎤 Voice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search characters..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="standard-input"
              style={{ fontSize: '14px' }}
            />
            
            <select
              value={filter.department}
              onChange={(e) => setFilter(prev => ({ ...prev, department: e.target.value }))}
              className="standard-input"
              style={{ fontSize: '12px' }}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as any }))}
              className="standard-input"
              style={{ fontSize: '12px' }}
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="available">Available</option>
            </select>

            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="standard-input"
              style={{ fontSize: '12px' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Character selection */}
        <div style={{ flex: 1, overflow: 'auto', marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px', fontSize: '14px', color: '#ccc' }}>
            Select {conversationType === 'direct' ? 'a character' : 'characters'} 
            {selectedCharacters.size > 0 && (
              <span style={{ color: '#4ecdc4' }}> ({selectedCharacters.size} selected)</span>
            )}
          </div>
          
          {filteredCharacters.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>🔍</div>
              <div>No characters match your filters</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
              {filteredCharacters.map(character => (
                <div
                  key={character.id}
                  onClick={() => handleCharacterToggle(character.id)}
                  style={{
                    padding: '12px',
                    border: selectedCharacters.has(character.id) 
                      ? '2px solid #4ecdc4' 
                      : '1px solid #555',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: selectedCharacters.has(character.id) 
                      ? 'rgba(78, 205, 196, 0.1)' 
                      : '#333',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={character.avatar}
                      alt={character.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '2px solid #555'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: '#e8e8e8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {character.name}
                        {getStatusIndicator(character)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {character.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        {character.department}
                      </div>
                    </div>
                    {selectedCharacters.has(character.id) && (
                      <div style={{ color: '#4ecdc4', fontSize: '18px' }}>✓</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {conversationType === 'direct' 
              ? 'Select one character for a direct conversation'
              : 'Select multiple characters for a group conversation'
            }
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="standard-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="standard-btn social-theme"
              onClick={handleStartConversation}
              disabled={selectedCharacters.size === 0}
              style={{
                opacity: selectedCharacters.size === 0 ? 0.5 : 1,
                cursor: selectedCharacters.size === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Start {communicationMode === 'voice' ? 'Voice Call' : 'Conversation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
