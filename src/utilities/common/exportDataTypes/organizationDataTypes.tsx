export type Organisation = {
  industry: string;
  name: string;
  country: string;
  state: string;
  city: string;
  companySize: string;
  organisationId: string;
  address: string;
  website: string;
  currency: string;
  phone: string;
  email: string;
  createdAt: string | null;
  updatedAt: string | null;
  contactToken: string | null;
  companyToken: string | null;
};
export type SalesPerson = {
  userId: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};
