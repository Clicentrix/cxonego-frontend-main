import { useEffect, useState } from "react";
import {
  Input,
  Popconfirm,
  Form,
  Modal,
  Button,
  Tooltip,
  Tabs,
  Spin,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/oppotunities/opportunitiesListView.css";
import { TableOutlined, IdcardOutlined, PlusOutlined } from "@ant-design/icons";
import "../../styles/horizontalFunctions/filterDropdown.css";
import { Opportunity } from "../../utilities/common/exportDataTypes/opportunityDataTypes";
import {
  createAndGetAllOpportunities,
  deleteOpportunityByIdAndGetAllOpportunities,
  emptyOpportunity,
  fetchAllOpportunities,
  handleInputChangeReducerOpportunity,
  resetIsModalOpenOpportunity,
  resetOpportunities,
  resetOpportunity,
} from "../../redux/features/opportunitiesSlice";
import OpportunitiesKanban from "./opportunityKanban";
import AddOpportunityForm from "./addOpportunityForm";
import {
  fetchAllAccountsWithoutParams,
  resetAccount,
  resetAccountForLookup,
} from "../../redux/features/accountsSlice";
import {
  fetchAllContactsWithoutParams,
  resetContact,
  resetContactForLookup,
} from "../../redux/features/contactsSlice";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import {
  DataGrid,
  GridCellParams,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { OPPOTUNITIES_ICON_ORANGE } from "../../utilities/common/imagesImports";
import moment from "moment";
import { getUserById } from "../../redux/features/authenticationSlice";

const AllOpportunities = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    opportunities,
    loading,
    addOpportunityLoader,
    opportunity,
    getOpportunityLoader,
    isModalOpenOpportunity,
    totalOpportunities
  } = useAppSelector((state: RootState) => state.opportunities);
  const { accountForLookup } = useAppSelector(
    (state: RootState) => state.accounts
  );
  const { contactForLookup } = useAppSelector(
    (state: RootState) => state.contacts
  );

  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const { user } = useAppSelector((state: RootState) => state.authentication);

  const [view, setView] = useState<string>("list");
  const initialParams = {
    page: 1,
    limit: 10,
    search: "",
    view: "myView",
  };
  const [params, setParams] = useState(initialParams);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);

  const onTabChange = (key: string) => {
    setParams({ ...params, view: key });
  };
  const handleDelete = () => {
    dispatch(
      deleteOpportunityByIdAndGetAllOpportunities(selectedRowKeys, params)
    );
    setSelectedRowKeys([]);
  };

  const handleSubmit = () => {
    dispatch(createAndGetAllOpportunities(opportunity, params));
    dispatch(resetIsModalOpenOpportunity(false));
    form.resetFields();
  };

  const onSearch = (value: string) => {
    setParams({ ...params, search: value });
  };

  useEffect(() => {
    dispatch(fetchAllOpportunities(params));
  }, [params]);

  useEffect(() => {
    dispatch(resetOpportunity());
    dispatch(resetOpportunities());
    dispatch(fetchAllAccountsWithoutParams());
    dispatch(fetchAllContactsWithoutParams());
    dispatch(getUserById());
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetAccountForLookup());
    dispatch(resetAccount());
    dispatch(resetContact());
    dispatch(resetContactForLookup());
  }, []);

  useEffect(() => {
    if (accountForLookup?.accountId !== "") {
      form.setFieldsValue({ company: accountForLookup?.accountId });
      dispatch(
        handleInputChangeReducerOpportunity({
          company: accountForLookup?.accountId,
        })
      );
    } else {
      form.setFieldsValue(emptyOpportunity);
    }
  }, [accountForLookup]);

  useEffect(() => {
    if (contactForLookup?.contactId !== "") {
      form.setFieldsValue({ contact: contactForLookup?.contactId });
      dispatch(
        handleInputChangeReducerOpportunity({
          contact: contactForLookup?.contactId,
        })
      );
    } else {
      form.setFieldsValue(emptyOpportunity);
    }
  }, [contactForLookup]);

  const onBoxClick = (opportunity: Opportunity) => {
    navigate(`/opportunity/${opportunity?.opportunityId}`);
  };

  const hyperlink = (id: string, link: string) => {
    navigate(`/${link}/${id}`);
  };

  const columns = [
    {
      headerName: "OPPORTUNITY NUMBER",
      field: "opportunityId",
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.opportunityId || emptyValue}
        </div>
      ),
      width: 200,
    },
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
        <div>{params?.row?.estimatedRevenue || emptyValue}</div>
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

  const showModal = () => {
    dispatch(resetIsModalOpenOpportunity(true));

    form.resetFields();
  };

  const handleCancel = () => {
    dispatch(resetIsModalOpenOpportunity(false));

    form.resetFields();
  };

  const handleReset = () => {
    setParams(initialParams);
  };

  const onListClick = (value: string) => {
    setView(value);
  };

  const handlePaginationChange = (paginationModel: GridPaginationModel) => {
    setParams({
      ...params,
      page: paginationModel.page + 1, // MUI DataGrid uses 0-based index for pages
      limit: paginationModel.pageSize,
    });
  };

  return (
    <>
      <div className="addOpportunityModalWrapper">
        <Modal
          open={isModalOpenOpportunity}
          onOk={handleSubmit}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="addOpportunityFormDiv">
            <div className="addOpportunityTitle">New Opportunity</div>
            <div className="addOpportunityFormWrapper">
              <Form form={form} name="loginForm" onFinish={handleSubmit}>
                <AddOpportunityForm />
                <Form.Item className="addOpportunitySubmitBtnWrapper">
                  <Button
                    onClick={handleCancel}
                    className="addOpportunityCancelBtn"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="addOpportunitySubmitBtn"
                    loading={addOpportunityLoader}
                  >
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Modal>
      </div>

      <div className="listViewBackWrapper">
        <div className="opportunitiesListToolbarWrapper">
          <div className="opportunitiesListToolbarItem">
            <div className="tableTitleIconWrapper">
              <img
                src={OPPOTUNITIES_ICON_ORANGE}
                alt="illustration"
                className="illustrationIcon"
              />
              Opportunities
            </div>
            {screenWidth < 768 ? (
              <Tooltip title={"Add new Opportunity"}>
                <PlusOutlined onClick={showModal} />
              </Tooltip>
            ) : (
              <Button onClick={showModal} className="addOpportunityModalBtn">
                New
              </Button>
            )}
            <div>
              {selectedRowKeys.length > 0 ? (
                <div className="opportunitiesDeleteBottomBar">
                  <Popconfirm
                    title="Delete the Opportunity"
                    description="Are you sure you want to delete this record?"
                    onConfirm={handleDelete}
                    okText="Yes"
                    cancelText="Cancel"
                  >
                    <Button
                      type="primary"
                      danger
                      style={{ marginLeft: "10px" }}
                    >
                      Delete selected
                    </Button>
                  </Popconfirm>
                </div>
              ) : null}
            </div>
          </div>
          <div className="opportunitiesSearchResetBar">
            <Input
              placeholder="search here.."
              name="searchText"
              onChange={(e) => onSearch(e.target.value)}
              value={params?.search}
            />
            <Button onClick={handleReset} className="resetFilterBtn">
              Reset filters
            </Button>
            <div className="opportunitiesSwitchDiv">
              {view === "kanban" ? (
                <div
                  className="opportunitiesSwitchDivItem"
                  onClick={() => onListClick("list")}
                >
                  <TableOutlined />
                  List
                </div>
              ) : (
                <div
                  className="opportunitiesSwitchDivItem"
                  onClick={() => onListClick("kanban")}
                >
                  <IdcardOutlined />
                  Kanban
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs onChange={onTabChange} type="card">
          <Tabs.TabPane key={"myView"} tab={"My Opportunities"}>
            {opportunities?.length > 0 && view === "kanban" ? (
              <OpportunitiesKanban params={params} />
            ) : view === "list" ? (
              <div style={{ height: "75vh" }}>
                <DataGrid
                  rows={opportunities?.map((item: Opportunity) => {
                    return {
                      ...item, estimatedRevenue: parseFloat(item?.estimatedRevenue!),
                      actualRevenue: parseFloat(item?.actualRevenue!)
                    }
                  })}
                  loading={
                    loading || addOpportunityLoader || getOpportunityLoader
                  }
                  key={"opportunityId"}
                  getRowId={(row) => row?.opportunityId}
                  checkboxSelection={user?.role === "ADMIN" ? true : false}
                  columns={columns}

                  onRowSelectionModelChange={(
                    newSelection: GridRowSelectionModel
                  ) => {
                    setSelectedRowKeys(newSelection as GridRowId[]);
                  }}
                  paginationMode="server"
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: params.limit,
                        page: params.page - 1,
                      },
                    },
                  }}
                  onPaginationModelChange={handlePaginationChange}
                  pageSizeOptions={[5, 10, 20, 25]}
                  rowCount={totalOpportunities > 0 ? totalOpportunities : 0} // Set the total number of rows
                />
              </div>
            ) : (
              <div>No Opportunities Found</div>
            )}
          </Tabs.TabPane>
          {user?.role === "SALESPERSON" ? null : (
            <Tabs.TabPane key={"myTeamView"} tab={"All Opportunities"}>
              {view === "kanban" && loading ? (
                <Spin spinning={addOpportunityLoader} tip="Loading..."></Spin>
              ) : opportunities?.length > 0 && view === "kanban" && !loading ? (
                <OpportunitiesKanban params={params} />
              ) : view === "list" ? (
                <div style={{ height: "75vh" }}>
                  <DataGrid
                    rows={opportunities?.map((item: Opportunity) => {
                      return {
                        ...item, estimatedRevenue: parseFloat(item?.estimatedRevenue!),
                        actualRevenue: parseFloat(item?.actualRevenue!)
                      }
                    })}
                    loading={
                      loading || addOpportunityLoader || getOpportunityLoader
                    }
                    key={"opportunityId"}
                    getRowId={(row) => row?.opportunityId}
                    checkboxSelection={user?.role === "ADMIN" ? true : false}
                    columns={columns}

                    onRowSelectionModelChange={(
                      newSelection: GridRowSelectionModel
                    ) => {
                      setSelectedRowKeys(newSelection as GridRowId[]);
                    }}
                    paginationMode="server"
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: params.limit,
                          page: params.page - 1,
                        },
                      },
                    }}
                    onPaginationModelChange={handlePaginationChange}
                    pageSizeOptions={[5, 10, 20, 25]}
                    rowCount={totalOpportunities > 0 ? totalOpportunities : 0} // Set the total number of rows
                  />
                </div>
              ) : (
                <div>No Opportunities Found</div>
              )}
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default AllOpportunities;
