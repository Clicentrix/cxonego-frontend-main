import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { fetchAllAuditsByModuleId } from "./auditSlice";
import { resetAccountForLookup } from "./accountsSlice";
import moment from "moment";
import api from "../../services/axiosGlobal";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const accessToken = localStorage.getItem("accessToken");
// const userId = localStorage.getItem("userId");
function isAccessToken(str) {
    return typeof str === "string" && str !== null;
}
// function isUserId(str: string | null) {
//   return typeof str === "string" && str !== null;
// }
export const emptyOpportunity = {
    opportunityId: "",
    opportunityLeadStatus: "DEVELOPED",
    title: "",
    company: null,
    contact: null,
    currency: "INR",
    purchaseTimeFrame: "",
    purchaseProcess: "Committee",
    forecastCategory: "Pipeline",
    estimatedRevenue: "0",
    actualRevenue: "",
    estimatedCloseDate: "",
    actualCloseDate: "",
    probability: "50",
    description: "",
    currentNeed: "",
    proposedSolution: "",
    stage: "Analysis",
    status: "Active",
    priority: "Medium",
    Lead: null,
    createdAt: "",
    updatedAt: "",
    owner: null,
    wonReason: null,
    lostReason: null,
    wonLostDescription: null,
};
export const emptyDashboardOpportunities = {
    opportunity_percentage_stage: [],
    opportunity_count_stage: [],
    total_opportunity_count: null,
    total_closed_opportunity_count: null,
    avg_opportunity_size: null,
    est_opportunity_revenue: null,
    opportunity_data: { data: [] },
    opportunity_est_revenue_monthwise: {
        january: 0,
        february: 0,
        march: 0,
        april: 0,
        may: 0,
        june: 0,
        july: 0,
        august: 0,
        september: 0,
        october: 0,
        november: 0,
        december: 0,
    },
};
const initialState = {
    loading: false,
    opportunity: emptyOpportunity,
    addOpportunityLoader: false,
    getOpportunityLoader: false,
    opportunities: [],
    pagination: {
        page: 1,
        total: 20,
    },
    error: "",
    editable: false,
    dashboardOpportunitiesAllData: emptyDashboardOpportunities,
    dashboardOpportunitiesLoader: false,
    kanbanLoader: false,
    dashboardOpportunitiesData: [],
    isModalOpenOpportunity: false,
    totalOpportunities: 0,
};
// Fetch Opportunities data
//used for getting all data in one go, for export purpose.
export const getAllOpportunities = createAsyncThunk("opportunities/getAllOpportunities", async () => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await axios.get(`${baseUrl}opportunity/`, config);
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
export const fetchAllOpportunities = createAsyncThunk("opportunities/fetchUsers", async (params) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await api.post(`opportunity/getAllopportunity?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&view=${params?.view}`, {}, config);
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
export const addOpportunity = createAsyncThunk("opportunities/addOpportunity", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const { createdAt, updatedAt, ...payloadWithoutCreatedAt } = payload;
        const response = await axios.post(`${baseUrl}opportunity/create-opportunity`, payloadWithoutCreatedAt, config);
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
export const getOpportunityById = createAsyncThunk("opportunities/getOpportunityById", async (opportunityId) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        // 6ba4ea16-cec2-4b26-ab29-351b3bc7e90e
        const response = await axios.get(`${baseUrl}opportunity/${opportunityId}`, config);
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
export const updateOpportunityById = createAsyncThunk("opportunities/updateOpportunityById", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const { createdAt, updatedAt, owner, ...payloadWithoutCreatedAt } = payload;
        const response = await axios.put(`${baseUrl}opportunity/${payload?.opportunityId}`, payloadWithoutCreatedAt, config);
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
export const updateOpportunityByIdForOwner = createAsyncThunk("opportunities/updateOpportunityByIdForOwner", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const { createdAt, updatedAt, ...payloadWithoutCreatedAt } = payload;
        const response = await axios.put(`${baseUrl}opportunity/${payload?.opportunityId}`, payloadWithoutCreatedAt, config);
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
export const deleteOpportunityById = createAsyncThunk("opportunities/deleteOpportunityById", async (opportunityId, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const payload = {
            opportunityIds: opportunityId,
        };
        const response = await axios.post(`${baseUrl}opportunity/bulk-delete`, payload, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
            return response.data;
        }
        else {
            // If response status is not 200, consider it as an error
            throw new Error("Unexpected status code: " + response?.status);
        }
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", error?.message);
            // You can handle Axios errors here and return a specific value
            return rejectWithValue(error?.response?.data?.message || "Axios error occurred");
        }
        else {
            // console.error("General error:", error?.message);
            // For non-Axios errors, just throw them again
            throw error;
        }
    }
});
export const updateOpportunityByIdAndGetAllOpportunitiesWithParams = (payload, params) => async (dispatch) => {
    await dispatch(updateOpportunityById(payload));
    await dispatch(fetchAllOpportunities(params));
};
export const createAndGetAllOpportunities = (payload, params) => async (dispatch) => {
    await dispatch(addOpportunity(payload));
    await dispatch(fetchAllOpportunities(params));
    await dispatch(resetAccountForLookup());
};
export const updateOpportunityByIdAndGetAllOpportunities = (payload, params) => async (dispatch) => {
    await dispatch(updateOpportunityById(payload));
    await dispatch(fetchAllOpportunities(params));
};
export const deleteOpportunityByIdAndGetAllOpportunities = (opportunityId, params) => async (dispatch) => {
    await dispatch(deleteOpportunityById(opportunityId));
    await dispatch(fetchAllOpportunities(params));
};
// AUDITS
export const updateOpportunityByIdAndGetAudits = (payload) => async (dispatch) => {
    await dispatch(updateOpportunityById(payload));
    await dispatch(getOpportunityById(payload?.opportunityId));
    await dispatch(fetchAllAuditsByModuleId({
        moduleName: "opportunity",
        moduleId: payload?.opportunityId,
    }));
};
export const updateOpportunityForOwnerByIdAndGetAudits = (payload) => async (dispatch) => {
    await dispatch(updateOpportunityByIdForOwner(payload));
    await dispatch(getOpportunityById(payload?.opportunityId));
    await dispatch(fetchAllAuditsByModuleId({
        moduleName: "opportunity",
        moduleId: payload?.opportunityId,
    }));
};
// FETCH DASHBOARD OPPORTUNITY
export const fetchAllDashboardOpportunities = createAsyncThunk("opportunities/fetchAllDashboardOpportunities", async (params) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await api.post(`dashboard/opportunity-all?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&stage=${params?.stage}&currency=${params?.currency}`, params?.filterParams, config);
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
// For related View
export const fetchAllOpportunitiesByModuleId = createAsyncThunk("opportunities/fetchAllOpportunitiesByModuleId", async ({ moduleName, moduleId, params, }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await api.post(`opportunity/getAllopportunity/by${moduleName}/${moduleId}?page=${params?.page}&limit=${params?.limit}&search=${params?.search?.toLocaleLowerCase()}`, {}, config);
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
// For related View
export const createAndGetAllOpportunitiesByModuleId = (payload, params, moduleName, moduleId) => async (dispatch) => {
    await dispatch(addOpportunity(payload));
    await dispatch(fetchAllOpportunitiesByModuleId({ moduleName, moduleId, params }));
};
export const deleteOpportunitiesByIdAndGetAllOpportunitiesByModuleId = (opportunityId, params, moduleName, moduleId) => async (dispatch) => {
    await dispatch(deleteOpportunityById(opportunityId));
    await dispatch(fetchAllOpportunitiesByModuleId({ moduleName, moduleId, params }));
};
export const opportunitySlice = createSlice({
    name: "opportunities",
    initialState,
    reducers: {
        handleInputChangeReducerOpportunity: (state, action) => {
            // type of the action payload should be object
            state.opportunity = {
                ...state.opportunity,
                ...action.payload,
            };
            return state;
        },
        handleOpportunityChangeReducer: (state, action) => {
            // type of the action payload should be object
            state.opportunity = action?.payload;
            return state;
        },
        resetOpportunity: (state) => {
            // type of the action payload should be object
            state.opportunity = emptyOpportunity;
            return state;
        },
        setCompanyId: (state, action) => {
            state.opportunity = {
                ...state.opportunity,
                ...action.payload,
            };
        },
        resetOpportunities: (state) => {
            state.opportunities = [];
        },
        setEditableMode: (state, action) => {
            state.editable = action?.payload;
        },
        resetIsModalOpenOpportunity: (state, action) => {
            state.isModalOpenOpportunity = action?.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllOpportunities.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllOpportunities.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            if (action?.payload?.data) {
                state.totalOpportunities = action?.payload?.data?.total;
                const actualdata = action.payload?.data?.map((item) => {
                    return {
                        ...item,
                        company: item?.company?.accountId === null ||
                            item?.company?.accountId === "" ||
                            item?.company?.accountId === undefined
                            ? null
                            : `${item?.company?.accountName}`,
                        contact: item?.contact?.contactId === null ||
                            item?.contact?.contactId === "" ||
                            item?.contact?.contactId === undefined
                            ? null
                            : `${item?.contact?.firstName} ${item?.contact?.lastName}`,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        // Lead: item?.Lead?.leadId,
                        createdAt: moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                        updatedAt: moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
                    };
                });
                state.opportunities = actualdata;
            }
            else {
                state.opportunities = [];
            }
        });
        builder.addCase(getAllOpportunities.rejected, (state, action) => {
            state.loading = false;
            state.opportunities = [];
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(fetchAllOpportunities.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllOpportunities.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            if (action?.payload?.data?.data) {
                state.totalOpportunities = action?.payload?.data?.total;
                const actualdata = action.payload?.data?.data?.map((item) => {
                    return {
                        ...item,
                        company: item?.company?.accountId === null ||
                            item?.company?.accountId === "" ||
                            item?.company?.accountId === undefined
                            ? null
                            : `${item?.company?.accountName}/${item?.company?.accountId}`,
                        contact: item?.contact?.contactId === null ||
                            item?.contact?.contactId === "" ||
                            item?.contact?.contactId === undefined
                            ? null
                            : `${item?.contact?.firstName} ${item?.contact?.lastName}/${item?.contact?.contactId}`,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        Lead: item?.Lead?.leadId,
                        createdAt: moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                        updatedAt: moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
                    };
                });
                state.opportunities = actualdata;
            }
            else {
                state.opportunities = [];
            }
        });
        builder.addCase(fetchAllOpportunities.rejected, (state, action) => {
            state.loading = false;
            state.opportunities = [];
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(addOpportunity.pending, (state) => {
            state.addOpportunityLoader = true;
        });
        builder.addCase(addOpportunity.fulfilled, (state) => {
            state.addOpportunityLoader = false;
            state.opportunity = emptyOpportunity;
            message.success("Opportunity added successfully");
            state.error = "";
        });
        builder.addCase(addOpportunity.rejected, (state, action) => {
            state.addOpportunityLoader = false;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
            message.error("Operation cannot be completed, you may want to contact administrator for help.");
        });
        builder.addCase(getOpportunityById.pending, (state) => {
            state.getOpportunityLoader = true;
        });
        builder.addCase(getOpportunityById.fulfilled, (state, action) => {
            if (action?.payload?.data) {
                const actualdata = {
                    ...action?.payload?.data,
                    contact: action?.payload?.data?.contact?.contactId
                        ? action?.payload?.data?.contact?.contactId
                        : null,
                    company: action?.payload?.data?.company?.accountId
                        ? action?.payload?.data?.company?.accountId
                        : null,
                };
                state.opportunity = actualdata;
                state.getOpportunityLoader = false;
            }
            state.error = "";
        });
        builder.addCase(getOpportunityById.rejected, (state, action) => {
            state.getOpportunityLoader = false;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(updateOpportunityById.pending, (state) => {
            state.addOpportunityLoader = true;
        });
        builder.addCase(updateOpportunityById.fulfilled, (state) => {
            state.addOpportunityLoader = false;
            state.editable = false;
            state.error = "";
            message.success("Opportunity updated successfully");
        });
        builder.addCase(updateOpportunityById.rejected, (state, action) => {
            state.addOpportunityLoader = false;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
            message.error("Operation cannot be completed, you may want to contact administrator for help.");
        });
        builder.addCase(updateOpportunityByIdForOwner.pending, (state) => {
            state.addOpportunityLoader = true;
        });
        builder.addCase(updateOpportunityByIdForOwner.fulfilled, (state) => {
            state.addOpportunityLoader = false;
            state.editable = false;
            state.error = "";
            message.success("Owner updated successfully");
        });
        builder.addCase(updateOpportunityByIdForOwner.rejected, (state, action) => {
            state.addOpportunityLoader = false;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
            message.error("Operation cannot be completed, you may want to contact administrator for help.");
        });
        builder.addCase(deleteOpportunityById.pending, (state) => {
            state.addOpportunityLoader = true;
        });
        builder.addCase(deleteOpportunityById.fulfilled, (state) => {
            state.addOpportunityLoader = false;
            state.error = "";
            message.success("Opportunities deleted successfully");
        });
        builder.addCase(deleteOpportunityById.rejected, (state, action) => {
            state.addOpportunityLoader = false;
            message.error(typeof action?.payload === "string"
                ? action?.payload
                : "Operation cannot be completed, you may want to contact administrator for help.");
        });
        // FETCH DASHBOARD OPPORTUNITIES
        builder.addCase(fetchAllDashboardOpportunities.pending, (state) => {
            state.dashboardOpportunitiesLoader = true;
        });
        builder.addCase(fetchAllDashboardOpportunities.fulfilled, (state, action) => {
            state.dashboardOpportunitiesLoader = false;
            state.error = "";
            if (action?.payload?.data) {
                state.dashboardOpportunitiesAllData = action.payload?.data;
            }
            else {
                state.dashboardOpportunitiesAllData = emptyDashboardOpportunities;
            }
            if (action?.payload?.data?.opportunity_data?.data) {
                const actualdata = action.payload?.data?.opportunity_data?.data?.map((item) => {
                    return {
                        ...item,
                        company: item?.company?.accountId === null ||
                            item?.company?.accountId === "" ||
                            item?.company?.accountId === undefined
                            ? null
                            : `${item?.company?.accountName}/${item?.company?.accountId}`,
                        contact: item?.contact?.contactId === null ||
                            item?.contact?.contactId === "" ||
                            item?.contact?.contactId === undefined
                            ? null
                            : `${item?.contact?.firstName} ${item?.contact?.lastName}/${item?.contact?.contactId}`,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        Lead: item?.Lead?.leadId,
                        createdAt: moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                        updatedAt: moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
                    };
                });
                state.dashboardOpportunitiesData = actualdata;
            }
            else {
                state.dashboardOpportunitiesData = [];
            }
        });
        builder.addCase(fetchAllDashboardOpportunities.rejected, (state, action) => {
            state.dashboardOpportunitiesLoader = false;
            state.dashboardOpportunitiesAllData = emptyDashboardOpportunities;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
        // For Related view
        builder.addCase(fetchAllOpportunitiesByModuleId.pending, (state) => {
            state.kanbanLoader = true;
            state.getOpportunityLoader = true;
        });
        builder.addCase(fetchAllOpportunitiesByModuleId.fulfilled, (state, action) => {
            state.kanbanLoader = false;
            state.getOpportunityLoader = false;
            state.error = "";
            if (action?.payload?.data?.data) {
                state.totalOpportunities = action?.payload?.data?.total;
                const actualdata = action.payload?.data?.data?.map((item) => {
                    return {
                        ...item,
                        company: item?.company?.accountId === null ||
                            item?.company?.accountId === "" ||
                            item?.company?.accountId === undefined
                            ? null
                            : `${item?.company?.accountName}/${item?.company?.accountId}`,
                        contact: item?.contact?.contactId === null ||
                            item?.contact?.contactId === "" ||
                            item?.contact?.contactId === undefined
                            ? null
                            : `${item?.contact?.firstName} ${item?.contact?.lastName}/${item?.contact?.contactId}`,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        Lead: item?.Lead?.leadId,
                        createdAt: moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                        updatedAt: moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
                    };
                });
                state.opportunities = actualdata;
            }
            else {
                state.opportunities = [];
            }
        });
        builder.addCase(fetchAllOpportunitiesByModuleId.rejected, (state, action) => {
            state.kanbanLoader = false;
            state.getOpportunityLoader = false;
            state.opportunities = [];
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
    },
});
export const { handleInputChangeReducerOpportunity, resetOpportunity, handleOpportunityChangeReducer, setCompanyId, resetOpportunities, setEditableMode, resetIsModalOpenOpportunity, } = opportunitySlice.actions;
export default opportunitySlice.reducer;
