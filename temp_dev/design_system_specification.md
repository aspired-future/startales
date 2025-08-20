# Startales Design System Specification

## Overview
A comprehensive design system for the Startales civilization management game, built with React, TypeScript, and Tailwind CSS. This system ensures consistency, accessibility, and maintainability across all UI components.

## Design Principles

### 1. **Clarity & Readability**
- High contrast ratios (WCAG AA compliance)
- Clear typography hierarchy
- Intuitive iconography
- Consistent spacing and alignment

### 2. **Efficiency & Performance**
- Fast loading and responsive interactions
- Minimal cognitive load
- Keyboard-first navigation
- Progressive disclosure of information

### 3. **Consistency & Predictability**
- Unified component behavior
- Consistent interaction patterns
- Standardized data presentation
- Coherent visual language

### 4. **Accessibility & Inclusion**
- Screen reader compatibility
- Keyboard navigation support
- Color-blind friendly palettes
- Scalable text and UI elements

## Color System

### Primary Palette
```css
/* Government & Authority */
--primary-50: #eff6ff;   /* Light blue backgrounds */
--primary-100: #dbeafe;  /* Subtle highlights */
--primary-500: #3b82f6;  /* Primary actions */
--primary-600: #2563eb;  /* Hover states */
--primary-700: #1d4ed8;  /* Active states */
--primary-900: #1e3a8a;  /* Dark text */

/* Success & Growth */
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-700: #15803d;

/* Warning & Attention */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-700: #a16207;

/* Danger & Crisis */
--danger-50: #fef2f2;
--danger-500: #ef4444;
--danger-700: #b91c1c;

/* Neutral & Interface */
--neutral-50: #f9fafb;
--neutral-100: #f3f4f6;
--neutral-200: #e5e7eb;
--neutral-300: #d1d5db;
--neutral-400: #9ca3af;
--neutral-500: #6b7280;
--neutral-600: #4b5563;
--neutral-700: #374151;
--neutral-800: #1f2937;
--neutral-900: #111827;
```

### Semantic Colors
```css
/* System Status */
--status-online: var(--success-500);
--status-warning: var(--warning-500);
--status-offline: var(--danger-500);
--status-maintenance: var(--neutral-500);

/* Data Visualization */
--chart-blue: #3b82f6;
--chart-green: #10b981;
--chart-yellow: #f59e0b;
--chart-red: #ef4444;
--chart-purple: #8b5cf6;
--chart-pink: #ec4899;
--chart-indigo: #6366f1;
--chart-teal: #14b8a6;
```

## Typography

### Font Stack
```css
/* Primary Font - Inter (System UI) */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace - JetBrains Mono (Code/Data) */
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;

/* Display - Outfit (Headers) */
--font-display: 'Outfit', var(--font-primary);
```

### Type Scale
```css
/* Headings */
--text-xs: 0.75rem;    /* 12px - Small labels */
--text-sm: 0.875rem;   /* 14px - Body small */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Large body */
--text-xl: 1.25rem;    /* 20px - H4 */
--text-2xl: 1.5rem;    /* 24px - H3 */
--text-3xl: 1.875rem;  /* 30px - H2 */
--text-4xl: 2.25rem;   /* 36px - H1 */
--text-5xl: 3rem;      /* 48px - Display */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

## Spacing System

### Scale (8px base unit)
```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

### Layout Spacing
```css
--layout-xs: var(--space-4);   /* Component padding */
--layout-sm: var(--space-6);   /* Section spacing */
--layout-md: var(--space-8);   /* Panel spacing */
--layout-lg: var(--space-12);  /* Page sections */
--layout-xl: var(--space-16);  /* Major sections */
```

## Component Library

### 1. Layout Components

#### AppShell
```typescript
interface AppShellProps {
  header: ReactNode;
  sidebar: ReactNode;
  main: ReactNode;
  footer?: ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}
```

#### Header
```typescript
interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: Action[];
  breadcrumbs?: Breadcrumb[];
  user?: UserInfo;
  notifications?: Notification[];
}
```

#### Sidebar
```typescript
interface SidebarProps {
  navigation: NavItem[];
  collapsed?: boolean;
  footer?: ReactNode;
  onNavigate?: (item: NavItem) => void;
}
```

### 2. Navigation Components

#### NavMenu
```typescript
interface NavMenuProps {
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'primary' | 'secondary';
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon?: IconName;
  href?: string;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
}
```

#### Breadcrumbs
```typescript
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}
```

### 3. Data Display Components

#### DataTable
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: PaginationConfig;
  sorting?: SortConfig;
  filtering?: FilterConfig;
  selection?: SelectionConfig;
  actions?: TableAction<T>[];
}

