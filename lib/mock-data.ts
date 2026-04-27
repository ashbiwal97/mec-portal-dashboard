import { verticals } from './tokens';

export const kpiCards = [
  {
    title: 'Renewal Risk & Rebooking Opportunities',
    value: '456',
    description: 'Expiring accounts this year',
    trend: '+8%',
    trendUp: true,
  },
  {
    title: 'Facilitated Demos',
    value: '13',
    description: 'Scheduled this month',
    trend: '+23%',
    trendUp: true,
  },
  {
    title: 'Total Buyers Onboarded',
    value: '45',
    description: '-12% from last month',
    trend: '-12%',
    trendUp: false,
  },
  {
    title: 'Total Sellers Onboarded',
    value: '36',
    description: '-12% from last month',
    trend: '-12%',
    trendUp: false,
  },
  {
    title: 'Match Success Rate',
    value: '68%',
    description: 'RFC → RTC conversions',
    trend: '+5%',
    trendUp: true,
  },
  {
    title: 'Match Velocity',
    value: '4.2d',
    description: 'Avg. time RFC → first match',
    trend: '-0.8d',
    trendUp: true,
  },
];

// Base numeric values matching kpiCards order
const KPI_BASES = [456, 13, 45, 36, 68, 4.2];
const KPI_FORMATS = ['count', 'count', 'count', 'count', 'pct', 'days'] as const;

// How many months each time-range represents (out of 12)
const TIME_RANGE_MONTHS: Record<string, number> = {
  'Last 30 days':   1,
  'Last 90 days':   3,
  'Last 6 months':  6,
  'Last 12 months': 12,
  'YTD':            4, // Jan–Apr
};

export function getKpiData(marketplaces: string[], timeRange = 'Last 12 months') {
  const allCount = MARKETPLACES.filter((m) => m !== 'All Marketplaces').length;
  const monthFraction = (TIME_RANGE_MONTHS[timeRange] ?? 12) / 12;

  const marketplaceScale =
    marketplaces.length === 0 || marketplaces.length === allCount
      ? 1
      : marketplaces.length / allCount;

  return kpiCards.map((card, i) => {
    const base = KPI_BASES[i];
    const variance =
      marketplaces.length === 0 || marketplaces.length === allCount
        ? stableRand(timeRange, i + 77) * 0.2 - 0.1
        : marketplaces.reduce((sum, m) => sum + (stableRand(m, i + 60) - 0.5) * 0.6, 0) /
          marketplaces.length;

    const fmt = KPI_FORMATS[i];
    let value: string;

    if (fmt === 'count') {
      const scaled = base * marketplaceScale * monthFraction * (1 + variance);
      value = String(Math.max(1, Math.round(scaled)));
    } else if (fmt === 'pct') {
      value = `${Math.max(10, Math.min(99, Math.round(base * (1 + variance))))}%`;
    } else {
      // days — shorter time range = slightly faster velocity
      const dayAdj = base * (1 + variance * 0.5) * (0.85 + monthFraction * 0.15);
      value = `${Math.max(0.5, parseFloat(dayAdj.toFixed(1)))}d`;
    }

    const trendPct = Math.round(Math.abs(variance) * 100);
    const trendUp = fmt === 'days' ? variance < 0 : variance >= 0;
    return {
      ...card,
      value,
      trend: `${trendUp ? '+' : '-'}${trendPct}%`,
      trendUp,
    };
  });
}

export const verticalHealthScores: Record<string, number> = {
  Healthcare: 88,
  Investment: 74,
  'Human Resources': 62,
  Packaging: 45,
  'Life Sciences': 91,
  Manufacturing: 78,
  Legal: 55,
  'Clinical Trials': 83,
  Procurement: 69,
  Energy: 38,
  'Tech Leaders': 95,
  'Marketing Leaders': 71,
};

// Deterministic pseudo-random in [0,1) seeded by string + index
function stableRand(seed: string, n: number): number {
  let h = (n + 1) * 2654435761;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2246822519);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function generateTrend(base: number): number[] {
  return months.map((_, i) => {
    const noise = (Math.sin(i * 0.8 + base * 0.1) * 12 + Math.cos(i * 1.3) * 8);
    return Math.max(10, Math.min(100, Math.round(base + noise)));
  });
}

export const marketplaceGrowthSeries = verticals.map((name) => ({
  name,
  data: generateTrend(verticalHealthScores[name]),
}));

