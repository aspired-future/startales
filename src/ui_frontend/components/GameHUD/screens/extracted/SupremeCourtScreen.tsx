import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './SupremeCourtScreen.css';

interface ConstitutionalReview {
  id: string;
  title: string;
  type: 'law_review' | 'policy_analysis' | 'amendment_review' | 'emergency_powers';
  description: string;
  compliance: 'compliant' | 'questionable' | 'non_compliant' | 'requires_modification';
  urgency: 'routine' | 'important' | 'urgent' | 'emergency';
  confidence: number;
  status: 'pending' | 'reviewed' | 'accepted' | 'modified' | 'rejected';
}

interface SupremeCourtJustice {
  id: string;
  name: string;
  title: string;
  philosophy: 'originalist' | 'living_constitution' | 'textualist' | 'pragmatist';
  specialization: string[];
  tenure: number;
  approval: number;
  isChief: boolean;
}

interface LegalPrecedent {
  id: string;
  caseName: string;
  year: number;
  issue: string;
  holding: string;
  impact: string;
  status: 'binding' | 'persuasive' | 'overruled';
}

interface ConstitutionalInterpretation {
  id: string;
  provision: string;
  scope: string;
  approach: string;
  consensus: string;
  application: string;
}

interface SupremeCourtData {
  overview: {
    pendingReviews: number;
    leaderAcceptanceRate: number;
    constitutionalCompliance: number;
    judicialIndependence: number;
    publicConfidence: number;
  };
  reviews: ConstitutionalReview[];
  justices: SupremeCourtJustice[];
  precedents: LegalPrecedent[];
  interpretations: ConstitutionalInterpretation[];
  interactions: {
    consultations: number;
    acceptances: number;
    modifications: number;
    overrides: number;
  };
}

const SupremeCourtScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [supremeCourtData, setSupremeCourtData] = useState<SupremeCourtData>({
    overview: {
      pendingReviews: 3,
      leaderAcceptanceRate: 0,
      constitutionalCompliance: 88,
      judicialIndependence: 82,
      publicConfidence: 74.5
    },
    reviews: [
      {
        id: 'rev-1',
        title: 'Infrastructure Investment Act Review',
        type: 'law_review',
        description: 'Commerce Clause & spending power analysis',
        compliance: 'compliant',
        urgency: 'important',
        confidence: 8,
        status: 'pending'
      },
      {
        id: 'rev-2',
        title: 'Emergency Powers Analysis',
        type: 'policy_analysis',
        description: 'Executive authority limits during crisis',
        compliance: 'requires_modification',
        urgency: 'urgent',
        confidence: 9,
        status: 'pending'
      },
      {
        id: 'rev-3',
        title: 'Digital Rights Amendment Review',
        type: 'amendment_review',
        description: 'Privacy & AI rights constitutional analysis',
        compliance: 'requires_modification',
        urgency: 'important',
        confidence: 7,
        status: 'pending'
      }
    ],
    justices: [
      {
        id: 'chief-1',
        name: 'Elena Rodriguez',
        title: 'Chief Justice',
        philosophy: 'living_constitution',
        specialization: ['Constitutional Law', 'Civil Rights'],
        tenure: 7,
        approval: 78.5,
        isChief: true
      },
      {
        id: 'justice-1',
        name: 'Marcus Chen',
        title: 'Associate Justice',
        philosophy: 'originalist',
        specialization: ['Criminal Law', 'Constitutional History'],
        tenure: 9,
        approval: 65.2,
        isChief: false
      },
      {
        id: 'justice-2',
        name: 'Sarah Thompson',
        title: 'Associate Justice',
        philosophy: 'textualist',
        specialization: ['Commercial Law', 'Property Rights'],
        tenure: 5,
        approval: 71.8,
        isChief: false
      },
      {
        id: 'justice-3',
        name: 'David Kim',
        title: 'Associate Justice',
        philosophy: 'pragmatist',
        specialization: ['International Law', 'Human Rights'],
        tenure: 8,
        approval: 82.3,
        isChief: false
      },
      {
        id: 'justice-4',
        name: 'Maria Santos',
        title: 'Associate Justice',
        philosophy: 'living_constitution',
        specialization: ['Environmental Law', 'Administrative Law'],
        tenure: 6,
        approval: 76.1,
        isChief: false
      },
      {
        id: 'justice-5',
        name: 'James Wright',
        title: 'Associate Justice',
        philosophy: 'textualist',
        specialization: ['Corporate Law', 'Securities Law'],
        tenure: 4,
        approval: 68.9,
        isChief: false
      }
    ],
    precedents: [
      {
        id: 'prec-1',
        caseName: 'Galactic Commerce Authority v. ITU',
        year: 2152,
        issue: 'Federal regulation of interplanetary commerce',
        holding: 'Broad Commerce Clause authority confirmed',
        impact: 'Expanded federal regulatory power',
        status: 'binding'
      },
      {
        id: 'prec-2',
        caseName: 'Citizens for Privacy v. PSA',
        year: 2153,
        issue: 'Government surveillance vs. privacy rights',
        holding: 'Judicial oversight required for surveillance',
        impact: 'Strengthened Fourth Amendment protections',
        status: 'binding'
      },
      {
        id: 'prec-3',
        caseName: 'Environmental Coalition v. Mining Consortium',
        year: 2151,
        issue: 'Environmental regulation vs. property rights',
        holding: 'Environmental protection authority confirmed',
        impact: 'Broad federal environmental authority',
        status: 'binding'
      }
    ],
    interpretations: [
      {
        id: 'int-1',
        provision: 'Commerce Clause',
        scope: 'Interplanetary trade authority',
        approach: 'Broad federal regulatory power',
        consensus: 'Strong scholarly support',
        application: 'Modern commerce regulation'
      },
      {
        id: 'int-2',
        provision: 'Privacy Rights',
        scope: 'Digital surveillance limitations',
        approach: 'Judicial oversight requirement',
        consensus: 'Moderate scholarly support',
        application: 'Fourth Amendment protections'
      },
      {
        id: 'int-3',
        provision: 'Emergency Powers',
        scope: 'Executive authority during crisis',
        approach: 'Broad but limited powers',
        consensus: 'Disputed scholarly views',
        application: 'Constitutional crisis management'
      }
    ],
    interactions: {
      consultations: 12,
      acceptances: 9,
      modifications: 2,
      overrides: 0
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/supreme-court/dashboard', description: 'Get Supreme Court overview and metrics' },
    { method: 'GET', path: '/api/supreme-court/reviews', description: 'Get all constitutional reviews' },
    { method: 'POST', path: '/api/supreme-court/reviews', description: 'Create new constitutional review' },
    { method: 'PUT', path: '/api/supreme-court/reviews/:id/leader-response', description: 'Leader response to review' },
    { method: 'GET', path: '/api/supreme-court/justices', description: 'Get Supreme Court justices information' },
    { method: 'GET', path: '/api/supreme-court/precedents', description: 'Get legal precedents database' },
    { method: 'GET', path: '/api/supreme-court/interpretations', description: 'Get constitutional interpretations' },
    { method: 'POST', path: '/api/supreme-court/opinions', description: 'Create judicial opinion' },
    { method: 'POST', path: '/api/supreme-court/interactions', description: 'Record leader-court interaction' }
  ];

  const fetchSupremeCourtData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would fetch from the API
      // const response = await fetch('/api/supreme-court/dashboard');
      // const data = await response.json();
      // setSupremeCourtData(data);
      
      // For now, use mock data with some randomization
      setSupremeCourtData(prev => ({
        ...prev,
        overview: {
          ...prev.overview,
          constitutionalCompliance: Math.max(75, Math.min(95, prev.overview.constitutionalCompliance + (Math.random() * 4 - 2))),
          judicialIndependence: Math.max(70, Math.min(90, prev.overview.judicialIndependence + (Math.random() * 3 - 1.5))),
          publicConfidence: Math.max(60, Math.min(85, prev.overview.publicConfidence + (Math.random() * 2 - 1)))
        }
      }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Supreme Court data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupremeCourtData();
  }, [fetchSupremeCourtData]);

  const getComplianceColor = (compliance: string): string => {
    switch (compliance) {
      case 'compliant': return '#27ae60';
      case 'questionable': return '#f39c12';
      case 'non_compliant': return '#e74c3c';
      case 'requires_modification': return '#e67e22';
      default: return '#95a5a6';
    }
  };

  const getComplianceClass = (score: number): string => {
    if (score >= 85) return 'compliance-excellent';
    if (score >= 75) return 'compliance-good';
    if (score >= 65) return 'compliance-fair';
    return 'compliance-poor';
  };

  const getIndependenceClass = (score: number): string => {
    if (score >= 80) return 'independence-high';
    if (score >= 70) return 'independence-moderate';
    return 'independence-low';
  };

  const getPhilosophyColor = (philosophy: string): string => {
    switch (philosophy) {
      case 'originalist': return '#c0392b';
      case 'living_constitution': return '#27ae60';
      case 'textualist': return '#2980b9';
      case 'pragmatist': return '#8e44ad';
      default: return '#95a5a6';
    }
  };

  const handleReviewConstitutional = () => {
    alert('Constitutional Reviews\n\n📋 Current Pending Reviews:\n\n1. Interstellar Infrastructure Investment Act Review\n   - Type: Law Review\n   - Analysis: Commerce Clause & federal spending power\n   - Compliance: COMPLIANT\n   - Confidence: 8/10\n   - Recommendation: Constitutional with minor procedural enhancements\n\n2. Emergency Powers During Crisis Situations\n   - Type: Policy Analysis\n   - Analysis: Executive emergency authority limits\n   - Compliance: REQUIRES MODIFICATION\n   - Confidence: 9/10\n   - Recommendation: Broad but not unlimited powers\n\n3. Proposed Digital Rights Amendment Analysis\n   - Type: Amendment Review\n   - Analysis: Digital privacy & AI rights protections\n   - Compliance: REQUIRES MODIFICATION\n   - Confidence: 7/10\n   - Recommendation: Core principles sound, enforcement needs refinement\n\nLeader has final authority on all constitutional matters.');
  };

  const handleCreateReview = () => {
    alert('Create Constitutional Review\n\n📝 Review Types:\n• Law Review (constitutional compliance)\n• Policy Analysis (constitutional implications)\n• Amendment Review (constitutional amendments)\n• Emergency Powers (crisis authority)\n• Rights Assessment (constitutional rights)\n\n📊 Analysis Components:\n• Constitutional provisions involved\n• Legal precedents applicable\n• Rights impact assessment\n• Implementation guidance\n• Alternative approaches\n\n⚖️ Court Analysis Process:\n• Independent constitutional analysis\n• Expert legal interpretation\n• Precedent-based reasoning\n• Rights protection evaluation\n• Professional recommendations\n\nLeader retains final decision authority over all constitutional matters.');
  };

  const handleViewJustices = () => {
    alert('Supreme Court Justices\n\n👩‍⚖️ Current Court Composition:\n\n⚖️ Chief Justice Elena Rodriguez\n   - Philosophy: Living Constitution\n   - Specialization: Constitutional Law, Civil Rights\n   - Tenure: 7 years • Approval: 78.5%\n\n⚖️ Justice Marcus Chen\n   - Philosophy: Originalist\n   - Specialization: Criminal Law, Constitutional History\n   - Tenure: 9 years • Approval: 65.2%\n\n⚖️ Justice Sarah Thompson\n   - Philosophy: Textualist\n   - Specialization: Commercial Law, Property Rights\n   - Tenure: 5 years • Approval: 71.8%\n\n⚖️ Justice David Kim\n   - Philosophy: Pragmatist\n   - Specialization: International Law, Human Rights\n   - Tenure: 8 years • Approval: 82.3%\n\n+ 2 Additional Associate Justices\n\nDiverse philosophical approaches ensure comprehensive constitutional analysis.');
  };

  const handleScheduleConsultation = () => {
    alert('Constitutional Consultation\n\n📅 Consultation Types:\n\n🎯 Constitutional Questions:\n• Legal interpretation requests\n• Constitutional compliance review\n• Rights impact assessment\n• Implementation guidance\n\n🚨 Emergency Constitutional Review:\n• Crisis authority analysis\n• Emergency powers evaluation\n• Constitutional crisis management\n• Rapid legal guidance\n\n📊 Regular Constitutional Meetings:\n• Weekly legal briefings\n• Monthly constitutional review\n• Quarterly precedent analysis\n• Annual constitutional assessment\n\nConsultations maintain constitutional expertise while respecting leader authority.');
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchSupremeCourtData}
    >
      <div className="supreme-court-screen-container">
        {loading && <div className="loading-overlay">Loading Supreme Court data...</div>}
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="supreme-court-dashboard">
          {/* Constitutional Overview */}
          <div className="panel constitutional-panel">
            <h2>📊 Constitutional Overview</h2>
            <div className="metric">
              <span>Pending Reviews</span>
              <span className="metric-value">{supremeCourtData.overview.pendingReviews}</span>
            </div>
            <div className="metric">
              <span>Leader Acceptance Rate</span>
              <span className="metric-value">{supremeCourtData.overview.leaderAcceptanceRate}%</span>
            </div>
            <div className="metric">
              <span>Constitutional Compliance</span>
              <span className={`metric-value ${getComplianceClass(supremeCourtData.overview.constitutionalCompliance)}`}>
                {supremeCourtData.overview.constitutionalCompliance}/100
              </span>
            </div>
            <div className="metric">
              <span>Judicial Independence</span>
              <span className={`metric-value ${getIndependenceClass(supremeCourtData.overview.judicialIndependence)}`}>
                {supremeCourtData.overview.judicialIndependence}/100
              </span>
            </div>
            <div className="metric">
              <span>Public Confidence</span>
              <span className={`metric-value ${getComplianceClass(supremeCourtData.overview.publicConfidence)}`}>
                {supremeCourtData.overview.publicConfidence}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${supremeCourtData.overview.constitutionalCompliance}%` }}
              ></div>
            </div>
          </div>

          {/* Constitutional Reviews */}
          <div className="panel">
            <h2>📋 Constitutional Reviews</h2>
            <div className="metric">
              <span>Awaiting Leader Decision</span>
              <span className="metric-value">{supremeCourtData.reviews.length}</span>
            </div>
            {supremeCourtData.reviews.map((review) => (
              <div key={review.id} className={`review-item review-${review.urgency}`}>
                <strong>{review.title}</strong><br />
                <small>{review.description}</small>
                <div className="review-status">
                  <span 
                    className="status-indicator"
                    style={{ backgroundColor: getComplianceColor(review.compliance) }}
                  ></span>
                  <small>{review.compliance.replace('_', ' ').toUpperCase()}</small>
                </div>
              </div>
            ))}
            <div className="action-buttons">
              <button className="btn" onClick={handleReviewConstitutional}>Review All</button>
              <button className="btn btn-success" onClick={handleCreateReview}>New Review</button>
            </div>
          </div>

          {/* Supreme Court Justices */}
          <div className="panel">
            <h2>👩‍⚖️ Supreme Court Justices</h2>
            <div className="metric">
              <span>Active Justices</span>
              <span className="metric-value">{supremeCourtData.justices.length}</span>
            </div>
            {supremeCourtData.justices.slice(0, 4).map((justice) => (
              <div key={justice.id} className="justice-item">
                <div>
                  <strong>{justice.isChief ? 'Chief Justice' : 'Justice'} {justice.name}</strong><br />
                  <small style={{ color: getPhilosophyColor(justice.philosophy) }}>
                    {justice.philosophy.replace('_', ' ')} • {justice.tenure} years tenure
                  </small>
                </div>
                <span className="metric-value">{justice.approval}%</span>
              </div>
            ))}
            <div className="action-buttons">
              <button className="btn" onClick={handleViewJustices}>All Justices</button>
              <button className="btn btn-secondary">Philosophies</button>
            </div>
          </div>

          {/* Legal Precedents */}
          <div className="panel">
            <h2>📚 Legal Precedents</h2>
            <div className="metric">
              <span>Active Precedents</span>
              <span className="metric-value">{supremeCourtData.precedents.length}</span>
            </div>
            {supremeCourtData.precedents.map((precedent) => (
              <div key={precedent.id} className="precedent-item">
                <div>
                  <strong>{precedent.caseName}</strong><br />
                  <small>{precedent.issue} - {precedent.year}</small>
                </div>
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: precedent.status === 'binding' ? '#27ae60' : '#f39c12' }}
                ></span>
              </div>
            ))}
            <div className="action-buttons">
              <button className="btn">Search Precedents</button>
              <button className="btn btn-secondary">Case Analysis</button>
            </div>
          </div>

          {/* Constitutional Interpretations */}
          <div className="panel">
            <h2>📜 Constitutional Interpretations</h2>
            <div className="metric">
              <span>Active Interpretations</span>
              <span className="metric-value">{supremeCourtData.interpretations.length}</span>
            </div>
            {supremeCourtData.interpretations.map((interpretation) => (
              <div key={interpretation.id} className="interpretation-item">
                <strong>{interpretation.provision}</strong><br />
                <small>{interpretation.scope}</small>
                <div className="interpretation-consensus">
                  <small>{interpretation.consensus}</small>
                </div>
              </div>
            ))}
            <div className="action-buttons">
              <button className="btn">View Interpretations</button>
              <button className="btn btn-secondary">Constitutional Analysis</button>
            </div>
          </div>

          {/* Leader Authority Panel */}
          <div className="panel leader-authority-panel">
            <h2>⚖️ Leader Authority & Constitutional Balance</h2>
            <div className="authority-grid">
              <div>
                <h3>🎯 Executive Constitutional Authority</h3>
                <div className="metric">
                  <span>Reviews Accepted</span>
                  <span className="metric-value">{supremeCourtData.interactions.acceptances}</span>
                </div>
                <div className="metric">
                  <span>Modifications Requested</span>
                  <span className="metric-value">{supremeCourtData.interactions.modifications}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                  <li>• Final constitutional authority</li>
                  <li>• Review acceptance/modification</li>
                  <li>• Constitutional interpretation</li>
                  <li>• Implementation oversight</li>
                </ul>
              </div>
              <div>
                <h3>⚖️ Judicial Independence & Expertise</h3>
                <div className="metric">
                  <span>Constitutional Consultations</span>
                  <span className="metric-value">{supremeCourtData.interactions.consultations}</span>
                </div>
                <div className="metric">
                  <span>Override Instances</span>
                  <span className="metric-value">{supremeCourtData.interactions.overrides}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                  <li>• Independent constitutional analysis</li>
                  <li>• Expert legal interpretation</li>
                  <li>• Precedent-based reasoning</li>
                  <li>• Rights protection evaluation</li>
                </ul>
              </div>
            </div>
            
            <div className="action-buttons" style={{ marginTop: '1.5rem' }}>
              <button className="btn" onClick={handleScheduleConsultation}>Constitutional Consultation</button>
              <button className="btn btn-secondary">Interaction History</button>
              <button className="btn btn-success" onClick={fetchSupremeCourtData}>Update Analytics</button>
            </div>
          </div>
        </div>
      </div>
    </BaseScreen>
  );
};

export default SupremeCourtScreen;
