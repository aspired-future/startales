/**
 * Entertainment, Culture & Tourism Management Screen
 * Comprehensive interface for managing entertainment industry, cultural development, and tourism
 */

import React, { useState, useEffect } from 'react';
import './EntertainmentTourismScreen.css';

interface EntertainmentTourismScreenProps {
  gameContext: any;
  onClose?: () => void;
}

interface CulturalHeritage {
  heritageScore: number;
  traditionalArtsVitality: number;
  modernArtsInnovation: number;
  culturalDiversityIndex: number;
  culturalEducationLevel: number;
  artisticFreedomIndex: number;
  culturalSites: number;
  culturalEvents: number;
}

interface EntertainmentIndustry {
  industrySize: number;
  venueCapacity: number;
  employmentLevel: number;
  contentDiversityScore: number;
  celebrityInfluenceIndex: number;
  sportsIndustryStrength: number;
  gamingIndustrySize: number;
  livePerformanceVitality: number;
  entertainmentExports: number;
  innovationIndex: number;
}

interface TourismSector {
  touristArrivals: number;
  tourismRevenue: number;
  infrastructureQuality: number;
  naturalAttractionScore: number;
  historicalSiteScore: number;
  touristSatisfactionIndex: number;
  sustainabilityRating: number;
  safetyIndex: number;
  accessibilityScore: number;
  marketingEffectiveness: number;
  // Enhanced factors
  distanceAccessibility: number;
  economicAffordability: number;
  securityLevel: number;
  travelTimeIndex: number;
  costOfLivingImpact: number;
  crimeSafetyRating: number;
  politicalStabilityIndex: number;
  healthSafetyStandards: number;
}

interface EconomicImpact {
  totalGdpContribution: number;
  employmentContribution: number;
  taxRevenue: number;
  foreignExchangeEarnings: number;
  investmentAttraction: number;
  economicMultiplier: number;
  seasonalityIndex: number;
  competitivenessRating: number;
}

interface SocialMetrics {
  culturalParticipationRate: number;
  culturalIdentityStrength: number;
  interculturalExchangeLevel: number;
  entertainmentAccessibility: number;
  communityEngagement: number;
  culturalAuthenticityIndex: number;
  socialCohesionImpact: number;
  qualityOfLifeContribution: number;
}

interface LanguageAndLiterature {
  languageDiversityIndex: number;
  literacyRate: number;
  publishingIndustryStrength: number;
  libraryAccessibility: number;
  literaryAwardsPrestige: number;
  translationActivity: number;
  oralTraditionVitality: number;
  poetryAndProsePopularity: number;
}

interface ReligionAndPhilosophy {
  religiousDiversityIndex: number;
  spiritualPracticeEngagement: number;
  philosophicalEducationLevel: number;
  interfaithHarmonyIndex: number;
  secularHumanismStrength: number;
  ethicalFrameworkDevelopment: number;
  contemplativePracticePopularity: number;
  moralLeadershipQuality: number;
}

interface ScienceAndInnovation {
  scientificLiteracyRate: number;
  researchInstitutionQuality: number;
  innovationCultureStrength: number;
  technologyAdoptionRate: number;
  scientificPublicationImpact: number;
  stemEducationQuality: number;
  entrepreneurialSpirit: number;
  intellectualPropertyProtection: number;
}

interface CulinaryAndLifestyle {
  culinaryDiversityIndex: number;
  foodCultureRichness: number;
  sustainableFoodPractices: number;
  culinaryEducationLevel: number;
  restaurantIndustryStrength: number;
  traditionalCuisinePreservation: number;
  foodFestivalPopularity: number;
  culinaryInnovationIndex: number;
}



interface CulturalData {
  culturalHeritage: CulturalHeritage;
  entertainmentIndustry: EntertainmentIndustry;
  tourismSector: TourismSector;
  economicImpact: EconomicImpact;
  socialMetrics: SocialMetrics;
  languageAndLiterature: LanguageAndLiterature;
  religionAndPhilosophy: ReligionAndPhilosophy;
  scienceAndInnovation: ScienceAndInnovation;
  culinaryAndLifestyle: CulinaryAndLifestyle;
}

interface Venue {
  id: string;
  name: string;
  type: string;
  capacity: number;
  utilizationRate: number;
  annualEvents: number;
  averageTicketPrice: number;
  annualRevenue: number;
  employeeCount: number;
}

interface Attraction {
  id: string;
  name: string;
  category: string;
  type: string;
  popularityRating: number;
  annualVisitors: number;
  ticketPrice: number;
  operatingCosts: number;
  profitMargin: number;
  accessibilityRating: number;
}