export const marketplaceGrowthTimeline = months.map((month, i) => {
  const point: Record<string, number | string> = { month };
  verticals.forEach((v) => {
    point[v] = marketplaceGrowthSeries.find((s) => s.name === v)!.data[i];
  });
  return point;
});

// ── RFC Meeting Analysis ──────────────────────────────────────────────────────

const BASE_RFC = months.map((month, i) => ({
  month,
  Created: 20 + Math.round(Math.sin(i * 0.7) * 8 + i * 1.5),
  Matched: 10 + Math.round(Math.sin(i * 0.7 + 1) * 5 + i * 1.2),
}));

function getRfcDataForOne(marketplace: string) {
  const scale = 0.35 + stableRand(marketplace, 0) * 0.9;
  const cShift = Math.round((stableRand(marketplace, 1) - 0.5) * 8);
  const mShift = Math.round((stableRand(marketplace, 2) - 0.5) * 5);
  return BASE_RFC.map((row, i) => ({
    month: row.month,
    Created: Math.max(1, Math.round(row.Created * scale + cShift + (stableRand(marketplace, i + 10) - 0.5) * 4)),
    Matched: Math.max(0, Math.round(row.Matched * scale + mShift + (stableRand(marketplace, i + 20) - 0.5) * 3)),
  }));
}

export function getRfcData(marketplaces: string | string[], month: string) {
  const arr = Array.isArray(marketplaces) ? marketplaces : [marketplaces];
  const allCount = MARKETPLACES.filter((m) => m !== 'All Marketplaces').length;
  const useAll = arr.length === 0 || arr.includes('All Marketplaces') || arr.length === allCount;

  let data: { month: string; Created: number; Matched: number }[];

  if (useAll) {
    data = BASE_RFC;
  } else if (arr.length === 1) {
    data = getRfcDataForOne(arr[0]);
  } else {
    // Aggregate: sum each month across all selected marketplaces
    const perMarket = arr.map((m) => getRfcDataForOne(m));
    data = BASE_RFC.map((row, i) => ({
      month: row.month,
      Created: perMarket.reduce((sum, d) => sum + d[i].Created, 0),
      Matched: perMarket.reduce((sum, d) => sum + d[i].Matched, 0),
    }));
  }

  if (month !== 'All Months') {
    data = data.filter((d) => d.month === month);
  }

  return data;
}

// Legacy export for backwards compat
export const rfcMeetingData = BASE_RFC;

// ── PSI & Seller Density ──────────────────────────────────────────────────────

const BASE_PSI = months.map((month, i) => ({
  month,
  psi: 25 + Math.round(Math.sin(i * 0.9) * 10 + i * 0.8),
  sellerDensity: 180 + Math.round(Math.cos(i * 0.7) * 40 + i * 8),
}));

function getPsiDataForOne(marketplace: string, psiType: string) {
  const mOffset = Math.round((stableRand(marketplace, 3) - 0.5) * 20);
  const pOffset = psiType === 'All PSIs' ? 0 : Math.round((stableRand(psiType, 4) - 0.5) * 12);
  const dOffset = Math.round((stableRand(marketplace, 5) - 0.5) * 80);
  return BASE_PSI.map((row, i) => ({
    psi: Math.max(5, Math.min(60, row.psi + mOffset + pOffset + Math.round((stableRand(marketplace + psiType, i) - 0.5) * 4))),
    sellerDensity: Math.max(80, row.sellerDensity + dOffset + Math.round((stableRand(marketplace, i + 30) - 0.5) * 20)),
  }));
}

export function getPsiData(marketplaces: string | string[], psiType: string) {
  const arr = Array.isArray(marketplaces) ? marketplaces : [marketplaces];
  const allCount = MARKETPLACES.filter((m) => m !== 'All Marketplaces').length;
  const useAll = arr.length === 0 || arr.includes('All Marketplaces') || arr.length === allCount;

  if (useAll) {
    const pOffset = psiType === 'All PSIs' ? 0 : Math.round((stableRand(psiType, 4) - 0.5) * 12);
    return BASE_PSI.map((row, i) => ({
      month: row.month,
      psi: Math.max(5, Math.min(60, row.psi + pOffset)),
      sellerDensity: row.sellerDensity,
    }));
  }

  if (arr.length === 1) {
    return BASE_PSI.map((row, i) => ({ month: row.month, ...getPsiDataForOne(arr[0], psiType)[i] }));
  }

  // Average PSI, sum seller density across selected marketplaces
  const perMarket = arr.map((m) => getPsiDataForOne(m, psiType));
  return BASE_PSI.map((row, i) => ({
    month: row.month,
    psi: Math.round(perMarket.reduce((sum, d) => sum + d[i].psi, 0) / perMarket.length),
    sellerDensity: perMarket.reduce((sum, d) => sum + d[i].sellerDensity, 0),
  }));
}

