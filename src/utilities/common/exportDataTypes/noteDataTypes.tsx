import { ReactNode } from "react";
import { Owner, SelectValues } from "./leadDataTypes";

export type EditableCellProps = {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: Note; // Assuming Note is your data type
  handleInputChangeEdit: (value: any, dataIndex: string, record: Note) => void; // Adjust the type of value as needed
  save: (index: number, record: Note) => void;
  children: React.ReactNode;
  options?: SelectValues[]; // Assuming SelectValuesArray is the type of options
};

export type NoteColumnItems = {
  key?: string;
  title?: string | React.ReactNode | undefined;
  dataIndex?: string;
  editable?: boolean;
  render?: (text: any, record: Note, index: number) => React.ReactNode;
  inputType?: string;
  options?: SelectValues[] | null | undefined;
  width?: number;
  onCell?: (record: Note) => EditableCellProps;
  filterDropdown?: (props: any) => ReactNode;
  filterIcon?: (filtered: boolean) => ReactNode;
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
};

export type NoteColumnItemsList = NoteColumnItems[];

export type Note = {
  createdAt: string | null;
  updatedAt: string | null;
  noteId: string;
  note: string;
  company: string | null;
  contact: string | null;
  Lead: string | null;
  opportunity: string | null;
  activity: string | null;
  owner: Owner | null;
  tags: string | null;
};

export type Pagination = {
  page: number;
  total: number;
};
export type FetchNoteParams = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined | null;
};

export type AllNotesProps = {
  onBoxClick?: (item: Note) => void;
  // Adjust the type to match the shape of params
  setParams?:
    | React.Dispatch<
        React.SetStateAction<{
          page?: number | undefined;
          limit?: number | undefined;
          search?: string | undefined;
        }>
      >
    | undefined;
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

export interface FetchAllNoteParams extends AllNotesProps {
  params: {
    page?: number;
    limit?: number;
    search?: string;
  };
}

// Define the OneNoteById component with the NoteId prop
export type OneNoteByIdProps = {
  noteId: string;
};
