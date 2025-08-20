/**
 * TC001-U4: Caption formatting includes timestamps and speaker tag
 * 
 * Tests the caption formatting system to ensure proper display of transcripts
 * with speaker identification, timestamps, and accessibility features.
 */

import { describe, it, expect, beforeEach } from 'vitest';

interface CaptionEntry {
  id: string;
  speakerId: string;
  speakerName?: string;
  text: string;
  startTs: number;
  endTs?: number;
  confidence?: number;
  isPartial: boolean;
  color?: string;
}

interface CaptionDisplayOptions {
  showTimestamps: boolean;
  showSpeakerNames: boolean;
  showConfidence: boolean;
  timestampFormat: 'relative' | 'absolute' | 'duration';
  maxLineLength: number;
  groupBySpeaker: boolean;
}

interface FormattedCaption {
  id: string;
  displayText: string;
  speakerId: string;
  speakerName?: string;
  color?: string;
  timestamp: string;
  duration?: string;
  confidence?: number;
  isPartial: boolean;
  ariaLabel: string;
  cssClasses: string[];
}

class CaptionFormatter {
  private options: CaptionDisplayOptions;
  private speakerColors: Map<string, string>;
  private colorPalette: string[];

  constructor(options: Partial<CaptionDisplayOptions> = {}) {
    this.options = {
      showTimestamps: true,
      showSpeakerNames: true,
      showConfidence: false,
      timestampFormat: 'relative',
      maxLineLength: 80,
      groupBySpeaker: false,
      ...options,
    };

    this.speakerColors = new Map();
    this.colorPalette = [
      '#3B82F6', // Blue
      '#EF4444', // Red
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#8B5CF6', // Purple
      '#F97316', // Orange
      '#06B6D4', // Cyan
      '#84CC16', // Lime
    ];
  }

  /**
   * Format a single caption entry
   */
  formatCaption(entry: CaptionEntry, baseTimestamp?: number): FormattedCaption {
    const speakerName = entry.speakerName || this.generateSpeakerName(entry.speakerId);
    const color = entry.color || this.getSpeakerColor(entry.speakerId);
    const timestamp = this.formatTimestamp(entry.startTs, baseTimestamp);
    const duration = entry.endTs ? this.formatDuration(entry.startTs, entry.endTs) : undefined;

    let displayText = entry.text;

    // Apply line length limit
    if (displayText.length > this.options.maxLineLength) {
      displayText = this.wrapText(displayText, this.options.maxLineLength);
    }

    // Add confidence indicator if enabled and available
    if (this.options.showConfidence && entry.confidence !== undefined) {
      const confidencePercent = Math.round(entry.confidence * 100);
      displayText += ` (${confidencePercent}%)`;
    }

    // Generate ARIA label for accessibility
    const ariaLabel = this.generateAriaLabel(entry, speakerName, timestamp, duration);

    // Generate CSS classes
    const cssClasses = this.generateCssClasses(entry);

    return {
      id: entry.id,
      displayText,
      speakerId: entry.speakerId,
      speakerName,
      color,
      timestamp,
      duration,
      confidence: entry.confidence,
      isPartial: entry.isPartial,
      ariaLabel,
      cssClasses,
    };
  }

  /**
   * Format multiple caption entries
   */
  formatCaptions(entries: CaptionEntry[], baseTimestamp?: number): FormattedCaption[] {
    if (this.options.groupBySpeaker) {
      return this.formatGroupedCaptions(entries, baseTimestamp);
    }

    return entries.map(entry => this.formatCaption(entry, baseTimestamp));
  }

  private formatGroupedCaptions(entries: CaptionEntry[], baseTimestamp?: number): FormattedCaption[] {
    const grouped: FormattedCaption[] = [];
    let currentGroup: CaptionEntry[] = [];
    let currentSpeaker: string | null = null;

    for (const entry of entries) {
      if (entry.speakerId !== currentSpeaker) {
        // Finalize current group
        if (currentGroup.length > 0) {
          grouped.push(this.formatGroupedEntry(currentGroup, baseTimestamp));
        }

        // Start new group
        currentGroup = [entry];
        currentSpeaker = entry.speakerId;
      } else {
        currentGroup.push(entry);
      }
    }

    // Finalize last group
    if (currentGroup.length > 0) {
      grouped.push(this.formatGroupedEntry(currentGroup, baseTimestamp));
    }

    return grouped;
  }

