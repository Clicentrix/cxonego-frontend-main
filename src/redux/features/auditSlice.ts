import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Audit,
  AuditData,
  Pagination,
} from "../../utilities/common/exportDataTypes/auditDataTypes";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const accessToken = localStorage.getItem("accessToken");
// const userId = localStorage.getItem("userId");

function isAccessToken(str: string | null) {
  return typeof str === "string" && str !== null;
}
// function isUserId(str: string | null) {
//   return typeof str === "string" && str !== null;
// }

const emptyAudit = {
  subject: "",
  auditId: "",
  createdAt: "",
  updatedAt: "",
  auditType: "",
  description: "",
  owner: {
    firstName: "",
    lastName: "",
  },
};

type InitialState = {
  loading: boolean;
  auditData: AuditData[];
  audit: Audit;
  pagination: Pagination;
  error: string;
  getAuditLoader: boolean;
};
const initialState: InitialState = {
  loading: false,
  auditData: [],
  audit: emptyAudit,
  getAuditLoader: false,
  pagination: {
    page: 1,
    total: 20,
  },
  error: "",
};

// Fetch Audit data

export const fetchAllAuditsByModuleId = createAsyncThunk(
  "audit/fetchAllAuditsByOpportunityId",
  async ({
    moduleName,
    moduleId,
  }: {
    moduleName: string;
    moduleId: string;
  }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await axios.get(
        `${baseUrl}audit/${moduleName}/${moduleId}`,
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

export const auditSlice = createSlice({
  name: "audits",
  initialState,
  reducers: {
    resetAudits: (state) => {
      state.auditData = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllAuditsByModuleId.pending, (state) => {
      state.getAuditLoader = true;
    });
    builder.addCase(fetchAllAuditsByModuleId.fulfilled, (state, action) => {
      state.getAuditLoader = false;
      state.error = "";
      if (action?.payload?.data) {
        state.auditData = action.payload?.data;
        // state.pagination.page = action.payload?.data?.page;
        // state.pagination.total = action.payload?.data?.total;
      }
    });
    builder.addCase(fetchAllAuditsByModuleId.rejected, (state, action) => {
      state.getAuditLoader = false;
      state.auditData = [];
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });
  },
});
export const { resetAudits } = auditSlice.actions;
export default auditSlice.reducer;
