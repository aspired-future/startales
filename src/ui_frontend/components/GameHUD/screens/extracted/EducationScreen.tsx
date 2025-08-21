import React, { useState, useEffect } from 'react';
import './EducationScreen.css';

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
  type: 'pre-k' | 'elementary' | 'middle' | 'high' | 'community-college' | 'university' | 'trade-school' | 'vocational';
  students: number;
  teachers: number;
  location: string;
  rating: number;
  specializations: string[];
  established: number;
  publicPrivate: 'public' | 'private';
}

interface Curriculum {
  level: string;
  subjects: string[];
  coreRequirements: string[];
  electiveOptions: string[];
  assessmentMethods: string[];
  graduationRequirements: string;
}

interface Teacher {
  id: string;
  name: string;
  level: string;
  subjects: string[];
  experience: number;
  qualifications: string[];
  rating: number;
  institution: string;
}

const EducationScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [educationData, setEducationData] = useState({
    metrics: {} as EducationMetrics,
    levels: [] as EducationLevel[],
    institutions: [] as Institution[],
    curriculum: [] as Curriculum[],
    teachers: [] as Teacher[]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEducationData();
  }, []);

  const fetchEducationData = async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/education');
      if (response.ok) {
        const data = await response.json();
        setEducationData(data);
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
          teacherStudentRatio: 1.2
        },
        levels: [
          {
            level: 'Pre-K (Ages 3-5)',
            students: 156789,
            institutions: 2345,
            teachers: 12456,
            budget: 2300000000,
            graduationRate: 99.1,
            averageAge: '4 years',
            description: 'Early childhood education focusing on social skills, basic literacy, and cognitive development'
          },
          {
            level: 'Elementary (K-5)',
            students: 567890,
            institutions: 3456,
            teachers: 45678,
            budget: 8900000000,
            graduationRate: 98.5,
            averageAge: '6-11 years',
            description: 'Foundation education covering reading, writing, mathematics, science, and social studies'
          },
          {
            level: 'Middle School (6-8)',
            students: 345678,
            institutions: 1789,
            teachers: 34567,
            budget: 6700000000,
            graduationRate: 96.8,
            averageAge: '12-14 years',
            description: 'Transitional education with specialized subjects and preparation for high school'
          },
          {
            level: 'High School (9-12)',
            students: 456789,
            institutions: 2134,
            teachers: 56789,
            budget: 12300000000,
            graduationRate: 94.2,
            averageAge: '15-18 years',
            description: 'Advanced secondary education with college prep, career tracks, and specialized programs'
          },
          {
            level: 'Community Colleges',
            students: 234567,
            institutions: 456,
            teachers: 23456,
            budget: 4500000000,
            graduationRate: 87.3,
            averageAge: '19-25 years',
            description: 'Two-year institutions offering associate degrees, certificates, and transfer programs'
          },
          {
            level: 'Universities',
            students: 456789,
            institutions: 234,
            teachers: 45678,
            budget: 15600000000,
            graduationRate: 89.7,
            averageAge: '18-22 years',
            description: 'Four-year institutions offering bachelor\'s, master\'s, and doctoral degrees'
          },
          {
            level: 'Trade Schools',
            students: 123456,
            institutions: 567,
            teachers: 12345,
            budget: 2800000000,
            graduationRate: 92.1,
            averageAge: '18-35 years',
            description: 'Specialized training in skilled trades, crafts, and technical professions'
          },
          {
            level: 'Vocational Training',
            students: 89012,
            institutions: 345,
            teachers: 8901,
            budget: 1900000000,
            graduationRate: 88.9,
            averageAge: '20-40 years',
            description: 'Professional certification and skill development programs'
          }
        ],
        institutions: [
          {
            id: 'inst-001',
            name: 'Zephyrian Elementary Academy',
            type: 'elementary',
            students: 567,
            teachers: 34,
            location: 'New Zephyr City',
            rating: 9.2,
            specializations: ['STEM', 'Arts', 'Language Immersion'],
            established: 2387,
            publicPrivate: 'public'
          },
          {
            id: 'inst-002',
            name: 'Imperial High School of Sciences',
            type: 'high',
            students: 1234,
            teachers: 89,
            location: 'Capital District',
            rating: 9.8,
            specializations: ['Advanced Sciences', 'Engineering Prep', 'Research Methods'],
            established: 2356,
            publicPrivate: 'public'
          },
          {
            id: 'inst-003',
            name: 'Galactic University',
            type: 'university',
            students: 23456,
            teachers: 1234,
            location: 'University City',
            rating: 9.5,
            specializations: ['Liberal Arts', 'Business Administration', 'Education', 'Social Sciences'],
            established: 2298,
            publicPrivate: 'public'
          },
          {
            id: 'inst-004',
            name: 'Starship Technical Institute',
            type: 'trade-school',
            students: 890,
            teachers: 67,
            location: 'Shipyard District',
            rating: 9.1,
            specializations: ['Starship Maintenance', 'Propulsion Systems', 'Navigation Technology'],
            established: 2401,
            publicPrivate: 'private'
          },
          {
            id: 'inst-005',
            name: 'Colonial Community College',
            type: 'community-college',
            students: 3456,
            teachers: 234,
            location: 'Frontier Settlement',
            rating: 8.7,
            specializations: ['Agricultural Sciences', 'Basic Engineering', 'Colonial Administration'],
            established: 2423,
            publicPrivate: 'public'
          },
          {
            id: 'inst-006',
            name: 'Little Stars Pre-K Center',
            type: 'pre-k',
            students: 123,
            teachers: 18,
            location: 'Residential District',
            rating: 9.0,
            specializations: ['Early Development', 'Social Skills', 'Creative Arts'],
            established: 2445,
            publicPrivate: 'private'
          }
        ],
        curriculum: [
          {
            level: 'Pre-K',
            subjects: ['Social Skills', 'Basic Literacy', 'Numbers & Counting', 'Creative Arts', 'Physical Development', 'Science Exploration'],
            coreRequirements: ['Social Interaction', 'Basic Communication', 'Motor Skills Development', 'Safety Awareness'],
            electiveOptions: ['Music & Movement', 'Nature Studies', 'Second Language Exposure', 'Advanced Arts'],
            assessmentMethods: ['Observation-Based Assessment', 'Portfolio Collection', 'Developmental Milestones', 'Parent Conferences'],
            graduationRequirements: 'Demonstrate readiness for kindergarten through developmental milestones'
          },
          {
            level: 'Elementary',
            subjects: ['Reading & Writing', 'Mathematics', 'Basic Sciences', 'Social Studies', 'Physical Education', 'Arts & Music'],
            coreRequirements: ['Literacy Fundamentals', 'Numeracy Skills', 'Scientific Method Basics', 'Civic Awareness'],
            electiveOptions: ['Second Language', 'Advanced Arts', 'Computer Basics', 'Environmental Studies'],
            assessmentMethods: ['Continuous Assessment', 'Project-Based Learning', 'Standardized Testing', 'Portfolio Review'],
            graduationRequirements: 'Demonstrate grade-level proficiency in core subjects'
          },
          {
            level: 'High School',
            subjects: ['Advanced Mathematics', 'Sciences (Physics, Chemistry, Biology)', 'Literature & Composition', 'History & Government', 'Foreign Languages', 'Technology & Engineering'],
            coreRequirements: ['4 years English', '4 years Math', '3 years Science', '3 years Social Studies', '2 years Foreign Language'],
            electiveOptions: ['Advanced Placement Courses', 'Career Technical Education', 'Fine Arts', 'Computer Science', 'Business Studies'],
            assessmentMethods: ['Semester Exams', 'AP Testing', 'Senior Projects', 'Internship Evaluations'],
            graduationRequirements: '24 credits minimum, including all core requirements and electives'
          },
          {
            level: 'University',
            subjects: ['Major Field Studies', 'General Education', 'Critical Thinking', 'Professional Development', 'Liberal Arts'],
            coreRequirements: ['120 credit hours', 'Major concentration (36+ credits)', 'General education (42 credits)', 'Senior capstone'],
            electiveOptions: ['Minor concentrations', 'Study abroad', 'Internships', 'Service learning', 'Cross-disciplinary studies'],
            assessmentMethods: ['Course examinations', 'Papers & projects', 'Capstone project', 'Comprehensive exams'],
            graduationRequirements: 'Complete degree requirements with minimum 2.0 GPA'
          }
        ],
        teachers: [
          {
            id: 'teacher-001',
            name: 'Ms. Sarah Chen',
            level: 'Elementary',
            subjects: ['Mathematics', 'Science', 'STEM Integration'],
            experience: 8,
            qualifications: ['M.Ed. Elementary Education', 'STEM Specialist', 'Math Excellence Award'],
            rating: 9.4,
            institution: 'Zephyrian Elementary Academy'
          },
          {
            id: 'teacher-002',
            name: 'Prof. Marcus Rodriguez',
            level: 'High School',
            subjects: ['Advanced Mathematics', 'Physics', 'Engineering Prep'],
            experience: 12,
            qualifications: ['M.S. Mathematics', 'Teaching Excellence Award', 'STEM Certification'],
            rating: 9.2,
            institution: 'Imperial High School of Sciences'
          },
          {
            id: 'teacher-003',
            name: 'Dr. Elena Vasquez',
            level: 'University',
            subjects: ['Education Theory', 'Curriculum Development', 'Teacher Training'],
            experience: 15,
            qualifications: ['Ph.D. Education', 'Published Author', 'Curriculum Design Expert'],
            rating: 9.6,
            institution: 'Galactic University'
          },
          {
            id: 'teacher-004',
            name: 'Ms. Lisa Kim',
            level: 'Pre-K',
            subjects: ['Early Development', 'Social Skills', 'Creative Arts'],
            experience: 6,
            qualifications: ['M.Ed. Early Childhood', 'Child Development Specialist', 'Arts Integration Certified'],
            rating: 9.3,
            institution: 'Little Stars Pre-K Center'
          }
        ]
      });
      setError('Using mock data - API not available');
    } finally {
      setLoading(false);
    }
  };

  const getInstitutionTypeIcon = (type: string) => {
    switch (type) {
      case 'pre-k': return '🧸';
      case 'elementary': return '📚';
      case 'middle': return '🎒';
      case 'high': return '🎓';
      case 'community-college': return '🏫';
      case 'university': return '🏛️';
      case 'trade-school': return '🔧';
      case 'vocational': return '💼';
      default: return '🏫';
    }
  };

  const renderOverview = () => (
    <div className="education-overview">
      <div className="education-metrics">
        <div className="metric-card">
          <div className="metric-value">{(educationData.metrics.totalStudents / 1000000).toFixed(1)}M</div>
          <div className="metric-label">Total Students</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{(educationData.metrics.totalInstitutions / 1000).toFixed(1)}K</div>
          <div className="metric-label">Institutions</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{(educationData.metrics.totalTeachers / 1000).toFixed(0)}K</div>
          <div className="metric-label">Teachers</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{educationData.metrics.literacyRate}%</div>
          <div className="metric-label">Literacy Rate</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{educationData.metrics.graduationRate}%</div>
          <div className="metric-label">Graduation Rate</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">${(educationData.metrics.totalBudget / 1000000000).toFixed(1)}B</div>
          <div className="metric-label">Total Budget</div>
        </div>
      </div>

      <div className="education-levels-overview">
        <h3>Education System Levels</h3>
        <div className="levels-grid">
          {educationData.levels.map((level, index) => (
            <div key={index} className="level-card">
              <h4>{level.level}</h4>
              <p className="level-description">{level.description}</p>
              <div className="level-stats">
                <div className="level-stat">
                  <span className="stat-label">Students:</span>
                  <span className="stat-value">{(level.students / 1000).toFixed(0)}K</span>
                </div>
                <div className="level-stat">
                  <span className="stat-label">Institutions:</span>
                  <span className="stat-value">{level.institutions.toLocaleString()}</span>
                </div>
                <div className="level-stat">
                  <span className="stat-label">Teachers:</span>
                  <span className="stat-value">{(level.teachers / 1000).toFixed(0)}K</span>
                </div>
                <div className="level-stat">
                  <span className="stat-label">Graduation Rate:</span>
                  <span className="stat-value">{level.graduationRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInstitutions = () => (
    <div className="education-institutions">
      <div className="institutions-header">
        <h3>Educational Institutions</h3>
        <div className="institutions-filters">
          <select className="filter-select">
            <option value="">All Types</option>
            <option value="pre-k">Pre-K</option>
            <option value="elementary">Elementary</option>
            <option value="middle">Middle School</option>
            <option value="high">High School</option>
            <option value="community-college">Community College</option>
            <option value="university">University</option>
            <option value="trade-school">Trade School</option>
            <option value="vocational">Vocational</option>
          </select>
          <select className="filter-select">
            <option value="">All Sectors</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className="institutions-list">
        {educationData.institutions.map((institution) => (
          <div key={institution.id} className="institution-card">
            <div className="institution-header">
              <div className="institution-icon">{getInstitutionTypeIcon(institution.type)}</div>
              <div className="institution-info">
                <h4>{institution.name}</h4>
                <div className="institution-details">
                  <span className="institution-type">{institution.type.replace('-', ' ').toUpperCase()}</span>
                  <span className="institution-sector">({institution.publicPrivate})</span>
                  <span className="institution-location">📍 {institution.location}</span>
                </div>
              </div>
              <div className="institution-rating">
                <div className="rating-value">{institution.rating}</div>
                <div className="rating-label">Rating</div>
              </div>
            </div>
            <div className="institution-stats">
              <div className="stat-row">
                <span className="stat-label">Students:</span>
                <span className="stat-value">{institution.students.toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Teachers:</span>
                <span className="stat-value">{institution.teachers.toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Established:</span>
                <span className="stat-value">{institution.established}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Student-Teacher Ratio:</span>
                <span className="stat-value">{Math.round(institution.students / institution.teachers)}:1</span>
              </div>
            </div>
            <div className="institution-specializations">
              <div className="spec-label">Specializations:</div>
              <div className="spec-tags">
                {institution.specializations.map((spec, index) => (
                  <span key={index} className="spec-tag">{spec}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurriculum = () => (
    <div className="education-curriculum">
      <h3>Curriculum Standards</h3>
      <div className="curriculum-levels">
        {educationData.curriculum.map((curr, index) => (
          <div key={index} className="curriculum-card">
            <h4>{curr.level} Curriculum</h4>
            
            <div className="curriculum-section">
              <h5>📚 Core Subjects</h5>
              <div className="subject-tags">
                {curr.subjects.map((subject, idx) => (
                  <span key={idx} className="subject-tag">{subject}</span>
                ))}
              </div>
            </div>

            <div className="curriculum-section">
              <h5>✅ Core Requirements</h5>
              <ul className="requirements-list">
                {curr.coreRequirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="curriculum-section">
              <h5>🎯 Elective Options</h5>
              <div className="elective-tags">
                {curr.electiveOptions.map((elective, idx) => (
                  <span key={idx} className="elective-tag">{elective}</span>
                ))}
              </div>
            </div>

            <div className="curriculum-section">
              <h5>📊 Assessment Methods</h5>
              <div className="assessment-tags">
                {curr.assessmentMethods.map((method, idx) => (
                  <span key={idx} className="assessment-tag">{method}</span>
                ))}
              </div>
            </div>

            <div className="curriculum-section">
              <h5>🎓 Graduation Requirements</h5>
              <p className="graduation-req">{curr.graduationRequirements}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeachers = () => (
    <div className="education-teachers">
      <div className="teachers-header">
        <h3>Teaching Staff</h3>
        <div className="teachers-filters">
          <select className="filter-select">
            <option value="">All Levels</option>
            <option value="Pre-K">Pre-K</option>
            <option value="Elementary">Elementary</option>
            <option value="Middle School">Middle School</option>
            <option value="High School">High School</option>
            <option value="University">University</option>
          </select>
          <select className="filter-select">
            <option value="">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Sciences">Sciences</option>
            <option value="Language Arts">Language Arts</option>
            <option value="Social Studies">Social Studies</option>
          </select>
        </div>
      </div>

      <div className="teachers-list">
        {educationData.teachers.map((teacher) => (
          <div key={teacher.id} className="teacher-card">
            <div className="teacher-header">
              <div className="teacher-avatar">👨‍🏫</div>
              <div className="teacher-info">
                <h4>{teacher.name}</h4>
                <div className="teacher-level">{teacher.level} Level</div>
                <div className="teacher-institution">📍 {teacher.institution}</div>
              </div>
              <div className="teacher-rating">
                <div className="rating-value">{teacher.rating}</div>
                <div className="rating-label">Rating</div>
              </div>
            </div>
            <div className="teacher-details">
              <div className="teacher-subjects">
                <span className="detail-label">Subjects:</span>
                <div className="subject-tags">
                  {teacher.subjects.map((subject, index) => (
                    <span key={index} className="subject-tag">{subject}</span>
                  ))}
                </div>
              </div>
              <div className="teacher-experience">
                <span className="detail-label">Experience:</span>
                <span className="detail-value">{teacher.experience} years</span>
              </div>
              <div className="teacher-qualifications">
                <span className="detail-label">Qualifications:</span>
                <div className="qualification-tags">
                  {teacher.qualifications.map((qual, index) => (
                    <span key={index} className="qualification-tag">{qual}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBudget = () => (
    <div className="education-budget">
      <h3>Education Budget Allocation</h3>
      <div className="budget-overview">
        <div className="budget-total">
          <h4>Total Education Budget</h4>
          <div className="budget-amount">${(educationData.metrics.totalBudget / 1000000000).toFixed(1)} Billion</div>
        </div>
      </div>
      
      <div className="budget-breakdown">
        <h4>Budget by Education Level</h4>
        <div className="budget-levels">
          {educationData.levels.map((level, index) => (
            <div key={index} className="budget-level">
              <div className="budget-level-header">
                <span className="level-name">{level.level}</span>
                <span className="level-budget">${(level.budget / 1000000000).toFixed(1)}B</span>
              </div>
              <div className="budget-bar">
                <div 
                  className="budget-fill" 
                  style={{ 
                    width: `${(level.budget / educationData.metrics.totalBudget) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="budget-percentage">
                {((level.budget / educationData.metrics.totalBudget) * 100).toFixed(1)}% of total budget
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="budget-categories">
        <h4>Budget Categories</h4>
        <div className="categories-grid">
          <div className="category-card">
            <h5>👨‍🏫 Teacher Salaries</h5>
            <div className="category-amount">$18.2B (40%)</div>
            <p>Compensation for teaching staff across all levels</p>
          </div>
          <div className="category-card">
            <h5>🏫 Infrastructure</h5>
            <div className="category-amount">$9.1B (20%)</div>
            <p>Building maintenance, construction, and facilities</p>
          </div>
          <div className="category-card">
            <h5>📚 Materials & Technology</h5>
            <div className="category-amount">$6.8B (15%)</div>
            <p>Textbooks, digital resources, and educational technology</p>
          </div>
          <div className="category-card">
            <h5>🚌 Transportation</h5>
            <div className="category-amount">$4.6B (10%)</div>
            <p>Student transportation and logistics</p>
          </div>
          <div className="category-card">
            <h5>🍽️ Nutrition Programs</h5>
            <div className="category-amount">$3.4B (7.5%)</div>
            <p>School meals and nutrition support</p>
          </div>
          <div className="category-card">
            <h5>🎯 Special Programs</h5>
            <div className="category-amount">$3.4B (7.5%)</div>
            <p>Special education, gifted programs, and support services</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="education-analytics">
      <h3>Education System Analytics</h3>
      
      <div className="analytics-metrics">
        <div className="analytics-section">
          <h4>📈 Performance Trends</h4>
          <div className="trend-cards">
            <div className="trend-card positive">
              <div className="trend-value">+2.3%</div>
              <div className="trend-label">Graduation Rate (YoY)</div>
            </div>
            <div className="trend-card positive">
              <div className="trend-value">+1.8%</div>
              <div className="trend-label">Literacy Rate (YoY)</div>
            </div>
            <div className="trend-card negative">
              <div className="trend-value">-0.5%</div>
              <div className="trend-label">Dropout Rate (YoY)</div>
            </div>
            <div className="trend-card positive">
              <div className="trend-value">+5.2%</div>
              <div className="trend-label">Teacher Retention</div>
            </div>
          </div>
        </div>

        <div className="analytics-section">
          <h4>🎯 Key Performance Indicators</h4>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-title">Student Achievement</div>
              <div className="kpi-value">87.3%</div>
              <div className="kpi-description">Students meeting grade-level standards</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-title">Teacher Satisfaction</div>
              <div className="kpi-value">8.4/10</div>
              <div className="kpi-description">Average teacher satisfaction rating</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-title">Parent Engagement</div>
              <div className="kpi-value">76.8%</div>
              <div className="kpi-description">Parents actively involved in education</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-title">Technology Integration</div>
              <div className="kpi-value">92.1%</div>
              <div className="kpi-description">Classrooms with modern technology</div>
            </div>
          </div>
        </div>

        <div className="analytics-section">
          <h4>🌍 Comparative Analysis</h4>
          <div className="comparison-table">
            <div className="comparison-header">
              <span>Metric</span>
              <span>Our System</span>
              <span>Galactic Average</span>
              <span>Best in Galaxy</span>
            </div>
            <div className="comparison-row">
              <span>Literacy Rate</span>
              <span className="our-value">98.7%</span>
              <span>94.2%</span>
              <span>99.1%</span>
            </div>
            <div className="comparison-row">
              <span>Graduation Rate</span>
              <span className="our-value">94.2%</span>
              <span>89.7%</span>
              <span>96.8%</span>
            </div>
            <div className="comparison-row">
              <span>Teacher-Student Ratio</span>
              <span className="our-value">1:22</span>
              <span>1:28</span>
              <span>1:18</span>
            </div>
            <div className="comparison-row">
              <span>Education Spending (% GDP)</span>
              <span className="our-value">6.2%</span>
              <span>5.1%</span>
              <span>7.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="education-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading education system data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="education-screen">
      <div className="screen-header">
        <h1>🎓 Education System</h1>
        <p>Comprehensive education management from Pre-K through higher education</p>
        {error && <div className="error-notice">⚠️ {error}</div>}
      </div>

      <div className="screen-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'institutions' ? 'active' : ''}`}
          onClick={() => setActiveTab('institutions')}
        >
          🏫 Institutions
        </button>
        <button 
          className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
          onClick={() => setActiveTab('curriculum')}
        >
          📚 Curriculum
        </button>
        <button 
          className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          👨‍🏫 Teachers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          💰 Budget
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </div>

      <div className="screen-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'institutions' && renderInstitutions()}
        {activeTab === 'curriculum' && renderCurriculum()}
        {activeTab === 'teachers' && renderTeachers()}
        {activeTab === 'budget' && renderBudget()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default EducationScreen;
