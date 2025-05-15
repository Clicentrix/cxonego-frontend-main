import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "../app/store";
import { message } from "antd";
import {
  Account,
  FetchAccountsParams,
  Pagination,
} from "../../utilities/common/exportDataTypes/accountDataTypes";
import { User } from "../../utilities/common/exportDataTypes/userDataTypes";
import { updateUserByUserId } from "./authenticationSlice";
import { fetchAllAuditsByModuleId } from "./auditSlice";
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

const emptyAccount = {
  accountId: "",
  accountName: "",
  name: "",
  companySize: "0",
  description: "",
  website: "",
  industry: "Select",
  businessType: "",
  CurrencyCode: "INR",
  annualRevenue: "0",
  status: "Active",
  owner: null,
  phone: "",
  email: null,
  address: "",
  country: "",
  state: "",
  city: "",
  createdAt: "",
  updatedAt: "",
  countryCode: "+91",
};

type InitialState = {
  loading: boolean;
  accounts: Account[];
  account: Account;
  pagination: Pagination;
  error: string;
  addAccountLoader: boolean;
  getAccountLoader: boolean;
  editable: boolean;
  isModalOpenAccount: boolean;
  accountForLookup: Account;
  totalAccounts: number;
};
const initialState: InitialState = {
  loading: false,
  account: emptyAccount,
  addAccountLoader: false,
  getAccountLoader: false,
  accounts: [],
  pagination: {
    page: 1,
    total: 20,
  },
  error: "",
  editable: false,
  isModalOpenAccount: false,
  accountForLookup: emptyAccount,
  totalAccounts:0,
};

// Fetch Cartoon data

