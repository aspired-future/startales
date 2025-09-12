/**
 * Enhanced Conversations View for WhoseApp
 * 
 * Displays conversations with unread indicators, search, filtering,
 * and improved interaction capabilities
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WhoseAppConversation, Character } from './WhoseAppMain';
import '../GameHUD/screens/shared/StandardDesign.css';

interface ConversationsViewProps {
  conversations: WhoseAppConversation[];
  characters: Character[];
  onConversationSelect: (conversation: WhoseAppConversation) => void;
  onStartNewConversation: () => void;
  currentUserId: string;
}

interface ConversationFilter {
  search: string;
  type: 'all' | 'direct' | 'group' | 'channel';
  status: 'all' | 'unread' | 'pinned' | 'active';
  sortBy: 'recent' | 'name' | 'unread';
}

export const ConversationsView: React.FC<ConversationsViewProps> = ({
  conversations,
  characters,
  onConversationSelect,
  onStartNewConversation,
  currentUserId
}) => {
  const [filter, setFilter] = useState<ConversationFilter>({
    search: '',
    type: 'all',
    status: 'all',
    sortBy: 'recent'
  });

  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Enhanced conversation data with character information
  const enhancedConversations = useMemo(() => {
    return conversations.map(conversation => {
      const otherParticipants = conversation.participants.filter(p => p !== currentUserId);
      const participantCharacters = otherParticipants.map(participantId => 
        characters.find(c => c.id === participantId)
      ).filter(Boolean) as Character[];

      return {
        ...conversation,
        participantCharacters,
        displayName: conversation.title || participantCharacters.map(c => c.name).join(', ') || 'Unknown',
        displayAvatar: participantCharacters[0]?.avatar || '/api/characters/avatar/default',
        isOnline: participantCharacters.some(c => c.whoseAppProfile?.status === 'online'),
        lastActiveCharacter: participantCharacters.find(c => c.whoseAppProfile?.lastSeen)
      };
    });
  }, [conversations, characters, currentUserId]);

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let filtered = enhancedConversations;

    // Apply search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.displayName.toLowerCase().includes(searchLower) ||
        conv.lastMessage.toLowerCase().includes(searchLower) ||
        conv.participantCharacters.some(c => 
          c.name.toLowerCase().includes(searchLower) ||
          c.title.toLowerCase().includes(searchLower) ||
          c.department.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply type filter
    if (filter.type !== 'all') {
      filtered = filtered.filter(conv => conv.conversationType === filter.type);
    }

    // Apply status filter
    if (filter.status !== 'all') {
      switch (filter.status) {
        case 'unread':
          filtered = filtered.filter(conv => conv.unreadCount > 0);
          break;
        case 'pinned':
          filtered = filtered.filter(conv => conv.isPinned);
          break;
        case 'active':
          filtered = filtered.filter(conv => conv.isActive);
          break;
      }
    }

    // Apply sorting
    switch (filter.sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.displayName.localeCompare(b.displayName));
        break;
      case 'unread':
        filtered.sort((a, b) => b.unreadCount - a.unreadCount);
        break;
    }

    return filtered;
  }, [enhancedConversations, filter]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    const activeConversations = conversations.filter(conv => conv.isActive).length;
    const pinnedConversations = conversations.filter(conv => conv.isPinned).length;
    
    return {
      total: conversations.length,
      unread: totalUnread,
      active: activeConversations,
      pinned: pinnedConversations
    };
  }, [conversations]);

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Handle conversation selection
  const handleConversationClick = useCallback((conversation: WhoseAppConversation) => {
    if (showBulkActions) {
      const newSelected = new Set(selectedConversations);
      if (newSelected.has(conversation.id)) {
        newSelected.delete(conversation.id);
      } else {
        newSelected.add(conversation.id);
      }
      setSelectedConversations(newSelected);
    } else {
      onConversationSelect(conversation);
    }
  }, [showBulkActions, selectedConversations, onConversationSelect]);

  // Bulk actions
  const handleBulkAction = useCallback((action: 'pin' | 'unpin' | 'mark_read' | 'archive') => {
    console.log(`Bulk action: ${action} on conversations:`, Array.from(selectedConversations));
    // TODO: Implement bulk actions API calls
    setSelectedConversations(new Set());
    setShowBulkActions(false);
  }, [selectedConversations]);

  return (
    <div className="standard-dashboard">
      {/* Header with stats and actions */}
      <div className="standard-panel" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div>
            <h3 className="standard-card-title">💬 Conversations</h3>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
              {stats.total} total • {stats.unread} unread • {stats.active} active • {stats.pinned} pinned
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {showBulkActions && selectedConversations.size > 0 && (
              <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                  className="standard-btn social-theme"
                  onClick={() => handleBulkAction('mark_read')}
                  style={{ fontSize: '12px', padding: '5px 10px' }}
                >
                  Mark Read ({selectedConversations.size})
                </button>
                <button 
                  className="standard-btn social-theme"
                  onClick={() => handleBulkAction('pin')}
                  style={{ fontSize: '12px', padding: '5px 10px' }}
                >
                  Pin
                </button>
                <button 
                  className="standard-btn"
                  onClick={() => {
                    setShowBulkActions(false);
                    setSelectedConversations(new Set());
                  }}
                  style={{ fontSize: '12px', padding: '5px 10px' }}
                >
                  Cancel
                </button>
              </div>
            )}
            <button 
              className="standard-btn"
              onClick={() => setShowBulkActions(!showBulkActions)}
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              {showBulkActions ? 'Cancel Select' : 'Select'}
            </button>
            <button 
              className="standard-btn social-theme"
              onClick={onStartNewConversation}
            >
              + New Conversation
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search conversations, participants, or messages..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="standard-input"
            style={{ fontSize: '14px' }}
          />
          
          <select
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
            className="standard-input"
            style={{ fontSize: '12px', width: 'auto' }}
          >
            <option value="all">All Types</option>
            <option value="direct">Direct</option>
            <option value="group">Group</option>
            <option value="channel">Channel</option>
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as any }))}
            className="standard-input"
            style={{ fontSize: '12px', width: 'auto' }}
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="pinned">Pinned</option>
            <option value="active">Active</option>
          </select>

          <select
            value={filter.sortBy}
            onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="standard-input"
            style={{ fontSize: '12px', width: 'auto' }}
          >
            <option value="recent">Recent</option>
            <option value="name">Name</option>
            <option value="unread">Unread Count</option>
          </select>
        </div>
      </div>

      {/* Conversations list */}
      <div className="standard-panel" style={{ gridColumn: '1 / -1' }}>
        {filteredConversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            {filter.search || filter.type !== 'all' || filter.status !== 'all' ? (
              <>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>🔍</div>
                <div>No conversations match your filters</div>
                <button 
                  className="standard-btn"
                  onClick={() => setFilter({ search: '', type: 'all', status: 'all', sortBy: 'recent' })}
                  style={{ marginTop: '10px', fontSize: '12px' }}
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>💬</div>
                <div>No conversations yet</div>
                <button 
                  className="standard-btn social-theme"
                  onClick={onStartNewConversation}
                  style={{ marginTop: '10px' }}
                >
                  Start Your First Conversation
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  {showBulkActions && <th style={{ width: '40px' }}></th>}
                  <th>Conversation</th>
                  <th>Participants</th>
                  <th>Last Message</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredConversations.map(conversation => (
                  <tr 
                    key={conversation.id} 
                    onClick={() => handleConversationClick(conversation)}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedConversations.has(conversation.id) ? 'rgba(78, 205, 196, 0.1)' : undefined
                    }}
                    className={conversation.unreadCount > 0 ? 'unread-conversation' : ''}
                  >
                    {showBulkActions && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedConversations.has(conversation.id)}
                          onChange={() => {}} // Handled by row click
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                    )}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={conversation.displayAvatar}
                          alt={conversation.displayName}
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%',
                            border: conversation.isOnline ? '2px solid #4ecdc4' : '2px solid #555'
                          }}
                        />
                        <div>
                          <div style={{ 
                            fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                            color: conversation.unreadCount > 0 ? '#e8e8e8' : '#ccc',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            {conversation.displayName}
                            {conversation.isPinned && <span style={{ fontSize: '12px' }}>📌</span>}
                            {conversation.isOnline && <span style={{ fontSize: '8px', color: '#4ecdc4' }}>●</span>}
                          </div>
                          <div style={{ fontSize: '12px', color: '#888' }}>
                            <span className="standard-badge social-theme" style={{ fontSize: '10px', padding: '2px 6px' }}>
                              {conversation.conversationType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px' }}>
                        {conversation.participantCharacters.map(char => (
                          <div key={char.id} style={{ 
                            color: char.whoseAppProfile?.status === 'online' ? '#4ecdc4' : '#888',
                            marginBottom: '2px'
                          }}>
                            {char.name} ({char.title})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        maxWidth: '200px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                        color: conversation.unreadCount > 0 ? '#e8e8e8' : '#aaa'
                      }}>
                        {conversation.lastMessage || 'No messages yet'}
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: '#888' }}>
                      {formatRelativeTime(conversation.lastMessageTime)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {conversation.unreadCount > 0 && (
                          <span 
                            className="standard-badge"
                            style={{ 
                              backgroundColor: '#ff6b6b',
                              color: 'white',
                              fontSize: '10px',
                              minWidth: '18px',
                              height: '18px',
                              borderRadius: '9px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </span>
                        )}
                        {conversation.isActive && (
                          <span style={{ fontSize: '8px', color: '#4ecdc4' }}>●</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .unread-conversation {
          background-color: rgba(78, 205, 196, 0.05) !important;
        }
        .unread-conversation:hover {
          background-color: rgba(78, 205, 196, 0.1) !important;
        }
      `}</style>
    </div>
  );
};