interface CulturalSite {
  id: string;
  name: string;
  type: string;
  significance: string;
  condition: number;
  visitorCapacity: number;
  annualVisitors: number;
  maintenanceCost: number;
  touristRating: number;
}

const EntertainmentTourismScreen: React.FC<EntertainmentTourismScreenProps> = ({
  gameContext,
  onClose
}) => {
  console.log('🎭 EntertainmentTourismScreen: Component rendering with gameContext:', gameContext);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [culturalData, setCulturalData] = useState<CulturalData | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [culturalSites, setCulturalSites] = useState<CulturalSite[]>([]);
  const [employmentData, setEmploymentData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const civilizationId = gameContext?.civilizationId || '1';

  useEffect(() => {
    fetchCulturalData();
  }, [civilizationId]);

  const fetchCulturalData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch main entertainment/tourism data
      const [
        culturalResponse,
        entertainmentResponse,
        tourismResponse,
        economicResponse,
        venuesResponse,
        attractionsResponse,
        sitesResponse,
        employmentResponse,
        analyticsResponse
      ] = await Promise.all([
        fetch(`/api/entertainment-tourism/cultural/heritage/${civilizationId}`),
        fetch(`/api/entertainment-tourism/entertainment/industry/${civilizationId}`),
        fetch(`/api/entertainment-tourism/tourism/performance/${civilizationId}`),
        fetch(`/api/entertainment-tourism/economic/impact/${civilizationId}`),
        fetch(`/api/entertainment-tourism/entertainment/venues/${civilizationId}`),
        fetch(`/api/entertainment-tourism/tourism/attractions/${civilizationId}`),
        fetch(`/api/entertainment-tourism/cultural/sites/${civilizationId}`),
        fetch(`/api/entertainment-tourism/economic/employment/${civilizationId}`),
        fetch(`/api/entertainment-tourism/analytics/${civilizationId}`)
      ]);

      const [
        culturalData,
        entertainmentData,
        tourismData,
        economicData,
        venuesData,
        attractionsData,
        sitesData,
        employmentDataResponse,
        analyticsData
      ] = await Promise.all([
        culturalResponse.json(),
        entertainmentResponse.json(),
        tourismResponse.json(),
        economicResponse.json(),
        venuesResponse.json(),
        attractionsResponse.json(),
        sitesResponse.json(),
        employmentResponse.json(),
        analyticsResponse.json()
      ]);

      // Combine data
      const combinedData: CulturalData = {
        culturalHeritage: culturalData.data?.culturalHeritage || {},
        entertainmentIndustry: entertainmentData.data?.entertainmentIndustry || {},
        tourismSector: {
          ...tourismData.data?.tourismSector,
          // Enhanced factors with defaults
          distanceAccessibility: tourismData.data?.tourismSector?.distanceAccessibility || 72,
          economicAffordability: tourismData.data?.tourismSector?.economicAffordability || 65,
          securityLevel: tourismData.data?.tourismSector?.securityLevel || 88,
          travelTimeIndex: tourismData.data?.tourismSector?.travelTimeIndex || 75,
          costOfLivingImpact: tourismData.data?.tourismSector?.costOfLivingImpact || 60,
          crimeSafetyRating: tourismData.data?.tourismSector?.crimeSafetyRating || 85,
          politicalStabilityIndex: tourismData.data?.tourismSector?.politicalStabilityIndex || 90,
          healthSafetyStandards: tourismData.data?.tourismSector?.healthSafetyStandards || 82
        },
        economicImpact: economicData.data?.economicImpact || {},
        socialMetrics: {
          culturalParticipationRate: 45,
          culturalIdentityStrength: 60,
          interculturalExchangeLevel: 40,
          entertainmentAccessibility: 55,
          communityEngagement: 50,
          culturalAuthenticityIndex: 65,
          socialCohesionImpact: 15,
          qualityOfLifeContribution: 60
        },
        languageAndLiterature: {
          languageDiversityIndex: 75,
          literacyRate: 95,
          publishingIndustryStrength: 60,
          libraryAccessibility: 80,
          literaryAwardsPrestige: 45,
          translationActivity: 55,
          oralTraditionVitality: 70,
          poetryAndProsePopularity: 40
        },
        religionAndPhilosophy: {
          religiousDiversityIndex: 65,
          spiritualPracticeEngagement: 50,
          philosophicalEducationLevel: 55,
          interfaithHarmonyIndex: 70,
          secularHumanismStrength: 60,
          ethicalFrameworkDevelopment: 45,
          contemplativePracticePopularity: 35,
          moralLeadershipQuality: 50
        },
        scienceAndInnovation: {
          scientificLiteracyRate: 85,
          researchInstitutionQuality: 70,
          innovationCultureStrength: 75,
          technologyAdoptionRate: 80,
          scientificPublicationImpact: 65,
          stemEducationQuality: 75,
          entrepreneurialSpirit: 70,
          intellectualPropertyProtection: 60
        },
        culinaryAndLifestyle: {
          culinaryDiversityIndex: 80,
          foodCultureRichness: 85,
          sustainableFoodPractices: 55,
          culinaryEducationLevel: 60,
          restaurantIndustryStrength: 70,
          traditionalCuisinePreservation: 75,
          foodFestivalPopularity: 65,
          culinaryInnovationIndex: 50
        }
      };

      setCulturalData(combinedData);
      setVenues(venuesData.data?.venues || []);
      setAttractions(attractionsData.data?.attractions || []);
      setCulturalSites(sitesData.data?.sites || []);
      setEmploymentData(employmentDataResponse.data?.employment || null);
      setAnalytics(analyticsData.data?.analytics || null);

    } catch (err) {
      console.error('Error fetching entertainment/tourism data:', err);
      setError('Failed to load entertainment and tourism data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(0);
  };

  const renderOverviewTab = () => {
    if (!culturalData) return <div>No data available</div>;

    const { culturalHeritage, entertainmentIndustry, tourismSector, economicImpact } = culturalData;

    return (
      <div className="overview-tab">
        <div className="overview-grid">
          {/* Cultural Heritage Overview */}
          <div className="overview-card">
            <h3>🏛️ Cultural Heritage</h3>
            <div className="metric-row">
              <span>Heritage Score:</span>
              <span className="metric-value">{culturalHeritage.heritageScore?.toFixed(1) || '0.0'}/100</span>
            </div>
            <div className="metric-row">
              <span>Cultural Sites:</span>
              <span className="metric-value">{culturalHeritage.culturalSites || 0}</span>
            </div>
            <div className="metric-row">
              <span>Annual Events:</span>
              <span className="metric-value">{culturalHeritage.culturalEvents || 0}</span>
            </div>
            <div className="metric-row">
              <span>Artistic Freedom:</span>
              <span className="metric-value">{culturalHeritage.artisticFreedomIndex?.toFixed(1) || '0.0'}/100</span>
            </div>
          </div>

          {/* Entertainment Industry Overview */}
          <div className="overview-card">
            <h3>🎭 Entertainment Industry</h3>
            <div className="metric-row">
              <span>Industry Size:</span>
              <span className="metric-value">{formatCurrency(entertainmentIndustry.industrySize || 0)}</span>
            </div>
            <div className="metric-row">
              <span>Employment:</span>
              <span className="metric-value">{formatNumber(entertainmentIndustry.employmentLevel || 0)}</span>
            </div>
            <div className="metric-row">
              <span>Venue Capacity:</span>
              <span className="metric-value">{formatNumber(entertainmentIndustry.venueCapacity || 0)}</span>
            </div>
            <div className="metric-row">
              <span>Innovation Index:</span>
              <span className="metric-value">{entertainmentIndustry.innovationIndex?.toFixed(1) || '0.0'}/100</span>
            </div>
          </div>

          {/* Tourism Sector Overview */}
          <div className="overview-card">
            <h3>✈️ Tourism Sector</h3>
            <div className="metric-row">
              <span>Tourist Arrivals:</span>
              <span className="metric-value">{formatNumber(tourismSector.touristArrivals || 0)}</span>
            </div>
            <div className="metric-row">
              <span>Tourism Revenue:</span>
              <span className="metric-value">{formatCurrency(tourismSector.tourismRevenue || 0)}</span>
            </div>
            <div className="metric-row">
              <span>Satisfaction Index:</span>
              <span className="metric-value">{tourismSector.touristSatisfactionIndex?.toFixed(1) || '0.0'}/100</span>
            </div>
            <div className="metric-row">
              <span>Safety Rating:</span>
              <span className="metric-value">{tourismSector.safetyIndex?.toFixed(1) || '0.0'}/100</span>
            </div>
          </div>

          {/* Economic Impact Overview */}
          <div className="overview-card">
            <h3>💰 Economic Impact</h3>
            <div className="metric-row">
              <span>GDP Contribution:</span>
              <span className="metric-value">{economicImpact.totalGdpContribution?.toFixed(1) || '0.0'}%</span>
            </div>
            <div className="metric-row">
              <span>Total Employment:</span>
              <span className="metric-value">{formatNumber(economicImpact.employmentContribution || 0)}</span>
            </div>
            <div className="metric-row">
              <span>Tax Revenue:</span>
              <span className="metric-value">{formatCurrency(economicImpact.taxRevenue || 0)}</span>
            </div>
            <div className="metric-row">
              <span>Economic Multiplier:</span>
              <span className="metric-value">{economicImpact.economicMultiplier?.toFixed(1) || '0.0'}x</span>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="kpi-section">
          <h3>📊 Key Performance Indicators</h3>
          <div className="kpi-grid">
            <div className="kpi-item">
              <div className="kpi-label">Cultural Vitality</div>
              <div className="kpi-value">{culturalHeritage.heritageScore?.toFixed(0) || '0'}/100</div>
              <div className="kpi-bar">
                <div 
                  className="kpi-fill cultural" 
                  style={{ width: `${culturalHeritage.heritageScore || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="kpi-item">
              <div className="kpi-label">Entertainment Growth</div>
              <div className="kpi-value">{entertainmentIndustry.innovationIndex?.toFixed(0) || '0'}/100</div>
              <div className="kpi-bar">
                <div 
                  className="kpi-fill entertainment" 
                  style={{ width: `${entertainmentIndustry.innovationIndex || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="kpi-item">
              <div className="kpi-label">Tourism Appeal</div>
              <div className="kpi-value">{tourismSector.touristSatisfactionIndex?.toFixed(0) || '0'}/100</div>
              <div className="kpi-bar">
                <div 
                  className="kpi-fill tourism" 
                  style={{ width: `${tourismSector.touristSatisfactionIndex || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="kpi-item">
              <div className="kpi-label">Economic Contribution</div>
              <div className="kpi-value">{economicImpact.totalGdpContribution?.toFixed(1) || '0.0'}%</div>
              <div className="kpi-bar">
                <div 
                  className="kpi-fill economic" 
                  style={{ width: `${Math.min(100, (economicImpact.totalGdpContribution || 0) * 5)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCulturalTab = () => {
    return (
      <div className="cultural-tab">
        <div className="tab-header">
          <h3>🏛️ Cultural Heritage & Arts</h3>
          <p>Manage cultural sites, events, and artistic development</p>
        </div>

        {/* Cultural Sites */}
        <div className="section">
          <h4>Cultural Heritage Sites</h4>
          <div className="sites-grid">
            {culturalSites.map(site => (
              <div key={site.id} className="site-card">
                <div className="site-header">
                  <h5>{site.name}</h5>
                  <span className={`significance-badge ${site.significance}`}>
                    {site.significance}
                  </span>
                </div>
                <div className="site-details">
                  <div className="detail-row">
                    <span>Type:</span>
                    <span>{site.type}</span>
                  </div>
                  <div className="detail-row">
                    <span>Condition:</span>
                    <span>{site.condition}/100</span>
                  </div>
                  <div className="detail-row">
                    <span>Annual Visitors:</span>
                    <span>{formatNumber(site.annualVisitors)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Tourist Rating:</span>
                    <span>⭐ {site.touristRating.toFixed(1)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Maintenance Cost:</span>
                    <span>{formatCurrency(site.maintenanceCost)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Metrics */}
        {culturalData && (
          <div className="section">
            <h4>Cultural Development Metrics</h4>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-title">Traditional Arts Vitality</div>
                <div className="metric-value">{culturalData.culturalHeritage.traditionalArtsVitality?.toFixed(1) || '0.0'}/100</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Modern Arts Innovation</div>
                <div className="metric-value">{culturalData.culturalHeritage.modernArtsInnovation?.toFixed(1) || '0.0'}/100</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Cultural Diversity Index</div>
                <div className="metric-value">{culturalData.culturalHeritage.culturalDiversityIndex?.toFixed(1) || '0.0'}/100</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Cultural Education Level</div>
                <div className="metric-value">{culturalData.culturalHeritage.culturalEducationLevel?.toFixed(1) || '0.0'}/100</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEntertainmentTab = () => {
    return (
      <div className="entertainment-tab">
        <div className="tab-header">
          <h3>🎭 Entertainment Industry</h3>
          <p>Manage venues, content production, and entertainment sectors</p>
        </div>

        {/* Entertainment Venues */}
        <div className="section">
          <h4>Entertainment Venues</h4>
          <div className="venues-grid">
            {venues.map(venue => (
              <div key={venue.id} className="venue-card">
                <div className="venue-header">
                  <h5>{venue.name}</h5>
                  <span className={`venue-type-badge ${venue.type}`}>
                    {venue.type}
                  </span>
                </div>
                <div className="venue-details">
                  <div className="detail-row">
                    <span>Capacity:</span>
                    <span>{formatNumber(venue.capacity)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Utilization:</span>
                    <span>{venue.utilizationRate.toFixed(1)}%</span>
                  </div>
                  <div className="detail-row">
                    <span>Annual Events:</span>
                    <span>{venue.annualEvents}</span>
                  </div>
                  <div className="detail-row">
                    <span>Avg Ticket Price:</span>
                    <span>{formatCurrency(venue.averageTicketPrice)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Annual Revenue:</span>
                    <span>{formatCurrency(venue.annualRevenue)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Employees:</span>
                    <span>{venue.employeeCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entertainment Industry Metrics */}
        {culturalData && (
          <div className="section">
            <h4>Industry Performance</h4>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-title">Content Diversity Score</div>
                <div className="metric-value">{culturalData.entertainmentIndustry.contentDiversityScore?.toFixed(1) || '0.0'}/100</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Sports Industry Strength</div>
                <div className="metric-value">{culturalData.entertainmentIndustry.sportsIndustryStrength?.toFixed(1) || '0.0'}/100</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Gaming Industry Size</div>
                <div className="metric-value">{formatCurrency(culturalData.entertainmentIndustry.gamingIndustrySize || 0)}</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Live Performance Vitality</div>
                <div className="metric-value">{culturalData.entertainmentIndustry.livePerformanceVitality?.toFixed(1) || '0.0'}/100</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTourismTab = () => {
    return (
      <div className="tourism-tab">
        <div className="tab-header">
          <h3>✈️ Tourism Sector</h3>
          <p>Manage tourist attractions, infrastructure, and visitor experience</p>
        </div>

        {/* Tourist Attractions */}
        <div className="section">
          <h4>Tourist Attractions</h4>
          <div className="attractions-grid">
            {attractions.map(attraction => (
              <div key={attraction.id} className="attraction-card">
                <div className="attraction-header">
                  <h5>{attraction.name}</h5>
                  <span className={`category-badge ${attraction.category}`}>
                    {attraction.category}
                  </span>
                </div>
                <div className="attraction-details">
                  <div className="detail-row">
                    <span>Type:</span>
                    <span>{attraction.type}</span>
                  </div>
                  <div className="detail-row">
                    <span>Rating:</span>
                    <span>⭐ {attraction.popularityRating.toFixed(1)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Annual Visitors:</span>
                    <span>{formatNumber(attraction.annualVisitors)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Ticket Price:</span>
                    <span>{formatCurrency(attraction.ticketPrice)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Profit Margin:</span>
                    <span>{(attraction.profitMargin * 100).toFixed(1)}%</span>
                  </div>
                  <div className="detail-row">
                    <span>Accessibility:</span>
                    <span>{attraction.accessibilityRating}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tourism Performance Metrics */}
        {culturalData && (
          <div className="section">
            <h4>Tourism Performance</h4>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-title">Infrastructure Quality</div>
                <div className="metric-value">{culturalData.tourismSector.infrastructureQuality?.toFixed(1) || '0.0'}/100</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Natural Attractions</div>
                <div className="metric-value">{culturalData.tourismSector.naturalAttractionScore?.toFixed(1) || '0.0'}/100</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Historical Sites</div>
                <div className="metric-value">{culturalData.tourismSector.historicalSiteScore?.toFixed(1) || '0.0'}/100</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Sustainability Rating</div>
                <div className="metric-value">{culturalData.tourismSector.sustainabilityRating?.toFixed(1) || '0.0'}/100</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEconomicTab = () => {
    return (
      <div className="economic-tab">
        <div className="tab-header">
          <h3>💰 Economic Impact</h3>
          <p>Analyze economic contributions and employment data</p>
        </div>

        {/* Employment Data */}
        {employmentData && (
          <div className="section">
            <h4>Employment Overview</h4>
            <div className="employment-grid">
              <div className="employment-card">
                <h5>Entertainment Sector</h5>
                <div className="employment-details">
                  <div className="detail-row">
                    <span>Total Jobs:</span>
                    <span>{formatNumber(employmentData.entertainment.totalJobs)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Average Salary:</span>
                    <span>{formatCurrency(employmentData.entertainment.averageSalary)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Job Growth Rate:</span>
                    <span>{(employmentData.entertainment.jobGrowthRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="sector-breakdown">
                  <h6>Sector Breakdown:</h6>
                  {Object.entries(employmentData.entertainment.sectors).map(([sector, jobs]) => (
                    <div key={sector} className="sector-row">
                      <span>{sector.replace('_', ' ')}:</span>
                      <span>{formatNumber(jobs as number)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="employment-card">
                <h5>Tourism Sector</h5>
                <div className="employment-details">
                  <div className="detail-row">
                    <span>Total Jobs:</span>
                    <span>{formatNumber(employmentData.tourism.totalJobs)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Average Salary:</span>
                    <span>{formatCurrency(employmentData.tourism.averageSalary)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Job Growth Rate:</span>
                    <span>{(employmentData.tourism.jobGrowthRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="sector-breakdown">
                  <h6>Sector Breakdown:</h6>
                  {Object.entries(employmentData.tourism.sectors).map(([sector, jobs]) => (
                    <div key={sector} className="sector-row">
                      <span>{sector.replace('_', ' ')}:</span>
                      <span>{formatNumber(jobs as number)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="combined-metrics">
              <h5>Combined Impact</h5>
              <div className="metrics-row">
                <div className="metric-item">
                  <span>Total Employment:</span>
                  <span>{formatNumber(employmentData.combined.totalJobs)}</span>
                </div>
                <div className="metric-item">
                  <span>% of Total Employment:</span>
                  <span>{employmentData.combined.percentOfTotalEmployment.toFixed(1)}%</span>
                </div>
                <div className="metric-item">
                  <span>Economic Multiplier:</span>
                  <span>{employmentData.combined.economicMultiplier.toFixed(1)}x</span>
                </div>
                <div className="metric-item">
                  <span>Indirect Jobs Created:</span>
                  <span>{formatNumber(employmentData.combined.indirectJobsCreated)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Economic Impact Metrics */}
        {culturalData && (
          <div className="section">
            <h4>Economic Contribution</h4>
            <div className="metrics-grid">
              <div className="metric-card large">
                <div className="metric-title">Foreign Exchange Earnings</div>
                <div className="metric-value">{formatCurrency(culturalData.economicImpact.foreignExchangeEarnings || 0)}</div>
              </div>
              <div className="metric-card large">
                <div className="metric-title">Investment Attraction</div>
                <div className="metric-value">{formatCurrency(culturalData.economicImpact.investmentAttraction || 0)}</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Competitiveness Rating</div>
                <div className="metric-value">{culturalData.economicImpact.competitivenessRating?.toFixed(1) || '0.0'}/100</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Seasonality Index</div>
                <div className="metric-value">{culturalData.economicImpact.seasonalityIndex?.toFixed(1) || '0.0'}/100</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSocialTab = () => {
    if (!culturalData) return <div>No social data available</div>;

    const { socialMetrics } = culturalData;

    return (
      <div className="social-tab">
        <div className="tab-header">
          <h3>👥 Social Impact</h3>
          <p>Monitor cultural participation, community engagement, and social cohesion</p>
        </div>

        <div className="section">
          <h4>Social Metrics</h4>
          <div className="social-metrics-grid">
            <div className="social-metric-card">
              <div className="metric-icon">🎭</div>
              <div className="metric-content">
                <div className="metric-title">Cultural Participation Rate</div>
                <div className="metric-value">{socialMetrics.culturalParticipationRate?.toFixed(1) || '0.0'}%</div>
                <div className="metric-description">Citizens actively participating in cultural activities</div>
              </div>
            </div>

            <div className="social-metric-card">
              <div className="metric-icon">🏛️</div>
              <div className="metric-content">
                <div className="metric-title">Cultural Identity Strength</div>
                <div className="metric-value">{socialMetrics.culturalIdentityStrength?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Strength of national and regional cultural identity</div>
              </div>
            </div>

            <div className="social-metric-card">
              <div className="metric-icon">🌍</div>
              <div className="metric-content">
                <div className="metric-title">Intercultural Exchange</div>
                <div className="metric-value">{socialMetrics.interculturalExchangeLevel?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Level of cultural exchange with other civilizations</div>
              </div>
            </div>

            <div className="social-metric-card">
              <div className="metric-icon">🎪</div>
              <div className="metric-content">
                <div className="metric-title">Entertainment Accessibility</div>
                <div className="metric-value">{socialMetrics.entertainmentAccessibility?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Access to entertainment for all social classes</div>
              </div>
            </div>

            <div className="social-metric-card">
              <div className="metric-icon">🤝</div>
              <div className="metric-content">
                <div className="metric-title">Community Engagement</div>
                <div className="metric-value">{socialMetrics.communityEngagement?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Community involvement in cultural initiatives</div>
              </div>
            </div>

            <div className="social-metric-card">
              <div className="metric-icon">🎨</div>
              <div className="metric-content">
                <div className="metric-title">Cultural Authenticity</div>
                <div className="metric-value">{socialMetrics.culturalAuthenticityIndex?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Preservation of authentic cultural experiences</div>
              </div>
            </div>

            <div className="social-metric-card">
              <div className="metric-icon">🔗</div>
              <div className="metric-content">
                <div className="metric-title">Social Cohesion Impact</div>
                <div className="metric-value">{socialMetrics.socialCohesionImpact?.toFixed(1) || '0.0'}</div>
                <div className="metric-description">Impact on overall social unity and cohesion</div>
              </div>
            </div>

            <div className="social-metric-card">
              <div className="metric-icon">🌟</div>
              <div className="metric-content">
                <div className="metric-title">Quality of Life Contribution</div>
                <div className="metric-value">{socialMetrics.qualityOfLifeContribution?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Contribution to citizen quality of life</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLanguageTab = () => {
    if (!culturalData) return <div>No language data available</div>;

    const { languageAndLiterature } = culturalData;

    return (
      <div className="language-tab">
        <div className="tab-header">
          <h3>📚 Language & Literature</h3>
          <p>Monitor linguistic diversity, literacy, and literary culture</p>
        </div>

        <div className="section">
          <h4>Language & Literary Metrics</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">🌍</div>
              <div className="metric-content">
                <div className="metric-title">Language Diversity Index</div>
                <div className="metric-value">{languageAndLiterature.languageDiversityIndex?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Number and vitality of spoken languages</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📖</div>
              <div className="metric-content">
                <div className="metric-title">Literacy Rate</div>
                <div className="metric-value">{languageAndLiterature.literacyRate?.toFixed(1) || '0.0'}%</div>
                <div className="metric-description">Population able to read and write</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📚</div>
              <div className="metric-content">
                <div className="metric-title">Publishing Industry Strength</div>
                <div className="metric-value">{languageAndLiterature.publishingIndustryStrength?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Strength of book and media publishing</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🏛️</div>
              <div className="metric-content">
                <div className="metric-title">Library Accessibility</div>
                <div className="metric-value">{languageAndLiterature.libraryAccessibility?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Public access to libraries and archives</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPhilosophyTab = () => {
    if (!culturalData) return <div>No philosophy data available</div>;

    const { religionAndPhilosophy } = culturalData;

    return (
      <div className="philosophy-tab">
        <div className="tab-header">
          <h3>🧘 Philosophy & Religion</h3>
          <p>Monitor spiritual practices, philosophical education, and interfaith harmony</p>
        </div>

        <div className="section">
          <h4>Spiritual & Philosophical Metrics</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">🕊️</div>
              <div className="metric-content">
                <div className="metric-title">Religious Diversity Index</div>
                <div className="metric-value">{religionAndPhilosophy.religiousDiversityIndex?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Variety of religious and spiritual practices</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🤝</div>
              <div className="metric-content">
                <div className="metric-title">Interfaith Harmony Index</div>
                <div className="metric-value">{religionAndPhilosophy.interfaithHarmonyIndex?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Peaceful coexistence between faiths</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🎓</div>
              <div className="metric-content">
                <div className="metric-title">Philosophical Education Level</div>
                <div className="metric-value">{religionAndPhilosophy.philosophicalEducationLevel?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Access to philosophical and ethical education</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">⚖️</div>
              <div className="metric-content">
                <div className="metric-title">Ethical Framework Development</div>
                <div className="metric-value">{religionAndPhilosophy.ethicalFrameworkDevelopment?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Development of moral and ethical systems</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderScienceTab = () => {
    if (!culturalData) return <div>No science data available</div>;

    const { scienceAndInnovation } = culturalData;

    return (
      <div className="science-tab">
        <div className="tab-header">
          <h3>🔬 Science & Innovation</h3>
          <p>Monitor scientific literacy, research quality, and innovation culture</p>
        </div>

        <div className="section">
          <h4>Science & Innovation Metrics</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">🧪</div>
              <div className="metric-content">
                <div className="metric-title">Scientific Literacy Rate</div>
                <div className="metric-value">{scienceAndInnovation.scientificLiteracyRate?.toFixed(1) || '0.0'}%</div>
                <div className="metric-description">Population understanding of scientific concepts</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🏫</div>
              <div className="metric-content">
                <div className="metric-title">Research Institution Quality</div>
                <div className="metric-value">{scienceAndInnovation.researchInstitutionQuality?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Quality of universities and research centers</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">💡</div>
              <div className="metric-content">
                <div className="metric-title">Innovation Culture Strength</div>
                <div className="metric-value">{scienceAndInnovation.innovationCultureStrength?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Cultural support for innovation and creativity</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🚀</div>
              <div className="metric-content">
                <div className="metric-title">Technology Adoption Rate</div>
                <div className="metric-value">{scienceAndInnovation.technologyAdoptionRate?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Speed of adopting new technologies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCulinaryTab = () => {
    if (!culturalData) return <div>No culinary data available</div>;

    const { culinaryAndLifestyle } = culturalData;

    return (
      <div className="culinary-tab">
        <div className="tab-header">
          <h3>🍽️ Culinary & Lifestyle</h3>
          <p>Monitor food culture, culinary diversity, and lifestyle practices</p>
        </div>

        <div className="section">
          <h4>Culinary & Lifestyle Metrics</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">🌮</div>
              <div className="metric-content">
                <div className="metric-title">Culinary Diversity Index</div>
                <div className="metric-value">{culinaryAndLifestyle.culinaryDiversityIndex?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Variety of cuisines and food traditions</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🍲</div>
              <div className="metric-content">
                <div className="metric-title">Food Culture Richness</div>
                <div className="metric-value">{culinaryAndLifestyle.foodCultureRichness?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Depth and richness of food traditions</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🌱</div>
              <div className="metric-content">
                <div className="metric-title">Sustainable Food Practices</div>
                <div className="metric-value">{culinaryAndLifestyle.sustainableFoodPractices?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Adoption of sustainable food production</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🍾</div>
              <div className="metric-content">
                <div className="metric-title">Culinary Innovation Index</div>
                <div className="metric-value">{culinaryAndLifestyle.culinaryInnovationIndex?.toFixed(1) || '0.0'}/100</div>
                <div className="metric-description">Innovation in culinary arts and techniques</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };



  if (loading) {
    return (
      <div className="entertainment-tourism-screen loading">
        <div className="loading-spinner"></div>
        <p>Loading cultural data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="entertainment-tourism-screen error">
        <div className="error-message">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button onClick={fetchCulturalData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="entertainment-tourism-screen">
      <div className="screen-header">
        <h2>🎭 Entertainment, Culture & Tourism</h2>
        <p>Comprehensive management of cultural development, entertainment industry, and tourism sector</p>
        {onClose && (
          <button className="close-button" onClick={onClose}>×</button>
        )}
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'cultural' ? 'active' : ''}`}
          onClick={() => setActiveTab('cultural')}
        >
          🏛️ Cultural
        </button>
        <button 
          className={`tab-button ${activeTab === 'entertainment' ? 'active' : ''}`}
          onClick={() => setActiveTab('entertainment')}
        >
          🎭 Entertainment
        </button>
        <button 
          className={`tab-button ${activeTab === 'tourism' ? 'active' : ''}`}
          onClick={() => setActiveTab('tourism')}
        >
          ✈️ Tourism
        </button>
        <button 
          className={`tab-button ${activeTab === 'economic' ? 'active' : ''}`}
          onClick={() => setActiveTab('economic')}
        >
          💰 Economic
        </button>
        <button 
          className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          👥 Social
        </button>
        <button 
          className={`tab-button ${activeTab === 'language' ? 'active' : ''}`}
          onClick={() => setActiveTab('language')}
        >
          📚 Language & Literature
        </button>
        <button 
          className={`tab-button ${activeTab === 'philosophy' ? 'active' : ''}`}
          onClick={() => setActiveTab('philosophy')}
        >
          🧘 Philosophy & Religion
        </button>
        <button 
          className={`tab-button ${activeTab === 'science' ? 'active' : ''}`}
          onClick={() => setActiveTab('science')}
        >
          🔬 Science & Innovation
        </button>
        <button 
          className={`tab-button ${activeTab === 'culinary' ? 'active' : ''}`}
          onClick={() => setActiveTab('culinary')}
        >
          🍽️ Culinary & Lifestyle
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'cultural' && renderCulturalTab()}
        {activeTab === 'entertainment' && renderEntertainmentTab()}
        {activeTab === 'tourism' && renderTourismTab()}
        {activeTab === 'economic' && renderEconomicTab()}
        {activeTab === 'social' && renderSocialTab()}
        {activeTab === 'language' && renderLanguageTab()}
        {activeTab === 'philosophy' && renderPhilosophyTab()}
        {activeTab === 'science' && renderScienceTab()}
        {activeTab === 'culinary' && renderCulinaryTab()}
      </div>
    </div>
  );
};

export default EntertainmentTourismScreen;
