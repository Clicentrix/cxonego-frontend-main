import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Tag, Tooltip } from "antd";
import {
  createAndGetAllNotes,
  deleteNotesByIdAndGetAllNotesTotal,
  fetchAllNotes,
  resetNote,
  resetNotes,
} from "../../redux/features/noteSlice";
import {
  DataGrid,
  GridCellParams,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { RootState } from "../../redux/app/store";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import AddNoteForm from "./addNoteForm";
import { Note } from "../../utilities/common/exportDataTypes/noteDataTypes";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { NOTES_ICON_ORANGE } from "../../utilities/common/imagesImports";
import { PlusOutlined } from "@ant-design/icons";

const AllNotesView = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { note, notes, loading, addNoteLoader, getNoteLoader, totalNotes } = useAppSelector(
    (state: RootState) => state.notes
  );
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const { user } = useAppSelector((state: RootState) => state.authentication);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);
  const [tagsString, setTagsString] = useState<string>("");
  const initialParams = {
    page: 1,
    limit: 10,
    search: null || "",
  };

  const [params, setParams] = useState(initialParams);

  const onSearch = (value: string) => {
    setParams({ ...params, search: value });
  };
  const onBoxClick = (note: Note) => {
    navigate(`/note/${note?.noteId}`);
  };
  const handleReset = () => {
    setParams(initialParams);
  };
  const columns = [
    {
      field: "noteId",
      headerName: "NOTE NUMBER",
      width: 300,
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.noteId || emptyValue}
        </div>
      ),
    },
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

  const handleResetForm = () => {
    form.resetFields();
    setTagsString("");
    dispatch(resetNote());
  };

  const handleSubmit = () => {
    dispatch(createAndGetAllNotes(note, params));
    setIsModalOpen(false);
    handleResetForm();
  };

  const showModal = () => {
    setIsModalOpen(true);
    handleResetForm();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    handleResetForm();
  };
  const handleClose = (removedTag: string) => {
    const newTags = tagsString
      .split(", ")
      .filter((tag) => tag !== removedTag)
      .join(", ");
    setTagsString(newTags);
  };

  const handleDelete = () => {
    dispatch(deleteNotesByIdAndGetAllNotesTotal(selectedRowKeys, params));
    setSelectedRowKeys([]);
  };

  const handlePaginationChange = (paginationModel: GridPaginationModel) => {
    setParams({
      ...params,
      page: paginationModel.page + 1, // MUI DataGrid uses 0-based index for pages
      limit: paginationModel.pageSize,
    });
  };

  useEffect(() => {
    dispatch(fetchAllNotes(params));
  }, [params]);

  useEffect(() => {
    dispatch(resetNote());
    dispatch(resetNotes());
  }, [dispatch]);

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
      <div className="listViewBackWrapper">
        <div className="activitiesListToolbarWrapper">
          <div className="activitiesListToolbarItem">
            <div className="tableTitleIconWrapper">
              <img
                src={NOTES_ICON_ORANGE}
                alt="illustration"
                className="illustrationIcon"
              />
              Notes
              {screenWidth < 768 ? (
                <Tooltip title={"Add new activity"}>
                  <PlusOutlined onClick={showModal} />
                </Tooltip>
              ) : (
                <Button onClick={showModal} className="addOpportunityModalBtn">
                  New
                </Button>
              )}
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
              value={params?.search}
            />
            <Button onClick={handleReset} className="resetFilterBtn">
              Reset filter
            </Button>
            <div className="opportunitiesSwitchDiv"></div>
          </div>
        </div>
        <div style={{ height: "75vh" }}>
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

export default AllNotesView;
