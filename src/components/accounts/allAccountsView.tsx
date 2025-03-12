import {
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  Tabs,
  Tooltip,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/accounts/accountsView.css";
import { useEffect, useState } from "react";
import {
  createAndGetAllAccounts,
  deleteAccountsByIdAndGetAllAccounts,
  fetchAllAccounts,
  resetAccount,
  resetAccounts,
  resetIsModalOpenAccount,
} from "../../redux/features/accountsSlice";
import type { SearchProps } from "antd/es/input/Search";
import { TableOutlined, IdcardOutlined, PlusOutlined } from "@ant-design/icons";
import { Account } from "../../utilities/common/exportDataTypes/accountDataTypes";
import { useNavigate } from "react-router-dom";
import AddAccountForm from "./addAccountForm";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import {
  DataGrid,
  GridCellParams,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { ACCOUNT_ICON_ORANGE } from "../../utilities/common/imagesImports";
import { getUserById } from "../../redux/features/authenticationSlice";
export const initialAccountsParams = {
  page: 1,
  limit: 10,
  search: "",
  view: "myView",
};


const AllAccounts = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [view, setView] = useState<string>("list");
  const {
    accounts,
    loading,
    account,
    addAccountLoader,
    isModalOpenAccount,
    getAccountLoader,
    totalAccounts
  } = useAppSelector((state: RootState) => state.accounts);
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const { user } = useAppSelector((state: RootState) => state.authentication);
  const companyToken = user?.organisation && user?.organisation?.companyToken
    ? ` ${user.organisation.companyToken}`
    : " Companies"
  // const accounts = [
  //   {
  //     accountId: "1",
  //     accountName: "infosys Tech",
  //     employeeSize: "200",
  //     description: "Test Account",
  //     website: "www.infosys.com",
  //     industry: "IT",
  //     businessType: "COMPETITOR",
  //     CurrencyCode: "INR",
  //     annualRevenue: "9000",
  //     status: "ACTIVE",
  //     owner: "akshaymithari98@gmail.com",
  //     phone: "9834701394",
  //     email: "roshninwankhede2312@gmail.com",
  //     address: "Hinjewadi, Phase 2",
  //     country: "India",
  //     state: "Maharashtra",
  //     city: "Pune",
  //     createdAt: "2024-02-02T06:16:10.411Z",
  //     updatedAt: "2024-03-02T06:16:10.411Z",
  //   },
  // ];

  const [params, setParams] = useState(initialAccountsParams);

  const handleCancel = () => {
    dispatch(resetIsModalOpenAccount(false));
    form.resetFields();
  };
  const showModal = () => {
    dispatch(resetIsModalOpenAccount(true));
    form.resetFields();
  };

  const handleSubmit = async () => {
    await dispatch(createAndGetAllAccounts(account, params));
    await dispatch(resetIsModalOpenAccount(false));
    form.resetFields();
  };
  const onSearch: SearchProps["onSearch"] = (value) => {
    setParams({ ...params, search: value });
  };

  const onListClick = (value: string) => {
    setView(value);
  };

  const handleReset = () => {
    setParams(initialAccountsParams);
  };

  const onBoxClick = (account: Account) => {
    navigate(`/account/${account?.accountId}`);
  };

  const handlePaginationChange = (paginationModel: GridPaginationModel) => {
    setParams({
      ...params,
      page: paginationModel.page + 1, // MUI DataGrid uses 0-based index for pages
      limit: paginationModel.pageSize,
    });
  };

  const columns = [
    {
      headerName: "COMPANY NUMBER",
      field: "accountId",
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.accountId || emptyValue}
        </div>
      ),
      width: 200,
    },
    {
      headerName: "NAME",
      field: "accountName",
      width: 200,
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.accountName || emptyValue}
        </div>
      ),
    },
    {
      headerName: "DESCRIPTION",
      field: "description",
      width: 250,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.description || emptyValue}</div>
      ),
    },
    {
      headerName: "COUNTRY",
      field: "country",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.country || emptyValue}</div>
      ),
    },
    {
      headerName: "STATE",
      field: "state",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.state || emptyValue}</div>
      ),
    },
    {
      headerName: "CITY",
      field: "city",
      width: 160,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.city || emptyValue}</div>
      ),
    },
    {
      headerName: "OWNER",
      field: "owner",
      width: 180,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.owner || emptyValue}</div>
      ),
    },
    {
      headerName: "ADDRESS",
      field: "address",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.address || emptyValue}</div>
      ),
    },
    {
      headerName: "WEBSITE",
      field: "website",
      width: 220,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.website || emptyValue}</div>
      ),
    },
    {
      headerName: "INDUSTRY",
      field: "industry",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.industry || emptyValue}</div>
      ),
    },
    {
      headerName: "STATUS",
      field: "status",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.status || emptyValue}</div>
      ),
    },
    {
      headerName: "EMAIL",
      field: "email",
      width: 240,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.email || emptyValue}</div>
      ),
    },
    {
      headerName: "CONTACT NO.",
      field: "phone",
      width: 180,
      renderCell: (params: GridCellParams) => (
        <div>
          {params?.row?.countryCode
            ? params?.row?.countryCode + params?.row?.phone
            : "" + params?.row?.phone || emptyValue}
        </div>
      ),
    },
    {
      headerName: "CREATED ON",
      field: "createdAt",
      width: 230,
    },
    {
      field: "updatedAt",
      headerName: "UPDATED ON",
      width: 230,
    },
  ];

  const handleDelete = () => {
    dispatch(deleteAccountsByIdAndGetAllAccounts(selectedRowKeys, params));
    setSelectedRowKeys([]);
  };
  const onTabChange = (key: string) => {
    setParams({ ...params, view: key });
  };
  useEffect(() => {
    dispatch(fetchAllAccounts(params));
  }, [params]);

  console.log("tota kjhgf", totalAccounts)

  useEffect(() => {
    dispatch(resetAccount());
    dispatch(resetAccounts());
    dispatch(getUserById());
  }, [dispatch]);

  return (
    <>
      <div className="addAccountModalWrapper">
        <Modal
          open={isModalOpenAccount}
          onOk={handleSubmit}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="addAccountFormDiv">
            <div className="addAccountTitle">New Company</div>
            <div className="addOpportunityFormWrapper">
              <Form
                form={form}
                name="loginForm"
                onFinish={handleSubmit}
                initialValues={account}
              >
                <AddAccountForm />
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
                    loading={addAccountLoader}
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
        <div className="accountsListToolbarWrapper">
          <div className="accountsListToolbarItem">
            <div className="tableTitleIconWrapper">
              <img
                src={ACCOUNT_ICON_ORANGE}
                alt="illustration"
                className="illustrationIcon"
              />
              {companyToken}
            </div>
            {screenWidth < 768 ? (
              <Tooltip title={"Add new referral"}>
                <PlusOutlined onClick={showModal} />
              </Tooltip>
            ) : (
              <Button onClick={showModal} className="addAccountModalBtn">
                New
              </Button>
            )}
            <div>
              {selectedRowKeys.length > 0 ? (
                <div className="leadsDeleteBottomBar">
                  <Popconfirm
                    title="Delete this Company"
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
              placeholder="search here new.."
              name="searchText"
              onChange={(e) => onSearch(e.target.value)}
              value={params?.search}
            />
            <Button onClick={handleReset} className="resetFilterBtn">
              Reset filters
            </Button>
            <div className="opportunitiesSwitchDiv">
              {view === "card" ? (
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
                  onClick={() => onListClick("card")}
                >
                  <IdcardOutlined />
                  Card
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs onChange={onTabChange} type="card">
          <Tabs.TabPane key={"myView"} tab={`My ${companyToken}`}>
            {" "}
            <div className="accountsViewWapper">
              {view === "card" && loading ? (
                <Skeleton />
              ) : accounts?.length > 0 && view === "card" && !loading ? (
                <div className="accountsListWrapper">
                  {accounts?.map((accountItem, index) => {
                    return (
                      <>
                        <div
                          key={index}
                          className="accountBox"
                          onClick={() => onBoxClick(accountItem)}
                        >
                          <Avatar className="accountAvtar">
                            {accountItem?.accountName?.slice(0, 1)}
                          </Avatar>
                          <div className="accountBoxInfo">
                            <div className="accountBoxInfo1">
                              {accountItem?.accountName}
                            </div>
                            <div className="accountBoxInfo2">
                              {`${accountItem?.city} ,${accountItem?.country}`}
                            </div>
                            <div className="accountBoxInfo2">
                              {accountItem?.website}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              ) : view === "list" ? (
                <div style={{ height: "75vh" }}>
                  <DataGrid
                    rows={accounts}
                    columns={columns}
                    loading={loading || addAccountLoader || getAccountLoader}
                    key={"accountId"}
                    getRowId={(row) => row?.accountId}
                    checkboxSelection={user?.role === "ADMIN" ? true : false}
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
                    rowCount={totalAccounts > 0 ? totalAccounts : 0} // Set the total number of rows
                  />
                </div>
              ) : (
                <div>No Accounts Found</div>
              )}
            </div>
          </Tabs.TabPane>
          {user?.role === "SALESPERSON" ? null : (
            <Tabs.TabPane key={"myTeamView"} tab={`All ${companyToken}`}>
              {" "}
              <div className="accountsViewWapper">
                {view === "card" && loading ? (
                  <Skeleton />
                ) : accounts?.length > 0 && view === "card" && !loading ? (
                  <div className="accountsListWrapper">
                    {accounts?.map((accountItem, index) => {
                      return (
                        <>
                          <div
                            key={index}
                            className="accountBox"
                            onClick={() => onBoxClick(accountItem)}
                          >
                            <Avatar className="accountAvtar">
                              {accountItem?.accountName?.slice(0, 1)}
                            </Avatar>
                            <div className="accountBoxInfo">
                              <div className="accountBoxInfo1">
                                {accountItem?.accountName}
                              </div>
                              <div className="accountBoxInfo2">
                                {`${accountItem?.city} ,${accountItem?.country}`}
                              </div>
                              <div className="accountBoxInfo2">
                                {accountItem?.website}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                ) : view === "list" ? (
                  <div style={{ height: "75vh" }}>
                    <DataGrid
                      rows={accounts}
                      columns={columns}
                      loading={loading || addAccountLoader || getAccountLoader}
                      key={"accountId"}
                      getRowId={(row) => row?.accountId}
                      checkboxSelection={user?.role === "ADMIN" ? true : false}

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
                      rowCount={totalAccounts > 0 ? totalAccounts : 0} // Set the total number of rows
                    />
                  </div>
                ) : (
                  <div>No Accounts Found</div>
                )}
              </div>
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default AllAccounts;