export const psiSellerData = BASE_PSI;

// ── Top Clients ───────────────────────────────────────────────────────────────

export const topClients = [
  // A-list: 86+
  { name: 'Accenture', marketplace: 'Tech Leaders', deals: 12, revenue: '$2.4M', score: 94 },
  { name: 'Johnson & Johnson', marketplace: 'Healthcare', deals: 10, revenue: '$2.2M', score: 92 },
  { name: 'McKinsey & Co.', marketplace: 'Investment', deals: 9, revenue: '$1.9M', score: 91 },
  { name: 'Pfizer Ltd.', marketplace: 'Life Sciences', deals: 7, revenue: '$1.6M', score: 88 },
  { name: 'Siemens AG', marketplace: 'Manufacturing', deals: 11, revenue: '$2.1M', score: 86 },
  { name: 'Merck KGaA', marketplace: 'Clinical Trials', deals: 6, revenue: '$1.5M', score: 87 },
  // B-list: 60–85
  { name: 'Deloitte', marketplace: 'Investment', deals: 8, revenue: '$1.4M', score: 83 },
  { name: 'IBM Corp.', marketplace: 'Manufacturing', deals: 8, revenue: '$1.2M', score: 82 },
  { name: 'Baker McKenzie', marketplace: 'Legal', deals: 5, revenue: '$1.0M', score: 80 },
  { name: 'SAP SE', marketplace: 'Procurement', deals: 7, revenue: '$1.3M', score: 78 },
  { name: 'Ernst & Young', marketplace: 'Investment', deals: 6, revenue: '$1.1M', score: 79 },
  { name: 'ADP Corp.', marketplace: 'Human Resources', deals: 5, revenue: '$0.8M', score: 75 },
  { name: 'Novartis AG', marketplace: 'Life Sciences', deals: 5, revenue: '$0.9M', score: 76 },
  { name: 'Honeywell', marketplace: 'Energy', deals: 4, revenue: '$0.8M', score: 71 },
  { name: 'WPP Group', marketplace: 'Marketing Leaders', deals: 4, revenue: '$0.9M', score: 73 },
  { name: 'Sealed Air', marketplace: 'Packaging', deals: 3, revenue: '$0.6M', score: 67 },
  // C-list: < 60
  { name: 'Kraft Heinz', marketplace: 'Packaging', deals: 3, revenue: '$0.5M', score: 52 },
  { name: 'GE Energy', marketplace: 'Energy', deals: 4, revenue: '$0.7M', score: 48 },
  { name: 'ArcelorMittal', marketplace: 'Manufacturing', deals: 2, revenue: '$0.4M', score: 44 },
  { name: 'Rite Aid', marketplace: 'Healthcare', deals: 2, revenue: '$0.3M', score: 41 },
];

// ── Demographic Breakdown ─────────────────────────────────────────────────────

const REGIONS = ['Americas', 'EMEA', 'APAC', 'MENA', 'Other'] as const;
const BASE_BUYER_PCT  = [36, 28, 18, 12, 6];
const BASE_SELLER_PCT = [30, 32, 22,  9, 7];

export function getDemographicData(marketplaces: string | string[], tab: 'buyers' | 'sellers') {
  const arr = Array.isArray(marketplaces) ? marketplaces : [marketplaces];
  const allCount = MARKETPLACES.filter((m) => m !== 'All Marketplaces').length;
  const useAll = arr.length === 0 || arr.includes('All Marketplaces') || arr.length === allCount;

  const base = tab === 'buyers' ? BASE_BUYER_PCT : BASE_SELLER_PCT;
  if (useAll) {
    return REGIONS.map((region, i) => ({ region, value: base[i] }));
  }

  const marketplace = arr.length === 1 ? arr[0] : arr.join('-');
  if (arr.length > 1) {
    // Blend percentages across selected marketplaces
    const allPcts = arr.map((m) => getDemographicDataForOne(m, tab));
    const blended = REGIONS.map((_, ri) =>
      Math.round(allPcts.reduce((sum, pcts) => sum + pcts[ri].value, 0) / allPcts.length)
    );
    const diff = 100 - blended.reduce((a, b) => a + b, 0);
    blended[0] += diff;
    return REGIONS.map((region, i) => ({ region, value: blended[i] }));
  }
  return getDemographicDataForOne(marketplace, tab);
}

