import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, Button, DatePicker, Form, Input, Select, Skeleton, Tooltip, } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/accounts/accountsView.css";
import { activitiesRelatedViewOptions, activityPriorityOptions, activityStatusOptions, activityTypeOptions, } from "../../utilities/common/dataArrays";
import TextArea from "antd/es/input/TextArea";
import { ACTIVITY_LOG_ORANGE, DESCRIPTION_ICON_ORANGE, GENERAL_INFO_ICON_ORANGE, OWNER, } from "../../utilities/common/imagesImports";
import { LeftOutlined, RightOutlined, EditOutlined, CheckCircleOutlined, } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { handleBack } from "../../utilities/common/commonFunctions/handleBack";
import { getActivityById, handleInputChangeReducerActivity, setEditableMode, updateActivityById, } from "../../redux/features/activitySlice";
import dayjs from "dayjs";
import AllRelatedNotes from "../notes/relatedNotesListView";
const OneActivityById = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const [form] = Form.useForm();
    const [startDate, setStartDate] = useState(null);
    const { activity, addActivityLoader, getActivityLoader, editable } = useAppSelector((state) => state.activities);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const [relatedView, setRelatedView] = useState("SELECT");
    const activityId = params?.activityId;
    const OWNER_AVATAR = `${activity?.owner?.firstName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}
                          ${activity?.owner?.lastName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}`;
    const OWNER_NAME = `${activity?.owner?.firstName}
                          ${activity?.owner?.lastName}`;
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerActivity({
            [name]: value,
        }));
    };
    const handleSelectChange = (value, name) => {
        dispatch(handleInputChangeReducerActivity({
            [name]: value,
        }));
    };
    const handleSelectChangeView = (value) => {
        setRelatedView(value);
    };
    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (date) {
            dispatch(handleInputChangeReducerActivity({ startDate: date }));
        }
        form.validateFields(["dueDate"]);
    };
    const handleEndDateChange = (date) => {
        if (date) {
            dispatch(handleInputChangeReducerActivity({ dueDate: date }));
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
    const handleSubmit = async () => {
        if (editable) {
            await dispatch(updateActivityById(activity));
            await dispatch(getActivityById(activity?.activityId));
        }
        else {
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
    return (_jsx("div", { className: "oneAccountMainWrapper", children: getActivityLoader ? (_jsx(_Fragment, { children: _jsx(Skeleton, {}) })) : (_jsx("div", { className: editable ? "oneAccountViewWrapper" : "onceAccountViewWrapperNotEdit", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, initialValues: activity, children: [_jsx("div", { className: "oneAccountTopToolbar1", children: _jsxs("div", { className: "opportunitysSelectViewWrapper", children: [_jsxs("div", { className: "opportunitysSelectView1", children: [_jsx(LeftOutlined, { className: "backArrow", onClick: handleBack }), _jsx("div", { className: "opportunitysViewTitle", children: "Activities" }), _jsx(RightOutlined, {}), _jsx("div", { className: "opportunitysViewTitle", children: activity?.subject || "" })] }), _jsxs("div", { className: "opportunitysSelectView1", children: [_jsx(Select, { autoFocus: true, value: relatedView, onChange: handleSelectChangeView, style: {
                                                border: "1px solid var(--gray5)",
                                                borderRadius: "4px",
                                                width: "160px",
                                            }, children: activitiesRelatedViewOptions?.map((option, index) => (_jsx(Select.Option, { value: option.value, children: option.label }, index))) }), _jsx(Form.Item, { className: "addAccountSubmitBtnWrapper", children: _jsx(Button, { type: "primary", htmlType: "submit", className: "accountEditBtn", loading: addActivityLoader, disabled: relatedView !== "SELECT", children: screenWidth < 768 ? (editable ? (_jsx(Tooltip, { title: "Update Activity", children: _jsx(CheckCircleOutlined, {}) })) : (_jsx(Tooltip, { title: "Save Changes", children: _jsx(EditOutlined, {}) }))) : editable ? ("Save Changes") : ("Edit") }) })] })] }) }), relatedView !== "SELECT" ? (_jsx("div", { className: "updateAccountDiv", children: _jsxs("div", { className: "contactEditFormDiv", children: [_jsxs("div", { className: "updateAccountDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: GENERAL_INFO_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "General Information"] }), _jsxs("div", { className: "updateAccountFlex", children: [_jsx(Form.Item, { name: "activityType", label: "Type", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                        {
                                                            required: false,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "activityType"), options: activityTypeOptions, disabled: !editable }) }), _jsx(Form.Item, { name: "subject", label: "Subject", style: { width: "230px" }, className: "addOpportunityFormInput", rules: [
                                                        {
                                                            required: false,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "subject", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "activityStatus", label: "Status", style: { width: "230px" }, className: "addOpportunityFormInput", rules: [
                                                        {
                                                            required: false,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "activityStatus"), options: activityStatusOptions, defaultValue: "Open", disabled: !editable }) }), _jsx(Form.Item, { name: "activityPriority", label: "Priority", style: { width: "230px" }, className: "addOpportunityFormInput", rules: [
                                                        {
                                                            required: false,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "activityPriority"), options: activityPriorityOptions, defaultValue: "High", disabled: !editable }) })] })] }), _jsxs("div", { className: "accountInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "accountOwnerDiv", children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx("p", { className: "accountInfo1CompanyName", children: OWNER_NAME })] })] })] }) })) : null, relatedView === "NOTES" ? (_jsx(_Fragment, { children: _jsx(AllRelatedNotes, { moduleName: "activity", moduleId: activity?.activityId }) })) : (_jsx("div", { children: _jsx("div", { className: "updateAccountDiv", children: _jsxs("div", { className: "updateOpportunityOwnerDiv", children: [_jsxs("div", { className: "opportunityEditFormDiv", children: [_jsxs("div", { className: "updateAccountDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: GENERAL_INFO_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "General Information"] }), _jsxs("div", { className: "updateAccountFlex", children: [_jsx(Form.Item, { name: "activityType", label: "Type", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "activityType"), options: activityTypeOptions, disabled: !editable }) }), _jsx(Form.Item, { name: "subject", label: "Subject", style: { width: "230px" }, className: "addOpportunityFormInput", rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "subject", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "activityStatus", label: "Status", style: { width: "230px" }, className: "addOpportunityFormInput", rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "activityStatus"), options: activityStatusOptions, defaultValue: "Open", disabled: !editable }) }), _jsx(Form.Item, { name: "activityPriority", label: "Priority", style: { width: "230px" }, className: "addOpportunityFormInput", rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "activityPriority"), options: activityPriorityOptions, defaultValue: "High", disabled: !editable }) })] })] }), _jsxs("div", { className: "accountInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "accountOwnerDiv", children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx("p", { className: "accountInfo1CompanyName", children: OWNER_NAME })] })] })] }), _jsxs("div", { className: "updateAccountDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: ACTIVITY_LOG_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "Timeline"] }), _jsxs("div", { className: "updateAccountFlex", children: [_jsx(Form.Item
                                                    // name="startDate"
                                                    , { 
                                                        // name="startDate"
                                                        label: "Start Date", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(DatePicker, { value: activity?.startDate
                                                                ? dayjs(activity?.startDate)
                                                                : undefined, disabled: !editable, onChange: handleStartDateChange, showTime: { format: "HH:mm A", minuteStep: 15 }, format: "YYYY-MM-DD hh:mm A", disabledDate: disabledStartDate }) }), _jsx(Form.Item
                                                    // name="dueDate"
                                                    , { 
                                                        // name="dueDate"
                                                        label: "Due Date", style: { width: "230px" }, className: "addOpportunityFormInput", rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                            { validator: validateEndDateTime },
                                                        ], children: _jsx(DatePicker, { value: activity?.dueDate
                                                                ? dayjs(activity?.dueDate)
                                                                : undefined, disabled: !editable, onChange: handleEndDateChange, showTime: { format: "HH:mm A", minuteStep: 15 }, format: "YYYY-MM-DD hh:mm A", disabledDate: disabledEndDate }) }), _jsx(Form.Item
                                                    // name="actualStartDate"
                                                    , { 
                                                        // name="actualStartDate"
                                                        label: "Actual Start Sate", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(DatePicker, { value: activity?.actualStartDate
                                                                ? dayjs(activity?.actualStartDate)
                                                                : undefined, disabled: !editable, onChange: (_date, dateString) => {
                                                                // Ensure dateString is a string before converting to Date
                                                                if (typeof dateString === "string") {
                                                                    const dateObject = new Date(dateString);
                                                                    if (!isNaN(dateObject.getTime())) {
                                                                        // Check if dateObject is valid
                                                                        dispatch(handleInputChangeReducerActivity({
                                                                            actualStartDate: dateObject.toISOString(),
                                                                        }));
                                                                    }
                                                                    else {
                                                                        console.error("Invalid date string:", dateString);
                                                                    }
                                                                }
                                                            } }) }), _jsx(Form.Item
                                                    // name="actualEndDate"
                                                    , { 
                                                        // name="actualEndDate"
                                                        label: "Actual End Date", style: { width: "230px" }, className: "addOpportunityFormInput", rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(DatePicker, { value: activity?.actualEndDate
                                                                ? dayjs(activity?.actualEndDate)
                                                                : undefined, disabled: !editable, onChange: (_date, dateString) => {
                                                                // Ensure dateString is a string before converting to Date
                                                                if (typeof dateString === "string") {
                                                                    const dateObject = new Date(dateString);
                                                                    if (!isNaN(dateObject.getTime())) {
                                                                        // Check if dateObject is valid
                                                                        dispatch(handleInputChangeReducerActivity({
                                                                            actualEndDate: dateObject.toISOString(),
                                                                        }));
                                                                    }
                                                                    else {
                                                                        console.error("Invalid date string:", dateString);
                                                                    }
                                                                }
                                                            } }) })] })] }), _jsxs("div", { className: "updateAccountDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: DESCRIPTION_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "Description"] }), _jsx("div", { className: "updateAccountFlex", children: _jsx(Form.Item, { name: "description", label: "Notes", className: "addActivityFormInput", style: { width: "100%" }, rules: [
                                                        {
                                                            required: false,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(TextArea, { onChange: handleInputChange, name: "description", 
                                                        // placeholder="Please enter here"
                                                        readOnly: !editable, maxLength: 499 }) }) })] })] }) }) }))] }) })) }));
};
export default OneActivityById;
