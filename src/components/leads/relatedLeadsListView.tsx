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
  createAndGetAllLeadsByModuleId,
  deleteLeadsByIdAndGetAllLeadsByModuleId,
  fetchAllLeadsByModuleId,
  handleInputChangeReducerLead,
  resetLead,
  resetLeads,
} from "../../redux/features/leadSlice";
import { Lead } from "../../utilities/common/exportDataTypes/leadDataTypes";
import AddLeadForm from "./addLeadForm";
import { LEADS_ICON_ORANGE } from "../../utilities/common/imagesImports";

const AllRelatedLeads = ({
  moduleName,
  moduleId,
}: {
  moduleName: string;
  moduleId: string;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { leads, loading, addLeadLoader, lead, getLeadLoader, totalLeads } = useAppSelector(
    (state: RootState) => state.leads
  );
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
      deleteLeadsByIdAndGetAllLeadsByModuleId(
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
          createAndGetAllLeadsByModuleId(
            { ...lead, company: moduleId },
            params,
            moduleName,
            moduleId
          )
        );
      } else {
        dispatch(
          createAndGetAllLeadsByModuleId(
            { ...lead, contact: moduleId },
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
    dispatch(fetchAllLeadsByModuleId({ moduleName, moduleId, params }));
  }, [params]);

  useEffect(() => {
    dispatch(resetLead());
    dispatch(resetLeads());
  }, [dispatch]);

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
                  company?.split("/").length > 0 ? company?.split("/")[1] : "",
                  "account"
                )
              }
              className="hyperlinkBlue"
            >
              {company?.split("/").length > 0
                ? company?.split("/")[0]
                : company || emptyValue}
            </div>
          );
        } else {
          return <div className="hyperlinkBlue">{emptyValue}</div>;
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
        <div>{params?.row?.price || emptyValue}</div>
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

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
    form.setFieldsValue({
      ...lead,
      company: moduleName === "account" ? moduleId : lead?.company,
      contact: moduleName === "contact" ? moduleId : lead?.contact,
    });
    dispatch(
      handleInputChangeReducerLead({
        ...lead,
        company: moduleName === "account" ? moduleId : lead?.company,
        contact: moduleName === "contact" ? moduleId : lead?.contact,
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
  const onBoxClick = (lead: Lead) => {
    navigate(`/lead/${lead?.leadId}`);
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
                <AddLeadForm />
                <Form.Item className="addLeadSubmitBtnWrapper">
                  <Button onClick={handleCancel} className="addLeadCancelBtn">
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="addLeadSubmitBtn"
                    loading={addLeadLoader}
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
                src={LEADS_ICON_ORANGE}
                alt="illustration"
                className="illustrationIcon"
              />
              Related Leads
            </div>
            <Button onClick={showModal} className="addLeadModalBtn">
              New
            </Button>
            <div>
              {selectedRowKeys.length > 0 ? (
                <div className="leadsDeleteBottomBar">
                  <Popconfirm
                    title="Delete the Lead"
                    description="Are you sure you want to delete this record?"
                    onConfirm={handleDelete}
                    // onCancel={onCancelDeletePopup}
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
            rows={leads?.map((item: Lead) => {
              return {
                ...item, price: parseFloat(item?.price!)
              }
            })}
            loading={loading || addLeadLoader || getLeadLoader}
            key={"leadId"}
            getRowId={(row) => row?.leadId}
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
            rowCount={totalLeads > 0 ? totalLeads : 0} // Set the total number of rows
          />
        </div>
      </div>
    </>
  );
};

export default AllRelatedLeads;