function getDemographicDataForOne(marketplace: string, tab: 'buyers' | 'sellers') {
  const base = tab === 'buyers' ? BASE_BUYER_PCT : BASE_SELLER_PCT;
  if (marketplace === 'All Marketplaces') {
    return REGIONS.map((region, i) => ({ region, value: base[i] }));
  }

  const shifts = REGIONS.map((_, i) => Math.round((stableRand(marketplace + tab, i + 50) - 0.5) * 22));
  const raw = base.map((b, i) => Math.max(2, b + shifts[i]));
  const total = raw.reduce((a, b) => a + b, 0);
  const pct = raw.map((v) => Math.round((v / total) * 100));
  const diff = 100 - pct.reduce((a, b) => a + b, 0);
  pct[0] += diff;
  return REGIONS.map((region, i) => ({ region, value: pct[i] }));
}

export function getDemographicTotal(marketplaces: string | string[], tab: 'buyers' | 'sellers'): number {
  const arr = Array.isArray(marketplaces) ? marketplaces : [marketplaces];
  const allCount = MARKETPLACES.filter((m) => m !== 'All Marketplaces').length;
  const useAll = arr.length === 0 || arr.includes('All Marketplaces') || arr.length === allCount;
  if (useAll) return tab === 'buyers' ? 8420 : 2150;
  const base = tab === 'buyers' ? 520 : 130;
  const range = tab === 'buyers' ? 680 : 220;
  if (arr.length === 1) return base + Math.round(stableRand(arr[0] + tab, 99) * range);
  return arr.reduce((sum, m) => sum + base + Math.round(stableRand(m + tab, 99) * range), 0);
}

// Legacy export
export const demographicData = REGIONS.map((region, i) => ({ region, value: BASE_BUYER_PCT[i] }));

// ── Shared filter lists ───────────────────────────────────────────────────────

export const MARKETPLACES = [
  'All Marketplaces',
  'Healthcare',
  'Investment',
  'Human Resources',
  'Packaging',
  'Life Sciences',
  'Manufacturing',
  'Legal',
  'Clinical Trials',
  'Procurement',
  'Energy',
  'Tech Leaders',
  'Marketing Leaders',
];

export const MONTHS_OPTIONS = ['All Months', ...months];

// ── RFC Requests ──────────────────────────────────────────────────────────────

export interface BaseRfcItem {
  id: string;
  rfcNumber: string;
  productName: string;
  title: string;
  description: string;
  location: string;
  eligibility: string;
  timeline: string;
  budget: string;
  owner: string;
  status: string;
  createdAt: string;
  featured?: boolean;
}

export type RfcStatus = 'Active' | 'Pending' | 'Under Review' | 'Closed';

export interface RfcRequest extends BaseRfcItem {
  status: RfcStatus;
}