interface Column<T> {
  key: keyof T;
  title: string;
  width?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => ReactNode;
}
```

#### MetricCard
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period?: string;
  };
  trend?: TrendData[];
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  icon?: IconName;
  loading?: boolean;
}
```

#### Chart
```typescript
interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  data: ChartData;
  config?: ChartConfig;
  height?: number;
  loading?: boolean;
  error?: string;
}
```

### 4. Form Components

#### Form
```typescript
interface FormProps {
  onSubmit: (values: any) => void;
  initialValues?: any;
  validation?: ValidationSchema;
  loading?: boolean;
  children: ReactNode;
}
```

#### Input
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}
```

#### Select
```typescript
interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  group?: string;
}
```

### 5. Feedback Components

#### Alert
```typescript
interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  closable?: boolean;
  onClose?: () => void;
  actions?: AlertAction[];
}
```

#### Toast
```typescript
interface ToastProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
  position?: ToastPosition;
  onClose?: () => void;
}
```

#### Modal
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  footer?: ReactNode;
  children: ReactNode;
}
```

### 6. Action Components

#### Button
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  children: ReactNode;
}
```

#### IconButton
```typescript
interface IconButtonProps {
  icon: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  onClick?: () => void;
}
```

## Specialized Game Components

### 1. Campaign Components

#### CampaignSelector
```typescript
interface CampaignSelectorProps {
  campaigns: Campaign[];
  currentCampaign?: Campaign;
  onSelect: (campaign: Campaign) => void;
  onCreate?: () => void;
  loading?: boolean;
}
```

#### TickCounter
```typescript
interface TickCounterProps {
  currentTick: number;
  tickRate: number; // seconds
  isRunning: boolean;
  onToggle?: () => void;
  showControls?: boolean;
}
```

### 2. System Components

#### KPIPanel
```typescript
interface KPIPanelProps {
  kpis: KPI[];
  layout?: 'grid' | 'list';
  size?: 'sm' | 'md' | 'lg';
  showTrends?: boolean;
}

interface KPI {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  change?: number;
  trend?: TrendData[];
  status?: 'good' | 'warning' | 'critical';
  target?: number;
}
```

#### AlertCenter
```typescript
interface AlertCenterProps {
  alerts: SystemAlert[];
  maxVisible?: number;
  onDismiss?: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  source: string;
  actions?: AlertAction[];
  dismissible?: boolean;
}
```

### 3. Policy Components

#### PolicyEditor
```typescript
interface PolicyEditorProps {
  value: string;
  onChange: (value: string) => void;
  suggestions?: PolicySuggestion[];
  effects?: PolicyEffect[];
  onPreview?: (policy: string) => void;
  loading?: boolean;
}
```

#### DecisionQueue
```typescript
interface DecisionQueueProps {
  decisions: PendingDecision[];
  onDecide: (id: string, choice: string) => void;
  onDefer: (id: string) => void;
  priority?: 'all' | 'urgent' | 'normal';
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
--breakpoint-2xl: 1536px; /* Ultra-wide */
```

### Layout Patterns
```typescript
// Responsive grid system
interface GridProps {
  cols?: ResponsiveValue<number>;
  gap?: ResponsiveValue<number>;
  children: ReactNode;
}

type ResponsiveValue<T> = T | {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};
```

## Animation System

### Transitions
```css
/* Standard transitions */
--transition-fast: 150ms ease;
--transition-normal: 250ms ease;
--transition-slow: 350ms ease;

/* Easing curves */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Patterns
```typescript
// Loading states
interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

// Page transitions
interface PageTransitionProps {
  type?: 'fade' | 'slide' | 'scale';
  duration?: number;
  children: ReactNode;
}
```

## Accessibility Standards

### ARIA Implementation
- All interactive elements have proper ARIA labels
- Form fields have associated labels and error messages
- Dynamic content uses live regions
- Focus management for modals and dropdowns

### Keyboard Navigation
- Tab order follows logical flow
- All actions accessible via keyboard
- Escape key closes modals/dropdowns
- Arrow keys for menu navigation

### Color Contrast
- Minimum 4.5:1 ratio for normal text
- Minimum 3:1 ratio for large text
- Color not the only indicator of state
- High contrast mode support

## Testing Strategy

### Component Testing
```typescript
// Example test structure
describe('Button Component', () => {
  it('renders with correct variant styles', () => {});
  it('handles click events', () => {});
  it('shows loading state', () => {});
  it('is accessible via keyboard', () => {});
});
```

### Visual Regression Testing
- Storybook integration for component documentation
- Chromatic for visual testing
- Cross-browser compatibility testing

### Performance Testing
- Bundle size monitoring
- Render performance benchmarks
- Accessibility audits

This design system provides a comprehensive foundation for building a consistent, accessible, and maintainable UI for the Startales civilization management game.
