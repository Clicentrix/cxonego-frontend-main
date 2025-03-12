import { ReactNode } from "react";
import { Lead, Owner, SelectValues } from "./leadDataTypes";

export type EditableCellProps = {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: Lead; // Assuming Lead is your data type
  handleInputChangeEdit: (value: any, dataIndex: string, record: Lead) => void; // Adjust the type of value as needed
  save: (index: number, record: Lead) => void;
  children: React.ReactNode;
  options?: SelectValues[]; // Assuming SelectValuesArray is the type of options
};

export type LeadsColumnItems = {
  key?: string;
  title?: string | React.ReactNode | undefined;
  dataIndex?: string;
  editable?: boolean;
  render?: (text: any, record: Lead, index: number) => React.ReactNode;
  inputType?: string;
  options?: SelectValues[] | null | undefined;
  width?: number;
  filterDropdown?: (props: any) => ReactNode;
  filterIcon?: (filtered: boolean) => ReactNode;
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
  onCell?: (record: Lead) => EditableCellProps;
};

export type LeadsColumnItemsList = LeadsColumnItems[];

export type Account = {
  accountId: string;
  accountName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  companySize: string;
  description: string;
  website: string;
  industry: string;
  businessType: string;
  CurrencyCode: string;
  annualRevenue: string;
  status: string;
  owner: Owner | null;
  phone: string;
  email: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  countryCode: string | null;
  name: string | null;
};

export type Pagination = {
  page: number;
  total: number;
};
export type FetchAccountsParams = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  view?: string | null;
};
export type Address = {
  country: string;
  city: string;
  state: string;
  address: string;
};

export type AllAccountsProps = {
  onBoxClick?: (item: Account) => void;
  // Adjust the type to match the shape of params
  setParams?:
    | React.Dispatch<
        React.SetStateAction<{
          page?: number | undefined;
          limit?: number | undefined;
          search?: string | undefined;
          view?: string | null;
        }>
      >
    | undefined;
};

export interface FetchAllAccountsParams extends AllAccountsProps {
  params: {
    page?: number;
    limit?: number;
    search?: string;
    view?: string | null;
  };
}

// Define the OneAccountById component with the accountId prop
export type OneAccountByIdProps = {
  accountId: string;
};
// Bulk upload
export type DuplicateAccountData = {
  accountName: string;
};
export type BulkAccountsResponse = {
  totalCount: number;
  SuccessCount: number;
  errorCount: number;
  DuplicateCount: number;
  filename: string | null;
  duplicateAccountData: DuplicateAccountData[];
};
