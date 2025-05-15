import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "../app/store";
import { message } from "antd";
import {
  DashboardLeadsAllData,
  DashboardLeadsData,
  DashboardLeadsParams,
  FetchLeadsParams,
  Lead,
  ModifiedLead,
  Pagination,
} from "../../utilities/common/exportDataTypes/leadDataTypes";
import { fetchAllAuditsByModuleId } from "./auditSlice";
import { resetAccountForLookup } from "./accountsSlice";
import moment from "moment";
import api from "../../services/axiosGlobal";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const accessToken = localStorage.getItem("accessToken");

function isAccessToken(str: string | null) {
  return typeof str === "string" && str !== null;
}

export const emptyLead = {
  leadId: "",
  firstName: "",
  lastName: "",
  countryCode: "+91",
  phone: null,
  title: "",
  description: "",
  email: null,
  country: "",
  city: "",
  state: "",
  leadSource: "Referrals",
  owner: null,
  rating: "Cold",
  status: "New",
  price: null,
  company: null,
  contact: null,
  createdAt: "",
  updatedAt: "",
  currency: "INR",
};

export const emptyDashboardLeads = {
  lead_percentage_status: [],
  lead_count_status: [],
  total_no_of_leads: null,
  leads_with_status_new: null,
  lead_qualific_rate: null,
  revenue: null,
  avg_lead_size: null,
};

type InitialState = {
  loading: boolean;
  leads: Lead[];
  lead: Lead;
  pagination: Pagination;
  error: string;
  addLeadLoader: boolean;
  getLeadLoader: boolean;
  editable: boolean;
  dashboardLeadsAllData: DashboardLeadsAllData;
  dashboardLeadsLoader: boolean;
  kanbanLoader: boolean;
  dashboardLeadsData: DashboardLeadsData;
  totalLeads: number;
};
const initialState: InitialState = {
  loading: false,
  lead: emptyLead,

  addLeadLoader: false,
  getLeadLoader: false,
  leads: [],
  pagination: {
    page: 1,
    total: 20,
  },
  error: "",
  editable: false,
  dashboardLeadsAllData: emptyDashboardLeads,
  dashboardLeadsLoader: false,
  kanbanLoader: false,
  dashboardLeadsData: [],
  totalLeads:0,
};

// Fetch Leads data
export const getAllLeads = createAsyncThunk(
  "accounts/getAllLeads",
  async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };

      const response = await axios.get(`${baseUrl}lead/`, config);
      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
      } else {
        console.error("ERROR", error);
      }
      // You should return a rejected Promise with the error
      throw error;
    }
  }
);

export const fetchAllLeadsWithParams = createAsyncThunk(
  "leads/fetchAllLeadsWithParams",
  async (params: FetchLeadsParams) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await api.post(
        `lead/get-leads?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&view=${params?.view}`,
        {},
        config
      );
      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
      } else {
        console.error("ERROR", error);
      }
      // You should return a rejected Promise with the error
      throw error;
    }
  }
);

export const addLead = createAsyncThunk(
  "leads/addLead",
  async (payload: Lead) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const { createdAt, updatedAt, ...payloadWithoutCreatedAt } = payload;
      const response = await axios.post(
        `${baseUrl}lead/create-lead`,
        payloadWithoutCreatedAt,
        config
      );
      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
      } else {
        console.error("ERROR", error);
      }
      // You should return a rejected Promise with the error
      throw error;
    }
  }
);

export const getLeadById = createAsyncThunk(
  "leads/getLeadById",
  async (leadId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      // 6ba4ea16-cec2-4b26-ab29-351b3bc7e90e
      const response = await axios.get(
        `${baseUrl}lead/get-lead/${leadId}`,
        config
      );
      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
      } else {
        console.error("ERROR", error);
      }
      // You should return a rejected Promise with the error
      throw error;
    }
  }
);

export const updateLeadById = createAsyncThunk(
  "leads/updateLeadById",
  async (payload: Lead) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const { createdAt, updatedAt,owner, ...payloadWithoutCreatedAt } =
        payload;

      const response = await axios.put(
        `${baseUrl}lead/update-lead/${payload?.leadId}`,
        payloadWithoutCreatedAt,
        config
      );
      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
      } else {
        console.error("ERROR", error);
      }
      // You should return a rejected Promise with the error
      throw error;
    }
  }
);

export const updateLeadByIdForOwner = createAsyncThunk(
  "leads/updateLeadByIdForOwner",
  async (payload: Lead) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const { createdAt, updatedAt, ...payloadWithoutCreatedAt } =
        payload;

      const response = await axios.put(
        `${baseUrl}lead/update-lead/${payload?.leadId}`,
        payloadWithoutCreatedAt,
        config
      );
      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
      } else {
        console.error("ERROR", error);
      }
      // You should return a rejected Promise with the error
      throw error;
    }
  }
);

