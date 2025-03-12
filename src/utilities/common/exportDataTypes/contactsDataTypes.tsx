import { Account } from "./accountDataTypes";
import { Owner } from "./leadDataTypes";

export type Contact = {
  contactId: string;
  firstName: string; //required
  lastName: string; //required
  countryCode: string; //required
  phone: string | null; //required
  addressLine: string;
  email: string | null;
  city: string; //encrypt
  state: string; //required
  country: string; //required
  company: string | null; //required
  industry: string;
  designation: string;
  description: string;
  timeline: string; //required
  owner: Owner | null; //assigned by backend
  status: string; //Active\Inactive
  favourite: string;
  contactType: string; //required
  createdAt: string | null;
  updatedAt: string | null;
};

export type ModifiedContact = {
  contactId: string;
  firstName: string; //required
  lastName: string; //required
  countryCode: string; //required
  phone: string | null; //required
  addressLine: string;
  email: string | null;
  city: string; //encrypt
  state: string; //required
  country: string; //required
  company: Account | null; //required
  industry: string;
  designation: string;
  description: string;
  timeline: string; //required
  owner: Owner | null; //assigned by backend
  status: string; //Active\Inactive
  favourite: string;
  contactType: string; //required
  createdAt: string | null;
  updatedAt: string | null;
};
export type Pagination = {
  page: number;
  total: number;
};
export type FetchContactsParams = {
  page?: number;
  limit?: number;
  search?: string;
  view?: string | null;
};

export type AllContactsProps = {
  onBoxClick?: (item: Contact) => void;
  setParams?: React.Dispatch<
    React.SetStateAction<FetchAllContactsParams["params"]>
  >;
};

export interface FetchAllContactsParams extends AllContactsProps {
  params: {
    page?: number;
    limit?: number;
    search?: string;
    view?: string | null;
  };
}

export type DuplicateContactData = {
  phone: string;
  firstName: string;
  lastName: string;
};
export type BulkContactsResponse = {
  totalCount: number;
  SuccessCount: number;
  errorCount: number;
  DuplicateCount: number;
  filename: string | null;
  duplicateContactData: DuplicateContactData[];
};
