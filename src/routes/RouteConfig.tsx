import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/dashboard";
import LoginPage from "../pages/auth/login";
import SignUpPage from "../pages/auth/signUp";
import ForgetPassPage from "../pages/auth/forgetPassPage";
import LeadsListViewPage from "../pages/leads/leadsListView";
import AccountsViewPage from "../pages/accounts/accountsView";
import ContactsViewPage from "../pages/contacts/contactsView";
import OneAccountById from "../components/accounts/oneAccountById";
import AllOpportunities from "../components/opportunities/allOpportunitiesView";
import OneOpportunityById from "../components/opportunities/oneOpportunityById";
import OneContactById from "../components/contacts/oneContactById";
import OneLeadById from "../components/leads/oneLeadById";
import OpportunitiesDashboard from "../components/dashboard/opportunitiesDashboard";
import ActivitiesDashboard from "../components/dashboard/activitiesDashboard";
import CalendarComponent from "../components/calendar/calendar";
import AllActivitiesView from "../components/activities/allActivitiesView";
import OneActivityById from "../components/activities/oneActivityById";
import AllReferralsView from "../components/referrals/allReferralsView";
import OneReferralById from "../components/referrals/oneReferralById";
import AllNotesView from "../components/notes/allNotesView";
import OneNoteById from "../components/notes/oneNoteById";
import ImportRecords from "../components/importRecords/importRecords";
import UserProfilePage from "../pages/userProfile/userProfile";
import SubscriptionPage from "../components/subscription/subscription";
import HelpAndSupport from "../pages/helpAndSupport/helpAndSupport";
import PrivacyPolicy from "../pages/helpAndSupport/privacyPolicy";
import TermsAndConditions from "../pages/helpAndSupport/termsAndConditions";
import GoogleAuthCallback from "../components/documents/GoogleAuthCallback";
import AuthSuccess from "../pages/auth/AuthSuccess";
import AuthError from "../pages/auth/AuthError";
import GoogleDrivePage from "../pages/integrations/GoogleDrivePage";
import LeadAssignmentPage from "../pages/leads/leadAssignment";

export function LoggedOutRouteConfig() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-up?google=true" element={<SignUpPage />} />
        <Route path="/sign-up?emailverified=true&role==ADMIN" element={<SignUpPage />} />
        <Route path="/sign-up?emailverified=true&role==NOTADMIN" element={<SignUpPage />} />
        <Route path="/sign-up?google=true&role==ADMIN" element={<SignUpPage />} />
        <Route path="/sign-up?google=true&role==NOTADMIN" element={<SignUpPage />} />
        <Route path="/sign-up?emailverified=true&subscription_status==INACTIVE" element={<SignUpPage />} />
        <Route path="/forget-password" element={<ForgetPassPage />} />
        <Route path="/document/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/auth-error" element={<AuthError />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export function LoggedInRouteConfig() {
  return (
    <>
      <Routes>
        <Route path="/profile/general" element={<UserProfilePage />} />
        <Route path="/dashboardLeads" element={<DashboardPage />} />
        <Route
          path="/dashboardOpportunities"
          element={<OpportunitiesDashboard />}
        />
        <Route path="/dashboardActivities" element={<ActivitiesDashboard />} />
        <Route path="/" element={<DashboardPage />} />
        {/* <Route path="*" element={<DashboardPage />} /> */}
        <Route path="/leads" element={<LeadsListViewPage />} />
        <Route path="/lead/:leadId" element={<OneLeadById />} />
        <Route path="/opportunities" element={<AllOpportunities />} />
        <Route
          path="/opportunity/:opportunityId"
          element={<OneOpportunityById />}
        />
        <Route path="/accounts" element={<AccountsViewPage />} />
        <Route path="/account/:accountId" element={<OneAccountById />} />
        <Route path="/contacts" element={<ContactsViewPage />} />
        <Route path="/contact/:contactId" element={<OneContactById />} />
        <Route path="/calendar" element={<CalendarComponent />} />
        <Route path="/activity" element={<AllActivitiesView />} />
        <Route path="/activity/:activityId" element={<OneActivityById />} />
        <Route path="/referrals" element={<AllReferralsView />} />
        <Route path="/referrals/:referId" element={<OneReferralById />} />
        <Route path="/notes" element={<AllNotesView />} />
        <Route path="/note/:noteId" element={<OneNoteById />} />
        <Route path="/profile/import-records" element={<ImportRecords />} />
        <Route path="/profile/subscription" element={<SubscriptionPage />} />
        <Route path="/profile/helpAndSupport" element={<HelpAndSupport />} />
        <Route path="/profile/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/profile/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/profile/lead-assignment" element={<LeadAssignmentPage />} />
      </Routes>
    </>
  );
}
