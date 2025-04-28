import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import "../../styles/dashboard/opportunityDashboard.css";
import { Button, DatePicker, Input, Popover, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { currencyOptions, stagesOptions, } from "../../utilities/common/dataArrays";
import dayjs from "dayjs";
import { DASHBOARD_FILTER_ICON, LEAD_DASH_KPI1, LEAD_DASH_KPI2, LEAD_DASH_KPI3, LEAD_DASH_KPI4, OPPORTUNITIY_DASH_FUNNEL, } from "../../utilities/common/imagesImports";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useNavigate } from "react-router-dom";
import { fetchAllDashboardOpportunities } from "../../redux/features/opportunitiesSlice";
import { fetchAllContactsWithoutParams } from "../../redux/features/contactsSlice";
import { fetchAllAccountsWithoutParams } from "../../redux/features/accountsSlice";
const { RangePicker } = DatePicker;
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid } from "@mui/x-data-grid";
import { setScreenWidth } from "../../redux/features/referralsSlice";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";
import moment from "moment";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
const initialDashParams = {
    stage: null || "",
    search: null || "",
    page: 1,
    limit: 10,
    currency: "",
    filterParams: {
        salesPerson: "",
        dateRange: { startDate: "", endDate: "" },
        estimatedRevenue: { startPrice: "", endPrice: "" },
        wonReason: [],
        lostReason: [],
    },
};
const OpportunitiesDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [dashParams, setDashParams] = useState(initialDashParams);
    const { dashboardOpportunitiesAllData, dashboardOpportunitiesLoader, dashboardOpportunitiesData, } = useAppSelector((state) => state.opportunities);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const [showFilters, setShowFilters] = useState(true);
    const { salesPersonData } = useAppSelector((state) => state.organisations);
    const statusWiseData = dashboardOpportunitiesAllData?.opportunity_percentage_stage?.length > 0
        ? [
            dashboardOpportunitiesAllData?.opportunity_percentage_stage[0]
                ?.percentage,
            dashboardOpportunitiesAllData?.opportunity_percentage_stage[1]
                ?.percentage,
            dashboardOpportunitiesAllData?.opportunity_percentage_stage[2]
                ?.percentage,
            dashboardOpportunitiesAllData?.opportunity_percentage_stage[3]
                ?.percentage,
            dashboardOpportunitiesAllData?.opportunity_percentage_stage[4]
                ?.percentage,
            dashboardOpportunitiesAllData?.opportunity_percentage_stage[5]
                ?.percentage,
        ]
        : [0, 0, 0, 0];
    const doughnutChartData = {
        labels: [
            "Analysis",
            "Solutioning",
            "Proposal",
            "Negotiation",
            "Won",
            "Lost",
        ],
        datasets: [
            {
                labels: [
                    "Analysis",
                    "Solutioning",
                    "Proposal",
                    "Negotiation",
                    "Won",
                    "Lost",
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
            },
        ],
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
                label: "Oportunities By Month",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                data: [
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise
                        ?.january,
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise
                        ?.february,
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise
                        ?.march,
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise
                        ?.april,
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise?.may,
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise
                        ?.june,
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise
                        ?.july,
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise
                        ?.august,
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise
                        ?.september,
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise
                        ?.october,
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise
                        ?.november,
                    dashboardOpportunitiesAllData?.opportunity_est_revenue_monthwise
                        ?.december,
                ],
            },
        ],
    };
    // Function to handle country filter change
    // const handleDashboardFilterChange = (
    //   name: string,
    //   selectedThings: string[]
    // ) => {
    //   setDashParams({
    //     ...dashParams,
    //     filterParams: { ...dashParams.filterParams, [name]: selectedThings },
    //   });
    // };
    const handleResizeWindow = () => {
        const handleResize = () => {
            dispatch(setScreenWidth(window?.innerWidth));
        };
        window?.addEventListener("resize", handleResize);
        return () => {
            window?.removeEventListener("resize", handleResize);
        };
    };
    const handleSelectChange = (key, value) => {
        setDashParams({
            ...dashParams,
            [key]: value,
        });
    };
    const handleInputTextChange = (name, value) => {
        setRevenue({ ...revenue, [name]: value });
    };
    // OPPORTUNITIES PARAMS
    // Function to handle country filter change
    const onBoxClick = (opportunity) => {
        navigate(`/opportunity/${opportunity?.opportunityId}`);
    };
    const handleReset = () => {
        setDashParams(initialDashParams);
    };
    const handleResetTable = () => {
        setDashParams({
            ...dashParams,
            filterParams: dashParams.filterParams,
            search: "",
            stage: "",
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
    const hyperlink = (id, link) => {
        navigate(`/${link}/${id}`);
    };
    const columns = [
        {
            headerName: "TITLE",
            field: "title",
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.title || emptyValue })),
            width: 200,
        },
        {
            headerName: "OWNER",
            field: "owner",
            width: 200,
            renderCell: (params) => (_jsx("div", { children: params?.row?.owner || emptyValue })),
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
            headerName: "CURRENCY",
            field: "currency",
            renderCell: (params) => (_jsx("div", { children: params?.row?.currency || emptyValue })),
            width: 120,
        },
        {
            headerName: "PURCHASE TIME FRAME",
            field: "purchaseTimeFrame",
            renderCell: (params) => (_jsx("div", { children: params?.row?.purchaseTimeFrame || emptyValue })),
            width: 200,
        },
        {
            headerName: "PURCHASE PROCESS",
            field: "purchaseProcess",
            renderCell: (params) => (_jsx("div", { children: params?.row?.purchaseProcess || emptyValue })),
            width: 180,
        },
        {
            headerName: "FORECASTE CATEGORY",
            field: "forecastCategory",
            renderCell: (params) => (_jsx("div", { children: params?.row?.forecastCategory || emptyValue })),
            width: 180,
        },
        {
            headerName: "EST. REVENUE",
            field: "estimatedRevenue",
            renderCell: (params) => (_jsx("div", { children: parseFloat(params?.row?.estimatedRevenue) || emptyValue })),
            width: 150,
        },
        {
            headerName: "ACTUAL REVENUE",
            field: "actualRevenue",
            renderCell: (params) => (_jsx("div", { children: params?.row?.actualRevenue || emptyValue })),
            width: 160,
        },
        {
            headerName: "EST. CLOSE DATE",
            field: "estimatedCloseDate",
            renderCell: (params) => (_jsx("div", { children: moment(params?.row?.estimatedCloseDate).format("MMMM Do YYYY, h:mm:ss a") || emptyValue })),
            width: 210,
        },
        {
            headerName: "ACTUAL CLOSE DATE",
            field: "actualCloseDate",
            renderCell: (params) => params?.row?.actualCloseDate ? (_jsx("div", { children: moment(params?.row?.actualCloseDate).format("MMMM Do YYYY, h:mm:ss a") || emptyValue })) : (emptyValue),
            width: 210,
        },
        {
            headerName: "PROBABILITY",
            field: "probability",
            renderCell: (params) => (_jsx("div", { children: params?.row?.probability || emptyValue })),
            width: 120,
        },
        {
            headerName: "DESCRIPTION",
            field: "description",
            renderCell: (params) => (_jsx("div", { children: params?.row?.description || emptyValue })),
            width: 200,
        },
        {
            headerName: "CURRENT NEED",
            field: "currentNeed",
            renderCell: (params) => (_jsx("div", { children: params?.row?.currentNeed || emptyValue })),
            width: 200,
        },
        {
            headerName: "PROPOSED SOLUTION",
            field: "proposedSolution",
            renderCell: (params) => (_jsx("div", { children: params?.row?.proposedSolution || emptyValue })),
            width: 200,
        },
        {
            headerName: "STAGE",
            field: "stage",
            renderCell: (params) => (_jsx("div", { children: params?.row?.stage || emptyValue })),
            width: 150,
        },
        {
            headerName: "OPPORTUNITY STATUS",
            field: "status",
            renderCell: (params) => (_jsx("div", { children: params?.row?.status || emptyValue })),
            width: 190,
        },
        {
            headerName: "PRIORITY",
            field: "priority",
            renderCell: (params) => (_jsx("div", { children: params?.row?.priority || emptyValue })),
            width: 100,
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
    const content = (_jsxs("div", { children: [_jsx(Input, { onChange: (e) => handleInputTextChange("startPrice", e.target.value), placeholder: "From..", name: "from", type: "number", defaultValue: dashParams?.filterParams?.estimatedRevenue?.startPrice || 0, style: { marginBottom: 8 } }), _jsx(Input, { onChange: (e) => handleInputTextChange("endPrice", e.target.value), placeholder: "To..", name: "to", type: "number", defaultValue: dashParams?.filterParams?.estimatedRevenue?.endPrice || 0, style: { marginBottom: 8 } }), _jsx(Button, { type: "primary", onClick: handleChangeRevenue, children: "Submit" })] }));
    useEffect(() => {
        dispatch(fetchAllDashboardOpportunities({
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
        dispatch(fetchAllAccountsWithoutParams());
        dispatch(fetchAllContactsWithoutParams());
    }, []);
    useEffect(() => {
        if (screenWidth > 768) {
            setShowFilters(true);
        }
        else {
            setShowFilters(false);
        }
    }, [screenWidth]);
    useEffect(() => {
        handleResizeWindow();
    }, [screenWidth]);
    useEffect(() => {
        dispatch(fetchAllSalesPersonByUserId());
    }, []);
    return (_jsxs("div", { className: "dashboardWrapper", children: [screenWidth > 768 ? (_jsxs(_Fragment, { children: [" ", _jsxs("div", { className: "leadDash1WrapperGlobal", children: [_jsx(Select, { className: "dashboardSelect", showSearch: true, placeholder: "search currency", options: currencyOptions, onChange: (value) => handleSelectChange("currency", value), value: dashParams?.currency || "search currency" }), _jsx(Select, { className: "dashboardSelect", showSearch: true, placeholder: "search stage", options: stagesOptions, onChange: (value) => handleSelectChange("stage", value), value: dashParams?.stage || "search stage" }), _jsx(Select, { className: "dashboardSelect", placeholder: "search sales person", showSearch: true, value: dashParams?.filterParams?.salesPerson || "search sales person", onChange: (value) => handleSelectChange("salesPerson", value), children: salesPersonData?.map((item, index) => {
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
                                } }), _jsx("div", { children: _jsx(Popover, { content: content, title: "Filter Estimated Revenue", trigger: "click", open: openFilter, onOpenChange: setOpenFilter, children: _jsx("div", { className: "dashboardEstRevenueWrapper", children: _jsx("div", { className: "displayFlexRow", children: "Est. Revenue" }) }) }) }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "dashboardHeader", children: [_jsx("div", { children: "Dashboard" }), _jsx("img", { src: DASHBOARD_FILTER_ICON, onClick: () => setShowFilters(!showFilters), alt: "icon", className: "cursorPointer" })] }), _jsx("div", { className: "leadDash1WrapperGlobal", children: showFilters && (_jsxs("div", { className: "filtersContainer", children: [_jsx(Select, { className: "dashboardSelect", showSearch: true, placeholder: "search currency", options: currencyOptions, onChange: (value) => handleSelectChange("currency", value), value: dashParams?.currency || "search currency" }), _jsx(Select, { className: "dashboardSelect", showSearch: true, placeholder: "search stage", options: stagesOptions, onChange: (value) => handleSelectChange("stage", value), value: dashParams?.stage || "search stage" }), _jsx(Select, { className: "dashboardSelect", placeholder: "search sales person", showSearch: true, value: dashParams?.filterParams?.salesPerson ||
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
                                    } }), _jsx("div", { children: _jsx(Popover, { content: content, title: "Filter Estimated Revenue", trigger: "click", open: openFilter, onOpenChange: setOpenFilter, children: _jsx("div", { className: "dashboardEstRevenueWrapper", children: _jsx("div", { className: "displayFlexRow", children: "Est. Revenue" }) }) }) }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" })] })) })] })), _jsx("div", { children: _jsx(Spin, { spinning: dashboardOpportunitiesLoader, tip: "Loading...", children: _jsxs("div", { children: [_jsxs("div", { className: "opportunityDash2Wrapper", children: [_jsx("div", { className: "opportunityDashTableTitle", children: "Analytics" }), _jsxs("div", { className: "opportunityKPIWrapper", children: [_jsxs("div", { className: "opportunityKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI1, alt: "icon" }), _jsxs("div", { children: [_jsx("div", { className: "opportunityDashboardKPI", children: "Total No. of Opportunities" }), _jsx("div", { className: "opportunityDashboardKPIData", children: dashboardOpportunitiesAllData?.total_opportunity_count ||
                                                                    0 })] })] }), _jsxs("div", { className: "opportunityKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI2, alt: "icon" }), _jsxs("div", { children: [_jsx("div", { className: "opportunityDashboardKPI", children: "Closed Opportunities" }), _jsx("div", { className: "opportunityDashboardKPIData", children: dashboardOpportunitiesAllData?.total_closed_opportunity_count ||
                                                                    0 })] })] }), _jsxs("div", { className: "opportunityKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI3, alt: "icon" }), _jsxs("div", { children: [_jsx("div", { className: "opportunityDashboardKPI", children: "Avg. Deal Size" }), _jsx("div", { className: "opportunityDashboardKPIData", children: dashboardOpportunitiesAllData?.avg_opportunity_size
                                                                    ?.toFixed(2)
                                                                    .toLocaleString() || 0 })] })] }), _jsxs("div", { className: "opportunityKPIItem", children: [_jsx("img", { src: LEAD_DASH_KPI4, alt: "icon" }), _jsxs("div", { children: [_jsx("div", { className: "opportunityDashboardKPI", children: "Est. Revenue" }), _jsx("div", { className: "opportunityDashboardKPIData", children: dashboardOpportunitiesAllData?.est_opportunity_revenue ||
                                                                    0 })] })] })] }), _jsx("div", { className: "opportunityDashBarWrapper", style: { position: "relative", height: "40vh", width: "100%" }, children: _jsx(Bar, { data: data, options: {
                                                responsive: true,
                                                maintainAspectRatio: false,
                                            } }) })] }), _jsxs("div", { className: "opportunityDash3Wrapper", children: [_jsxs("div", { className: "opportunityDashFunnelWrapper", children: [_jsx("div", { className: "pipelineTitle", children: "Pipeline" }), _jsxs("div", { className: "opportunityDashFunnelDataWrapper", children: [_jsxs("div", { className: "opportunityDashFunnelData1", children: [_jsx("div", { className: "opportunityDashboardBox1", children: "Analysis" }), _jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_count_stage
                                                                    ?.length > 0
                                                                    ? dashboardOpportunitiesAllData
                                                                        ?.opportunity_count_stage[0]?.count
                                                                    : 0 })] }), _jsxs("div", { className: "opportunityDashFunnelData1", children: [_jsx("div", { className: "opportunityDashboardBox1", children: "Solutioning" }), _jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_count_stage
                                                                    ?.length > 0
                                                                    ? dashboardOpportunitiesAllData
                                                                        ?.opportunity_count_stage[1]?.count
                                                                    : 0 })] }), _jsxs("div", { className: "opportunityDashFunnelData1", children: [_jsx("div", { className: "opportunityDashboardBox1", children: "Proposal" }), _jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_count_stage
                                                                    ?.length > 0
                                                                    ? dashboardOpportunitiesAllData
                                                                        ?.opportunity_count_stage[2]?.count
                                                                    : 0 })] }), _jsxs("div", { className: "opportunityDashFunnelData1", children: [_jsx("div", { className: "opportunityDashboardBox1", children: "Negotiation" }), _jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_count_stage
                                                                    ?.length > 0
                                                                    ? dashboardOpportunitiesAllData
                                                                        ?.opportunity_count_stage[3]?.count
                                                                    : 0 })] }), _jsxs("div", { className: "opportunityDashFunnelData1", children: [_jsx("div", { className: "opportunityDashboardBox1", children: "Won" }), _jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_count_stage
                                                                    ?.length > 0
                                                                    ? dashboardOpportunitiesAllData
                                                                        ?.opportunity_count_stage[4]?.count
                                                                    : 0 })] }), _jsxs("div", { className: "opportunityDashFunnelData1", children: [_jsx("div", { className: "opportunityDashboardBox1", children: "Lost" }), _jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_count_stage
                                                                    ?.length > 0
                                                                    ? dashboardOpportunitiesAllData
                                                                        ?.opportunity_count_stage[5]?.count
                                                                    : 0 })] })] }), _jsx("img", { src: OPPORTUNITIY_DASH_FUNNEL, alt: "opportunitys-funnel", className: "opportunityDashboardFunnelImg" }), _jsxs("div", { className: "opportunityDashFunnelDataWrapper2", children: [_jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_percentage_stage
                                                            ?.length > 0
                                                            ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[0]?.percentage} %`
                                                            : "0%" }), _jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_percentage_stage
                                                            ?.length > 0
                                                            ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[1]?.percentage} %`
                                                            : "0%" }), _jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_percentage_stage
                                                            ?.length > 0
                                                            ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[2]?.percentage}`
                                                            : "0%" }), _jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_percentage_stage
                                                            ?.length > 0
                                                            ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[3]?.percentage} %`
                                                            : "0%" }), _jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_percentage_stage
                                                            ?.length > 0
                                                            ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[4]?.percentage} %`
                                                            : "0%" }), _jsx("div", { className: "opportunityDashboardBox2", children: dashboardOpportunitiesAllData?.opportunity_percentage_stage
                                                            ?.length > 0
                                                            ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[5]?.percentage} %`
                                                            : "0%" })] })] }), _jsx("div", { className: "opportunityDashPieWrapper", children: _jsx(Doughnut, { data: doughnutChartData }) })] }), _jsxs("div", { className: "opportunityDash4Wrapper", children: [_jsxs("div", { className: "opportunityDashTableToolbarWrapper", children: [_jsxs("div", { className: "opportunityDashTableWrapper", children: [_jsx("div", { className: "opportunityDashTableTitle", children: "Top Opportunities" }), _jsx("div", { className: "filterSelectWrapper1", children: _jsx(Select, { style: {
                                                                minWidth: "200px",
                                                                color: "red",
                                                                maxWidth: "400px",
                                                            }, placeholder: "Search here for Stage..", onChange: (value) => {
                                                                setDashParams({ ...dashParams, stage: value });
                                                            }, options: stagesOptions }) })] }), _jsxs("div", { className: "filterSelectWrapper1", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), value: dashParams?.search }), _jsx(Button, { onClick: handleResetTable, className: "resetFilterBtn", children: "Reset filters" })] })] }), _jsx("div", { style: { height: "40vh" }, children: _jsx(DataGrid, { rows: dashboardOpportunitiesData?.map((item) => {
                                                return {
                                                    ...item, estimatedRevenue: parseFloat(item?.estimatedRevenue),
                                                    actualRevenue: parseFloat(item?.actualRevenue)
                                                };
                                            }), loading: dashboardOpportunitiesLoader, getRowId: (row) => row?.opportunityId, columns: columns }, "opportunityId") })] })] }) }) })] }));
};
export default OpportunitiesDashboard;
