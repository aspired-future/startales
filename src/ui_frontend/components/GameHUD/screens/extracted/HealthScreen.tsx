import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './HealthScreen.css';
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

interface BudgetAllocation {
  category: string;
  amount: number;
  percentage: number;
  change: number;
  description: string;
  utilization: number;
}

interface HealthWorkflow {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  progress: number;
  participants: number;
  startDate: string;
  expectedCompletion: string;
  description: string;
  steps: string[];
  outcomes: string[];
}

interface HealthData {
  secretary: HealthSecretary | null;
  surgeonGeneral: SurgeonGeneral | null;
  populationMetrics: PopulationHealthMetrics;
  chronicDiseases: ChronicDisease[];
  facilities: HealthcareFacility[];
  policies: HealthPolicy[];
  emergencies: HealthEmergency[];
  budgetAllocations: BudgetAllocation[];
  workflows: HealthWorkflow[];
}

const HealthScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [activeTab, setActiveTab] = useState<'leadership' | 'population' | 'diseases' | 'infrastructure' | 'policies' | 'emergencies' | 'budget' | 'workflows'>('leadership');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/health/secretary', description: 'Get health secretary information' },
    { method: 'GET', path: '/api/health/surgeon-general', description: 'Get surgeon general information' },
    { method: 'GET', path: '/api/health/population', description: 'Get population health metrics' },
    { method: 'GET', path: '/api/health/diseases', description: 'Get chronic diseases data' },
    { method: 'GET', path: '/api/health/facilities', description: 'Get healthcare facilities' },
    { method: 'GET', path: '/api/health/policies', description: 'Get health policies' },
    { method: 'GET', path: '/api/health/emergencies', description: 'Get health emergencies' },
    { method: 'GET', path: '/api/health/budget', description: 'Get budget allocations' },
    { method: 'GET', path: '/api/health/workflows', description: 'Get health workflows' },
    { method: 'POST', path: '/api/health/secretary', description: 'Hire health secretary' },
    { method: 'POST', path: '/api/health/policy', description: 'Create health policy' },
    { method: 'PUT', path: '/api/health/emergency/:id', description: 'Update emergency status' },
    { method: 'DELETE', path: '/api/health/policy/:id', description: 'Remove health policy' }
  ];

  const fetchHealthData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        secretaryRes,
        surgeonRes,
        populationRes,
        diseasesRes,
        facilitiesRes,
        policiesRes,
        emergenciesRes,
        budgetRes,
        workflowsRes
      ] = await Promise.all([
        fetch('/api/health/secretary'),
        fetch('/api/health/surgeon-general'),
        fetch('/api/health/population'),
        fetch('/api/health/diseases'),
        fetch('/api/health/facilities'),
        fetch('/api/health/policies'),
        fetch('/api/health/emergencies'),
        fetch('/api/health/budget'),
        fetch('/api/health/workflows')
      ]);

      const [
        secretary,
        surgeon,
        population,
        diseases,
        facilities,
        policies,
        emergencies,
        budget,
        workflows
      ] = await Promise.all([
        secretaryRes.json(),
        surgeonRes.json(),
        populationRes.json(),
        diseasesRes.json(),
        facilitiesRes.json(),
        policiesRes.json(),
        emergenciesRes.json(),
        budgetRes.json(),
        workflowsRes.json()
      ]);

      setHealthData({
        secretary: secretary.secretary || generateMockSecretary(),
        surgeonGeneral: surgeon.surgeonGeneral || generateMockSurgeonGeneral(),
        populationMetrics: population.metrics || generateMockPopulationMetrics(),
        chronicDiseases: diseases.diseases || generateMockDiseases(),
        facilities: facilities.facilities || generateMockFacilities(),
        policies: policies.policies || generateMockPolicies(),
        emergencies: emergencies.emergencies || generateMockEmergencies(),
        budgetAllocations: budget.allocations || generateMockBudget(),
        workflows: workflows.workflows || generateMockWorkflows()
      });
    } catch (err) {
      console.error('Failed to fetch health data:', err);
      // Use mock data as fallback
      const mockDiseases = generateMockDiseases();
      const mockBudgetAllocations = generateMockBudget();
      
      // Create budget object with expected properties
      const mockBudget = {
        hospitalFunding: 8500000000,
        researchFunding: 2800000000,
        preventionPrograms: 3200000000,
        emergencyResponse: 2000000000,
        mentalHealthServices: 1800000000,
        administration: 1700000000
      };
      
      setHealthData({
        secretary: generateMockSecretary(),
        surgeonGeneral: generateMockSurgeonGeneral(),
        populationMetrics: generateMockPopulationMetrics(),
        chronicDiseases: mockDiseases,
        diseases: mockDiseases, // Add diseases alias for compatibility
        facilities: generateMockFacilities(),
        policies: generateMockPolicies(),
        emergencies: generateMockEmergencies(),
        budgetAllocations: mockBudgetAllocations,
        budget: mockBudget, // Add budget object with expected properties
        workflows: generateMockWorkflows()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  const generateMockSecretary = (): HealthSecretary => ({
    id: 'sec-1',
    name: 'Dr. Maria Rodriguez',
    title: 'Secretary of Health & Human Services',
    experience: 18,
    specialization: ['Public Health Policy', 'Healthcare Administration', 'Epidemiology'],
    approval: 82,
    availability: 'available',
    tenure: '2022-Present',
    achievements: ['Reduced healthcare costs by 15%', 'Improved vaccination rates by 25%', 'Launched Mental Health Initiative'],
    background: 'Former Chief Medical Officer at National Health Institute, MD from Johns Hopkins, MPH from Harvard'
  });

  const generateMockSurgeonGeneral = (): SurgeonGeneral => ({
    id: 'sg-1',
    name: 'Dr. James Chen',
    title: 'Surgeon General',
    experience: 22,
    specialization: ['Emergency Medicine', 'Public Health', 'Preventive Medicine'],
    approval: 78,
    availability: 'available',
    tenure: '2021-Present',
    medicalBackground: ['MD from Stanford Medical School', 'Residency in Emergency Medicine', '15 years clinical experience'],
    publicHealthInitiatives: ['National Fitness Campaign', 'Substance Abuse Prevention', 'Healthcare Equity Program']
  });

  const generateMockPopulationMetrics = (): PopulationHealthMetrics => ({
    lifeExpectancy: 82.5,
    healthcareAccess: 94.2,
    vaccinationRate: 89.7,
    mentalHealthIndex: 76.3,
    infantMortality: 3.2,
    childVaccination: 96.8,
    maternalHealthScore: 91.5,
    elderCareQuality: 87.4,
    chronicDiseaseRate: 23.6,
    environmentalHealthScore: 84.1
  });

  const generateMockDiseases = (): ChronicDisease[] => [
    {
      id: 'disease-1',
      name: 'Cardiovascular Disease',
      prevalence: 28.5,
      mortalityRate: 12.3,
      treatmentCost: 45000,
      preventionPrograms: ['Heart Healthy Initiative', 'Exercise Programs', 'Nutrition Education'],
      affectedDemographics: ['Adults 45+', 'High-stress occupations', 'Sedentary lifestyle'],
      trends: 'decreasing',
      researchFunding: 125000000
    },
    {
      id: 'disease-2',
      name: 'Diabetes Type 2',
      prevalence: 18.7,
      mortalityRate: 4.8,
      treatmentCost: 32000,
      preventionPrograms: ['Diabetes Prevention Program', 'Lifestyle Modification', 'Early Screening'],
      affectedDemographics: ['Adults 35+', 'Overweight individuals', 'Family history'],
      trends: 'stable',
      researchFunding: 89000000
    },
    {
      id: 'disease-3',
      name: 'Mental Health Disorders',
      prevalence: 22.1,
      mortalityRate: 2.1,
      treatmentCost: 28000,
      preventionPrograms: ['Mental Health Awareness', 'Stress Management', 'Community Support'],
      affectedDemographics: ['All age groups', 'High-stress environments', 'Social isolation'],
      trends: 'increasing',
      researchFunding: 67000000
    }
  ];

  const generateMockFacilities = (): HealthcareFacility[] => [
    {
      id: 'facility-1',
      name: 'Central Medical Center',
      type: 'hospital',
      capacity: 850,
      utilization: 78,
      staffCount: 2400,
      specialties: ['Cardiology', 'Neurology', 'Oncology', 'Emergency Medicine'],
      location: 'Downtown District',
      rating: 4.8,
      budget: 125000000,
      equipment: ['MRI Machines', 'CT Scanners', 'Surgical Robots', 'ICU Equipment']
    },
    {
      id: 'facility-2',
      name: 'Community Health Clinic Network',
      type: 'clinic',
      capacity: 450,
      utilization: 92,
      staffCount: 680,
      specialties: ['Primary Care', 'Pediatrics', 'Women\'s Health', 'Mental Health'],
      location: 'Multiple Locations',
      rating: 4.5,
      budget: 45000000,
      equipment: ['Digital X-Ray', 'Ultrasound', 'Laboratory Equipment', 'Telemedicine Setup']
    },
    {
      id: 'facility-3',
      name: 'Advanced Research Institute',
      type: 'research_center',
      capacity: 200,
      utilization: 85,
      staffCount: 320,
      specialties: ['Medical Research', 'Clinical Trials', 'Genetic Studies', 'Drug Development'],
      location: 'Research Park',
      rating: 4.9,
      budget: 78000000,
      equipment: ['Research Labs', 'Genetic Sequencers', 'Clinical Trial Facilities', 'Data Centers']
    }
  ];

  const generateMockPolicies = (): HealthPolicy[] => [
    {
      id: 'policy-1',
      title: 'Universal Healthcare Access Initiative',
      category: 'Healthcare Access',
      status: 'implemented',
      priority: 'critical',
      description: 'Comprehensive policy to ensure healthcare access for all citizens regardless of economic status',
      objectives: ['Expand insurance coverage', 'Reduce healthcare costs', 'Improve health outcomes'],
      targetPopulation: 'All citizens',
      estimatedCost: 2500000000,
      expectedImpact: 'Increase healthcare access by 15%, reduce medical bankruptcies by 40%',
      implementationDate: '2023-01-01',
      reviewDate: '2024-12-31'
    },
    {
      id: 'policy-2',
      title: 'Mental Health Support Program',
      category: 'Mental Health',
      status: 'approved',
      priority: 'high',
      description: 'Comprehensive mental health support including counseling, therapy, and crisis intervention',
      objectives: ['Increase mental health services', 'Reduce stigma', 'Improve crisis response'],
      targetPopulation: 'All age groups',
      estimatedCost: 890000000,
      expectedImpact: 'Reduce mental health crisis incidents by 30%, improve treatment access by 50%',
      implementationDate: '2024-03-01',
      reviewDate: '2025-03-01'
    }
  ];

  const generateMockEmergencies = (): HealthEmergency[] => [
    {
      id: 'emergency-1',
      type: 'Disease Outbreak',
      severity: 'medium',
      status: 'contained',
      affectedAreas: ['Northern District', 'Industrial Zone'],
      casualties: 23,
      responseTeams: 8,
      resourcesDeployed: ['Mobile Testing Units', 'Quarantine Facilities', 'Medical Personnel'],
      startDate: '2024-02-15',
      description: 'Localized outbreak of respiratory illness in industrial area',
      actionsTaken: ['Contact tracing', 'Quarantine measures', 'Mass testing', 'Treatment protocols']
    },
    {
      id: 'emergency-2',
      type: 'Natural Disaster Health Response',
      severity: 'high',
      status: 'responding',
      affectedAreas: ['Coastal Region', 'Rural Communities'],
      casualties: 156,
      responseTeams: 15,
      resourcesDeployed: ['Emergency Medical Teams', 'Field Hospitals', 'Medical Supplies', 'Evacuation Support'],
      startDate: '2024-02-20',
      description: 'Health response to severe flooding affecting multiple communities',
      actionsTaken: ['Emergency medical care', 'Evacuation assistance', 'Water safety testing', 'Disease prevention']
    }
  ];

  const generateMockBudget = (): BudgetAllocation[] => [
    { category: 'Hospital Operations', amount: 8500000000, percentage: 42.5, change: 3.2, description: 'Hospital funding and operations', utilization: 87 },
    { category: 'Public Health Programs', amount: 3200000000, percentage: 16, change: 8.5, description: 'Prevention and public health initiatives', utilization: 92 },
    { category: 'Research & Development', amount: 2800000000, percentage: 14, change: 12.1, description: 'Medical research and innovation', utilization: 78 },
    { category: 'Emergency Response', amount: 2000000000, percentage: 10, change: -2.3, description: 'Emergency preparedness and response', utilization: 65 },
    { category: 'Mental Health Services', amount: 1800000000, percentage: 9, change: 15.7, description: 'Mental health and substance abuse', utilization: 94 },
    { category: 'Administration', amount: 1700000000, percentage: 8.5, change: -1.8, description: 'Administrative costs and overhead', utilization: 82 }
  ];

  const generateMockWorkflows = (): HealthWorkflow[] => [
    {
      id: 'workflow-1',
      name: 'Annual Health Assessment Campaign',
      type: 'Public Health Initiative',
      status: 'active',
      progress: 65,
      participants: 2400,
      startDate: '2024-01-15',
      expectedCompletion: '2024-06-30',
      description: 'Comprehensive health screening and assessment program for all citizens',
      steps: ['Registration', 'Health Screening', 'Assessment', 'Follow-up Care', 'Data Analysis'],
      outcomes: ['Early disease detection', 'Health trend analysis', 'Preventive care recommendations']
    },
    {
      id: 'workflow-2',
      name: 'Emergency Response Protocol Update',
      type: 'Emergency Preparedness',
      status: 'active',
      progress: 42,
      participants: 180,
      startDate: '2024-02-01',
      expectedCompletion: '2024-05-15',
      description: 'Updating emergency response protocols based on recent experiences',
      steps: ['Protocol Review', 'Stakeholder Input', 'Draft Updates', 'Testing', 'Implementation'],
      outcomes: ['Improved response times', 'Better coordination', 'Enhanced preparedness']
    }
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
      case 'available':
      case 'implemented':
      case 'contained':
      case 'resolved': return '#4ade80';
      case 'approved':
      case 'responding':
      case 'monitoring': return '#22c55e';
      case 'under_review':
      case 'paused':
      case 'busy': return '#fbbf24';
      case 'draft':
      case 'suspended':
      case 'failed':
      case 'unavailable': return '#f87171';
      case 'completed': return '#86efac';
      default: return '#4ade80';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#4ade80';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#4ade80';
    }
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'increasing': return '#ef4444';
      case 'stable': return '#eab308';
      case 'decreasing': return '#22c55e';
      default: return '#4ade80';
    }
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatNumber = (value: number): string => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchHealthData}
    >
      <div className="health-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'leadership' ? 'active' : ''}`}
            onClick={() => setActiveTab('leadership')}
          >
            👥 Leadership
          </button>
          <button 
            className={`tab ${activeTab === 'population' ? 'active' : ''}`}
            onClick={() => setActiveTab('population')}
          >
            📊 Population
          </button>
          <button 
            className={`tab ${activeTab === 'diseases' ? 'active' : ''}`}
            onClick={() => setActiveTab('diseases')}
          >
            🦠 Diseases
          </button>
          <button 
            className={`tab ${activeTab === 'infrastructure' ? 'active' : ''}`}
            onClick={() => setActiveTab('infrastructure')}
          >
            🏥 Infrastructure
          </button>
          <button 
            className={`tab ${activeTab === 'policies' ? 'active' : ''}`}
            onClick={() => setActiveTab('policies')}
          >
            📋 Policies
          </button>
          <button 
            className={`tab ${activeTab === 'emergencies' ? 'active' : ''}`}
            onClick={() => setActiveTab('emergencies')}
          >
            🚨 Emergencies
          </button>
          <button 
            className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            💰 Budget
          </button>
          <button 
            className={`tab ${activeTab === 'workflows' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflows')}
          >
            ⚙️ Workflows
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading health data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && healthData && (
            <>
              {activeTab === 'leadership' && (
                <div className="leadership-tab">
                  <div className="leadership-grid">
                    <div className="leader-card">
                      <h4>🎖️ Health Secretary</h4>
                      {healthData.secretary ? (
                        <div className="leader-profile">
                          <div className="leader-name">{healthData.secretary.name}</div>
                          <div className="leader-title">{healthData.secretary.title}</div>
                          <div className="leader-details">
                            <div className="leader-experience">Experience: {healthData.secretary.experience} years</div>
                            <div className="leader-tenure">Tenure: {healthData.secretary.tenure}</div>
                            <div className="leader-approval">Approval: {healthData.secretary.approval}%</div>
                            <div className="leader-availability" style={{ color: getStatusColor(healthData.secretary.availability) }}>
                              Status: {healthData.secretary.availability.toUpperCase()}
                            </div>
                          </div>
                          <div className="leader-background">{healthData.secretary.background}</div>
                          <div className="leader-specializations">
                            <strong>Specializations:</strong>
                            <div className="specialization-tags">
                              {healthData.secretary.specialization.map((spec, i) => (
                                <span key={i} className="specialization-tag">{spec}</span>
                              ))}
                            </div>
                          </div>
                          <div className="leader-achievements">
                            <strong>Key Achievements:</strong>
                            <div className="achievements-list">
                              {healthData.secretary.achievements.map((achievement, i) => (
                                <div key={i} className="achievement-item">✨ {achievement}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="no-leader">No Health Secretary appointed</div>
                      )}
                    </div>

                    <div className="leader-card">
                      <h4>👨‍⚕️ Surgeon General</h4>
                      {healthData.surgeonGeneral ? (
                        <div className="leader-profile">
                          <div className="leader-name">{healthData.surgeonGeneral.name}</div>
                          <div className="leader-title">{healthData.surgeonGeneral.title}</div>
                          <div className="leader-details">
                            <div className="leader-experience">Experience: {healthData.surgeonGeneral.experience} years</div>
                            <div className="leader-tenure">Tenure: {healthData.surgeonGeneral.tenure}</div>
                            <div className="leader-approval">Approval: {healthData.surgeonGeneral.approval}%</div>
                            <div className="leader-availability" style={{ color: getStatusColor(healthData.surgeonGeneral.availability) }}>
                              Status: {healthData.surgeonGeneral.availability.toUpperCase()}
                            </div>
                          </div>
                          <div className="leader-medical-background">
                            <strong>Medical Background:</strong>
                            <div className="background-list">
                              {healthData.surgeonGeneral.medicalBackground.map((bg, i) => (
                                <div key={i} className="background-item">🎓 {bg}</div>
                              ))}
                            </div>
                          </div>
                          <div className="leader-initiatives">
                            <strong>Public Health Initiatives:</strong>
                            <div className="initiatives-list">
                              {healthData.surgeonGeneral.publicHealthInitiatives.map((initiative, i) => (
                                <div key={i} className="initiative-item">🎯 {initiative}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="no-leader">No Surgeon General appointed</div>
                      )}
                    </div>
                  </div>

                  {/* Health Charts Section */}
                  <div className="health-charts-section">
                    <div className="charts-grid">
                      <div className="chart-container">
                        <LineChart
                          data={[
                            { label: '2019', value: healthData.populationMetrics.lifeExpectancy - 2.5 },
                            { label: '2020', value: healthData.populationMetrics.lifeExpectancy - 2.0 },
                            { label: '2021', value: healthData.populationMetrics.lifeExpectancy - 1.5 },
                            { label: '2022', value: healthData.populationMetrics.lifeExpectancy - 1.0 },
                            { label: '2023', value: healthData.populationMetrics.lifeExpectancy - 0.5 },
                            { label: '2024', value: healthData.populationMetrics.lifeExpectancy }
                          ]}
                          title="📈 Health Metrics Trends (Life Expectancy)"
                          color="#4ecdc4"
                          height={250}
                          width={400}
                        />
                      </div>

                      <div className="chart-container">
                        <PieChart
                          data={healthData.diseases.slice(0, 6).map((disease, index) => ({
                            label: disease.name,
                            value: disease.prevalence,
                            color: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'][index]
                          }))}
                          title="🦠 Disease Distribution"
                          size={200}
                          showLegend={true}
                        />
                      </div>

                      <div className="chart-container">
                        <BarChart
                          data={[
                            { label: 'Hospitals', value: healthData.budget.hospitalFunding / 1000000000, color: '#4ecdc4' },
                            { label: 'Research', value: healthData.budget.researchFunding / 1000000000, color: '#45b7aa' },
                            { label: 'Prevention', value: healthData.budget.preventionPrograms / 1000000000, color: '#96ceb4' },
                            { label: 'Emergency', value: healthData.budget.emergencyResponse / 1000000000, color: '#feca57' },
                            { label: 'Mental Health', value: healthData.budget.mentalHealthServices / 1000000000, color: '#ff9ff3' }
                          ]}
                          title="💰 Healthcare Spending (Billions)"
                          height={250}
                          width={400}
                          showTooltip={true}
                        />
                      </div>

                      <div className="chart-container">
                        <LineChart
                          data={[
                            { label: 'Jan', value: healthData.populationMetrics.infantMortality + 0.8 },
                            { label: 'Feb', value: healthData.populationMetrics.infantMortality + 0.6 },
                            { label: 'Mar', value: healthData.populationMetrics.infantMortality + 0.4 },
                            { label: 'Apr', value: healthData.populationMetrics.infantMortality + 0.2 },
                            { label: 'May', value: healthData.populationMetrics.infantMortality + 0.1 },
                            { label: 'Jun', value: healthData.populationMetrics.infantMortality }
                          ]}
                          title="👶 Infant Mortality Trends"
                          color="#ff6b6b"
                          height={250}
                          width={400}
                        />
                      </div>

                      <div className="chart-container">
                        <PieChart
                          data={[
                            { label: 'Excellent', value: 35, color: '#4ecdc4' },
                            { label: 'Good', value: 40, color: '#45b7aa' },
                            { label: 'Fair', value: 20, color: '#feca57' },
                            { label: 'Poor', value: 5, color: '#ff6b6b' }
                          ]}
                          title="🏥 Healthcare Quality Distribution"
                          size={200}
                          showLegend={true}
                        />
                      </div>

                      <div className="chart-container">
                        <BarChart
                          data={[
                            { label: 'Vaccination Rate', value: healthData.populationMetrics.vaccinationRate, color: '#4ecdc4' },
                            { label: 'Health Insurance', value: 87.5, color: '#45b7aa' },
                            { label: 'Preventive Care', value: 72.3, color: '#96ceb4' },
                            { label: 'Mental Health Access', value: 68.9, color: '#feca57' }
                          ]}
                          title="📊 Health Coverage Metrics (%)"
                          height={250}
                          width={400}
                          showTooltip={true}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tab-actions">
                    <button className="action-btn">Hire Secretary</button>
                    <button className="action-btn secondary">Hire Surgeon General</button>
                    <button className="action-btn">Schedule Meeting</button>
                    <button className="action-btn secondary">Performance Review</button>
                  </div>
                </div>
              )}

              {activeTab === 'population' && (
                <div className="population-tab">
                  <div className="population-metrics">
                    <div className="metric-card">
                      <div className="metric-value">{healthData.populationMetrics.lifeExpectancy}</div>
                      <div className="metric-label">Life Expectancy (years)</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{healthData.populationMetrics.healthcareAccess}%</div>
                      <div className="metric-label">Healthcare Access</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{healthData.populationMetrics.vaccinationRate}%</div>
                      <div className="metric-label">Vaccination Rate</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{healthData.populationMetrics.mentalHealthIndex}</div>
                      <div className="metric-label">Mental Health Index</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{healthData.populationMetrics.infantMortality}</div>
                      <div className="metric-label">Infant Mortality (per 1000)</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{healthData.populationMetrics.childVaccination}%</div>
                      <div className="metric-label">Child Vaccination</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{healthData.populationMetrics.maternalHealthScore}</div>
                      <div className="metric-label">Maternal Health Score</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{healthData.populationMetrics.elderCareQuality}</div>
                      <div className="metric-label">Elder Care Quality</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{healthData.populationMetrics.chronicDiseaseRate}%</div>
                      <div className="metric-label">Chronic Disease Rate</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{healthData.populationMetrics.environmentalHealthScore}</div>
                      <div className="metric-label">Environmental Health</div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Health Survey</button>
                    <button className="action-btn secondary">Screening Program</button>
                    <button className="action-btn">Health Report</button>
                  </div>
                </div>
              )}

              {activeTab === 'diseases' && (
                <div className="diseases-tab">
                  <div className="diseases-grid">
                    {healthData.chronicDiseases.map((disease) => (
                      <div key={disease.id} className="disease-item">
                        <div className="disease-header">
                          <div className="disease-name">{disease.name}</div>
                          <div className="disease-trend" style={{ color: getTrendColor(disease.trends) }}>
                            {disease.trends.toUpperCase()}
                          </div>
                        </div>
                        <div className="disease-stats">
                          <div className="disease-prevalence">Prevalence: {disease.prevalence}%</div>
                          <div className="disease-mortality">Mortality Rate: {disease.mortalityRate}%</div>
                          <div className="disease-cost">Treatment Cost: {formatCurrency(disease.treatmentCost)}</div>
                          <div className="disease-funding">Research Funding: {formatCurrency(disease.researchFunding)}</div>
                        </div>
                        <div className="disease-demographics">
                          <strong>Affected Demographics:</strong>
                          <div className="demographics-list">
                            {disease.affectedDemographics.map((demo, i) => (
                              <span key={i} className="demographic-tag">{demo}</span>
                            ))}
                          </div>
                        </div>
                        <div className="disease-programs">
                          <strong>Prevention Programs:</strong>
                          <div className="programs-list">
                            {disease.preventionPrograms.map((program, i) => (
                              <div key={i} className="program-item">🎯 {program}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Disease Surveillance</button>
                    <button className="action-btn secondary">Prevention Campaign</button>
                    <button className="action-btn">Research Initiative</button>
                  </div>
                </div>
              )}

              {activeTab === 'infrastructure' && (
                <div className="infrastructure-tab">
                  <div className="facilities-grid">
                    {healthData.facilities.map((facility) => (
                      <div key={facility.id} className="facility-item">
                        <div className="facility-header">
                          <div className="facility-name">{facility.name}</div>
                          <div className="facility-rating">⭐ {facility.rating}</div>
                        </div>
                        <div className="facility-details">
                          <div className="facility-type">{facility.type.toUpperCase()}</div>
                          <div className="facility-location">📍 {facility.location}</div>
                          <div className="facility-capacity">Capacity: {facility.capacity} beds</div>
                          <div className="facility-utilization">Utilization: {facility.utilization}%</div>
                          <div className="facility-staff">Staff: {formatNumber(facility.staffCount)}</div>
                          <div className="facility-budget">Budget: {formatCurrency(facility.budget)}</div>
                        </div>
                        <div className="facility-utilization-bar">
                          <div className="utilization-fill" style={{ width: `${facility.utilization}%` }}></div>
                        </div>
                        <div className="facility-specialties">
                          <strong>Specialties:</strong>
                          <div className="specialties-list">
                            {facility.specialties.map((specialty, i) => (
                              <span key={i} className="specialty-tag">{specialty}</span>
                            ))}
                          </div>
                        </div>
                        <div className="facility-equipment">
                          <strong>Key Equipment:</strong>
                          <div className="equipment-list">
                            {facility.equipment.map((equipment, i) => (
                              <div key={i} className="equipment-item">🔧 {equipment}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Build Facility</button>
                    <button className="action-btn secondary">Upgrade Equipment</button>
                    <button className="action-btn">Capacity Planning</button>
                  </div>
                </div>
              )}

              {activeTab === 'policies' && (
                <div className="policies-tab">
                  <div className="policies-grid">
                    {healthData.policies.map((policy) => (
                      <div key={policy.id} className="policy-item">
                        <div className="policy-header">
                          <div className="policy-title">{policy.title}</div>
                          <div className="policy-priority" style={{ color: getPriorityColor(policy.priority) }}>
                            {policy.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="policy-details">
                          <div className="policy-category">{policy.category}</div>
                          <div className="policy-status" style={{ color: getStatusColor(policy.status) }}>
                            Status: {policy.status.toUpperCase()}
                          </div>
                          <div className="policy-target">Target: {policy.targetPopulation}</div>
                          <div className="policy-cost">Cost: {formatCurrency(policy.estimatedCost)}</div>
                          <div className="policy-dates">
                            Implementation: {new Date(policy.implementationDate).toLocaleDateString()}
                          </div>
                          <div className="policy-review">
                            Review: {new Date(policy.reviewDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="policy-description">{policy.description}</div>
                        <div className="policy-objectives">
                          <strong>Objectives:</strong>
                          <div className="objectives-list">
                            {policy.objectives.map((objective, i) => (
                              <div key={i} className="objective-item">🎯 {objective}</div>
                            ))}
                          </div>
                        </div>
                        <div className="policy-impact">
                          <strong>Expected Impact:</strong> {policy.expectedImpact}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Create Policy</button>
                    <button className="action-btn secondary">Policy Review</button>
                    <button className="action-btn">Impact Assessment</button>
                  </div>
                </div>
              )}

              {activeTab === 'emergencies' && (
                <div className="emergencies-tab">
                  <div className="emergencies-grid">
                    {healthData.emergencies.map((emergency) => (
                      <div key={emergency.id} className="emergency-item">
                        <div className="emergency-header">
                          <div className="emergency-type">{emergency.type}</div>
                          <div className="emergency-severity" style={{ color: getSeverityColor(emergency.severity) }}>
                            {emergency.severity.toUpperCase()}
                          </div>
                        </div>
                        <div className="emergency-details">
                          <div className="emergency-status" style={{ color: getStatusColor(emergency.status) }}>
                            Status: {emergency.status.toUpperCase()}
                          </div>
                          <div className="emergency-casualties">Casualties: {emergency.casualties}</div>
                          <div className="emergency-teams">Response Teams: {emergency.responseTeams}</div>
                          <div className="emergency-start">Started: {new Date(emergency.startDate).toLocaleDateString()}</div>
                        </div>
                        <div className="emergency-description">{emergency.description}</div>
                        <div className="emergency-areas">
                          <strong>Affected Areas:</strong>
                          <div className="areas-list">
                            {emergency.affectedAreas.map((area, i) => (
                              <span key={i} className="area-tag">{area}</span>
                            ))}
                          </div>
                        </div>
                        <div className="emergency-resources">
                          <strong>Resources Deployed:</strong>
                          <div className="resources-list">
                            {emergency.resourcesDeployed.map((resource, i) => (
                              <div key={i} className="resource-item">🚑 {resource}</div>
                            ))}
                          </div>
                        </div>
                        <div className="emergency-actions">
                          <strong>Actions Taken:</strong>
                          <div className="actions-list">
                            {emergency.actionsTaken.map((action, i) => (
                              <div key={i} className="action-item">✅ {action}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn urgent">Emergency Response</button>
                    <button className="action-btn secondary">Deploy Resources</button>
                    <button className="action-btn">Status Update</button>
                  </div>
                </div>
              )}

              {activeTab === 'budget' && (
                <div className="budget-tab">
                  <div className="budget-overview">
                    <div className="budget-total">
                      <div className="total-value">{formatCurrency(healthData.budgetAllocations.reduce((sum, alloc) => sum + alloc.amount, 0))}</div>
                      <div className="total-label">Total Health Budget</div>
                    </div>
                  </div>
                  <div className="budget-allocations">
                    {healthData.budgetAllocations.map((allocation, i) => (
                      <div key={i} className="allocation-item">
                        <div className="allocation-header">
                          <div className="allocation-category">{allocation.category}</div>
                          <div className="allocation-amount">{formatCurrency(allocation.amount)}</div>
                        </div>
                        <div className="allocation-details">
                          <div className="allocation-percentage">{allocation.percentage}% of total budget</div>
                          <div className="allocation-change" style={{ color: allocation.change >= 0 ? '#4ade80' : '#ef4444' }}>
                            {allocation.change >= 0 ? '+' : ''}{allocation.change}% from last year
                          </div>
                          <div className="allocation-utilization">Utilization: {allocation.utilization}%</div>
                        </div>
                        <div className="allocation-bar">
                          <div className="allocation-fill" style={{ width: `${allocation.percentage}%` }}></div>
                        </div>
                        <div className="utilization-bar">
                          <div className="utilization-fill" style={{ width: `${allocation.utilization}%` }}></div>
                        </div>
                        <div className="allocation-description">{allocation.description}</div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Budget Analysis</button>
                    <button className="action-btn secondary">Reallocate Funds</button>
                    <button className="action-btn">Financial Report</button>
                  </div>
                </div>
              )}

              {activeTab === 'workflows' && (
                <div className="workflows-tab">
                  <div className="workflows-grid">
                    {healthData.workflows.map((workflow) => (
                      <div key={workflow.id} className="workflow-item">
                        <div className="workflow-header">
                          <div className="workflow-name">{workflow.name}</div>
                          <div className="workflow-status" style={{ color: getStatusColor(workflow.status) }}>
                            {workflow.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="workflow-details">
                          <div className="workflow-type">{workflow.type}</div>
                          <div className="workflow-participants">Participants: {workflow.participants}</div>
                          <div className="workflow-dates">
                            {new Date(workflow.startDate).toLocaleDateString()} - {new Date(workflow.expectedCompletion).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="workflow-progress">
                          <div className="progress-header">
                            <span>Progress: {workflow.progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${workflow.progress}%` }}></div>
                          </div>
                        </div>
                        <div className="workflow-description">{workflow.description}</div>
                        <div className="workflow-steps">
                          <strong>Steps:</strong>
                          <div className="steps-list">
                            {workflow.steps.map((step, i) => (
                              <div key={i} className="step-item">📋 {step}</div>
                            ))}
                          </div>
                        </div>
                        <div className="workflow-outcomes">
                          <strong>Expected Outcomes:</strong>
                          <div className="outcomes-list">
                            {workflow.outcomes.map((outcome, i) => (
                              <div key={i} className="outcome-item">🎯 {outcome}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Start Workflow</button>
                    <button className="action-btn secondary">Monitor Progress</button>
                    <button className="action-btn">Workflow Report</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default HealthScreen;