export const rfcRequests: RfcRequest[] = [
  {
    id: '1',
    rfcNumber: 'RFC-2025-001',
    productName: 'Healthcare Analytics Suite',
    title: 'Seeking Data Integration Partner for Clinical Operations',
    description: 'We are looking for a technology partner to help integrate our clinical data systems with advanced analytics capabilities. The solution should support real-time data ingestion, HIPAA-compliant storage, and provide actionable dashboards for operational leadership.',
    location: 'New York, USA',
    eligibility: 'SME & Enterprise',
    timeline: 'Q2 2025',
    budget: '$50K – $150K',
    owner: 'Marshal Kim',
    status: 'Active',
    createdAt: '2025-03-10',
  },
  {
    id: '2',
    rfcNumber: 'RFC-2025-002',
    productName: 'Supply Chain Optimisation Platform',
    title: 'Request for Connection – End-to-End Logistics Visibility',
    description: 'Our manufacturing division requires a partner capable of delivering real-time supply chain visibility across 12 distribution centres. The platform must integrate with SAP ERP and provide predictive analytics for demand forecasting and inventory management.',
    location: 'Frankfurt, Germany',
    eligibility: 'Enterprise Only',
    timeline: 'Q3 2025',
    budget: '$200K – $500K',
    owner: 'Sarah Okafor',
    status: 'Under Review',
    createdAt: '2025-03-14',
  },
  {
    id: '3',
    rfcNumber: 'RFC-2025-003',
    productName: 'ESG Reporting Toolkit',
    title: 'Sustainable Investment Reporting – Partner Search',
    description: 'We are seeking a vendor to build a comprehensive ESG reporting toolkit aligned with GRI and SASB standards. The solution should automate data collection from operational systems, support multi-jurisdictional compliance, and produce board-ready sustainability reports.',
    location: 'London, UK',
    eligibility: 'SME Only',
    timeline: 'Q1 2026',
    budget: '$80K – $120K',
    owner: 'James Whitfield',
    status: 'Pending',
    createdAt: '2025-03-18',
  },
  {
    id: '4',
    rfcNumber: 'RFC-2025-004',
    productName: 'Digital Talent Marketplace',
    title: 'HR Tech Partnership – On-Demand Workforce Solutions',
    description: 'Our HR division is exploring partnerships with platforms that can provide on-demand access to specialised talent pools across data science, engineering, and marketing verticals. We require a proven track record in enterprise workforce management.',
    location: 'Toronto, Canada',
    eligibility: 'All Companies',
    timeline: 'Q2 2025',
    budget: '$30K – $80K',
    owner: 'Priya Nair',
    status: 'Active',
    createdAt: '2025-03-22',
  },
  {
    id: '5',
    rfcNumber: 'RFC-2025-005',
    productName: 'Packaging Innovation Lab',
    title: 'Sustainable Packaging R&D Collaboration Opportunity',
    description: 'We are inviting research organisations and packaging specialists to co-develop biodegradable packaging solutions for our consumer goods division. Preference will be given to partners with existing IP in bio-polymer materials and a demonstrable commitment to circular economy principles.',
    location: 'Amsterdam, Netherlands',
    eligibility: 'Research & SME',
    timeline: 'Q4 2025',
    budget: '$120K – $250K',
    owner: 'Lars Eriksen',
    status: 'Pending',
    createdAt: '2025-03-25',
  },
  {
    id: '6',
    rfcNumber: 'RFC-2025-006',
    productName: 'Clinical Trial Management System',
    title: 'CTMS Upgrade – Phase III Trial Readiness',
    description: 'Our clinical operations team requires a modern CTMS capable of managing Phase III multi-site trials across 30+ sites globally. The system must support eTMF integration, site activation tracking, protocol deviation management, and real-time safety signal monitoring.',
    location: 'Boston, USA',
    eligibility: 'Enterprise Only',
    timeline: 'Q2 2025',
    budget: '$300K – $600K',
    owner: 'Dr. Amara Singh',
    status: 'Active',
    createdAt: '2025-04-01',
  },
  {
    id: '7',
    rfcNumber: 'RFC-2025-007',
    productName: 'Legal Document Automation',
    title: 'AI-Powered Contract Review & Drafting Platform',
    description: 'We are seeking a legal technology partner to deploy an AI-assisted contract review platform for our in-house legal team. The solution should handle NDA automation, M&A due diligence support, and integration with our existing document management system.',
    location: 'Singapore',
    eligibility: 'SME & Enterprise',
    timeline: 'Q3 2025',
    budget: '$60K – $100K',
    owner: 'Michelle Tan',
    status: 'Under Review',
    createdAt: '2025-04-05',
  },
  {
    id: '8',
    rfcNumber: 'RFC-2025-008',
    productName: 'Energy Management Platform',
    title: 'Smart Grid Integration – Renewable Energy Partner',
    description: 'Our infrastructure division is looking for partners with expertise in smart grid technology and renewable energy integration. The solution should provide demand-response capabilities, carbon footprint tracking, and seamless integration with ISO 50001 frameworks.',
    location: 'Dubai, UAE',
    eligibility: 'All Companies',
    timeline: 'Q1 2026',
    budget: '$150K – $400K',
    owner: 'Omar Al-Rashid',
    status: 'Closed',
    createdAt: '2025-02-15',
  },
];

export type DraftStatus = 'In Progress' | 'Pending Review' | 'Needs Revision' | 'Ready to Publish';

export interface RfcDraft extends BaseRfcItem {
  status: DraftStatus;
}

