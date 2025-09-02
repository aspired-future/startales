import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './HealthScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface HealthMetrics {
  totalFacilities: number;
  totalStaff: number;
  lifeExpectancy: number;
  healthcareAccess: number;
  vaccinationRate: number;
  totalBudget: number;
  averageWaitTime: number;
  patientSatisfaction: number;
}

interface HealthLevel {
  level: string;
  facilities: number;
  staff: number;
  patients: number;
  budget: number;
  satisfaction: number;
  waitTime: string;
  description: string;
}

interface HealthcareFacility {
  id: string;
  name: string;
  type: string;
  publicPrivate: string;
  location: string;
  rating: number;
  capacity: number;
  staff: number;
  established: number;
  specializations: string[];
}

interface HealthProgram {
  level: string;
  programs: string[];
  requirements: string[];
  services: string[];
  outcomes: string[];
}

interface HealthData {
  metrics: HealthMetrics;
  levels: HealthLevel[];
  facilities: HealthcareFacility[];
  programs: HealthProgram[];
}

// Define tabs for the header (max 5 tabs)
const tabs: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'facilities', label: 'Facilities', icon: '🏥' },
  { id: 'programs', label: 'Programs', icon: '💊' },
  { id: 'analytics', label: 'Analytics', icon: '📈' }
];

const HealthScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'facilities' | 'programs' | 'analytics'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/health', description: 'Get health data' },
    { method: 'GET', path: '/api/health/facilities', description: 'Get healthcare facilities' },
    { method: 'GET', path: '/api/health/programs', description: 'Get health programs data' }
  ];

  const fetchHealthData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/health');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setHealthData(result.data);
        } else {
          throw new Error('API response format error');
        }
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch health data:', err);
      // Use comprehensive mock data
      setHealthData({
        metrics: {
          totalFacilities: 3456,
          totalStaff: 123456,
          lifeExpectancy: 82.3,
          healthcareAccess: 94.2,
          vaccinationRate: 96.8,
          totalBudget: 45678900000,
          averageWaitTime: 2.1,
          patientSatisfaction: 87.5
        },
        levels: [
          {
            level: 'Primary Care',
            facilities: 1245,
            staff: 45678,
            patients: 2345678,
            budget: 12345678000,
            satisfaction: 89.2,
            waitTime: '1.2 days',
            description: 'Basic healthcare services and preventive care'
          },
          {
            level: 'Specialized Care',
            facilities: 567,
            staff: 23456,
            patients: 567890,
            budget: 9876543000,
            satisfaction: 85.7,
            waitTime: '3.4 days',
            description: 'Specialized medical treatments and procedures'
          },
          {
            level: 'Emergency Services',
            facilities: 234,
            staff: 12345,
            patients: 123456,
            budget: 5678901000,
            satisfaction: 91.3,
            waitTime: '0.5 hours',
            description: 'Emergency medical care and trauma services'
          },
          {
            level: 'Mental Health',
            facilities: 234,
            staff: 8765,
            patients: 345678,
            budget: 3456789000,
            satisfaction: 83.1,
            waitTime: '2.8 days',
            description: 'Mental health and behavioral health services'
          }
        ],
        facilities: [
          {
            id: '1',
            name: 'Capital General Hospital',
            type: 'General Hospital',
            publicPrivate: 'Public',
            location: 'Capital City',
            rating: 4.8,
            capacity: 1200,
            staff: 850,
            established: 1985,
            specializations: ['Emergency Medicine', 'Cardiology', 'Oncology']
          },
          {
            id: '2',
            name: 'Metropolitan Medical Center',
            type: 'Specialty Hospital',
            publicPrivate: 'Private',
            location: 'Metropolitan Area',
            rating: 4.6,
            capacity: 800,
            staff: 650,
            established: 1992,
            specializations: ['Neurology', 'Orthopedics', 'Pediatrics']
          },
          {
            id: '3',
            name: 'Community Health Clinic',
            type: 'Primary Care',
            publicPrivate: 'Public',
            location: 'Suburban District',
            rating: 4.4,
            capacity: 200,
            staff: 45,
            established: 2005,
            specializations: ['Family Medicine', 'Preventive Care']
          },
          {
            id: '4',
            name: 'Regional Trauma Center',
            type: 'Emergency',
            publicPrivate: 'Public',
            location: 'Industrial Zone',
            rating: 4.9,
            capacity: 150,
            staff: 120,
            established: 1998,
            specializations: ['Trauma Surgery', 'Emergency Medicine']
          },
          {
            id: '5',
            name: 'Mental Health Institute',
            type: 'Mental Health',
            publicPrivate: 'Public',
            location: 'Rural Area',
            rating: 4.3,
            capacity: 300,
            staff: 180,
            established: 1975,
            specializations: ['Psychiatry', 'Addiction Treatment']
          }
        ],
        programs: [
          {
            level: 'Preventive Care',
            programs: ['Vaccination Programs', 'Health Screenings', 'Wellness Education'],
            requirements: ['Regular Check-ups', 'Immunization Records', 'Health Assessments'],
            services: ['Annual Physicals', 'Vaccinations', 'Health Counseling'],
            outcomes: ['Reduced Disease Incidence', 'Improved Public Health', 'Lower Healthcare Costs']
          },
          {
            level: 'Chronic Disease Management',
            programs: ['Diabetes Management', 'Cardiovascular Care', 'Cancer Prevention'],
            requirements: ['Diagnosis Confirmation', 'Treatment Plans', 'Regular Monitoring'],
            services: ['Specialized Care', 'Medication Management', 'Lifestyle Counseling'],
            outcomes: ['Improved Quality of Life', 'Reduced Complications', 'Better Disease Control']
          },
          {
            level: 'Emergency Response',
            programs: ['Emergency Medical Services', 'Disaster Response', 'Trauma Care'],
            requirements: ['24/7 Availability', 'Rapid Response Times', 'Specialized Training'],
            services: ['Emergency Transport', 'Critical Care', 'Disaster Relief'],
            outcomes: ['Reduced Mortality', 'Faster Recovery', 'Better Emergency Preparedness']
          },
          {
            level: 'Mental Health Services',
            programs: ['Counseling Services', 'Addiction Treatment', 'Crisis Intervention'],
            requirements: ['Professional Licensing', 'Confidentiality Protocols', 'Crisis Training'],
            services: ['Individual Therapy', 'Group Sessions', 'Medication Management'],
            outcomes: ['Improved Mental Health', 'Reduced Suicide Rates', 'Better Social Integration']
          }
        ]
      }
    );
    } catch (err) {
      setError('Using mock data - API not available');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderOverview = () => {
    if (!healthData) return null;
    
    return (
      <>
        {/* Key Metrics Grid */}
        <div className="standard-metrics-grid">
          <div className="standard-metric-card">
            <div className="metric-icon">🏥</div>
            <div className="metric-content">
              <div className="metric-value">{healthData.metrics.totalFacilities.toLocaleString()}</div>
              <div className="metric-label">Total Facilities</div>
            </div>
          </div>
          
          <div className="standard-metric-card">
            <div className="metric-icon">👨‍⚕️</div>
            <div className="metric-content">
              <div className="metric-value">{healthData.metrics.totalStaff.toLocaleString()}</div>
              <div className="metric-label">Healthcare Staff</div>
            </div>
          </div>

          <div className="standard-metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <div className="metric-value">{healthData.metrics.lifeExpectancy} years</div>
              <div className="metric-label">Life Expectancy</div>
            </div>
          </div>

          <div className="standard-metric-card">
            <div className="metric-icon">💉</div>
            <div className="metric-content">
              <div className="metric-value">{healthData.metrics.vaccinationRate}%</div>
              <div className="metric-label">Vaccination Rate</div>
            </div>
          </div>
          
          <div className="standard-metric-card">
            <div className="metric-icon">⏱️</div>
            <div className="metric-content">
              <div className="metric-value">{healthData.metrics.averageWaitTime} days</div>
              <div className="metric-label">Average Wait Time</div>
            </div>
          </div>

          <div className="standard-metric-card">
            <div className="metric-icon">😊</div>
            <div className="metric-content">
              <div className="metric-value">{healthData.metrics.patientSatisfaction}%</div>
              <div className="metric-label">Patient Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Healthcare Levels */}
        <div className="standard-section">
          <h3>Healthcare Levels</h3>
          <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                  <th>Level</th>
                  <th>Facilities</th>
                  <th>Staff</th>
                  <th>Patients</th>
                  <th>Budget</th>
                  <th>Satisfaction</th>
                  <th>Wait Time</th>
              </tr>
            </thead>
            <tbody>
                {healthData.levels.map((level, index) => (
                  <tr key={index}>
                    <td>{level.level}</td>
                    <td>{level.facilities.toLocaleString()}</td>
                    <td>{level.staff.toLocaleString()}</td>
                    <td>{level.patients.toLocaleString()}</td>
                    <td>{formatCurrency(level.budget)}</td>
                    <td>{level.satisfaction}%</td>
                    <td>{level.waitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
    );
  };

  const renderFacilities = () => {
    if (!healthData) return null;
    
    return (
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
              <th>Facility</th>
                <th>Type</th>
              <th>Location</th>
              <th>Rating</th>
                <th>Capacity</th>
                <th>Staff</th>
              <th>Established</th>
              <th>Specializations</th>
              </tr>
            </thead>
            <tbody>
            {healthData.facilities.map((facility) => (
                <tr key={facility.id}>
                <td>{facility.name}</td>
                <td>{facility.type}</td>
                <td>{facility.location}</td>
                <td>{facility.rating}/5.0</td>
                  <td>{facility.capacity}</td>
                <td>{facility.staff}</td>
                <td>{facility.established}</td>
                <td>{facility.specializations.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
  );
  };

  const renderPrograms = () => {
    if (!healthData) return null;
    
    return (
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
              <th>Program Level</th>
              <th>Programs</th>
              <th>Requirements</th>
              <th>Services</th>
              <th>Outcomes</th>
                </tr>
              </thead>
              <tbody>
            {healthData.programs.map((program, index) => (
              <tr key={index}>
                <td>{program.level}</td>
                <td>{program.programs.join(', ')}</td>
                <td>{program.requirements.join(', ')}</td>
                <td>{program.services.join(', ')}</td>
                <td>{program.outcomes.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
      </div>
    );
  };

  const renderAnalytics = () => {
    if (!healthData) return null;
    
    return (
      <>
        {/* Performance Metrics */}
        <div className="standard-section">
          <h3>Performance Metrics</h3>
          <div className="standard-metrics-grid">
            <div className="standard-metric-card">
              <div className="metric-icon">📈</div>
              <div className="metric-content">
                <div className="metric-value">{healthData.metrics.healthcareAccess}%</div>
                <div className="metric-label">Healthcare Access</div>
              </div>
            </div>
            
            <div className="standard-metric-card">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <div className="metric-value">{formatCurrency(healthData.metrics.totalBudget)}</div>
                <div className="metric-label">Total Budget</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="standard-section">
          <h3>Healthcare Distribution</h3>
          <div className="charts-grid">
            <div className="chart-container">
              <h4>Facility Types</h4>
              <PieChart
                data={[
                  { name: 'Primary Care', value: 1245 },
                  { name: 'Specialized', value: 567 },
                  { name: 'Emergency', value: 234 },
                  { name: 'Mental Health', value: 234 }
                ]}
                colors={['#4CAF50', '#2196F3', '#FF9800', '#9C27B0']}
              />
            </div>
            
            <div className="chart-container">
              <h4>Staff Distribution</h4>
              <BarChart
                data={healthData.levels.map(level => ({
                  name: level.level,
                  value: level.staff
                }))}
                colors={['#4CAF50']}
              />
            </div>
          </div>
        </div>

        {/* Comparative Analysis */}
        <div className="standard-section">
          <h3>Comparative Analysis</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Current</th>
                  <th>Target</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Life Expectancy</td>
                  <td>{healthData.metrics.lifeExpectancy} years</td>
                  <td>85.0 years</td>
                  <td>
                    <span className={`status-badge ${healthData.metrics.lifeExpectancy >= 85 ? 'success' : 'warning'}`}>
                      {healthData.metrics.lifeExpectancy >= 85 ? 'On Target' : 'Below Target'}
                    </span>
                    </td>
                </tr>
                <tr>
                  <td>Healthcare Access</td>
                  <td>{healthData.metrics.healthcareAccess}%</td>
                  <td>95.0%</td>
                  <td>
                    <span className={`status-badge ${healthData.metrics.healthcareAccess >= 95 ? 'success' : 'warning'}`}>
                      {healthData.metrics.healthcareAccess >= 95 ? 'On Target' : 'Below Target'}
                    </span>
                    </td>
                </tr>
                <tr>
                  <td>Vaccination Rate</td>
                  <td>{healthData.metrics.vaccinationRate}%</td>
                  <td>95.0%</td>
                    <td>
                    <span className={`status-badge ${healthData.metrics.vaccinationRate >= 95 ? 'success' : 'warning'}`}>
                      {healthData.metrics.vaccinationRate >= 95 ? 'On Target' : 'Below Target'}
                    </span>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
  );
  };

  const onTabChange = (tabId: string) => {
    setActiveTab(tabId as 'overview' | 'facilities' | 'programs' | 'analytics');
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      apiEndpoints={apiEndpoints}
      loading={loading}
      error={error}
    >
              {activeTab === 'overview' && renderOverview()}
      {activeTab === 'facilities' && renderFacilities()}
      {activeTab === 'programs' && renderPrograms()}
      {activeTab === 'analytics' && renderAnalytics()}
    </BaseScreen>
  );
};

export default HealthScreen;