export const getAllAccounts = createAsyncThunk("accounts/getAllAccounts", async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${
          isAccessToken(accessToken) ? accessToken : undefined
        }`,
      },
    };

    const response = await axios.get(`${baseUrl}account/`, config);
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
})

export const fetchAllAccounts = createAsyncThunk(
  "accounts/fetchAllAccounts",
  async (params: FetchAccountsParams) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await api.post(
        `account/getAccounts?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&view=${params?.view}`,
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

export const fetchAllAccountsWithoutParams = createAsyncThunk(
  "accounts/fetchAllAccountsWithoutParams",
  async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await axios.get(
        `${baseUrl}account/`,
        
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

export const addAccount = createAsyncThunk(
  "accounts/addAccount",
  async (payload: Account) => {
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
        `${baseUrl}account/`,
        payloadWithoutCreatedAt,
        config
      );
      if (response.status === 200) {
        console.log("Success account", response?.data);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ERROR", error?.response?.data?.message);
        // message?.error(`Cannot add duplicate ${error?.response?.data?.error}`);
        message?.error(`Cannot add duplicate Company Name`);
      } else {
        console.error("ERROR", error);
      }
      // You should return a rejected Promise with the error
      throw error;
    }
  }
);

export const getAccountById = createAsyncThunk(
  "accounts/getAccountById",
  async (accountId: string) => {
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
        `${baseUrl}account/${accountId}`,
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

export const updateAccountById = createAsyncThunk(
  "accounts/updateBAccountById",
  async (payload: Account) => {
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
        `${baseUrl}account/${payload?.accountId}`,
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

export const deleteAccountsById = createAsyncThunk(
  "accounts/deleteAccountsById",
  async (accountId: React.Key[]) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const payload = {
        accountIds: accountId,
      };
      const response = await axios.post(
        `${baseUrl}account/bulk-delete`,
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

export const createAndGetAllAccounts =
  (payload: Account, params: FetchAccountsParams) =>
  async (dispatch: AppDispatch) => {
    await dispatch(addAccount(payload));
    await dispatch(fetchAllAccounts(params));
  };

export const updateAccountByIdAndGetThatAccountById =
  (payload: Account) => async (dispatch: AppDispatch) => {
    await dispatch(updateAccountById(payload));
    await dispatch(getAccountById(payload?.accountId));
  };

export const deleteAccountsByIdAndGetAllAccounts =
  (accountId: React.Key[], params: FetchAccountsParams) =>
  async (dispatch: AppDispatch) => {
    await dispatch(deleteAccountsById(accountId));
    await dispatch(fetchAllAccounts(params));
  };

// User onboarding flow
export const addAccountAndUpdateUserData =
  (account: Account, user: User) => async (dispatch: AppDispatch) => {
    await dispatch(addAccount(account));
    await dispatch(updateUserByUserId(user));
  };

export const updateAccountByIdAndGetAudits =
  (payload: any) => async (dispatch: AppDispatch) => {
    await dispatch(updateAccountById(payload));
    await dispatch(getAccountById(payload?.accountId))
    await dispatch(
      fetchAllAuditsByModuleId({
        moduleName: "account",
        moduleId: payload?.accountId,
      })
    );
  };

// FOR LOOKUP
export const createAndGetAllAccountsWithoutParams =
  (payload: Account) => async (dispatch: AppDispatch) => {
    await dispatch(addAccount(payload));
    await dispatch(fetchAllAccountsWithoutParams());
  };

export const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    handleInputChangeReducerAccount: (state, action) => {
      // type of the action payload should be object
      state.account = {
        ...state.account,
        ...action.payload,
      };
      return state;
    },
    // handleAddressInputChangeReducer: (state, action) => {
    //   // type of the action payload should be object
    //   const { index, name, value } = action.payload;
    //   state.account.address[index][name] = value;
    // },
    handleAccountChangeReducer: (state, action) => {
      // type of the action payload should be object
      state.account = action?.payload;
      return state;
    },
    resetAccount: (state) => {
      // type of the action payload should be object
      state.account = emptyAccount;
      return state;
    },
    setEditableMode: (state, action) => {
      state.editable = action?.payload;
    },
    resetAccounts: (state) => {
      state.accounts = [];
    },
    resetIsModalOpenAccount: (state, action) => {
      state.isModalOpenAccount = action?.payload;
    },
    resetAccountForLookup: (state) => {
      state.accountForLookup = emptyAccount;
    },
  },
  extraReducers: (builder) => {
    //fetch all acounts in one go
    builder.addCase(getAllAccounts.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(getAllAccounts.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";      
      if (action?.payload?.data) {
        state.totalAccounts = action.payload.data?.total
        const actualdata = action.payload?.data?.map((item: Account) => {
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
        state.accounts = actualdata;
      } else {
        state.accounts = [];
      }
    })
    builder.addCase(getAllAccounts.rejected, (state, action) => {
      state.loading = false;
      state.accounts = [];
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });
    //fetch accounts with query params
    builder.addCase(fetchAllAccounts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllAccounts.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      if (action?.payload?.data?.data) {
         state.totalAccounts = action.payload.data?.total
        const actualdata = action.payload?.data?.data?.map((item: Account) => {
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
        state.accounts = actualdata;
      } else {
        state.accounts = [];
      }
    });
    builder.addCase(fetchAllAccounts.rejected, (state, action) => {
      state.loading = false;
      state.accounts = [];
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });

    // FETCH all accounts without query params
    builder.addCase(fetchAllAccountsWithoutParams.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchAllAccountsWithoutParams.fulfilled,
      (state, action) => {
        state.loading = false;
        state.error = "";
        if (action?.payload?.data) {
           state.totalAccounts = action.payload.data?.total
          const actualdata = action.payload?.data?.map(
            (item: Account) => {
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
            }
          );
          state.accounts = actualdata;
        } else {
          state.accounts = [];
        }
      }
    );
    builder.addCase(fetchAllAccountsWithoutParams.rejected, (state, action) => {
      state.loading = false;
      state.accounts = [];
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });

    builder.addCase(addAccount.pending, (state) => {
      state.addAccountLoader = true;
    });
    builder.addCase(addAccount.fulfilled, (state, action) => {
      state.addAccountLoader = false;
      if (action.payload?.data) {
        state.accountForLookup = action.payload.data;
      } else {
        console.log("No data found in payload");
      }
      message.success("Company added successfully");
      state.error = "";
    });
    builder.addCase(addAccount.rejected, (state, action) => {
      state.addAccountLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });

    builder.addCase(getAccountById.pending, (state) => {
      state.getAccountLoader = true;
    });
    builder.addCase(getAccountById.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.account = action.payload.data;
      }
      state.getAccountLoader = false;
      state.error = "";
    });
    builder.addCase(getAccountById.rejected, (state, action) => {
      state.getAccountLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });

    builder.addCase(updateAccountById.pending, (state) => {
      state.addAccountLoader = true;
    });
    builder.addCase(updateAccountById.fulfilled, (state) => {
      state.addAccountLoader = false;
      state.editable = false;
      state.error = "";
      message.success("Record updated successfully");
    });
    builder.addCase(updateAccountById.rejected, (state, action) => {
      state.addAccountLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });

    builder.addCase(deleteAccountsById.pending, (state) => {
      state.addAccountLoader = true;
    });
    builder.addCase(deleteAccountsById.fulfilled, (state) => {
      state.addAccountLoader = false;
      state.error = "";
      message.success("Accounts deleted successfully");
    });
    builder.addCase(deleteAccountsById.rejected, (state, action) => {
      state.addAccountLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });
  },
});
export const {
  handleInputChangeReducerAccount,
  resetAccount,
  handleAccountChangeReducer,
  setEditableMode,
  // handleAddressInputChangeReducer,
  resetAccounts,
  resetIsModalOpenAccount,
  resetAccountForLookup,
} = accountSlice.actions;
export default accountSlice.reducer;
