import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
import { createAndGetAllAppointments, deleteAppointsByIdAndGetAllAppointmentsTotal, fetchAllAppointments, fetchAllOrgsPeople, resetAppointment, updateAppointmentById, updateAppointmentByIdAndGetAllAppointments, } from "../../redux/features/calendarSlice";
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
import { Avatar, Button, DatePicker, Dropdown, Flex, Form, Input, Menu, Modal, Popconfirm, Popover, Select, Spin, Tag, Tooltip, theme, } from "antd";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { getAppointmentById, handleInputChangeReducerAppointment, } from "../../redux/features/calendarSlice";
import { fetchAllContactsWithoutParams } from "../../redux/features/contactsSlice";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";
const tagInputStyle = {
    width: "100%",
    height: 30,
    marginInlineEnd: 8,
    verticalAlign: "top",
};
function CalendarComponent() {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const { loading, addAppointmentLoader, appointment, getAppointmentLoader, getAppointmentByIdLoader, appointments, } = useAppSelector((state) => state.appointments);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
    const { orgPeople } = useAppSelector((state) => state.appointments);
    const { token } = theme.useToken();
    const [tags, setTags] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState("");
    const inputRef = useRef(null);
    const editInputRef = useRef(null);
    const [startDate, setStartDate] = useState(null);
    const [ownerId, setOwnerId] = useState("");
    const [popconfirmVisible, setPopconfirmVisible] = useState(false);
    const { salesPersonData } = useAppSelector((state) => state.organisations);
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
        await dispatch(updateAppointmentById({ ...appointment, orgnizerId: { userId: ownerId } }));
        await dispatch(getAppointmentById(appointment?.appointmentId));
        await setPopconfirmVisible(false);
    };
    const cancelChange = async () => {
        await setPopconfirmVisible(false);
        await setIsModalOpen(false);
    };
    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
        dispatch(handleInputChangeReducerAppointment({
            participentEmailId: appointment?.participentEmailId.filter((email) => email !== removedTag),
        }));
    };
    const showInput = () => {
        setInputVisible(true);
    };
    const handleInputChangeTag = (e) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = () => {
        if (inputValue && !tags.includes(inputValue)) {
            const newTags = [...tags, inputValue];
            setTags(newTags);
            dispatch(handleInputChangeReducerAppointment({
                participentEmailId: newTags,
            }));
        }
        setInputVisible(false);
        setInputValue("");
    };
    const handleEditInputChange = (e) => {
        setEditInputValue(e.target.value);
    };
    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        setTags(newTags);
        setEditInputIndex(-1);
        setEditInputValue("");
    };
    const tagPlusStyle = {
        height: 22,
        background: token.colorBgContainer,
        borderStyle: "dashed",
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerAppointment({ [name]: value }));
    };
    const orgPeopleOptions = orgPeople?.map((item) => ({
        ...item,
        value: item?.userId,
        label: `${item?.firstName} ${item?.lastName}`,
    }));
    const handleCountryFilterChange = (name, selectedThings) => {
        const newSelection = selectedThings.filter((item) => !appointment?.participentEmailId.includes(item));
        dispatch(handleInputChangeReducerAppointment({
            [name]: [...appointment?.participentEmailId, ...newSelection],
        }));
    };
    const handleDeselect = (deselectedEmail) => {
        dispatch(handleInputChangeReducerAppointment({
            participentEmailId: appointment?.participentEmailId.filter((email) => email !== deselectedEmail),
        }));
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
    const handleStartDateChange = (date) => {
        setStartDate(date);
        console.log("Start DateTime old", date);
        if (date) {
            dispatch(handleInputChangeReducerAppointment({ startDateTime: date }));
        }
        form.validateFields(["endDateTime"]);
    };
    const handleEndDateChange = (date) => {
        if (date) {
            dispatch(handleInputChangeReducerAppointment({ endDateTime: date }));
        }
    };
    const disabledStartDate = (current) => {
        return current && current < dayjs().startOf("day");
    };
    const disabledEndDate = (current) => {
        return current && current < dayjs().startOf("day");
    };
    const validateEndDateTime = async (_, value) => {
        if (startDate && value && value.isBefore(startDate, "minute")) {
            return Promise.reject(new Error("End date and time should be after start date and time."));
        }
        return Promise.resolve();
    };
    const showModal = async (value, appointment) => {
        await form.resetFields();
        await setIsModalOpen(true);
        if (value === "new") {
            await dispatch(resetAppointment());
        }
        else {
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
        }
        else {
            await dispatch(createAndGetAllAppointments(appointment));
            await setIsModalOpen(false);
            form.resetFields();
            dispatch(resetAppointment());
        }
    };
    console.log("appointment all", appointment);
    const appointmentsNew = appointments?.map((item) => {
        return {
            ...item,
            startDateTime: new Date(item.startDateTime),
            endDateTime: new Date(item.endDateTime),
        };
    });
    const formatStartTime = (slotInfo) => {
        const startDateTime = slotInfo.start;
        // Set end time to 30 minutes later
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);
        dispatch(handleInputChangeReducerAppointment({
            startDateTime: startDateTime,
            endDateTime: endDateTime,
        }));
        // Log the times or set the state as needed
        console.log("Start DateTime:", startDateTime);
        console.log("End DateTime:", endDateTime);
        setIsModalOpen(true);
    };
    const handleDelete = async (appointmentId) => {
        // Implement logic to delete the event with appointmentId
        await setSelectedAppointmentId("");
        await dispatch(deleteAppointsByIdAndGetAllAppointmentsTotal(appointmentId));
        // Close the modal after deletion if needed
        // setSelectedEvent(null);
    };
    const handleMenuClick = (appointment) => {
        // Handle edit action
        // setSelectedEvent(appointment); // Set selected appointment ID for popove
        setSelectedAppointmentId(appointment?.appointmentId ? appointment?.appointmentId : "");
    };
    const handleCancelPopover = () => {
        // setSelectedEvent(null);
        setSelectedAppointmentId("");
    };
    const EventComponent = (event) => {
        const menu = (_jsx(Menu, { onClick: () => handleMenuClick(event?.event), children: _jsx(Menu.Item, { danger: true, children: "Delete" }, "delete") }));
        const content = (_jsxs("div", { children: [_jsx("p", { children: "Are you sure you want to delete this event?" }), _jsx(Button, { style: { marginRight: "10px" }, onClick: () => {
                        handleDelete(event?.event?.appointmentId);
                    }, danger: true, loading: loading, children: "Delete" }), _jsx(Button, { onClick: handleCancelPopover, children: "Cancel" })] }));
        return (_jsxs("div", { style: {
                position: "relative",
                height: "100%",
                borderLeft: "6px solid var(--calendar-bar-color)",
            }, children: [_jsx("div", { className: "eventTitle", children: event.title }), _jsx(Dropdown, { overlay: menu, trigger: ["click"], children: _jsx("span", { style: {
                            position: "absolute",
                            top: "-4px",
                            right: "-2px",
                            cursor: "pointer",
                        }, onClick: (e) => e.stopPropagation(), children: _jsx(MoreOutlined, { className: "calendarEventMore" }) }) }), _jsx(Popover, { content: content, trigger: "click", open: selectedAppointmentId === event?.event?.appointmentId })] }));
    };
    const updateMedia = () => {
        setIsMobile(window.innerWidth <= 600);
    };
    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "addAppointmentModalWrapper", children: _jsx(Modal, { open: isModalOpen, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsx("div", { className: "addAppointmentFormDiv", children: _jsx("div", { className: "addAppointmentFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, initialValues: appointment, children: [_jsxs(Spin, { tip: "Loading...", spinning: getAppointmentByIdLoader, children: [_jsxs("div", { className: "appointmentAddForm", children: [_jsx("div", { className: "addOpportunitySubTitle", children: "Schedule an Appointment" }), _jsxs("div", { className: "oppoAddFormGrid", children: [_jsx(Form.Item, { name: "title", label: "Title", className: "addAccountFormInput", rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "title", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "agenda", label: "Agenda", className: "addAccountFormInput", rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "agenda", type: "string", placeholder: "Please enter here" }) })] }), _jsxs("div", { className: "oppoAddFormGrid", children: [_jsx(Form.Item, { name: "startDateTime", label: "From", className: "addAccountFormInput", rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(DatePicker, { onChange: handleStartDateChange, showTime: { format: "HH:mm A", minuteStep: 15 }, format: "YYYY-MM-DD hh:mm A", disabledDate: disabledStartDate }) }), _jsx(Form.Item, { name: "endDateTime", label: "To", className: "addAccountFormInput", rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                    { validator: validateEndDateTime },
                                                                ], children: _jsx(DatePicker, { onChange: handleEndDateChange, showTime: { format: "HH:mm A", minuteStep: 15 }, format: "YYYY-MM-DD hh:mm A", disabledDate: disabledEndDate }) })] }), _jsxs(Form.Item, { name: "participentEmailId", label: "Attendees", className: "addReferralFormInput", rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: [_jsx(Select, { onChange: (selectedThings) => handleCountryFilterChange("participentEmailId", selectedThings), mode: "multiple", showSearch: true, onDeselect: (deselectedEmail) => handleDeselect(deselectedEmail), children: orgPeopleOptions.map((item, index) => (_jsxs(Select.Option, { value: item?.email, children: [item?.firstName, " ", item?.lastName] }, index))) }), _jsxs("div", { className: "appointmentTagWrapper", children: [_jsx("div", { className: "marginBottom20", children: "Selected Attendees" }), _jsxs(Flex, { gap: "4px 0", children: [tags?.map((tag, index) => {
                                                                                if (editInputIndex === index) {
                                                                                    return (_jsx(Form.Item, { name: "email", label: "Email", className: "addContactFormInput", style: { width: "170px" }, rules: [
                                                                                            {
                                                                                                type: "email",
                                                                                                message: "The input is not valid E-mail!",
                                                                                            },
                                                                                            {
                                                                                                required: true,
                                                                                                message: "Please input your E-mail!",
                                                                                            },
                                                                                        ], children: _jsx(Input, { ref: editInputRef, type: "email", size: "small", style: tagInputStyle, value: editInputValue, onChange: handleEditInputChange, onBlur: handleEditInputConfirm, onPressEnter: handleEditInputConfirm }, tag) }));
                                                                                }
                                                                                const isLongTag = tag?.length > 40;
                                                                                const tagElem = (_jsx(Tag, { closable: true, style: { userSelect: "none" }, onClose: () => handleClose(tag), children: _jsx("span", { onDoubleClick: (e) => {
                                                                                            if (index !== 0) {
                                                                                                setEditInputIndex(index);
                                                                                                setEditInputValue(tag);
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }, children: isLongTag ? `${tag.slice(0, 40)}...` : tag }) }, tag));
                                                                                return isLongTag ? (_jsx(Tooltip, { title: tag, children: tagElem }, tag)) : (tagElem);
                                                                            }), inputVisible ? (_jsx(Input, { ref: inputRef, type: "text", style: tagInputStyle, value: inputValue, onChange: handleInputChangeTag, onBlur: handleInputConfirm, onPressEnter: handleInputConfirm })) : (_jsx(Tag, { style: tagPlusStyle, icon: _jsx(PlusOutlined, {}), onClick: showInput, children: "Add Email" }))] })] })] }), _jsx(Form.Item, { name: "Notes", label: "Note", className: "addAccountFormInput", children: _jsx(TextArea, { onChange: handleInputChange, name: "Notes", placeholder: "Please enter here", maxLength: 499 }) })] }), appointment?.appointmentId ?
                                                _jsxs("div", { children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "accountOwnerDiv", style: { marginTop: "20px" }, children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx(Popconfirm, { title: "Are you sure you want to change the owner of this record?", open: popconfirmVisible, onConfirm: confirmChange, onCancel: cancelChange, okText: "Yes", cancelText: "No", children: _jsx(Select, { className: "dashboardSelect", placeholder: "search sales person", showSearch: true, style: { width: "200px" }, value: OWNER_NAME, onChange: (value) => {
                                                                            setOwnerId(value);
                                                                            setPopconfirmVisible(true);
                                                                        }, filterOption: (input, option) => {
                                                                            // Convert option's children to a string, handle cases where it's not a string
                                                                            const optionText = typeof option?.props.children === "string"
                                                                                ? option.props.children
                                                                                : Array.isArray(option?.props.children)
                                                                                    ? option.props.children.join("")
                                                                                    : "";
                                                                            return optionText
                                                                                .toLowerCase()
                                                                                .includes(input.toLowerCase());
                                                                        }, children: salesPersonData?.map((item, index) => {
                                                                            return (_jsx(_Fragment, { children: _jsxs(Select.Option, { value: item?.userId, children: [item.firstName, " ", item?.lastName] }, index) }));
                                                                        }) }) })] })] }) : _jsx(_Fragment, {})] }), _jsxs(Form.Item, { className: "addLeadSubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addLeadCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addLeadSubmitBtn", loading: addAppointmentLoader, children: "Save" })] })] }) }) }) }) }), _jsxs("div", { className: "calendarBackWrapper", children: [_jsx("div", { className: "appointmentsListToolbarWrapper", children: _jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx("img", { src: CALENDAR_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Calendar", screenWidth < 768 ? (_jsx(Tooltip, { title: "Add new activity", children: _jsx(PlusOutlined, { onClick: () => showModal("new", appointment) }) })) : (_jsx(Button, { onClick: () => showModal("new", appointment), className: "addOpportunityModalBtn", children: "New" }))] }) }), _jsx("div", { className: "calendarWrapper", children: _jsx(Spin, { tip: "Loading...", spinning: getAppointmentLoader || loading, children: _jsx(_Fragment, { children: _jsx(Calendar, { localizer: localizer, events: appointmentsNew, startAccessor: "startDateTime", endAccessor: "endDateTime", style: { height: isMobile ? "auto" : 600 }, defaultView: isMobile ? "agenda" : "week", views: isMobile
                                        ? ["agenda", "day"]
                                        : ["agenda", "day", "month", "week"], onSelectSlot: formatStartTime, selectable: true, onSelectEvent: (event) => showModal("edit", event), 
                                    // onClick={() => showModal("edit", event?.event)}
                                    components: { event: EventComponent } }) }) }) })] })] }));
}
export default CalendarComponent;
