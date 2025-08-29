import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './EducationScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface EducationMetrics {
  totalStudents: number;
  totalInstitutions: number;
  totalTeachers: number;
  literacyRate: number;
  graduationRate: number;
  totalBudget: number;
  averageClassSize: number;
  teacherStudentRatio: number;
}

interface EducationLevel {
  level: string;
  students: number;
  institutions: number;
  teachers: number;
  budget: number;
  graduationRate: number;
  averageAge: string;
  description: string;
}

interface Institution {
  id: string;
  name: string;
  type: string;
  publicPrivate: string;
  location: string;
  rating: number;
  students: number;
  teachers: number;
  established: number;
  specializations: string[];
}

interface Curriculum {
  level: string;
  subjects: string[];
  requirements: string[];
  electives: string[];
  assessments: string[];
}

interface EducationData {
  metrics: EducationMetrics;
  levels: EducationLevel[];
  institutions: Institution[];
  curriculum: Curriculum[];
}

// Define tabs for the header (max 5 tabs)
const tabs: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'institutions', label: 'Institutions', icon: '🏫' },
  { id: 'curriculum', label: 'Curriculum', icon: '📚' },
  { id: 'analytics', label: 'Analytics', icon: '📈' }
];

const EducationScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [educationData, setEducationData] = useState<EducationData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'institutions' | 'curriculum' | 'analytics'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/education', description: 'Get education data' },
    { method: 'GET', path: '/api/education/institutions', description: 'Get educational institutions' },
    { method: 'GET', path: '/api/education/curriculum', description: 'Get curriculum data' }
  ];

  const fetchEducationData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/education');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setEducationData(result.data);
        } else {
          throw new Error('API response format error');
        }
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch education data:', err);
      // Use comprehensive mock data
      setEducationData({
        metrics: {
          totalStudents: 2456789,
          totalInstitutions: 12456,
          totalTeachers: 234567,
          literacyRate: 98.7,
          graduationRate: 94.2,
          totalBudget: 45600000000,
          averageClassSize: 22,
          teacherStudentRatio: 10.5
        },
        levels: [
          {
            level: 'Pre-K (Ages 3-5)',
            students: 157000,
            institutions: 2345,
            teachers: 12000,
            budget: 3200000000,
            graduationRate: 99.1,
            averageAge: '4 years',
            description: 'Early childhood education focusing on social skills, basic literacy, and cognitive development'
          },
          {
            level: 'Elementary (K-5)',
            students: 568000,
            institutions: 3456,
            teachers: 46000,
            budget: 8900000000,
            graduationRate: 98.5,
            averageAge: '8 years',
            description: 'Foundation education covering reading, writing, mathematics, science, and social studies'
          },
          {
            level: 'Middle School (6-8)',
            students: 456000,
            institutions: 2345,
            teachers: 38000,
            budget: 7200000000,
            graduationRate: 96.8,
            averageAge: '12 years',
            description: 'Transitional education with subject specialization and critical thinking development'
          },
          {
            level: 'High School (9-12)',
            students: 389000,
            institutions: 1890,
            teachers: 32000,
            budget: 6800000000,
            graduationRate: 94.2,
            averageAge: '16 years',
            description: 'Comprehensive secondary education with college and career preparation'
          },
          {
            level: 'Community College',
            students: 234000,
            institutions: 567,
            teachers: 12345,
            budget: 2300000000,
            graduationRate: 92.1,
            averageAge: '18-30 years',
            description: 'Specialized vocational training for specific trades and technical skills'
          }
        ],
        institutions: [
          {
            id: 'inst-1',
            name: 'Capital University',
            type: 'university',
            publicPrivate: 'Public',
            location: 'Capital City',
            rating: 9.2,
            students: 45678,
            teachers: 2345,
            established: 1895,
            specializations: ['Engineering', 'Medicine', 'Business', 'Arts']
          },
          {
            id: 'inst-2',
            name: 'Metropolitan Community College',
            type: 'community-college',
            publicPrivate: 'Public',
            location: 'Metro District',
            rating: 8.7,
            students: 23456,
            teachers: 1234,
            established: 1965,
            specializations: ['Technology', 'Healthcare', 'Business', 'Liberal Arts']
          },
          {
            id: 'inst-3',
            name: 'Stellar High School',
            type: 'high',
            publicPrivate: 'Public',
            location: 'Stellar District',
            rating: 8.9,
            students: 2345,
            teachers: 156,
            established: 1950,
            specializations: ['STEM', 'Arts', 'Athletics', 'College Prep']
          }
        ],
        curriculum: [
          {
            level: 'Elementary',
            subjects: ['Mathematics', 'Reading', 'Writing', 'Science', 'Social Studies', 'Physical Education', 'Arts'],
            requirements: ['Core Math', 'Language Arts', 'Basic Science', 'History', 'Physical Education'],
            electives: ['Music', 'Art', 'Computer Science', 'Foreign Language'],
            assessments: ['Standardized Testing', 'Portfolio Assessment', 'Teacher Evaluation']
          },
          {
            level: 'High School',
            subjects: ['Advanced Mathematics', 'Literature', 'Biology', 'Chemistry', 'Physics', 'History', 'Government', 'Economics'],
            requirements: ['Algebra I & II', 'English I-IV', 'Biology', 'Chemistry', 'US History', 'Government', 'Physical Education'],
            electives: ['Advanced Placement', 'International Baccalaureate', 'Career Technical Education', 'Fine Arts', 'Foreign Languages'],
            assessments: ['Standardized Testing', 'AP Exams', 'Portfolio Assessment', 'College Entrance Exams']
          }
        ]
      });
      setError('Using mock data - API not available');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducationData();
  }, [fetchEducationData]);

  const renderOverview = () => {
    if (!educationData) return null;
    
    return (
      <>
        {/* Education Overview - First card in 2-column grid */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Education Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="standard-metric">
              <span>Total Students</span>
              <span className="standard-metric-value">{(educationData.metrics.totalStudents / 1000000).toFixed(1)}M</span>
            </div>
            <div className="standard-metric">
              <span>Institutions</span>
              <span className="standard-metric-value">{(educationData.metrics.totalInstitutions / 1000).toFixed(1)}K</span>
            </div>
            <div className="standard-metric">
              <span>Graduation Rate</span>
              <span className="standard-metric-value">{educationData.metrics.graduationRate}%</span>
            </div>
            <div className="standard-metric">
              <span>Total Budget</span>
              <span className="standard-metric-value">${(educationData.metrics.totalBudget / 1000000000).toFixed(1)}B</span>
            </div>
          </div>
          <div className="standard-action-buttons">
            <button className="standard-btn social-theme" onClick={() => console.log('Generate Education Report')}>Generate Report</button>
            <button className="standard-btn social-theme" onClick={() => console.log('View Analytics')}>View Analytics</button>
          </div>
        </div>

        {/* Education Levels Overview - Second card in 2-column grid */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🎓 Education System Levels</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {educationData.levels.map((level, index) => (
              <div key={index} style={{ 
                padding: '1rem', 
                backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                borderRadius: '8px', 
                border: '1px solid rgba(16, 185, 129, 0.2)' 
              }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>{level.level}</h4>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>{level.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: '#a0a9ba' }}>Students:</span>
                    <span style={{ color: '#e0e6ed', marginLeft: '0.5rem' }}>{(level.students / 1000).toFixed(0)}K</span>
                  </div>
                  <div>
                    <span style={{ color: '#a0a9ba' }}>Institutions:</span>
                    <span style={{ color: '#e0e6ed', marginLeft: '0.5rem' }}>{level.institutions.toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ color: '#a0a9ba' }}>Teachers:</span>
                    <span style={{ color: '#e0e6ed', marginLeft: '0.5rem' }}>{(level.teachers / 1000).toFixed(0)}K</span>
                  </div>
                  <div>
                    <span style={{ color: '#a0a9ba' }}>Graduation Rate:</span>
                    <span style={{ color: '#e0e6ed', marginLeft: '0.5rem' }}>{level.graduationRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderInstitutions = () => {
    if (!educationData) return null;
    
    return (
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel social-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🏫 Educational Institutions</h3>
          <div className="standard-action-buttons">
            <button className="standard-btn social-theme" onClick={() => console.log('Refresh Institutions')}>Refresh Institutions</button>
            <button className="standard-btn social-theme" onClick={() => console.log('Add Institution')}>Add Institution</button>
          </div>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Sector</th>
                  <th>Location</th>
                  <th>Rating</th>
                  <th>Students</th>
                  <th>Teachers</th>
                  <th>Established</th>
                  <th>Specializations</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {educationData.institutions.map((institution) => (
                <tr key={institution.id}>
                  <td><strong>{institution.name}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#10b981',
                      color: 'white'
                    }}>
                      {institution.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: institution.publicPrivate === 'Public' ? '#4caf50' : '#ff9800',
                      color: 'white'
                    }}>
                      {institution.publicPrivate}
                    </span>
                  </td>
                  <td>📍 {institution.location}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>⭐</span>
                      <span>{institution.rating}</span>
                    </div>
                  </td>
                  <td>{institution.students.toLocaleString()}</td>
                  <td>{institution.teachers.toLocaleString()}</td>
                  <td>{institution.established}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                      {institution.specializations.slice(0, 2).map((spec, index) => (
                        <span key={index} style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981'
                        }}>
                          {spec}
                        </span>
                      ))}
                      {institution.specializations.length > 2 && (
                        <span style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981'
                        }}>
                          +{institution.specializations.length - 2}
                        </span>
                      )}
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
  );
  };

  const renderCurriculum = () => {
    if (!educationData) return null;
    
    return (
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel social-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📚 Curriculum Standards</h3>
          <div className="standard-action-buttons">
            <button className="standard-btn social-theme" onClick={() => console.log('Update Curriculum')}>Update Curriculum</button>
            <button className="standard-btn social-theme" onClick={() => console.log('Review Standards')}>Review Standards</button>
          </div>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Core Subjects</th>
                  <th>Requirements</th>
                  <th>Electives</th>
                  <th>Assessments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {educationData.curriculum.map((curr, index) => (
                <tr key={index}>
                  <td><strong>{curr.level}</strong></td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                      {curr.subjects.map((subject, idx) => (
                        <span key={idx} style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981'
                        }}>
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                      {curr.requirements.map((req, idx) => (
                        <span key={idx} style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          color: '#3b82f6'
                        }}>
                          {req}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                      {curr.electives.map((elective, idx) => (
                        <span key={idx} style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: 'rgba(168, 85, 247, 0.2)',
                          color: '#a855f7'
                        }}>
                          {elective}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                      {curr.assessments.map((assessment, idx) => (
                        <span key={idx} style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: 'rgba(245, 158, 11, 0.2)',
                          color: '#f59e0b'
                        }}>
                          {assessment}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button className="standard-btn social-theme">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  };

  const renderAnalytics = () => {
    if (!educationData) return null;
    
    return (
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel social-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Education Analytics</h3>
          <div className="standard-action-buttons">
            <button className="standard-btn social-theme" onClick={() => console.log('Generate Analytics Report')}>Generate Report</button>
            <button className="standard-btn social-theme" onClick={() => console.log('Export Data')}>Export Data</button>
          </div>
        
        {/* Performance Metrics */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Performance Metrics</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="standard-metric">
              <span>Student Achievement</span>
              <span className="standard-metric-value">87.3%</span>
            </div>
            <div className="standard-metric">
              <span>Teacher Satisfaction</span>
              <span className="standard-metric-value">8.4/10</span>
            </div>
            <div className="standard-metric">
              <span>Parent Engagement</span>
              <span className="standard-metric-value">76.8%</span>
            </div>
            <div className="standard-metric">
              <span>Technology Integration</span>
              <span className="standard-metric-value">92.1%</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div className="chart-container">
            <BarChart
              data={[
                { label: 'Student-Teacher Ratio', value: Math.round(educationData.metrics.totalStudents / educationData.metrics.totalTeachers), color: '#4ecdc4' },
                { label: 'Institutions per 100K', value: Math.round((educationData.metrics.totalInstitutions / educationData.metrics.totalStudents) * 100000), color: '#45b7aa' },
                { label: 'Teachers per 1K Students', value: Math.round((educationData.metrics.totalTeachers / educationData.metrics.totalStudents) * 1000), color: '#96ceb4' },
                { label: 'Budget per Student (K)', value: Math.round(educationData.metrics.totalBudget / educationData.metrics.totalStudents / 1000), color: '#feca57' }
              ]}
              title="📊 Education System Ratios"
              height={250}
              width={400}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <LineChart
              data={[
                { label: '2019', value: 89.2 },
                { label: '2020', value: 90.1 },
                { label: '2021', value: 91.3 },
                { label: '2022', value: 92.8 },
                { label: '2023', value: 94.1 },
                { label: '2024', value: 94.2 }
              ]}
              title="📈 Graduation Rate Progress"
              color="#10b981"
              height={250}
              width={400}
            />
          </div>
        </div>

        {/* Comparative Analysis */}
        <div>
          <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>🌍 Comparative Analysis</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Our System</th>
                  <th>Galactic Average</th>
                  <th>Best in Galaxy</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Literacy Rate</td>
                  <td><strong>98.7%</strong></td>
                  <td>94.2%</td>
                  <td>99.1%</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#4caf50',
                      color: 'white'
                    }}>
                      Excellent
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Graduation Rate</td>
                  <td><strong>94.2%</strong></td>
                  <td>89.7%</td>
                  <td>96.8%</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#4caf50',
                      color: 'white'
                    }}>
                      Excellent
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Teacher-Student Ratio</td>
                  <td><strong>1:22</strong></td>
                  <td>1:28</td>
                  <td>1:18</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#4caf50',
                      color: 'white'
                    }}>
                      Good
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Education Spending (% GDP)</td>
                  <td><strong>6.2%</strong></td>
                  <td>5.1%</td>
                  <td>7.8%</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#ff9800',
                      color: 'white'
                    }}>
                      Above Average
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchEducationData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'institutions' | 'curriculum' | 'analytics')}
    >
      <div className="standard-screen-container social-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && educationData && educationData.metrics.totalStudents > 0 ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'institutions' && renderInstitutions()}
              {activeTab === 'curriculum' && renderCurriculum()}
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
              {loading ? 'Loading education data...' : 
               error ? `Error: ${error}` : 
               'No education data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default EducationScreen;
