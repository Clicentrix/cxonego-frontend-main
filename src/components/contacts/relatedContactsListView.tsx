import { useEffect, useState } from "react";
import { Input, Popconfirm, Form, Modal, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/activities/activitiesListView.css";
import "../../styles/oppotunities/opportunitiesListView.css";
import "../../styles/horizontalFunctions/filterDropdown.css";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import {
  DataGrid,
  GridCellParams,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
  createAndGetAllContactsByModuleId,
  deleteContactsByIdAndGetAllContactsByModuleId,
  fetchAllContactsByModuleId,
  handleInputChangeReducerContact,
  resetContact,
  resetContacts,
  resetIsModalOpenContact,
} from "../../redux/features/contactsSlice";
import AddContactForm from "./addContactForm";
import { CONTACT_ICON_ORANGE } from "../../utilities/common/imagesImports";
import { Contact } from "../../utilities/common/exportDataTypes/contactsDataTypes";

const AllRelatedContacts = ({
  moduleName,
  moduleId,
}: {
  moduleName: string;
  moduleId: string;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    contacts,
    loading,
    contact,
    addContactLoader,
    getContactLoader,
    isModalOpenContact,
    totalContacts
  } = useAppSelector((state: RootState) => state.contacts);
  const { user } = useAppSelector((state: RootState) => state.authentication);

  const initialParams = {
    page: 1,
    limit: 10,
    search: "",
  };
  const [params, setParams] = useState(initialParams);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);

  const handleDelete = () => {
    dispatch(
      deleteContactsByIdAndGetAllContactsByModuleId(
        selectedRowKeys,
        params,
        moduleName,
        moduleId
      )
    );
    setSelectedRowKeys([]);
  };

  const handleSubmit = async () => {
    if (moduleId) {
      await dispatch(
        createAndGetAllContactsByModuleId(
          { ...contact, company: moduleId },
          params,
          moduleName,
          moduleId
        )
      );
    }
    await dispatch(resetIsModalOpenContact(false));
    form.resetFields();
  };

  const onSearch = (value: string) => {
    setParams({ ...params, search: value });
  };

  const handlePaginationChange = (paginationModel: GridPaginationModel) => {
    setParams({
      ...params,
      page: paginationModel.page + 1, // MUI DataGrid uses 0-based index for pages
      limit: paginationModel.pageSize,
    });
  };

  useEffect(() => {
    dispatch(fetchAllContactsByModuleId({ moduleName, moduleId, params }));
  }, [params]);

  useEffect(() => {
    dispatch(resetContact());
    dispatch(resetContacts());
  }, [dispatch]);

  const columns = [
    {
      headerName: "FAVOURITE",
      width: 100,
      field: "favourite",
      renderCell: (params: GridCellParams) =>
        params?.row?.favourite === "Yes" ? (
          <StarFilled style={{ color: "var(--orange-color" }} />
        ) : (
          <StarOutlined />
        ),
    },
    {
      headerName: "FIRST NAME",
      field: "firstName",
      width: 200,
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.firstName || emptyValue}
        </div>
      ),
    },
    {
      headerName: "LAST NAME",
      field: "lastName",
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.lastName || emptyValue}
        </div>
      ),
      width: 150,
    },
    {
      headerName: "DESIGNATION",
      field: "designation",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.designation || emptyValue}</div>
      ),
      width: 130,
    },
    {
      headerName: "CONTACT NO.",
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
      width: 200,
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
      headerName: "DESCRIPTION",
      field: "description",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.description || emptyValue}</div>
      ),
      width: 220,
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
      width: 200,
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
      headerName: "OWNER",
      field: "owner",
      width: 240,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.owner || emptyValue}</div>
      ),
    },
    {
      headerName: "INDUSTRY",
      field: "industry",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.industry || emptyValue}</div>
      ),
      width: 130,
    },
    {
      headerName: "STATUS",
      field: "status",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.status || emptyValue}</div>
      ),
      width: 130,
    },
    {
      headerName: "CONTACT TYPE",
      field: "contactType",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.contactType || emptyValue}</div>
      ),
      width: 150,
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
    dispatch(resetIsModalOpenContact(true));
    form.resetFields();
    form.setFieldsValue({ company: moduleId });
    dispatch(
      handleInputChangeReducerContact({ ...contact, company: moduleId })
    );
  };

  const handleCancel = () => {
    dispatch(resetIsModalOpenContact(false));
    form.resetFields();
  };

  const handleReset = () => {
    setParams(initialParams);
  };
  const onBoxClick = (contact: Contact) => {
    navigate(`/contact/${contact?.contactId}`);
  };
  const hyperlink = (contactId: string, link: string) => {
    navigate(`/${link}/${contactId}`);
  };

  return (
    <>
      <div className="addActivityModalWrapper">
        <Modal
          open={isModalOpenContact}
          onOk={handleSubmit}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="addContactFormDiv">
            <div className="addContactTitle">New Contact</div>

            <div className="addContactFormWrapper">
              <Form form={form} name="loginForm" onFinish={handleSubmit}>
                <AddContactForm />
                <Form.Item className="addContactSubmitBtnWrapper">
                  <Button
                    onClick={handleCancel}
                    className="addContactCancelBtn"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="addContactSubmitBtn"
                    loading={addContactLoader}
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
        <div className="activitiesListToolbarWrapper">
          <div className="tableTitleIconWrapper">
            <img
              src={CONTACT_ICON_ORANGE}
              alt="illustration"
              className="illustrationIcon"
            />
            Related Contacts
            <Button onClick={showModal} className="addOpportunityModalBtn">
              New
            </Button>
          </div>

          {selectedRowKeys.length > 0 ? (
            <div className="activityDeleteBottomBar">
              <Popconfirm
                title="Delete the activity"
                description="Are you sure you want to delete this record?"
                onConfirm={handleDelete}
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
            rows={contacts}
            loading={loading || addContactLoader || getContactLoader}
            key={"contactId"}
            getRowId={(row) => row?.contactId}
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
            rowCount={totalContacts > 0 ? totalContacts : 0} // Set the total number of rows
          />
        </div>
      </div>
    </>
  );
};

export default AllRelatedContacts;
