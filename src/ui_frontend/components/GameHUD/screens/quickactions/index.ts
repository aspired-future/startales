// Quick Action Screens
export { default as QuickActionBase } from './QuickActionBase';
export type { QuickActionProps, QuickActionBaseProps } from './QuickActionBase';

export { default as CrisisResponseScreen } from './CrisisResponseScreen';
export { default as DailyBriefingScreen } from './DailyBriefingScreen';
export { default as AddressNationScreen } from './AddressNationScreen';
export { default as EmergencyPowersScreen } from './EmergencyPowersScreen';
export { default as SystemStatusScreen } from './SystemStatusScreen';

// Quick Action Screen Types
export type QuickActionScreenType = 
  | 'crisis-response'
  | 'daily-briefing'
  | 'address-nation'
  | 'emergency-powers'
  | 'system-status';

// Quick Action Screen Configuration
export interface QuickActionConfig {
  id: QuickActionScreenType;
  name: string;
  icon: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  category: 'command' | 'communication' | 'security' | 'governance' | 'system';
}

export const QUICK_ACTION_CONFIGS: QuickActionConfig[] = [
  {
    id: 'crisis-response',
    name: 'Crisis Response',
    icon: '🚨',
    description: 'Manage and respond to active crisis situations',
    urgency: 'critical',
    category: 'security'
  },
  {
    id: 'daily-briefing',
    name: 'Daily Briefing',
    icon: '📋',
    description: 'Review daily intelligence and status reports',
    urgency: 'medium',
    category: 'command'
  },
  {
    id: 'address-nation',
    name: 'Address Nation',
    icon: '🎤',
    description: 'Communicate with citizens through speeches and addresses',
    urgency: 'medium',
    category: 'communication'
  },
  {
    id: 'emergency-powers',
    name: 'Emergency Powers',
    icon: '⚖️',
    description: 'Manage constitutional emergency authorities',
    urgency: 'high',
    category: 'governance'
  },
  {
    id: 'system-status',
    name: 'System Status',
    icon: '🔄',
    description: 'Monitor and manage system health and performance',
    urgency: 'medium',
    category: 'system'
  }
];
