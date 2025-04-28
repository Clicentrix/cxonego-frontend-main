import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import moment from "moment";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
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
const emptyActivity = {
    createdAt: "",
    updatedAt: "",
    owner: null,
    activityId: "",
    subject: "",
    activityType: "Task",
    activityStatus: "Open",
    activityPriority: "High",
    startDate: "",
    dueDate: "",
    actualStartDate: "",
    actualEndDate: "",
    description: "",
    contact: null,
    company: null,
    lead: null,
    opportunity: null,
};
export const emptyDashboardActivities = {
    total_activities: 0,
    total_closed_activities: 0,
    total_inprogress_activities: 0,
    total_open_activities: 0,
    activity_status_count: [],
    activity_status_percentage: [],
    activity_type_count: [],
    activity_type_percentage: [],
    activity_data: { data: [] },
    activity_status_count_month_wise: [],
};
const initialState = {
    loading: false,
    activity: emptyActivity,
    addActivityLoader: false,
    getActivityLoader: false,
    activities: [],
    pagination: {
        page: 1,
        total: 20,
    },
    error: "",
    dashboardActivitiesAllData: emptyDashboardActivities,
    dashboardActivitiesLoader: false,
    editable: false,
    dashboardActivityData: [],
    totalActivities: 0,
};
// Fetch Activity data
//for export data
export const getAllActivities = createAsyncThunk("accounts/getAllActivities", async () => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await axios.get(`${baseUrl}activity/`, config);
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
export const fetchAllActivitiesByModuleId = createAsyncThunk("activity/fetchAllActivitiesByModuleId", async ({ moduleName, moduleId, params, }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await axios.post(`${baseUrl}activity/${moduleName}/${moduleId}?page=${params?.page}&limit=${params?.limit}&search=${params?.search}`, null, config);
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
export const fetchAllActivities = createAsyncThunk("activity/fetchAllActivities", async (params) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await api.post(`activity/getActivities?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&view=${params?.view}`, {}, config);
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
export const fetchAllActivitiesWithoutParams = createAsyncThunk("activity/fetchAllActivities", async () => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await api.post(`activity/getActivities`, {}, config);
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
export const addActivity = createAsyncThunk("activity/addActivity", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const { createdAt, updatedAt, ...payloadWithoutCreatedAt } = payload;
        const response = await axios.post(`${baseUrl}activity`, payloadWithoutCreatedAt, config);
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
export const getActivityById = createAsyncThunk("activity/getActivityById", async (activityId) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        // 6ba4ea16-cec2-4b26-ab29-351b3bc7e90e
        const response = await axios.get(`${baseUrl}activity/${activityId}`, config);
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
export const updateActivityById = createAsyncThunk("activity/updateActivityById", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const { createdAt, updatedAt, owner, ...payloadWithoutCreatedAt } = payload;
        const response = await axios.put(`${baseUrl}Activity/${payload?.activityId}`, payloadWithoutCreatedAt, config);
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
export const deleteActivitiesById = createAsyncThunk("activities/deleteActivitiesById", async (activityId) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const payload = {
            activityIds: activityId,
        };
        const response = await axios.post(`${baseUrl}activity/bulk-delete`, payload, config);
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
// For All Activities
export const createAndGetAllActivities = (payload, params) => async (dispatch) => {
    await dispatch(addActivity(payload));
    await dispatch(fetchAllActivities(params));
};
export const updateActivityByIdAndGetAllActivities = (payload, params) => async (dispatch) => {
    await dispatch(updateActivityById(payload));
    await dispatch(fetchAllActivities(params));
};
export const deleteActivitysByIdAndGetAllActivitiesTotal = (activityId, params) => async (dispatch) => {
    await dispatch(deleteActivitiesById(activityId));
    await dispatch(fetchAllActivities(params));
};
// For related View
export const createAndGetAllActivitiesByModuleId = (payload, params, moduleName, moduleId) => async (dispatch) => {
    await dispatch(addActivity(payload));
    await dispatch(fetchAllActivitiesByModuleId({ moduleName, moduleId, params }));
};
export const updateActivityByIdAndGetAllActivitiesByOpportunityId = (payload, params, moduleName, moduleId) => async (dispatch) => {
    await dispatch(updateActivityById(payload));
    await dispatch(fetchAllActivitiesByModuleId({ moduleName, moduleId, params }));
};
export const deleteActivitysByIdAndGetAllActivities = (activityId, params, moduleName, moduleId) => async (dispatch) => {
    await dispatch(deleteActivitiesById(activityId));
    await dispatch(fetchAllActivitiesByModuleId({ moduleName, moduleId, params }));
};
// FETCH DASHBOARD ACTIVITIES
export const fetchAllDashboardActivities = createAsyncThunk("activities/fetchAllDashboardActivities", async (params) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await api.post(`dashboard/activity-all?page=${params?.page}&limit=${params?.limit}&search=${params?.search}`, params?.filterParams, config);
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
export const activitySlice = createSlice({
    name: "activities",
    initialState,
    reducers: {
        handleInputChangeReducerActivity: (state, action) => {
            // type of the action payload should be object
            state.activity = {
                ...state.activity,
                ...action.payload,
            };
            return state;
        },
        resetActivity: (state) => {
            // type of the action payload should be object
            state.activity = emptyActivity;
            return state;
        },
        resetActivities: (state) => {
            state.activities = [];
        },
        setEditableMode: (state, action) => {
            state.editable = action?.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addActivity.pending, (state) => {
            state.addActivityLoader = true;
        });
        builder.addCase(addActivity.fulfilled, (state, action) => {
            state.addActivityLoader = false;
            if (action.payload?.data) {
                state.activity = action.payload?.data;
            }
            state.activity = emptyActivity;
            message.success("Activity added successfully");
            state.error = "";
        });
        builder.addCase(addActivity.rejected, (state, action) => {
            state.addActivityLoader = false;
            state.error =
                action.error.message ||
                    "Operation cannot be completed, you may want to contact administrator for help.";
            message.error("Operation cannot be completed, you may want to contact administrator for help.");
        });
        builder.addCase(getActivityById.pending, (state) => {
            state.getActivityLoader = true;
        });
        builder.addCase(getActivityById.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.activity = {
                    ...action.payload.data,
                    contact: action?.payload?.data?.contact?.contactId
                        ? action?.payload?.data?.contact?.contactId
                        : null,
                    company: action?.payload?.data?.company?.accountId
                        ? action?.payload?.data?.company?.accountId
                        : null,
                    lead: action?.payload?.data?.lead?.leadId
                        ? action?.payload?.data?.lead?.leadId
                        : null,
                    opportunity: action?.payload?.data?.opportunity?.opportunityId
                        ? action?.payload?.data?.opportunity?.opportunityId
                        : null,
                };
            }
            state.getActivityLoader = false;
            state.error = "";
        });
        builder.addCase(getActivityById.rejected, (state, action) => {
            state.getActivityLoader = false;
            state.error =
                action.error.message ||
                    "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(updateActivityById.pending, (state) => {
            state.addActivityLoader = true;
        });
        builder.addCase(updateActivityById.fulfilled, (state) => {
            state.addActivityLoader = false;
            state.editable = false;
            state.error = "";
            message.success("Activity updated successfully");
        });
        builder.addCase(updateActivityById.rejected, (state, action) => {
            state.addActivityLoader = false;
            state.error =
                action.error.message ||
                    "Operation cannot be completed, you may want to contact administrator for help.";
            message.error("Operation cannot be completed, you may want to contact administrator for help.");
        });
        builder.addCase(deleteActivitiesById.pending, (state) => {
            state.addActivityLoader = true;
        });
        builder.addCase(deleteActivitiesById.fulfilled, (state) => {
            state.addActivityLoader = false;
            state.error = "";
            message.success("Activity deleted successfully");
        });
        builder.addCase(deleteActivitiesById.rejected, (state, action) => {
            state.addActivityLoader = false;
            state.error =
                action.error.message ||
                    "Operation cannot be completed, you may want to contact administrator for help.";
            message.error("Operation cannot be completed, you may want to contact administrator for help.");
        });
        // Get all Activities
        builder.addCase(getAllActivities.pending, (state) => {
            state.getActivityLoader = true;
        });
        builder.addCase(getAllActivities.fulfilled, (state, action) => {
            if (action?.payload?.data) {
                state.totalActivities = action.payload.data.total;
                const actualdata = action.payload?.data?.map((item) => {
                    return {
                        ...item,
                        // company: item?.company?.accountId,
                        // contact: item?.contact?.contactId,
                        // lead: item?.lead?.leadId,
                        // opportunity: item?.opportunity?.opportunityId,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        createdAt: moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                        updatedAt: moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
                        startDate: item?.startDate ? item?.startDate : emptyValue,
                        dueDate: item?.dueDate ? item?.dueDate : emptyValue,
                        actualStartDate: item?.actualStartDate
                            ? moment(item?.actualStartDate).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                        actualEndDate: item?.actualEndDate
                            ? moment(item?.actualEndDate).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                    };
                });
                state.activities = actualdata;
            }
            else {
                state.activities = [];
            }
            state.getActivityLoader = false;
            state.error = "";
        });
        builder.addCase(getAllActivities.rejected, (state, action) => {
            state.getActivityLoader = false;
            state.error =
                action.error.message ||
                    "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(fetchAllActivities.pending, (state) => {
            state.getActivityLoader = true;
        });
        builder.addCase(fetchAllActivities.fulfilled, (state, action) => {
            console.log("Fetching all activities", action?.payload?.data?.data[0]);
            if (action?.payload?.data?.data) {
                state.totalActivities = action.payload.data.total;
                const actualdata = action.payload?.data?.data?.map((item) => {
                    return {
                        ...item,
                        company: item?.company?.accountId,
                        contact: item?.contact?.contactId,
                        lead: item?.lead?.leadId,
                        opportunity: item?.opportunity?.opportunityId,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        createdAt: item?.createdAt
                            ? moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                        updatedAt: item?.updatedAt
                            ? moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                        startDate: item?.startDate !== null || item?.startDate !== ""
                            ? item?.startDate
                            : emptyValue,
                        dueDate: item?.dueDate ? item?.dueDate : emptyValue,
                        actualStartDate: item?.actualStartDate
                            ? moment(item?.actualStartDate).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                        actualEndDate: item?.actualEndDate
                            ? moment(item?.actualEndDate).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                    };
                });
                state.activities = actualdata;
            }
            else {
                state.activities = [];
            }
            state.getActivityLoader = false;
            state.error = "";
        });
        builder.addCase(fetchAllActivities.rejected, (state, action) => {
            state.getActivityLoader = false;
            state.error =
                action.error.message ||
                    "Operation cannot be completed, you may want to contact administrator for help.";
        });
        // Get all activities by module id
        builder.addCase(fetchAllActivitiesByModuleId.pending, (state) => {
            state.getActivityLoader = true;
        });
        builder.addCase(fetchAllActivitiesByModuleId.fulfilled, (state, action) => {
            if (action?.payload?.data?.data) {
                state.totalActivities = action.payload.data.total;
                const actualdata = action.payload?.data?.data?.map((item) => {
                    return {
                        ...item,
                        company: item?.company?.accountId,
                        contact: item?.contact?.contactId,
                        lead: item?.lead?.leadId,
                        opportunity: item?.opportunity?.opportunityId,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        createdAt: item?.createdAt
                            ? moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                        updatedAt: item?.updatedAt
                            ? moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                        startDate: item?.startDate !== null || item?.startDate !== ""
                            ? item?.startDate
                            : emptyValue,
                        dueDate: item?.dueDate ? item?.dueDate : emptyValue,
                        actualStartDate: item?.actualStartDate
                            ? moment(item?.actualStartDate).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                        actualEndDate: item?.actualEndDate
                            ? moment(item?.actualEndDate).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                    };
                });
                state.activities = actualdata;
            }
            else {
                state.activities = [];
            }
            state.getActivityLoader = false;
            state.error = "";
        });
        builder.addCase(fetchAllActivitiesByModuleId.rejected, (state, action) => {
            state.getActivityLoader = false;
            state.error =
                action.error.message ||
                    "Operation cannot be completed, you may want to contact administrator for help.";
        });
        // FETCH DASHBOARD ACTIVITIES DATA
        builder.addCase(fetchAllDashboardActivities.pending, (state) => {
            state.dashboardActivitiesLoader = true;
        });
        builder.addCase(fetchAllDashboardActivities.fulfilled, (state, action) => {
            state.dashboardActivitiesLoader = false;
            state.error = "";
            if (action?.payload?.data) {
                state.dashboardActivitiesAllData = action.payload?.data;
            }
            else {
                state.dashboardActivitiesAllData = emptyDashboardActivities;
            }
            if (action?.payload?.data) {
                state.totalActivities = action.payload?.data?.activity_data.total;
                const actualdata = action.payload?.data?.activity_data?.data?.map((item) => {
                    return {
                        ...item,
                        company: item?.company?.accountId,
                        contact: item?.contact?.contactId,
                        lead: item?.lead?.leadId,
                        opportunity: item?.opportunity?.opportunityId,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        createdAt: item?.createdAt
                            ? moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                        updatedAt: item?.updatedAt
                            ? moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                        startDate: item?.startDate !== null || item?.startDate !== ""
                            ? item?.startDate
                            : emptyValue,
                        dueDate: item?.dueDate ? item?.dueDate : emptyValue,
                        actualStartDate: item?.actualStartDate
                            ? moment(item?.actualStartDate).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                        actualEndDate: item?.actualEndDate
                            ? moment(item?.actualEndDate).format("MMMM Do YYYY, h:mm:ss a")
                            : emptyValue,
                    };
                });
                state.dashboardActivityData = actualdata;
            }
            else {
                state.dashboardActivityData = [];
            }
        });
        builder.addCase(fetchAllDashboardActivities.rejected, (state, action) => {
            state.dashboardActivitiesLoader = false;
            state.dashboardActivitiesAllData = emptyDashboardActivities;
            state.error =
                action.error.message ||
                    "Operation cannot be completed, you may want to contact administrator for help.";
        });
    },
});
export const { handleInputChangeReducerActivity, resetActivity, resetActivities, setEditableMode, } = activitySlice.actions;
export default activitySlice.reducer;
