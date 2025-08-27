import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './TreasuryScreen.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface TreasurySecretary {
  id: string;
  name: string;
  title: string;
  experience: number;
  specialization: string[];
  approval: number;
  tenure: string;
  background: string;
  achievements: string[];
}

interface GovernmentFinances {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  budgetUtilization: number;
}

interface TaxLineItem {
  id: string;
  name: string;
  category: 'income' | 'corporate' | 'property' | 'sales' | 'excise' | 'tariff' | 'other';
  amount: number;
  rate: number;
  baseAmount: number;
  collectionEfficiency: number;
  source: string;
  region?: string;
  demographic?: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  monthlyChange: number;
  yearOverYear: number;
  description: string;
}

interface TaxCategory {
  category: 'income' | 'corporate' | 'property' | 'sales' | 'excise' | 'tariff' | 'other';
  name: string;
  totalAmount: number;
  lineItems: TaxLineItem[];
  collectionEfficiency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  monthlyChange: number;
}

interface RevenueStreams {
  taxRevenue: number;
  collectionEfficiency: number;
  corporateTax: number;
  individualTax: number;
  tradeTariffs: number;
  otherRevenue: number;
  
  // Enhanced tax revenue details
  taxCategories: TaxCategory[];
  totalTaxLineItems: TaxLineItem[];
  geographicBreakdown: {
    region: string;
    amount: number;
    percentage: number;
    efficiency: number;
  }[];
  demographicBreakdown: {
    demographic: string;
    amount: number;
    percentage: number;
    averageRate: number;
  }[];
  monthlyTaxTrends: {
    month: string;
    totalTax: number;
    categories: { [category: string]: number };
  }[];
}

interface DepartmentBudget {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilization: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  lastUpdate: string;
  projects: number;
}

interface SpendingRequest {
  id: string;
  department: string;
  title: string;
  amount: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  requestDate: string;
  justification: string;
  category: string;
  expectedOutcome: string;
  timeline: string;
}

interface BudgetAnalytics {
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    spending: number;
    surplus: number;
  }>;
  departmentPerformance: Array<{
    department: string;
    efficiency: number;
    variance: number;
    trend: 'improving' | 'stable' | 'declining';
  }>;
  riskFactors: Array<{
    factor: string;
    impact: 'high' | 'medium' | 'low';
    probability: number;
    mitigation: string;
  }>;
}

interface EconomicForecast {
  gdpGrowth: number;
  inflationRate: number;
  unemploymentRate: number;
  projectedRevenue: number;
  projectedSpending: number;
  budgetBalance: number;
  confidenceLevel: number;
  keyAssumptions: string[];
  scenarios: Array<{
    name: string;
    probability: number;
    impact: string;
    budgetEffect: number;
  }>;
}

interface TreasuryData {
  secretary: TreasurySecretary | null;
  finances: GovernmentFinances;
  revenue: RevenueStreams;
  departments: DepartmentBudget[];
  spendingRequests: SpendingRequest[];
  analytics: BudgetAnalytics;
  forecasting: EconomicForecast;
}

const TreasuryScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [treasuryData, setTreasuryData] = useState<TreasuryData | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tax-revenue' | 'departments' | 'rollup' | 'requests' | 'analytics' | 'forecasting'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/treasury/secretary', description: 'Get treasury secretary information' },
    { method: 'GET', path: '/api/treasury/finances', description: 'Get government financial overview' },
    { method: 'GET', path: '/api/treasury/revenue', description: 'Get revenue streams data' },
    { method: 'GET', path: '/api/treasury/departments', description: 'Get department budget allocations' },
    { method: 'GET', path: '/api/treasury/spending-requests', description: 'Get pending spending requests' },
    { method: 'GET', path: '/api/treasury/analytics', description: 'Get budget analytics and trends' },
    { method: 'GET', path: '/api/treasury/forecasting', description: 'Get economic forecasts' },
    { method: 'POST', path: '/api/treasury/approve-request', description: 'Approve spending request' },
    { method: 'POST', path: '/api/treasury/allocate-budget', description: 'Allocate budget to department' },
    { method: 'PUT', path: '/api/treasury/update-forecast', description: 'Update economic forecast' },
    { method: 'DELETE', path: '/api/treasury/reject-request', description: 'Reject spending request' }
  ];

  const fetchTreasuryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        secretaryRes,
        financesRes,
        revenueRes,
        departmentsRes,
        requestsRes,
        analyticsRes,
        forecastingRes
      ] = await Promise.all([
        fetch('/api/treasury/secretary'),
        fetch('/api/treasury/finances'),
        fetch('/api/treasury/revenue'),
        fetch('/api/treasury/departments'),
        fetch('/api/treasury/spending-requests'),
        fetch('/api/treasury/analytics'),
        fetch('/api/treasury/forecasting')
      ]);

      const [
        secretary,
        finances,
        revenue,
        departments,
        requests,
        analytics,
        forecasting
      ] = await Promise.all([
        secretaryRes.json(),
        financesRes.json(),
        revenueRes.json(),
        departmentsRes.json(),
        requestsRes.json(),
        analyticsRes.json(),
        forecastingRes.json()
      ]);

      setTreasuryData({
        secretary: secretary.secretary || generateMockSecretary(),
        finances: finances.finances || generateMockFinances(),
        revenue: revenue.revenue || generateMockRevenue(),
        departments: departments.departments || generateMockDepartments(),
        spendingRequests: requests.requests || generateMockRequests(),
        analytics: analytics.analytics || generateMockAnalytics(),
        forecasting: forecasting.forecasting || generateMockForecasting()
      });
    } catch (err) {
      console.error('Failed to fetch treasury data:', err);
      // Use mock data as fallback
      setTreasuryData({
        secretary: generateMockSecretary(),
        finances: generateMockFinances(),
        revenue: generateMockRevenue(),
        departments: generateMockDepartments(),
        spendingRequests: generateMockRequests(),
        analytics: generateMockAnalytics(),
        forecasting: generateMockForecasting()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTreasuryData();
  }, [fetchTreasuryData]);

  const generateMockSecretary = (): TreasurySecretary => ({
    id: 'sec-1',
    name: 'Dr. Sarah Chen',
    title: 'Secretary of the Treasury',
    experience: 15,
    specialization: ['Fiscal Policy', 'Economic Analysis', 'Public Finance', 'Monetary Policy'],
    approval: 78,
    tenure: '2022-Present',
    background: 'Former Chief Economist at Federal Reserve, PhD in Economics from MIT, 20 years in public service',
    achievements: ['Reduced national debt by 8%', 'Implemented tax reform', 'Modernized treasury systems', 'Improved budget transparency']
  });

  const generateMockFinances = (): GovernmentFinances => ({
    totalBudget: 4500000000000,
    totalSpent: 3200000000000,
    totalRemaining: 1300000000000,
    budgetUtilization: 71.1
  });

  const generateMockRevenue = (): RevenueStreams => {
    const taxLineItems: TaxLineItem[] = [
      // Income Tax Line Items
      {
        id: 'income_federal',
        name: 'Federal Income Tax',
        category: 'income',
        amount: 1800000000000,
        rate: 22.5,
        baseAmount: 8000000000000,
        collectionEfficiency: 96.2,
        source: 'Individual Taxpayers',
        trend: 'increasing',
        monthlyChange: 2.1,
        yearOverYear: 8.3,
        description: 'Primary federal income tax collected from individual taxpayers'
      },
      {
        id: 'income_payroll',
        name: 'Payroll Tax (Social Security)',
        category: 'income',
        amount: 300000000000,
        rate: 6.2,
        baseAmount: 4838709677419,
        collectionEfficiency: 98.7,
        source: 'Employers & Employees',
        trend: 'stable',
        monthlyChange: 0.3,
        yearOverYear: 3.2,
        description: 'Social Security payroll tax contributions'
      },
      
      // Corporate Tax Line Items
      {
        id: 'corp_federal',
        name: 'Federal Corporate Income Tax',
        category: 'corporate',
        amount: 800000000000,
        rate: 21.0,
        baseAmount: 3809523809524,
        collectionEfficiency: 91.5,
        source: 'Corporations',
        trend: 'increasing',
        monthlyChange: 3.7,
        yearOverYear: 12.1,
        description: 'Corporate income tax from domestic and foreign corporations'
      },
      {
        id: 'corp_capital_gains',
        name: 'Corporate Capital Gains Tax',
        category: 'corporate',
        amount: 400000000000,
        rate: 15.0,
        baseAmount: 2666666666667,
        collectionEfficiency: 89.3,
        source: 'Corporate Investments',
        trend: 'increasing',
        monthlyChange: 5.2,
        yearOverYear: 18.7,
        description: 'Tax on corporate capital gains and investment income'
      },
      
      // Property Tax Line Items
      {
        id: 'property_residential',
        name: 'Residential Property Tax',
        category: 'property',
        amount: 200000000000,
        rate: 1.2,
        baseAmount: 16666666666667,
        collectionEfficiency: 94.8,
        source: 'Homeowners',
        region: 'All Regions',
        trend: 'increasing',
        monthlyChange: 1.8,
        yearOverYear: 5.4,
        description: 'Property tax on residential real estate'
      },
      {
        id: 'property_commercial',
        name: 'Commercial Property Tax',
        category: 'property',
        amount: 150000000000,
        rate: 2.1,
        baseAmount: 7142857142857,
        collectionEfficiency: 92.1,
        source: 'Commercial Property Owners',
        region: 'Urban Centers',
        trend: 'stable',
        monthlyChange: 0.7,
        yearOverYear: 2.9,
        description: 'Property tax on commercial and industrial real estate'
      },
      
      // Sales Tax Line Items
      {
        id: 'sales_general',
        name: 'General Sales Tax',
        category: 'sales',
        amount: 180000000000,
        rate: 7.5,
        baseAmount: 2400000000000,
        collectionEfficiency: 93.4,
        source: 'Retail Transactions',
        trend: 'increasing',
        monthlyChange: 2.3,
        yearOverYear: 6.8,
        description: 'General sales tax on goods and services'
      },
      {
        id: 'sales_luxury',
        name: 'Luxury Goods Tax',
        category: 'sales',
        amount: 45000000000,
        rate: 15.0,
        baseAmount: 300000000000,
        collectionEfficiency: 87.2,
        source: 'Luxury Retailers',
        demographic: 'High Income',
        trend: 'increasing',
        monthlyChange: 4.1,
        yearOverYear: 15.3,
        description: 'Additional tax on luxury goods and services'
      },
      
      // Excise Tax Line Items
      {
        id: 'excise_fuel',
        name: 'Fuel Excise Tax',
        category: 'excise',
        amount: 75000000000,
        rate: 18.4,
        baseAmount: 407608695652,
        collectionEfficiency: 96.8,
        source: 'Fuel Distributors',
        trend: 'decreasing',
        monthlyChange: -1.2,
        yearOverYear: -3.8,
        description: 'Excise tax on gasoline and diesel fuel'
      },
      {
        id: 'excise_tobacco',
        name: 'Tobacco Excise Tax',
        category: 'excise',
        amount: 25000000000,
        rate: 50.0,
        baseAmount: 50000000000,
        collectionEfficiency: 91.7,
        source: 'Tobacco Companies',
        trend: 'decreasing',
        monthlyChange: -2.8,
        yearOverYear: -8.9,
        description: 'Excise tax on tobacco products'
      },
      {
        id: 'excise_alcohol',
        name: 'Alcohol Excise Tax',
        category: 'excise',
        amount: 35000000000,
        rate: 25.0,
        baseAmount: 140000000000,
        collectionEfficiency: 94.3,
        source: 'Alcohol Producers',
        trend: 'stable',
        monthlyChange: 0.5,
        yearOverYear: 1.2,
        description: 'Excise tax on alcoholic beverages'
      },
      
      // Tariff Line Items
      {
        id: 'tariff_imports',
        name: 'Import Tariffs',
        category: 'tariff',
        amount: 280000000000,
        rate: 12.5,
        baseAmount: 2240000000000,
        collectionEfficiency: 97.1,
        source: 'Import Transactions',
        trend: 'increasing',
        monthlyChange: 3.2,
        yearOverYear: 11.7,
        description: 'Tariffs on imported goods and materials'
      },
      {
        id: 'tariff_anti_dumping',
        name: 'Anti-Dumping Duties',
        category: 'tariff',
        amount: 70000000000,
        rate: 35.0,
        baseAmount: 200000000000,
        collectionEfficiency: 89.4,
        source: 'Specific Import Categories',
        trend: 'stable',
        monthlyChange: 0.8,
        yearOverYear: 2.1,
        description: 'Anti-dumping duties on specific imported products'
      },
      
      // Other Revenue Line Items
      {
        id: 'other_licenses',
        name: 'Business Licenses & Permits',
        category: 'other',
        amount: 50000000000,
        rate: 0,
        baseAmount: 0,
        collectionEfficiency: 95.6,
        source: 'Business Registrations',
        trend: 'increasing',
        monthlyChange: 1.9,
        yearOverYear: 7.2,
        description: 'Revenue from business licenses and permits'
      },
      {
        id: 'other_fines',
        name: 'Fines & Penalties',
        category: 'other',
        amount: 60000000000,
        rate: 0,
        baseAmount: 0,
        collectionEfficiency: 78.3,
        source: 'Legal Penalties',
        trend: 'stable',
        monthlyChange: -0.3,
        yearOverYear: 1.8,
        description: 'Revenue from fines, penalties, and legal settlements'
      },
      {
        id: 'other_investment',
        name: 'Government Investment Returns',
        category: 'other',
        amount: 40000000000,
        rate: 0,
        baseAmount: 0,
        collectionEfficiency: 100.0,
        source: 'Investment Portfolio',
        trend: 'increasing',
        monthlyChange: 2.7,
        yearOverYear: 9.4,
        description: 'Returns on government investment portfolio'
      }
    ];

    // Group line items by category
    const taxCategories: TaxCategory[] = [
      {
        category: 'income',
        name: 'Income Tax',
        totalAmount: taxLineItems.filter(item => item.category === 'income').reduce((sum, item) => sum + item.amount, 0),
        lineItems: taxLineItems.filter(item => item.category === 'income'),
        collectionEfficiency: 97.2,
        trend: 'increasing',
        monthlyChange: 1.8
      },
      {
        category: 'corporate',
        name: 'Corporate Tax',
        totalAmount: taxLineItems.filter(item => item.category === 'corporate').reduce((sum, item) => sum + item.amount, 0),
        lineItems: taxLineItems.filter(item => item.category === 'corporate'),
        collectionEfficiency: 90.4,
        trend: 'increasing',
        monthlyChange: 4.2
      },
      {
        category: 'property',
        name: 'Property Tax',
        totalAmount: taxLineItems.filter(item => item.category === 'property').reduce((sum, item) => sum + item.amount, 0),
        lineItems: taxLineItems.filter(item => item.category === 'property'),
        collectionEfficiency: 93.6,
        trend: 'increasing',
        monthlyChange: 1.3
      },
      {
        category: 'sales',
        name: 'Sales Tax',
        totalAmount: taxLineItems.filter(item => item.category === 'sales').reduce((sum, item) => sum + item.amount, 0),
        lineItems: taxLineItems.filter(item => item.category === 'sales'),
        collectionEfficiency: 91.8,
        trend: 'increasing',
        monthlyChange: 2.8
      },
      {
        category: 'excise',
        name: 'Excise Tax',
        totalAmount: taxLineItems.filter(item => item.category === 'excise').reduce((sum, item) => sum + item.amount, 0),
        lineItems: taxLineItems.filter(item => item.category === 'excise'),
        collectionEfficiency: 94.3,
        trend: 'decreasing',
        monthlyChange: -1.2
      },
      {
        category: 'tariff',
        name: 'Tariffs & Duties',
        totalAmount: taxLineItems.filter(item => item.category === 'tariff').reduce((sum, item) => sum + item.amount, 0),
        lineItems: taxLineItems.filter(item => item.category === 'tariff'),
        collectionEfficiency: 94.8,
        trend: 'increasing',
        monthlyChange: 2.5
      },
      {
        category: 'other',
        name: 'Other Revenue',
        totalAmount: taxLineItems.filter(item => item.category === 'other').reduce((sum, item) => sum + item.amount, 0),
        lineItems: taxLineItems.filter(item => item.category === 'other'),
        collectionEfficiency: 89.7,
        trend: 'stable',
        monthlyChange: 1.1
      }
    ];

    const totalTaxRevenue = taxLineItems.reduce((sum, item) => sum + item.amount, 0);

    return {
      taxRevenue: totalTaxRevenue,
      collectionEfficiency: 94.2,
      corporateTax: taxCategories.find(cat => cat.category === 'corporate')?.totalAmount || 1200000000000,
      individualTax: taxCategories.find(cat => cat.category === 'income')?.totalAmount || 2100000000000,
      tradeTariffs: taxCategories.find(cat => cat.category === 'tariff')?.totalAmount || 350000000000,
      otherRevenue: taxCategories.find(cat => cat.category === 'other')?.totalAmount || 150000000000,
      
      // Enhanced tax revenue details
      taxCategories,
      totalTaxLineItems: taxLineItems,
      geographicBreakdown: [
        { region: 'Capital Region', amount: 1200000000000, percentage: 31.6, efficiency: 96.8 },
        { region: 'Industrial Sector', amount: 950000000000, percentage: 25.0, efficiency: 93.2 },
        { region: 'Agricultural Zones', amount: 480000000000, percentage: 12.6, efficiency: 89.7 },
        { region: 'Coastal Cities', amount: 720000000000, percentage: 18.9, efficiency: 95.1 },
        { region: 'Mining Districts', amount: 450000000000, percentage: 11.9, efficiency: 91.4 }
      ],
      demographicBreakdown: [
        { demographic: 'High Income (>$200K)', amount: 1520000000000, percentage: 40.0, averageRate: 28.5 },
        { demographic: 'Middle Income ($50K-$200K)', amount: 1596000000000, percentage: 42.0, averageRate: 18.2 },
        { demographic: 'Lower Income (<$50K)', amount: 380000000000, percentage: 10.0, averageRate: 8.7 },
        { demographic: 'Corporate Entities', amount: 304000000000, percentage: 8.0, averageRate: 21.0 }
      ],
      monthlyTaxTrends: [
        {
          month: 'Jan 2024',
          totalTax: 310000000000,
          categories: { income: 175000000000, corporate: 95000000000, property: 25000000000, sales: 15000000000 }
        },
        {
          month: 'Feb 2024',
          totalTax: 295000000000,
          categories: { income: 165000000000, corporate: 85000000000, property: 28000000000, sales: 17000000000 }
        },
        {
          month: 'Mar 2024',
          totalTax: 325000000000,
          categories: { income: 185000000000, corporate: 105000000000, property: 22000000000, sales: 13000000000 }
        },
        {
          month: 'Apr 2024',
          totalTax: 420000000000,
          categories: { income: 240000000000, corporate: 140000000000, property: 25000000000, sales: 15000000000 }
        },
        {
          month: 'May 2024',
          totalTax: 335000000000,
          categories: { income: 190000000000, corporate: 110000000000, property: 20000000000, sales: 15000000000 }
        },
        {
          month: 'Jun 2024',
          totalTax: 340000000000,
          categories: { income: 195000000000, corporate: 115000000000, property: 18000000000, sales: 12000000000 }
        }
      ]
    };
  };

  const generateMockDepartments = (): DepartmentBudget[] => [
    {
      id: 'dept-1',
      name: 'Defense',
      allocated: 800000000000,
      spent: 580000000000,
      remaining: 220000000000,
      utilization: 72.5,
      priority: 'critical',
      category: 'Security',
      lastUpdate: '2024-02-20',
      projects: 45
    },
    {
      id: 'dept-2',
      name: 'Health & Human Services',
      allocated: 1200000000000,
      spent: 950000000000,
      remaining: 250000000000,
      utilization: 79.2,
      priority: 'critical',
      category: 'Social',
      lastUpdate: '2024-02-19',
      projects: 67
    },
    {
      id: 'dept-3',
      name: 'Education',
      allocated: 600000000000,
      spent: 420000000000,
      remaining: 180000000000,
      utilization: 70.0,
      priority: 'high',
      category: 'Social',
      lastUpdate: '2024-02-18',
      projects: 32
    },
    {
      id: 'dept-4',
      name: 'Transportation',
      allocated: 450000000000,
      spent: 320000000000,
      remaining: 130000000000,
      utilization: 71.1,
      priority: 'high',
      category: 'Infrastructure',
      lastUpdate: '2024-02-17',
      projects: 28
    },
    {
      id: 'dept-5',
      name: 'Energy',
      allocated: 350000000000,
      spent: 240000000000,
      remaining: 110000000000,
      utilization: 68.6,
      priority: 'medium',
      category: 'Infrastructure',
      lastUpdate: '2024-02-16',
      projects: 19
    },
    {
      id: 'dept-6',
      name: 'Agriculture',
      allocated: 280000000000,
      spent: 195000000000,
      remaining: 85000000000,
      utilization: 69.6,
      priority: 'medium',
      category: 'Economic',
      lastUpdate: '2024-02-15',
      projects: 15
    }
  ];

  const generateMockRequests = (): SpendingRequest[] => [
    {
      id: 'req-1',
      department: 'Defense',
      title: 'Advanced Weapons System Upgrade',
      amount: 25000000000,
      priority: 'urgent',
      status: 'pending',
      requestDate: '2024-02-20',
      justification: 'Critical security upgrade to maintain technological superiority',
      category: 'Equipment',
      expectedOutcome: 'Enhanced defense capabilities and deterrence',
      timeline: '18 months'
    },
    {
      id: 'req-2',
      department: 'Health & Human Services',
      title: 'Pandemic Preparedness Initiative',
      amount: 15000000000,
      priority: 'high',
      status: 'under_review',
      requestDate: '2024-02-19',
      justification: 'Strengthen healthcare infrastructure for future health emergencies',
      category: 'Infrastructure',
      expectedOutcome: 'Improved pandemic response capabilities',
      timeline: '24 months'
    },
    {
      id: 'req-3',
      department: 'Education',
      title: 'Digital Learning Platform Expansion',
      amount: 8000000000,
      priority: 'high',
      status: 'approved',
      requestDate: '2024-02-18',
      justification: 'Modernize education delivery and improve access to quality education',
      category: 'Technology',
      expectedOutcome: 'Enhanced educational outcomes and accessibility',
      timeline: '12 months'
    },
    {
      id: 'req-4',
      department: 'Transportation',
      title: 'High-Speed Rail Network Phase 2',
      amount: 45000000000,
      priority: 'medium',
      status: 'pending',
      requestDate: '2024-02-17',
      justification: 'Expand sustainable transportation infrastructure',
      category: 'Infrastructure',
      expectedOutcome: 'Reduced carbon emissions and improved connectivity',
      timeline: '36 months'
    }
  ];

  const generateMockAnalytics = (): BudgetAnalytics => ({
    monthlyTrends: [
      { month: 'Jan 2024', revenue: 320000000000, spending: 280000000000, surplus: 40000000000 },
      { month: 'Feb 2024', revenue: 315000000000, spending: 290000000000, surplus: 25000000000 },
      { month: 'Mar 2024', revenue: 335000000000, spending: 295000000000, surplus: 40000000000 },
      { month: 'Apr 2024', revenue: 340000000000, spending: 310000000000, surplus: 30000000000 },
      { month: 'May 2024', revenue: 350000000000, spending: 320000000000, surplus: 30000000000 },
      { month: 'Jun 2024', revenue: 345000000000, spending: 315000000000, surplus: 30000000000 }
    ],
    departmentPerformance: [
      { department: 'Defense', efficiency: 87.5, variance: -2.3, trend: 'stable' },
      { department: 'Health & Human Services', efficiency: 92.1, variance: 3.8, trend: 'improving' },
      { department: 'Education', efficiency: 89.3, variance: 1.2, trend: 'improving' },
      { department: 'Transportation', efficiency: 85.7, variance: -1.8, trend: 'declining' },
      { department: 'Energy', efficiency: 91.2, variance: 4.5, trend: 'improving' },
      { department: 'Agriculture', efficiency: 88.9, variance: 0.7, trend: 'stable' }
    ],
    riskFactors: [
      {
        factor: 'Economic Recession',
        impact: 'high',
        probability: 25,
        mitigation: 'Maintain emergency reserves and flexible spending policies'
      },
      {
        factor: 'Interest Rate Changes',
        impact: 'medium',
        probability: 60,
        mitigation: 'Diversify debt portfolio and monitor Federal Reserve policy'
      },
      {
        factor: 'Geopolitical Tensions',
        impact: 'high',
        probability: 35,
        mitigation: 'Increase defense spending flexibility and strategic reserves'
      }
    ]
  });

  const generateMockForecasting = (): EconomicForecast => ({
    gdpGrowth: 2.8,
    inflationRate: 2.1,
    unemploymentRate: 3.7,
    projectedRevenue: 4200000000000,
    projectedSpending: 4100000000000,
    budgetBalance: 100000000000,
    confidenceLevel: 78,
    keyAssumptions: [
      'Stable economic growth continues',
      'No major geopolitical disruptions',
      'Tax collection efficiency remains high',
      'Interest rates remain relatively stable'
    ],
    scenarios: [
      {
        name: 'Optimistic Growth',
        probability: 30,
        impact: 'GDP growth exceeds 3.5%, higher tax revenues',
        budgetEffect: 150000000000
      },
      {
        name: 'Economic Slowdown',
        probability: 25,
        impact: 'GDP growth below 2%, reduced tax revenues',
        budgetEffect: -200000000000
      },
      {
        name: 'Baseline Scenario',
        probability: 45,
        impact: 'Moderate growth as projected',
        budgetEffect: 0
      }
    ]
  });

  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved': return '#4ade80';
      case 'pending': return '#fbbf24';
      case 'under_review': return '#3b82f6';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent':
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'improving': return '#22c55e';
      case 'stable': return '#eab308';
      case 'declining': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchTreasuryData}
    >
      <div className="treasury-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`tab ${activeTab === 'tax-revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('tax-revenue')}
          >
            💰 Tax Revenue
          </button>
          <button 
            className={`tab ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            🏛️ Departments
          </button>
          <button 
            className={`tab ${activeTab === 'rollup' ? 'active' : ''}`}
            onClick={() => setActiveTab('rollup')}
          >
            📋 Budget Rollup
          </button>
          <button 
            className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            📝 Spending Requests
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
          <button 
            className={`tab ${activeTab === 'forecasting' ? 'active' : ''}`}
            onClick={() => setActiveTab('forecasting')}
          >
            🔮 Forecasting
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading treasury data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && treasuryData && (
            <>
              {activeTab === 'dashboard' && (
                <div className="dashboard-tab">
                  <div className="dashboard-grid">
                    <div className="finance-card">
                      <h4>💰 Government Finances</h4>
                      <div className="finance-metrics">
                        <div className="finance-metric">
                          <span>Total Budget:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.finances.totalBudget)}</span>
                        </div>
                        <div className="finance-metric">
                          <span>Total Spent:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.finances.totalSpent)}</span>
                        </div>
                        <div className="finance-metric">
                          <span>Remaining:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.finances.totalRemaining)}</span>
                        </div>
                        <div className="budget-utilization">
                          <div className="utilization-label">Budget Utilization: {treasuryData.finances.budgetUtilization}%</div>
                          <div className="budget-bar">
                            <div className="budget-fill" style={{ width: `${treasuryData.finances.budgetUtilization}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="revenue-card">
                      <h4>📈 Revenue Streams</h4>
                      <div className="revenue-metrics">
                        <div className="revenue-metric">
                          <span>Tax Collections:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.revenue.taxRevenue)}</span>
                        </div>
                        <div className="revenue-metric">
                          <span>Collection Efficiency:</span>
                          <span className="metric-value">{treasuryData.revenue.collectionEfficiency}%</span>
                        </div>
                        <div className="revenue-metric">
                          <span>Corporate Tax:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.revenue.corporateTax)}</span>
                        </div>
                        <div className="revenue-metric">
                          <span>Individual Tax:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.revenue.individualTax)}</span>
                        </div>
                        <div className="revenue-metric">
                          <span>Trade Tariffs:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.revenue.tradeTariffs)}</span>
                        </div>
                        <div className="revenue-metric">
                          <span>Other Revenue:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.revenue.otherRevenue)}</span>
                        </div>
                      </div>
                    </div>

                    {treasuryData.secretary && (
                      <div className="secretary-card">
                        <h4>🎖️ Treasury Secretary</h4>
                        <div className="secretary-profile">
                          <div className="secretary-name">{treasuryData.secretary.name}</div>
                          <div className="secretary-title">{treasuryData.secretary.title}</div>
                          <div className="secretary-details">
                            <div className="secretary-experience">Experience: {treasuryData.secretary.experience} years</div>
                            <div className="secretary-tenure">Tenure: {treasuryData.secretary.tenure}</div>
                            <div className="secretary-approval">Approval: {treasuryData.secretary.approval}%</div>
                          </div>
                          <div className="secretary-background">{treasuryData.secretary.background}</div>
                          <div className="secretary-specializations">
                            <strong>Specializations:</strong>
                            <div className="specialization-tags">
                              {treasuryData.secretary.specialization.map((spec, i) => (
                                <span key={i} className="specialization-tag">{spec}</span>
                              ))}
                            </div>
                          </div>
                          <div className="secretary-achievements">
                            <strong>Key Achievements:</strong>
                            <div className="achievements-list">
                              {treasuryData.secretary.achievements.map((achievement, i) => (
                                <div key={i} className="achievement-item">✨ {achievement}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="debt-overview-card">
                      <h4>💳 Debt & Interest Overview</h4>
                      <div className="debt-metrics">
                        <div className="debt-metric">
                          <span>Debt-to-GDP Ratio:</span>
                          <span className={`metric-value ${42.0 > 90 ? 'warning' : 42.0 > 60 ? 'caution' : 'good'}`}>42.0%</span>
                        </div>
                        <div className="debt-metric">
                          <span>Total Outstanding Debt:</span>
                          <span className="metric-value">{formatCurrency(48000000000)}</span>
                        </div>
                        <div className="debt-metric">
                          <span>Annual Interest Cost:</span>
                          <span className="metric-value debt-interest">{formatCurrency(1824000000)}</span>
                        </div>
                        <div className="debt-metric">
                          <span>Daily Interest Cost:</span>
                          <span className="metric-value">{formatCurrency(4997260)}</span>
                        </div>
                        <div className="debt-metric">
                          <span>Monthly Debt Service:</span>
                          <span className="metric-value">{formatCurrency(180000000)}</span>
                        </div>
                        <div className="debt-metric">
                          <span>Next Payment (12/14/2024):</span>
                          <span className="metric-value highlight">{formatCurrency(195000000)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="expenditures-card">
                      <h4>💸 Major Expenditures</h4>
                      <div className="expenditure-metrics">
                        <div className="expenditure-metric">
                          <span>Defense Spending:</span>
                          <span className="metric-value">{formatCurrency(580000000000)}</span>
                        </div>
                        <div className="expenditure-metric">
                          <span>Health & Human Services:</span>
                          <span className="metric-value">{formatCurrency(950000000000)}</span>
                        </div>
                        <div className="expenditure-metric">
                          <span>Education:</span>
                          <span className="metric-value">{formatCurrency(420000000000)}</span>
                        </div>
                        <div className="expenditure-metric">
                          <span>Interest on Debt:</span>
                          <span className="metric-value debt-interest">{formatCurrency(1824000000)}</span>
                        </div>
                        <div className="expenditure-metric">
                          <span>Transportation:</span>
                          <span className="metric-value">{formatCurrency(320000000000)}</span>
                        </div>
                        <div className="expenditure-metric">
                          <span>Other Programs:</span>
                          <span className="metric-value">{formatCurrency(435000000000)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Treasury Charts Section */}
                  <div className="treasury-charts-section">
                    <div className="charts-grid">
                      <div className="chart-container">
                        <LineChart
                          data={[
                            { label: 'Jan', value: treasuryData.revenue.taxRevenue * 0.85 },
                            { label: 'Feb', value: treasuryData.revenue.taxRevenue * 0.88 },
                            { label: 'Mar', value: treasuryData.revenue.taxRevenue * 0.92 },
                            { label: 'Apr', value: treasuryData.revenue.taxRevenue * 0.96 },
                            { label: 'May', value: treasuryData.revenue.taxRevenue * 0.98 },
                            { label: 'Jun', value: treasuryData.revenue.taxRevenue }
                          ]}
                          title="💰 Revenue vs Expenses Trends"
                          color="#4ecdc4"
                          height={250}
                          width={400}
                        />
                      </div>

                      <div className="chart-container">
                        <PieChart
                          data={[
                            { label: 'Health & Human Services', value: 950, color: '#4ecdc4' },
                            { label: 'Defense Spending', value: 580, color: '#45b7aa' },
                            { label: 'Education', value: 420, color: '#96ceb4' },
                            { label: 'Transportation', value: 320, color: '#feca57' },
                            { label: 'Other Programs', value: 435, color: '#ff9ff3' },
                            { label: 'Interest on Debt', value: 182, color: '#ff6b6b' }
                          ]}
                          title="💸 Budget Allocation (Billions)"
                          size={200}
                          showLegend={true}
                        />
                      </div>

                      <div className="chart-container">
                        <LineChart
                          data={[
                            { label: '2019', value: 38.5 },
                            { label: '2020', value: 39.2 },
                            { label: '2021', value: 40.1 },
                            { label: '2022', value: 41.3 },
                            { label: '2023', value: 41.8 },
                            { label: '2024', value: 42.0 }
                          ]}
                          title="📈 Debt-to-GDP Ratio Trends"
                          color="#ff6b6b"
                          height={250}
                          width={400}
                        />
                      </div>

                      <div className="chart-container">
                        <BarChart
                          data={[
                            { label: 'Corporate Tax', value: treasuryData.revenue.corporateTax / 1000000000, color: '#4ecdc4' },
                            { label: 'Individual Tax', value: treasuryData.revenue.individualTax / 1000000000, color: '#45b7aa' },
                            { label: 'Trade Tariffs', value: treasuryData.revenue.tradeTariffs / 1000000000, color: '#96ceb4' },
                            { label: 'Other Revenue', value: treasuryData.revenue.otherRevenue / 1000000000, color: '#feca57' }
                          ]}
                          title="📊 Revenue Sources (Billions)"
                          height={250}
                          width={400}
                          showTooltip={true}
                        />
                      </div>

                      <div className="chart-container">
                        <PieChart
                          data={[
                            { label: 'Efficient', value: treasuryData.revenue.collectionEfficiency, color: '#4ecdc4' },
                            { label: 'Uncollected', value: 100 - treasuryData.revenue.collectionEfficiency, color: '#ff6b6b' }
                          ]}
                          title="⚡ Tax Collection Efficiency"
                          size={200}
                          showLegend={true}
                        />
                      </div>

                      <div className="chart-container">
                        <BarChart
                          data={[
                            { label: 'Q1', value: treasuryData.finances.totalBudget * 0.22 / 1000000000, color: '#4ecdc4' },
                            { label: 'Q2', value: treasuryData.finances.totalBudget * 0.25 / 1000000000, color: '#45b7aa' },
                            { label: 'Q3', value: treasuryData.finances.totalBudget * 0.28 / 1000000000, color: '#96ceb4' },
                            { label: 'Q4', value: treasuryData.finances.totalBudget * 0.25 / 1000000000, color: '#feca57' }
                          ]}
                          title="📅 Quarterly Budget Utilization (Billions)"
                          height={250}
                          width={400}
                          showTooltip={true}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tab-actions">
                    <button className="action-btn">Financial Report</button>
                    <button className="action-btn secondary">Budget Summary</button>
                    <button className="action-btn">Treasury Operations</button>
                  </div>
                </div>
              )}

              {activeTab === 'tax-revenue' && (
                <div className="tax-revenue-tab">
                  <div className="tax-revenue-grid">
                    {/* Tax Categories Overview */}
                    <div className="tax-categories-panel">
                      <h4>📊 Tax Categories Overview</h4>
                      <div className="tax-categories-grid">
                        {treasuryData.revenue.taxCategories.map((category) => (
                          <div key={category.category} className={`tax-category-card category-${category.category}`}>
                            <div className="category-header">
                              <h5>{category.name}</h5>
                              <span className={`trend-indicator ${category.trend}`}>
                                {category.trend === 'increasing' && '📈'}
                                {category.trend === 'decreasing' && '📉'}
                                {category.trend === 'stable' && '➡️'}
                              </span>
                            </div>
                            <div className="category-amount">{formatCurrency(category.totalAmount)}</div>
                            <div className="category-metrics">
                              <div className="metric-row">
                                <span>Collection Efficiency:</span>
                                <span className="metric-value">{category.collectionEfficiency.toFixed(1)}%</span>
                              </div>
                              <div className="metric-row">
                                <span>Monthly Change:</span>
                                <span className={`metric-value ${category.monthlyChange >= 0 ? 'positive' : 'negative'}`}>
                                  {category.monthlyChange >= 0 ? '+' : ''}{category.monthlyChange.toFixed(1)}%
                                </span>
                              </div>
                              <div className="metric-row">
                                <span>Line Items:</span>
                                <span className="metric-value">{category.lineItems.length}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Tax Line Items */}
                    <div className="tax-line-items-panel">
                      <h4>📋 Detailed Tax Line Items</h4>
                      <div className="line-items-container">
                        {treasuryData.revenue.taxCategories.map((category) => (
                          <div key={category.category} className="category-section">
                            <div className="category-section-header">
                              <h5>{category.name} - {formatCurrency(category.totalAmount)}</h5>
                              <span className="category-efficiency">Efficiency: {category.collectionEfficiency.toFixed(1)}%</span>
                            </div>
                            <div className="line-items-list">
                              {category.lineItems.map((lineItem) => (
                                <div key={lineItem.id} className="line-item">
                                  <div className="line-item-header">
                                    <div className="line-item-name">
                                      <strong>{lineItem.name}</strong>
                                      <span className="line-item-source">from {lineItem.source}</span>
                                    </div>
                                    <div className="line-item-amount">{formatCurrency(lineItem.amount)}</div>
                                  </div>
                                  <div className="line-item-details">
                                    <div className="line-item-metrics">
                                      {lineItem.rate > 0 && (
                                        <span className="metric-badge">Rate: {lineItem.rate}%</span>
                                      )}
                                      <span className="metric-badge">Efficiency: {lineItem.collectionEfficiency.toFixed(1)}%</span>
                                      <span className={`metric-badge trend-${lineItem.trend}`}>
                                        {lineItem.trend === 'increasing' && '📈 '}
                                        {lineItem.trend === 'decreasing' && '📉 '}
                                        {lineItem.trend === 'stable' && '➡️ '}
                                        {lineItem.trend}
                                      </span>
                                      <span className={`metric-badge ${lineItem.monthlyChange >= 0 ? 'positive' : 'negative'}`}>
                                        Monthly: {lineItem.monthlyChange >= 0 ? '+' : ''}{lineItem.monthlyChange.toFixed(1)}%
                                      </span>
                                      <span className={`metric-badge ${lineItem.yearOverYear >= 0 ? 'positive' : 'negative'}`}>
                                        YoY: {lineItem.yearOverYear >= 0 ? '+' : ''}{lineItem.yearOverYear.toFixed(1)}%
                                      </span>
                                      {lineItem.region && (
                                        <span className="metric-badge region">📍 {lineItem.region}</span>
                                      )}
                                      {lineItem.demographic && (
                                        <span className="metric-badge demographic">👥 {lineItem.demographic}</span>
                                      )}
                                    </div>
                                    <div className="line-item-description">{lineItem.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Geographic Breakdown */}
                    <div className="geographic-breakdown-panel">
                      <h4>🗺️ Geographic Tax Distribution</h4>
                      <div className="geographic-grid">
                        {treasuryData.revenue.geographicBreakdown.map((region) => (
                          <div key={region.region} className="geographic-item">
                            <div className="region-header">
                              <h6>{region.region}</h6>
                              <span className="region-percentage">{region.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="region-amount">{formatCurrency(region.amount)}</div>
                            <div className="region-efficiency">
                              <span>Collection Efficiency: </span>
                              <span className={`efficiency-value ${region.efficiency >= 95 ? 'excellent' : region.efficiency >= 90 ? 'good' : 'needs-improvement'}`}>
                                {region.efficiency.toFixed(1)}%
                              </span>
                            </div>
                            <div className="region-bar">
                              <div 
                                className="region-fill" 
                                style={{ width: `${region.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Demographic Breakdown */}
                    <div className="demographic-breakdown-panel">
                      <h4>👥 Demographic Tax Distribution</h4>
                      <div className="demographic-grid">
                        {treasuryData.revenue.demographicBreakdown.map((demographic) => (
                          <div key={demographic.demographic} className="demographic-item">
                            <div className="demographic-header">
                              <h6>{demographic.demographic}</h6>
                              <span className="demographic-percentage">{demographic.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="demographic-amount">{formatCurrency(demographic.amount)}</div>
                            <div className="demographic-rate">
                              <span>Average Tax Rate: </span>
                              <span className="rate-value">{demographic.averageRate.toFixed(1)}%</span>
                            </div>
                            <div className="demographic-bar">
                              <div 
                                className="demographic-fill" 
                                style={{ width: `${demographic.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Monthly Tax Trends */}
                    <div className="tax-trends-panel">
                      <h4>📈 Monthly Tax Collection Trends</h4>
                      <div className="trends-container">
                        <div className="trends-chart">
                          {treasuryData.revenue.monthlyTaxTrends.map((trend, index) => (
                            <div key={trend.month} className="trend-month">
                              <div className="trend-header">
                                <span className="trend-month-name">{trend.month}</span>
                                <span className="trend-total">{formatCurrency(trend.totalTax)}</span>
                              </div>
                              <div className="trend-categories">
                                {Object.entries(trend.categories).map(([category, amount]) => (
                                  <div key={category} className={`trend-category category-${category}`}>
                                    <span className="category-name">{category}:</span>
                                    <span className="category-amount">{formatCurrency(amount as number)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="trend-bar">
                                <div 
                                  className="trend-fill" 
                                  style={{ 
                                    height: `${(trend.totalTax / Math.max(...treasuryData.revenue.monthlyTaxTrends.map(t => t.totalTax))) * 100}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tax Collection Summary */}
                    <div className="tax-summary-panel">
                      <h4>💼 Tax Collection Summary</h4>
                      <div className="summary-metrics">
                        <div className="summary-metric">
                          <span className="metric-label">Total Tax Revenue:</span>
                          <span className="metric-value large">{formatCurrency(treasuryData.revenue.taxRevenue)}</span>
                        </div>
                        <div className="summary-metric">
                          <span className="metric-label">Overall Collection Efficiency:</span>
                          <span className="metric-value">{treasuryData.revenue.collectionEfficiency.toFixed(1)}%</span>
                        </div>
                        <div className="summary-metric">
                          <span className="metric-label">Total Tax Line Items:</span>
                          <span className="metric-value">{treasuryData.revenue.totalTaxLineItems.length}</span>
                        </div>
                        <div className="summary-metric">
                          <span className="metric-label">Active Tax Categories:</span>
                          <span className="metric-value">{treasuryData.revenue.taxCategories.length}</span>
                        </div>
                        <div className="summary-metric">
                          <span className="metric-label">Geographic Regions:</span>
                          <span className="metric-value">{treasuryData.revenue.geographicBreakdown.length}</span>
                        </div>
                        <div className="summary-metric">
                          <span className="metric-label">Demographic Segments:</span>
                          <span className="metric-value">{treasuryData.revenue.demographicBreakdown.length}</span>
                        </div>
                      </div>
                      
                      <div className="collection-insights">
                        <h5>📊 Collection Insights</h5>
                        <div className="insights-grid">
                          <div className="insight-item">
                            <span className="insight-icon">🏆</span>
                            <div className="insight-content">
                              <strong>Top Performing Category:</strong>
                              <span>{treasuryData.revenue.taxCategories.reduce((prev, current) => (prev.totalAmount > current.totalAmount) ? prev : current).name}</span>
                            </div>
                          </div>
                          <div className="insight-item">
                            <span className="insight-icon">📈</span>
                            <div className="insight-content">
                              <strong>Fastest Growing:</strong>
                              <span>{treasuryData.revenue.taxCategories.reduce((prev, current) => (prev.monthlyChange > current.monthlyChange) ? prev : current).name}</span>
                            </div>
                          </div>
                          <div className="insight-item">
                            <span className="insight-icon">🎯</span>
                            <div className="insight-content">
                              <strong>Most Efficient Region:</strong>
                              <span>{treasuryData.revenue.geographicBreakdown.reduce((prev, current) => (prev.efficiency > current.efficiency) ? prev : current).region}</span>
                            </div>
                          </div>
                          <div className="insight-item">
                            <span className="insight-icon">💰</span>
                            <div className="insight-content">
                              <strong>Largest Revenue Source:</strong>
                              <span>{treasuryData.revenue.totalTaxLineItems.reduce((prev, current) => (prev.amount > current.amount) ? prev : current).name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'departments' && (
                <div className="departments-tab">
                  <div className="departments-grid">
                    {treasuryData.departments.map((dept) => (
                      <div key={dept.id} className="department-item">
                        <div className="department-header">
                          <div className="department-name">{dept.name}</div>
                          <div className="department-priority" style={{ color: getPriorityColor(dept.priority) }}>
                            {dept.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="department-details">
                          <div className="department-category">{dept.category}</div>
                          <div className="department-projects">Projects: {dept.projects}</div>
                          <div className="department-updated">Updated: {new Date(dept.lastUpdate).toLocaleDateString()}</div>
                        </div>
                        <div className="department-budget">
                          <div className="budget-amounts">
                            <div className="budget-allocated">Allocated: {formatCurrency(dept.allocated)}</div>
                            <div className="budget-spent">Spent: {formatCurrency(dept.spent)}</div>
                            <div className="budget-remaining">Remaining: {formatCurrency(dept.remaining)}</div>
                          </div>
                          <div className="utilization-info">
                            <span>Utilization: {dept.utilization}%</span>
                          </div>
                          <div className="budget-bar">
                            <div className="budget-fill" style={{ width: `${dept.utilization}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Allocate Budget</button>
                    <button className="action-btn secondary">Department Report</button>
                    <button className="action-btn">Budget Transfer</button>
                  </div>
                </div>
              )}

              {activeTab === 'rollup' && (
                <div className="rollup-tab">
                  <div className="rollup-summary">
                    <div className="summary-card">
                      <div className="summary-title">Budget Rollup Summary</div>
                      <div className="summary-metrics">
                        <div className="summary-metric">
                          <span>Total Allocated:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.departments.reduce((sum, dept) => sum + dept.allocated, 0))}</span>
                        </div>
                        <div className="summary-metric">
                          <span>Total Spent:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.departments.reduce((sum, dept) => sum + dept.spent, 0))}</span>
                        </div>
                        <div className="summary-metric">
                          <span>Total Remaining:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.departments.reduce((sum, dept) => sum + dept.remaining, 0))}</span>
                        </div>
                        <div className="summary-metric">
                          <span>Average Utilization:</span>
                          <span className="metric-value">{(treasuryData.departments.reduce((sum, dept) => sum + dept.utilization, 0) / treasuryData.departments.length).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="summary-card debt-service-card">
                      <div className="summary-title">💳 Debt Service Obligations</div>
                      <div className="summary-metrics">
                        <div className="summary-metric">
                          <span>Annual Interest Cost:</span>
                          <span className="metric-value debt-interest">{formatCurrency(1824000000)}</span>
                        </div>
                        <div className="summary-metric">
                          <span>Daily Interest Cost:</span>
                          <span className="metric-value">{formatCurrency(4997260)}</span>
                        </div>
                        <div className="summary-metric">
                          <span>Monthly Debt Service:</span>
                          <span className="metric-value">{formatCurrency(180000000)}</span>
                        </div>
                        <div className="summary-metric">
                          <span>Next Payment (12/14/2024):</span>
                          <span className="metric-value highlight">{formatCurrency(195000000)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rollup-breakdown">
                    <h4>Department Breakdown</h4>
                    <div className="breakdown-table">
                      {treasuryData.departments.map((dept) => (
                        <div key={dept.id} className="breakdown-row">
                          <div className="breakdown-department">{dept.name}</div>
                          <div className="breakdown-allocated">{formatCurrency(dept.allocated)}</div>
                          <div className="breakdown-spent">{formatCurrency(dept.spent)}</div>
                          <div className="breakdown-remaining">{formatCurrency(dept.remaining)}</div>
                          <div className="breakdown-utilization">{dept.utilization}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Export Rollup</button>
                    <button className="action-btn secondary">Detailed Analysis</button>
                    <button className="action-btn">Budget Comparison</button>
                  </div>
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="requests-tab">
                  <div className="requests-grid">
                    {treasuryData.spendingRequests.map((request) => (
                      <div key={request.id} className="request-item">
                        <div className="request-header">
                          <div className="request-title">{request.title}</div>
                          <div className="request-priority" style={{ color: getPriorityColor(request.priority) }}>
                            {request.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="request-details">
                          <div className="request-department">{request.department}</div>
                          <div className="request-amount">{formatCurrency(request.amount)}</div>
                          <div className="request-status" style={{ color: getStatusColor(request.status) }}>
                            Status: {request.status.toUpperCase()}
                          </div>
                          <div className="request-date">Requested: {new Date(request.requestDate).toLocaleDateString()}</div>
                          <div className="request-category">Category: {request.category}</div>
                          <div className="request-timeline">Timeline: {request.timeline}</div>
                        </div>
                        <div className="request-justification">
                          <strong>Justification:</strong> {request.justification}
                        </div>
                        <div className="request-outcome">
                          <strong>Expected Outcome:</strong> {request.expectedOutcome}
                        </div>
                        <div className="request-actions">
                          {request.status === 'pending' && (
                            <>
                              <button className="action-btn approve">Approve</button>
                              <button className="action-btn reject">Reject</button>
                            </>
                          )}
                          <button className="action-btn secondary">Review Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">New Request</button>
                    <button className="action-btn secondary">Batch Review</button>
                    <button className="action-btn">Request Report</button>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="analytics-tab">
                  <div className="analytics-grid">
                    <div className="trends-card">
                      <h4>📈 Monthly Trends</h4>
                      <div className="trends-list">
                        {treasuryData.analytics.monthlyTrends.map((trend, i) => (
                          <div key={i} className="trend-item">
                            <div className="trend-month">{trend.month}</div>
                            <div className="trend-metrics">
                              <div className="trend-revenue">Revenue: {formatCurrency(trend.revenue)}</div>
                              <div className="trend-spending">Spending: {formatCurrency(trend.spending)}</div>
                              <div className="trend-surplus" style={{ color: trend.surplus >= 0 ? '#22c55e' : '#ef4444' }}>
                                {trend.surplus >= 0 ? 'Surplus' : 'Deficit'}: {formatCurrency(Math.abs(trend.surplus))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="performance-card">
                      <h4>🎯 Department Performance</h4>
                      <div className="performance-list">
                        {treasuryData.analytics.departmentPerformance.map((perf, i) => (
                          <div key={i} className="performance-item">
                            <div className="performance-department">{perf.department}</div>
                            <div className="performance-metrics">
                              <div className="performance-efficiency">Efficiency: {perf.efficiency}%</div>
                              <div className="performance-variance" style={{ color: perf.variance >= 0 ? '#22c55e' : '#ef4444' }}>
                                Variance: {perf.variance >= 0 ? '+' : ''}{perf.variance}%
                              </div>
                              <div className="performance-trend" style={{ color: getTrendColor(perf.trend) }}>
                                Trend: {perf.trend.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="risks-card">
                      <h4>⚠️ Risk Factors</h4>
                      <div className="risks-list">
                        {treasuryData.analytics.riskFactors.map((risk, i) => (
                          <div key={i} className="risk-item">
                            <div className="risk-header">
                              <div className="risk-factor">{risk.factor}</div>
                              <div className="risk-impact" style={{ color: getPriorityColor(risk.impact) }}>
                                {risk.impact.toUpperCase()}
                              </div>
                            </div>
                            <div className="risk-probability">Probability: {risk.probability}%</div>
                            <div className="risk-mitigation">
                              <strong>Mitigation:</strong> {risk.mitigation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Generate Report</button>
                    <button className="action-btn secondary">Risk Assessment</button>
                    <button className="action-btn">Performance Review</button>
                  </div>
                </div>
              )}

              {activeTab === 'forecasting' && (
                <div className="forecasting-tab">
                  <div className="forecasting-grid">
                    <div className="forecast-overview">
                      <h4>🔮 Economic Forecast</h4>
                      <div className="forecast-metrics">
                        <div className="forecast-metric">
                          <span>GDP Growth:</span>
                          <span className="metric-value">{treasuryData.forecasting.gdpGrowth}%</span>
                        </div>
                        <div className="forecast-metric">
                          <span>Inflation Rate:</span>
                          <span className="metric-value">{treasuryData.forecasting.inflationRate}%</span>
                        </div>
                        <div className="forecast-metric">
                          <span>Unemployment Rate:</span>
                          <span className="metric-value">{treasuryData.forecasting.unemploymentRate}%</span>
                        </div>
                        <div className="forecast-metric">
                          <span>Projected Revenue:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.forecasting.projectedRevenue)}</span>
                        </div>
                        <div className="forecast-metric">
                          <span>Projected Spending:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.forecasting.projectedSpending)}</span>
                        </div>
                        <div className="forecast-metric">
                          <span>Budget Balance:</span>
                          <span className="metric-value" style={{ color: treasuryData.forecasting.budgetBalance >= 0 ? '#22c55e' : '#ef4444' }}>
                            {formatCurrency(treasuryData.forecasting.budgetBalance)}
                          </span>
                        </div>
                        <div className="forecast-confidence">
                          <span>Confidence Level: {treasuryData.forecasting.confidenceLevel}%</span>
                          <div className="confidence-bar">
                            <div className="confidence-fill" style={{ width: `${treasuryData.forecasting.confidenceLevel}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="assumptions-card">
                      <h4>📋 Key Assumptions</h4>
                      <div className="assumptions-list">
                        {treasuryData.forecasting.keyAssumptions.map((assumption, i) => (
                          <div key={i} className="assumption-item">📌 {assumption}</div>
                        ))}
                      </div>
                    </div>

                    <div className="scenarios-card">
                      <h4>🎲 Economic Scenarios</h4>
                      <div className="scenarios-list">
                        {treasuryData.forecasting.scenarios.map((scenario, i) => (
                          <div key={i} className="scenario-item">
                            <div className="scenario-header">
                              <div className="scenario-name">{scenario.name}</div>
                              <div className="scenario-probability">{scenario.probability}%</div>
                            </div>
                            <div className="scenario-impact">{scenario.impact}</div>
                            <div className="scenario-effect" style={{ color: scenario.budgetEffect >= 0 ? '#22c55e' : '#ef4444' }}>
                              Budget Effect: {scenario.budgetEffect >= 0 ? '+' : ''}{formatCurrency(scenario.budgetEffect)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Update Forecast</button>
                    <button className="action-btn secondary">Scenario Analysis</button>
                    <button className="action-btn">Economic Report</button>
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

export default TreasuryScreen;
