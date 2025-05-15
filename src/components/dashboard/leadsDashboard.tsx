import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { TimeRangePickerProps } from "antd";
import "../../styles/dashboard/leadDashboard.css";
import { Button, DatePicker, Input, Popover, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import {
  countryNames,
  leadSourceOptions,
  statusValuesArray,
} from "../../utilities/common/dataArrays";
import dayjs from "dayjs";
import {
  DASHBOARD_FILTER_ICON,
  LEAD_DASH_FUNNEL,
  LEAD_DASH_KPI1,
  LEAD_DASH_KPI2,
  LEAD_DASH_KPI3,
  LEAD_DASH_KPI4,
} from "../../utilities/common/imagesImports";
import { RootState } from "../../redux/app/store";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { Lead } from "../../utilities/common/exportDataTypes/leadDataTypes";
import { useNavigate } from "react-router-dom";
import { fetchAllDashboardLeads } from "../../redux/features/leadSlice";
import "chartjs-plugin-datalabels";
const { RangePicker } = DatePicker;
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { setScreenWidth } from "../../redux/features/referralsSlice";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

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
  const { dashboardLeadsAllData, dashboardLeadsLoader, dashboardLeadsData } =
    useAppSelector((state: RootState) => state.leads);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const { salesPersonData } = useAppSelector(
    (state: RootState) => state.organisations
  );
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    if (screenWidth > 768) {
      setShowFilters(true);
    } else {
      setShowFilters(false);
    }
  }, [screenWidth]);

  const statusWiseData =
    dashboardLeadsAllData?.lead_percentage_status?.length > 0
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
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
    { label: "Last 180 Days", value: [dayjs().add(-180, "d"), dayjs()] },
    { label: "Last 1 Year", value: [dayjs().add(-365, "d"), dayjs()] },
  ];

  // Function to handle country filter change
  const handleDashboardFilterChange = (
    name: string,
    selectedThings: string[]
  ) => {
    setDashParams({
      ...dashParams,
      filterParams: { ...dashParams.filterParams, [name]: selectedThings },
    });
  };

  const handleInputTextChange = (name: string, value: string) => {
    setRevenue({ ...revenue, [name]: value });
  };

  // LEADS PARAMS

  // Function to handle country filter change

  const onBoxClick = (lead: Lead) => {
    navigate(`/lead/${lead?.leadId}`);
  };

  const hyperlink = (id: string, link: string) => {
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

  const onSearch = (value: string) => {
    setDashParams({ ...dashParams, search: value });
  };

  const columns = [
    {
      headerName: "FIRST NAME",
      field: "firstName",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.firstName || emptyValue}</div>
      ),
      width: 130,
    },
    {
      headerName: "LAST NAME",
      field: "lastName",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.lastName || emptyValue}</div>
      ),
      width: 130,
    },
    {
      headerName: "LEAD TITLE",
      field: "title",
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.title || emptyValue}
        </div>
      ),
      width: 150,
    },
    {
      headerName: "DESCRIPTION",
      field: "description",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.description || emptyValue}</div>
      ),
      width: 220,
    },
    {
      headerName: "PHONE",
      field: "phone",
      renderCell: (params: GridCellParams) => (
        <div>
          {params?.row?.countryCode
            ? params?.row?.countryCode + params?.row?.phone
            : "" + params?.row?.phone || emptyValue}
        </div>
      ),
      width: 150,
    },
    {
      headerName: "EMAIL",
      field: "email",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.email || emptyValue}</div>
      ),
      width: 220,
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
      headerName: "COUNTRY",
      field: "country",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.country || emptyValue}</div>
      ),
      width: 150,
    },
    {
      headerName: "STATE",
      field: "state",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.state || emptyValue}</div>
      ),
      width: 150,
    },
    {
      headerName: "CITY",
      field: "city",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.city || emptyValue}</div>
      ),
      width: 150,
    },
    {
      headerName: "LEAD SOURCE",
      field: "leadSource",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.leadSource || emptyValue}</div>
      ),
      width: 180,
    },
    {
      headerName: "RATING",
      field: "rating",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.rating || emptyValue}</div>
      ),
      width: 100,
    },
    {
      headerName: "CURRENCY",
      field: "currency",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.currency || emptyValue}</div>
      ),
      width: 100,
    },
    {
      headerName: "EST. REVENUE",
      field: "price",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div>{parseFloat(params?.row?.price) || emptyValue}</div>
      ),
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
      headerName: "STATUS",
      field: "status",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.status || emptyValue}</div>
      ),
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

  const handleSelectChange = (name: string, value: string) => {
    setDashParams({
      ...dashParams,
      filterParams: { ...dashParams?.filterParams, [name]: value },
    });
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDashParams({
      ...dashParams,
      filterParams: { ...dashParams?.filterParams, [name]: value },
    });
  };

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
      fetchAllDashboardLeads({
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
              mode="multiple"
              placeholder="search country"
              options={countryNames}
              value={dashParams?.filterParams?.country}
              onChange={(selectedThings: string[]) =>
                handleDashboardFilterChange("country", selectedThings)
              }
            />
            <Input
              className="dashboardSelect"
              placeholder="search state"
              name="state"
              onChange={handleInputChange}
              value={dashParams?.filterParams?.state}
            />
            <Input
              className="dashboardSelect"
              placeholder="search city"
              name="city"
              onChange={handleInputChange}
              value={dashParams?.filterParams?.city}
            />

            <Select
              className="dashboardSelect"
              showSearch
              mode="multiple"
              placeholder="search lead source"
              options={leadSourceOptions}
              value={dashParams?.filterParams?.leadSource}
              onChange={(selectedThings: string[]) =>
                handleDashboardFilterChange("leadSource", selectedThings)
              }
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
            {/* Filter Icon/Button */}

            {/* Filters Container */}
            {showFilters && (
              <div className="filtersContainer">
                <Select
                  className="dashboardSelect"
                  showSearch
                  mode="multiple"
                  placeholder="search country"
                  options={countryNames}
                  value={dashParams?.filterParams?.country}
                  onChange={(selectedThings: string[]) =>
                    handleDashboardFilterChange("country", selectedThings)
                  }
                />
                <Input
                  className="dashboardSelect"
                  placeholder="search state"
                  name="state"
                  onChange={handleInputChange}
                  value={dashParams?.filterParams?.state}
                />
                <Input
                  className="dashboardSelect"
                  placeholder="search city"
                  name="city"
                  onChange={handleInputChange}
                  value={dashParams?.filterParams?.city}
                />
                <Select
                  className="dashboardSelect"
                  showSearch
                  mode="multiple"
                  placeholder="search lead source"
                  options={leadSourceOptions}
                  value={dashParams?.filterParams?.leadSource}
                  onChange={(selectedThings: string[]) =>
                    handleDashboardFilterChange("leadSource", selectedThings)
                  }
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
                <Button onClick={handleReset} className="resetFilterBtn">
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      <div>
        <Spin spinning={dashboardLeadsLoader} tip="Loading...">
          <div>
            <div className="leadDash2Wrapper">
              <div className="leadDashTableTitle">Analytics</div>
              <div className="leadKPIWrapper">
                <div className="leadKPIItem">
                  <img src={LEAD_DASH_KPI1} alt="icon" />
                  <div>
                    <div className="leadDashboardKPI">Total No. of Leads</div>
                    <div className="leadDashboardKPIData">
                      {dashboardLeadsAllData?.total_no_of_leads || 0}
                    </div>
                  </div>
                </div>
                <div className="leadKPIItem">
                  <img src={LEAD_DASH_KPI2} alt="icon" />
                  <div>
                    <div className="leadDashboardKPI">Qualification Rate</div>
                    <div className="leadDashboardKPIData">
                      {dashboardLeadsAllData?.lead_qualific_rate != null
                        ? `${(
                          dashboardLeadsAllData?.lead_qualific_rate * 100
                        ).toFixed(2)} %`
                        : "0 %"}
                    </div>
                  </div>
                </div>
                <div className="leadKPIItem">
                  <img src={LEAD_DASH_KPI3} alt="icon" />
                  <div>
                    <div className="leadDashboardKPI">Avg. Deal Size</div>
                    <div className="leadDashboardKPIData">
                      {dashboardLeadsAllData?.avg_lead_size
                        ?.toFixed(2)
                        .toLocaleString() || 0}
                    </div>
                  </div>
                </div>
                <div className="leadKPIItem">
                  <img src={LEAD_DASH_KPI4} alt="icon" />
                  <div>
                    <div className="leadDashboardKPI">Est. Revenue</div>
                    <div className="leadDashboardKPIData">
                      {dashboardLeadsAllData?.revenue || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="leadDash3Wrapper">
              <div className="leadDashFunnelWrapper">
                <div className="pipelineTitle">Pipeline</div>
                <div className="leadDashFunnelDataWrapper">
                  <div className="leadDashFunnelData1">
                    <div className="leadDashboardBox1">New</div>
                    <div className="leadDashboardBox2">
                      {dashboardLeadsAllData?.lead_count_status?.length > 0
                        ? dashboardLeadsAllData?.lead_count_status[0]?.count
                        : 0}
                    </div>
                  </div>
                  <div className="leadDashFunnelData1">
                    <div className="leadDashboardBox1">In Progress</div>
                    <div className="leadDashboardBox2">
                      {dashboardLeadsAllData?.lead_count_status?.length > 0
                        ? dashboardLeadsAllData?.lead_count_status[1]?.count
                        : 0}
                    </div>
                  </div>
                  <div className="leadDashFunnelData1">
                    <div className="leadDashboardBox1">Qualified</div>
                    <div className="leadDashboardBox2">
                      {dashboardLeadsAllData?.lead_count_status?.length > 0
                        ? dashboardLeadsAllData?.lead_count_status[3]?.count
                        : 0}
                    </div>
                  </div>
                  <div className="leadDashFunnelData1">
                    <div className="leadDashboardBox1">Closed</div>
                    <div className="leadDashboardBox2">
                      {dashboardLeadsAllData?.lead_count_status?.length > 0
                        ? dashboardLeadsAllData?.lead_count_status[2]?.count
                        : 0}
                    </div>
                  </div>
                </div>
                <img
                  src={LEAD_DASH_FUNNEL}
                  alt="leads-funnel"
                  className="leadDashboardFunnelImg"
                />
                <div className="leadDashFunnelDataWrapper2">
                  <div className="leadDashboardBox2">
                    {dashboardLeadsAllData?.lead_percentage_status?.length > 0
                      ? `${dashboardLeadsAllData?.lead_percentage_status[0]?.percentage} %`
                      : "0%"}
                  </div>
                  <div className="leadDashboardBox2">
                    {dashboardLeadsAllData?.lead_percentage_status?.length > 0
                      ? `${dashboardLeadsAllData?.lead_percentage_status[1]?.percentage} %`
                      : "0%"}
                  </div>
                  <div className="leadDashboardBox2">
                    {dashboardLeadsAllData?.lead_percentage_status?.length > 0
                      ? `${dashboardLeadsAllData?.lead_percentage_status[3]?.percentage} %`
                      : "0%"}
                  </div>
                  <div className="leadDashboardBox2">
                    {dashboardLeadsAllData?.lead_percentage_status?.length > 0
                      ? `${dashboardLeadsAllData?.lead_percentage_status[2]?.percentage} %`
                      : "0%"}
                  </div>
                </div>
              </div>
              <div className="leadDashPieWrapper">
                <Doughnut data={doughnutChartData} options={options} />
              </div>
            </div>
            <div className="leadDash4Wrapper">
              <div className="leadDashTableToolbarWrapper">
                <div className="leadDashTableWrapper">
                  <div className="leadDashTableTitle">Top Leads</div>
                  <div className="filterSelectWrapper1">
                    <Select
                      placeholder="Search here for Stage.."
                      onChange={(value) => {
                        setDashParams({ ...dashParams, status: value });
                      }}
                      options={statusValuesArray}
                    />
                    <Button
                      onClick={handleResetTable}
                      className="resetFilterBtn"
                    >
                      Reset filters
                    </Button>
                  </div>
                </div>
                <div className="filterSelectWrapper1">
                  <Input
                    placeholder="search here.."
                    name="searchText"
                    onChange={(e) => onSearch(e.target.value)}
                    value={dashParams?.search}
                  />
                </div>
              </div>
              <div style={{ height: "40vh" }}>
                <DataGrid
                  rows={dashboardLeadsData?.map((item: Lead) => {
                    return {
                      ...item, price: parseFloat(item?.price!)
                    }
                  })}
                  loading={dashboardLeadsLoader}
                  key={"leadId"}
                  getRowId={(row) => row?.leadId}
                  columns={columns}
                  pageSizeOptions={[5, 10, 20, 25]}
                />
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default LeadsDashboard;
