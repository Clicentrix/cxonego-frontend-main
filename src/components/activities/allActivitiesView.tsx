import { useEffect, useState } from "react";
import {
  Input,
  Popconfirm,
  Form,
  Modal,
  Button,
  Skeleton,
  Tooltip,
  Tabs,
  Select,
  DatePicker,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/activities/activitiesListView.css";
import "../../styles/oppotunities/opportunitiesListView.css";
import { TableOutlined, IdcardOutlined, PlusOutlined } from "@ant-design/icons";
import "../../styles/horizontalFunctions/filterDropdown.css";
import { useNavigate } from "react-router-dom";
import { Activity } from "../../utilities/common/exportDataTypes/activityDatatypes";
import {
  createAndGetAllActivities,
  deleteActivitysByIdAndGetAllActivitiesTotal,
  fetchAllActivities,
  handleInputChangeReducerActivity,
  resetActivities,
  resetActivity,
} from "../../redux/features/activitySlice";
import ActivitiesKanban from "./activitiesKanbanView";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import {
  DataGrid,
  GridCellParams,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { ACTIVITIES_ICON_ORANGE } from "../../utilities/common/imagesImports";
import TextArea from "antd/es/input/TextArea";
import {
  activityPriorityOptions,
  activityStatusOptions,
  activityTypeOptions,
} from "../../utilities/common/dataArrays";
import dayjs, { Dayjs } from "dayjs";
import { getUserById } from "../../redux/features/authenticationSlice";
import moment from "moment";

const AllActivitiesView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    activity,
    activities,
    loading,
    addActivityLoader,
    getActivityLoader,
    totalActivities
  } = useAppSelector((state: RootState) => state.activities);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const { user } = useAppSelector((state: RootState) => state.authentication);

  const [view, setView] = useState<string>("list");
  const initialParams = {
    page: 1,
    limit: 10,
    search: "",
    view: "myView",
  };
  const [params, setParams] = useState(initialParams);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  const onTabChange = (key: string) => {
    setParams({ ...params, view: key });
  };
  const handleDelete = () => {
    dispatch(
      deleteActivitysByIdAndGetAllActivitiesTotal(selectedRowKeys, params)
    );
    setSelectedRowKeys([]);
  };

  const handleSubmit = async () => {
    await dispatch(createAndGetAllActivities(activity, params));
    await setIsModalOpen(false);
    form.resetFields();
  };

  const onSearch = (value: string) => {
    setParams({ ...params, search: value });
  };

  useEffect(() => {
    dispatch(fetchAllActivities(params));
  }, [params]);

  useEffect(() => {
    dispatch(resetActivity());
    dispatch(resetActivities());
    dispatch(getUserById());
  }, [dispatch]);

  const onBoxClick = (activity: Activity) => {
    navigate(`/activity/${activity?.activityId}`);
  };

  const columns = [
    {
      headerName: "ACTIVITY NUMBER",
      field: "activityId",
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.activityId || emptyValue}
        </div>
      ),
      width: 160,
    },
    {
      headerName: "SUBJECT",
      field: "subject",
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.subject || emptyValue}
        </div>
      ),
      width: 160,
    },

    {
      headerName: "OWNER",
      field: "owner",
      width: 200,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.owner || emptyValue}</div>
      ),
    },
    {
      headerName: "TYPE",
      field: "activityType",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.activityType || emptyValue}</div>
      ),
      width: 150,
    },
    {
      headerName: "STATUS",
      field: "activityStatus",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.activityStatus || emptyValue}</div>
      ),
      width: 150,
    },
    {
      headerName: "PRIORITY",
      field: "activityPriority",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.activityPriority || emptyValue}</div>
      ),
      width: 100,
    },
    {
      headerName: "START DATE",
      field: "startDate",
      renderCell: (params: GridCellParams) => (
        <div>
          {params?.row?.startDate
            ? moment(params?.row?.startDate)?.format("MMMM Do YYYY, h:mm:ss a")
            : emptyValue}
        </div>
      ),
      width: 210,
    },
    {
      headerName: "DUE DATE",
      field: "dueDate",
      renderCell: (params: GridCellParams) => (
        <div>
          {params?.row?.dueDate
            ? moment(params?.row?.dueDate)?.format("MMMM Do YYYY, h:mm:ss a")
            : emptyValue}
        </div>
      ),
      width: 210,
    },
    {
      headerName: "ACTUAL START DATE",
      field: "actualStartDate",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.actualStartDate || emptyValue}</div>
      ),
      width: 210,
    },
    {
      headerName: "ACTUAL END DATE",
      field: "actualEndDate",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.actualEndDate || emptyValue}</div>
      ),
      width: 210,
    },
    {
      headerName: "DESCRIPTION",
      field: "description",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.description || emptyValue}</div>
      ),
      width: 200,
    },
    {
      headerName: "CREATED ON",
      field: "createdAt",
      width: 230,
    },
    {
      headerName: "UPDATED ON",
      field: "updatedAt",
      width: 230,
    },
  ];

  const handlePaginationChange = (paginationModel: GridPaginationModel) => {
    setParams({
      ...params,
      page: paginationModel.page + 1, // MUI DataGrid uses 0-based index for pages
      limit: paginationModel.pageSize,
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleReset = () => {
    setParams(initialParams);
  };
  const onListClick = (value: string) => {
    setView(value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(
      handleInputChangeReducerActivity({
        [name]: value,
      })
    );
  };

  const handleSelectChange = (value: string, name: string) => {
    dispatch(
      handleInputChangeReducerActivity({
        [name]: value,
      })
    );
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
    if (date) {
      dispatch(handleInputChangeReducerActivity({ startDate: date }));
    }
    form.validateFields(["dueDate"]);
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    if (date) {
      dispatch(handleInputChangeReducerActivity({ dueDate: date }));
    }
  };

  const disabledStartDate = (current: Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  const disabledEndDate = (current: Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  const validateEndDateTime = async (_: any, value: Dayjs | null) => {
    if (startDate && value && value.isBefore(startDate, "minute")) {
      return Promise.reject(
        new Error("End date and time should be after start date and time.")
      );
    }
    return Promise.resolve();
  };

  return (
    <>
      <div className="addActivityModalWrapper">
        <Modal
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="addActivityFormDiv">
            <div className="addActivityTitle">New Activity</div>

            <div className="addActivityFormWrapper">
              <Form form={form} name="loginForm" onFinish={handleSubmit}>
                <div>
                  <div className="activitiesAddFormGrid">
                    <Form.Item
                      name="activityType"
                      label="Type"
                      className="addOpportunityFormInput"
                      rules={[
                        {
                          required: false,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Select
                        onChange={(value) =>
                          handleSelectChange(value, "activityType")
                        }
                        options={activityTypeOptions}
                        defaultValue={"Task"}
                      />
                    </Form.Item>
                    <Form.Item
                      name="startDate"
                      label="Start Date"
                      className="addOpportunityFormInput"
                      rules={[
                        {
                          required: false,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <DatePicker
                        onChange={handleStartDateChange}
                        showTime={{ format: "HH:mm A", minuteStep: 15 }}
                        format="YYYY-MM-DD hh:mm A"
                        disabledDate={disabledStartDate}
                      />
                    </Form.Item>
                  </div>
                  <div className="activitiesAddFormGrid">
                    <Form.Item
                      name="subject"
                      label="Subject"
                      className="addOpportunityFormInput"
                      rules={[
                        {
                          required: true,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Input
                        onChange={handleInputChange}
                        name="subject"
                        type="string"
                        placeholder="Please enter here"
                      />
                    </Form.Item>
                    <Form.Item
                      name="dueDate"
                      label="Due Date"
                      className="addOpportunityFormInput"
                      rules={[
                        {
                          required: true,
                          message: "This field is mandatory!",
                        },
                        { validator: validateEndDateTime },
                      ]}
                    >
                      <DatePicker
                        onChange={handleEndDateChange}
                        showTime={{ format: "HH:mm A", minuteStep: 15 }}
                        format="YYYY-MM-DD hh:mm A"
                        disabledDate={disabledEndDate}
                      />
                    </Form.Item>
                  </div>
                  <div className="activitiesAddFormGrid">
                    <Form.Item
                      name="activityStatus"
                      label="Status"
                      className="addOpportunityFormInput"
                      rules={[
                        {
                          required: false,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Select
                        onChange={(value) =>
                          handleSelectChange(value, "activityStatus")
                        }
                        options={activityStatusOptions}
                        defaultValue={"Open"}
                      />
                    </Form.Item>
                    <Form.Item
                      name="activityPriority"
                      label="Priority"
                      className="addOpportunityFormInput"
                      rules={[
                        {
                          required: false,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Select
                        onChange={(value) =>
                          handleSelectChange(value, "activityPriority")
                        }
                        options={activityPriorityOptions}
                        defaultValue={"Medium"}
                      />
                    </Form.Item>
                  </div>
                  <div className="activitiesAddFormGrid">
                    <Form.Item
                      name="actualStartDate"
                      label="Actual Start Sate"
                      className="addOpportunityFormInput"
                      rules={[
                        {
                          required: false,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <DatePicker
                        onChange={(_date, dateString) => {
                          // Ensure dateString is a string before converting to Date
                          if (typeof dateString === "string") {
                            const dateObject = new Date(dateString);
                            if (!isNaN(dateObject.getTime())) {
                              // Check if dateObject is valid
                              dispatch(
                                handleInputChangeReducerActivity({
                                  actualStartDate: dateObject.toISOString(),
                                })
                              );
                            } else {
                              console.error("Invalid date string:", dateString);
                            }
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="actualEndDate"
                      label="Actual End Date"
                      className="addOpportunityFormInput"
                      rules={[
                        {
                          required: false,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <DatePicker
                        onChange={(_date, dateString) => {
                          // Ensure dateString is a string before converting to Date
                          if (typeof dateString === "string") {
                            const dateObject = new Date(dateString);
                            if (!isNaN(dateObject.getTime())) {
                              // Check if dateObject is valid
                              dispatch(
                                handleInputChangeReducerActivity({
                                  actualEndDate: dateObject.toISOString(),
                                })
                              );
                            } else {
                              console.error("Invalid date string:", dateString);
                            }
                          }
                        }}
                      />
                    </Form.Item>
                  </div>
                  <Form.Item
                    name="description"
                    label="Description"
                    className="addActivityFormInput"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: false,
                        message: "This field is mandatory!",
                      },
                    ]}
                  >
                    <TextArea
                      onChange={handleInputChange}
                      name="description"
                      placeholder="Please enter here"
                      maxLength={499}
                    />
                  </Form.Item>
                </div>
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
                    loading={addActivityLoader}
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
          <div className="tableTitleIconWrapper">
            <img
              src={ACTIVITIES_ICON_ORANGE}
              alt="illustration"
              className="illustrationIcon"
            />
            Activities
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
                title="Delete the activity"
                description="Are you sure you want to delete this record?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="Cancel"
              >
                <Button type="primary" danger style={{ marginLeft: "10px" }}>
                  Delete selected
                </Button>
              </Popconfirm>
            </div>
          ) : null}
          <div className="opportunitiesSearchResetBar">
            <Input
              placeholder="search here.."
              name="searchText"
              onChange={(e) => onSearch(e.target.value)}
              value={params?.search}
            />
            <Button onClick={handleReset} className="resetFilterBtn">
              Reset filters
            </Button>
            <div className="opportunitiesSwitchDiv">
              {view === "kanban" ? (
                <div
                  className="opportunitiesSwitchDivItem"
                  onClick={() => onListClick("list")}
                >
                  <TableOutlined />
                  List
                </div>
              ) : (
                <div
                  className="opportunitiesSwitchDivItem"
                  onClick={() => onListClick("kanban")}
                >
                  <IdcardOutlined />
                  Kanban
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs onChange={onTabChange} type="card">
          <Tabs.TabPane key={"myView"} tab={"My Activities"}>
            {view === "kanban" && loading ? (
              <Skeleton />
            ) : activities?.length > 0 && view === "kanban" && !loading ? (
              <ActivitiesKanban params={params} />
            ) : view === "list" ? (
              <div className="activitiesViewWapper" style={{ height: "75vh" }}>
                <DataGrid
                  rows={activities}
                  loading={loading || addActivityLoader || getActivityLoader}
                  key={"activityId"}
                  getRowId={(row) => row?.activityId}
                  checkboxSelection={user?.role === "ADMIN" ? true : false}
                  columns={columns}

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
                  rowCount={totalActivities > 0 ? totalActivities : 0} // Set the total number of rows
                />
              </div>
            ) : (
              <div>No Activities Found</div>
            )}
          </Tabs.TabPane>
          {user?.role === "SALESPERSON" ? null : (
            <Tabs.TabPane key={"myTeamView"} tab={"All Activities"}>
              {view === "kanban" && loading ? (
                <Skeleton />
              ) : activities?.length > 0 && view === "kanban" && !loading ? (
                <ActivitiesKanban params={params} />
              ) : view === "list" ? (
                <div
                  className="activitiesViewWapper"
                  style={{ height: "75vh" }}
                >
                  <DataGrid
                    rows={activities}
                    loading={loading || addActivityLoader || getActivityLoader}
                    key={"activityId"}
                    getRowId={(row) => row?.activityId}
                    checkboxSelection={user?.role === "ADMIN" ? true : false}
                    columns={columns}

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
                    rowCount={totalActivities > 0 ? totalActivities : 0} // Set the total number of rows
                  />
                </div>
              ) : (
                <div>No Activities Found</div>
              )}
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default AllActivitiesView;
