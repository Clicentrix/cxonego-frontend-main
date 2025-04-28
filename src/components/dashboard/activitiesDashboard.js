import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import "../../styles/dashboard/activityDashboard.css";
import { Button, DatePicker, Input, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { activityPriorityOptions, activityStatusOptions, activityTypeOptions, } from "../../utilities/common/dataArrays";
import dayjs from "dayjs";
import { DASHBOARD_FILTER_ICON, LEAD_DASH_KPI1, LEAD_DASH_KPI2, LEAD_DASH_KPI3, } from "../../utilities/common/imagesImports";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "chartjs-plugin-datalabels";
const { RangePicker } = DatePicker;
import { fetchAllDashboardActivities } from "../../redux/features/activitySlice";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid } from "@mui/x-data-grid";
import { setScreenWidth } from "../../redux/features/referralsSlice";
import moment from "moment";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
const initialDashParams = {
    search: null || "",
    page: 1,
    limit: 10,
    filterParams: {
        dateRange: { startDate: "", endDate: "" },
        activityStatus: [],
        activityType: [],
        activityPriority: [],
    },
};
const ActivitiesDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [dashParams, setDashParams] = useState(initialDashParams);
    const { dashboardActivitiesAllData, dashboardActivitiesLoader, dashboardActivityData, } = useAppSelector((state) => state.activities);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const [showFilters, setShowFilters] = useState(true);
    useEffect(() => {
        if (screenWidth > 768) {
            setShowFilters(true);
        }
        else {
            setShowFilters(false);
        }
    }, [screenWidth]);
    const statusWiseData = dashboardActivitiesAllData?.activity_type_percentage?.length > 0
        ? [
            dashboardActivitiesAllData?.activity_type_percentage[0]?.percentage,
            dashboardActivitiesAllData?.activity_type_percentage[1]?.percentage,
            dashboardActivitiesAllData?.activity_type_percentage[2]?.percentage,
            dashboardActivitiesAllData?.activity_type_percentage[3]?.percentage,
            dashboardActivitiesAllData?.activity_type_percentage[4]?.percentage,
            dashboardActivitiesAllData?.activity_type_percentage[5]?.percentage,
        ]
        : [0, 0, 0, 0, 0, 0];
    const doughnutChartData = {
        labels: [
            "Appointment",
            "Task",
            "Phone call outbound",
            "Email outbound",
            "SMS outbound",
            "Whatsapp outbound",
            "Meeting",
            "Documentation",
            "Data Entry",
        ],
        datasets: [
            {
                labels: [
                    "Appointment",
                    "Task",
                    "Phone call outbound",
                    "Email outbound",
                    "SMS outbound",
                    "Whatsapp outbound",
                    "Meeting",
                    "Documentation",
                    "Data Entry",
                ],
                data: statusWiseData,
                backgroundColor: [
                    "#FFA500",
                    "#D3D3D3",
                    "#808080",
                    "#ADD8E6",
                    "#90EE90",
                    "#D8BFD8",
                ],
                hoverOffset: 10,
                // hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
        ],
    };
    const options = {
        plugins: {
            datalabels: {
                display: true, // Disable datalabels plugin to avoid duplicate labels
            },
        },
        legend: {
            display: true, // Disable legend to avoid duplicate legend
        },
    };
    const rangePresets = [
        { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
        { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
        { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
        { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
        { label: "Last 180 Days", value: [dayjs().add(-180, "d"), dayjs()] },
        { label: "Last 1 Year", value: [dayjs().add(-365, "d"), dayjs()] },
    ];
    const data = {
        labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        datasets: [
            {
                label: "Open",
                backgroundColor: "rgba(75, 192, 192, 0.7)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                data: [
                    dashboardActivitiesAllData?.activity_status_count_month_wise[0]
                        ?.counts?.Open,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[1]
                        ?.counts?.Open,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[2]
                        ?.counts?.Open,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[3]
                        ?.counts?.Open,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[4]
                        ?.counts?.Open,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[5]
                        ?.counts?.Open,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[6]
                        ?.counts?.Open,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[7]
                        ?.counts?.Open,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[8]
                        ?.counts?.Open,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[9]
                        ?.counts?.Open,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[10]
                        ?.counts?.Open,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[11]
                        ?.counts?.Open,
                ],
            },
            {
                label: "In Progress",
                backgroundColor: "rgba(255, 99, 132, 0.7)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                data: [
                    dashboardActivitiesAllData?.activity_status_count_month_wise[0]
                        ?.counts?.IN_PROGRESS,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[1]
                        ?.counts?.IN_PROGRESS,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[2]
                        ?.counts?.IN_PROGRESS,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[3]
                        ?.counts?.IN_PROGRESS,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[4]
                        ?.counts?.IN_PROGRESS,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[5]
                        ?.counts?.IN_PROGRESS,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[6]
                        ?.counts?.IN_PROGRESS,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[7]
                        ?.counts?.IN_PROGRESS,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[8]
                        ?.counts?.IN_PROGRESS,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[9]
                        ?.counts?.IN_PROGRESS,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[10]
                        ?.counts?.IN_PROGRESS,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[11]
                        ?.counts?.IN_PROGRESS,
                ],
            },
            {
                label: "Completed",
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                data: [
                    dashboardActivitiesAllData?.activity_status_count_month_wise[0]
                        ?.counts?.Completed,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[1]
                        ?.counts?.Completed,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[2]
                        ?.counts?.Completed,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[3]
                        ?.counts?.Completed,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[4]
                        ?.counts?.Completed,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[5]
                        ?.counts?.Completed,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[6]
                        ?.counts?.Completed,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[7]
                        ?.counts?.Completed,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[8]
                        ?.counts?.Completed,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[9]
                        ?.counts?.Completed,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[10]
                        ?.counts?.Completed,
                    dashboardActivitiesAllData?.activity_status_count_month_wise[11]
                        ?.counts?.Completed,
                ],
            },
        ],
    };
    const handleResizeWindow = () => {
        const handleResize = () => {
            dispatch(setScreenWidth(window?.innerWidth));
        };
        window?.addEventListener("resize", handleResize);
        return () => {
            window?.removeEventListener("resize", handleResize);
        };
    };
    const onBoxClick = (activity) => {
        navigate(`/activity/${activity?.activityId}`);
    };
    // Function to handle country filter change
    const handleDashboardFilterChange = (name, selectedThings) => {
        setDashParams({
            ...dashParams,
            filterParams: { ...dashParams.filterParams, [name]: selectedThings },
        });
    };
    // LEADS PARAMS
    // Function to handle country filter change
    // const onBoxClick = (activity: Activity) => {
    //   navigate(`/activity/${activity?.activityId}`);
    // };
    const handleReset = () => {
        setDashParams(initialDashParams);
    };
    const handleResetTable = () => {
        setDashParams({
            ...dashParams,
            filterParams: dashParams.filterParams,
            search: "",
        });
    };
    const onSearch = (value) => {
        setDashParams({ ...dashParams, search: value });
    };
    useEffect(() => {
        console.log("onSearch atributes", dashParams?.search);
    }, [dashParams]);
    const columns = [
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
    useEffect(() => {
        dispatch(fetchAllDashboardActivities(dashParams));
    }, [dashParams]);
    useEffect(() => {
        handleResizeWindow();
    }, [screenWidth]);
    return (_jsxs("div", { className: "dashboardWrapper", children: [screenWidth > 768 ? (_jsx(_Fragment, { children: _jsxs("div", { className: "leadDash1WrapperGlobal", children: [_jsx(Select, { mode: "multiple", showSearch: true, className: "dashboardSelect", placeholder: "search status", options: activityStatusOptions, value: dashParams?.filterParams?.activityStatus, onChange: (selectedThings) => handleDashboardFilterChange("activityStatus", selectedThings) }), _jsx(Select, { mode: "multiple", showSearch: true, className: "dashboardSelect", placeholder: "search type", options: activityTypeOptions, value: dashParams?.filterParams?.activityType, onChange: (selectedThings) => handleDashboardFilterChange("activityType", selectedThings) }), _jsx(Select, { mode: "multiple", showSearch: true, className: "dashboardSelect", placeholder: "search priority", options: activityPriorityOptions, value: dashParams?.filterParams?.activityPriority, onChange: (selectedThings) => handleDashboardFilterChange("activityPriority", selectedThings) }), _jsx(RangePicker, { className: "dashboardSelectDateRange", presets: rangePresets, onChange: (_dates, dateStrings) => {
                                if (setDashParams) {
                                    setDashParams({
                                        ...dashParams,
                                        filterParams: {
                                            ...dashParams.filterParams,
                                            dateRange: {
                                                startDate: new Date(dateStrings[0]).toISOString(),
                                                endDate: new Date(dateStrings[1]).toISOString(),
                                            },
                                        },
                                    });
                                }
                            } }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" })] }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "dashboardHeader", children: [_jsx("div", { children: "Dashboard" }), _jsx("img", { src: DASHBOARD_FILTER_ICON, onClick: () => setShowFilters(!showFilters), alt: "icon" })] }), _jsx("div", { className: "leadDash1WrapperGlobal", children: showFilters && (_jsxs("div", { className: "filtersContainer", children: [_jsx(Select, { mode: "multiple", showSearch: true, className: "dashboardSelect", placeholder: "search status", options: activityStatusOptions, value: dashParams?.filterParams?.activityStatus, onChange: (selectedThings) => handleDashboardFilterChange("activityStatus", selectedThings) }), _jsx(Select, { mode: "multiple", showSearch: true, className: "dashboardSelect", placeholder: "search type", options: activityTypeOptions, value: dashParams?.filterParams?.activityType, onChange: (selectedThings) => handleDashboardFilterChange("activityType", selectedThings) }), _jsx(Select, { mode: "multiple", showSearch: true, className: "dashboardSelect", placeholder: "search priority", options: activityPriorityOptions, value: dashParams?.filterParams?.activityPriority, onChange: (selectedThings) => handleDashboardFilterChange("activityPriority", selectedThings) }), _jsx(RangePicker, { className: "dashboardSelectDateRange", presets: rangePresets, onChange: (_dates, dateStrings) => {
                                        if (setDashParams) {
                                            setDashParams({
                                                ...dashParams,
                                                filterParams: {
                                                    ...dashParams.filterParams,
                                                    dateRange: {
                                                        startDate: new Date(dateStrings[0]).toISOString(),
                                                        endDate: new Date(dateStrings[1]).toISOString(),
                                                    },
                                                },
                                            });
                                        }
                                    } }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" })] })) })] })), _jsx("div", { children: _jsx(Spin, { spinning: dashboardActivitiesLoader, tip: "Loading...", children: _jsxs("div", { children: [_jsxs("div", { className: "activityDash2Wrapper", children: [_jsx("div", { className: "activityDashTableTitle", children: "Analytics" }), _jsxs("div", { className: "activityKPIWrapper", children: [_jsxs("div", { className: "activityKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI1, alt: "icon" }), _jsxs("div", { children: [_jsx("div", { className: "activityDashboardKPI", children: "Total No. of Activities" }), _jsx("div", { className: "activityDashboardKPIData", children: dashboardActivitiesAllData?.total_activities || 0 })] })] }), _jsxs("div", { className: "activityKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI2, alt: "icon" }), _jsxs("div", { children: [_jsx("div", { className: "activityDashboardKPI", children: "Total No. of Open Activities" }), _jsx("div", { className: "activityDashboardKPIData", children: dashboardActivitiesAllData?.total_open_activities || 0 })] })] }), _jsxs("div", { className: "activityKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI2, alt: "icon" }), _jsxs("div", { children: [_jsx("div", { className: "activityDashboardKPI", children: "Total No. of In Progress Activities" }), _jsx("div", { className: "activityDashboardKPIData", children: dashboardActivitiesAllData?.total_inprogress_activities || 0 })] })] }), _jsxs("div", { className: "activityKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI3, alt: "icon" }), _jsxs("div", { children: [_jsxs("div", { className: "activityDashboardKPI", children: [" ", "Total No. of Closed Activities"] }), _jsx("div", { className: "activityDashboardKPIData", children: dashboardActivitiesAllData?.total_closed_activities || 0 })] })] })] })] }), _jsxs("div", { className: "activityDash3Wrapper", children: [_jsx("div", { className: "activityDashBarWrapper", children: _jsx(Bar, { data: data, options: {
                                                responsive: true,
                                                maintainAspectRatio: false,
                                            } }) }), _jsx("div", { className: "activityDashPieWrapper", children: _jsx(Doughnut, { data: doughnutChartData, options: options }) })] }), _jsxs("div", { className: "activityDash4Wrapper", children: [_jsxs("div", { className: "activityDashTableToolbarWrapper", children: [_jsx("div", { className: "activityDashTableWrapper", children: _jsx("div", { className: "activityDashTableTitle", children: "Top Activities" }) }), _jsxs("div", { className: "filterSelectWrapper1", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), value: dashParams?.search }), _jsx(Button, { onClick: handleResetTable, className: "resetFilterBtn", children: "Reset filters" })] })] }), _jsx("div", { style: { height: "40vh" }, children: _jsx(DataGrid, { rows: dashboardActivityData, loading: dashboardActivitiesLoader, getRowId: (row) => row?.activityId, columns: columns }, "activityId") })] })] }) }) })] }));
};
export default ActivitiesDashboard;
