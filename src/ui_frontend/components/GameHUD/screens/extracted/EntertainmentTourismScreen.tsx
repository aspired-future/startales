/**
 * Entertainment & Tourism Screen - Cultural and Recreational Management
 * 
 * This screen focuses on entertainment and tourism operations including:
 * - Cultural events and entertainment venues
 * - Tourism destinations and travel management
 * - Recreational facilities and activities
 * - Cultural programming and audience engagement
 * - Tourism analytics and visitor insights
 * 
 * Theme: Social (green color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './EntertainmentTourismScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface EntertainmentVenue {
  id: string;
  name: string;
  type: 'theater' | 'museum' | 'park' | 'stadium' | 'casino' | 'cultural_center';
  location: string;
  capacity: number;
  currentAttendance: number;
  rating: number;
  revenue: number;
  status: 'open' | 'closed' | 'maintenance' | 'renovation';
  featured: boolean;
  specialEvents: string[];
  operatingHours: string;
  ticketPrice: number;
}

interface TourismDestination {
  id: string;
  name: string;
  type: 'natural_wonder' | 'historical_site' | 'space_station' | 'planet_colony' | 'cultural_district' | 'adventure_zone';
  location: string;
  visitorCapacity: number;
  currentVisitors: number;
  popularity: number;
  revenue: number;
  status: 'open' | 'restricted' | 'closed' | 'special_event';
  attractions: string[];
  accommodation: string[];
  transportation: string[];
  averageStay: number;
  visitorRating: number;
}

interface CulturalEvent {
  id: string;
  name: string;
  type: 'performance' | 'exhibition' | 'festival' | 'workshop' | 'lecture' | 'celebration';
  venue: string;
  date: string;
  duration: number;
  expectedAttendance: number;
  actualAttendance: number;
  ticketSales: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  performers: string[];
  description: string;
  category: 'arts' | 'music' | 'dance' | 'theater' | 'science' | 'culture';
  targetAudience: string;
}

interface EntertainmentTourismAnalytics {
  overview: {
    totalVenues: number;
    activeDestinations: number;
    totalEvents: number;
    totalVisitors: number;
    totalRevenue: number;
    averageRating: number;
  };
  visitorTrends: Array<{
    date: string;
    totalVisitors: number;
    venueVisitors: number;
    destinationVisitors: number;
    eventAttendees: number;
  }>;
  revenueBreakdown: Array<{
    category: string;
    revenue: number;
    growth: number;
    marketShare: number;
  }>;
  popularityAnalysis: Array<{
    name: string;
    type: string;
    visitors: number;
    rating: number;
    revenue: number;
    growth: number;
  }>;
}

interface EntertainmentTourismData {
  venues: EntertainmentVenue[];
  destinations: TourismDestination[];
  events: CulturalEvent[];
  analytics: EntertainmentTourismAnalytics;
}

const EntertainmentTourismScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [entertainmentData, setEntertainmentData] = useState<EntertainmentTourismData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'venues' | 'destinations' | 'events' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'venues', label: 'Venues', icon: '🎭' },
    { id: 'destinations', label: 'Destinations', icon: '🌍' },
    { id: 'events', label: 'Events', icon: '🎪' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/entertainment/venues', description: 'Get entertainment venues' },
    { method: 'GET', path: '/api/tourism/destinations', description: 'Get tourism destinations' },
    { method: 'GET', path: '/api/entertainment/events', description: 'Get cultural events' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num}`;
  };

  const getVenueTypeColor = (type: string) => {
    switch (type) {
      case 'theater': return '#ef4444';
      case 'museum': return '#3b82f6';
      case 'park': return '#10b981';
      case 'stadium': return '#f59e0b';
      case 'casino': return '#8b5cf6';
      case 'cultural_center': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const getDestinationTypeColor = (type: string) => {
    switch (type) {
      case 'natural_wonder': return '#10b981';
      case 'historical_site': return '#f59e0b';
      case 'space_station': return '#3b82f6';
      case 'planet_colony': return '#8b5cf6';
      case 'cultural_district': return '#ec4899';
      case 'adventure_zone': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return '#ef4444';
      case 'exhibition': return '#3b82f6';
      case 'festival': return '#10b981';
      case 'workshop': return '#f59e0b';
      case 'lecture': return '#8b5cf6';
      case 'celebration': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#10b981';
      case 'closed': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      case 'renovation': return '#8b5cf6';
      case 'restricted': return '#f97316';
      case 'special_event': return '#ec4899';
      case 'upcoming': return '#3b82f6';
      case 'ongoing': return '#10b981';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchEntertainmentData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/entertainment/venues');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEntertainmentData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }

    } catch (err) {
      console.warn('Failed to fetch entertainment data:', err);
      // Use comprehensive mock data
      setEntertainmentData({
        venues: [
          {
            id: 'venue_1',
            name: 'Galactic Grand Theater',
            type: 'theater',
            location: 'Capital District, Terran Prime',
            capacity: 5000,
            currentAttendance: 3200,
            rating: 4.8,
            revenue: 1250000,
            status: 'open',
            featured: true,
            specialEvents: ['Interstellar Opera Festival', 'Galactic Symphony'],
            operatingHours: 'Daily 10:00-22:00',
            ticketPrice: 150
          },
          {
            id: 'venue_2',
            name: 'Museum of Interstellar History',
            type: 'museum',
            location: 'Cultural Quarter, Terran Prime',
            capacity: 8000,
            currentAttendance: 5600,
            rating: 4.6,
            revenue: 890000,
            status: 'open',
            featured: true,
            specialEvents: ['Ancient Artifacts Exhibition', 'Space Race Retrospective'],
            operatingHours: 'Daily 09:00-18:00',
            ticketPrice: 45
          },
          {
            id: 'venue_3',
            name: 'Stellar Sports Arena',
            type: 'stadium',
            location: 'Sports District, Terran Prime',
            capacity: 25000,
            currentAttendance: 18900,
            rating: 4.4,
            revenue: 2340000,
            status: 'open',
            featured: false,
            specialEvents: ['Interstellar Championship', 'All-Star Games'],
            operatingHours: 'Daily 06:00-24:00',
            ticketPrice: 75
          },
          {
            id: 'venue_4',
            name: 'Quantum Casino & Resort',
            type: 'casino',
            location: 'Entertainment Zone, Terran Prime',
            capacity: 12000,
            currentAttendance: 8900,
            rating: 4.2,
            revenue: 5670000,
            status: 'open',
            featured: false,
            specialEvents: ['High Stakes Tournament', 'Celebrity Night'],
            operatingHours: '24/7',
            ticketPrice: 0
          },
          {
            id: 'venue_5',
            name: 'Cosmic Cultural Center',
            type: 'cultural_center',
            location: 'Arts District, Terran Prime',
            capacity: 3000,
            currentAttendance: 2100,
            rating: 4.7,
            revenue: 456000,
            status: 'open',
            featured: true,
            specialEvents: ['Multicultural Festival', 'Artist Residency Program'],
            operatingHours: 'Daily 11:00-21:00',
            ticketPrice: 25
          }
        ],
        destinations: [
          {
            id: 'dest_1',
            name: 'Crystal Caves of Vega Prime',
            type: 'natural_wonder',
            location: 'Vega System, Vega Prime',
            visitorCapacity: 5000,
            currentVisitors: 3200,
            popularity: 9.2,
            revenue: 2340000,
            status: 'open',
            attractions: ['Crystal Formations', 'Underground Lakes', 'Bioluminescent Life'],
            accommodation: ['Cave Hotels', 'Mountain Lodges', 'Camping Sites'],
            transportation: ['Shuttle Service', 'Hiking Trails', 'Cable Cars'],
            averageStay: 3.5,
            visitorRating: 4.9
          },
          {
            id: 'dest_2',
            name: 'Ancient Ruins of Centauri',
            type: 'historical_site',
            location: 'Centauri System, Centauri Prime',
            visitorCapacity: 3000,
            currentVisitors: 2100,
            popularity: 8.8,
            revenue: 1560000,
            status: 'open',
            attractions: ['Temple Complex', 'Archaeological Sites', 'Museum'],
            accommodation: ['Heritage Hotels', 'Guest Houses', 'Research Stations'],
            transportation: ['Guided Tours', 'Archaeological Expeditions', 'Museum Shuttles'],
            averageStay: 2.8,
            visitorRating: 4.7
          },
          {
            id: 'dest_3',
            name: 'Orbital Resort Station Alpha',
            type: 'space_station',
            location: 'Terran System, Low Orbit',
            visitorCapacity: 2000,
            currentVisitors: 1800,
            popularity: 9.5,
            revenue: 3450000,
            status: 'open',
            attractions: ['Zero-G Recreation', 'Space Walks', 'Orbital Views'],
            accommodation: ['Luxury Suites', 'Standard Cabins', 'Observation Pods'],
            transportation: ['Space Shuttles', 'Transfer Vehicles', 'Emergency Pods'],
            averageStay: 4.2,
            visitorRating: 4.8
          },
          {
            id: 'dest_4',
            name: 'Andromeda Colony Gardens',
            type: 'planet_colony',
            location: 'Andromeda System, Andromeda Prime',
            visitorCapacity: 4000,
            currentVisitors: 2800,
            popularity: 7.9,
            revenue: 890000,
            status: 'open',
            attractions: ['Terraformed Gardens', 'Colony Tours', 'Cultural Exchange'],
            accommodation: ['Colony Guest Houses', 'Garden Retreats', 'Research Facilities'],
            transportation: ['Surface Vehicles', 'Walking Tours', 'Aerial Tours'],
            averageStay: 2.5,
            visitorRating: 4.3
          }
        ],
        events: [
          {
            id: 'event_1',
            name: 'Interstellar Opera Festival',
            type: 'festival',
            venue: 'Galactic Grand Theater',
            date: '2393-07-15T19:00:00Z',
            duration: 14,
            expectedAttendance: 35000,
            actualAttendance: 0,
            ticketSales: 2800000,
            status: 'upcoming',
            performers: ['Galactic Opera Company', 'Vega Symphony', 'Centauri Choir'],
            description: 'A two-week celebration of operatic arts from across the galaxy',
            category: 'arts',
            targetAudience: 'Culture Enthusiasts, Music Lovers'
          },
          {
            id: 'event_2',
            name: 'Ancient Artifacts Exhibition',
            type: 'exhibition',
            venue: 'Museum of Interstellar History',
            date: '2393-06-20T10:00:00Z',
            duration: 90,
            expectedAttendance: 120000,
            actualAttendance: 45000,
            ticketSales: 540000,
            status: 'ongoing',
            performers: ['Archaeological Teams', 'Cultural Experts', 'Interactive Displays'],
            description: 'Exhibition of newly discovered artifacts from pre-space civilizations',
            category: 'culture',
            targetAudience: 'History Buffs, Students, Researchers'
          },
          {
            id: 'event_3',
            name: 'Interstellar Championship Finals',
            type: 'performance',
            venue: 'Stellar Sports Arena',
            date: '2393-06-25T20:00:00Z',
            duration: 1,
            expectedAttendance: 25000,
            actualAttendance: 0,
            ticketSales: 1875000,
            status: 'upcoming',
            performers: ['Terran Federation Team', 'Vega Alliance Team', 'Centauri Republic Team'],
            description: 'Championship match between the top three galactic sports teams',
            category: 'arts',
            targetAudience: 'Sports Fans, General Public'
          },
          {
            id: 'event_4',
            name: 'High Stakes Tournament',
            type: 'celebration',
            venue: 'Quantum Casino & Resort',
            date: '2393-06-18T18:00:00Z',
            duration: 3,
            expectedAttendance: 8000,
            actualAttendance: 0,
            ticketSales: 1200000,
            status: 'upcoming',
            performers: ['Professional Players', 'Celebrity Guests', 'Entertainment Acts'],
            description: 'Three-day high-stakes gaming tournament with celebrity appearances',
            category: 'culture',
            targetAudience: 'Gaming Enthusiasts, High Rollers'
          },
          {
            id: 'event_5',
            name: 'Multicultural Festival',
            type: 'festival',
            venue: 'Cosmic Cultural Center',
            date: '2393-06-30T12:00:00Z',
            duration: 7,
            expectedAttendance: 15000,
            actualAttendance: 0,
            ticketSales: 225000,
            status: 'upcoming',
            performers: ['Cultural Groups', 'Traditional Artists', 'Modern Performers'],
            description: 'Week-long celebration of galactic cultural diversity',
            category: 'culture',
            targetAudience: 'Cultural Enthusiasts, Families, Tourists'
          }
        ],
        analytics: {
          overview: {
            totalVenues: 45,
            activeDestinations: 23,
            totalEvents: 156,
            totalVisitors: 890000,
            totalRevenue: 45600000,
            averageRating: 4.5
          },
          visitorTrends: [
            { date: 'Jun 10', totalVisitors: 89000, venueVisitors: 45000, destinationVisitors: 32000, eventAttendees: 12000 },
            { date: 'Jun 11', totalVisitors: 92000, venueVisitors: 47000, destinationVisitors: 33000, eventAttendees: 12000 },
            { date: 'Jun 12', totalVisitors: 95000, venueVisitors: 48000, destinationVisitors: 34000, eventAttendees: 13000 },
            { date: 'Jun 13', totalVisitors: 98000, venueVisitors: 50000, destinationVisitors: 35000, eventAttendees: 13000 },
            { date: 'Jun 14', totalVisitors: 102000, venueVisitors: 52000, destinationVisitors: 37000, eventAttendees: 13000 },
            { date: 'Jun 15', totalVisitors: 105000, venueVisitors: 54000, destinationVisitors: 38000, eventAttendees: 13000 }
          ],
          revenueBreakdown: [
            { category: 'Venues', revenue: 18900000, growth: 12.5, marketShare: 41.4 },
            { category: 'Destinations', revenue: 15600000, growth: 8.7, marketShare: 34.2 },
            { category: 'Events', revenue: 8900000, growth: 15.3, marketShare: 19.5 },
            { category: 'Services', revenue: 2200000, growth: 6.8, marketShare: 4.8 }
          ],
          popularityAnalysis: [
            { name: 'Orbital Resort Station Alpha', type: 'Space Station', visitors: 1800, rating: 4.8, revenue: 3450000, growth: 15.2 },
            { name: 'Crystal Caves of Vega Prime', type: 'Natural Wonder', visitors: 3200, rating: 4.9, revenue: 2340000, growth: 12.8 },
            { name: 'Galactic Grand Theater', type: 'Theater', visitors: 3200, rating: 4.8, revenue: 1250000, growth: 8.9 },
            { name: 'Ancient Ruins of Centauri', type: 'Historical Site', visitors: 2100, rating: 4.7, revenue: 1560000, growth: 7.4 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntertainmentData();
  }, [fetchEntertainmentData]);

  const renderOverview = () => (
    <>
      {/* Entertainment Overview - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Entertainment & Tourism Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Venues</span>
            <span className="standard-metric-value">{entertainmentData?.analytics.overview.totalVenues}</span>
          </div>
          <div className="standard-metric">
            <span>Active Destinations</span>
            <span className="standard-metric-value">{entertainmentData?.analytics.overview.activeDestinations}</span>
          </div>
          <div className="standard-metric">
            <span>Total Events</span>
            <span className="standard-metric-value">{entertainmentData?.analytics.overview.totalEvents}</span>
          </div>
          <div className="standard-metric">
            <span>Total Visitors</span>
            <span className="standard-metric-value">{formatNumber(entertainmentData?.analytics.overview.totalVisitors || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Total Revenue</span>
            <span className="standard-metric-value">{formatCurrency(entertainmentData?.analytics.overview.totalRevenue || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Average Rating</span>
            <span className="standard-metric-value">{entertainmentData?.analytics.overview.averageRating}/5.0</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('New Venue')}>🎭 New Venue</button>
          <button className="standard-btn social-theme" onClick={() => console.log('New Destination')}>🌍 New Destination</button>
          <button className="standard-btn social-theme" onClick={() => console.log('New Event')}>🎪 New Event</button>
        </div>
      </div>

      {/* Revenue Breakdown - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>💰 Revenue Breakdown</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Revenue</th>
                <th>Growth</th>
                <th>Market Share</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entertainmentData?.analytics.revenueBreakdown.map(category => (
                <tr key={category.category}>
                  <td>{category.category}</td>
                  <td>{formatCurrency(category.revenue)}</td>
                  <td>
                    <span style={{ color: category.growth >= 10 ? '#10b981' : category.growth >= 5 ? '#f59e0b' : '#ef4444' }}>
                      +{category.growth}%
                    </span>
                  </td>
                  <td>{category.marketShare}%</td>
                  <td>
                    <button className="standard-btn social-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderVenues = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🎭 Entertainment Venues</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('New Venue')}>🎭 New Venue</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Manage Venues')}>⚙️ Manage</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Attendance</th>
                <th>Rating</th>
                <th>Revenue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entertainmentData?.venues.map(venue => (
                <tr key={venue.id}>
                  <td>
                    <div style={{ maxWidth: '250px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{venue.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{venue.operatingHours}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getVenueTypeColor(venue.type),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getVenueTypeColor(venue.type) + '20'
                    }}>
                      {venue.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{venue.location}</td>
                  <td>
                    <span style={{ color: venue.currentAttendance >= venue.capacity * 0.8 ? '#10b981' : venue.currentAttendance >= venue.capacity * 0.5 ? '#f59e0b' : '#ef4444' }}>
                      {formatNumber(venue.currentAttendance)}/{formatNumber(venue.capacity)}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: venue.rating >= 4.5 ? '#10b981' : venue.rating >= 4.0 ? '#f59e0b' : '#ef4444' }}>
                      {venue.rating}/5.0
                    </span>
                  </td>
                  <td>{formatCurrency(venue.revenue)}</td>
                  <td>
                    <button className="standard-btn social-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDestinations = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🌍 Tourism Destinations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('New Destination')}>🌍 New Destination</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Manage Destinations')}>⚙️ Manage</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Visitors</th>
                <th>Popularity</th>
                <th>Revenue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entertainmentData?.destinations.map(destination => (
                <tr key={destination.id}>
                  <td>
                    <div style={{ maxWidth: '250px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{destination.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Stay: {destination.averageStay} days</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getDestinationTypeColor(destination.type),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getDestinationTypeColor(destination.type) + '20'
                    }}>
                      {destination.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{destination.location}</td>
                  <td>
                    <span style={{ color: destination.currentVisitors >= destination.visitorCapacity * 0.8 ? '#10b981' : destination.currentVisitors >= destination.visitorCapacity * 0.5 ? '#f59e0b' : '#ef4444' }}>
                      {formatNumber(destination.currentVisitors)}/{formatNumber(destination.visitorCapacity)}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: destination.popularity >= 9.0 ? '#10b981' : destination.popularity >= 8.0 ? '#f59e0b' : '#ef4444' }}>
                      {destination.popularity}/10.0
                    </span>
                  </td>
                  <td>{formatCurrency(destination.revenue)}</td>
                  <td>
                    <button className="standard-btn social-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🎪 Cultural Events</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('New Event')}>🎪 New Event</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Manage Events')}>⚙️ Manage</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Expected</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entertainmentData?.events.map(event => (
                <tr key={event.id}>
                  <td>
                    <div style={{ maxWidth: '300px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{event.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{event.description}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getEventTypeColor(event.type),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getEventTypeColor(event.type) + '20'
                    }}>
                      {event.type}
                    </span>
                  </td>
                  <td>{event.venue}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{formatNumber(event.expectedAttendance)}</td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(event.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(event.status) + '20'
                    }}>
                      {event.status}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn social-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Entertainment Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <LineChart
              data={entertainmentData?.analytics.visitorTrends.map(trend => ({
                name: trend.date,
                'Total Visitors': trend.totalVisitors / 1000,
                'Venue Visitors': trend.venueVisitors / 1000,
                'Destination Visitors': trend.destinationVisitors / 1000,
                'Event Attendees': trend.eventAttendees / 1000
              })) || []}
              title="Visitor Trends (Thousands)"
              height={300}
              width={500}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={entertainmentData?.analytics.revenueBreakdown.map(category => ({
                name: category.category,
                value: category.revenue
              })) || []}
              title="Revenue by Category"
              size={250}
              showLegend={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Top Performing Locations</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Visitors</th>
                  <th>Rating</th>
                  <th>Revenue</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                {entertainmentData?.analytics.popularityAnalysis.map(location => (
                  <tr key={location.name}>
                    <td>{location.name}</td>
                    <td>{location.type}</td>
                    <td>{formatNumber(location.visitors)}</td>
                    <td>
                      <span style={{ color: location.rating >= 4.5 ? '#10b981' : location.rating >= 4.0 ? '#f59e0b' : '#ef4444' }}>
                        {location.rating}/5.0
                      </span>
                    </td>
                    <td>{formatCurrency(location.revenue)}</td>
                    <td>
                      <span style={{ color: location.growth >= 10 ? '#10b981' : location.growth >= 5 ? '#f59e0b' : '#ef4444' }}>
                        +{location.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchEntertainmentData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container social-theme">
        <div className="standard-dashboard">
          {!loading && !error && entertainmentData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'venues' && renderVenues()}
              {activeTab === 'destinations' && renderDestinations()}
              {activeTab === 'events' && renderEvents()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading entertainment data...' : 'No entertainment data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default EntertainmentTourismScreen;
