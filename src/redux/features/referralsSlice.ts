// import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Pagination } from "../../utilities/common/exportDataTypes/accountDataTypes";
import {
  FetchReferralParams,
  Referral,
} from "../../utilities/common/exportDataTypes/referralsDataTypes";
import axios from "axios";
import { AppDispatch } from "../app/store";
import { message } from "antd";
import moment from "moment";
import api from "../../services/axiosGlobal";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const accessToken = localStorage.getItem("accessToken");
// const userId = localStorage.getItem("userId");

function isAccessToken(str: string | null) {
  return typeof str === "string" && str !== null;
}
// function isUserId(str: string | null) {
//   return typeof str === "string" && str !== null;
// }

const emptyReferral = {
  referId: "",
  status: "New",
  firstName: "",
  lastName: "",
  phone: null,
  email: null,
  referBy: "",
  description: "",
  company: "",
  createdAt: null,
  updatedAt: null,
  owner: null,
  countryCode: "+91",
};

type InitialState = {
  loading: boolean;
  referrals: Referral[];
  referral: Referral;
  pagination: Pagination;
  error: string;
  addReferralLoader: boolean;
  getReferralLoader: boolean;
  editable: boolean;
  screenWidth: number;
  totalReferrals : number;
};

const initialState: InitialState = {
  loading: false,
  referral: emptyReferral,
  addReferralLoader: false,
  getReferralLoader: false,
  referrals: [],
  pagination: {
    page: 1,
    total: 20,
  },
  error: "",
  editable: false,
  screenWidth: window?.innerWidth,
  totalReferrals: 0,
};


export const getAllReferrals = createAsyncThunk(
  "accounts/getAllReferrals",
  async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };

      const response = await axios.get(`${baseUrl}refer/`, config);
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

