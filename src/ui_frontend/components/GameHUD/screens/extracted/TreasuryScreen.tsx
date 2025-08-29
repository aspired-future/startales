import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './TreasuryScreen.css';
import '../shared/StandardDesign.css';
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

  // Define tabs for Treasury screen (reduced for better fit)
  const tabs: TabConfig[] = [
    { id: 'dashboard', label: 'Overview', icon: '📊' },
    { id: 'tax-revenue', label: 'Revenue', icon: '💰' },
    { id: 'departments', label: 'Depts', icon: '🏛️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'forecasting', label: 'Forecast', icon: '🔮' }
  ];

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

  const renderTabContent = () => {
    if (!treasuryData) return null;
    
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardTab();
      case 'tax-revenue':
        return renderTaxRevenueTab();
      case 'departments':
        return renderDepartmentsTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'forecasting':
        return renderForecastingTab();
      default:
        return renderDashboardTab();
    }
  };

    const renderDashboardTab = () => (
    <>
      {/* Government Finances Overview - First card in 2-column grid */}
      <div className="standard-panel economic-theme">
        <div className="standard-metric">
          <span>Total Budget</span>
          <span className="standard-metric-value">{formatCurrency(treasuryData.finances.totalBudget)}</span>
                        </div>
        <div className="standard-metric">
          <span>Total Spent</span>
          <span className="standard-metric-value">{formatCurrency(treasuryData.finances.totalSpent)}</span>
                        </div>
        <div className="standard-metric">
          <span>Remaining Budget</span>
          <span className="standard-metric-value">{formatCurrency(treasuryData.finances.totalRemaining)}</span>
                        </div>
        <div className="standard-metric">
          <span>Budget Utilization</span>
          <span className={`standard-metric-value ${treasuryData.finances.budgetUtilization > 90 ? 'warning' : 'positive'}`}>
            {treasuryData.finances.budgetUtilization.toFixed(1)}%
          </span>
                          </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme">Budget Details</button>
          <button className="standard-btn economic-theme">Financial Report</button>
                      </div>
                    </div>

            {/* Revenue Streams - Second card in 2-column grid */}
      <div className="standard-panel economic-theme">
        <div className="standard-metric">
          <span>Tax Collections</span>
          <span className="standard-metric-value">{formatCurrency(treasuryData.revenue.taxRevenue)}</span>
                        </div>
        <div className="standard-metric">
          <span>Collection Efficiency</span>
          <span className="standard-metric-value">{treasuryData.revenue.collectionEfficiency}%</span>
                        </div>
        <div className="standard-metric">
          <span>Corporate Tax</span>
          <span className="standard-metric-value">{formatCurrency(treasuryData.revenue.corporateTax)}</span>
                        </div>
        <div className="standard-metric">
          <span>Individual Tax</span>
          <span className="standard-metric-value">{formatCurrency(treasuryData.revenue.individualTax)}</span>
                        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme">Revenue Analysis</button>
          <button className="standard-btn economic-theme">Tax Report</button>
                        </div>
                        </div>

            {/* Budget Overview Chart - Third card in 2-column grid */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>💰 Budget Overview</h3>
        <div style={{ height: '200px', marginTop: '1rem' }}>
          <PieChart
            data={[
              { name: 'Spent', value: treasuryData.finances.totalSpent },
              { name: 'Remaining', value: treasuryData.finances.totalRemaining }
            ]}
            colors={['#ef4444', '#10b981']}
            height={200}
          />
                      </div>
                    </div>

      {/* Treasury Secretary - Fourth card in 2-column grid */}
                    {treasuryData.secretary && (
        <div className="standard-panel economic-theme">
          <div className="standard-metric">
            <span>Treasury Secretary</span>
            <span className="standard-metric-value">{treasuryData.secretary.name}</span>
                          </div>
          <div className="standard-metric">
            <span>Experience</span>
            <span className="standard-metric-value">{treasuryData.secretary.experience} years</span>
                            </div>
          <div className="standard-metric">
            <span>Approval Rating</span>
            <span className="standard-metric-value">{treasuryData.secretary.approval}%</span>
                          </div>
          <div className="standard-metric">
            <span>Tenure</span>
            <span className="standard-metric-value">{treasuryData.secretary.tenure}</span>
                            </div>
          <div className="standard-action-buttons">
            <button className="standard-btn economic-theme">Secretary Profile</button>
            <button className="standard-btn economic-theme">Performance Review</button>
                        </div>
                      </div>
                    )}
    </>
  );

    const renderTaxRevenueTab = () => (
    <>
      {/* Tax Revenue Summary with Chart */}
      <div className="standard-panel economic-theme">
        <div className="standard-metric">
          <span>Total Tax Revenue</span>
          <span className="standard-metric-value">{formatCurrency(treasuryData.revenue.taxRevenue)}</span>
                        </div>
        <div className="standard-metric">
          <span>Collection Efficiency</span>
          <span className="standard-metric-value">{treasuryData.revenue.collectionEfficiency}%</span>
                        </div>
        <div className="standard-metric">
          <span>Tax Categories</span>
          <span className="standard-metric-value">{treasuryData.revenue.taxCategories.length}</span>
                        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme">Revenue Analysis</button>
          <button className="standard-btn economic-theme">Export Report</button>
                      </div>
                    </div>

      {/* Revenue Trend Chart */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📈 Revenue Trends</h3>
        <div style={{ height: '200px', marginTop: '1rem' }}>
                        <LineChart
                          data={[
              { month: 'Jan', revenue: treasuryData.revenue.taxRevenue * 0.8 },
              { month: 'Feb', revenue: treasuryData.revenue.taxRevenue * 0.85 },
              { month: 'Mar', revenue: treasuryData.revenue.taxRevenue * 0.9 },
              { month: 'Apr', revenue: treasuryData.revenue.taxRevenue * 0.95 },
              { month: 'May', revenue: treasuryData.revenue.taxRevenue * 0.98 },
              { month: 'Jun', revenue: treasuryData.revenue.taxRevenue }
            ]}
            xKey="month"
            yKey="revenue"
            color="#fbbf24"
            height={200}
                        />
                      </div>
                      </div>

      {/* Tax Categories Table */}
              <div className="standard-panel economic-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>💰 Tax Revenue by Category</h3>
          <div className="standard-table-container">
          <table className="standard-data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Efficiency</th>
              <th>Monthly Change</th>
              <th>Trend</th>
              <th>Line Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
                        {treasuryData.revenue.taxCategories.map((category) => (
              <tr key={category.category}>
                <td>
                  <strong>{category.name}</strong>
                </td>
                <td style={{ fontFamily: 'Orbitron, monospace', textAlign: 'right' }}>
                  {formatCurrency(category.totalAmount)}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {category.collectionEfficiency.toFixed(1)}%
                </td>
                <td style={{ 
                  textAlign: 'right',
                  color: category.monthlyChange >= 0 ? '#22c55e' : '#ef4444'
                }}>
                  {category.monthlyChange >= 0 ? '+' : ''}{category.monthlyChange.toFixed(1)}%
                </td>
                <td style={{ textAlign: 'center' }}>
                                {category.trend === 'increasing' && '📈'}
                                {category.trend === 'decreasing' && '📉'}
                                {category.trend === 'stable' && '➡️'}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {category.lineItems.length}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="standard-btn economic-theme" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Details
                  </button>
                </td>
              </tr>
                      ))}
        </tbody>
      </table>
                      </div>
                    </div>
    </>
  );

    const renderDepartmentsTab = () => (
    <>
      {/* Department Budget Summary */}
      <div className="standard-panel economic-theme">
        <div className="standard-metric">
          <span>Total Departments</span>
          <span className="standard-metric-value">{treasuryData.departments.length}</span>
                            </div>
        <div className="standard-metric">
          <span>Total Allocated</span>
          <span className="standard-metric-value">
            {formatCurrency(treasuryData.departments.reduce((sum, dept) => sum + dept.allocated, 0))}
          </span>
                                    </div>
        <div className="standard-metric">
          <span>Total Spent</span>
          <span className="standard-metric-value">
            {formatCurrency(treasuryData.departments.reduce((sum, dept) => sum + dept.spent, 0))}
                                      </span>
                                    </div>
        <div className="standard-metric">
          <span>Average Utilization</span>
          <span className="standard-metric-value">
            {(treasuryData.departments.reduce((sum, dept) => sum + dept.utilization, 0) / treasuryData.departments.length).toFixed(1)}%
                              </span>
                            </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme">Budget Overview</button>
          <button className="standard-btn economic-theme">Allocation Report</button>
                      </div>
                    </div>

      {/* Budget Allocation Chart */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🥧 Budget Allocation</h3>
        <div style={{ height: '250px', marginTop: '1rem' }}>
          <PieChart
            data={treasuryData.departments.map(dept => ({
              name: dept.name,
              value: dept.allocated
            }))}
            colors={['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f', '#451a03']}
            height={250}
          />
                      </div>
                    </div>

      {/* Departments Table */}
              <div className="standard-panel economic-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🏛️ Department Budget Allocation</h3>
          <div className="standard-table-container">
          <table className="standard-data-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Allocated</th>
              <th>Spent</th>
              <th>Remaining</th>
              <th>Utilization</th>
              <th>Priority</th>
              <th>Projects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
                    {treasuryData.departments.map((dept) => (
              <tr key={dept.id}>
                <td>
                  <strong>{dept.name}</strong>
                  <br />
                  <small style={{ color: '#a0a9ba' }}>{dept.category}</small>
                </td>
                <td style={{ fontFamily: 'Orbitron, monospace', textAlign: 'right' }}>
                  {formatCurrency(dept.allocated)}
                </td>
                <td style={{ fontFamily: 'Orbitron, monospace', textAlign: 'right' }}>
                  {formatCurrency(dept.spent)}
                </td>
                <td style={{ fontFamily: 'Orbitron, monospace', textAlign: 'right' }}>
                  {formatCurrency(dept.remaining)}
                </td>
                <td style={{ 
                  textAlign: 'right',
                  color: dept.utilization > 90 ? '#ef4444' : dept.utilization > 70 ? '#22c55e' : '#fbbf24'
                }}>
                  {dept.utilization.toFixed(1)}%
                </td>
                <td style={{ 
                  textAlign: 'center',
                  color: dept.priority === 'critical' ? '#ef4444' : 
                         dept.priority === 'high' ? '#f97316' : 
                         dept.priority === 'medium' ? '#eab308' : '#22c55e'
                }}>
                            {dept.priority.toUpperCase()}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {dept.projects}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="standard-btn economic-theme" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Details
                  </button>
                </td>
              </tr>
                      ))}
        </tbody>
      </table>
                  </div>
                  </div>
    </>
  );

    const renderAnalyticsTab = () => (
    <>
      {/* Analytics Summary */}
      <div className="standard-panel economic-theme">
        <div className="standard-metric">
          <span>Revenue Growth</span>
          <span className="standard-metric-value">+12.5%</span>
                        </div>
        <div className="standard-metric">
          <span>Expense Ratio</span>
          <span className="standard-metric-value">0.85</span>
                        </div>
        <div className="standard-metric">
          <span>Efficiency Score</span>
          <span className="standard-metric-value">94.2%</span>
                        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme">Detailed Analytics</button>
          <button className="standard-btn economic-theme">Export Report</button>
                      </div>
                    </div>

      {/* Department Utilization Chart */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Department Utilization</h3>
        <div style={{ height: '250px', marginTop: '1rem' }}>
          <BarChart
            data={treasuryData.departments.map(dept => ({
              department: dept.name,
              utilization: dept.utilization
            }))}
            xKey="department"
            yKey="utilization"
            color="#fbbf24"
            height={250}
          />
                        </div>
                        </div>

      {/* Revenue vs Spending Trend */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📈 Revenue vs Spending</h3>
        <div style={{ height: '200px', marginTop: '1rem' }}>
          <LineChart
            data={[
              { month: 'Jan', revenue: treasuryData.revenue.taxRevenue * 0.8, spending: treasuryData.finances.totalSpent * 0.7 },
              { month: 'Feb', revenue: treasuryData.revenue.taxRevenue * 0.85, spending: treasuryData.finances.totalSpent * 0.75 },
              { month: 'Mar', revenue: treasuryData.revenue.taxRevenue * 0.9, spending: treasuryData.finances.totalSpent * 0.8 },
              { month: 'Apr', revenue: treasuryData.revenue.taxRevenue * 0.95, spending: treasuryData.finances.totalSpent * 0.85 },
              { month: 'May', revenue: treasuryData.revenue.taxRevenue * 0.98, spending: treasuryData.finances.totalSpent * 0.9 },
              { month: 'Jun', revenue: treasuryData.revenue.taxRevenue, spending: treasuryData.finances.totalSpent }
            ]}
            xKey="month"
            yKey="revenue"
            color="#fbbf24"
            height={200}
            multiLine={true}
            secondaryYKey="spending"
            secondaryColor="#ef4444"
          />
                          </div>
                        </div>
    </>
  );

  const renderForecastingTab = () => (
    <>
      {/* Forecast Summary */}
      <div className="standard-panel economic-theme">
        <div className="standard-metric">
          <span>Next Quarter Revenue</span>
          <span className="standard-metric-value">{formatCurrency(treasuryData.finances.totalBudget * 1.1)}</span>
                              </div>
        <div className="standard-metric">
          <span>Projected Growth</span>
          <span className="standard-metric-value">+8.3%</span>
                            </div>
        <div className="standard-metric">
          <span>Risk Assessment</span>
          <span className="standard-metric-value">Low</span>
                          </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme">Forecast Details</button>
          <button className="standard-btn economic-theme">Scenario Analysis</button>
                      </div>
                    </div>

      {/* Revenue Forecast Chart */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🔮 Revenue Forecast</h3>
        <div style={{ height: '250px', marginTop: '1rem' }}>
          <LineChart
            data={[
              { quarter: 'Q1', actual: treasuryData.revenue.taxRevenue * 0.9, forecast: treasuryData.revenue.taxRevenue * 0.95 },
              { quarter: 'Q2', actual: treasuryData.revenue.taxRevenue, forecast: treasuryData.revenue.taxRevenue * 1.05 },
              { quarter: 'Q3', actual: null, forecast: treasuryData.revenue.taxRevenue * 1.1 },
              { quarter: 'Q4', actual: null, forecast: treasuryData.revenue.taxRevenue * 1.15 }
            ]}
            xKey="quarter"
            yKey="actual"
            color="#fbbf24"
            height={250}
            multiLine={true}
            secondaryYKey="forecast"
            secondaryColor="#10b981"
            showDashedLine={true}
          />
                      </div>
                    </div>

      {/* Budget Forecast */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>💰 Budget Projections</h3>
        <div style={{ height: '200px', marginTop: '1rem' }}>
          <BarChart
            data={[
              { year: '2024', budget: treasuryData.finances.totalBudget, projected: treasuryData.finances.totalBudget * 1.08 },
              { year: '2025', budget: treasuryData.finances.totalBudget * 1.05, projected: treasuryData.finances.totalBudget * 1.12 },
              { year: '2026', budget: treasuryData.finances.totalBudget * 1.1, projected: treasuryData.finances.totalBudget * 1.18 }
            ]}
            xKey="year"
            yKey="budget"
            color="#fbbf24"
            height={200}
            multiBar={true}
            secondaryYKey="projected"
            secondaryColor="#10b981"
          />
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
      onRefresh={fetchTreasuryData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as 'dashboard' | 'tax-revenue' | 'departments' | 'rollup' | 'requests' | 'analytics' | 'forecasting')}
    >
      <div className="standard-screen-container economic-theme">
        {loading && <div className="loading">Loading treasury data...</div>}
        {error && <div className="error">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {renderTabContent()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default TreasuryScreen;