  private formatGroupedEntry(entries: CaptionEntry[], baseTimestamp?: number): FormattedCaption {
    const firstEntry = entries[0];
    const lastEntry = entries[entries.length - 1];
    
    const combinedText = entries.map(e => e.text).join(' ');
    const hasPartial = entries.some(e => e.isPartial);
    const avgConfidence = entries
      .filter(e => e.confidence !== undefined)
      .reduce((sum, e, _, arr) => sum + (e.confidence! / arr.length), 0);

    const groupedEntry: CaptionEntry = {
      id: `group-${firstEntry.id}-${lastEntry.id}`,
      speakerId: firstEntry.speakerId,
      speakerName: firstEntry.speakerName,
      text: combinedText,
      startTs: firstEntry.startTs,
      endTs: lastEntry.endTs,
      confidence: avgConfidence || undefined,
      isPartial: hasPartial,
      color: firstEntry.color,
    };

    return this.formatCaption(groupedEntry, baseTimestamp);
  }

  private formatTimestamp(timestamp: number, baseTimestamp?: number): string {
    const base = baseTimestamp || Date.now();
    
    switch (this.options.timestampFormat) {
      case 'relative':
        const relativeMs = timestamp - base;
        return this.formatRelativeTime(relativeMs);
      
      case 'absolute':
        return new Date(timestamp).toLocaleTimeString();
      
      case 'duration':
        const durationMs = base - timestamp;
        return this.formatDuration(0, durationMs);
      
      default:
        return new Date(timestamp).toLocaleTimeString();
    }
  }

  private formatRelativeTime(ms: number): string {
    const seconds = Math.abs(ms) / 1000;
    
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
    }
  }

  private formatDuration(startTs: number, endTs: number): string {
    const durationMs = endTs - startTs;
    const seconds = durationMs / 1000;
    
    if (seconds < 1) {
      return `${Math.round(durationMs)}ms`;
    } else {
      return `${seconds.toFixed(1)}s`;
    }
  }

  private wrapText(text: string, maxLength: number): string {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).length <= maxLength) {
        currentLine = currentLine ? currentLine + ' ' + word : word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.join('\n');
  }

  private generateSpeakerName(speakerId: string): string {
    // Extract readable name from speaker ID or generate one
    if (speakerId.startsWith('user-')) {
      return `User ${speakerId.slice(5)}`;
    } else if (speakerId.includes('-')) {
      const parts = speakerId.split('-');
      return parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1);
    } else {
      return `Speaker ${speakerId}`;
    }
  }

  private getSpeakerColor(speakerId: string): string {
    if (!this.speakerColors.has(speakerId)) {
      const colorIndex = this.speakerColors.size % this.colorPalette.length;
      this.speakerColors.set(speakerId, this.colorPalette[colorIndex]);
    }
    return this.speakerColors.get(speakerId)!;
  }

  private generateAriaLabel(
    entry: CaptionEntry,
    speakerName: string,
    timestamp: string,
    duration?: string
  ): string {
    let label = `${speakerName} said: ${entry.text}`;
    
    if (this.options.showTimestamps) {
      label += ` at ${timestamp}`;
    }
    
    if (duration) {
      label += ` for ${duration}`;
    }
    
    if (entry.isPartial) {
      label += ' (partial transcript)';
    }
    
    if (entry.confidence !== undefined && entry.confidence < 0.8) {
      label += ` (low confidence: ${Math.round(entry.confidence * 100)}%)`;
    }

    return label;
  }

  private generateCssClasses(entry: CaptionEntry): string[] {
    const classes = ['caption-entry'];
    
    if (entry.isPartial) {
      classes.push('caption-partial');
    } else {
      classes.push('caption-final');
    }
    
    if (entry.confidence !== undefined) {
      if (entry.confidence >= 0.9) {
        classes.push('caption-high-confidence');
      } else if (entry.confidence >= 0.7) {
        classes.push('caption-medium-confidence');
      } else {
        classes.push('caption-low-confidence');
      }
    }
    
    classes.push(`caption-speaker-${entry.speakerId}`);
    
    return classes;
  }

  /**
   * Update display options
   */
  updateOptions(options: Partial<CaptionDisplayOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Set custom speaker color
   */
  setSpeakerColor(speakerId: string, color: string): void {
    this.speakerColors.set(speakerId, color);
  }

  /**
   * Get current options
   */
  getOptions(): CaptionDisplayOptions {
    return { ...this.options };
  }

  /**
   * Reset speaker colors
   */
  resetSpeakerColors(): void {
    this.speakerColors.clear();
  }
}

