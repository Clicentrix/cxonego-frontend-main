import { Organisation } from "./organizationDataTypes";

export type User = {
  userId: string | null | undefined;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  countryCode: string | null;
  phone: string | null;
  companySize: string | null;
  primaryIntension: string | null;
  otp: string | null;
  email: string | null;
  password: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  country: string | null;
  theme: string | null;
  currency: string | null;
  industry: string | null;
  jobTitle: string | null;
  isActive: boolean | null;
  emailVerified: boolean | null;
  role: string | null;
  companyName: string | null;
  organizationId: string | null;
  jobtitle: string | null;
  backgroundImageUrl: null | string;
  fcmWebToken: string | null;
  fcmAndroidToken: string | null;
  organisation: Organisation | null;
};
export type UserUpdateType = {
  userId: string | null | undefined;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  countryCode: string | null;
  phone: string | null;
  companySize: string | null;
  primaryIntension: string | null;
  otp: string | null;
  email: string | null;
  password: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  country: string | null;
  theme: string | null;
  currency: string | null;
  industry: string | null;
  jobTitle: string | null;
  isActive: boolean | null;
  emailVerified: boolean | null;
  role: string | null;
  companyName: string | null;
  organizationId: string | null;
  jobtitle: string | null;
  backgroundImageUrl: null | string;
  fcmWebToken: string | null;
  fcmAndroidToken: string | null;
  organisation: string | null;
};

export type ShortUserProfile = {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  countryCode: string | null;
  currency: string | null;
  userId: string | null;
};

export type FirebasePostUser = {
  email: string | null;
  userId: string | null;
  isVarified: boolean | null;
  accessToken: string | null;
};

export type InviteUser = {
  email: string | null;
  company: string | null;
  role: string | null;
  organizationId: string | null;
};

export type InviteUserPayload = {
  invites: InviteUser[];
  hostUserId: string | null;
};

export type ChangeUserRole = {
  userId: string | null;
  role: string | null;
};

export type BlockUserPayload = {
  userId: string | null;
  isBlocked: boolean;
};