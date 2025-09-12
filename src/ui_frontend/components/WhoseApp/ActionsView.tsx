/**
 * Actions View Component
 * Displays and manages character-initiated actions
 */

import React, { useState, useEffect, useCallback } from 'react';

export interface CharacterAction {
  id: string;
  conversationId: string;
  characterId: string;
  characterName: string;
  actionType: 'diplomatic' | 'military' | 'economic' | 'research' | 'intelligence' | 'infrastructure' | 'policy';
  title: string;
  description: string;
  targetAPI: string;
  parameters: any;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number;
  actualDuration?: number;
  startTime?: string;
  completionTime?: string;
  progress: number;
  progressMessages: Array<{
    timestamp: string;
    message: string;
    progress: number;
  }>;
  result?: {
    success: boolean;
    outcome: string;
    data?: any;
    impact?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ActionsViewProps {
  conversationId?: string; // If provided, show actions for specific conversation
  showAllActions?: boolean; // If true, show all actions across conversations
}

export const ActionsView: React.FC<ActionsViewProps> = ({ 
  conversationId, 
  showAllActions = false 
}) => {
  const [actions, setActions] = useState<CharacterAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<CharacterAction | null>(null);

  const loadActions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '';
      if (showAllActions) {
        url = 'http://localhost:4000/api/whoseapp/actions/active';
      } else if (conversationId) {
        url = `http://localhost:4000/api/whoseapp/conversations/${conversationId}/actions`;
      } else {
        url = 'http://localhost:4000/api/whoseapp/actions/active';
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load actions: ${response.status}`);
      }

      const data = await response.json();
      setActions(data.data || []);
    } catch (err) {
      console.error('Failed to load actions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load actions');
    } finally {
      setLoading(false);
    }
  }, [conversationId, showAllActions]);

  const executeAction = useCallback(async (actionId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/whoseapp/actions/${actionId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to execute action: ${response.status}`);
      }

      // Reload actions to show updated status
      await loadActions();
    } catch (err) {
      console.error('Failed to execute action:', err);
      setError(err instanceof Error ? err.message : 'Failed to execute action');
    }
  }, [loadActions]);

  useEffect(() => {
    loadActions();
    
    // Refresh actions every 10 seconds to show progress updates
    const interval = setInterval(loadActions, 10000);
    return () => clearInterval(interval);
  }, [loadActions]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'proposed': return <span className="text-yellow-500">🕒</span>;
      case 'approved': return <span className="text-blue-500">▶️</span>;
      case 'in_progress': return <span className="text-blue-500">⚡</span>;
      case 'completed': return <span className="text-green-500">✅</span>;
      case 'failed': return <span className="text-red-500">❌</span>;
      case 'cancelled': return <span className="text-gray-500">⭕</span>;
      default: return <span className="text-gray-500">🕒</span>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 font-bold';
      case 'high': return 'text-orange-600 font-semibold';
      case 'medium': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="standard-dashboard">
        <div className="standard-panel" style={{ gridColumn: '1 / -1' }}>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading actions...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="standard-dashboard">
        <div className="standard-panel" style={{ gridColumn: '1 / -1' }}>
          <div className="text-center p-8">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadActions}
              className="standard-btn social-theme"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="standard-dashboard">
      <div className="standard-panel" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="standard-card-title">
            📋 Character Actions {showAllActions ? '(All)' : conversationId ? '(Current Conversation)' : '(Active)'}
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={loadActions}
              className="standard-btn"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {actions.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <div className="text-4xl mb-4 opacity-50">📋</div>
            <p>No actions found</p>
            <p className="text-sm mt-2">Characters will propose actions when you request them to take specific actions.</p>
          </div>
        ) : (
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Character</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Progress</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action) => (
                  <tr key={action.id} className="hover:bg-gray-50">
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(action.status)}
                        <span className="capitalize text-sm">{action.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {action.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-blue-600">{action.characterName}</div>
                    </td>
                    <td>
                      <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {action.actionType}
                      </span>
                    </td>
                    <td>
                      <span className={`capitalize ${getPriorityColor(action.priority)}`}>
                        {action.priority}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${action.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{action.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>Est: {formatDuration(action.estimatedDuration)}</div>
                        {action.actualDuration && (
                          <div className="text-gray-600">
                            Act: {formatDuration(Math.floor(action.actualDuration))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        {action.status === 'proposed' && (
                          <button
                            onClick={() => executeAction(action.id)}
                            className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                            title="Approve and Execute"
                          >
                            ▶️ Execute
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedAction(action)}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          title="View Details"
                        >
                          👁️ Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Details Modal */}
      {selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedAction.title}</h3>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Character</label>
                  <p className="text-blue-600 font-medium">{selectedAction.characterName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedAction.status)}
                    <span className="capitalize">{selectedAction.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="capitalize">{selectedAction.actionType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <p className={`capitalize ${getPriorityColor(selectedAction.priority)}`}>
                    {selectedAction.priority}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-gray-800 bg-gray-50 p-3 rounded">{selectedAction.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedAction.progress}%` }}
                    ></div>
                  </div>
                  <span className="font-medium">{selectedAction.progress}%</span>
                </div>
              </div>

              {selectedAction.progressMessages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress Updates</label>
                  <div className="bg-gray-50 rounded p-3 max-h-40 overflow-y-auto">
                    {selectedAction.progressMessages.map((msg, index) => (
                      <div key={index} className="flex justify-between items-start py-1 border-b border-gray-200 last:border-b-0">
                        <span className="text-sm">{msg.message}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAction.result && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
                  <div className={`p-3 rounded ${selectedAction.result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={selectedAction.result.success ? 'text-green-800' : 'text-red-800'}>
                      {selectedAction.result.outcome}
                    </p>
                    {selectedAction.result.impact && (
                      <p className="text-sm text-gray-600 mt-1">Impact: {selectedAction.result.impact}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                {selectedAction.status === 'proposed' && (
                  <button
                    onClick={() => {
                      executeAction(selectedAction.id);
                      setSelectedAction(null);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    ▶️ Execute Action
                  </button>
                )}
                <button
                  onClick={() => setSelectedAction(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
