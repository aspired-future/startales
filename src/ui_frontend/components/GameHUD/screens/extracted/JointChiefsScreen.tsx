import React, { useState, useEffect } from 'react';
import './JointChiefsScreen.css';

interface JointChiefsScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface JointChief {
  id: string;
  name: string;
  rank: string;
  position: string;
  yearsOfService: number;
  specializations: string[];
  service: string;
}

interface MilitaryService {
  id: string;
  name: string;
  code: string;
  personnel: number;
  activeUnits: number;
  readiness: 'low' | 'moderate' | 'high';
  chief: string;
}

interface StrategicPlan {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  timeline: string;
  leadService: string;
  status: string;
}

interface JointOperation {
  id: string;
  name: string;
  status: 'planning' | 'approved' | 'active' | 'completed';
  description: string;
  personnel: number;
  command: string;
  location: string;
}

interface CommandRecommendation {
  id: string;
  title: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  from: string;
  to: string;
}

interface ReadinessMetrics {
  overallReadiness: number;
  totalPersonnel: number;
  activeUnits: number;
  totalBudget: string;
}

const JointChiefsScreen: React.FC<JointChiefsScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [jointChiefsData, setJointChiefsData] = useState<{
    chiefs: JointChief[];
    services: MilitaryService[];
    strategicPlans: StrategicPlan[];
    operations: JointOperation[];
    recommendations: CommandRecommendation[];
    metrics: ReadinessMetrics;
  }>({
    chiefs: [],
    services: [],
    strategicPlans: [],
    operations: [],
    recommendations: [],
    metrics: {
      overallReadiness: 0,
      totalPersonnel: 0,
      activeUnits: 0,
      totalBudget: '$0'
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJointChiefsData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await fetch('/api/joint-chiefs/');
        
        if (!response.ok) {
          throw new Error('API not available');
        }
        
        const data = await response.json();
        if (data.success) {
          setJointChiefsData(data.data);
        }
      } catch (err) {
        console.warn('Joint Chiefs API not available, using mock data');
        // Use comprehensive mock data
        setJointChiefsData({
          chiefs: [
            {
              id: 'chief_001',
              name: 'General Marcus Sterling',
              rank: 'General',
              position: 'Chairman of Joint Chiefs',
              yearsOfService: 32,
              specializations: ['Strategic Planning', 'Joint Operations', 'Defense Policy'],
              service: 'Command Authority'
            },
            {
              id: 'chief_002',
              name: 'Admiral Sarah Chen',
              rank: 'Admiral',
              position: 'Vice Chairman',
              yearsOfService: 28,
              specializations: ['Naval Operations', 'Space Warfare', 'Intelligence'],
              service: 'Deputy Command'
            },
            {
              id: 'chief_003',
              name: 'General Robert Hayes',
              rank: 'General',
              position: 'Army Chief of Staff',
              yearsOfService: 30,
              specializations: ['Ground Operations', 'Logistics', 'Personnel'],
              service: 'Army'
            },
            {
              id: 'chief_004',
              name: 'Admiral Lisa Rodriguez',
              rank: 'Admiral',
              position: 'Chief of Naval Operations',
              yearsOfService: 26,
              specializations: ['Naval Strategy', 'Maritime Security', 'Fleet Operations'],
              service: 'Navy'
            },
            {
              id: 'chief_005',
              name: 'General Maria Volkov',
              rank: 'General',
              position: 'Space Force Chief',
              yearsOfService: 22,
              specializations: ['Space Operations', 'Satellite Systems', 'Orbital Defense'],
              service: 'Space Force'
            }
          ],
          services: [
            {
              id: 'army',
              name: 'Army (USA)',
              code: 'USA',
              personnel: 150000,
              activeUnits: 45,
              readiness: 'high',
              chief: 'General Robert Hayes'
            },
            {
              id: 'navy',
              name: 'Navy (USN)',
              code: 'USN',
              personnel: 120000,
              activeUnits: 35,
              readiness: 'high',
              chief: 'Admiral Lisa Rodriguez'
            },
            {
              id: 'airforce',
              name: 'Air Force (USAF)',
              code: 'USAF',
              personnel: 100000,
              activeUnits: 40,
              readiness: 'moderate',
              chief: 'General David Kim'
            },
            {
              id: 'spaceforce',
              name: 'Space Force (USSF)',
              code: 'USSF',
              personnel: 50000,
              activeUnits: 25,
              readiness: 'high',
              chief: 'General Maria Volkov'
            },
            {
              id: 'marines',
              name: 'Marines (USMC)',
              code: 'USMC',
              personnel: 80000,
              activeUnits: 20,
              readiness: 'high',
              chief: 'General James Thompson'
            }
          ],
          strategicPlans: [
            {
              id: 'plan_001',
              name: 'Operation Stellar Shield',
              priority: 'high',
              description: 'Comprehensive orbital defense network',
              timeline: '18 months',
              leadService: 'Space Force',
              status: 'Under Review'
            },
            {
              id: 'plan_002',
              name: 'Joint Readiness Enhancement',
              priority: 'medium',
              description: 'Inter-service coordination improvement',
              timeline: '12 months',
              leadService: 'Army',
              status: 'Draft'
            },
            {
              id: 'plan_003',
              name: 'Cyber Defense Modernization',
              priority: 'high',
              description: 'Advanced cyber warfare capabilities',
              timeline: '24 months',
              leadService: 'Air Force',
              status: 'Approved'
            }
          ],
          operations: [
            {
              id: 'op_001',
              name: 'Exercise Thunder Strike',
              status: 'active',
              description: 'Multi-service training exercise',
              personnel: 15000,
              command: 'Army',
              location: 'Sector 7'
            },
            {
              id: 'op_002',
              name: 'Operation Deep Space',
              status: 'planning',
              description: 'Long-range reconnaissance mission',
              personnel: 2500,
              command: 'Space Force',
              location: 'Outer Rim'
            },
            {
              id: 'op_003',
              name: 'Maritime Guardian',
              status: 'approved',
              description: 'Naval patrol and security operation',
              personnel: 8000,
              command: 'Navy',
              location: 'Sector 12'
            }
          ],
          recommendations: [
            {
              id: 'rec_001',
              title: 'Enhanced Cyber Defense Initiative',
              urgency: 'high',
              description: 'Strengthen cyber warfare capabilities across all services',
              from: 'General Kim (Air Force)',
              to: 'Defense Secretary'
            },
            {
              id: 'rec_002',
              title: 'Joint Training Facility Expansion',
              urgency: 'medium',
              description: 'Expand multi-service training capabilities',
              from: 'General Sterling (Chairman)',
              to: 'Leader'
            },
            {
              id: 'rec_003',
              title: 'Personnel Exchange Program',
              urgency: 'low',
              description: 'Cross-service personnel development initiative',
              from: 'Admiral Chen (Vice Chairman)',
              to: 'Joint Chiefs'
            }
          ],
          metrics: {
            overallReadiness: 3.2,
            totalPersonnel: 520000,
            activeUnits: 165,
            totalBudget: '$110B'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJointChiefsData();
  }, []);

  const handleAction = (action: string, context?: any) => {
    console.log(`Joint Chiefs Action: ${action}`, context);
    alert(`Joint Chiefs System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  if (loading) {
    return (
      <div className="joint-chiefs-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading Joint Chiefs data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="joint-chiefs-screen">
        <div className="error-state">
          <h3>⚠️ Error Loading Joint Chiefs Data</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="joint-chiefs-screen">
      <div className="screen-header">
        <h1>⭐ Joint Chiefs of Staff & Service Chiefs</h1>
        <p>Military Command Hierarchy • Strategic Planning • Joint Operations</p>
        <p><strong>Departments:</strong> Joint Chiefs, Army, Navy, Air Force, Space Force, Marines</p>
      </div>

      <div className="dashboard-grid">
        {/* Joint Chiefs Panel */}
        <div className="panel">
          <h2>👨‍✈️ Joint Chiefs of Staff</h2>
          <div className="chiefs-list">
            {jointChiefsData.chiefs.slice(0, 2).map(chief => (
              <div key={chief.id} className="chief-card">
                <h3>{chief.name}</h3>
                <div className="rank">{chief.position}</div>
                <p>{chief.yearsOfService} years of service • {chief.specializations.join(', ')}</p>
                <div className="service">{chief.service}</div>
              </div>
            ))}
          </div>
          <div className="controls">
            <button className="btn" onClick={() => handleAction('View All Chiefs', jointChiefsData.chiefs)}>
              View All Chiefs
            </button>
            <button className="btn secondary" onClick={() => handleAction('Appoint Officer')}>
              Appoint Officer
            </button>
          </div>
        </div>

        {/* Military Services Panel */}
        <div className="panel">
          <h2>🛡️ Military Services</h2>
          <div className="services-list">
            {jointChiefsData.services.slice(0, 3).map(service => (
              <div key={service.id} className="service-card">
                <h3>{service.name}</h3>
                <p>{service.personnel.toLocaleString()} personnel • {service.activeUnits} active units</p>
                <div className={`readiness ${service.readiness}`}>
                  {service.readiness.charAt(0).toUpperCase() + service.readiness.slice(1)} Readiness
                </div>
                <p><strong>Chief:</strong> {service.chief}</p>
              </div>
            ))}
          </div>
          <div className="controls">
            <button className="btn" onClick={() => handleAction('View All Services', jointChiefsData.services)}>
              View All Services
            </button>
            <button className="btn secondary" onClick={() => handleAction('Update Readiness')}>
              Update Readiness
            </button>
          </div>
        </div>

        {/* Strategic Plans Panel */}
        <div className="panel">
          <h2>📋 Strategic Plans</h2>
          <div className="plans-list">
            {jointChiefsData.strategicPlans.map(plan => (
              <div key={plan.id} className="plan-card">
                <h3>{plan.name}</h3>
                <div className={`priority ${plan.priority}`}>
                  {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)} Priority
                </div>
                <p>{plan.description} • {plan.timeline} timeline</p>
                <p><strong>Lead:</strong> {plan.leadService} • <strong>Status:</strong> {plan.status}</p>
              </div>
            ))}
          </div>
          <div className="controls">
            <button className="btn" onClick={() => handleAction('Create Strategic Plan')}>
              Create New Plan
            </button>
            <button className="btn secondary" onClick={() => handleAction('Review Plans', jointChiefsData.strategicPlans)}>
              Review Plans
            </button>
          </div>
        </div>

        {/* Joint Operations Panel */}
        <div className="panel">
          <h2>🎯 Joint Operations</h2>
          <div className="operations-list">
            {jointChiefsData.operations.map(operation => (
              <div key={operation.id} className="operation-card">
                <h3>{operation.name}</h3>
                <div className={`status ${operation.status}`}>
                  {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
                </div>
                <p>{operation.description} • {operation.personnel.toLocaleString()} personnel</p>
                <p><strong>Command:</strong> {operation.command} • <strong>Location:</strong> {operation.location}</p>
              </div>
            ))}
          </div>
          <div className="controls">
            <button className="btn" onClick={() => handleAction('Plan Joint Operation')}>
              Plan Operation
            </button>
            <button className="btn warning" onClick={() => handleAction('Execute Operation')}>
              Execute Operation
            </button>
          </div>
        </div>

        {/* Command Recommendations Panel */}
        <div className="panel">
          <h2>💡 Command Recommendations</h2>
          <div className="recommendations-list">
            {jointChiefsData.recommendations.map(recommendation => (
              <div key={recommendation.id} className="recommendation-card">
                <h3>{recommendation.title}</h3>
                <div className={`urgency ${recommendation.urgency}`}>
                  {recommendation.urgency.charAt(0).toUpperCase() + recommendation.urgency.slice(1)} Urgency
                </div>
                <p>{recommendation.description}</p>
                <p><strong>From:</strong> {recommendation.from} • <strong>To:</strong> {recommendation.to}</p>
              </div>
            ))}
          </div>
          <div className="controls">
            <button className="btn" onClick={() => handleAction('Submit Recommendation')}>
              Submit Recommendation
            </button>
            <button className="btn secondary" onClick={() => handleAction('Review Recommendations', jointChiefsData.recommendations)}>
              Review All
            </button>
          </div>
        </div>

        {/* Military Readiness Analytics */}
        <div className="panel">
          <h2>📊 Military Readiness Analytics</h2>
          <div className="metrics-grid">
            <div className="metric">
              <div className="metric-value">{jointChiefsData.metrics.overallReadiness}</div>
              <div className="metric-label">Overall Readiness</div>
            </div>
            <div className="metric">
              <div className="metric-value">{(jointChiefsData.metrics.totalPersonnel / 1000).toFixed(0)}K</div>
              <div className="metric-label">Total Personnel</div>
            </div>
            <div className="metric">
              <div className="metric-value">{jointChiefsData.metrics.activeUnits}</div>
              <div className="metric-label">Active Units</div>
            </div>
            <div className="metric">
              <div className="metric-value">{jointChiefsData.metrics.totalBudget}</div>
              <div className="metric-label">Total Budget</div>
            </div>
          </div>
          <div className="controls">
            <button className="btn" onClick={() => handleAction('Generate Readiness Report', jointChiefsData.metrics)}>
              Generate Report
            </button>
            <button className="btn secondary" onClick={() => handleAction('View Analytics')}>
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JointChiefsScreen;
