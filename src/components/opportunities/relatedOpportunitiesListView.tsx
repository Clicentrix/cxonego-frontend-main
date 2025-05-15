import { useEffect, useState } from "react";
import { Input, Popconfirm, Form, Modal, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/leads/leadsListView.css";
import "../../styles/oppotunities/opportunitiesListView.css";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import {
  DataGrid,
  GridCellParams,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
  createAndGetAllOpportunitiesByModuleId,
  deleteOpportunitiesByIdAndGetAllOpportunitiesByModuleId,
  fetchAllOpportunitiesByModuleId,
  handleInputChangeReducerOpportunity,
  resetOpportunities,
  resetOpportunity,
} from "../../redux/features/opportunitiesSlice";
import AddOpportunityForm from "./addOpportunityForm";
import { Opportunity } from "../../utilities/common/exportDataTypes/opportunityDataTypes";
import { OPPOTUNITIES_ICON_ORANGE } from "../../utilities/common/imagesImports";
import moment from "moment";
import { getUserById } from "../../redux/features/authenticationSlice";

const AllRelatedOpportunities = ({
  moduleName,
  moduleId,
}: {
  moduleName: string;
  moduleId: string;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    opportunities,
    loading,
    addOpportunityLoader,
    opportunity,
    getOpportunityLoader,
    totalOpportunities
  } = useAppSelector((state: RootState) => state.opportunities);
  const { user } = useAppSelector((state: RootState) => state.authentication);
  const initialParams = {
    page: 1,
    limit: 10,
    search: "",
  };
  const [params, setParams] = useState(initialParams);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDelete = () => {
    dispatch(
      deleteOpportunitiesByIdAndGetAllOpportunitiesByModuleId(
        selectedRowKeys,
        params,
        moduleName,
        moduleId
      )
    );
    setSelectedRowKeys([]);
  };

  const handleSubmit = () => {
    if (moduleId) {
      if (moduleName === "account") {
        dispatch(
          createAndGetAllOpportunitiesByModuleId(
            { ...opportunity, company: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      } else {
        dispatch(
          createAndGetAllOpportunitiesByModuleId(
            { ...opportunity, contact: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      }
      setIsModalOpen(false);
      form.resetFields();
    }
  };

  const onSearch = (value: string) => {
    setParams({ ...params, search: value });
  };

  useEffect(() => {
    dispatch(fetchAllOpportunitiesByModuleId({ moduleName, moduleId, params }));
  }, [params]);

  useEffect(() => {
    dispatch(resetOpportunity());
    dispatch(resetOpportunities());
    dispatch(getUserById());
  }, [dispatch]);

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
          return <div className="hyperlinkBlue">{emptyValue}</div>;
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
          return <div className="hyperlinkBlue">{emptyValue}</div>;
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
    setIsModalOpen(true);
    form.resetFields();
    form.setFieldsValue({
      ...opportunity,
      company: moduleName === "account" ? moduleId : opportunity?.company,
      contact: moduleName === "contact" ? moduleId : opportunity?.contact,
    });
    dispatch(
      handleInputChangeReducerOpportunity({
        ...opportunity,
        company: moduleName === "account" ? moduleId : opportunity?.company,
        contact: moduleName === "contact" ? moduleId : opportunity?.contact,
      })
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleReset = () => {
    setParams(initialParams);
  };
  const onBoxClick = (opportunity: Opportunity) => {
    navigate(`/opportunity/${opportunity?.opportunityId}`);
  };
  const hyperlink = (id: string, link: string) => {
    navigate(`/${link}/${id}`);
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
      <div className="addActivityModalWrapper">
        <Modal
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="addLeadFormDiv">
            <div className="addLeadFormWrapper">
              <Form form={form} name="loginForm" onFinish={handleSubmit}>
                <AddOpportunityForm />
                <Form.Item className="addLeadSubmitBtnWrapper">
                  <Button onClick={handleCancel} className="addLeadCancelBtn">
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="addLeadSubmitBtn"
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
      <div className="relatedListViewBackWrapper">
        <div className="leadsListToolbarWrapper">
          <div className="leadsListToolbarItem">
            <div className="tableTitleIconWrapper">
              <img
                src={OPPOTUNITIES_ICON_ORANGE}
                alt="illustration"
                className="illustrationIcon"
              />
              Related Opportunities
            </div>
            <Button onClick={showModal} className="addLeadModalBtn">
              New
            </Button>
            <div>
              {selectedRowKeys.length > 0 ? (
                <div className="leadsDeleteBottomBar">
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
              style={{ border: "1px solid var(--gray5)", padding: "2px 5px" }}
              value={params?.search}
            />
            <Button onClick={handleReset} className="resetFilterBtn">
              Reset filters
            </Button>
          </div>
        </div>
        <div style={{ height: "50vh" }}>
          <DataGrid
            rows={opportunities?.map((item: Opportunity) => {
              return {
                ...item, estimatedRevenue: parseFloat(item?.estimatedRevenue!),
                actualRevenue: parseFloat(item?.actualRevenue!)
              }
            })}
            loading={loading || addOpportunityLoader || getOpportunityLoader}
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
      </div>
    </>
  );
};

export default AllRelatedOpportunities;
