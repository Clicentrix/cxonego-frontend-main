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
export const emptyContact = {
    contactId: "",
    description: "",
    industry: "Select",
    status: "Active",
    owner: null,
    phone: null,
    email: null,
    addressLine: "",
    firstName: "",
    lastName: "",
    countryCode: "+91",
    city: "",
    state: "",
    country: "",
    company: null,
    designation: "",
    timeline: "",
    favourite: "No",
    contactType: "",
    createdAt: null,
    updatedAt: null,
};
const initialState = {
    loading: false,
    contact: emptyContact,
    addContactLoader: false,
    getContactLoader: false,
    contacts: [],
    pagination: {
        page: 1,
        total: 20,
    },
    error: "",
    editable: false,
    isModalOpenContact: false,
    contactForLookup: emptyContact,
    bulkContactLoader: false,
    totalContacts: 0,
};
// Fetch Cartoon data
export const getAllContacts = createAsyncThunk("accounts/getAllContacts", async () => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await axios.get(`${baseUrl}contact/`, config);
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
export const fetchAllContacts = createAsyncThunk("contacts/fetchAllContacts", async (params) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await api.post(`contact/getContacts?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&view=${params?.view}`, {}, config);
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
export const fetchAllContactsWithoutParams = createAsyncThunk("contacts/fetchAllContactsWithoutParams", async () => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await api.post(`contact/getContacts`, {}, config);
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
export const addContact = createAsyncThunk("contacts/addContact", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const { createdAt, updatedAt, contactId, ...payloadWithoutCreatedAt } = payload;
        const response = await axios.post(`${baseUrl}contact/`, payloadWithoutCreatedAt, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response?.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
            // message?.error(`Cannot add duplicate ${error?.response?.data?.error}`);
            message?.error(`Cannot add duplicate Contact Number`);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
export const getContactById = createAsyncThunk("contacts/getContactById", async (contactId, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        // 6ba4ea16-cec2-4b26-ab29-351b3bc7e90e
        const response = await axios.get(`${baseUrl}contact/${contactId}`, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        console.error("Error in getContactById:", error);
        // If it's an axios error, extract the response data
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        // Otherwise return a generic error message
        return rejectWithValue({ message: "Failed to fetch contact details. Please try again." });
    }
});
export const updateContactById = createAsyncThunk("contacts/updateContactById", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const { createdAt, updatedAt, ...payloadWithoutCreatedAt } = payload;
        const response = await axios.put(`${baseUrl}contact/${payload?.contactId}`, payloadWithoutCreatedAt, config);
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
export const deleteContactsById = createAsyncThunk("contact/deleteContactsById", async (contactId) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const payload = {
            contactIds: contactId,
        };
        const response = await axios.post(`${baseUrl}contact/bulk-delete`, payload, config);
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
export const fetchAllContactsByModuleId = createAsyncThunk("contacts/fetchAllContactsByModuleId", async ({ moduleName, moduleId, params, }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await axios.post(`${baseUrl}contact/${moduleName}/${moduleId}?page=${params?.page}&limit=${params?.limit}&search=${params?.search?.toLocaleLowerCase()}`, null, config);
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
export const addBulkContacts = createAsyncThunk("contacts/addBulkContacts", async (file, thunkAPI) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(`${baseUrl}contact/upload-csv-contacts`, formData, config);
        if (response?.status === 200) {
            message.success("Contacts created successfully");
            return response.data;
        }
        else {
            throw new Error("Upload failed");
        }
    }
    catch (error) {
        // message.error(error.message || "Upload failed");
        return thunkAPI.rejectWithValue(error);
    }
});
export const createAndGetAllContacts = (payload, params) => async (dispatch) => {
    await dispatch(addContact(payload));
    await dispatch(fetchAllContacts(params));
    dispatch(resetAccountForLookup());
};
export const updateContactByIdAndGetThatContactById = (payload) => async (dispatch) => {
    await dispatch(updateContactById(payload));
    await dispatch(getContactById(payload?.contactId));
};
export const deleteContactsByIdAndGetAllContacts = (contactId, params) => async (dispatch) => {
    await dispatch(deleteContactsById(contactId));
    await dispatch(fetchAllContacts(params));
};
// For related View
export const createAndGetAllContactsByModuleId = (payload, params, moduleName, moduleId) => async (dispatch) => {
    await dispatch(addContact(payload));
    await dispatch(fetchAllContactsByModuleId({ moduleName, moduleId, params }));
};
export const deleteContactsByIdAndGetAllContactsByModuleId = (contactId, params, moduleName, moduleId) => async (dispatch) => {
    await dispatch(deleteContactsById(contactId));
    await dispatch(fetchAllContactsByModuleId({ moduleName, moduleId, params }));
};
// AUDITS
export const updateContactByIdAndGetAudits = (payload) => async (dispatch) => {
    await dispatch(updateContactById(payload));
    await dispatch(getContactById(payload?.contactId));
    await dispatch(fetchAllAuditsByModuleId({
        moduleName: "contact",
        moduleId: payload?.contactId,
    }));
};
// FOR LOOKUP
export const createAndGetAllContactsWithoutParams = (payload) => async (dispatch) => {
    await dispatch(addContact(payload));
    await dispatch(fetchAllContactsWithoutParams());
};
export const contactSlice = createSlice({
    name: "contacts",
    initialState,
    reducers: {
        handleInputChangeReducerContact: (state, action) => {
            // type of the action payload should be object
            state.contact = {
                ...state.contact,
                ...action.payload,
            };
            return state;
        },
        handleContactChangeReducer: (state, action) => {
            // type of the action payload should be object
            state.contact = action?.payload;
            return state;
        },
        resetContact: (state) => {
            // type of the action payload should be object
            state.contact = emptyContact;
            return state;
        },
        setEditableMode: (state, action) => {
            state.editable = action?.payload;
        },
        resetContacts: (state) => {
            state.contacts = [];
        },
        resetIsModalOpenContact: (state, action) => {
            state.isModalOpenContact = action?.payload;
        },
        resetContactForLookup: (state) => {
            state.contactForLookup = emptyContact;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllContacts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllContacts.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            if (action?.payload?.data) {
                state.totalContacts = action.payload.data?.total;
                const actualdata = action.payload?.data?.map((item) => {
                    return {
                        ...item,
                        // company: item?.company
                        //   ? `${item?.company?.accountName}/${item?.company?.accountId}`
                        //   : null,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        createdAt: moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                        updatedAt: moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
                    };
                });
                state.contacts = actualdata;
            }
            else {
                state.contacts = [];
            }
        });
        builder.addCase(getAllContacts.rejected, (state, action) => {
            state.loading = false;
            state.contacts = [];
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(fetchAllContacts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllContacts.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            if (action?.payload?.data?.data) {
                state.totalContacts = action.payload.data?.total;
                const actualdata = action.payload?.data?.data?.map((item) => {
                    return {
                        ...item,
                        company: item?.company
                            ? `${item?.company?.accountName}/${item?.company?.accountId}`
                            : null,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        createdAt: moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                        updatedAt: moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
                    };
                });
                state.contacts = actualdata;
            }
            else {
                state.contacts = [];
            }
        });
        builder.addCase(fetchAllContacts.rejected, (state, action) => {
            state.loading = false;
            state.contacts = [];
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(fetchAllContactsWithoutParams.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllContactsWithoutParams.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            if (action?.payload?.data?.data) {
                state.totalContacts = action.payload.data?.total;
                const actualdata = action.payload?.data?.data?.map((item) => {
                    return {
                        ...item,
                        company: item?.company
                            ? `${item?.company?.accountName}/${item?.company?.accountId}`
                            : null,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        createdAt: moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                        updatedAt: moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
                    };
                });
                state.contacts = actualdata;
            }
            else {
                state.contacts = [];
            }
        });
        builder.addCase(fetchAllContactsWithoutParams.rejected, (state, action) => {
            state.loading = false;
            state.contacts = [];
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
        // FOR RELATED VIEW
        builder.addCase(fetchAllContactsByModuleId.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllContactsByModuleId.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            if (action?.payload?.data?.data) {
                state.totalContacts = action.payload.data?.total;
                const actualdata = action.payload?.data?.data?.map((item) => {
                    return {
                        ...item,
                        company: item?.company
                            ? `${item?.company?.accountName}/${item?.company?.accountId}`
                            : null,
                        owner: `${item?.owner?.firstName} ${item?.owner?.lastName}`,
                        createdAt: moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                        updatedAt: moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
                    };
                });
                state.contacts = actualdata;
            }
            else {
                state.contacts = [];
            }
        });
        builder.addCase(fetchAllContactsByModuleId.rejected, (state, action) => {
            state.loading = false;
            state.contacts = [];
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(addContact.pending, (state) => {
            state.addContactLoader = true;
        });
        builder.addCase(addContact.fulfilled, (state, action) => {
            state.addContactLoader = false;
            if (action?.payload?.data) {
                state.contactForLookup = action?.payload?.data;
            }
            else {
                console.log("No data found in payload");
            }
            message.success("Contact added successfully");
            state.error = "";
        });
        builder.addCase(addContact.rejected, (state, action) => {
            state.addContactLoader = false;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(getContactById.pending, (state) => {
            state.getContactLoader = true;
        });
        builder.addCase(getContactById.fulfilled, (state, action) => {
            if (action?.payload?.data) {
                const actualdata = {
                    ...action?.payload?.data,
                    company: action?.payload?.data?.company?.accountId,
                };
                state.contact = actualdata;
                state.getContactLoader = false;
            }
            state.getContactLoader = false;
            state.error = "";
        });
        builder.addCase(getContactById.rejected, (state, action) => {
            state.getContactLoader = false;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(updateContactById.pending, (state) => {
            state.addContactLoader = true;
        });
        builder.addCase(updateContactById.fulfilled, (state) => {
            state.addContactLoader = false;
            state.editable = false;
            state.error = "";
            message.success("Record updated successfully");
        });
        builder.addCase(updateContactById.rejected, (state, action) => {
            state.addContactLoader = false;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
            message.error("Operation cannot be completed, you may want to contact administrator for help.");
        });
        builder.addCase(deleteContactsById.pending, (state) => {
            state.addContactLoader = true;
        });
        builder.addCase(deleteContactsById.fulfilled, (state) => {
            state.addContactLoader = false;
            state.error = "";
            message.success("Contacts deleted successfully");
        });
        builder.addCase(deleteContactsById.rejected, (state, action) => {
            state.addContactLoader = false;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
            message.error("Operation cannot be completed, you may want to contact administrator for help.");
        });
        // BULK
        builder.addCase(addBulkContacts.pending, (state) => {
            state.bulkContactLoader = true;
        });
        builder.addCase(addBulkContacts.fulfilled, (state) => {
            state.bulkContactLoader = false;
            state.error = "";
            // message.success("Contacts Added successfully");
        });
        builder.addCase(addBulkContacts.rejected, (state, action) => {
            state.bulkContactLoader = false;
            state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
            message.error("Operation cannot be completed, you may want to contact administrator for help.");
        });
    },
});
export const { handleInputChangeReducerContact, resetContact, handleContactChangeReducer, setEditableMode, 
// handleAddressInputChangeReducer,
resetContacts, resetContactForLookup, resetIsModalOpenContact, } = contactSlice.actions;
export default contactSlice.reducer;
