import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
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
  const [activeTab, setActiveTab] = useState<string>('overview');
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

  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'reviews', label: 'Reviews', icon: '📋' },
    { id: 'justices', label: 'Justices', icon: '👩‍⚖️' },
    { id: 'precedents', label: 'Precedents', icon: '📚' },
    { id: 'relations', label: 'Relations', icon: '🤝' }
  ];

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'reviews':
        return renderReviewsTab();
      case 'justices':
        return renderJusticesTab();
      case 'precedents':
        return renderPrecedentsTab();
      case 'relations':
        return renderRelationsTab();
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => (
    <>
      {/* Constitutional Overview */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Pending Reviews</span>
          <span className="standard-metric-value">{supremeCourtData.overview.pendingReviews}</span>
        </div>
        <div className="standard-metric">
          <span>Leader Acceptance Rate</span>
          <span className="standard-metric-value">{supremeCourtData.overview.leaderAcceptanceRate}%</span>
        </div>
        <div className="standard-metric">
          <span>Constitutional Compliance</span>
          <span className={`standard-metric-value ${getComplianceClass(supremeCourtData.overview.constitutionalCompliance)}`}>
            {supremeCourtData.overview.constitutionalCompliance}/100
          </span>
        </div>
        <div className="standard-metric">
          <span>Judicial Independence</span>
          <span className={`standard-metric-value ${getIndependenceClass(supremeCourtData.overview.judicialIndependence)}`}>
            {supremeCourtData.overview.judicialIndependence}/100
          </span>
        </div>
        <div className="standard-metric">
          <span>Public Confidence</span>
          <span className={`standard-metric-value ${getComplianceClass(supremeCourtData.overview.publicConfidence)}`}>
            {supremeCourtData.overview.publicConfidence}%
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${supremeCourtData.overview.constitutionalCompliance}%` }}
          ></div>
        </div>
        <div className="standard-action-buttons">
          <button className="btn" onClick={handleReviewConstitutional}>Review Constitutional Issues</button>
          <button className="btn btn-secondary">Court Analytics</button>
        </div>
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(79, 172, 254, 0.1)', borderRadius: '8px', fontSize: '0.9rem' }}>
          <strong>📋 Current Cases:</strong> View active constitutional reviews in the <strong>Reviews</strong> tab<br/>
          <strong>📚 Legal Precedents:</strong> Browse established case law in the <strong>Precedents</strong> tab
        </div>
      </div>

      {/* Current Term Statistics */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Cases Heard This Term</span>
          <span className="standard-metric-value">47</span>
        </div>
        <div className="standard-metric">
          <span>Opinions Issued</span>
          <span className="standard-metric-value">42</span>
        </div>
        <div className="standard-metric">
          <span>Unanimous Decisions</span>
          <span className="standard-metric-value">28</span>
        </div>
        <div className="standard-metric">
          <span>Split Decisions</span>
          <span className="standard-metric-value">14</span>
        </div>
        <div className="standard-metric">
          <span>Constitutional Questions</span>
          <span className="standard-metric-value">8</span>
        </div>
        <div className="standard-action-buttons">
          <button className="btn">Term Statistics</button>
          <button className="btn btn-secondary">Case Calendar</button>
        </div>
      </div>

      {/* Judicial Philosophy Balance */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Originalist Justices</span>
          <span className="standard-metric-value">2</span>
        </div>
        <div className="standard-metric">
          <span>Living Constitution</span>
          <span className="standard-metric-value">2</span>
        </div>
        <div className="standard-metric">
          <span>Textualist Justices</span>
          <span className="standard-metric-value">2</span>
        </div>
        <div className="standard-metric">
          <span>Pragmatist Justices</span>
          <span className="standard-metric-value">1</span>
        </div>
        <div className="standard-action-buttons">
          <button className="btn">Philosophy Analysis</button>
          <button className="btn btn-secondary">Voting Patterns</button>
        </div>
      </div>
    </>
  );

  const renderReviewsTab = () => (
    <>
      {/* Constitutional Reviews Summary - First card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Active Reviews</span>
          <span className="standard-metric-value">{supremeCourtData.reviews.length}</span>
        </div>
        <div className="standard-metric">
          <span>Completed This Term</span>
          <span className="standard-metric-value">12</span>
        </div>
        <div className="standard-metric">
          <span>Average Review Time</span>
          <span className="standard-metric-value">45 days</span>
        </div>
        <div className="standard-metric">
          <span>Constitutional Challenges</span>
          <span className="standard-metric-value">3</span>
        </div>
        <div className="standard-action-buttons">
          <button className="btn" onClick={handleCreateReview}>Create Constitutional Review</button>
          <button className="btn btn-secondary">Review History</button>
        </div>
      </div>

      {/* Review Types - Second card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Law Reviews</span>
          <span className="standard-metric-value">{supremeCourtData.reviews.filter(r => r.type === 'law_review').length}</span>
        </div>
        <div className="standard-metric">
          <span>Policy Analysis</span>
          <span className="standard-metric-value">{supremeCourtData.reviews.filter(r => r.type === 'policy_analysis').length}</span>
        </div>
        <div className="standard-metric">
          <span>Amendment Reviews</span>
          <span className="standard-metric-value">{supremeCourtData.reviews.filter(r => r.type === 'amendment_review').length}</span>
        </div>
        <div className="standard-metric">
          <span>Emergency Powers</span>
          <span className="standard-metric-value">{supremeCourtData.reviews.filter(r => r.type === 'emergency_powers').length}</span>
        </div>
        <div className="standard-action-buttons">
          <button className="btn">Review Categories</button>
          <button className="btn btn-secondary">Priority Queue</button>
        </div>
      </div>

      {/* Current Reviews Table - Full width below the cards */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 Active Constitutional Reviews</h3>
        <div className="standard-table-container">
          <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Urgency</th>
              <th>Compliance</th>
              <th>Confidence</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supremeCourtData.reviews.map((review) => (
              <tr key={review.id}>
                <td>
                  <strong>{review.title}</strong>
                  <br />
                  <small style={{ color: '#a0a9ba' }}>{review.description}</small>
                </td>
                <td className="status-cell">{review.type.replace('_', ' ')}</td>
                <td className="status-cell">{review.urgency}</td>
                <td className="status-cell" style={{ color: getComplianceColor(review.compliance) }}>
                  {review.compliance.replace('_', ' ')}
                </td>
                <td className="number-cell">{review.confidence}/10</td>
                <td className="status-cell">{review.status}</td>
                <td className="action-cell">
                  <button className="btn">Details</button>
                  <button className="btn btn-secondary">Analysis</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );

  const renderJusticesTab = () => (
    <>
      {/* Supreme Court Justices Summary - First card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Total Justices</span>
          <span className="standard-metric-value">{supremeCourtData.justices.length}</span>
        </div>
        <div className="standard-metric">
          <span>Chief Justice</span>
          <span className="standard-metric-value">Elena Rodriguez</span>
        </div>
        <div className="standard-metric">
          <span>Average Tenure</span>
          <span className="standard-metric-value">6.5 years</span>
        </div>
        <div className="standard-metric">
          <span>Court Approval</span>
          <span className="standard-metric-value">74.5%</span>
        </div>
        <div className="standard-action-buttons">
          <button className="btn" onClick={handleViewJustices}>View Court Composition</button>
          <button className="btn btn-secondary">Justice Profiles</button>
        </div>
      </div>

      {/* Court Composition Analysis - Second card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Conservative Leaning</span>
          <span className="standard-metric-value">3</span>
        </div>
        <div className="standard-metric">
          <span>Liberal Leaning</span>
          <span className="standard-metric-value">2</span>
        </div>
        <div className="standard-metric">
          <span>Moderate/Swing</span>
          <span className="standard-metric-value">2</span>
        </div>
        <div className="standard-metric">
          <span>Court Balance</span>
          <span className="standard-metric-value">Slightly Conservative</span>
        </div>
        <div className="standard-action-buttons">
          <button className="btn">Ideological Analysis</button>
          <button className="btn btn-secondary">Confirmation History</button>
        </div>
      </div>

      {/* Justices Table - Full width below cards */}
      <div className="standard-panel government-theme table-panel">
        <div className="standard-table-container">
          <table className="data-table">
          <thead>
            <tr>
              <th>Justice</th>
              <th>Position</th>
              <th>Philosophy</th>
              <th>Tenure</th>
              <th>Approval</th>
              <th>Specializations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supremeCourtData.justices.map((justice) => (
              <tr key={justice.id}>
                <td>
                  <strong>{justice.name}</strong>
                </td>
                <td className="status-cell">
                  {justice.isChief ? '👑 Chief Justice' : 'Associate Justice'}
                </td>
                <td className="status-cell" style={{ color: getPhilosophyColor(justice.philosophy) }}>
                  {justice.philosophy.replace('_', ' ')}
                </td>
                <td className="number-cell">{justice.tenure} years</td>
                <td className="number-cell">{justice.approval}%</td>
                <td style={{ fontSize: '0.85rem' }}>
                  {justice.specialization.join(', ')}
                </td>
                <td className="action-cell">
                  <button className="btn">Profile</button>
                  <button className="btn btn-secondary">Voting</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>


    </>
  );

  const renderPrecedentsTab = () => (
    <>
      {/* Legal Precedents Summary - First card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Established Precedents</span>
          <span className="standard-metric-value">{supremeCourtData.precedents.length}</span>
        </div>
        <div className="standard-metric">
          <span>Recent Interpretations</span>
          <span className="standard-metric-value">{supremeCourtData.interpretations.length}</span>
        </div>
        <div className="standard-metric">
          <span>Constitutional Amendments</span>
          <span className="standard-metric-value">2</span>
        </div>
        <div className="standard-metric">
          <span>Landmark Cases</span>
          <span className="standard-metric-value">8</span>
        </div>
        <div className="standard-action-buttons">
          <button className="btn">Precedent Database</button>
          <button className="btn btn-secondary">Case Law Search</button>
        </div>
      </div>

      {/* Precedent Impact Analysis - Second card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Binding Precedents</span>
          <span className="standard-metric-value">{supremeCourtData.precedents.filter(p => p.status === 'binding').length}</span>
        </div>
        <div className="standard-metric">
          <span>Persuasive Precedents</span>
          <span className="standard-metric-value">{supremeCourtData.precedents.filter(p => p.status === 'persuasive').length}</span>
        </div>
        <div className="standard-metric">
          <span>Overruled Cases</span>
          <span className="standard-metric-value">{supremeCourtData.precedents.filter(p => p.status === 'overruled').length}</span>
        </div>
        <div className="standard-metric">
          <span>Recent Citations</span>
          <span className="standard-metric-value">156</span>
        </div>
        <div className="standard-action-buttons">
          <button className="btn">Impact Analysis</button>
          <button className="btn btn-secondary">Citation History</button>
        </div>
      </div>

      {/* Major Precedents Table - Full width below cards */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>Major Legal Precedents</h3>
        <div className="standard-table-container">
          <table className="data-table">
          <thead>
            <tr>
              <th>Case Name</th>
              <th>Year</th>
              <th>Issue</th>
              <th>Holding</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supremeCourtData.precedents.map((precedent) => (
              <tr key={precedent.id}>
                <td>
                  <strong>{precedent.caseName}</strong>
                  <br />
                  <small style={{ color: '#a0a9ba' }}>{precedent.impact}</small>
                </td>
                <td className="number-cell">{precedent.year}</td>
                <td style={{ fontSize: '0.9rem' }}>{precedent.issue}</td>
                <td style={{ fontSize: '0.9rem' }}>{precedent.holding}</td>
                <td className="status-cell" style={{ 
                  color: precedent.status === 'binding' ? '#27ae60' : 
                         precedent.status === 'persuasive' ? '#f39c12' : '#e74c3c' 
                }}>
                  {precedent.status}
                </td>
                <td className="action-cell">
                  <button className="btn">Opinion</button>
                  <button className="btn btn-secondary">Citations</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Constitutional Interpretations Table */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>Constitutional Interpretations</h3>
        <div className="standard-table-container">
          <table className="data-table">
          <thead>
            <tr>
              <th>Provision</th>
              <th>Scope</th>
              <th>Approach</th>
              <th>Consensus</th>
              <th>Application</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supremeCourtData.interpretations.map((interpretation) => (
              <tr key={interpretation.id}>
                <td>
                  <strong>{interpretation.provision}</strong>
                </td>
                <td style={{ fontSize: '0.9rem' }}>{interpretation.scope}</td>
                <td style={{ fontSize: '0.9rem' }}>{interpretation.approach}</td>
                <td className="status-cell">{interpretation.consensus}</td>
                <td style={{ fontSize: '0.9rem' }}>{interpretation.application}</td>
                <td className="action-cell">
                  <button className="btn">Details</button>
                  <button className="btn btn-secondary">Analysis</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Precedent Statistics */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Binding Precedents</span>
          <span className="standard-metric-value">{supremeCourtData.precedents.filter(p => p.status === 'binding').length}</span>
        </div>
        <div className="standard-metric">
          <span>Persuasive Authority</span>
          <span className="standard-metric-value">{supremeCourtData.precedents.filter(p => p.status === 'persuasive').length}</span>
        </div>
        <div className="standard-metric">
          <span>Overruled Cases</span>
          <span className="standard-metric-value">{supremeCourtData.precedents.filter(p => p.status === 'overruled').length}</span>
        </div>
        <div className="standard-metric">
          <span>Recent Developments</span>
          <span className="standard-metric-value">5</span>
        </div>
        <div className="standard-action-buttons">
          <button className="btn">Precedent Trends</button>
          <button className="btn btn-secondary">Legal Evolution</button>
        </div>
      </div>
    </>
  );

  const renderRelationsTab = () => (
    <>
      {/* Leader Authority & Constitutional Balance */}
      <div className="standard-panel government-theme">
        <div className="authority-grid">
          <div className="authority-section">
            <h4>🎯 Leader Authority</h4>
            <ul>
              <li>Executive power within constitutional bounds</li>
              <li>Emergency authority with judicial oversight</li>
              <li>Policy implementation with legal review</li>
              <li>Final decision authority on all matters</li>
            </ul>
          </div>
          <div className="authority-section">
            <h4>⚖️ Constitutional Safeguards</h4>
            <ul>
              <li>Independent judicial review process</li>
              <li>Constitutional compliance monitoring</li>
              <li>Rights protection evaluation</li>
              <li>Legal precedent establishment</li>
            </ul>
          </div>
        </div>
        <div className="interaction-metrics">
          <div className="standard-metric">
            <span>Consultations</span>
            <span className="standard-metric-value">{supremeCourtData.interactions.consultations}</span>
          </div>
          <div className="standard-metric">
            <span>Acceptances</span>
            <span className="standard-metric-value">{supremeCourtData.interactions.acceptances}</span>
          </div>
          <div className="standard-metric">
            <span>Modifications</span>
            <span className="standard-metric-value">{supremeCourtData.interactions.modifications}</span>
          </div>
          <div className="standard-metric">
            <span>Overrides</span>
            <span className="standard-metric-value">{supremeCourtData.interactions.overrides}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="btn" onClick={handleScheduleConsultation}>Constitutional Consultation</button>
          <button className="btn btn-secondary">Interaction History</button>
          <button className="btn btn-success" onClick={fetchSupremeCourtData}>Update Analytics</button>
        </div>
      </div>

      {/* Executive-Judicial Relations */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Relationship Status</span>
          <span className="standard-metric-value">Cooperative</span>
        </div>
        <div className="standard-metric">
          <span>Constitutional Disputes</span>
          <span className="standard-metric-value">2</span>
        </div>
        <div className="standard-metric">
          <span>Advisory Opinions</span>
          <span className="standard-metric-value">7</span>
        </div>
        <div className="standard-metric">
          <span>Emergency Consultations</span>
          <span className="standard-metric-value">3</span>
        </div>
        <div className="standard-metric">
          <span>Judicial Deference Rate</span>
          <span className="standard-metric-value">78%</span>
        </div>
        <div className="standard-action-buttons">
          <button className="btn">Relationship Analysis</button>
          <button className="btn btn-secondary">Dispute Resolution</button>
        </div>
      </div>

      {/* Recent Interactions */}
      <div className="panel">
        <div className="metric">
          <span>Last Consultation</span>
          <span className="metric-value">3 days ago</span>
        </div>
        <div className="metric">
          <span>Topic</span>
          <span className="metric-value">Emergency Powers Review</span>
        </div>
        <div className="metric">
          <span>Outcome</span>
          <span className="metric-value">Recommendations Provided</span>
        </div>
        <div className="metric">
          <span>Next Scheduled Meeting</span>
          <span className="metric-value">Weekly Briefing - Tomorrow</span>
        </div>
        <div className="action-buttons">
          <button className="btn">Meeting Schedule</button>
          <button className="btn btn-secondary">Consultation Log</button>
        </div>
      </div>

      {/* Constitutional Balance Metrics */}
      <div className="panel">
        <div className="metric">
          <span>Separation of Powers Score</span>
          <span className="metric-value">85/100</span>
        </div>
        <div className="metric">
          <span>Checks & Balances Health</span>
          <span className="metric-value">Strong</span>
        </div>
        <div className="metric">
          <span>Constitutional Tension Level</span>
          <span className="metric-value">Low</span>
        </div>
        <div className="metric">
          <span>Institutional Respect</span>
          <span className="metric-value">High</span>
        </div>
        <div className="action-buttons">
          <button className="btn">Balance Assessment</button>
          <button className="btn btn-secondary">Historical Trends</button>
        </div>
      </div>

      {/* Communication Channels */}
      <div className="panel">
        <div className="metric">
          <span>Direct Communications</span>
          <span className="metric-value">15 this month</span>
        </div>
        <div className="metric">
          <span>Formal Requests</span>
          <span className="metric-value">8</span>
        </div>
        <div className="metric">
          <span>Informal Consultations</span>
          <span className="metric-value">7</span>
        </div>
        <div className="metric">
          <span>Response Time (Avg)</span>
          <span className="metric-value">2.3 days</span>
        </div>
        <div className="action-buttons">
          <button className="btn">Communication Log</button>
          <button className="btn btn-secondary">Protocol Guidelines</button>
        </div>
      </div>
    </>
  );

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchSupremeCourtData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="standard-screen-container government-theme">
        {loading && <div className="loading-overlay">Loading Supreme Court data...</div>}
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {renderTabContent()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default SupremeCourtScreen;
