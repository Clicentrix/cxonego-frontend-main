// import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Pagination } from "../../utilities/common/exportDataTypes/accountDataTypes";
import axios from "axios";
import { AppDispatch } from "../app/store";
import { message } from "antd";
import {
  Appointment,
  OrgnizerId,
} from "../../utilities/common/exportDataTypes/calendarDataTypes";
import dayjs from "dayjs";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const accessToken = localStorage.getItem("accessToken");
// const userId = localStorage.getItem("userId");

function isAccessToken(str: string | null) {
  return typeof str === "string" && str !== null;
}
// function isUserId(str: string | null) {
//   return typeof str === "string" && str !== null;
// }

export const emptyAppointment = {
  appointmentId: "",
  title: "",
  agenda: "",
  startDateTime: dayjs(),
  endDateTime: dayjs(),
  Notes: "",
  participentEmailId: [],
  createdAt: "",
  updatedAt: "",
  status: "Pending",
  type: "Appointment",
  orgnizerId: null,
};

type InitialState = {
  loading: boolean;
  appointments: Appointment[];
  appointment: Appointment;
  pagination: Pagination;
  error: string;
  addAppointmentLoader: boolean;
  getAppointmentLoader: boolean;
  getAppointmentByIdLoader: boolean;
  editable: boolean;
  orgPeople: OrgnizerId[];
  orgPeopleLoader: boolean;
};

const initialState: InitialState = {
  loading: false,
  appointments: [],
  appointment: emptyAppointment,
  getAppointmentByIdLoader: false,
  addAppointmentLoader: false,
  getAppointmentLoader: false,
  pagination: {
    page: 1,
    total: 20,
  },
  error: "",
  editable: false,
  orgPeople: [],
  orgPeopleLoader: false,
};

// Fetch Appointment data
//for export data.
export const getAllAppointments = createAsyncThunk(
  "accounts/getAllAppointments",
  async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };

      const response = await axios.get(`${baseUrl}calender/`, config);
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

