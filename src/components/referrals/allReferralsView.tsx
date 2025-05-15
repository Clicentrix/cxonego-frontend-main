import { useEffect, useState } from "react";
import {
  Input,
  Popconfirm,
  Form,
  Modal,
  Button,
  Skeleton,
  Avatar,
  Tooltip,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/referrals/referralsListView.css";
import { TableOutlined, IdcardOutlined, PlusOutlined } from "@ant-design/icons";

import "../../styles/horizontalFunctions/filterDropdown.css";
import { useNavigate } from "react-router-dom";

import { Referral } from "../../utilities/common/exportDataTypes/referralsDataTypes";
import AddReferralForm from "./addReferralForm";
import {
  createAndGetAllReferrals,
  deleteReferralsByIdAndGetAllReferralsTotal,
  fetchAllReferrals,
  resetReferral,
  resetReferrals,
} from "../../redux/features/referralsSlice";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import {
  DataGrid,
  GridCellParams,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { REFERALS_ICON_ORANGE } from "../../utilities/common/imagesImports";
import { getUserById } from "../../redux/features/authenticationSlice";

const AllReferralsView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState<string>("list");
  const { loading, addReferralLoader, referral, getReferralLoader, referrals, totalReferrals } =
    useAppSelector((state: RootState) => state.referrals);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const { user } = useAppSelector((state: RootState) => state.authentication);

  const initialParams = {
    page: 1,
    limit: 10,
    search: "",
    createdAt: "DESC",
    updatedAt: "DESC",
    filterParams: {
      company: [],
      status: [],
      dateRange: {
        startDate: "",
        endDate: "",
      },
    },
  };
  const [params, setParams] = useState(initialParams);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDelete = () => {
    dispatch(
      deleteReferralsByIdAndGetAllReferralsTotal(selectedRowKeys, params)
    );
    setSelectedRowKeys([]);
  };

  const handleSubmit = () => {
    dispatch(createAndGetAllReferrals(referral, params));
    setIsModalOpen(false);
    form.resetFields();
  };

  const onSearch = (value: string) => {
    setParams({ ...params, search: value });
  };

  useEffect(() => {
    dispatch(fetchAllReferrals(params));
  }, [params]);

  useEffect(() => {
    dispatch(resetReferral());
    dispatch(resetReferrals());
    dispatch(getUserById());
  }, [dispatch]);

  const onBoxClick = (referral: Referral) => {
    navigate(`/referrals/${referral?.referId}`);
  };

  const columns = [
    {
      headerName: "REFERRAL NUMBER",
      field: "referIdForUsers",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.referIdForUsers || emptyValue}
        </div>
      ),
    },
    {
      headerName: "FIRST NAME",
      field: "firstName",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.firstName || emptyValue}
        </div>
      ),
    },
    {
      headerName: "LAST NAME",
      field: "lastName",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.lastName || emptyValue}
        </div>
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
      headerName: "PHONE",
      field: "phone",
      width: 130,
      renderCell: (params: GridCellParams) => (
        <div>
          {params?.row?.countryCode
            ? params?.row?.countryCode + params?.row?.phone
            : "" + params?.row?.phone || emptyValue}
        </div>
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
      headerName: "REFERRED BY",
      field: "referBy",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.referBy || emptyValue}</div>
      ),
    },
    {
      headerName: "STATUS",
      field: "status",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.status || emptyValue}</div>
      ),
      width: 100,
    },
    {
      headerName: "DESCRIPTION",
      field: "description",
      width: 200,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.description || emptyValue}</div>
      ),
    },
    {
      headerName: "COMPANY",
      field: "company",
      width: 200,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.company || emptyValue}</div>
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
      <div className="addReferralModalWrapper">
        <Modal
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="addReferralFormDiv">
            <div className="addReferralTitle">New Referral</div>

            <div className="addReferralFormWrapper">
              <Form form={form} name="loginForm" onFinish={handleSubmit}>
                <AddReferralForm />
                <Form.Item className="addReferralSubmitBtnWrapper">
                  <Button
                    onClick={handleCancel}
                    className="addReferralCancelBtn"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="addReferralSubmitBtn"
                    loading={addReferralLoader}
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
        <div className="referralsListToolbarWrapper">
          <div className="tableTitleIconWrapper">
            <img
              src={REFERALS_ICON_ORANGE}
              alt="illustration"
              className="illustrationIcon"
            />
            Referrals
            {screenWidth < 768 ? (
              <Tooltip title={"Add new referral"}>
                <PlusOutlined onClick={showModal} />
              </Tooltip>
            ) : (
              <Button onClick={showModal} className="addLeadModalBtn">
                New
              </Button>
            )}
          </div>
          {/* <div className="opportunitiesListToolbarItem">
          </div> */}
          {selectedRowKeys.length > 0 ? (
            <div className="referralDeleteBottomBar">
              <Popconfirm
                title="Delete the referral"
                description="Are you sure you want to delete this record?"
                onConfirm={handleDelete}
                // onCancel={onCancelDeletePopup}
                okText="Yes"
                cancelText="Cancel"
              >
                <Button type="primary" danger style={{ marginLeft: "10px" }}>
                  Delete selected
                </Button>
              </Popconfirm>
            </div>
          ) : null}
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
        <div className="contactsViewWapper">
          {view === "card" && loading ? (
            <Skeleton />
          ) : referrals?.length > 0 && view === "card" && !loading ? (
            <div className="contactsListWrapper">
              {referrals?.map((referralItem, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="contactBox"
                      onClick={() => onBoxClick(referralItem)}
                    >
                      <div className="contactBoxInfo">
                        <Avatar className="accountAvtar">
                          {referralItem?.firstName?.slice(0, 1)}{" "}
                          {referralItem?.lastName?.slice(0, 1)}
                        </Avatar>
                        <div>
                          <div className="contactBoxInfo1">
                            {`${referralItem?.firstName} ${referralItem?.lastName}`}
                          </div>
                          <div className="contactBoxInfo2">
                            {`${referralItem?.company}`}
                          </div>
                          <div className="contactBoxInfo2">
                            {referralItem?.phone}
                          </div>
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
                rows={referrals}
                columns={columns}
                loading={loading || addReferralLoader || getReferralLoader}
                key={"referId"}
                getRowId={(row) => row?.referId}
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
                rowCount={totalReferrals > 0 ? totalReferrals : 0} // Set the total number of rows
              />
            </div>
          ) : (
            <div>No Referrals Found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllReferralsView;