export const deleteLeadById = createAsyncThunk(
  "leads/deleteLeadById",
  async (leadId: React.Key[]) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const payload = {
        leadIds: leadId,
      };
      const response = await axios.post(
        `${baseUrl}lead/bulk-delete`,
        payload,
        config
      );
      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
      } else {
        console.error("ERROR", error);
      }
      // You should return a rejected Promise with the error
      throw error;
    }
  }
);

export const addBulkLeads = createAsyncThunk(
  "user/createBulkUsers",
  async (file: File) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${baseUrl}lead/upload`,
        formData,
        config
      );
      if (response?.status === 200) {
        message.success("Leads created successfully");
      }
      // If there's a successful response, return the data

      return response.data;
    } catch (error) {
      // Handle errors, including API errors and network errors
      console.log("action.payload.message 00", error);
      // message.error(error?.response?.data?.message);

      // message.error(error?.response?.data?.error);
    }
  }
);

// For related View

export const fetchAllLeadsByModuleId = createAsyncThunk(
  "leads/fetchAllLeadsByModuleId",
  async ({
    moduleName,
    moduleId,
    params,
  }: {
    moduleName: string;
    moduleId: string;
    params: FetchLeadsParams;
  }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await api.post(
        `lead/by${moduleName}/${moduleId}?page=${params?.page}&limit=${
          params?.limit
        }&search=${params?.search?.toLocaleLowerCase()}`,
        {},
        config
      );

      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
      } else {
        console.error("ERROR", error);
      }
      // You should return a rejected Promise with the error
      throw error;
    }
  }
);

export const createAndGetAllleads =
  (payload: Lead, params: FetchLeadsParams) =>
  async (dispatch: AppDispatch) => {
    await dispatch(addLead(payload));
    await dispatch(fetchAllLeadsWithParams(params));
    await dispatch(resetAccountForLookup());
  };

export const updateLeadByIdAndGetAllleads =
  (payload: Lead, params: FetchLeadsParams) =>
  async (dispatch: AppDispatch) => {
    await dispatch(updateLeadById(payload));
    await dispatch(fetchAllLeadsWithParams(params));
  };

// Define updateLeadByIdAndGetAllleadsWithoutParams properly
export const updateLeadByIdAndGetAllleadsWithParams =
  (payload: Lead, params: FetchLeadsParams) => async (dispatch: AppDispatch) => {
    // Perform asynchronous operations such as API calls here
    await dispatch(updateLeadById(payload)); // Example API call
    await dispatch(fetchAllLeadsWithParams(params));
  };

export const deleteLeadByIdAndGetAllleads =
  (leadId: React.Key[], params: FetchLeadsParams) =>
  async (dispatch: AppDispatch) => {
    await dispatch(deleteLeadById(leadId));
    await dispatch(fetchAllLeadsWithParams(params));
  };

export const addBulkLeadsAndGetAllleads =
  (file: File, params: FetchLeadsParams) => async (dispatch: AppDispatch) => {
    await dispatch(addBulkLeads(file));
    await dispatch(fetchAllLeadsWithParams(params));
  };

// For related View

export const createAndGetAllLeadsByModuleId =
  (
    payload: Lead,
    params: FetchLeadsParams,
    moduleName: string,
    moduleId: string
  ) =>
  async (dispatch: AppDispatch) => {
    await dispatch(addLead(payload));
    await dispatch(fetchAllLeadsByModuleId({ moduleName, moduleId, params }));
  };

export const deleteLeadsByIdAndGetAllLeadsByModuleId =
  (
    leadId: React.Key[],
    params: FetchLeadsParams,
    moduleName: string,
    moduleId: string
  ) =>
  async (dispatch: AppDispatch) => {
    await dispatch(deleteLeadById(leadId));
    await dispatch(fetchAllLeadsByModuleId({ moduleName, moduleId, params }));
  };

// AUDIT

export const updateLeadByIdAndGetAudits =
  (payload: any) => async (dispatch: AppDispatch) => {
    await dispatch(updateLeadById(payload));
     await dispatch(getLeadById(payload?.leadId))
    await dispatch(
      fetchAllAuditsByModuleId({
        moduleName: "lead",
        moduleId: payload?.leadId,
      })
    );
  };

  export const updateLeadOwnerByIdAndGetAudits =
  (payload: any) => async (dispatch: AppDispatch) => {
    await dispatch(updateLeadByIdForOwner(payload));
     await dispatch(getLeadById(payload?.leadId))
    await dispatch(
      fetchAllAuditsByModuleId({
        moduleName: "lead",
        moduleId: payload?.leadId,
      })
    );
  };
// FETCH DASHBOARD LEADS
export const fetchAllDashboardLeads = createAsyncThunk(
  "leads/fetchAllDashboardLeads",
  async (params: DashboardLeadsParams) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await api.post(
        `dashboard/leads-all?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&status=${params?.status}`,
        params?.filterParams,
        config
      );

      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
      } else {
        console.error("ERROR", error);
      }
      // You should return a rejected Promise with the error
      throw error;
    }
  }
);

export const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    handleInputChangeReducerLead: (state, action) => {
      // type of the action payload should be object
      state.lead = {
        ...state.lead,
        ...action.payload,
      };
      return state;
    },
    handleLeadChangeReducer: (state, action) => {
      // type of the action payload should be object
      state.lead = action?.payload;
      return state;
    },
    resetLead: (state) => {
      // type of the action payload should be object
      state.lead = emptyLead;
      return state;
    },
    setCompanyId: (state, action) => {
      state.lead = {
        ...state.lead,
        ...action.payload,
      };
    },
    resetLeads: (state) => {
      state.leads = [];
    },
    setEditableMode: (state, action) => {
      state.editable = action?.payload;
    },
  },
  extraReducers: (builder) => {
    //get all leads
    builder.addCase(getAllLeads.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllLeads.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      if (action?.payload?.data) {
        state.totalLeads = action?.payload.data?.total
        const actualdata = action.payload?.data?.map(
          (item: ModifiedLead) => {
            return {
              ...item,
              company:
                item?.company?.accountId === null ||
                item?.company?.accountId === "" ||
                item?.company?.accountId === undefined
                  ? null
                  : `${item?.company?.accountName}`,
              contact:
                item?.contact?.contactId === null ||
                item?.contact?.contactId === "" ||
                item?.contact?.contactId === undefined
                  ? null
                  : `${item?.contact?.firstName} ${item?.contact?.lastName}`,
              owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
              createdAt: moment(item?.createdAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              updatedAt: moment(item?.updatedAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
            };
          }
        );
        state.leads = actualdata;
      } else {
        state.leads = [];
      }
    });
    builder.addCase(getAllLeads.rejected, (state, action) => {
      state.loading = false;
      state.leads = [];
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });
    builder.addCase(fetchAllLeadsWithParams.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllLeadsWithParams.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      if (action?.payload?.data?.data) {
        state.totalLeads = action?.payload.data?.total
        const actualdata = action.payload?.data?.data?.map(
          (item: ModifiedLead) => {
            return {
              ...item,
              company:
                item?.company?.accountId === null ||
                item?.company?.accountId === "" ||
                item?.company?.accountId === undefined
                  ? null
                  : `${item?.company?.accountName}/${item?.company?.accountId}`,
              contact:
                item?.contact?.contactId === null ||
                item?.contact?.contactId === "" ||
                item?.contact?.contactId === undefined
                  ? null
                  : `${item?.contact?.firstName} ${item?.contact?.lastName}/${item?.contact?.contactId}`,
              owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
              createdAt: moment(item?.createdAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              updatedAt: moment(item?.updatedAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
            };
          }
        );
        state.leads = actualdata;
      } else {
        state.leads = [];
      }
    });
    builder.addCase(fetchAllLeadsWithParams.rejected, (state, action) => {
      state.loading = false;
      state.leads = [];
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });

    builder.addCase(addLead.pending, (state) => {
      state.addLeadLoader = true;
    });
    builder.addCase(addLead.fulfilled, (state) => {
      state.addLeadLoader = false;
      state.lead = emptyLead;
      message.success("Lead added successfully");
      state.error = "";
    });
    builder.addCase(addLead.rejected, (state, action) => {
      state.addLeadLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });

    builder.addCase(getLeadById.pending, (state) => {
      state.getLeadLoader = true;
    });
    builder.addCase(getLeadById.fulfilled, (state, action) => {
      if (action?.payload?.data) {
        const actualdata = {
          ...action?.payload?.data,
          contact: action?.payload?.data?.contact?.contactId,
          company: action?.payload?.data?.company?.accountId,
        };
        state.lead = actualdata;
        state.getLeadLoader = false;
      }
      state.error = "";
    });
    builder.addCase(getLeadById.rejected, (state, action) => {
      state.getLeadLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });

    builder.addCase(updateLeadById.pending, (state) => {
      state.addLeadLoader = true;
    });
    builder.addCase(updateLeadById.fulfilled, (state) => {
      state.addLeadLoader = false;
      state.editable = false;
      state.error = "";
      message.success("Lead updated successfully");
    });
    builder.addCase(updateLeadById.rejected, (state, action) => {
      state.addLeadLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });

      builder.addCase(updateLeadByIdForOwner.pending, (state) => {
      state.addLeadLoader = true;
    });
    builder.addCase(updateLeadByIdForOwner.fulfilled, (state) => {
      state.addLeadLoader = false;
      state.editable = false;
      state.error = "";
      message.success("Owner updated successfully");
    });
    builder.addCase(updateLeadByIdForOwner.rejected, (state, action) => {
      state.addLeadLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });

    builder.addCase(deleteLeadById.pending, (state) => {
      state.addLeadLoader = true;
    });
    builder.addCase(deleteLeadById.fulfilled, (state) => {
      state.addLeadLoader = false;
      state.error = "";
      message.success("Leads deleted successfully");
    });
    builder.addCase(deleteLeadById.rejected, (state, action) => {
      state.addLeadLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });

    builder.addCase(addBulkLeads.pending, (state) => {
      state.addLeadLoader = true;
    });
    builder.addCase(addBulkLeads.fulfilled, (state) => {
      state.addLeadLoader = false;
      state.error = "";
    });
    builder.addCase(addBulkLeads.rejected, (state, action) => {
      state.addLeadLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });

    // Related View
    builder.addCase(fetchAllLeadsByModuleId.pending, (state) => {
      state.kanbanLoader = true;
      state.getLeadLoader = true;
    });
    builder.addCase(fetchAllLeadsByModuleId.fulfilled, (state, action) => {
      state.kanbanLoader = false;
      state.getLeadLoader = false;
      state.error = "";
      if (action?.payload?.data?.data) {
        state.totalLeads = action?.payload.data?.total
        const actualdata = action.payload?.data?.data?.map(
          (item: ModifiedLead) => {
            return {
              ...item,
              company:
                item?.company?.accountId === null ||
                item?.company?.accountId === "" ||
                item?.company?.accountId === undefined
                  ? null
                  : `${item?.company?.accountName}/${item?.company?.accountId}`,
              contact:
                item?.contact?.contactId === null ||
                item?.contact?.contactId === "" ||
                item?.contact?.contactId === undefined
                  ? null
                  : `${item?.contact?.firstName} ${item?.contact?.lastName}/${item?.contact?.contactId}`,
              owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
              createdAt: moment(item?.createdAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              updatedAt: moment(item?.updatedAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
            };
          }
        );
        state.leads = actualdata;
      } else {
        state.leads = [];
      }
    });
    builder.addCase(fetchAllLeadsByModuleId.rejected, (state, action) => {
      state.getLeadLoader = false;

      state.kanbanLoader = false;
      state.leads = [];
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });

    // FETCH DASHBOARD LEADS DATA
    builder.addCase(fetchAllDashboardLeads.pending, (state) => {
      state.dashboardLeadsLoader = true;
    });
    builder.addCase(fetchAllDashboardLeads.fulfilled, (state, action) => {
      state.dashboardLeadsLoader = false;
      state.error = "";
      if (action?.payload?.data) {
        state.dashboardLeadsAllData = action.payload?.data;
      } else {
        state.dashboardLeadsAllData = emptyDashboardLeads;
      }
      if (action?.payload?.data?.lead_data?.data) {
        const actualdata = action.payload?.data?.lead_data?.data?.map(
          (item: ModifiedLead) => {
            return {
              ...item,
              company:
                item?.company?.accountId === null ||
                item?.company?.accountId === "" ||
                item?.company?.accountId === undefined
                  ? null
                  : `${item?.company?.accountName}/${item?.company?.accountId}`,
              contact:
                item?.contact?.contactId === null ||
                item?.contact?.contactId === "" ||
                item?.contact?.contactId === undefined
                  ? null
                  : `${item?.contact?.firstName} ${item?.contact?.lastName}/${item?.contact?.contactId}`,
              owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
              createdAt: moment(item?.createdAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
              updatedAt: moment(item?.updatedAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
            };
          }
        );
        state.dashboardLeadsData = actualdata;
      } else {
        state.dashboardLeadsData = [];
      }
    });
    builder.addCase(fetchAllDashboardLeads.rejected, (state, action) => {
      state.dashboardLeadsLoader = false;
      state.dashboardLeadsAllData = emptyDashboardLeads;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });
  },
});
export const {
  handleInputChangeReducerLead,
  resetLead,
  handleLeadChangeReducer,
  setCompanyId,
  resetLeads,
  setEditableMode,
} = leadSlice.actions;
export default leadSlice.reducer;