// Fetch Referral data
export const fetchAllReferrals = createAsyncThunk(
  "referral/fetchAllReferralsByModuleId",
  async (params: FetchReferralParams) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await api.post(
        `refer/getAllRefer/?page=${params?.page}&limit=${params?.limit}&search=${params?.search}`,
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

export const addReferral = createAsyncThunk(
  "referral/addReferral",
  async (payload: Referral) => {
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
        `${baseUrl}/refer/create-refer`,
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

export const getReferralById = createAsyncThunk(
  "referral/getReferralById",
  async (referId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      // 6ba4ea16-cec2-4b26-ab29-351b3bc7e90e
      const response = await axios.get(`${baseUrl}/refer/${referId}`, config);
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

export const updateReferralById = createAsyncThunk(
  "referral/updateReferralById",
  async (payload: Referral) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const { createdAt, updatedAt, owner, ...payloadWithoutCreatedAt } =
        payload;

      const response = await axios.put(
        `${baseUrl}refer/update-refer/${payload?.referId}`,
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

export const deleteRefarralsById = createAsyncThunk(
  "referral/deleteRefarralsById",
  async (referId: React.Key[]) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const payload = {
        referIds: referId,
      };
      const response = await axios.post(
        `${baseUrl}refer/bulk-delete/`,
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

// For All Referrals

export const createAndGetAllReferrals =
  (payload: Referral, params: FetchReferralParams) =>
  async (dispatch: AppDispatch) => {
    await dispatch(addReferral(payload));
    await dispatch(fetchAllReferrals(params));
  };

export const updateReferralByIdAndGetAllReferrals =
  (payload: Referral, params: FetchReferralParams) =>
  async (dispatch: AppDispatch) => {
    await dispatch(updateReferralById(payload));
    await dispatch(fetchAllReferrals(params));
  };

export const deleteReferralsByIdAndGetAllReferralsTotal =
  (referIds: React.Key[], params: FetchReferralParams) =>
  async (dispatch: AppDispatch) => {
    await dispatch(deleteRefarralsById(referIds));
    await dispatch(fetchAllReferrals(params));
  };

export const referralSlice = createSlice({
  name: "referrals",
  initialState,
  reducers: {
    handleInputChangeReducerReferral: (state, action) => {
      // type of the action payload should be object
      state.referral = {
        ...state.referral,
        ...action.payload,
      };
      return state;
    },
    resetReferral: (state) => {
      // type of the action payload should be object
      state.referral = emptyReferral;
      return state;
    },
    resetReferrals: (state) => {
      state.referrals = [];
    },
    setEditableMode: (state, action) => {
      state.editable = action?.payload;
    },
    setScreenWidth: (state, action) => {
      state.screenWidth = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addReferral.pending, (state) => {
      state.addReferralLoader = true;
    });
    builder.addCase(addReferral.fulfilled, (state, action) => {
      state.addReferralLoader = false;
      if (action.payload?.data) {
        state.referral = action.payload?.data;
      }
      state.referral = emptyReferral;
      message.success("Referral added successfully");
      state.error = "";
    });
    builder.addCase(addReferral.rejected, (state, action) => {
      state.addReferralLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });
    builder.addCase(getReferralById.pending, (state) => {
      state.getReferralLoader = true;
    });
    builder.addCase(getReferralById.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.referral = action.payload.data;
      }
      state.getReferralLoader = false;
      state.error = "";
    });
    builder.addCase(getReferralById.rejected, (state, action) => {
      state.getReferralLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });
    builder.addCase(updateReferralById.pending, (state) => {
      state.addReferralLoader = true;
    });
    builder.addCase(updateReferralById.fulfilled, (state) => {
      state.addReferralLoader = false;
      state.editable = false;
      state.error = "";
      message.success("Referral updated successfully");
    });
    builder.addCase(updateReferralById.rejected, (state, action) => {
      state.addReferralLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });
    builder.addCase(deleteRefarralsById.pending, (state) => {
      state.addReferralLoader = true;
    });
    builder.addCase(deleteRefarralsById.fulfilled, (state) => {
      state.addReferralLoader = false;
      state.error = "";
      message.success("Referral deleted successfully");
    });
    builder.addCase(deleteRefarralsById.rejected, (state, action) => {
      state.addReferralLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });
    // Get all Referrals
    builder.addCase(getAllReferrals.pending, (state) => {
      state.getReferralLoader = true;
    });
    builder.addCase(getAllReferrals.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.totalReferrals = action.payload.data?.total
        const actualdata = action.payload?.data?.map((item: Referral) => {
          return {
            ...item,
            owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
            createdAt: moment(item?.createdAt).format(
              "MMMM Do YYYY, h:mm:ss a"
            ),
            updatedAt: moment(item?.updatedAt).format(
              "MMMM Do YYYY, h:mm:ss a"
            ),
          };
        });
        state.referrals = actualdata;
      } else {
        state.referrals = [];
      }
      state.getReferralLoader = false;
      state.error = "";
    });
    builder.addCase(getAllReferrals.rejected, (state, action) => {
      state.getReferralLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });
    builder.addCase(fetchAllReferrals.pending, (state) => {
      state.getReferralLoader = true;
    });
    builder.addCase(fetchAllReferrals.fulfilled, (state, action) => {
      if (action.payload.data?.data) {
        state.totalReferrals = action.payload.data?.total
        const actualdata = action.payload?.data?.data?.map((item: Referral) => {
          return {
            ...item,
            owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
            createdAt: moment(item?.createdAt).format(
              "MMMM Do YYYY, h:mm:ss a"
            ),
            updatedAt: moment(item?.updatedAt).format(
              "MMMM Do YYYY, h:mm:ss a"
            ),
          };
        });
        state.referrals = actualdata;
      } else {
        state.referrals = [];
      }
      state.getReferralLoader = false;
      state.error = "";
    });
    builder.addCase(fetchAllReferrals.rejected, (state, action) => {
      state.getReferralLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });
  },
});
export const {
  handleInputChangeReducerReferral,
  resetReferral,
  resetReferrals,
  setEditableMode,
  setScreenWidth,
} = referralSlice.actions;
export default referralSlice.reducer;
