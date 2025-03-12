import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Skeleton,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/accounts/accountsView.css";
import {
  activitiesRelatedViewOptions,
  activityPriorityOptions,
  activityStatusOptions,
  activityTypeOptions,
} from "../../utilities/common/dataArrays";
import TextArea from "antd/es/input/TextArea";
import {
  ACTIVITY_LOG_ORANGE,
  DESCRIPTION_ICON_ORANGE,
  GENERAL_INFO_ICON_ORANGE,
  OWNER,
} from "../../utilities/common/imagesImports";
import {
  LeftOutlined,
  RightOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { handleBack } from "../../utilities/common/commonFunctions/handleBack";
import {
  getActivityById,
  handleInputChangeReducerActivity,
  setEditableMode,
  updateActivityById,
} from "../../redux/features/activitySlice";
import dayjs, { Dayjs } from "dayjs";
import AllRelatedNotes from "../notes/relatedNotesListView";

const OneActivityById: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  const { activity, addActivityLoader, getActivityLoader, editable } =
    useAppSelector((state: RootState) => state.activities);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);

  const [relatedView, setRelatedView] = useState<string>("SELECT");
  const activityId = params?.activityId;
  const OWNER_AVATAR = `${activity?.owner?.firstName
    ?.slice(0, 1)
    ?.toLocaleUpperCase()}
                          ${activity?.owner?.lastName
      ?.slice(0, 1)
      ?.toLocaleUpperCase()}`;

  const OWNER_NAME = `${activity?.owner?.firstName}
                          ${activity?.owner?.lastName}`;

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

  const handleSelectChangeView = (value: string) => {
    setRelatedView(value);
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
  const handleSubmit = async () => {
    if (editable) {
      await dispatch(updateActivityById(activity));
      await dispatch(getActivityById(activity?.activityId));
    } else {
      dispatch(setEditableMode(true));
    }
  };

  useEffect(() => {
    if (activityId) {
      dispatch(setEditableMode(false));
      dispatch(getActivityById(activityId));
    }
  }, [activityId]);

  useEffect(() => {
    form.setFieldsValue(activity);
  }, [activity]);

  return (
    <div className="oneAccountMainWrapper">
      {getActivityLoader ? (
        <>
          <Skeleton />
        </>
      ) : (
        <div
          className={
            editable ? "oneAccountViewWrapper" : "onceAccountViewWrapperNotEdit"
          }
        >
          <Form
            form={form}
            name="loginForm"
            onFinish={handleSubmit}
            initialValues={activity}
          >
            <div className="oneAccountTopToolbar1">
              <div className="opportunitysSelectViewWrapper">
                <div className="opportunitysSelectView1">
                  <LeftOutlined className="backArrow" onClick={handleBack} />
                  <div className="opportunitysViewTitle">Activities</div>
                  <RightOutlined />
                  <div className="opportunitysViewTitle">
                    {activity?.subject || ""}
                  </div>
                </div>
                <div className="opportunitysSelectView1">
                  <Select
                    autoFocus
                    value={relatedView}
                    onChange={handleSelectChangeView}
                    style={{
                      border: "1px solid var(--gray5)",
                      borderRadius: "4px",
                      width: "160px",
                    }}
                  >
                    {activitiesRelatedViewOptions?.map((option, index) => (
                      <Select.Option key={index} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                  <Form.Item className="addAccountSubmitBtnWrapper">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="accountEditBtn"
                      loading={addActivityLoader}
                      disabled={relatedView !== "SELECT"}
                    >
                      {screenWidth < 768 ? (
                        editable ? (
                          <Tooltip title={"Update Activity"}>
                            <CheckCircleOutlined />
                          </Tooltip>
                        ) : (
                          <Tooltip title={"Save Changes"}>
                            <EditOutlined />
                          </Tooltip>
                        )
                      ) : editable ? (
                        "Save Changes"
                      ) : (
                        "Edit"
                      )}
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </div>
            {relatedView !== "SELECT" ? (
              <div className="updateAccountDiv">
                <div className="contactEditFormDiv">
                  <div className="updateAccountDivCol">
                    <div className="addOpportunitySubTitle">
                      <div className="illustrationIconWrapper">
                        <img
                          src={GENERAL_INFO_ICON_ORANGE}
                          alt="illustration"
                          className="illustrationIcon"
                        />
                      </div>
                      General Information
                    </div>
                    <div className="updateAccountFlex">
                      <Form.Item
                        name="activityType"
                        label="Type"
                        className="addAccountFormInput"
                        style={{ width: "230px" }}
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
                          disabled={!editable}
                        />
                      </Form.Item>
                      <Form.Item
                        name="subject"
                        label="Subject"
                        style={{ width: "230px" }}
                        className="addOpportunityFormInput"
                        rules={[
                          {
                            required: false,
                            message: "This field is mandatory!",
                          },
                        ]}
                      >
                        <Input
                          onChange={handleInputChange}
                          name="subject"
                          type="string"
                          placeholder="Please enter here"
                          readOnly={!editable}
                        />
                      </Form.Item>
                      <Form.Item
                        name="activityStatus"
                        label="Status"
                        style={{ width: "230px" }}
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
                          disabled={!editable}
                        />
                      </Form.Item>
                      <Form.Item
                        name="activityPriority"
                        label="Priority"
                        style={{ width: "230px" }}
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
                          defaultValue={"High"}
                          disabled={!editable}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="accountInfo1">
                    <div className="opportunityInfo1CompanyNameLabel">
                      <img
                        src={OWNER}
                        alt="illustration"
                        className="illustrationIcon"
                      />
                      Owner
                    </div>
                    <div className="accountOwnerDiv">
                      <Avatar>{OWNER_AVATAR}</Avatar>
                      <p className="accountInfo1CompanyName">{OWNER_NAME}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {relatedView === "NOTES" ? (
              <>
                <AllRelatedNotes
                  moduleName={"activity"}
                  moduleId={activity?.activityId}
                />
              </>
            ) : (
              <div>
                <div className="updateAccountDiv">
                  <div className="updateOpportunityOwnerDiv">
                    <div className="opportunityEditFormDiv">
                      <div className="updateAccountDivCol">
                        <div className="addOpportunitySubTitle">
                          <div className="illustrationIconWrapper">
                            <img
                              src={GENERAL_INFO_ICON_ORANGE}
                              alt="illustration"
                              className="illustrationIcon"
                            />
                          </div>
                          General Information
                        </div>
                        <div className="updateAccountFlex">
                          <Form.Item
                            name="activityType"
                            label="Type"
                            className="addAccountFormInput"
                            style={{ width: "230px" }}
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
                              disabled={!editable}
                            />
                          </Form.Item>
                          <Form.Item
                            name="subject"
                            label="Subject"
                            style={{ width: "230px" }}
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
                              readOnly={!editable}
                            />
                          </Form.Item>
                          <Form.Item
                            name="activityStatus"
                            label="Status"
                            style={{ width: "230px" }}
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
                              disabled={!editable}
                            />
                          </Form.Item>
                          <Form.Item
                            name="activityPriority"
                            label="Priority"
                            style={{ width: "230px" }}
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
                              defaultValue={"High"}
                              disabled={!editable}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="accountInfo1">
                        <div className="opportunityInfo1CompanyNameLabel">
                          <img
                            src={OWNER}
                            alt="illustration"
                            className="illustrationIcon"
                          />
                          Owner
                        </div>
                        <div className="accountOwnerDiv">
                          <Avatar>{OWNER_AVATAR}</Avatar>
                          <p className="accountInfo1CompanyName">
                            {OWNER_NAME}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="updateAccountDivCol">
                      <div className="addOpportunitySubTitle">
                        <div className="illustrationIconWrapper">
                          <img
                            src={ACTIVITY_LOG_ORANGE}
                            alt="illustration"
                            className="illustrationIcon"
                          />
                        </div>
                        Timeline
                      </div>
                      <div className="updateAccountFlex">
                        <Form.Item
                          // name="startDate"
                          label="Start Date"
                          className="addOpportunityFormInput"
                          style={{ width: "230px" }}
                          rules={[
                            {
                              required: false,
                              message: "This field is mandatory!",
                            },
                          ]}
                        >
                          <DatePicker
                            value={
                              activity?.startDate
                                ? dayjs(activity?.startDate)
                                : undefined
                            }
                            disabled={!editable}
                            onChange={handleStartDateChange}
                            showTime={{ format: "HH:mm A", minuteStep: 15 }}
                            format="YYYY-MM-DD hh:mm A"
                            disabledDate={disabledStartDate}
                          />
                        </Form.Item>
                        <Form.Item
                          // name="dueDate"
                          label="Due Date"
                          style={{ width: "230px" }}
                          className="addOpportunityFormInput"
                          rules={[
                            {
                              required: false,
                              message: "This field is mandatory!",
                            },
                            { validator: validateEndDateTime },
                          ]}
                        >
                          <DatePicker
                            value={
                              activity?.dueDate
                                ? dayjs(activity?.dueDate)
                                : undefined
                            }
                            disabled={!editable}
                            onChange={handleEndDateChange}
                            showTime={{ format: "HH:mm A", minuteStep: 15 }}
                            format="YYYY-MM-DD hh:mm A"
                            disabledDate={disabledEndDate}
                          />
                        </Form.Item>
                        <Form.Item
                          // name="actualStartDate"
                          label="Actual Start Sate"

                          className="addOpportunityFormInput"
                          style={{ width: "230px" }}
                          rules={[
                            {
                              required: false,
                              message: "This field is mandatory!",
                            },
                          ]}
                        >
                          <DatePicker
                            value={
                              activity?.actualStartDate
                                ? dayjs(activity?.actualStartDate)
                                : undefined
                            }
                            disabled={!editable}
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
                                  console.error(
                                    "Invalid date string:",
                                    dateString
                                  );
                                }
                              }
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          // name="actualEndDate"
                          label="Actual End Date"
                          style={{ width: "230px" }}
                          className="addOpportunityFormInput"
                          rules={[
                            {
                              required: false,
                              message: "This field is mandatory!",
                            },
                          ]}
                        >
                          <DatePicker
                            value={
                              activity?.actualEndDate
                                ? dayjs(activity?.actualEndDate)
                                : undefined
                            }
                            disabled={!editable}
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
                                  console.error(
                                    "Invalid date string:",
                                    dateString
                                  );
                                }
                              }
                            }}
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="updateAccountDivCol">
                      <div className="addOpportunitySubTitle">
                        <div className="illustrationIconWrapper">
                          <img
                            src={DESCRIPTION_ICON_ORANGE}
                            alt="illustration"
                            className="illustrationIcon"
                          />
                        </div>
                        Description
                      </div>
                      <div className="updateAccountFlex">
                        <Form.Item
                          name="description"
                          label="Notes"
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
                            // placeholder="Please enter here"
                            readOnly={!editable}
                            maxLength={499}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Form>
        </div>
      )}
    </div>
  );
};

export default OneActivityById;
