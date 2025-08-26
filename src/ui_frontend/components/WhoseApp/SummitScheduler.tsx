/**
 * Summit Scheduler Component
 * Allows scheduling voice/text summits with multiple players and characters
 */

import React, { useState, useEffect } from 'react';
import './SummitScheduler.css';

export interface SummitParticipant {
  id: string;
  name: string;
  type: 'player' | 'character';
  avatar: string;
  title: string;
  availability: 'available' | 'busy' | 'away' | 'offline';
  timezone?: string;
}

export interface Summit {
  id: string;
  title: string;
  description: string;
  type: 'voice' | 'text' | 'hybrid';
  scheduledTime: Date;
  duration: number; // in minutes
  participants: SummitParticipant[];
  organizer: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  agenda?: string[];
  location?: 'virtual' | string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  };
}

interface SummitSchedulerProps {
  availableParticipants: SummitParticipant[];
  currentUserId: string;
  onScheduleSummit: (summit: Omit<Summit, 'id' | 'status'>) => void;
  onClose: () => void;
  existingSummits?: Summit[];
  channelContext?: {
    channelId: string;
    channelName: string;
    channelType: string;
    allChannelParticipants: SummitParticipant[];
  };
}

const SummitScheduler: React.FC<SummitSchedulerProps> = ({
  availableParticipants,
  currentUserId,
  onScheduleSummit,
  onClose,
  existingSummits = [],
  channelContext
}) => {
  const [step, setStep] = useState<'details' | 'participants' | 'timing' | 'review'>('details');
  const [summitData, setSummitData] = useState<Partial<Summit>>({
    title: channelContext ? `${channelContext.channelName} Summit` : '',
    description: channelContext ? `Strategic meeting for all members of the ${channelContext.channelName} channel` : '',
    type: 'hybrid',
    participants: [],
    organizer: currentUserId,
    duration: 60,
    priority: 'medium',
    agenda: ['']
  });

  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [scheduledDateTime, setScheduledDateTime] = useState<string>('');
  const [timeConflicts, setTimeConflicts] = useState<string[]>([]);

  // Check for scheduling conflicts
  useEffect(() => {
    if (scheduledDateTime && selectedParticipants.size > 0) {
      checkTimeConflicts();
    }
  }, [scheduledDateTime, selectedParticipants]);

  const checkTimeConflicts = () => {
    const proposedTime = new Date(scheduledDateTime);
    const conflicts: string[] = [];

    existingSummits.forEach(summit => {
      if (summit.status === 'scheduled' || summit.status === 'active') {
        const summitStart = new Date(summit.scheduledTime);
        const summitEnd = new Date(summitStart.getTime() + summit.duration * 60000);
        const proposedEnd = new Date(proposedTime.getTime() + (summitData.duration || 60) * 60000);

        // Check if times overlap
        if (proposedTime < summitEnd && proposedEnd > summitStart) {
          // Check if any participants are in both summits
          const conflictingParticipants = summit.participants.filter(p =>
            selectedParticipants.has(p.id)
          );

          if (conflictingParticipants.length > 0) {
            conflicts.push(`Conflict with "${summit.title}" - ${conflictingParticipants.map(p => p.name).join(', ')}`);
          }
        }
      }
    });

    setTimeConflicts(conflicts);
  };

  const handleParticipantToggle = (participantId: string) => {
    const newSelected = new Set(selectedParticipants);
    if (newSelected.has(participantId)) {
      newSelected.delete(participantId);
    } else {
      newSelected.add(participantId);
    }
    setSelectedParticipants(newSelected);
  };

  const handleAgendaChange = (index: number, value: string) => {
    const newAgenda = [...(summitData.agenda || [''])];
    newAgenda[index] = value;
    setSummitData({ ...summitData, agenda: newAgenda });
  };

  const addAgendaItem = () => {
    setSummitData({
      ...summitData,
      agenda: [...(summitData.agenda || ['']), '']
    });
  };

  const removeAgendaItem = (index: number) => {
    const newAgenda = [...(summitData.agenda || [''])];
    newAgenda.splice(index, 1);
    setSummitData({ ...summitData, agenda: newAgenda });
  };

  // Bulk selection functions
  const selectAllChannelPlayers = () => {
    if (!channelContext) return;
    
    const channelPlayerIds = channelContext.allChannelParticipants
      .filter(p => p.type === 'player')
      .map(p => p.id);
    
    setSelectedParticipants(new Set(channelPlayerIds));
  };

  const selectAllChannelParticipants = () => {
    if (!channelContext) return;
    
    const allChannelIds = channelContext.allChannelParticipants.map(p => p.id);
    setSelectedParticipants(new Set(allChannelIds));
  };

  const selectAllAvailableParticipants = () => {
    const availableIds = availableParticipants
      .filter(p => p.availability === 'available')
      .map(p => p.id);
    
    setSelectedParticipants(new Set(availableIds));
  };

  const clearAllSelections = () => {
    setSelectedParticipants(new Set());
  };

  const handleSchedule = () => {
    const selectedParticipantObjects = availableParticipants.filter(p =>
      selectedParticipants.has(p.id)
    );

    const summit: Omit<Summit, 'id' | 'status'> = {
      title: summitData.title || 'Untitled Summit',
      description: summitData.description || '',
      type: summitData.type || 'hybrid',
      scheduledTime: new Date(scheduledDateTime),
      duration: summitData.duration || 60,
      participants: selectedParticipantObjects,
      organizer: currentUserId,
      priority: summitData.priority || 'medium',
      agenda: summitData.agenda?.filter(item => item.trim()) || [],
      location: 'virtual'
    };

    onScheduleSummit(summit);
  };

  const canProceedToNext = () => {
    switch (step) {
      case 'details':
        return summitData.title && summitData.title.trim().length > 0;
      case 'participants':
        return selectedParticipants.size > 0;
      case 'timing':
        return scheduledDateTime && timeConflicts.length === 0;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {['details', 'participants', 'timing', 'review'].map((stepName, index) => (
        <div
          key={stepName}
          className={`step ${step === stepName ? 'active' : ''} ${
            ['details', 'participants', 'timing', 'review'].indexOf(step) > index ? 'completed' : ''
          }`}
        >
          <div className="step-number">{index + 1}</div>
          <div className="step-label">{stepName.charAt(0).toUpperCase() + stepName.slice(1)}</div>
        </div>
      ))}
    </div>
  );

  const renderDetailsStep = () => (
    <div className="summit-step">
      <h3>Summit Details</h3>
      
      <div className="form-group">
        <label>Summit Title *</label>
        <input
          type="text"
          value={summitData.title || ''}
          onChange={(e) => setSummitData({ ...summitData, title: e.target.value })}
          placeholder="Enter summit title..."
          className="summit-input"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={summitData.description || ''}
          onChange={(e) => setSummitData({ ...summitData, description: e.target.value })}
          placeholder="Describe the purpose and goals of this summit..."
          className="summit-textarea"
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Summit Type</label>
          <select
            value={summitData.type || 'hybrid'}
            onChange={(e) => setSummitData({ ...summitData, type: e.target.value as 'voice' | 'text' | 'hybrid' })}
            className="summit-select"
          >
            <option value="text">Text Only</option>
            <option value="voice">Voice Only</option>
            <option value="hybrid">Hybrid (Text + Voice)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            value={summitData.priority || 'medium'}
            onChange={(e) => setSummitData({ ...summitData, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical' })}
            className="summit-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Agenda Items</label>
        {(summitData.agenda || ['']).map((item, index) => (
          <div key={index} className="agenda-item">
            <input
              type="text"
              value={item}
              onChange={(e) => handleAgendaChange(index, e.target.value)}
              placeholder={`Agenda item ${index + 1}...`}
              className="agenda-input"
            />
            {(summitData.agenda?.length || 0) > 1 && (
              <button
                type="button"
                onClick={() => removeAgendaItem(index)}
                className="remove-agenda-btn"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addAgendaItem}
          className="add-agenda-btn"
        >
          + Add Agenda Item
        </button>
      </div>
    </div>
  );

  const renderParticipantsStep = () => (
    <div className="summit-step">
      <h3>Select Participants</h3>
      
      {/* Bulk Selection Controls */}
      <div className="bulk-selection-controls" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '20px',
        padding: '16px',
        background: 'rgba(26, 26, 46, 0.4)',
        border: '1px solid rgba(78, 205, 196, 0.2)',
        borderRadius: '8px'
      }}>
        <div style={{ width: '100%', marginBottom: '8px' }}>
          <h4 style={{ color: '#4ecdc4', margin: 0, fontSize: '14px' }}>Quick Selection:</h4>
        </div>
        
        {channelContext && (
          <>
            <button
              onClick={selectAllChannelPlayers}
              className="bulk-select-btn"
              style={{
                background: 'rgba(76, 175, 80, 0.2)',
                border: '1px solid rgba(76, 175, 80, 0.4)',
                color: '#4CAF50',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              👥 All Channel Players ({channelContext.allChannelParticipants.filter(p => p.type === 'player').length})
            </button>
            
            <button
              onClick={selectAllChannelParticipants}
              className="bulk-select-btn"
              style={{
                background: 'rgba(33, 150, 243, 0.2)',
                border: '1px solid rgba(33, 150, 243, 0.4)',
                color: '#2196F3',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🏛️ Entire #{channelContext.channelName} ({channelContext.allChannelParticipants.length})
            </button>
          </>
        )}
        
        <button
          onClick={selectAllAvailableParticipants}
          className="bulk-select-btn"
          style={{
            background: 'rgba(255, 193, 7, 0.2)',
            border: '1px solid rgba(255, 193, 7, 0.4)',
            color: '#FFC107',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ✅ All Available ({availableParticipants.filter(p => p.availability === 'available').length})
        </button>
        
        <button
          onClick={clearAllSelections}
          className="bulk-select-btn"
          style={{
            background: 'rgba(244, 67, 54, 0.2)',
            border: '1px solid rgba(244, 67, 54, 0.4)',
            color: '#F44336',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ❌ Clear All
        </button>
      </div>
      
      <div className="participants-grid">
        {availableParticipants.map(participant => (
          <div
            key={participant.id}
            className={`participant-card ${selectedParticipants.has(participant.id) ? 'selected' : ''} ${participant.availability}`}
            onClick={() => handleParticipantToggle(participant.id)}
          >
            <div className="participant-avatar">
              <img
                src={participant.avatar}
                alt={participant.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="%234ecdc4"/><text x="25" y="30" text-anchor="middle" fill="white" font-size="16">${participant.name.charAt(0)}</text></svg>`;
                }}
              />
              <div className={`availability-indicator ${participant.availability}`} />
              {participant.type === 'player' && (
                <div className="player-badge">👤</div>
              )}
            </div>
            
            <div className="participant-info">
              <div className="participant-name">{participant.name}</div>
              <div className="participant-title">{participant.title}</div>
              <div className="participant-status">{participant.availability}</div>
            </div>

            {selectedParticipants.has(participant.id) && (
              <div className="selection-indicator">✓</div>
            )}
          </div>
        ))}
      </div>

      <div className="selection-summary">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <p style={{ margin: 0 }}>
            {selectedParticipants.size} participant(s) selected
          </p>
          
          {channelContext && (
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#888' }}>
              <span>
                Players: {Array.from(selectedParticipants).filter(id => 
                  availableParticipants.find(p => p.id === id)?.type === 'player'
                ).length}
              </span>
              <span>
                Characters: {Array.from(selectedParticipants).filter(id => 
                  availableParticipants.find(p => p.id === id)?.type === 'character'
                ).length}
              </span>
              <span>
                From #{channelContext.channelName}: {Array.from(selectedParticipants).filter(id =>
                  channelContext.allChannelParticipants.some(p => p.id === id)
                ).length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTimingStep = () => (
    <div className="summit-step">
      <h3>Schedule Summit</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Date & Time *</label>
          <input
            type="datetime-local"
            value={scheduledDateTime}
            onChange={(e) => setScheduledDateTime(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="summit-input"
          />
        </div>

        <div className="form-group">
          <label>Duration (minutes)</label>
          <select
            value={summitData.duration || 60}
            onChange={(e) => setSummitData({ ...summitData, duration: parseInt(e.target.value) })}
            className="summit-select"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
            <option value={180}>3 hours</option>
          </select>
        </div>
      </div>

      {timeConflicts.length > 0 && (
        <div className="conflicts-warning">
          <h4>⚠️ Scheduling Conflicts Detected:</h4>
          <ul>
            {timeConflicts.map((conflict, index) => (
              <li key={index}>{conflict}</li>
            ))}
          </ul>
        </div>
      )}

      {scheduledDateTime && (
        <div className="timing-preview">
          <h4>Summit Schedule Preview:</h4>
          <p><strong>Start:</strong> {new Date(scheduledDateTime).toLocaleString()}</p>
          <p><strong>End:</strong> {new Date(new Date(scheduledDateTime).getTime() + (summitData.duration || 60) * 60000).toLocaleString()}</p>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="summit-step">
      <h3>Review Summit Details</h3>
      
      <div className="summit-review">
        <div className="review-section">
          <h4>📋 Summit Information</h4>
          <p><strong>Title:</strong> {summitData.title}</p>
          <p><strong>Type:</strong> {summitData.type?.toUpperCase()}</p>
          <p><strong>Priority:</strong> {summitData.priority?.toUpperCase()}</p>
          {summitData.description && (
            <p><strong>Description:</strong> {summitData.description}</p>
          )}
        </div>

        <div className="review-section">
          <h4>👥 Participants ({selectedParticipants.size})</h4>
          <div className="review-participants">
            {availableParticipants
              .filter(p => selectedParticipants.has(p.id))
              .map(participant => (
                <div key={participant.id} className="review-participant">
                  <img src={participant.avatar} alt={participant.name} />
                  <span>{participant.name}</span>
                  {participant.type === 'player' && <span className="player-tag">Player</span>}
                </div>
              ))}
          </div>
        </div>

        <div className="review-section">
          <h4>⏰ Timing</h4>
          <p><strong>Date & Time:</strong> {new Date(scheduledDateTime).toLocaleString()}</p>
          <p><strong>Duration:</strong> {summitData.duration} minutes</p>
        </div>

        {summitData.agenda && summitData.agenda.filter(item => item.trim()).length > 0 && (
          <div className="review-section">
            <h4>📝 Agenda</h4>
            <ol>
              {summitData.agenda.filter(item => item.trim()).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="summit-scheduler-overlay">
      <div className="summit-scheduler">
        <div className="summit-header">
          <h2>📅 Schedule Summit</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {renderStepIndicator()}

        <div className="summit-content">
          {step === 'details' && renderDetailsStep()}
          {step === 'participants' && renderParticipantsStep()}
          {step === 'timing' && renderTimingStep()}
          {step === 'review' && renderReviewStep()}
        </div>

        <div className="summit-actions">
          {step !== 'details' && (
            <button
              onClick={() => {
                const steps = ['details', 'participants', 'timing', 'review'];
                const currentIndex = steps.indexOf(step);
                setStep(steps[currentIndex - 1] as any);
              }}
              className="summit-btn secondary"
            >
              ← Back
            </button>
          )}

          {step !== 'review' ? (
            <button
              onClick={() => {
                const steps = ['details', 'participants', 'timing', 'review'];
                const currentIndex = steps.indexOf(step);
                setStep(steps[currentIndex + 1] as any);
              }}
              disabled={!canProceedToNext()}
              className="summit-btn primary"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSchedule}
              className="summit-btn primary"
            >
              📅 Schedule Summit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummitScheduler;
