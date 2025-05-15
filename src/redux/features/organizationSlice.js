import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { updateUserByUserId } from "./authenticationSlice";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const accessToken = localStorage.getItem("accessToken");
const userId = localStorage.getItem("userId");
function isAccessToken(str) {
    return typeof str === "string" && str !== null;
}
function isUserId(str) {
    return typeof str === "string" && str !== null;
}
const emptyOrganisation = {
    industry: "",
    name: "",
    country: "",
    state: "",
    city: "",
    companySize: "",
    organisationId: "",
    address: "",
    website: "",
    currency: "",
    phone: "",
    email: "",
    createdAt: null,
    updatedAt: null,
    companyToken: "",
    contactToken: "",
};
const initialState = {
    loading: false,
    organisation: emptyOrganisation,
    addOrganisationLoader: false,
    getOrganisationLoader: false,
    organisations: [],
    error: "",
    salesPersonData: [],
};
export const addOrganisation = createAsyncThunk("organisation/addOrganisation", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const { createdAt, updatedAt, ...payloadWithoutCreatedAt } = payload;
        const response = await axios.post(`${baseUrl}organization/create-organization`, payloadWithoutCreatedAt, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error?.response?.data?.message);
            message?.error(error?.response?.data?.message);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
// Get all sales person of your organzation
export const fetchAllSalesPersonByUserId = createAsyncThunk("organisations/fetchAllSalesPersonByUserId", async () => {
    try {
        const userIdHere = isUserId(userId) ? userId : undefined;
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await axios.get(`${baseUrl}users/organization/userslist/${userIdHere}`, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
// User onboarding flow
export const addOrganisationAndUpdateUserData = (organisation, user) => async (dispatch) => {
    await dispatch(addOrganisation(organisation));
    await dispatch(updateUserByUserId(user));
};
export const organisationSlice = createSlice({
    name: "organisations",
    initialState,
    reducers: {
        handleInputChangeReducerOrganisation: (state, action) => {
            // type of the action payload should be objec
            state.organisation = {
                ...state.organisation,
                ...action.payload,
            };
            return state;
        },
        handleOrganisationChangeReducer: (state, action) => {
            // type of the action payload should be objec
            state.organisation = action?.payload;
            return state;
        },
        resetOrganisation: (state) => {
            // type of the action payload should be object
            state.organisation = emptyOrganisation;
            return state;
        },
        resetOrganisations: (state) => {
            state.organisations = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addOrganisation.pending, (state) => {
            state.addOrganisationLoader = true;
        });
        builder.addCase(addOrganisation.fulfilled, (state, action) => {
            state.addOrganisationLoader = false;
            if (action.payload?.data) {
                state.organisation = action.payload?.data;
            }
            state.organisation = emptyOrganisation;
            message.success("Organisation added successfully");
            state.error = "";
        });
        builder.addCase(addOrganisation.rejected, (state, action) => {
            state.addOrganisationLoader = false;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(fetchAllSalesPersonByUserId.pending, (state) => {
            state.getOrganisationLoader = true;
        });
        builder.addCase(fetchAllSalesPersonByUserId.fulfilled, (state, action) => {
            state.getOrganisationLoader = false;
            if (action?.payload?.data) {
                state.salesPersonData = action.payload.data;
            }
            else {
                console.log("No data found in payload");
            }
            state.error = "";
        });
        builder.addCase(fetchAllSalesPersonByUserId.rejected, (state, action) => {
            state.getOrganisationLoader = false;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
    },
});
export const { handleInputChangeReducerOrganisation, resetOrganisation, handleOrganisationChangeReducer, resetOrganisations, } = organisationSlice.actions;
export default organisationSlice.reducer;