describe('CaptionFormatter', () => {
  let formatter: CaptionFormatter;
  const baseTimestamp = Date.now();

  beforeEach(() => {
    formatter = new CaptionFormatter();
  });

  describe('Basic Formatting', () => {
    it('should format a simple caption entry', () => {
      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'user-123',
        text: 'Hello world',
        startTs: baseTimestamp - 1000,
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);

      expect(formatted.id).toBe('caption-1');
      expect(formatted.displayText).toBe('Hello world');
      expect(formatted.speakerName).toBe('User 123');
      expect(formatted.isPartial).toBe(false);
      expect(formatted.color).toBeDefined();
      expect(formatted.timestamp).toBeDefined();
      expect(formatted.ariaLabel).toContain('User 123 said: Hello world');
    });

    it('should handle partial captions', () => {
      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Hello...',
        startTs: baseTimestamp,
        isPartial: true,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);

      expect(formatted.isPartial).toBe(true);
      expect(formatted.cssClasses).toContain('caption-partial');
      expect(formatted.ariaLabel).toContain('(partial transcript)');
    });

    it('should include confidence information when enabled', () => {
      formatter.updateOptions({ showConfidence: true });

      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Hello world',
        startTs: baseTimestamp,
        confidence: 0.85,
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);

      expect(formatted.displayText).toContain('(85%)');
      expect(formatted.confidence).toBe(0.85);
      expect(formatted.cssClasses).toContain('caption-medium-confidence');
    });
  });

  describe('Timestamp Formatting', () => {
    it('should format relative timestamps', () => {
      formatter.updateOptions({ timestampFormat: 'relative' });

      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Hello',
        startTs: baseTimestamp - 5000, // 5 seconds ago
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);
      expect(formatted.timestamp).toBe('5s');
    });

    it('should format absolute timestamps', () => {
      formatter.updateOptions({ timestampFormat: 'absolute' });

      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Hello',
        startTs: baseTimestamp,
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);
      expect(formatted.timestamp).toMatch(/\d{1,2}:\d{2}:\d{2}/); // HH:MM:SS format
    });

    it('should format duration timestamps', () => {
      formatter.updateOptions({ timestampFormat: 'duration' });

      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Hello',
        startTs: baseTimestamp - 3000,
        endTs: baseTimestamp - 1000,
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);
      expect(formatted.duration).toBe('2.0s');
    });

    it('should handle long durations correctly', () => {
      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Hello',
        startTs: baseTimestamp - 125000, // 2 minutes 5 seconds ago
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);
      expect(formatted.timestamp).toBe('2:05');
    });
  });

  describe('Text Wrapping', () => {
    it('should wrap long text', () => {
      formatter.updateOptions({ maxLineLength: 20 });

      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'This is a very long sentence that should be wrapped',
        startTs: baseTimestamp,
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);
      expect(formatted.displayText).toContain('\n');
      
      const lines = formatted.displayText.split('\n');
      lines.forEach(line => {
        expect(line.length).toBeLessThanOrEqual(20);
      });
    });

    it('should not wrap short text', () => {
      formatter.updateOptions({ maxLineLength: 50 });

      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Short text',
        startTs: baseTimestamp,
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);
      expect(formatted.displayText).not.toContain('\n');
    });
  });

  describe('Speaker Management', () => {
    it('should assign consistent colors to speakers', () => {
      const entry1: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Hello',
        startTs: baseTimestamp,
        isPartial: false,
      };

      const entry2: CaptionEntry = {
        id: 'caption-2',
        speakerId: 'speaker1',
        text: 'World',
        startTs: baseTimestamp + 1000,
        isPartial: false,
      };

      const formatted1 = formatter.formatCaption(entry1, baseTimestamp);
      const formatted2 = formatter.formatCaption(entry2, baseTimestamp);

      expect(formatted1.color).toBe(formatted2.color);
    });

    it('should assign different colors to different speakers', () => {
      const entry1: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Hello',
        startTs: baseTimestamp,
        isPartial: false,
      };

      const entry2: CaptionEntry = {
        id: 'caption-2',
        speakerId: 'speaker2',
        text: 'World',
        startTs: baseTimestamp + 1000,
        isPartial: false,
      };

      const formatted1 = formatter.formatCaption(entry1, baseTimestamp);
      const formatted2 = formatter.formatCaption(entry2, baseTimestamp);

      expect(formatted1.color).not.toBe(formatted2.color);
    });

    it('should allow custom speaker colors', () => {
      const customColor = '#FF0000';
      formatter.setSpeakerColor('speaker1', customColor);

      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Hello',
        startTs: baseTimestamp,
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);
      expect(formatted.color).toBe(customColor);
    });

    it('should generate readable speaker names', () => {
      const testCases = [
        { speakerId: 'user-123', expected: 'User 123' },
        { speakerId: 'client-abc', expected: 'Abc' },
        { speakerId: 'speaker1', expected: 'Speaker speaker1' },
      ];

      testCases.forEach(({ speakerId, expected }) => {
        const entry: CaptionEntry = {
          id: 'caption-1',
          speakerId,
          text: 'Hello',
          startTs: baseTimestamp,
          isPartial: false,
        };

        const formatted = formatter.formatCaption(entry, baseTimestamp);
        expect(formatted.speakerName).toBe(expected);
      });
    });
  });

  describe('Grouped Formatting', () => {
    it('should group consecutive captions by speaker', () => {
      formatter.updateOptions({ groupBySpeaker: true });

      const entries: CaptionEntry[] = [
        {
          id: 'caption-1',
          speakerId: 'speaker1',
          text: 'Hello',
          startTs: baseTimestamp,
          isPartial: false,
        },
        {
          id: 'caption-2',
          speakerId: 'speaker1',
          text: 'world',
          startTs: baseTimestamp + 1000,
          isPartial: false,
        },
        {
          id: 'caption-3',
          speakerId: 'speaker2',
          text: 'How are you?',
          startTs: baseTimestamp + 2000,
          isPartial: false,
        },
      ];

      const formatted = formatter.formatCaptions(entries, baseTimestamp);

      expect(formatted).toHaveLength(2); // Two groups
      expect(formatted[0].displayText).toBe('Hello world');
      expect(formatted[0].speakerId).toBe('speaker1');
      expect(formatted[1].displayText).toBe('How are you?');
      expect(formatted[1].speakerId).toBe('speaker2');
    });

    it('should handle partial captions in groups', () => {
      formatter.updateOptions({ groupBySpeaker: true });

      const entries: CaptionEntry[] = [
        {
          id: 'caption-1',
          speakerId: 'speaker1',
          text: 'Hello',
          startTs: baseTimestamp,
          isPartial: false,
        },
        {
          id: 'caption-2',
          speakerId: 'speaker1',
          text: 'world...',
          startTs: baseTimestamp + 1000,
          isPartial: true,
        },
      ];

      const formatted = formatter.formatCaptions(entries, baseTimestamp);

      expect(formatted).toHaveLength(1);
      expect(formatted[0].isPartial).toBe(true);
      expect(formatted[0].displayText).toBe('Hello world...');
    });
  });

  describe('Accessibility', () => {
    it('should generate comprehensive ARIA labels', () => {
      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'user-123',
        speakerName: 'Alice',
        text: 'Hello world',
        startTs: baseTimestamp - 1000,
        endTs: baseTimestamp,
        confidence: 0.95,
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);

      expect(formatted.ariaLabel).toContain('Alice said: Hello world');
      expect(formatted.ariaLabel).toContain('at 1s');
      expect(formatted.ariaLabel).toContain('for 1.0s');
    });

    it('should include low confidence warnings in ARIA labels', () => {
      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Unclear text',
        startTs: baseTimestamp,
        confidence: 0.6,
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);
      expect(formatted.ariaLabel).toContain('(low confidence: 60%)');
    });

    it('should generate appropriate CSS classes', () => {
      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Hello',
        startTs: baseTimestamp,
        confidence: 0.95,
        isPartial: false,
      };

      const formatted = formatter.formatCaption(entry, baseTimestamp);

      expect(formatted.cssClasses).toContain('caption-entry');
      expect(formatted.cssClasses).toContain('caption-final');
      expect(formatted.cssClasses).toContain('caption-high-confidence');
      expect(formatted.cssClasses).toContain('caption-speaker-speaker1');
    });
  });

  describe('Configuration', () => {
    it('should update options correctly', () => {
      const newOptions = {
        showTimestamps: false,
        maxLineLength: 100,
        timestampFormat: 'absolute' as const,
      };

      formatter.updateOptions(newOptions);
      const currentOptions = formatter.getOptions();

      expect(currentOptions.showTimestamps).toBe(false);
      expect(currentOptions.maxLineLength).toBe(100);
      expect(currentOptions.timestampFormat).toBe('absolute');
    });

    it('should reset speaker colors', () => {
      formatter.setSpeakerColor('speaker1', '#FF0000');
      
      const entry: CaptionEntry = {
        id: 'caption-1',
        speakerId: 'speaker1',
        text: 'Hello',
        startTs: baseTimestamp,
        isPartial: false,
      };

      let formatted = formatter.formatCaption(entry, baseTimestamp);
      expect(formatted.color).toBe('#FF0000');

      formatter.resetSpeakerColors();
      formatted = formatter.formatCaption(entry, baseTimestamp);
      expect(formatted.color).not.toBe('#FF0000');
    });
  });
});
