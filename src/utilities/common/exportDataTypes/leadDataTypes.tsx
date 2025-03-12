import { HeaderProps, NavigateAction } from "react-big-calendar";
import { Account } from "./accountDataTypes";
import { Contact } from "./contactsDataTypes";

export type Lead = {
  leadId: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string | null;
  title: string;
  description: string;
  email: string | null;
  country: string;
  state: string;
  city: string;
  leadSource: string;
  owner: null | Owner;
  rating: string;
  status: string;
  price: string | null;
  company: string | null;
  contact: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  currency: string;
};

export type Owner = {
  userId: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};
export type ModifiedLead = {
  leadId: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  title: string;
  email: string;
  country: string;
  state: string;
  city: string;
  leadSource: string;
  owner: null | Owner;
  rating: string;
  status: string;
  price: string | null;
  company: Account;
  contact: Contact;
  createdAt: string | null;
  updatedAt: string | null;
  currency: string;
};
// LEADS DASHBOARD RESPONSE
export type LeadPercentStatus = {
  status: null | string;
  percentage: null | string;
};

export type LeadCountStatus = {
  status: string | null;
  count: number | null;
};
export type DashboardLeadsData = Lead[];
export type DashboardLeadsAllData = {
  lead_percentage_status: LeadPercentStatus[];
  lead_count_status: LeadCountStatus[];
  total_no_of_leads: number | null;
  leads_with_status_new: number | null;
  lead_qualific_rate: number | null;
  revenue: number | null;
  avg_lead_size: number | null;
};

export type DateRange = { startDate: string | null; endDate: string | null };
export type RevenueRange = {
  startPrice: string | null;
  endPrice: string | null;
};

export type DashboardLeadsFilerparams = {
  country?: string[];
  state: string;
  city: string;
  leadSource: string[];
  salesPerson: string;
  dateRange: DateRange;
  estimatedRevenue: RevenueRange;
};

export type DashboardLeadsParams = {
  status?: string;
  search?: string;
  page?: number | null;
  limit?: number | null;
  filterParams: DashboardLeadsFilerparams;
};
export type Pagination = {
  page?: number;
  total?: number;
};

export type FetchLeadsParams = {
  page?: number | null;
  limit?: number | null;
  search?: string | null;
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
// Bulk Upload
export type BulkLeadsResponse = {
  totalCount: number;
  SuccessCount: number;
  errorCount: number;
  filename: string | null;
};
