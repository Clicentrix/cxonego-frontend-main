import { HeaderProps, NavigateAction } from "react-big-calendar";
import { Account } from "./accountDataTypes";
import { Contact } from "./contactsDataTypes";
import { Lead, Owner } from "./leadDataTypes";

export type Opportunity = {
  opportunityId: string;
  opportunityLeadStatus: string;
  title: string;
  company: string | null;
  contact: string | null;
  currency: string;
  purchaseTimeFrame: string;
  purchaseProcess: string;
  forecastCategory: string;
  estimatedRevenue: string;
  actualRevenue: string;
  estimatedCloseDate: string;
  actualCloseDate: string;
  probability: string;
  description: string;
  currentNeed: string;
  proposedSolution: string;
  stage: string;
  status: string;
  priority: string;
  Lead: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  owner: Owner | null;
  wonReason: string | null;
  lostReason: string | null;
  wonLostDescription: string | null;
};

export type ModifiledOpportunity = {
  opportunityId: string;
  opportunityLeadStatus: string;
  title: string;
  company: Account | null;
  contact: Contact | null;
  currency: string;
  purchaseTimeFrame: string;
  purchaseProcess: string;
  forecastCategory: string;
  estimatedRevenue: string;
  actualRevenue: string;
  estimatedCloseDate: string;
  actualCloseDate: string;
  probability: string;
  description: string;
  currentNeed: string;
  proposedSolution: string;
  stage: string;
  status: string;
  priority: string;
  Lead: null | Lead;
  createdAt: string | null;
  updatedAt: string | null;
  owner: Owner | null;
};
export type Pagination = {
  page: number;
  total: number;
};
export type FetchOpportunitiesParams = {
  page?: number;
  limit?: number;
  search?: string;
  view?: string | null;
};
export type SelectValues = {
  value: string;
  label: string;
};

// Toolbar

export interface CustomToolbarProps extends HeaderProps {
  date: Date;
  onNavigate?: (action: NavigateAction, newDate: Date) => void;
  onView?: (view: string) => void;
  label: string;
}

// Define the OneAccountById component with the accountId prop
export type OneOpportunityByIdProps = {
  accountId: string;
};

// DASHBOARD RESPONSE
export type OpportunityPercentStatus = {
  status: null | string;
  percentage: null | string;
};

export type OpportunityCountStatus = {
  status: string | null;
  count: number | null;
};
export type DashboardOpportunityData = Opportunity[];

export type opportunity_est_revenue_monthwise = {
  january: number | null;
  february: number | null;
  march: number | null;
  april: number | null;
  may: number | null;
  june: number | null;
  july: number | null;
  august: number | null;
  september: number | null;
  october: number | null;
  november: number | null;
  december: number | null;
};
export type DashboardOpportunitiesAllData = {
  opportunity_percentage_stage: OpportunityPercentStatus[];
  opportunity_count_stage: OpportunityCountStatus[];
  total_opportunity_count: number | null;
  total_closed_opportunity_count: number | null;
  avg_opportunity_size: number | null;
  est_opportunity_revenue: never | null;
  opportunity_est_revenue_monthwise: opportunity_est_revenue_monthwise;
};

export type DateRange = { startDate: string | null; endDate: string | null };
export type RevenueRange = {
  startPrice: string | null;
  endPrice: string | null;
};

export type DashboardOpportunitiesFilerparams = {
  salesPerson: string;
  wonReason: string[];
  lostReason: string[];
  dateRange: DateRange;
  estimatedRevenue: RevenueRange;
};

export type DashboardOpportunitiesParams = {
  stage?: string;
  search?: string;
  currency?: string;
  page?: number | null;
  limit?: number | null;
  filterParams: DashboardOpportunitiesFilerparams;
};
