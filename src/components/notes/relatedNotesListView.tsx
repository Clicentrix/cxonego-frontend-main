import { useEffect, useState } from "react";
import { Input, Popconfirm, Form, Modal, Button, Tag } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/activities/activitiesListView.css";
import "../../styles/oppotunities/opportunitiesListView.css";
import "../../styles/horizontalFunctions/filterDropdown.css";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import {
  DataGrid,
  GridCellParams,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
  createAndGetAllNotesByModuleId,
  deleteNotesByIdAndGetAllNotesByModuleId,
  fetchAllNotesByModuleId,
  handleInputChangeReducerNote,
  resetNote,
  resetNotes,
} from "../../redux/features/noteSlice";
import { Note } from "../../utilities/common/exportDataTypes/noteDataTypes";
import AddNoteForm from "./addNoteForm";
import { NOTES_ICON_ORANGE } from "../../utilities/common/imagesImports";
import { getUserById } from "../../redux/features/authenticationSlice";

const AllRelatedNotes = ({
  moduleName,
  moduleId,
}: {
  moduleName: string;
  moduleId: string;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { note, notes, loading, addNoteLoader, getNoteLoader, totalNotes } = useAppSelector(
    (state: RootState) => state.notes
  );
  const { user } = useAppSelector((state: RootState) => state.authentication);
  console.log("module name at activity", moduleName);
  const initialParams = {
    page: 1,
    limit: 10,
    search: "",
  };
  const [params, setParams] = useState(initialParams);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);
  const [tagsString, setTagsString] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDelete = () => {
    dispatch(
      deleteNotesByIdAndGetAllNotesByModuleId(
        selectedRowKeys,
        params,
        moduleName,
        moduleId
      )
    );
    setSelectedRowKeys([]);
  };

  const handleSubmit = () => {
    if (moduleId) {
      if (moduleName === "opportunity") {
        dispatch(
          createAndGetAllNotesByModuleId(
            { ...note, opportunity: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      } else if (moduleName === "account") {
        dispatch(
          createAndGetAllNotesByModuleId(
            { ...note, company: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      } else if (moduleName === "contact") {
        dispatch(
          createAndGetAllNotesByModuleId(
            { ...note, contact: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      } else if (moduleName === "activity") {
        dispatch(
          createAndGetAllNotesByModuleId(
            { ...note, activity: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      } else {
        dispatch(
          createAndGetAllNotesByModuleId(
            { ...note, Lead: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      }
      setIsModalOpen(false);
      form.resetFields();
    }
  };

  const onSearch = (value: string) => {
    setParams({ ...params, search: value });
  };

  const handleClose = (removedTag: string) => {
    const newTags = tagsString
      .split(", ")
      .filter((tag) => tag !== removedTag)
      .join(", ");
    setTagsString(newTags);
  };

  useEffect(() => {
    dispatch(fetchAllNotesByModuleId({ moduleName, moduleId, params }));
  }, [params]);

  useEffect(() => {
    // dispatch(resetNote());
    dispatch(resetNotes());
    dispatch(getUserById());
  }, []);

  const columns = [
    {
      field: "note",
      headerName: "NOTE",
      width: 300,
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.note || emptyValue}
        </div>
      ),
    },
    {
      field: "owner",
      headerName: "OWNER",
      width: 200,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.owner || emptyValue}</div>
      ),
    },
    {
      field: "tags",
      headerName: "TAGS",
      width: 300,
      renderCell: (params: GridCellParams) => {
        const { row } = params;
        const tags = row?.tags?.split(", ");
        return (
          <div className="tagsContainerInTableView">
            {tags?.length == undefined ? (
              <div className="noTags">No Tags Attached</div>
            ) : (
              tags?.map((tag: string, index: number) => (
                <Tag key={index} onClose={() => handleClose(tag)}>
                  <span>{tag}</span>
                </Tag>
              ))
            )}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "CREATED ON",
      width: 210,
    },
    {
      field: "updatedAt",
      headerName: "UPDATED ON",
      width: 210,
    },
  ];

  const showModal = async () => {
    setIsModalOpen(true);
    dispatch(resetNote());
    form.setFieldsValue({
      ...note,
      company: moduleName === "account" ? moduleId : null,
      contact: moduleName === "contact" ? moduleId : null,
      Lead: moduleName === "lead" ? moduleId : null,
      opportunity: moduleName === "opportunity" ? moduleId : null,
      activity: moduleName === "activity" ? moduleId : null,
    });
    dispatch(
      handleInputChangeReducerNote({
        ...note,
        company: moduleName === "account" ? moduleId : null,
        contact: moduleName === "contact" ? moduleId : null,
        Lead: moduleName === "lead" ? moduleId : null,
        opportunity: moduleName === "opportunity" ? moduleId : null,
        activity: moduleName === "activity" ? moduleId : null,
      })
    );
  };

  // useEffect(() => {

  //   form.setFieldsValue({
  //     ...note,
  //     company: moduleName === "account" ? moduleId : note?.company,
  //     contact: moduleName === "contact" ? moduleId : note?.contact,
  //     lead: moduleName === "lead" ? moduleId : note?.lead,
  //     opportunity: moduleName === "opportunity" ? moduleId : note?.opportunity,
  //     activity: moduleName === "activity" ? moduleId : note?.activity,
  //   });
  //   dispatch(
  //     handleInputChangeReducerNote({
  //       ...note,
  //       company: moduleName === "account" ? moduleId : note?.company,
  //       contact: moduleName === "contact" ? moduleId : note?.contact,
  //       lead: moduleName === "lead" ? moduleId : note?.lead,
  //       opportunity:
  //         moduleName === "opportunity" ? moduleId : note?.opportunity,
  //       activity: moduleName === "activity" ? moduleId : note?.activity,
  //     })
  //   );
  // }, [isModalOpen]);

  console.log("note at activity", note);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleReset = () => {
    setParams(initialParams);
  };
  const onBoxClick = (note: Note) => {
    navigate(`/note/${note?.noteId}`);
  };

  const handlePaginationChange = (paginationModel: GridPaginationModel) => {
    setParams({
      ...params,
      page: paginationModel.page + 1, // MUI DataGrid uses 0-based index for pages
      limit: paginationModel.pageSize,
    });
  };

  return (
    <>
      <div>
        <Modal
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="addActivityFormDiv">
            <div className="addActivityTitle">New Note</div>

            <div className="addActivityFormWrapper">
              <Form form={form} name="loginForm" onFinish={handleSubmit}>
                <AddNoteForm />
                <Form.Item className="addActivitySubmitBtnWrapper">
                  <Button
                    onClick={handleCancel}
                    className="addActivityCancelBtn"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="addActivitySubmitBtn"
                    loading={addNoteLoader}
                  >
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Modal>
      </div>
      <div className="relatedListViewBackWrapper">
        <div className="activitiesListToolbarWrapper">
          <div className="activitiesListToolbarItem">
            <div className="tableTitleIconWrapper">
              <img
                src={NOTES_ICON_ORANGE}
                alt="illustration"
                className="illustrationIcon"
              />
              Related Notes
              <Button onClick={showModal} className="addOpportunityModalBtn">
                New
              </Button>
            </div>

            {selectedRowKeys.length > 0 ? (
              <div className="activityDeleteBottomBar">
                <Popconfirm
                  title="Delete this note"
                  description="Are you sure you want to delete this record?"
                  onConfirm={handleDelete}
                  // onCancel={onCancelDeletePopup}
                  okText="Yes"
                  cancelText="Cancel"
                >
                  <Button type="primary" danger style={{ marginLeft: "10px" }}>
                    Delete selected
                  </Button>
                </Popconfirm>
              </div>
            ) : null}
          </div>
          <div className="opportunitiesSearchResetBar">
            <Input
              placeholder="search here.."
              name="searchText"
              onChange={(e) => onSearch(e.target.value)}
              style={{ border: "1px solid var(--gray5)", padding: "2px 5px" }}
              value={params?.search}
            />
            <Button onClick={handleReset} className="resetFilterBtn">
              Reset filter
            </Button>
            <div className="opportunitiesSwitchDiv"></div>
          </div>
        </div>
        <div style={{ height: "50vh" }}>
          <DataGrid
            rows={notes}
            columns={columns}
            loading={loading || addNoteLoader || getNoteLoader}
            key={"noteId"}
            getRowId={(row) => row?.noteId}
            checkboxSelection={user?.role === "ADMIN" ? true : false}

            onRowSelectionModelChange={(
              newSelection: GridRowSelectionModel
            ) => {
              setSelectedRowKeys(newSelection as GridRowId[]);
            }}
            paginationMode="server"
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: params.limit,
                  page: params.page - 1,
                },
              },
            }}
            onPaginationModelChange={handlePaginationChange}
            pageSizeOptions={[5, 10, 20, 25]}
            rowCount={totalNotes > 0 ? totalNotes : 0} // Set the total number of rows
          />
        </div>
      </div>
    </>
  );
};

export default AllRelatedNotes;
