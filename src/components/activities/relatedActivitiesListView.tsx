import { useEffect, useState } from "react";
import {
  Input,
  Popconfirm,
  Form,
  Modal,
  Button,
  DatePicker,
  Select,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/activities/activitiesListView.css";
import "../../styles/oppotunities/opportunitiesListView.css";
import "../../styles/horizontalFunctions/filterDropdown.css";
import { useNavigate } from "react-router-dom";
import { Activity } from "../../utilities/common/exportDataTypes/activityDatatypes";
import {
  createAndGetAllActivitiesByModuleId,
  deleteActivitysByIdAndGetAllActivities,
  fetchAllActivitiesByModuleId,
  handleInputChangeReducerActivity,
  resetActivities,
  resetActivity,
} from "../../redux/features/activitySlice";
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

const AllRelatedActivities = ({
  moduleName,
  moduleId,
}: {
  moduleName: string;
  moduleId: string;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    activities,
    loading,
    addActivityLoader,
    activity,
    getActivityLoader,
    totalActivities
  } = useAppSelector((state: RootState) => state.activities);
  const { user } = useAppSelector((state: RootState) => state.authentication);

  const initialParams = {
    page: 1,
    limit: 10,
    search: "",
  };
  const [params, setParams] = useState(initialParams);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  const handleDelete = () => {
    dispatch(
      deleteActivitysByIdAndGetAllActivities(
        selectedRowKeys,
        params,
        moduleName,
        moduleId
      )
    );
    setSelectedRowKeys([]);
  };

  const handleSubmit = async () => {
    if (moduleId) {
      if (moduleName === "opportunity") {
        await dispatch(
          createAndGetAllActivitiesByModuleId(
            { ...activity, opportunity: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      } else if (moduleName === "account") {
        await dispatch(
          createAndGetAllActivitiesByModuleId(
            { ...activity, company: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      } else if (moduleName === "contact") {
        await dispatch(
          createAndGetAllActivitiesByModuleId(
            { ...activity, contact: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      } else {
        await dispatch(
          createAndGetAllActivitiesByModuleId(
            { ...activity, lead: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      }
      await setIsModalOpen(false);
      form.resetFields();
    }
  };

  const onSearch = (value: string) => {
    setParams({ ...params, search: value });
  };

  const handlePaginationChange = (paginationModel: GridPaginationModel) => {
    setParams({
      ...params,
      page: paginationModel.page + 1, // MUI DataGrid uses 0-based index for pages
      limit: paginationModel.pageSize,
    });
  };

  useEffect(() => {
    dispatch(fetchAllActivitiesByModuleId({ moduleName, moduleId, params }));
  }, [params]);

  useEffect(() => {
    dispatch(resetActivity());
    dispatch(resetActivities());
    dispatch(getUserById());
  }, [dispatch]);

  const columns = [
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

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
    form.setFieldsValue({
      ...activity,
      company: moduleName === "account" ? moduleId : activity?.company,
      contact: moduleName === "contact" ? moduleId : activity?.contact,
      lead: moduleName === "lead" ? moduleId : activity?.lead,
      opportunity:
        moduleName === "opportunity" ? moduleId : activity?.opportunity,
    });
    dispatch(
      handleInputChangeReducerActivity({
        ...activity,
        company: moduleName === "account" ? moduleId : activity?.company,
        contact: moduleName === "contact" ? moduleId : activity?.contact,
        lead: moduleName === "lead" ? moduleId : activity?.lead,
        opportunity:
          moduleName === "opportunity" ? moduleId : activity?.opportunity,
      })
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleReset = () => {
    setParams(initialParams);
  };
  const onBoxClick = (activity: Activity) => {
    navigate(`/activity/${activity?.activityId}`);
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
                      {/* <DatePicker
            onChange={(_date, dateString) => {
              if (typeof dateString === "string" && dateString) {
                // Use moment to parse and format the date
                const dateObject = moment(dateString, "YYYY-MM-DD HH:mm A");
                if (dateObject.isValid()) {
                  // Format date as ISO string
                  const isoString = dateObject.toISOString();
                  // Dispatch your action with the formatted date
                  dispatch(
                    handleInputChangeReducerActivity({
                      startDate: isoString,
                    })
                  );
                }
              }
            }}
            showTime={{ format: "HH:mm A", minuteStep: 30 }}
            // format="YYYY-MM-DD hh:mm A"
          /> */}
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
                      {/* <DatePicker
            onChange={(_date, dateString) => {
              if (typeof dateString === "string" && dateString) {
                // Use moment to parse and format the date
                const dateObject = moment(dateString, "YYYY-MM-DD HH:mm A");
                if (dateObject.isValid()) {
                  // Format date as ISO string
                  const isoString = dateObject.toISOString();
                  // Dispatch your action with the formatted date
                  dispatch(
                    handleInputChangeReducerActivity({
                      dueDate: isoString,
                    })
                  );
                }
              }
            }}
            showTime={{ format: "HH:mm A", minuteStep: 5 }}
            format="YYYY-MM-DD HH:mm A"
          /> */}
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
      <div className="relatedListViewBackWrapper">
        <div className="activitiesListToolbarWrapper">
          <div className="tableTitleIconWrapper">
            <img
              src={ACTIVITIES_ICON_ORANGE}
              alt="illustration"
              className="illustrationIcon"
            />
            Related Activities
            <Button onClick={showModal} className="addOpportunityModalBtn">
              New
            </Button>
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
              style={{ border: "1px solid var(--gray5)", padding: "2px 5px" }}
              value={params?.search}
            />
            <Button onClick={handleReset} className="resetFilterBtn">
              Reset filters
            </Button>
          </div>
        </div>
        <div style={{ height: "50vh" }}>
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
      </div>
    </>
  );
};

export default AllRelatedActivities;
