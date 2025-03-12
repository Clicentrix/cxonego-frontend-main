import { Dayjs } from "dayjs";
import { Owner } from "./leadDataTypes";

export type Appointment = {
  title: string;
  appointmentId: string;
  agenda: string;
  startDateTime: string | Dayjs | Date;
  endDateTime: string | Dayjs | Date;
  Notes: string;
  participentEmailId: string[];
  createdAt: string;
  updatedAt: string;
  status: string;
  type: string;
  orgnizerId: null | Owner;
};

export type AppointmentResponse = {
  title: string;
  appointmentId: string;
  agenda: string;
  startDateTime: string | Dayjs | Date;
  endDateTime: string | Dayjs | Date;
  Notes: string;
  createdAt: string | null; // Nullable if necessary
  updatedAt: string | null; // Nullable if necessary
  status: string;
  type: string;
  orgnizerId: OrgnizerId;
  participentEmailId: string[];
};

export type Calparticipaters = {
  userId?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type OrgnizerId = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};