export const fetchAllAppointments = createAsyncThunk(
  "appointments/fetchAllAppointments",
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
        `${baseUrl}calender/getAppointments`,
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

// Get All organization people
export const fetchAllOrgsPeople = createAsyncThunk(
  "appointments/fetchAllOrgsPeopple",
  async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await axios.get(`${baseUrl}calender/users/`, config);
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

export const addAppointment = createAsyncThunk(
  "appointments/addAppointment",
  async (payload: Appointment) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      console.log("Appointments payload: " ,payload);
      const { createdAt, updatedAt, ...payloadWithoutCreatedAt } = payload;
      const response = await axios.post(
        `${baseUrl}calender/create-calender`,
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

export const getAppointmentById = createAsyncThunk(
  "appointments/getAppointmentById",
  async (appointmentId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await axios.get(
        `${baseUrl}calender/${appointmentId}`,
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

export const updateAppointmentById = createAsyncThunk(
  "appointments/updateAppointmentById",
  async (payload: any) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const { createdAt, updatedAt, ...payloadWithoutCreatedAt } = payload;

      const response = await axios.put(
        `${baseUrl}calender/update-calender/${payload?.appointmentId}`,
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

export const deleteAppointmentsById = createAsyncThunk(
  "appointments/deleteAppointmentsById",
  async (appointmentId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            isAccessToken(accessToken) ? accessToken : undefined
          }`,
        },
      };
      const response = await axios.delete(
        `${baseUrl}calender/delete-calender/${appointmentId}`,
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

// For All Appointment

export const createAndGetAllAppointments =
  (payload: Appointment) => async (dispatch: AppDispatch) => {
    await dispatch(addAppointment(payload));
    await dispatch(fetchAllAppointments());
  };

export const updateAppointmentByIdAndGetAllAppointments =
  (payload: Appointment) => async (dispatch: AppDispatch) => {
    await dispatch(updateAppointmentById(payload));
    await dispatch(fetchAllAppointments());
  };

export const deleteAppointsByIdAndGetAllAppointmentsTotal =
  (appointmentId: string) => async (dispatch: AppDispatch) => {
    await dispatch(deleteAppointmentsById(appointmentId));
    await dispatch(fetchAllAppointments());
  };

export const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    handleInputChangeReducerAppointment: (state, action) => {
      // type of the action payload should be object
      state.appointment = {
        ...state.appointment,
        ...action.payload,
      };
      return state;
    },
    resetAppointment: (state) => {
      // type of the action payload should be object
      state.appointment = emptyAppointment;
      return state;
    },
    resetAppointments: (state) => {
      state.appointments = [];
    },
    setEditableMode: (state, action) => {
      state.editable = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addAppointment.pending, (state) => {
      state.addAppointmentLoader = true;
    });
    builder.addCase(addAppointment.fulfilled, (state, action) => {
      state.addAppointmentLoader = false;
      if (action.payload?.data) {
        state.appointment = action.payload?.data;
      } else {
        state.appointment = emptyAppointment;
      }
      message.success("Appointment Scheduled successfully");
      state.error = "";
    });
    builder.addCase(addAppointment.rejected, (state, action) => {
      state.addAppointmentLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });
    builder.addCase(getAppointmentById.pending, (state) => {
      state.getAppointmentByIdLoader = true;
    });
    builder.addCase(getAppointmentById.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.appointment = {
          ...action?.payload?.data,
          startDateTime: dayjs(
            action?.payload?.data.startDateTime as string | number | Date
          ),
          endDateTime: dayjs(
            action?.payload?.data.endDateTime as string | number | Date
          ),
        };
      }
      state.getAppointmentByIdLoader = false;
      state.error = "";
    });
    builder.addCase(getAppointmentById.rejected, (state, action) => {
      state.getAppointmentByIdLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });
    builder.addCase(updateAppointmentById.pending, (state) => {
      state.addAppointmentLoader = true;
    });
    builder.addCase(updateAppointmentById.fulfilled, (state) => {
      state.addAppointmentLoader = false;
      state.editable = false;
      state.error = "";
      message.success("Appointment Updated successfully");
    });
    builder.addCase(updateAppointmentById.rejected, (state, action) => {
      state.addAppointmentLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });
    builder.addCase(deleteAppointmentsById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteAppointmentsById.fulfilled, (state) => {
      state.loading = false;
      state.error = "";
      message.success("Appointment Deleted successfully");
    });
    builder.addCase(deleteAppointmentsById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
      message.error("Operation cannot be completed, you may want to contact administrator for help.");
    });
    // Get all Appointments
    builder.addCase(getAllAppointments.pending, (state) => {
      state.getAppointmentLoader = true;
    });
    builder.addCase(getAllAppointments.fulfilled, (state, action) => {
      if (action?.payload?.data) {
        state.appointments = action?.payload?.data.map((item: any) => {
          return {
            ...item,
            organizer: `${item?.orgnizerId?.firstName} ${item?.orgnizerId?.lastName}`,
            participants: item?.calparticipaters?.map((p: any) => p.email).join(", ") || null
          };
        })
      } else {
        state.appointments = [];
      }
      state.getAppointmentLoader = false;
      state.error = "";
    });
    builder.addCase(getAllAppointments.rejected, (state, action) => {
      state.getAppointmentLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });
    builder.addCase(fetchAllAppointments.pending, (state) => {
      state.getAppointmentLoader = true;
    });
    builder.addCase(fetchAllAppointments.fulfilled, (state, action) => {
      if (action?.payload?.data) {
        const actualdata = action.payload?.data?.map(
          (item: any) => {
            return {
              ...item,
              orgnizerId: `${item?.orgnizerId?.firstName} ${item?.orgnizerId?.lastName}`,
             
            };
          }
        );
        state.appointments =actualdata;
      } else {
        state.appointments = [];
      }
      state.getAppointmentLoader = false;
      state.error = "";
    });
    builder.addCase(fetchAllAppointments.rejected, (state, action) => {
      state.getAppointmentLoader = false;
      state.error = action.error.message || "Operation cannot be completed, you may want to contact administrator for help.";
    });

    // Get all Organization users for calendar wrt that particular userid
    builder.addCase(fetchAllOrgsPeople.pending, (state) => {
      state.orgPeopleLoader = true;
    });
    builder.addCase(fetchAllOrgsPeople.fulfilled, (state, action) => {
      if (action?.payload?.data) {
        state.orgPeople = action?.payload?.data;
      } else {
        state.orgPeople = [];
      }
      state.orgPeopleLoader = false;
    });
    builder.addCase(fetchAllOrgsPeople.rejected, (state) => {
      state.orgPeopleLoader = false;
    });
  },
});
export const {
  handleInputChangeReducerAppointment,
  resetAppointment,
  resetAppointments,
  setEditableMode,
} = appointmentSlice.actions;
export default appointmentSlice.reducer;
