import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authenticationSlice from "../features/authenticationSlice";
import leadSlice from "../features/leadSlice";
import accountSlice from "../features/accountsSlice";
import contactSlice from "../features/contactsSlice";
import opportunitySlice from "../features/opportunitiesSlice";
import activitySlice from "../features/activitySlice";
import auditSlice from "../features/auditSlice";
import referralSlice from "../features/referralsSlice";
import appointmentSlice from "../features/calendarSlice";
import organisationSlice from "../features/organizationSlice";
import noteSlice from "../features/noteSlice";
import subscriptionSlice from "../features/subscriptionSlice";
import documentSlice from "../features/documentSlice";
const rootReducer = combineReducers({
    authentication: authenticationSlice,
    leads: leadSlice,
    accounts: accountSlice,
    contacts: contactSlice,
    opportunities: opportunitySlice,
    activities: activitySlice,
    audits: auditSlice,
    referrals: referralSlice,
    appointments: appointmentSlice,
    organisations: organisationSlice,
    notes: noteSlice,
    subscriptions: subscriptionSlice,
    documents: documentSlice,
});
const store = configureStore({
    reducer: rootReducer,
    devTools: true,
});
export default store;
