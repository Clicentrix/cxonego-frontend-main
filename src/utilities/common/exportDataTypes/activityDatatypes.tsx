import { ReactNode } from "react";
import { Lead, Owner, SelectValues } from "./leadDataTypes";
import { Account } from "./accountDataTypes";
import { Contact } from "./contactsDataTypes";
import { Opportunity } from "./opportunityDataTypes";

export type EditableCellProps = {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: Activity; // Assuming Activity is your data type
  handleInputChangeEdit: (
    value: any,
    dataIndex: string,
    record: Activity
  ) => void; // Adjust the type of value as needed
  save: (index: number, record: Activity) => void;
  children: React.ReactNode;
  options?: SelectValues[]; // Assuming SelectValuesArray is the type of options
};

export type ActivityColumnItems = {
  key?: string;
  title?: string | React.ReactNode | undefined;
  dataIndex?: string;
  editable?: boolean;
  render?: (text: any, record: Activity, index: number) => React.ReactNode;
  inputType?: string;
  options?: SelectValues[] | null | undefined;
  width?: number;
  filterDropdown?: (props: any) => ReactNode;
  filterIcon?: (filtered: boolean) => ReactNode;
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
  onCell?: (record: Activity) => EditableCellProps;
};

export type ActivityColumnItemsList = ActivityColumnItems[];

export type Activity = {
  createdAt: string | null;
  updatedAt: string | null;
  activityId: string;
  subject: string;
  activityType: string;
  activityStatus: string;
  activityPriority: string;
  startDate: string;
  dueDate: string;
  actualStartDate: string;
  actualEndDate: string;
  description: string;
  company: string | null;
  contact: string | null;
  lead: string | null;
  opportunity: string | null;
  owner: Owner | null;
};

export type ModifiedActivity = {
  createdAt: string | null;
  updatedAt: string | null;
  activityId: string;
  subject: string;
  activityType: string;
  activityStatus: string;
  activityPriority: string;
  startDate: string;
  dueDate: string;
  actualStartDate: string;
  actualEndDate: string;
  description: string;
  company: null | Account;
  contact: null | Contact;
  lead: null | Lead;
  opportunity: null | Opportunity;
  owner: Owner | null;
};

export type Pagination = {
  page: number;
  total: number;
};
export type FetchActivityParams = {
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

export type AllActivityProps = {
  onBoxClick?: (item: Activity) => void;
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

export type DateRange = {
  startDate: string;
  endDate: string;
};

export interface FetchAllActivityParams extends AllActivityProps {
  params: {
    page?: number;
    limit?: number;
    search?: string;
    view?: string | null;
  };
}

// Define the OneActivityById component with the activityId prop
export type OneActivityByIdProps = {
  activityId: string;
};

// DASHBOARD ACTIVITY RESPONSE
export type ActivityDashBoardFilterParams = {
  dateRange: DateRange;
  activityStatus: string[];
  activityType: string[];
  activityPriority: string[];
};

export type ActivityDashboardParams = {
  search: string | null;
  page: number | null;
  limit: number | null;
  filterParams: ActivityDashBoardFilterParams;
};

export type StatusWiseData = {
  activityStatus: string;
  count: number;
};
export type StatusWisePercent = {
  activityStatus: string;
  percentage: string;
};
export type TypeWiseData = {
  activityType: string;
  count: number;
};
export type TypeWisePercent = {
  activityType: string;
  percentage: string;
};
export type DashboardActivityData = Activity[];
export type StatusWiseDataBar = {
  Open: number;
  IN_PROGRESS: number;
  Completed: number;
};
export type activity_status_count_month_wise = {
  month: string;
  counts: StatusWiseDataBar;
};
export type DashboardActivitiesAllData = {
  total_activities: number;
  total_closed_activities: number;
  total_open_activities: number;
  total_inprogress_activities: number;
  activity_status_count: StatusWiseData[];
  activity_status_percentage: StatusWisePercent[];
  activity_type_count: TypeWiseData[];
  activity_type_percentage: TypeWisePercent[];
  activity_status_count_month_wise: activity_status_count_month_wise[];
};

export type PayloadForFcmToken = {
  fcmWebToken: string | null;
  fcmAndroidToken: string | null;
  userId: string | null;
};
