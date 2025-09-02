import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './HealthScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface HealthSecretary {
  id: string;
  name: string;
  title: string;
  experience: number;
  specialization: string[];
  approval: number;
  availability: 'available' | 'busy' | 'unavailable';
  tenure: string;
  achievements: string[];
  background: string;
}

interface SurgeonGeneral {
  id: string;
  name: string;
  title: string;
  experience: number;
  specialization: string[];
  approval: number;
  availability: 'available' | 'busy' | 'unavailable';
  tenure: string;
  medicalBackground: string[];
  publicHealthInitiatives: string[];
}

interface PopulationHealthMetrics {
  lifeExpectancy: number;
  healthcareAccess: number;
  vaccinationRate: number;
  mentalHealthIndex: number;
  infantMortality: number;
  childVaccination: number;
  maternalHealthScore: number;
  elderCareQuality: number;
  chronicDiseaseRate: number;
  environmentalHealthScore: number;
}

interface ChronicDisease {
  id: string;
  name: string;
  prevalence: number;
  mortalityRate: number;
  treatmentCost: number;
  preventionPrograms: string[];
  affectedDemographics: string[];
  trends: 'increasing' | 'stable' | 'decreasing';
  researchFunding: number;
}

interface HealthcareFacility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'research_center' | 'emergency' | 'specialty';
  capacity: number;
  utilization: number;
  staffCount: number;
  specialties: string[];
  location: string;
  rating: number;
  budget: number;
  equipment: string[];
}

interface HealthPolicy {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'under_review' | 'approved' | 'implemented' | 'suspended';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  objectives: string[];
  targetPopulation: string;
  estimatedCost: number;
  expectedImpact: string;
  implementationDate: string;
  reviewDate: string;
}

interface HealthEmergency {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'monitoring' | 'responding' | 'contained' | 'resolved';
  affectedAreas: string[];
  casualties: number;
  responseTeams: number;
  resourcesDeployed: string[];
  startDate: string;
  description: string;
  actionsTaken: string[];
}

interface HealthWorkflow {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'completed' | 'suspended' | 'planning';
  participants: number;
  startDate: string;
  expectedCompletion: string;
  progress: number;
  description: string;
  steps: string[];
  outcomes: string[];
}

interface BudgetAllocation {
  category: string;
  amount: number;
  percentage: number;
  change: number;
  utilization: number;
  description: string;
}

interface HealthData {
  secretary: HealthSecretary | null;
  surgeonGeneral: SurgeonGeneral | null;
  populationMetrics: PopulationHealthMetrics;
  diseases: ChronicDisease[];
  facilities: HealthcareFacility[];
  policies: HealthPolicy[];
  emergencies: HealthEmergency[];
  workflows: HealthWorkflow[];
  budgetAllocations: BudgetAllocation[];
  budget: {
    hospitalFunding: number;
    researchFunding: number;
    preventionPrograms: number;
    emergencyResponse: number;
    mentalHealthServices: number;
  };
}

// Define tabs for the header (max 5 tabs)
const tabs: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'leadership', label: 'Leadership', icon: '👥' },
  { id: 'population', label: 'Diseases', icon: '🦠' },
  { id: 'infrastructure', label: 'Infrastructure', icon: '🏥' },
  { id: 'operations', label: 'Operations', icon: '⚙️' }
];

const HealthScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'leadership' | 'population' | 'infrastructure' | 'operations'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/health/overview', description: 'Get health overview data' },
    { method: 'GET', path: '/api/health/leadership', description: 'Get health leadership data' },
    { method: 'GET', path: '/api/health/population', description: 'Get population health data' },
    { method: 'GET', path: '/api/health/facilities', description: 'Get healthcare facilities data' },
    { method: 'GET', path: '/api/health/policies', description: 'Get health policies data' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responding': return '#ef4444';
      case 'contained': return '#fbbf24';
      case 'resolved': return '#4ade80';
      case 'monitoring': return '#22c55e';
      case 'available': return '#4ade80';
      case 'busy': return '#fbbf24';
      case 'unavailable': return '#f87171';
      case 'completed': return '#86efac';
      default: return '#4ade80';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#4ade80';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#4ade80';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return '#ef4444';
      case 'stable': return '#eab308';
      case 'decreasing': return '#22c55e';
      default: return '#4ade80';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const fetchHealthData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/health');
      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch health data:', err);
      // Use comprehensive mock data
      setHealthData({
        secretary: {
          id: 'sec-001',
          name: 'Dr. Sarah Johnson',
          title: 'Health Secretary',
          experience: 15,
          specialization: ['Public Health', 'Healthcare Policy', 'Emergency Response'],
          approval: 78,
          availability: 'available',
          tenure: '3 years, 2 months',
          achievements: [
            'Reduced infant mortality by 25%',
            'Implemented universal vaccination program',
            'Established 50 new rural clinics'
          ],
          background: 'Former Director of National Health Institute with 15 years of experience in public health administration.'
        },
        surgeonGeneral: {
          id: 'sg-001',
          name: 'Dr. Michael Chen',
          title: 'Surgeon General',
          experience: 20,
          specialization: ['Preventive Medicine', 'Epidemiology', 'Health Education'],
          approval: 82,
          availability: 'available',
          tenure: '2 years, 8 months',
          medicalBackground: [
            'MD from Harvard Medical School',
            'MPH in Epidemiology',
            'Board Certified in Preventive Medicine'
          ],
          publicHealthInitiatives: [
            'National Smoking Cessation Program',
            'Mental Health Awareness Campaign',
            'Obesity Prevention Initiative'
          ]
        },
        populationMetrics: {
          lifeExpectancy: 78.5,
          healthcareAccess: 94,
          vaccinationRate: 89,
          mentalHealthIndex: 72,
          infantMortality: 4.2,
          childVaccination: 92,
          maternalHealthScore: 85,
          elderCareQuality: 78,
          chronicDiseaseRate: 23,
          environmentalHealthScore: 81
        },
        diseases: [
          {
            id: 'dis-001',
            name: 'Cardiovascular Disease',
            prevalence: 28.5,
            mortalityRate: 15.2,
            treatmentCost: 8500000000,
            preventionPrograms: ['Heart Health Campaign', 'Exercise Programs', 'Diet Education'],
            affectedDemographics: ['Elderly', 'High-risk populations'],
            trends: 'decreasing',
            researchFunding: 1200000000
          },
          {
            id: 'dis-002',
            name: 'Diabetes',
            prevalence: 12.3,
            mortalityRate: 8.7,
            treatmentCost: 5200000000,
            preventionPrograms: ['Diabetes Prevention Program', 'Nutrition Education'],
            affectedDemographics: ['Adults 45+', 'Obese individuals'],
            trends: 'increasing',
            researchFunding: 850000000
          },
          {
            id: 'dis-003',
            name: 'Mental Health Disorders',
            prevalence: 18.9,
            mortalityRate: 2.1,
            treatmentCost: 3800000000,
            preventionPrograms: ['Mental Health Awareness', 'Crisis Hotlines'],
            affectedDemographics: ['All age groups'],
            trends: 'stable',
            researchFunding: 650000000
          },
          {
            id: 'dis-004',
            name: 'Cancer',
            prevalence: 6.2,
            mortalityRate: 12.5,
            treatmentCost: 12000000000,
            preventionPrograms: ['Early Detection Programs', 'Screening Campaigns'],
            affectedDemographics: ['Adults 50+', 'High-risk groups'],
            trends: 'stable',
            researchFunding: 2500000000
          },
          {
            id: 'dis-005',
            name: 'Respiratory Infections',
            prevalence: 8.7,
            mortalityRate: 1.8,
            treatmentCost: 2100000000,
            preventionPrograms: ['Vaccination Programs', 'Hygiene Education'],
            affectedDemographics: ['Children', 'Elderly', 'Immunocompromised'],
            trends: 'decreasing',
            researchFunding: 450000000
          },
          {
            id: 'dis-006',
            name: 'Infectious Diseases',
            prevalence: 3.4,
            mortalityRate: 0.5,
            treatmentCost: 800000000,
            preventionPrograms: ['Sanitation Programs', 'Vector Control'],
            affectedDemographics: ['All populations'],
            trends: 'decreasing',
            researchFunding: 300000000
          }
        ],
        facilities: [
          {
            id: 'fac-001',
            name: 'Central Medical Center',
            type: 'hospital',
            capacity: 500,
            utilization: 87,
            staffCount: 1200,
            specialties: ['Cardiology', 'Neurology', 'Emergency Medicine'],
            location: 'Capital City',
            rating: 4.8,
            budget: 85000000,
            equipment: ['MRI Machines', 'CT Scanners', 'Surgical Robots']
          },
          {
            id: 'fac-002',
            name: 'Community Health Clinic',
            type: 'clinic',
            capacity: 100,
            utilization: 92,
            staffCount: 45,
            specialties: ['Primary Care', 'Pediatrics', 'Women\'s Health'],
            location: 'Suburban District',
            rating: 4.2,
            budget: 12000000,
            equipment: ['X-Ray Machine', 'Lab Equipment', 'Vaccination Station']
          },
          {
            id: 'fac-003',
            name: 'Research Institute',
            type: 'research_center',
            capacity: 50,
            utilization: 95,
            staffCount: 200,
            specialties: ['Biomedical Research', 'Clinical Trials', 'Drug Development'],
            location: 'University District',
            rating: 4.9,
            budget: 25000000,
            equipment: ['Advanced Lab Equipment', 'Research Facilities', 'Clinical Trial Units']
          },
          {
            id: 'fac-004',
            name: 'Emergency Response Unit',
            type: 'emergency',
            capacity: 150,
            utilization: 78,
            staffCount: 300,
            specialties: ['Emergency Medicine', 'Trauma Care', 'Disaster Response'],
            location: 'Downtown',
            rating: 4.6,
            budget: 35000000,
            equipment: ['Emergency Vehicles', 'Trauma Units', 'Mobile Clinics']
          },
          {
            id: 'fac-005',
            name: 'Mental Health Center',
            type: 'specialty',
            capacity: 200,
            utilization: 85,
            staffCount: 150,
            specialties: ['Psychiatry', 'Psychology', 'Addiction Treatment'],
            location: 'Medical District',
            rating: 4.4,
            budget: 18000000,
            equipment: ['Therapy Rooms', 'Group Facilities', 'Crisis Units']
          }
        ],
        policies: [
          {
            id: 'pol-001',
            title: 'Universal Healthcare Coverage',
            category: 'Access',
            status: 'implemented',
            priority: 'high',
            description: 'Ensures all citizens have access to basic healthcare services',
            objectives: ['Reduce uninsured rate', 'Improve health outcomes', 'Lower healthcare costs'],
            targetPopulation: 'All citizens',
            estimatedCost: 45000000000,
            expectedImpact: 'Reduce mortality by 15%',
            implementationDate: '2023-01-15',
            reviewDate: '2024-06-15'
          },
          {
            id: 'pol-002',
            title: 'Mental Health Parity',
            category: 'Mental Health',
            status: 'under_review',
            priority: 'medium',
            description: 'Ensures mental health services are covered equally to physical health',
            objectives: ['Improve mental health access', 'Reduce stigma', 'Better outcomes'],
            targetPopulation: 'All insured individuals',
            estimatedCost: 8500000000,
            expectedImpact: 'Improve mental health index by 10%',
            implementationDate: '2024-03-01',
            reviewDate: '2024-09-01'
          },
          {
            id: 'pol-003',
            title: 'Preventive Care Initiative',
            category: 'Prevention',
            status: 'implemented',
            priority: 'high',
            description: 'Comprehensive preventive care program for all age groups',
            objectives: ['Increase vaccination rates', 'Improve screening', 'Reduce chronic disease'],
            targetPopulation: 'All citizens',
            estimatedCost: 18000000000,
            expectedImpact: 'Reduce chronic disease by 20%',
            implementationDate: '2023-06-01',
            reviewDate: '2024-12-01'
          },
          {
            id: 'pol-004',
            title: 'Emergency Response Enhancement',
            category: 'Emergency',
            status: 'implemented',
            priority: 'high',
            description: 'Enhanced emergency medical services and disaster response',
            objectives: ['Faster response times', 'Better coordination', 'Improved outcomes'],
            targetPopulation: 'All citizens',
            estimatedCost: 12000000000,
            expectedImpact: 'Reduce emergency mortality by 25%',
            implementationDate: '2023-09-01',
            reviewDate: '2024-09-01'
          },
          {
            id: 'pol-005',
            title: 'Research & Development Fund',
            category: 'Research',
            status: 'implemented',
            priority: 'medium',
            description: 'Increased funding for medical research and innovation',
            objectives: ['Advance treatments', 'Develop new drugs', 'Improve technology'],
            targetPopulation: 'Research community',
            estimatedCost: 25000000000,
            expectedImpact: 'Accelerate medical breakthroughs',
            implementationDate: '2023-03-01',
            reviewDate: '2025-03-01'
          }
        ],
        emergencies: [
          {
            id: 'emg-001',
            type: 'Infectious Disease Outbreak',
            severity: 'medium',
            status: 'contained',
            affectedAreas: ['Northern Region', 'Coastal Cities'],
            casualties: 45,
            responseTeams: 12,
            resourcesDeployed: ['Medical Teams', 'Quarantine Facilities', 'Vaccines'],
            startDate: '2024-01-10',
            description: 'Localized outbreak of respiratory virus',
            actionsTaken: ['Contact tracing', 'Vaccination campaign', 'Public awareness']
          }
        ],
        workflows: [
          {
            id: 'wf-001',
            name: 'Patient Care Coordination',
            type: 'Clinical',
            status: 'active',
            participants: 150,
            startDate: '2024-01-01',
            expectedCompletion: '2024-12-31',
            progress: 65,
            description: 'Streamline patient care across multiple facilities',
            steps: ['Assess current processes', 'Design new workflow', 'Implement changes', 'Monitor results'],
            outcomes: ['Reduced wait times', 'Better patient outcomes', 'Improved efficiency']
          }
        ],
        budgetAllocations: [
          {
            category: 'Hospital Services',
            amount: 45000000000,
            percentage: 45,
            change: 3.2,
            utilization: 87,
            description: 'Core hospital operations and emergency services'
          },
          {
            category: 'Preventive Care',
            amount: 18000000000,
            percentage: 18,
            change: 5.1,
            utilization: 92,
            description: 'Vaccination programs and health education'
          },
          {
            category: 'Research & Development',
            amount: 15000000000,
            percentage: 15,
            change: -1.2,
            utilization: 78,
            description: 'Medical research and clinical trials'
          },
          {
            category: 'Mental Health',
            amount: 12000000000,
            percentage: 12,
            change: 8.5,
            utilization: 85,
            description: 'Mental health services and crisis intervention'
          },
          {
            category: 'Emergency Response',
            amount: 10000000000,
            percentage: 10,
            change: 2.1,
            utilization: 91,
            description: 'Emergency medical services and disaster response'
          }
        ],
        budget: {
          hospitalFunding: 45000000000,
          researchFunding: 15000000000,
          preventionPrograms: 18000000000,
          emergencyResponse: 10000000000,
          mentalHealthServices: 12000000000
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  const renderOverview = () => (
    <>
      {/* Health Overview - First card in 2-column grid */}
      <div className="standard-panel social-theme">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Health Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div className="standard-metric">
            <span>Life Expectancy</span>
            <span className="standard-metric-value">{healthData?.populationMetrics?.lifeExpectancy || 0} years</span>
          </div>
          <div className="standard-metric">
            <span>Healthcare Access</span>
            <span className="standard-metric-value">{healthData?.populationMetrics?.healthcareAccess || 0}%</span>
          </div>
          <div className="standard-metric">
            <span>Vaccination Rate</span>
            <span className="standard-metric-value">{healthData?.populationMetrics?.vaccinationRate || 0}%</span>
          </div>
          <div className="standard-metric">
            <span>Mental Health Index</span>
            <span className="standard-metric-value">{healthData?.populationMetrics?.mentalHealthIndex || 0}/100</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Generate Health Report')}>Generate Report</button>
          <button className="standard-btn social-theme" onClick={() => console.log('View Analytics')}>View Analytics</button>
        </div>
      </div>

      {/* Health Progress Chart - Second card in 2-column grid */}
      <div className="standard-panel social-theme">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Health Trends</h3>
        <div className="chart-container">
          <LineChart
            data={[
              { label: '2019', value: (healthData?.populationMetrics?.lifeExpectancy || 0) - 2.5 },
              { label: '2020', value: (healthData?.populationMetrics?.lifeExpectancy || 0) - 2.0 },
              { label: '2021', value: (healthData?.populationMetrics?.lifeExpectancy || 0) - 1.5 },
              { label: '2022', value: (healthData?.populationMetrics?.lifeExpectancy || 0) - 1.0 },
              { label: '2023', value: (healthData?.populationMetrics?.lifeExpectancy || 0) - 0.5 },
              { label: '2024', value: healthData?.populationMetrics?.lifeExpectancy || 0 }
            ]}
            title="📈 Life Expectancy Trends"
            color="#10b981"
            height={250}
            width={400}
          />
        </div>
      </div>

      {/* Health Analytics - Full width below cards */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel social-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Health Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={[
                  { label: 'Hospitals', value: (healthData?.budget?.hospitalFunding || 0) / 1000000000, color: '#10b981' },
                  { label: 'Research', value: (healthData?.budget?.researchFunding || 0) / 1000000000, color: '#059669' },
                  { label: 'Prevention', value: (healthData?.budget?.preventionPrograms || 0) / 1000000000, color: '#34d399' },
                  { label: 'Emergency', value: (healthData?.budget?.emergencyResponse || 0) / 1000000000, color: '#fbbf24' },
                  { label: 'Mental Health', value: (healthData?.budget?.mentalHealthServices || 0) / 1000000000, color: '#f59e0b' }
                ]}
                title="💰 Healthcare Spending (Billions)"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={healthData?.diseases?.slice(0, 6).map((disease, index) => ({
                  label: disease.name,
                  value: disease.prevalence,
                  color: ['#10b981', '#059669', '#34d399', '#fbbf24', '#f59e0b', '#d97706'][index]
                })) || []}
                title="🦠 Disease Distribution"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderLeadership = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>👥 Health Leadership</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {/* Health Secretary */}
          <div className="standard-panel social-theme">
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>🎖️ Health Secretary</h4>
            {healthData?.secretary ? (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>{healthData.secretary.name}</strong>
                  <div>{healthData.secretary.title}</div>
                  <div>Experience: {healthData.secretary.experience} years</div>
                  <div>Tenure: {healthData.secretary.tenure}</div>
                  <div>Approval: {healthData.secretary.approval}%</div>
                  <div style={{ color: getStatusColor(healthData.secretary.availability) }}>
                    Status: {healthData.secretary.availability.toUpperCase()}
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Specializations:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {healthData.secretary.specialization.map((spec, i) => (
                      <span key={i} style={{ 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem', 
                        backgroundColor: '#10b981', 
                        color: 'white' 
                      }}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>Key Achievements:</strong>
                  <div style={{ marginTop: '0.5rem' }}>
                    {healthData.secretary.achievements.map((achievement, i) => (
                      <div key={i} style={{ marginBottom: '0.3rem' }}>✨ {achievement}</div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>No Health Secretary appointed</div>
            )}
          </div>

          {/* Surgeon General */}
          <div className="standard-panel social-theme">
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>👨‍⚕️ Surgeon General</h4>
            {healthData?.surgeonGeneral ? (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>{healthData.surgeonGeneral.name}</strong>
                  <div>{healthData.surgeonGeneral.title}</div>
                  <div>Experience: {healthData.surgeonGeneral.experience} years</div>
                  <div>Tenure: {healthData.surgeonGeneral.tenure}</div>
                  <div>Approval: {healthData.surgeonGeneral.approval}%</div>
                  <div style={{ color: getStatusColor(healthData.surgeonGeneral.availability) }}>
                    Status: {healthData.surgeonGeneral.availability.toUpperCase()}
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Medical Background:</strong>
                  <div style={{ marginTop: '0.5rem' }}>
                    {healthData.surgeonGeneral.medicalBackground.map((bg, i) => (
                      <div key={i} style={{ marginBottom: '0.3rem' }}>🎓 {bg}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>Public Health Initiatives:</strong>
                  <div style={{ marginTop: '0.5rem' }}>
                    {healthData.surgeonGeneral.publicHealthInitiatives.map((initiative, i) => (
                      <div key={i} style={{ marginBottom: '0.3rem' }}>🎯 {initiative}</div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>No Surgeon General appointed</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPopulation = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🦠 Diseases</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Update Population Data')}>Update Data</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Analyze Trends')}>Analyze Trends</button>
        </div>
        
        {/* Population Metrics */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Population Health Metrics</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="standard-metric">
            <span>Infant Mortality</span>
            <span className="standard-metric-value">{healthData?.populationMetrics?.infantMortality || 0}/1000</span>
          </div>
          <div className="standard-metric">
            <span>Child Vaccination</span>
            <span className="standard-metric-value">{healthData?.populationMetrics?.childVaccination || 0}%</span>
          </div>
          <div className="standard-metric">
            <span>Maternal Health</span>
            <span className="standard-metric-value">{healthData?.populationMetrics?.maternalHealthScore || 0}/100</span>
          </div>
          <div className="standard-metric">
            <span>Elder Care</span>
            <span className="standard-metric-value">{healthData?.populationMetrics?.elderCareQuality || 0}/100</span>
          </div>
          <div className="standard-metric">
            <span>Chronic Disease</span>
            <span className="standard-metric-value">{healthData?.populationMetrics?.chronicDiseaseRate || 0}%</span>
          </div>
          </div>
        </div>

        {/* Diseases Table */}
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Disease</th>
                <th>Prevalence</th>
                <th>Mortality Rate</th>
                <th>Treatment Cost</th>
                <th>Trend</th>
                <th>Research Funding</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {healthData?.diseases?.map((disease) => (
                <tr key={disease.id}>
                  <td><strong>{disease.name}</strong></td>
                  <td>{disease.prevalence}%</td>
                  <td>{disease.mortalityRate}%</td>
                  <td>{formatCurrency(disease.treatmentCost)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getTrendColor(disease.trends), 
                      color: 'white' 
                    }}>
                      {disease.trends.charAt(0).toUpperCase() + disease.trends.slice(1)}
                    </span>
                  </td>
                  <td>{formatCurrency(disease.researchFunding)}</td>
                  <td>
                    <button className="standard-btn social-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInfrastructure = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🏥 Healthcare Infrastructure</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Add Facility')}>Add Facility</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Update Infrastructure')}>Update Infrastructure</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Facility Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Utilization</th>
                <th>Staff</th>
                <th>Rating</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {healthData?.facilities?.map((facility) => (
                <tr key={facility.id}>
                  <td><strong>{facility.name}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: '#10b981', 
                      color: 'white' 
                    }}>
                      {facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}
                    </span>
                  </td>
                  <td>{facility.capacity}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '8px', 
                        backgroundColor: '#e0e0e0', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${facility.utilization}%`, 
                          height: '100%', 
                          backgroundColor: '#10b981'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem' }}>{facility.utilization}%</span>
                    </div>
                  </td>
                  <td>{facility.staffCount}</td>
                  <td>{facility.rating}/5</td>
                  <td>{formatCurrency(facility.budget)}</td>
                  <td>
                    <button className="standard-btn social-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOperations = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>⚙️ Health Operations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Create Policy')}>Create Policy</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Start Workflow')}>Start Workflow</button>
        </div>
        
        {/* Policies Table */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>📋 Health Policies</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Policy Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Estimated Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {healthData?.policies?.map((policy) => (
                  <tr key={policy.id}>
                    <td><strong>{policy.title}</strong></td>
                    <td>{policy.category}</td>
                    <td>
                      <span style={{ 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem', 
                        backgroundColor: policy.status === 'implemented' ? '#10b981' : '#fbbf24', 
                        color: 'white' 
                      }}>
                        {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem', 
                        backgroundColor: getPriorityColor(policy.priority), 
                        color: 'white' 
                      }}>
                        {policy.priority.charAt(0).toUpperCase() + policy.priority.slice(1)}
                      </span>
                    </td>
                    <td>{formatCurrency(policy.estimatedCost)}</td>
                    <td>
                      <button className="standard-btn social-theme">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Allocations */}
        <div>
          <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>💰 Budget Allocations</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Percentage</th>
                  <th>Change</th>
                  <th>Utilization</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {healthData?.budgetAllocations?.map((allocation, i) => (
                  <tr key={i}>
                    <td><strong>{allocation.category}</strong></td>
                    <td>{formatCurrency(allocation.amount)}</td>
                    <td>{allocation.percentage}%</td>
                    <td style={{ color: allocation.change >= 0 ? '#10b981' : '#ef4444' }}>
                      {allocation.change >= 0 ? '+' : ''}{allocation.change}%
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '60px', 
                          height: '8px', 
                          backgroundColor: '#e0e0e0', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${allocation.utilization}%`, 
                            height: '100%', 
                            backgroundColor: '#10b981'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '0.8rem' }}>{allocation.utilization}%</span>
                      </div>
                    </td>
                    <td>
                      <button className="standard-btn social-theme">Details</button>
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
      onRefresh={fetchHealthData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container social-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && healthData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'leadership' && renderLeadership()}
              {activeTab === 'population' && renderPopulation()}
              {activeTab === 'infrastructure' && renderInfrastructure()}
              {activeTab === 'operations' && renderOperations()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading health data...' : 
               error ? `Error: ${error}` : 
               'No health data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default HealthScreen;
