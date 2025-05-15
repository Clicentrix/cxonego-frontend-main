import { ReactNode } from "react";
import { Owner, SelectValues } from "./leadDataTypes";

export type Referral = {
  referId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  referBy: string | null;
  description: string | null;
  company: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  status: string | null;
  owner: Owner | null;
  countryCode: string | null;
};
export type ReferralColumnItems = {
  key?: string;
  title?: string | React.ReactNode | undefined;
  dataIndex?: string;
  render?: (text: any, record: Referral, index: number) => React.ReactNode;
  options?: SelectValues[] | null | undefined;
  width?: number;
  filterDropdown?: (props: any) => ReactNode;
  filterIcon?: (filtered: boolean) => ReactNode;
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
};

export type ReferralColumnItemsList = ReferralColumnItems[];

export type Pagination = {
  page: number;
  total: number;
};
export type FetchReferralParams = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type FetchAllReferralParams = {
  params: {
    page?: number;
    limit?: number;
    search?: string;
  };
};