export const rfcDrafts: RfcDraft[] = [
  {
    id: 'draft-1',
    rfcNumber: 'DRFT-2025-009',
    productName: 'Procurement Intelligence Hub',
    title: 'Supplier Discovery Workspace for Strategic Sourcing Teams',
    description: 'This draft is being prepared for a sourcing intelligence initiative that helps procurement leaders compare suppliers, score capabilities, and accelerate shortlist creation across complex enterprise categories.',
    location: 'Chicago, USA',
    eligibility: 'Enterprise Only',
    timeline: 'Q3 2025',
    budget: '$90K – $180K',
    owner: 'Elena Morris',
    status: 'In Progress',
    createdAt: '2025-04-07',
  },
  {
    id: 'draft-2',
    rfcNumber: 'DRFT-2025-010',
    productName: 'Marketing Performance Studio',
    title: 'Cross-Channel Attribution Partner Brief for Growth Marketing',
    description: 'The draft is focused on identifying attribution and analytics partners that can unify campaign performance data, improve ROI reporting, and support executive-level planning across paid and owned channels.',
    location: 'Sydney, Australia',
    eligibility: 'SME & Enterprise',
    timeline: 'Q4 2025',
    budget: '$70K – $140K',
    owner: 'Natalie Brooks',
    status: 'Pending Review',
    createdAt: '2025-04-10',
  },
  {
    id: 'draft-3',
    rfcNumber: 'DRFT-2025-011',
    productName: 'Clinical Vendor Shortlisting',
    title: 'Specialist Patient Recruitment Support for Multi-Country Trials',
    description: 'This draft is being refined to support vendor evaluation for patient recruitment, feasibility analysis, and enrolment acceleration across a distributed clinical trial program.',
    location: 'Zurich, Switzerland',
    eligibility: 'Research & Enterprise',
    timeline: 'Q1 2026',
    budget: '$180K – $320K',
    owner: 'Dr. Ayesha Patel',
    status: 'Needs Revision',
    createdAt: '2025-04-12',
  },
  {
    id: 'draft-4',
    rfcNumber: 'DRFT-2025-012',
    productName: 'Legal Ops Automation Suite',
    title: 'Matter Intake and Workflow Automation Draft for Legal Operations',
    description: 'The legal operations team is shaping a draft RFC for workflow automation, intake standardisation, and matter prioritisation with integrations into existing collaboration and document systems.',
    location: 'Dublin, Ireland',
    eligibility: 'All Companies',
    timeline: 'Q2 2025',
    budget: '$55K – $110K',
    owner: 'Cian O\'Sullivan',
    status: 'Ready to Publish',
    createdAt: '2025-04-15',
  },
];

export interface PublishedRfc extends BaseRfcItem {
  status: 'Published';
  featured: boolean;
  endDate: string;
}

export const publishedRfcs: PublishedRfc[] = [
  {
    id: 'published-1',
    rfcNumber: 'PRFC-2025-001',
    productName: 'Healthcare Analytics Suite',
    title: 'Clinical Analytics Platform Implementation Partnership',
    description: 'This published RFC is seeking experienced healthcare technology partners to support real-time operational analytics, compliant data integration, and decision-ready reporting for clinical leadership teams across multiple regions.',
    location: 'New York, USA',
    eligibility: 'SME & Enterprise',
    timeline: 'Q2 2025',
    budget: '$50K – $150K',
    owner: 'Marshal Kim',
    status: 'Published',
    featured: false,
    createdAt: '2025-04-11',
    endDate: '2025-05-02',
  },
  {
    id: 'published-2',
    rfcNumber: 'PRFC-2025-002',
    productName: 'Digital Talent Marketplace',
    title: 'On-Demand Workforce Marketplace Expansion Brief',
    description: 'This published RFC focuses on sourcing partners that can help scale talent access across specialised digital roles, improve candidate availability visibility, and support enterprise hiring workflows across priority markets.',
    location: 'Toronto, Canada',
    eligibility: 'All Companies',
    timeline: 'Q2 2025',
    budget: '$30K – $80K',
    owner: 'Priya Nair',
    status: 'Published',
    featured: true,
    createdAt: '2025-04-14',
    endDate: '2025-05-08',
  },
  {
    id: 'published-3',
    rfcNumber: 'PRFC-2025-003',
    productName: 'Supply Chain Optimisation Platform',
    title: 'Supply Chain Visibility and Forecasting Partner Search',
    description: 'This published RFC is aimed at identifying logistics and analytics partners that can deliver end-to-end supply chain transparency, predictive planning support, and ERP-aligned implementation across distribution operations.',
    location: 'Frankfurt, Germany',
    eligibility: 'Enterprise Only',
    timeline: 'Q3 2025',
    budget: '$200K – $500K',
    owner: 'Sarah Okafor',
    status: 'Published',
    featured: false,
    createdAt: '2025-04-17',
    endDate: '2025-04-30',
  },
];

export const allRfcItems: BaseRfcItem[] = [...rfcRequests, ...rfcDrafts, ...publishedRfcs];
