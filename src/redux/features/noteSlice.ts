// import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Pagination } from "../../utilities/common/exportDataTypes/accountDataTypes";
import axios from "axios";
import { AppDispatch } from "../app/store";
import { message } from "antd";
import {
  FetchNoteParams,
  Note,
} from "../../utilities/common/exportDataTypes/noteDataTypes";
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

export function checkAuthTokenAndLogoff(error: Error) {
  if (axios.isAxiosError(error)) {
    // Check if the error has a response
    if (error.response) {
      // Access the status code from the response
      const statusCode = error.response.status;
      console.error("ERROR status at notes:", statusCode);
      // localStorage?.clear();
      // window.location.href = "/login";
      // You can also access other properties of the response, such as data and headers
      console.error("ERROR data:", error.response.data);
      console.error("ERROR headers:", error.response.headers);
    } else {
      console.error("Request made but no response received:", error.request);
    }
  } else {
    console.error("ERROR", error);
  }
  // You should return a rejected Promise with the error
  throw error;
}

const emptyNote = {
  noteId: "",
  note: "",
  createdAt: null,
  updatedAt: null,
  owner: null,
  company: null,
  contact: null,
  Lead: null,
  opportunity: null,
  activity: null,
  tags: null,
};

type InitialState = {
  loading: boolean;
  notes: Note[];
  note: Note;
  pagination: Pagination;
  error: string;
  addNoteLoader: boolean;
  getNoteLoader: boolean;
  editable: boolean;
  totalNotes: number;
};

const initialState: InitialState = {
  loading: false,
  note: emptyNote,
  addNoteLoader: false,
  getNoteLoader: false,
  notes: [],
  pagination: {
    page: 1,
    total: 20,
  },
  error: "",
  editable: false,
  totalNotes: 0,
};

// Fetch Notes data

export const getAllNotes = createAsyncThunk(
  "accounts/getAllNotes",
  async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };

      const response = await axios.get(`${baseUrl}note/`, config);
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

export const fetchAllNotes = createAsyncThunk(
  "note/fetchAllNotes",
  async (params: FetchNoteParams) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await api.post(
        `note/getAllNotes?page=${params?.page}&limit=${params?.limit}&search=${params?.search}`,
        {},
        config
      );
      if (response.status === 200) {
        console.log("Success", response?.data);
      }
      return response.data;
    } catch (error: any) {
      checkAuthTokenAndLogoff(error);
    }
  }
);

