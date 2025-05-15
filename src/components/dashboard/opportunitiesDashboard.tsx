import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import type { TimeRangePickerProps } from "antd";
import "../../styles/dashboard/opportunityDashboard.css";
import { Button, DatePicker, Input, Popover, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import {
  currencyOptions,
  stagesOptions,
} from "../../utilities/common/dataArrays";
import dayjs from "dayjs";
import {
  DASHBOARD_FILTER_ICON,
  LEAD_DASH_KPI1,
  LEAD_DASH_KPI2,
  LEAD_DASH_KPI3,
  LEAD_DASH_KPI4,
  OPPORTUNITIY_DASH_FUNNEL,
} from "../../utilities/common/imagesImports";
import { RootState } from "../../redux/app/store";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useNavigate } from "react-router-dom";
import { Opportunity } from "../../utilities/common/exportDataTypes/opportunityDataTypes";
import { fetchAllDashboardOpportunities } from "../../redux/features/opportunitiesSlice";
import { fetchAllContactsWithoutParams } from "../../redux/features/contactsSlice";
import { fetchAllAccountsWithoutParams } from "../../redux/features/accountsSlice";
const { RangePicker } = DatePicker;
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { setScreenWidth } from "../../redux/features/referralsSlice";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

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
  const {
    dashboardOpportunitiesAllData,
    dashboardOpportunitiesLoader,
    dashboardOpportunitiesData,
  } = useAppSelector((state: RootState) => state.opportunities);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const [showFilters, setShowFilters] = useState(true);
  const { salesPersonData } = useAppSelector(
    (state: RootState) => state.organisations
  );

  const statusWiseData =
    dashboardOpportunitiesAllData?.opportunity_percentage_stage?.length > 0
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
  const rangePresets: TimeRangePickerProps["presets"] = [
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

  const handleSelectChange = (key: string, value: string) => {
    setDashParams({
      ...dashParams,
      [key]: value,
    });
  };

  const handleInputTextChange = (name: string, value: string) => {
    setRevenue({ ...revenue, [name]: value });
  };

  // OPPORTUNITIES PARAMS

  // Function to handle country filter change

  const onBoxClick = (opportunity: Opportunity) => {
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

  const onSearch = (value: string) => {
    setDashParams({ ...dashParams, search: value });
  };

  const hyperlink = (id: string, link: string) => {
    navigate(`/${link}/${id}`);
  };

  const columns = [
    {
      headerName: "TITLE",
      field: "title",
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.title || emptyValue}
        </div>
      ),
      width: 200,
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
      headerName: "COMPANY",
      field: "company",
      width: 220,
      renderCell: (params: GridCellParams) => {
        const company = params?.row?.company;
        if (typeof company === "string") {
          return (
            <div
              onClick={() =>
                hyperlink(
                  company.split("/").length > 0 ? company.split("/")[1] : "",
                  "account"
                )
              }
              className="hyperlinkBlue"
            >
              {company.split("/").length > 0
                ? company.split("/")[0]
                : company || emptyValue}
            </div>
          );
        } else {
          return <div>{emptyValue}</div>;
        }
      },
    },
    {
      headerName: "CONTACT",
      field: "contact",
      width: 220,
      renderCell: (params: GridCellParams) => {
        const contact = params?.row?.contact;
        if (typeof contact === "string") {
          return (
            <div
              onClick={() =>
                hyperlink(
                  contact.split("/").length > 0 ? contact.split("/")[1] : "",
                  "contact"
                )
              }
              className="hyperlinkBlue"
            >
              {contact.split("/").length > 0
                ? contact.split("/")[0]
                : contact || emptyValue}
            </div>
          );
        } else {
          return <div>{emptyValue}</div>;
        }
      },
    },

    {
      headerName: "CURRENCY",
      field: "currency",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.currency || emptyValue}</div>
      ),
      width: 120,
    },
    {
      headerName: "PURCHASE TIME FRAME",
      field: "purchaseTimeFrame",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.purchaseTimeFrame || emptyValue}</div>
      ),
      width: 200,
    },
    {
      headerName: "PURCHASE PROCESS",
      field: "purchaseProcess",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.purchaseProcess || emptyValue}</div>
      ),
      width: 180,
    },
    {
      headerName: "FORECASTE CATEGORY",
      field: "forecastCategory",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.forecastCategory || emptyValue}</div>
      ),
      width: 180,
    },
    {
      headerName: "EST. REVENUE",
      field: "estimatedRevenue",
      renderCell: (params: GridCellParams) => (
        <div>{parseFloat(params?.row?.estimatedRevenue) || emptyValue}</div>
      ),
      width: 150,
    },
    {
      headerName: "ACTUAL REVENUE",
      field: "actualRevenue",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.actualRevenue || emptyValue}</div>
      ),
      width: 160,
    },
    {
      headerName: "EST. CLOSE DATE",
      field: "estimatedCloseDate",
      renderCell: (params: GridCellParams) => (
        <div>
          {moment(params?.row?.estimatedCloseDate).format(
            "MMMM Do YYYY, h:mm:ss a"
          ) || emptyValue}
        </div>
      ),
      width: 210,
    },
    {
      headerName: "ACTUAL CLOSE DATE",
      field: "actualCloseDate",
      renderCell: (params: GridCellParams) =>
        params?.row?.actualCloseDate ? (
          <div>
            {moment(params?.row?.actualCloseDate).format(
              "MMMM Do YYYY, h:mm:ss a"
            ) || emptyValue}
          </div>
        ) : (
          emptyValue
        ),
      width: 210,
    },
    {
      headerName: "PROBABILITY",
      field: "probability",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.probability || emptyValue}</div>
      ),
      width: 120,
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
      headerName: "CURRENT NEED",
      field: "currentNeed",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.currentNeed || emptyValue}</div>
      ),
      width: 200,
    },
    {
      headerName: "PROPOSED SOLUTION",
      field: "proposedSolution",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.proposedSolution || emptyValue}</div>
      ),
      width: 200,
    },
    {
      headerName: "STAGE",
      field: "stage",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.stage || emptyValue}</div>
      ),
      width: 150,
    },
    {
      headerName: "OPPORTUNITY STATUS",
      field: "status",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.status || emptyValue}</div>
      ),
      width: 190,
    },
    {
      headerName: "PRIORITY",
      field: "priority",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.priority || emptyValue}</div>
      ),
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

  const content = (
    <div>
      <Input
        onChange={(e) => handleInputTextChange("startPrice", e.target.value)}
        placeholder="From.."
        name="from"
        type="number"
        defaultValue={
          dashParams?.filterParams?.estimatedRevenue?.startPrice || 0
        }
        style={{ marginBottom: 8 }}
      />
      <Input
        onChange={(e) => handleInputTextChange("endPrice", e.target.value)}
        placeholder="To.."
        name="to"
        type="number"
        defaultValue={dashParams?.filterParams?.estimatedRevenue?.endPrice || 0}
        style={{ marginBottom: 8 }}
      />
      <Button type="primary" onClick={handleChangeRevenue}>
        Submit
      </Button>
    </div>
  );

  useEffect(() => {
    dispatch(
      fetchAllDashboardOpportunities({
        ...dashParams,
        filterParams: {
          ...dashParams.filterParams,
          estimatedRevenue: {
            ...dashParams?.filterParams.estimatedRevenue,
            startPrice:
              dashParams?.filterParams?.estimatedRevenue?.startPrice === ""
                ? "0"
                : dashParams?.filterParams?.estimatedRevenue?.startPrice,
          },
        },
      })
    );
  }, [dashParams]);

  useEffect(() => {
    dispatch(fetchAllAccountsWithoutParams());
    dispatch(fetchAllContactsWithoutParams());
  }, []);

  useEffect(() => {
    if (screenWidth > 768) {
      setShowFilters(true);
    } else {
      setShowFilters(false);
    }
  }, [screenWidth]);

  useEffect(() => {
    handleResizeWindow();
  }, [screenWidth]);

  useEffect(() => {
    dispatch(fetchAllSalesPersonByUserId());
  }, []);

  return (
    <div className="dashboardWrapper">
      {screenWidth > 768 ? (
        <>
          {" "}
          <div className="leadDash1WrapperGlobal">
            <Select
              className="dashboardSelect"
              showSearch
              placeholder="search currency"
              options={currencyOptions}
              onChange={(value: string) =>
                handleSelectChange("currency", value)
              }
              value={dashParams?.currency || "search currency"}
            />
            <Select
              className="dashboardSelect"
              showSearch
              placeholder="search stage"
              options={stagesOptions}
              onChange={(value: string) => handleSelectChange("stage", value)}
              value={dashParams?.stage || "search stage"}
            />
            <Select
              className="dashboardSelect"
              placeholder="search sales person"
              showSearch
              value={
                dashParams?.filterParams?.salesPerson || "search sales person"
              }
              onChange={(value: string) =>
                handleSelectChange("salesPerson", value)
              }
            >
              {salesPersonData?.map((item, index) => {
                return (
                  <>
                    <Select.Option
                      key={index}
                      value={`${item?.firstName} ${item?.lastName}`}
                    >
                      {item.firstName} {item?.lastName}
                    </Select.Option>
                  </>
                );
              })}
            </Select>
            <RangePicker
              className="dashboardSelectDateRange"
              presets={rangePresets}
              onChange={(_dates, dateStrings) => {
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
              }}
            />

            <div>
              <Popover
                content={content}
                title="Filter Estimated Revenue"
                trigger="click"
                open={openFilter}
                onOpenChange={setOpenFilter}
              >
                <div className="dashboardEstRevenueWrapper">
                  <div className="displayFlexRow">Est. Revenue</div>
                </div>
              </Popover>
            </div>
            <Button onClick={handleReset} className="resetFilterBtn">
              Reset filters
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="dashboardHeader">
            <div>Dashboard</div>
            <img
              src={DASHBOARD_FILTER_ICON}
              onClick={() => setShowFilters(!showFilters)}
              alt="icon"
              className="cursorPointer"
            />
          </div>
          <div className="leadDash1WrapperGlobal">
            {showFilters && (
              <div className="filtersContainer">
                <Select
                  className="dashboardSelect"
                  showSearch
                  placeholder="search currency"
                  options={currencyOptions}
                  onChange={(value: string) =>
                    handleSelectChange("currency", value)
                  }
                  value={dashParams?.currency || "search currency"}
                />
                <Select
                  className="dashboardSelect"
                  showSearch
                  placeholder="search stage"
                  options={stagesOptions}
                  onChange={(value: string) =>
                    handleSelectChange("stage", value)
                  }
                  value={dashParams?.stage || "search stage"}
                />
                <Select
                  className="dashboardSelect"
                  placeholder="search sales person"
                  showSearch
                  value={
                    dashParams?.filterParams?.salesPerson ||
                    "search sales person"
                  }
                  onChange={(value: string) =>
                    handleSelectChange("salesPerson", value)
                  }
                >
                  {salesPersonData?.map((item, index) => {
                    return (
                      <>
                        <Select.Option
                          key={index}
                          value={`${item?.firstName} ${item?.lastName}`}
                        >
                          {item.firstName} {item?.lastName}
                        </Select.Option>
                      </>
                    );
                  })}
                </Select>
                <RangePicker
                  className="dashboardSelectDateRange"
                  presets={rangePresets}
                  onChange={(_dates, dateStrings) => {
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
                  }}
                />

                <div>
                  <Popover
                    content={content}
                    title="Filter Estimated Revenue"
                    trigger="click"
                    open={openFilter}
                    onOpenChange={setOpenFilter}
                  >
                    <div className="dashboardEstRevenueWrapper">
                      <div className="displayFlexRow">Est. Revenue</div>
                    </div>
                  </Popover>
                </div>
                <Button onClick={handleReset} className="resetFilterBtn">
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </>
      )}
      <div>
        <Spin spinning={dashboardOpportunitiesLoader} tip="Loading...">
          <div>
            <div className="opportunityDash2Wrapper">
              <div className="opportunityDashTableTitle">Analytics</div>
              <div className="opportunityKPIWrapper">
                <div className="opportunityKPIItem">
                  <img src={LEAD_DASH_KPI1} alt="icon" />
                  <div>
                    <div className="opportunityDashboardKPI">
                      Total No. of Opportunities
                    </div>
                    <div className="opportunityDashboardKPIData">
                      {dashboardOpportunitiesAllData?.total_opportunity_count ||
                        0}
                    </div>
                  </div>
                </div>
                <div className="opportunityKPIItem">
                  <img src={LEAD_DASH_KPI2} alt="icon" />
                  <div>
                    <div className="opportunityDashboardKPI">
                      Closed Opportunities
                    </div>
                    <div className="opportunityDashboardKPIData">
                      {dashboardOpportunitiesAllData?.total_closed_opportunity_count ||
                        0}
                    </div>
                  </div>
                </div>
                <div className="opportunityKPIItem">
                  <img src={LEAD_DASH_KPI3} alt="icon" />
                  <div>
                    <div className="opportunityDashboardKPI">
                      Avg. Deal Size
                    </div>
                    <div className="opportunityDashboardKPIData">
                      {dashboardOpportunitiesAllData?.avg_opportunity_size
                        ?.toFixed(2)
                        .toLocaleString() || 0}
                    </div>
                  </div>
                </div>
                <div className="opportunityKPIItem">
                  <img src={LEAD_DASH_KPI4} alt="icon" />
                  <div>
                    <div className="opportunityDashboardKPI">Est. Revenue</div>
                    <div className="opportunityDashboardKPIData">
                      {dashboardOpportunitiesAllData?.est_opportunity_revenue ||
                        0}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="opportunityDashBarWrapper"
                style={{ position: "relative", height: "40vh", width: "100%" }}
              >
                <Bar
                  data={data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div className="opportunityDash3Wrapper">
              <div className="opportunityDashFunnelWrapper">
                <div className="pipelineTitle">Pipeline</div>
                <div className="opportunityDashFunnelDataWrapper">
                  <div className="opportunityDashFunnelData1">
                    <div className="opportunityDashboardBox1">Analysis</div>
                    <div className="opportunityDashboardBox2">
                      {dashboardOpportunitiesAllData?.opportunity_count_stage
                        ?.length > 0
                        ? dashboardOpportunitiesAllData
                          ?.opportunity_count_stage[0]?.count
                        : 0}
                    </div>
                  </div>
                  <div className="opportunityDashFunnelData1">
                    <div className="opportunityDashboardBox1">Solutioning</div>
                    <div className="opportunityDashboardBox2">
                      {dashboardOpportunitiesAllData?.opportunity_count_stage
                        ?.length > 0
                        ? dashboardOpportunitiesAllData
                          ?.opportunity_count_stage[1]?.count
                        : 0}
                    </div>
                  </div>
                  <div className="opportunityDashFunnelData1">
                    <div className="opportunityDashboardBox1">Proposal</div>
                    <div className="opportunityDashboardBox2">
                      {dashboardOpportunitiesAllData?.opportunity_count_stage
                        ?.length > 0
                        ? dashboardOpportunitiesAllData
                          ?.opportunity_count_stage[2]?.count
                        : 0}
                    </div>
                  </div>
                  <div className="opportunityDashFunnelData1">
                    <div className="opportunityDashboardBox1">Negotiation</div>
                    <div className="opportunityDashboardBox2">
                      {dashboardOpportunitiesAllData?.opportunity_count_stage
                        ?.length > 0
                        ? dashboardOpportunitiesAllData
                          ?.opportunity_count_stage[3]?.count
                        : 0}
                    </div>
                  </div>
                  <div className="opportunityDashFunnelData1">
                    <div className="opportunityDashboardBox1">Won</div>
                    <div className="opportunityDashboardBox2">
                      {dashboardOpportunitiesAllData?.opportunity_count_stage
                        ?.length > 0
                        ? dashboardOpportunitiesAllData
                          ?.opportunity_count_stage[4]?.count
                        : 0}
                    </div>
                  </div>
                  <div className="opportunityDashFunnelData1">
                    <div className="opportunityDashboardBox1">Lost</div>
                    <div className="opportunityDashboardBox2">
                      {dashboardOpportunitiesAllData?.opportunity_count_stage
                        ?.length > 0
                        ? dashboardOpportunitiesAllData
                          ?.opportunity_count_stage[5]?.count
                        : 0}
                    </div>
                  </div>
                </div>
                <img
                  src={OPPORTUNITIY_DASH_FUNNEL}
                  alt="opportunitys-funnel"
                  className="opportunityDashboardFunnelImg"
                />
                <div className="opportunityDashFunnelDataWrapper2">
                  <div className="opportunityDashboardBox2">
                    {dashboardOpportunitiesAllData?.opportunity_percentage_stage
                      ?.length > 0
                      ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[0]?.percentage} %`
                      : "0%"}
                  </div>
                  <div className="opportunityDashboardBox2">
                    {dashboardOpportunitiesAllData?.opportunity_percentage_stage
                      ?.length > 0
                      ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[1]?.percentage} %`
                      : "0%"}
                  </div>
                  <div className="opportunityDashboardBox2">
                    {dashboardOpportunitiesAllData?.opportunity_percentage_stage
                      ?.length > 0
                      ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[2]?.percentage}`
                      : "0%"}
                  </div>
                  <div className="opportunityDashboardBox2">
                    {dashboardOpportunitiesAllData?.opportunity_percentage_stage
                      ?.length > 0
                      ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[3]?.percentage} %`
                      : "0%"}
                  </div>
                  <div className="opportunityDashboardBox2">
                    {dashboardOpportunitiesAllData?.opportunity_percentage_stage
                      ?.length > 0
                      ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[4]?.percentage} %`
                      : "0%"}
                  </div>
                  <div className="opportunityDashboardBox2">
                    {dashboardOpportunitiesAllData?.opportunity_percentage_stage
                      ?.length > 0
                      ? `${dashboardOpportunitiesAllData?.opportunity_percentage_stage[5]?.percentage} %`
                      : "0%"}
                  </div>
                </div>
              </div>
              <div className="opportunityDashPieWrapper">
                <Doughnut data={doughnutChartData} />
              </div>
            </div>
            <div className="opportunityDash4Wrapper">
              <div className="opportunityDashTableToolbarWrapper">
                <div className="opportunityDashTableWrapper">
                  <div className="opportunityDashTableTitle">
                    Top Opportunities
                  </div>
                  <div className="filterSelectWrapper1">
                    <Select
                      style={{
                        minWidth: "200px",
                        color: "red",
                        maxWidth: "400px",
                      }}
                      placeholder="Search here for Stage.."
                      onChange={(value) => {
                        setDashParams({ ...dashParams, stage: value });
                      }}
                      options={stagesOptions}
                    />
                  </div>
                </div>
                <div className="filterSelectWrapper1">
                  <Input
                    placeholder="search here.."
                    name="searchText"
                    onChange={(e) => onSearch(e.target.value)}
                    value={dashParams?.search}
                  />
                  <Button onClick={handleResetTable} className="resetFilterBtn">
                    Reset filters
                  </Button>
                </div>
              </div>
              <div style={{ height: "40vh" }}>
                <DataGrid
                  rows={dashboardOpportunitiesData?.map((item: Opportunity) => {
                    return {
                      ...item, estimatedRevenue: parseFloat(item?.estimatedRevenue!),
                      actualRevenue: parseFloat(item?.actualRevenue!)
                    }
                  })}
                  loading={dashboardOpportunitiesLoader}
                  key={"opportunityId"}
                  getRowId={(row) => row?.opportunityId}
                  columns={columns}
                />
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default OpportunitiesDashboard;
