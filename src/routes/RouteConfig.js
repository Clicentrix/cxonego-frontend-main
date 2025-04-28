import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
import LeadAssignmentPage from "../pages/leads/leadAssignment";
export function LoggedOutRouteConfig() {
    return (_jsx(_Fragment, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/sign-up", element: _jsx(SignUpPage, {}) }), _jsx(Route, { path: "/sign-up?google=true", element: _jsx(SignUpPage, {}) }), _jsx(Route, { path: "/sign-up?emailverified=true&role==ADMIN", element: _jsx(SignUpPage, {}) }), _jsx(Route, { path: "/sign-up?emailverified=true&role==NOTADMIN", element: _jsx(SignUpPage, {}) }), _jsx(Route, { path: "/sign-up?google=true&role==ADMIN", element: _jsx(SignUpPage, {}) }), _jsx(Route, { path: "/sign-up?google=true&role==NOTADMIN", element: _jsx(SignUpPage, {}) }), _jsx(Route, { path: "/sign-up?emailverified=true&subscription_status==INACTIVE", element: _jsx(SignUpPage, {}) }), _jsx(Route, { path: "/forget-password", element: _jsx(ForgetPassPage, {}) }), _jsx(Route, { path: "/document/auth/google/callback", element: _jsx(GoogleAuthCallback, {}) }), _jsx(Route, { path: "/auth-success", element: _jsx(AuthSuccess, {}) }), _jsx(Route, { path: "/auth-error", element: _jsx(AuthError, {}) }), _jsx(Route, { path: "*", element: _jsx(LoginPage, {}) })] }) }));
}
export function LoggedInRouteConfig() {
    return (_jsx(_Fragment, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/profile/general", element: _jsx(UserProfilePage, {}) }), _jsx(Route, { path: "/dashboardLeads", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/dashboardOpportunities", element: _jsx(OpportunitiesDashboard, {}) }), _jsx(Route, { path: "/dashboardActivities", element: _jsx(ActivitiesDashboard, {}) }), _jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/leads", element: _jsx(LeadsListViewPage, {}) }), _jsx(Route, { path: "/lead/:leadId", element: _jsx(OneLeadById, {}) }), _jsx(Route, { path: "/opportunities", element: _jsx(AllOpportunities, {}) }), _jsx(Route, { path: "/opportunity/:opportunityId", element: _jsx(OneOpportunityById, {}) }), _jsx(Route, { path: "/accounts", element: _jsx(AccountsViewPage, {}) }), _jsx(Route, { path: "/account/:accountId", element: _jsx(OneAccountById, {}) }), _jsx(Route, { path: "/contacts", element: _jsx(ContactsViewPage, {}) }), _jsx(Route, { path: "/contact/:contactId", element: _jsx(OneContactById, {}) }), _jsx(Route, { path: "/calendar", element: _jsx(CalendarComponent, {}) }), _jsx(Route, { path: "/activity", element: _jsx(AllActivitiesView, {}) }), _jsx(Route, { path: "/activity/:activityId", element: _jsx(OneActivityById, {}) }), _jsx(Route, { path: "/referrals", element: _jsx(AllReferralsView, {}) }), _jsx(Route, { path: "/referrals/:referId", element: _jsx(OneReferralById, {}) }), _jsx(Route, { path: "/notes", element: _jsx(AllNotesView, {}) }), _jsx(Route, { path: "/note/:noteId", element: _jsx(OneNoteById, {}) }), _jsx(Route, { path: "/profile/import-records", element: _jsx(ImportRecords, {}) }), _jsx(Route, { path: "/profile/subscription", element: _jsx(SubscriptionPage, {}) }), _jsx(Route, { path: "/profile/helpAndSupport", element: _jsx(HelpAndSupport, {}) }), _jsx(Route, { path: "/profile/privacy-policy", element: _jsx(PrivacyPolicy, {}) }), _jsx(Route, { path: "/profile/terms-and-conditions", element: _jsx(TermsAndConditions, {}) }), _jsx(Route, { path: "/profile/lead-assignment", element: _jsx(LeadAssignmentPage, {}) })] }) }));
}
