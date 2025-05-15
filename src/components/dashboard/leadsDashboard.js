import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "../../styles/dashboard/leadDashboard.css";
import { Button, DatePicker, Input, Popover, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { countryNames, leadSourceOptions, statusValuesArray, } from "../../utilities/common/dataArrays";
import dayjs from "dayjs";
import { DASHBOARD_FILTER_ICON, LEAD_DASH_FUNNEL, LEAD_DASH_KPI1, LEAD_DASH_KPI2, LEAD_DASH_KPI3, LEAD_DASH_KPI4, } from "../../utilities/common/imagesImports";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useNavigate } from "react-router-dom";
import { fetchAllDashboardLeads } from "../../redux/features/leadSlice";
import "chartjs-plugin-datalabels";
const { RangePicker } = DatePicker;
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid } from "@mui/x-data-grid";
import { setScreenWidth } from "../../redux/features/referralsSlice";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
const initialDashParams = {
    status: null || "",
    search: null || "",
    page: 1,
    limit: 10,
    filterParams: {
        country: [],
        state: "",
        city: "",
        leadSource: [],
        salesPerson: "",
        dateRange: { startDate: "", endDate: "" },
        estimatedRevenue: { startPrice: "", endPrice: "" },
    },
};
const LeadsDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [dashParams, setDashParams] = useState(initialDashParams);
    const { dashboardLeadsAllData, dashboardLeadsLoader, dashboardLeadsData } = useAppSelector((state) => state.leads);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const { salesPersonData } = useAppSelector((state) => state.organisations);
    const [showFilters, setShowFilters] = useState(true);
    useEffect(() => {
        if (screenWidth > 768) {
            setShowFilters(true);
        }
        else {
            setShowFilters(false);
        }
    }, [screenWidth]);
    const statusWiseData = dashboardLeadsAllData?.lead_percentage_status?.length > 0
        ? [
            dashboardLeadsAllData?.lead_percentage_status[0]?.percentage,
            dashboardLeadsAllData?.lead_percentage_status[1]?.percentage,
            dashboardLeadsAllData?.lead_percentage_status[3]?.percentage,
            dashboardLeadsAllData?.lead_percentage_status[2]?.percentage,
        ]
        : [0, 0, 0, 0];
    const doughnutChartData = {
        labels: ["New", "In Progress", "Qualified", "Closed"],
        datasets: [
            {
                labels: ["New", "In Progress", "Qualified", "Closed"],
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
    const [revenue, setRevenue] = useState({
        startPrice: "",
        endPrice: "",
    });
    const [openFilter, setOpenFilter] = useState(false); // State to manage select and dropdown visibility
    const rangePresets = [
        { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
        { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
        { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
        { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
        { label: "Last 180 Days", value: [dayjs().add(-180, "d"), dayjs()] },
        { label: "Last 1 Year", value: [dayjs().add(-365, "d"), dayjs()] },
    ];
    // Function to handle country filter change
    const handleDashboardFilterChange = (name, selectedThings) => {
        setDashParams({
            ...dashParams,
            filterParams: { ...dashParams.filterParams, [name]: selectedThings },
        });
    };
    const handleInputTextChange = (name, value) => {
        setRevenue({ ...revenue, [name]: value });
    };
    // LEADS PARAMS
    // Function to handle country filter change
    const onBoxClick = (lead) => {
        navigate(`/lead/${lead?.leadId}`);
    };
    const hyperlink = (id, link) => {
        navigate(`/${link}/${id}`);
    };
    const handleReset = () => {
        setDashParams(initialDashParams);
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
    const handleResetTable = () => {
        setDashParams({
            ...dashParams,
            filterParams: dashParams.filterParams,
            search: "",
            status: "",
        });
    };
    const handleChangeRevenue = () => {
        setDashParams({
            ...dashParams,
            filterParams: {
                ...dashParams.filterParams,
                estimatedRevenue: revenue,
            },
        });
        setOpenFilter(false);
    };
    const onSearch = (value) => {
        setDashParams({ ...dashParams, search: value });
    };
    const columns = [
        {
            headerName: "FIRST NAME",
            field: "firstName",
            renderCell: (params) => (_jsx("div", { children: params?.row?.firstName || emptyValue })),
            width: 130,
        },
        {
            headerName: "LAST NAME",
            field: "lastName",
            renderCell: (params) => (_jsx("div", { children: params?.row?.lastName || emptyValue })),
            width: 130,
        },
        {
            headerName: "LEAD TITLE",
            field: "title",
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.title || emptyValue })),
            width: 150,
        },
        {
            headerName: "DESCRIPTION",
            field: "description",
            renderCell: (params) => (_jsx("div", { children: params?.row?.description || emptyValue })),
            width: 220,
        },
        {
            headerName: "PHONE",
            field: "phone",
            renderCell: (params) => (_jsx("div", { children: params?.row?.countryCode
                    ? params?.row?.countryCode + params?.row?.phone
                    : "" + params?.row?.phone || emptyValue })),
            width: 150,
        },
        {
            headerName: "EMAIL",
            field: "email",
            renderCell: (params) => (_jsx("div", { children: params?.row?.email || emptyValue })),
            width: 220,
        },
        {
            headerName: "COMPANY",
            field: "company",
            width: 220,
            renderCell: (params) => {
                const company = params?.row?.company;
                if (typeof company === "string") {
                    return (_jsx("div", { onClick: () => hyperlink(company.split("/").length > 0 ? company.split("/")[1] : "", "account"), className: "hyperlinkBlue", children: company.split("/").length > 0
                            ? company.split("/")[0]
                            : company || emptyValue }));
                }
                else {
                    return _jsx("div", { children: emptyValue });
                }
            },
        },
        {
            headerName: "CONTACT",
            field: "contact",
            width: 220,
            renderCell: (params) => {
                const contact = params?.row?.contact;
                if (typeof contact === "string") {
                    return (_jsx("div", { onClick: () => hyperlink(contact.split("/").length > 0 ? contact.split("/")[1] : "", "contact"), className: "hyperlinkBlue", children: contact.split("/").length > 0
                            ? contact.split("/")[0]
                            : contact || emptyValue }));
                }
                else {
                    return _jsx("div", { children: emptyValue });
                }
            },
        },
        {
            headerName: "COUNTRY",
            field: "country",
            renderCell: (params) => (_jsx("div", { children: params?.row?.country || emptyValue })),
            width: 150,
        },
        {
            headerName: "STATE",
            field: "state",
            renderCell: (params) => (_jsx("div", { children: params?.row?.state || emptyValue })),
            width: 150,
        },
        {
            headerName: "CITY",
            field: "city",
            renderCell: (params) => (_jsx("div", { children: params?.row?.city || emptyValue })),
            width: 150,
        },
        {
            headerName: "LEAD SOURCE",
            field: "leadSource",
            renderCell: (params) => (_jsx("div", { children: params?.row?.leadSource || emptyValue })),
            width: 180,
        },
        {
            headerName: "RATING",
            field: "rating",
            renderCell: (params) => (_jsx("div", { children: params?.row?.rating || emptyValue })),
            width: 100,
        },
        {
            headerName: "CURRENCY",
            field: "currency",
            renderCell: (params) => (_jsx("div", { children: params?.row?.currency || emptyValue })),
            width: 100,
        },
        {
            headerName: "EST. REVENUE",
            field: "price",
            width: 150,
            renderCell: (params) => (_jsx("div", { children: parseFloat(params?.row?.price) || emptyValue })),
        },
        {
            headerName: "OWNER",
            field: "owner",
            width: 200,
            renderCell: (params) => (_jsx("div", { children: params?.row?.owner || emptyValue })),
        },
        {
            headerName: "STATUS",
            field: "status",
            renderCell: (params) => (_jsx("div", { children: params?.row?.status || emptyValue })),
            width: 120,
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
    const handleSelectChange = (name, value) => {
        setDashParams({
            ...dashParams,
            filterParams: { ...dashParams?.filterParams, [name]: value },
        });
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDashParams({
            ...dashParams,
            filterParams: { ...dashParams?.filterParams, [name]: value },
        });
    };
    const content = (_jsxs("div", { children: [_jsx(Input, { onChange: (e) => handleInputTextChange("startPrice", e.target.value), placeholder: "From..", name: "from", type: "number", defaultValue: dashParams?.filterParams?.estimatedRevenue?.startPrice || 0, style: { marginBottom: 8 } }), _jsx(Input, { onChange: (e) => handleInputTextChange("endPrice", e.target.value), placeholder: "To..", name: "to", type: "number", defaultValue: dashParams?.filterParams?.estimatedRevenue?.endPrice || 0, style: { marginBottom: 8 } }), _jsx(Button, { type: "primary", onClick: handleChangeRevenue, children: "Submit" })] }));
    useEffect(() => {
        dispatch(fetchAllDashboardLeads({
            ...dashParams,
            filterParams: {
                ...dashParams.filterParams,
                estimatedRevenue: {
                    ...dashParams?.filterParams.estimatedRevenue,
                    startPrice: dashParams?.filterParams?.estimatedRevenue?.startPrice === ""
                        ? "0"
                        : dashParams?.filterParams?.estimatedRevenue?.startPrice,
                },
            },
        }));
    }, [dashParams]);
    useEffect(() => {
        handleResizeWindow();
    }, [screenWidth]);
    useEffect(() => {
        dispatch(fetchAllSalesPersonByUserId());
    }, []);
    return (_jsxs("div", { className: "dashboardWrapper", children: [screenWidth > 768 ? (_jsxs(_Fragment, { children: [" ", _jsxs("div", { className: "leadDash1WrapperGlobal", children: [_jsx(Select, { className: "dashboardSelect", showSearch: true, mode: "multiple", placeholder: "search country", options: countryNames, value: dashParams?.filterParams?.country, onChange: (selectedThings) => handleDashboardFilterChange("country", selectedThings) }), _jsx(Input, { className: "dashboardSelect", placeholder: "search state", name: "state", onChange: handleInputChange, value: dashParams?.filterParams?.state }), _jsx(Input, { className: "dashboardSelect", placeholder: "search city", name: "city", onChange: handleInputChange, value: dashParams?.filterParams?.city }), _jsx(Select, { className: "dashboardSelect", showSearch: true, mode: "multiple", placeholder: "search lead source", options: leadSourceOptions, value: dashParams?.filterParams?.leadSource, onChange: (selectedThings) => handleDashboardFilterChange("leadSource", selectedThings) }), _jsx(Select, { className: "dashboardSelect", placeholder: "search sales person", showSearch: true, value: dashParams?.filterParams?.salesPerson || "search sales person", onChange: (value) => handleSelectChange("salesPerson", value), children: salesPersonData?.map((item, index) => {
                                    return (_jsx(_Fragment, { children: _jsxs(Select.Option, { value: `${item?.firstName} ${item?.lastName}`, children: [item.firstName, " ", item?.lastName] }, index) }));
                                }) }), _jsx(RangePicker, { className: "dashboardSelectDateRange", presets: rangePresets, onChange: (_dates, dateStrings) => {
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
                                } }), _jsx("div", { children: _jsx(Popover, { content: content, title: "Filter Estimated Revenue", trigger: "click", open: openFilter, onOpenChange: setOpenFilter, children: _jsx("div", { className: "dashboardEstRevenueWrapper", children: _jsx("div", { className: "displayFlexRow", children: "Est. Revenue" }) }) }) }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "dashboardHeader", children: [_jsx("div", { children: "Dashboard" }), _jsx("img", { src: DASHBOARD_FILTER_ICON, onClick: () => setShowFilters(!showFilters), alt: "icon", className: "cursorPointer" })] }), _jsx("div", { className: "leadDash1WrapperGlobal", children: showFilters && (_jsxs("div", { className: "filtersContainer", children: [_jsx(Select, { className: "dashboardSelect", showSearch: true, mode: "multiple", placeholder: "search country", options: countryNames, value: dashParams?.filterParams?.country, onChange: (selectedThings) => handleDashboardFilterChange("country", selectedThings) }), _jsx(Input, { className: "dashboardSelect", placeholder: "search state", name: "state", onChange: handleInputChange, value: dashParams?.filterParams?.state }), _jsx(Input, { className: "dashboardSelect", placeholder: "search city", name: "city", onChange: handleInputChange, value: dashParams?.filterParams?.city }), _jsx(Select, { className: "dashboardSelect", showSearch: true, mode: "multiple", placeholder: "search lead source", options: leadSourceOptions, value: dashParams?.filterParams?.leadSource, onChange: (selectedThings) => handleDashboardFilterChange("leadSource", selectedThings) }), _jsx(Select, { className: "dashboardSelect", placeholder: "search sales person", showSearch: true, value: dashParams?.filterParams?.salesPerson ||
                                        "search sales person", onChange: (value) => handleSelectChange("salesPerson", value), children: salesPersonData?.map((item, index) => {
                                        return (_jsx(_Fragment, { children: _jsxs(Select.Option, { value: `${item?.firstName} ${item?.lastName}`, children: [item.firstName, " ", item?.lastName] }, index) }));
                                    }) }), _jsx(RangePicker, { className: "dashboardSelectDateRange", presets: rangePresets, onChange: (_dates, dateStrings) => {
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
                                    } }), _jsx(Popover, { content: content, title: "Filter Estimated Revenue", trigger: "click", open: openFilter, onOpenChange: setOpenFilter, children: _jsx("div", { className: "dashboardEstRevenueWrapper", children: _jsx("div", { className: "displayFlexRow", children: "Est. Revenue" }) }) }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" })] })) })] })), _jsx("div", { children: _jsx(Spin, { spinning: dashboardLeadsLoader, tip: "Loading...", children: _jsxs("div", { children: [_jsxs("div", { className: "leadDash2Wrapper", children: [_jsx("div", { className: "leadDashTableTitle", children: "Analytics" }), _jsxs("div", { className: "leadKPIWrapper", children: [_jsxs("div", { className: "leadKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI1, alt: "icon" }), _jsxs("div", { children: [_jsx("div", { className: "leadDashboardKPI", children: "Total No. of Leads" }), _jsx("div", { className: "leadDashboardKPIData", children: dashboardLeadsAllData?.total_no_of_leads || 0 })] })] }), _jsxs("div", { className: "leadKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI2, alt: "icon" }), _jsxs("div", { children: [_jsx("div", { className: "leadDashboardKPI", children: "Qualification Rate" }), _jsx("div", { className: "leadDashboardKPIData", children: dashboardLeadsAllData?.lead_qualific_rate != null
                                                                    ? `${(dashboardLeadsAllData?.lead_qualific_rate * 100).toFixed(2)} %`
                                                                    : "0 %" })] })] }), _jsxs("div", { className: "leadKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI3, alt: "icon" }), _jsxs("div", { children: [_jsx("div", { className: "leadDashboardKPI", children: "Avg. Deal Size" }), _jsx("div", { className: "leadDashboardKPIData", children: dashboardLeadsAllData?.avg_lead_size
                                                                    ?.toFixed(2)
                                                                    .toLocaleString() || 0 })] })] }), _jsxs("div", { className: "leadKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI4, alt: "icon" }), _jsxs("div", { children: [_jsx("div", { className: "leadDashboardKPI", children: "Est. Revenue" }), _jsx("div", { className: "leadDashboardKPIData", children: dashboardLeadsAllData?.revenue || 0 })] })] })] })] }), _jsxs("div", { className: "leadDash3Wrapper", children: [_jsxs("div", { className: "leadDashFunnelWrapper", children: [_jsx("div", { className: "pipelineTitle", children: "Pipeline" }), _jsxs("div", { className: "leadDashFunnelDataWrapper", children: [_jsxs("div", { className: "leadDashFunnelData1", children: [_jsx("div", { className: "leadDashboardBox1", children: "New" }), _jsx("div", { className: "leadDashboardBox2", children: dashboardLeadsAllData?.lead_count_status?.length > 0
                                                                    ? dashboardLeadsAllData?.lead_count_status[0]?.count
                                                                    : 0 })] }), _jsxs("div", { className: "leadDashFunnelData1", children: [_jsx("div", { className: "leadDashboardBox1", children: "In Progress" }), _jsx("div", { className: "leadDashboardBox2", children: dashboardLeadsAllData?.lead_count_status?.length > 0
                                                                    ? dashboardLeadsAllData?.lead_count_status[1]?.count
                                                                    : 0 })] }), _jsxs("div", { className: "leadDashFunnelData1", children: [_jsx("div", { className: "leadDashboardBox1", children: "Qualified" }), _jsx("div", { className: "leadDashboardBox2", children: dashboardLeadsAllData?.lead_count_status?.length > 0
                                                                    ? dashboardLeadsAllData?.lead_count_status[3]?.count
                                                                    : 0 })] }), _jsxs("div", { className: "leadDashFunnelData1", children: [_jsx("div", { className: "leadDashboardBox1", children: "Closed" }), _jsx("div", { className: "leadDashboardBox2", children: dashboardLeadsAllData?.lead_count_status?.length > 0
                                                                    ? dashboardLeadsAllData?.lead_count_status[2]?.count
                                                                    : 0 })] })] }), _jsx("img", { src: LEAD_DASH_FUNNEL, alt: "leads-funnel", className: "leadDashboardFunnelImg" }), _jsxs("div", { className: "leadDashFunnelDataWrapper2", children: [_jsx("div", { className: "leadDashboardBox2", children: dashboardLeadsAllData?.lead_percentage_status?.length > 0
                                                            ? `${dashboardLeadsAllData?.lead_percentage_status[0]?.percentage} %`
                                                            : "0%" }), _jsx("div", { className: "leadDashboardBox2", children: dashboardLeadsAllData?.lead_percentage_status?.length > 0
                                                            ? `${dashboardLeadsAllData?.lead_percentage_status[1]?.percentage} %`
                                                            : "0%" }), _jsx("div", { className: "leadDashboardBox2", children: dashboardLeadsAllData?.lead_percentage_status?.length > 0
                                                            ? `${dashboardLeadsAllData?.lead_percentage_status[3]?.percentage} %`
                                                            : "0%" }), _jsx("div", { className: "leadDashboardBox2", children: dashboardLeadsAllData?.lead_percentage_status?.length > 0
                                                            ? `${dashboardLeadsAllData?.lead_percentage_status[2]?.percentage} %`
                                                            : "0%" })] })] }), _jsx("div", { className: "leadDashPieWrapper", children: _jsx(Doughnut, { data: doughnutChartData, options: options }) })] }), _jsxs("div", { className: "leadDash4Wrapper", children: [_jsxs("div", { className: "leadDashTableToolbarWrapper", children: [_jsxs("div", { className: "leadDashTableWrapper", children: [_jsx("div", { className: "leadDashTableTitle", children: "Top Leads" }), _jsxs("div", { className: "filterSelectWrapper1", children: [_jsx(Select, { placeholder: "Search here for Stage..", onChange: (value) => {
                                                                    setDashParams({ ...dashParams, status: value });
                                                                }, options: statusValuesArray }), _jsx(Button, { onClick: handleResetTable, className: "resetFilterBtn", children: "Reset filters" })] })] }), _jsx("div", { className: "filterSelectWrapper1", children: _jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), value: dashParams?.search }) })] }), _jsx("div", { style: { height: "40vh" }, children: _jsx(DataGrid, { rows: dashboardLeadsData?.map((item) => {
                                                return {
                                                    ...item, price: parseFloat(item?.price)
                                                };
                                            }), loading: dashboardLeadsLoader, getRowId: (row) => row?.leadId, columns: columns, pageSizeOptions: [5, 10, 20, 25] }, "leadId") })] })] }) }) })] }));
};
export default LeadsDashboard;