export const addNote = createAsyncThunk(
  "note/addNote",
  async (payload: Note) => {
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
        `${baseUrl}note/`,
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

export const getNoteById = createAsyncThunk(
  "note/getNoteById",
  async (noteId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      // 6ba4ea16-cec2-4b26-ab29-351b3bc7e90e
      const response = await axios.get(`${baseUrl}/note/${noteId}`, config);
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

export const updateNoteById = createAsyncThunk(
  "note/updateNoteById",
  async (payload: Note) => {
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
        `${baseUrl}note/${payload?.noteId}`,
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

export const deleteNotesById = createAsyncThunk(
  "note/deleteNotesById",
  async (noteIds: React.Key[]) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const payload = {
        noteIds: noteIds,
      };
      const response = await axios.post(
        `${baseUrl}note/bulk-delete`,
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

// For related View

export const fetchAllNotesByModuleId = createAsyncThunk(
  "notes/fetchAllNotesByModuleId",
  async ({
    moduleName,
    moduleId,
    params,
  }: {
    moduleName: string;
    moduleId: string;
    params: FetchNoteParams;
  }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await axios.post(
        `${baseUrl}note/${moduleName}/${moduleId}?page=${params?.page}&limit=${
          params?.limit
        }&search=${params?.search?.toLocaleLowerCase()}`,
        null,
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

// For All Notes

export const createAndGetAllNotes =
  (payload: Note, params: FetchNoteParams) => async (dispatch: AppDispatch) => {
    await dispatch(addNote(payload));
    await dispatch(fetchAllNotes(params));
  };

export const updateNoteByIdAndGetAllNotes =
  (payload: Note, params: FetchNoteParams) => async (dispatch: AppDispatch) => {
    await dispatch(updateNoteById(payload));
    await dispatch(fetchAllNotes(params));
  };

export const deleteNotesByIdAndGetAllNotesTotal =
  (noteIds: React.Key[], params: FetchNoteParams) =>
  async (dispatch: AppDispatch) => {
    await dispatch(deleteNotesById(noteIds));
    await dispatch(fetchAllNotes(params));
  };

// For related View

export const createAndGetAllNotesByModuleId =
  (
    payload: Note,
    params: FetchNoteParams,
    moduleName: string,
    moduleId: string
  ) =>
  async (dispatch: AppDispatch) => {
    await dispatch(addNote(payload));
    await dispatch(fetchAllNotesByModuleId({ moduleName, moduleId, params }));
  };

export const deleteNotesByIdAndGetAllNotesByModuleId =
  (
    noteId: React.Key[],
    params: FetchNoteParams,
    moduleName: string,
    moduleId: string
  ) =>
  async (dispatch: AppDispatch) => {
    await dispatch(deleteNotesById(noteId));
    await dispatch(fetchAllNotesByModuleId({ moduleName, moduleId, params }));
  };

export const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    handleInputChangeReducerNote: (state, action) => {
      // type of the action payload should be object
      state.note = {
        ...state.note,
        ...action.payload,
      };
      return state;
    },
    resetNote: (state) => {
      // type of the action payload should be object
      state.note = emptyNote;
      return state;
    },
    resetNotes: (state) => {
      state.notes = [];
    },
    setEditableMode: (state, action) => {
      state.editable = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addNote.pending, (state) => {
      state.addNoteLoader = true;
    });
    builder.addCase(addNote.fulfilled, (state, action) => {
      state.addNoteLoader = false;
      if (action.payload?.data) {
        state.note = action.payload?.data;
      }
      state.note = emptyNote;
      message.success("Note added successfully");
      state.error = "";
    });
    builder.addCase(addNote.rejected, (state, action) => {
      state.addNoteLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });
    builder.addCase(getNoteById.pending, (state) => {
      state.getNoteLoader = true;
    });
    builder.addCase(getNoteById.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.note = action.payload.data;
      }
      state.getNoteLoader = false;
      state.error = "";
    });
    builder.addCase(getNoteById.rejected, (state, action) => {
      state.getNoteLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });
    builder.addCase(updateNoteById.pending, (state) => {
      state.addNoteLoader = true;
    });
    builder.addCase(updateNoteById.fulfilled, (state) => {
      state.addNoteLoader = false;
      state.editable = false;
      state.error = "";
      message.success("Note updated successfully");
    });
    builder.addCase(updateNoteById.rejected, (state, action) => {
      state.addNoteLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });
    builder.addCase(deleteNotesById.pending, (state) => {
      state.addNoteLoader = true;
    });
    builder.addCase(deleteNotesById.fulfilled, (state) => {
      state.addNoteLoader = false;
      state.error = "";
      message.success("Note deleted successfully");
    });
    builder.addCase(deleteNotesById.rejected, (state, action) => {
      state.addNoteLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });
    // Get all Notes
    builder.addCase(fetchAllNotes.pending, (state) => {
      state.getNoteLoader = true;
    });
    builder.addCase(fetchAllNotes.fulfilled, (state, action) => {
      if (action.payload.data?.data) {
        state.totalNotes = action.payload.data?.total
        const actualdata = action.payload?.data?.data?.map((item: Note) => {
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
        state.notes = actualdata;
      } else {
        state.notes = [];
      }
      state.getNoteLoader = false;
      state.error = "";
    });
    builder.addCase(fetchAllNotes.rejected, (state, action) => {
      state.getNoteLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });

    builder.addCase(getAllNotes.pending, (state) => {
      state.getNoteLoader = true;
    });
    builder.addCase(getAllNotes.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.totalNotes = action.payload.data?.total
        const actualdata = action.payload?.data?.map((item: Note) => {
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
        state.notes = actualdata;
      } else {
        state.notes = [];
      }
      state.getNoteLoader = false;
      state.error = "";
    });
    builder.addCase(getAllNotes.rejected, (state, action) => {
      state.getNoteLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });

    // Get Related views notes
    builder.addCase(fetchAllNotesByModuleId.pending, (state) => {
      state.getNoteLoader = true;
    });
    builder.addCase(fetchAllNotesByModuleId.fulfilled, (state, action) => {
      if (action.payload.data?.data) {
        state.totalNotes = action.payload.data?.total
        const actualdata = action.payload?.data?.data?.map((item: Note) => {
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
        state.notes = actualdata;
      } else {
        state.notes = [];
      }
      state.getNoteLoader = false;
      state.error = "";
    });
    builder.addCase(fetchAllNotesByModuleId.rejected, (state, action) => {
      state.getNoteLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });
  },
});
export const {
  handleInputChangeReducerNote,
  resetNote,
  resetNotes,
  setEditableMode,
} = noteSlice.actions;
export default noteSlice.reducer;
