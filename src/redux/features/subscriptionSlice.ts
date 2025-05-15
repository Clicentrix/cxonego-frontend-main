// import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../services/axiosGlobal";
import {
  ContactAdminForCustomPlan,
  SubscriptionAdd,
  SubscriptionPlan,
} from "../../utilities/common/exportDataTypes/subscriptionDataTypes";
import { message } from "antd";

const accessToken = localStorage.getItem("accessToken");
const userId = localStorage.getItem("userId");
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

function isAccessToken(str: string | null) {
  return typeof str === "string" && str !== null;
}
function isUserId(str: string | null) {
  return typeof str === "string" && str !== null;
}

// const emptyCreateSubscriptionPlanPayload = {
//   planId: null,
//   userId: isUserId(userId) ? userId : null,
//   currency: "INR",
// };

export const emptySubscriptionPlan = {
  planId: "",
  createdAt: null,
  updatedAt: null,
  planamount: null,
  planname: null,
  currency: "INR",
  description: null,
  deletedAt: null,
  modifiedBy: null,
  razorepayplanId: null,
  noOfUsers: null,
  noOfDays: null,
  feature: null,
  isTrial: true,
  planType: null,
  features: null,
};

type InitialState = {
  loading: boolean;
  plans: SubscriptionPlan[];
  planTrial: SubscriptionPlan;
  planSubscription: SubscriptionPlan;
  error: string;
  addPlanLoader: boolean;
  getPlanLoader: boolean;
  editable: boolean;
  paymentLoader: boolean;
  contactAdminLoader: boolean;
};

const initialState: InitialState = {
  loading: false,
  plans: [],
  planTrial: emptySubscriptionPlan,
  planSubscription: emptySubscriptionPlan,
  addPlanLoader: false,
  getPlanLoader: false,
  error: "",
  editable: false,
  paymentLoader: false,
  contactAdminLoader: false,
};

// Fetch Plan data

export const fetchAllPlans = createAsyncThunk(
  "subscriptions/fetchAllPlans",
  async () => {
    try {
      const response = await axios.get(`${baseUrl}plan/getAllPlans?planType`);
      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
        // return rejectWithValue(error.response?.data || error.message);
      } else {
        console.error("ERROR", error);
      }
    }
  }
);

// Create Subscription
export const createSubscription = createAsyncThunk(
  "subscriptions/createSubscription",
  async (payload: SubscriptionAdd) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await api.post(
        `subscription/create-subscription`,
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
        // return rejectWithValue(error.response?.data || error.message);
      } else {
        console.error("ERROR", error);
      }
    }
  }
);

// Verify Create Subscription
export const verifySubscription = createAsyncThunk(
  "subscriptions/verifySubscription",
  async (payload: SubscriptionAdd) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await api.post(
        `subscription/create-subscription`,
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
        // return rejectWithValue(error.response?.data || error.message);
      } else {
        console.error("ERROR", error);
      }
    }
  }
);

// Create request for custom plan- contact admin
export const createRequestContactAdmin = createAsyncThunk(
  "subscriptions/createRequestContactAdmin",
  async (payload: ContactAdminForCustomPlan) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${payload?.accessToken}`,
        },
      };
      const { accessToken, ...payloadWithOutAccessToken } = payload;
      const response = await api.post(
        `customPlanRequest`,
        payloadWithOutAccessToken,
        config
      );
      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
        // return rejectWithValue(error.response?.data || error.message);
      } else {
        console.error("ERROR", error);
      }
    }
  }
);
// get user subscription by user id
// subscription / get - user - subscription / T9Yey1gMqbeoT2tnUZuyqoxHUDh1
export const fetchSubscriptionByUserId = createAsyncThunk(
  "subscriptions/fetchSubscriptionByUserId",
  async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const userIdHere = isUserId(userId) ? userId : undefined;

      const response = await api.get(
        `subscription/get-active-subscription/${userIdHere}`,
        config
      );
      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error);
        // return rejectWithValue(error.response?.data || error.message);
      } else {
        console.error("ERROR", error);
      }
    }
  }
);

// For All plans

export const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setPaymentLoader: (state, action) => {
      state.paymentLoader = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllPlans.pending, (state) => {
      state.getPlanLoader = true;
    });
    builder.addCase(fetchAllPlans.fulfilled, (state, action) => {
      if (action.payload.data?.plans?.length > 0) {
          const subscriptionPlan = action.payload.data?.plans?.filter((plan: any) => plan?.planType === "Subscription");
          const trialPlan = action.payload.data?.plans?.filter((plan:any)=> plan?.planType === "Trial");
          state.planTrial = trialPlan?.length > 0 ? trialPlan[0] : emptySubscriptionPlan;
          state.planSubscription = subscriptionPlan?.length > 0 ? subscriptionPlan[0] : emptySubscriptionPlan;
          console.log("filtered plans ", subscriptionPlan, trialPlan)
      }
      state.getPlanLoader = false;
      state.error = "";
    });
    builder.addCase(fetchAllPlans.rejected, (state, action) => {
      state.getPlanLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });

    // Create request for custom plan
    builder.addCase(createRequestContactAdmin.pending, (state) => {
      state.contactAdminLoader = true;
    });
    builder.addCase(createRequestContactAdmin.fulfilled, (state) => {
      state.contactAdminLoader = false;
      message.success("Request created successfully")
    });
    builder.addCase(createRequestContactAdmin.rejected, (state) => {
      state.contactAdminLoader = false;
    });

    // Fetch users subscription
    // builder.addCase(fetchSubscriptionByUserId.pending, (state) => {
    //   state.getPlanLoader = true;
    // });
    // builder.addCase(fetchSubscriptionByUserId.fulfilled, (state, action) => {
    //   console.log("Fetching subscription user", action?.payload);
    //   if (action.payload.data?.length > 0) {
    //     state.subscription = action.payload?.data[0];
    //   }
    //   state.getPlanLoader = false;
    //   state.error = "";
    // });
    // builder.addCase(fetchSubscriptionByUserId.rejected, (state, action) => {
    //   state.getPlanLoader = false;
    //   state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    // });
  },
});

export const { setPaymentLoader } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
