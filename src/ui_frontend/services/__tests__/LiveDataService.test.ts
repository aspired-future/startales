/**
 * Tests for LiveDataService - ensuring real API integration works correctly
 */

import { LiveDataService } from '../LiveDataService';

// Mock fetch for testing
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(() => ({
  onopen: null,
  onmessage: null,
  onclose: null,
  onerror: null,
  close: jest.fn(),
  send: jest.fn()
}));

describe('LiveDataService', () => {
  let service: LiveDataService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LiveDataService();
  });

  afterEach(() => {
    service.disconnect();
  });

  describe('API Integration', () => {
    it('should fetch civilization stats from real API', async () => {
      const mockResponse = {
        metrics: {
          population: { population: 1000000, morale: 0.8 },
          economy: { gdpProxy: 2500000, budgetBalance: 500000 },
          population: { stability: 0.9 }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const stats = await service.getCivilizationStats();

      expect(fetch).toHaveBeenCalledWith('/api/analytics/empire?scope=campaign&id=1');
      expect(stats.population).toBe(1000000);
      expect(stats.approval).toBe(80); // 0.8 * 100
      expect(stats.treasury).toBe(500000);
    });

    it('should fetch galaxy stats from multiple APIs', async () => {
      const empireResponse = { planets: [{ id: 1 }, { id: 2 }, { id: 3 }] };
      const trendsResponse = { 
        civilizations: [{ id: 1 }, { id: 2 }],
        totalPopulation: 5000000,
        conflicts: 1,
        tradeVolume: 1000000,
        research: 5
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => empireResponse
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => trendsResponse
        } as Response);

      const galaxyStats = await service.getGalaxyStats();

      expect(fetch).toHaveBeenCalledWith('/api/empire/planets');
      expect(fetch).toHaveBeenCalledWith('/api/analytics/trends?scope=galaxy&window=1');
      expect(galaxyStats.totalPlanets).toBe(3);
      expect(galaxyStats.totalCivilizations).toBe(2);
      expect(galaxyStats.totalPopulation).toBe(5000000);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'));

      const stats = await service.getCivilizationStats();

      expect(stats.name).toBe('Loading...');
      expect(stats.population).toBe(0);
      expect(stats.gdp).toBe(0);
    });
  });

  describe('Data Formatting', () => {
    it('should format numbers correctly', () => {
      expect(service.formatNumber(1500)).toBe('1.5K');
      expect(service.formatNumber(2500000)).toBe('2.5M');
      expect(service.formatNumber(1200000000)).toBe('1.2B');
      expect(service.formatNumber(3400000000000)).toBe('3.4T');
    });

    it('should format currency correctly', () => {
      expect(service.formatCurrency(1500)).toBe('1.5K ₵');
      expect(service.formatCurrency(2500000)).toBe('2.5M ₵');
    });

    it('should format percentages correctly', () => {
      expect(service.formatPercentage(0.75)).toBe('75%');
      expect(service.formatPercentage(0.8234)).toBe('82%');
    });
  });

  describe('Event System', () => {
    it('should register and trigger event listeners', () => {
      const mockCallback = jest.fn();
      
      service.on('test-event', mockCallback);
      service['emit']('test-event', { data: 'test' });

      expect(mockCallback).toHaveBeenCalledWith({ data: 'test' });
    });

    it('should remove event listeners', () => {
      const mockCallback = jest.fn();
      
      service.on('test-event', mockCallback);
      service.off('test-event', mockCallback);
      service['emit']('test-event', { data: 'test' });

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('WebSocket Connection', () => {
    it('should initialize WebSocket connection', () => {
      expect(WebSocket).toHaveBeenCalled();
    });

    it('should handle connection status changes', () => {
      const mockCallback = jest.fn();
      service.on('connection', mockCallback);

      // Simulate connection status change
      service['emit']('connection', { status: 'connected' });

      expect(mockCallback).toHaveBeenCalledWith({ status: 'connected' });
    });
  });
});
