import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Input, Popconfirm, Form, Modal, Button, Skeleton, Tooltip, Tabs, Select, DatePicker, } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/activities/activitiesListView.css";
import "../../styles/oppotunities/opportunitiesListView.css";
import { TableOutlined, IdcardOutlined, PlusOutlined } from "@ant-design/icons";
import "../../styles/horizontalFunctions/filterDropdown.css";
import { useNavigate } from "react-router-dom";
import { createAndGetAllActivities, deleteActivitysByIdAndGetAllActivitiesTotal, fetchAllActivities, handleInputChangeReducerActivity, resetActivities, resetActivity, } from "../../redux/features/activitySlice";
import ActivitiesKanban from "./activitiesKanbanView";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid, } from "@mui/x-data-grid";
import { ACTIVITIES_ICON_ORANGE } from "../../utilities/common/imagesImports";
import TextArea from "antd/es/input/TextArea";
import { activityPriorityOptions, activityStatusOptions, activityTypeOptions, } from "../../utilities/common/dataArrays";
import dayjs from "dayjs";
import { getUserById } from "../../redux/features/authenticationSlice";
import moment from "moment";
const AllActivitiesView = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { activity, activities, loading, addActivityLoader, getActivityLoader, totalActivities } = useAppSelector((state) => state.activities);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const { user } = useAppSelector((state) => state.authentication);
    const [view, setView] = useState("list");
    const initialParams = {
        page: 1,
        limit: 10,
        search: "",
        view: "myView",
    };
    const [params, setParams] = useState(initialParams);
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const onTabChange = (key) => {
        setParams({ ...params, view: key });
    };
    const handleDelete = () => {
        dispatch(deleteActivitysByIdAndGetAllActivitiesTotal(selectedRowKeys, params));
        setSelectedRowKeys([]);
    };
    const handleSubmit = async () => {
        await dispatch(createAndGetAllActivities(activity, params));
        await setIsModalOpen(false);
        form.resetFields();
    };
    const onSearch = (value) => {
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
    const onBoxClick = (activity) => {
        navigate(`/activity/${activity?.activityId}`);
    };
    const columns = [
        {
            headerName: "ACTIVITY NUMBER",
            field: "activityId",
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.activityId || emptyValue })),
            width: 160,
        },
        {
            headerName: "SUBJECT",
            field: "subject",
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.subject || emptyValue })),
            width: 160,
        },
        {
            headerName: "OWNER",
            field: "owner",
            width: 200,
            renderCell: (params) => (_jsx("div", { children: params?.row?.owner || emptyValue })),
        },
        {
            headerName: "TYPE",
            field: "activityType",
            renderCell: (params) => (_jsx("div", { children: params?.row?.activityType || emptyValue })),
            width: 150,
        },
        {
            headerName: "STATUS",
            field: "activityStatus",
            renderCell: (params) => (_jsx("div", { children: params?.row?.activityStatus || emptyValue })),
            width: 150,
        },
        {
            headerName: "PRIORITY",
            field: "activityPriority",
            renderCell: (params) => (_jsx("div", { children: params?.row?.activityPriority || emptyValue })),
            width: 100,
        },
        {
            headerName: "START DATE",
            field: "startDate",
            renderCell: (params) => (_jsx("div", { children: params?.row?.startDate
                    ? moment(params?.row?.startDate)?.format("MMMM Do YYYY, h:mm:ss a")
                    : emptyValue })),
            width: 210,
        },
        {
            headerName: "DUE DATE",
            field: "dueDate",
            renderCell: (params) => (_jsx("div", { children: params?.row?.dueDate
                    ? moment(params?.row?.dueDate)?.format("MMMM Do YYYY, h:mm:ss a")
                    : emptyValue })),
            width: 210,
        },
        {
            headerName: "ACTUAL START DATE",
            field: "actualStartDate",
            renderCell: (params) => (_jsx("div", { children: params?.row?.actualStartDate || emptyValue })),
            width: 210,
        },
        {
            headerName: "ACTUAL END DATE",
            field: "actualEndDate",
            renderCell: (params) => (_jsx("div", { children: params?.row?.actualEndDate || emptyValue })),
            width: 210,
        },
        {
            headerName: "DESCRIPTION",
            field: "description",
            renderCell: (params) => (_jsx("div", { children: params?.row?.description || emptyValue })),
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
    const handlePaginationChange = (paginationModel) => {
        setParams({
            ...params,
            page: paginationModel.page + 1,
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
    const onListClick = (value) => {
        setView(value);
    };
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
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "addActivityModalWrapper", children: _jsx(Modal, { open: isModalOpen, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addActivityFormDiv", children: [_jsx("div", { className: "addActivityTitle", children: "New Activity" }), _jsx("div", { className: "addActivityFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, children: [_jsxs("div", { children: [_jsxs("div", { className: "activitiesAddFormGrid", children: [_jsx(Form.Item, { name: "activityType", label: "Type", className: "addOpportunityFormInput", rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "activityType"), options: activityTypeOptions, defaultValue: "Task" }) }), _jsx(Form.Item, { name: "startDate", label: "Start Date", className: "addOpportunityFormInput", rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(DatePicker, { onChange: handleStartDateChange, showTime: { format: "HH:mm A", minuteStep: 15 }, format: "YYYY-MM-DD hh:mm A", disabledDate: disabledStartDate }) })] }), _jsxs("div", { className: "activitiesAddFormGrid", children: [_jsx(Form.Item, { name: "subject", label: "Subject", className: "addOpportunityFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "subject", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "dueDate", label: "Due Date", className: "addOpportunityFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                                { validator: validateEndDateTime },
                                                            ], children: _jsx(DatePicker, { onChange: handleEndDateChange, showTime: { format: "HH:mm A", minuteStep: 15 }, format: "YYYY-MM-DD hh:mm A", disabledDate: disabledEndDate }) })] }), _jsxs("div", { className: "activitiesAddFormGrid", children: [_jsx(Form.Item, { name: "activityStatus", label: "Status", className: "addOpportunityFormInput", rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "activityStatus"), options: activityStatusOptions, defaultValue: "Open" }) }), _jsx(Form.Item, { name: "activityPriority", label: "Priority", className: "addOpportunityFormInput", rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "activityPriority"), options: activityPriorityOptions, defaultValue: "Medium" }) })] }), _jsxs("div", { className: "activitiesAddFormGrid", children: [_jsx(Form.Item, { name: "actualStartDate", label: "Actual Start Sate", className: "addOpportunityFormInput", rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(DatePicker, { onChange: (_date, dateString) => {
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
                                                                } }) }), _jsx(Form.Item, { name: "actualEndDate", label: "Actual End Date", className: "addOpportunityFormInput", rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(DatePicker, { onChange: (_date, dateString) => {
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
                                                                } }) })] }), _jsx(Form.Item, { name: "description", label: "Description", className: "addActivityFormInput", style: { width: "100%" }, rules: [
                                                        {
                                                            required: false,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(TextArea, { onChange: handleInputChange, name: "description", placeholder: "Please enter here", maxLength: 499 }) })] }), _jsxs(Form.Item, { className: "addActivitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addActivityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addActivitySubmitBtn", loading: addActivityLoader, children: "Save" })] })] }) })] }) }) }), _jsxs("div", { className: "listViewBackWrapper", children: [_jsxs("div", { className: "activitiesListToolbarWrapper", children: [_jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx("img", { src: ACTIVITIES_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Activities", screenWidth < 768 ? (_jsx(Tooltip, { title: "Add new activity", children: _jsx(PlusOutlined, { onClick: showModal }) })) : (_jsx(Button, { onClick: showModal, className: "addOpportunityModalBtn", children: "New" }))] }), selectedRowKeys.length > 0 ? (_jsx("div", { className: "activityDeleteBottomBar", children: _jsx(Popconfirm, { title: "Delete the activity", description: "Are you sure you want to delete this record?", onConfirm: handleDelete, okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", danger: true, style: { marginLeft: "10px" }, children: "Delete selected" }) }) })) : null, _jsxs("div", { className: "opportunitiesSearchResetBar", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), value: params?.search }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" }), _jsx("div", { className: "opportunitiesSwitchDiv", children: view === "kanban" ? (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("list"), children: [_jsx(TableOutlined, {}), "List"] })) : (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("kanban"), children: [_jsx(IdcardOutlined, {}), "Kanban"] })) })] })] }), _jsxs(Tabs, { onChange: onTabChange, type: "card", children: [_jsx(Tabs.TabPane, { tab: "My Activities", children: view === "kanban" && loading ? (_jsx(Skeleton, {})) : activities?.length > 0 && view === "kanban" && !loading ? (_jsx(ActivitiesKanban, { params: params })) : view === "list" ? (_jsx("div", { className: "activitiesViewWapper", style: { height: "75vh" }, children: _jsx(DataGrid, { rows: activities, loading: loading || addActivityLoader || getActivityLoader, getRowId: (row) => row?.activityId, checkboxSelection: user?.role === "ADMIN" ? true : false, columns: columns, onRowSelectionModelChange: (newSelection) => {
                                            setSelectedRowKeys(newSelection);
                                        }, paginationMode: "server", initialState: {
                                            pagination: {
                                                paginationModel: {
                                                    pageSize: params.limit,
                                                    page: params.page - 1,
                                                },
                                            },
                                        }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalActivities > 0 ? totalActivities : 0 }, "activityId") })) : (_jsx("div", { children: "No Activities Found" })) }, "myView"), user?.role === "SALESPERSON" ? null : (_jsx(Tabs.TabPane, { tab: "All Activities", children: view === "kanban" && loading ? (_jsx(Skeleton, {})) : activities?.length > 0 && view === "kanban" && !loading ? (_jsx(ActivitiesKanban, { params: params })) : view === "list" ? (_jsx("div", { className: "activitiesViewWapper", style: { height: "75vh" }, children: _jsx(DataGrid, { rows: activities, loading: loading || addActivityLoader || getActivityLoader, getRowId: (row) => row?.activityId, checkboxSelection: user?.role === "ADMIN" ? true : false, columns: columns, onRowSelectionModelChange: (newSelection) => {
                                            setSelectedRowKeys(newSelection);
                                        }, paginationMode: "server", initialState: {
                                            pagination: {
                                                paginationModel: {
                                                    pageSize: params.limit,
                                                    page: params.page - 1,
                                                },
                                            },
                                        }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalActivities > 0 ? totalActivities : 0 }, "activityId") })) : (_jsx("div", { children: "No Activities Found" })) }, "myTeamView"))] })] })] }));
};
export default AllActivitiesView;
