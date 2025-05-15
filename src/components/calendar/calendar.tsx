// Functionality Imports
// UI imports
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
// import Loader from "react-loader-spinner";
// import Skeleton from "react-loading-skeleton";

const localizer = momentLocalizer(moment);
// CSS imports
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../styles/calendar/calendar.css";
import {
  createAndGetAllAppointments,
  deleteAppointsByIdAndGetAllAppointmentsTotal,
  fetchAllAppointments,
  fetchAllOrgsPeople,
  resetAppointment,
  updateAppointmentById,
  updateAppointmentByIdAndGetAllAppointments,
} from "../../redux/features/calendarSlice";
import { Appointment } from "../../utilities/common/exportDataTypes/calendarDataTypes";
// import dayjs from "dayjs";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { CALENDAR_ICON_ORANGE, OWNER } from "../../utilities/common/imagesImports";
// import CustomToolbar from "../../utilities/common/customToolbar";
// import { HeaderProps, NavigateAction } from "react-big-calendar";

// interface CustomToolbarProps extends HeaderProps {
//   date: Date;
//   onNavigate?: (action: NavigateAction, newDate: Date) => void;
//   onView?: (view: string) => void;
//   label: string;
// }
import {
  Avatar,
  Button,
  DatePicker,
  Dropdown,
  Flex,
  Form,
  Input,
  InputRef,
  Menu,
  Modal,
  Popconfirm,
  Popover,
  Select,
  Spin,
  Tag,
  Tooltip,
  theme,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import {
  getAppointmentById,
  handleInputChangeReducerAppointment,
} from "../../redux/features/calendarSlice";
import { fetchAllContactsWithoutParams } from "../../redux/features/contactsSlice";
import TextArea from "antd/es/input/TextArea";
import dayjs, { Dayjs } from "dayjs";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";

const tagInputStyle: React.CSSProperties = {
  width: "100%",
  height: 30,
  marginInlineEnd: 8,
  verticalAlign: "top",
};

function CalendarComponent() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const {
    loading,
    addAppointmentLoader,
    appointment,
    getAppointmentLoader,
    getAppointmentByIdLoader,
    appointments,
  } = useAppSelector((state: RootState) => state.appointments);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");


  const { orgPeople } = useAppSelector(
    (state: RootState) => state.appointments
  );

  const { token } = theme.useToken();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  const [ownerId, setOwnerId] = useState<string>("")
  const [popconfirmVisible, setPopconfirmVisible] = useState<boolean>(false);
  const { salesPersonData } = useAppSelector(
    (state: RootState) => state.organisations
  );

  const OWNER_AVATAR = `${appointment?.orgnizerId?.firstName
    ?.slice(0, 1)
    ?.toLocaleUpperCase()}
                          ${appointment?.orgnizerId?.lastName
      ?.slice(0, 1)
      ?.toLocaleUpperCase()}`;

  const OWNER_NAME = `${appointment?.orgnizerId?.firstName}
                          ${appointment?.orgnizerId?.lastName}`;

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const confirmChange = async () => {
    await dispatch(
      updateAppointmentById({ ...appointment, orgnizerId: { userId: ownerId } })
    );
    await dispatch(getAppointmentById(appointment?.appointmentId))
    await setPopconfirmVisible(false);
  };

  const cancelChange = async () => {
    await setPopconfirmVisible(false);
    await setIsModalOpen(false);
  };
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
    dispatch(
      handleInputChangeReducerAppointment({
        participentEmailId: appointment?.participentEmailId.filter(
          (email) => email !== removedTag
        ),
      })
    );
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChangeTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      const newTags = [...tags, inputValue];
      setTags(newTags);
      dispatch(
        handleInputChangeReducerAppointment({
          participentEmailId: newTags,
        })
      );
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(handleInputChangeReducerAppointment({ [name]: value }));
  };

  const orgPeopleOptions = orgPeople?.map((item) => ({
    ...item,
    value: item?.userId,
    label: `${item?.firstName} ${item?.lastName}`,
  }));

  const handleCountryFilterChange = (
    name: string,
    selectedThings: string[]
  ) => {
    const newSelection = selectedThings.filter(
      (item) => !appointment?.participentEmailId.includes(item)
    );

    dispatch(
      handleInputChangeReducerAppointment({
        [name]: [...appointment?.participentEmailId, ...newSelection],
      })
    );
  };

  const handleDeselect = (deselectedEmail: string) => {
    dispatch(
      handleInputChangeReducerAppointment({
        participentEmailId: appointment?.participentEmailId.filter(
          (email) => email !== deselectedEmail
        ),
      })
    );
  };

  useEffect(() => {
    dispatch(fetchAllContactsWithoutParams());
    dispatch(fetchAllOrgsPeople());
    dispatch(fetchAllAppointments());
    dispatch(fetchAllSalesPersonByUserId());
  }, []);

  useEffect(() => {
    setTags(appointment?.participentEmailId || []);
    if (appointment?.startDateTime) {
      setStartDate(dayjs(appointment.startDateTime));
    }
    form.setFieldsValue({
      ...appointment,
      startDateTime: appointment?.startDateTime
        ? dayjs(appointment?.startDateTime)
        : dayjs(),
      endDateTime: appointment?.endDateTime
        ? dayjs(appointment?.endDateTime)
        : dayjs(),
    });
  }, [appointment]);

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
    console.log("Start DateTime old", date);
    if (date) {
      dispatch(handleInputChangeReducerAppointment({ startDateTime: date }));
    }
    form.validateFields(["endDateTime"]);
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    if (date) {
      dispatch(handleInputChangeReducerAppointment({ endDateTime: date }));
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

  const showModal = async (value: string, appointment: Appointment) => {
    await form.resetFields();
    await setIsModalOpen(true);
    if (value === "new") {
      await dispatch(resetAppointment());
    } else {
      await dispatch(getAppointmentById(appointment?.appointmentId));
    }
  };

  const handleCancel = async () => {
    await dispatch(resetAppointment());
    await form.resetFields();
    await setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (appointment?.appointmentId) {
      await dispatch(updateAppointmentByIdAndGetAllAppointments(appointment));
      await setIsModalOpen(false);
      // form.resetFields();
      dispatch(resetAppointment());
      // setAppointmentFormatted(emptyAppointment);
    } else {
      await dispatch(createAndGetAllAppointments(appointment));
      await setIsModalOpen(false);
      form.resetFields();
      dispatch(resetAppointment());
    }
  };

  console.log("appointment all", appointment)

  const appointmentsNew = appointments?.map((item: Appointment) => {
    return {
      ...item,
      startDateTime: new Date(item.startDateTime as string | number | Date),
      endDateTime: new Date(item.endDateTime as string | number | Date),
    };
  });

  const formatStartTime = (slotInfo: any) => {
    const startDateTime = slotInfo.start;

    // Set end time to 30 minutes later
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);
    dispatch(
      handleInputChangeReducerAppointment({
        startDateTime: startDateTime,
        endDateTime: endDateTime,
      })
    );
    // Log the times or set the state as needed
    console.log("Start DateTime:", startDateTime);
    console.log("End DateTime:", endDateTime);
    setIsModalOpen(true);
  };

  const handleDelete = async (appointmentId: string) => {
    // Implement logic to delete the event with appointmentId
    await setSelectedAppointmentId("");
    await dispatch(deleteAppointsByIdAndGetAllAppointmentsTotal(appointmentId));
    // Close the modal after deletion if needed
    // setSelectedEvent(null);
  };

  const handleMenuClick = (appointment: Appointment) => {
    // Handle edit action
    // setSelectedEvent(appointment); // Set selected appointment ID for popove
    setSelectedAppointmentId(
      appointment?.appointmentId ? appointment?.appointmentId : ""
    );
  };
  const handleCancelPopover = () => {
    // setSelectedEvent(null);
    setSelectedAppointmentId("");
  };

  const EventComponent = (event: any) => {
    const menu = (
      <Menu onClick={() => handleMenuClick(event?.event)}>
        <Menu.Item key="delete" danger>
          Delete
        </Menu.Item>
      </Menu>
    );

    const content = (
      <div>
        <p>Are you sure you want to delete this event?</p>
        <Button
          style={{ marginRight: "10px" }}
          onClick={() => {
            handleDelete(event?.event?.appointmentId);
          }}
          danger
          loading={loading}
        >
          Delete
        </Button>
        <Button onClick={handleCancelPopover}>Cancel</Button>
      </div>
    );

    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          borderLeft: "6px solid var(--calendar-bar-color)",
        }}
      >
        {/* <div className="calendarEventBar"></div> */}
        <div className="eventTitle">{event.title}</div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-2px",
              cursor: "pointer",
            }}
            onClick={(e) => e.stopPropagation()} // To prevent event propagation
          >
            <MoreOutlined className="calendarEventMore" />
          </span>
        </Dropdown>

        <Popover
          content={content}
          trigger="click"
          open={selectedAppointmentId === event?.event?.appointmentId} // Show popover only for the selected appointment
        // onOpenChange={(open) => {
        //   if (!open) {
        //     setSelectedAppointmentId(""); // Reset selected appointment if popover is closed
        //   }
        // }}
        />
      </div>
    );
  };

  const updateMedia = () => {
    setIsMobile(window.innerWidth <= 600);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  return (
    <>
      <div className="addAppointmentModalWrapper">
        <Modal
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="addAppointmentFormDiv">
            <div className="addAppointmentFormWrapper">
              <Form
                form={form}
                name="loginForm"
                onFinish={handleSubmit}
                initialValues={appointment}
              >
                <Spin tip="Loading..." spinning={getAppointmentByIdLoader}>
                  <div className="appointmentAddForm">
                    <div className="addOpportunitySubTitle">
                      Schedule an Appointment
                    </div>
                    <div className="oppoAddFormGrid">
                      <Form.Item
                        name="title"
                        label="Title"
                        className="addAccountFormInput"
                        rules={[
                          {
                            required: true,
                            message: "This field is mandatory!",
                          },
                        ]}
                      >
                        <Input
                          onChange={handleInputChange}
                          name="title"
                          type="string"
                          placeholder="Please enter here"
                        />
                      </Form.Item>
                      <Form.Item
                        name="agenda"
                        label="Agenda"
                        className="addAccountFormInput"
                        rules={[
                          {
                            required: false,
                            message: "This field is mandatory!",
                          },
                        ]}
                      >
                        <Input
                          onChange={handleInputChange}
                          name="agenda"
                          type="string"
                          placeholder="Please enter here"
                        />
                      </Form.Item>
                    </div>
                    <div className="oppoAddFormGrid">
                      <Form.Item
                        name="startDateTime"
                        label="From"
                        className="addAccountFormInput"
                        rules={[
                          {
                            required: true,
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
                      <Form.Item
                        name="endDateTime"
                        label="To"
                        className="addAccountFormInput"
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
                    <Form.Item
                      name="participentEmailId"
                      label="Attendees"
                      className="addReferralFormInput"
                      rules={[
                        {
                          required: false,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Select
                        onChange={(selectedThings: string[]) =>
                          handleCountryFilterChange(
                            "participentEmailId",
                            selectedThings
                          )
                        }
                        mode="multiple"
                        showSearch
                        onDeselect={(deselectedEmail: string) =>
                          handleDeselect(deselectedEmail)
                        }
                      >
                        {orgPeopleOptions.map((item, index) => (
                          <Select.Option key={index} value={item?.email}>
                            {item?.firstName} {item?.lastName}
                          </Select.Option>
                        ))}
                      </Select>
                      <div className="appointmentTagWrapper">
                        <div className="marginBottom20">Selected Attendees</div>
                        <Flex gap="4px 0">
                          {tags?.map<React.ReactNode>((tag, index) => {
                            if (editInputIndex === index) {
                              return (
                                <Form.Item
                                  name="email"
                                  label="Email"
                                  className="addContactFormInput"
                                  style={{ width: "170px" }}
                                  rules={[
                                    {
                                      type: "email",
                                      message: "The input is not valid E-mail!",
                                    },
                                    {
                                      required: true,
                                      message: "Please input your E-mail!",
                                    },
                                  ]}
                                >
                                  <Input
                                    ref={editInputRef}
                                    key={tag}
                                    type="email"
                                    size="small"
                                    style={tagInputStyle}
                                    value={editInputValue}
                                    onChange={handleEditInputChange}
                                    onBlur={handleEditInputConfirm}
                                    onPressEnter={handleEditInputConfirm}
                                  />
                                </Form.Item>
                              );
                            }
                            const isLongTag = tag?.length > 40;
                            const tagElem = (
                              <Tag
                                key={tag}
                                closable
                                style={{ userSelect: "none" }}
                                onClose={() => handleClose(tag)}
                              >
                                <span
                                  onDoubleClick={(e) => {
                                    if (index !== 0) {
                                      setEditInputIndex(index);
                                      setEditInputValue(tag);
                                      e.preventDefault();
                                    }
                                  }}
                                >
                                  {isLongTag ? `${tag.slice(0, 40)}...` : tag}
                                </span>
                              </Tag>
                            );
                            return isLongTag ? (
                              <Tooltip title={tag} key={tag}>
                                {tagElem}
                              </Tooltip>
                            ) : (
                              tagElem
                            );
                          })}
                          {inputVisible ? (
                            <Input
                              ref={inputRef}
                              type="text"
                              style={tagInputStyle}
                              value={inputValue}
                              onChange={handleInputChangeTag}
                              onBlur={handleInputConfirm}
                              onPressEnter={handleInputConfirm}
                            />
                          ) : (
                            <Tag
                              style={tagPlusStyle}
                              icon={<PlusOutlined />}
                              onClick={showInput}
                            >
                              Add Email
                            </Tag>
                          )}
                        </Flex>
                      </div>
                    </Form.Item>
                    <Form.Item
                      name="Notes"
                      label="Note"
                      className="addAccountFormInput"
                    >
                      <TextArea
                        onChange={handleInputChange}
                        name="Notes"
                        placeholder="Please enter here"
                        maxLength={499}
                      />
                    </Form.Item>
                  </div>
                  {appointment?.appointmentId ?
                    <div>
                      <div className="opportunityInfo1CompanyNameLabel">
                        <img
                          src={OWNER}
                          alt="illustration"
                          className="illustrationIcon"
                        />
                        Owner
                      </div>
                      <div className="accountOwnerDiv" style={{ marginTop: "20px" }}>
                        <Avatar>{OWNER_AVATAR}</Avatar>
                        {/* <p className="accountInfo1CompanyName">
                            {OWNER_NAME}
                          </p> */}
                        <Popconfirm
                          title="Are you sure you want to change the owner of this record?"
                          open={popconfirmVisible}
                          onConfirm={confirmChange}
                          onCancel={cancelChange}
                          okText="Yes"
                          cancelText="No"
                        >

                          <Select
                            className="dashboardSelect"
                            placeholder="search sales person"
                            showSearch
                            style={{ width: "200px" }}
                            value={
                              OWNER_NAME
                            }
                            onChange={(value: string) => {
                              setOwnerId(value)
                              setPopconfirmVisible(true);
                            }
                            }
                            filterOption={(input, option) => {
                              // Convert option's children to a string, handle cases where it's not a string
                              const optionText =
                                typeof option?.props.children === "string"
                                  ? option.props.children
                                  : Array.isArray(option?.props.children)
                                    ? option.props.children.join("")
                                    : "";

                              return optionText
                                .toLowerCase()
                                .includes(input.toLowerCase());
                            }}
                          >
                            {salesPersonData?.map((item, index) => {
                              return (
                                <>
                                  <Select.Option
                                    key={index}
                                    value={item?.userId}
                                  >
                                    {item.firstName} {item?.lastName}
                                  </Select.Option>
                                </>
                              );
                            })}
                          </Select>
                        </Popconfirm>
                      </div>
                    </div> : <></>}
                </Spin>
                <Form.Item className="addLeadSubmitBtnWrapper">
                  <Button onClick={handleCancel} className="addLeadCancelBtn">
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="addLeadSubmitBtn"
                    loading={addAppointmentLoader}
                  >
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Modal>
      </div>
      <div className="calendarBackWrapper">
        <div className="appointmentsListToolbarWrapper">
          <div className="tableTitleIconWrapper">
            <img
              src={CALENDAR_ICON_ORANGE}
              alt="illustration"
              className="illustrationIcon"
            />
            Calendar
            {screenWidth < 768 ? (
              <Tooltip title={"Add new activity"}>
                <PlusOutlined onClick={() => showModal("new", appointment)} />
              </Tooltip>
            ) : (
              <Button
                onClick={() => showModal("new", appointment)}
                className="addOpportunityModalBtn"
              >
                New
              </Button>
            )}
          </div>
        </div>
        <div className="calendarWrapper">
          <Spin tip="Loading..." spinning={getAppointmentLoader || loading}>
            <>
              <Calendar
                localizer={localizer}
                events={appointmentsNew}
                startAccessor="startDateTime"
                endAccessor="endDateTime"
                style={{ height: isMobile ? "auto" : 600 }}
                defaultView={isMobile ? "agenda" : "week"}
                views={
                  isMobile
                    ? ["agenda", "day"]
                    : ["agenda", "day", "month", "week"]
                }
                onSelectSlot={formatStartTime}
                selectable={true} // Make sure selectable is set to true
                onSelectEvent={(event) => showModal("edit", event)}
                // onClick={() => showModal("edit", event?.event)}
                components={{ event: EventComponent }}
              />
            </>
          </Spin>
        </div>
      </div>
    </>
  );
}

export default CalendarComponent;
