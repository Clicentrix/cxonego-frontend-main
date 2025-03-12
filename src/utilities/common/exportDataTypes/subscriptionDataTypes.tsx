export type SubscriptionPlan = {
  planId: string | null;
  planamount: string | null;
  planname: string | null;
  currency: string | null;
  description: string | null;
  createdAt: null;
  updatedAt: null;
  noOfUsers: string | null;
  noOfDays: string | null;
  planType: string | null;
  features: string | null;
};

// planType: "Trial", "Subscription";
export type SubscriptionAdd = {
  planId: string | null;
  userId: string | null;
  currency: string | null;
};

export type ContactAdminForCustomPlan = {
  name: string | null;
  email: string | null;
  phone: string | null;
  countryCode: string | null;
  accessToken: string | null;
  message: string | null;
  organization: string | null;
  onboardingStatus: string | null;
};

export type Subscription = {
  createdAt: string | null;
  updatedAt: string | null;
  subscriptionId: string | null;
  startDateTime: string | null;
  endDateTime: string | null;
  purchaseDateTime: string | null;
  cancellationDateTime: string | null;
  subscription_status: string | null;
  payment_status: string | null;
  razorpayPaymentId: string | null;
  customPlanAmount: string | null;
  customNoOfDays: string | null;
  customNoOfUsers: string | null;
  features: string | null;
  planName: string | null;
  planAmount: string | null;
  noOfUsers: string | null;
  planType: string | null;
};

// Org members invited

export type InvitedUser = {
  name: string | null;
  role: string | null;
  email: string | null;
  onboardingStatus: string | null;
  userId: string | null;
  id: string | null;
  isBlocked: boolean | null;
};
