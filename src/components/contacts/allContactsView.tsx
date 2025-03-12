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
import "../../styles/contacts/contactsView.css";
import { useEffect, useState } from "react";
import type { SearchProps } from "antd/es/input/Search";
import {
  TableOutlined,
  IdcardOutlined,
  StarOutlined,
  StarFilled,
  PlusOutlined,
} from "@ant-design/icons";
import {
  createAndGetAllContacts,
  deleteContactsByIdAndGetAllContacts,
  emptyContact,
  fetchAllContacts,
  handleInputChangeReducerContact,
  resetContact,
  resetContacts,
  resetIsModalOpenContact,
} from "../../redux/features/contactsSlice";
import { Contact } from "../../utilities/common/exportDataTypes/contactsDataTypes";
import { CONTACT_ICON_ORANGE } from "../../utilities/common/imagesImports";
import AddContactForm from "./addContactForm";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { fetchAllAccountsWithoutParams } from "../../redux/features/accountsSlice";
import {
  DataGrid,
  GridCellParams,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { getUserById } from "../../redux/features/authenticationSlice";
// Define the AllAccounts component with the onBoxClick prop

const AllContacts = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [view, setView] = useState<string>("list");
  const {
    contacts,
    loading,
    contact,
    addContactLoader,
    getContactLoader,
    isModalOpenContact,
    totalContacts
  } = useAppSelector((state: RootState) => state.contacts);
  const { accountForLookup } = useAppSelector(
    (state: RootState) => state.accounts
  );

  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const { user } = useAppSelector((state: RootState) => state.authentication);
  const contactToken = user?.organisation && user?.organisation?.contactToken
    ? ` ${user.organisation.contactToken}`
    : " Contacts"
  const initialParams = {
    page: 1,
    limit: 10,
    search: "",
    view: "myView",
  };
  const [params, setParams] = useState(initialParams);
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);

  const onTabChange = (key: string) => {
    setParams({ ...params, view: key });
  };
  const onBoxClick = (contact: Contact) => {
    navigate(`/contact/${contact?.contactId}`);
  };

  const hyperlink = (contactId: string, link: string) => {
    navigate(`/${link}/${contactId}`);
  };

  const columns = [
    {
      headerName: "CONTACT NUMBER",
      field: "contactIdForUsers",
      width: 200,
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue" onClick={() => onBoxClick(params?.row)}>
          {params?.row?.contactIdForUsers || emptyValue}
        </div>
      ),
    },
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
                  company.split("/")?.length > 0 ? company?.split("/")[1] : "",
                  "account"
                )
              }
              className="hyperlinkBlue"
            >
              {company?.split("/")?.length > 0
                ? company?.split("/")[0]
                : emptyValue}
            </div>
          );
        } else {
          return <div>{emptyValue}</div>;
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

  const handleDelete = () => {
    dispatch(deleteContactsByIdAndGetAllContacts(selectedRowKeys, params));
    setSelectedRowKeys([]);
  };

  const handleCancel = () => {
    dispatch(resetIsModalOpenContact(false));
    form.resetFields();
  };
  const showModal = () => {
    dispatch(resetIsModalOpenContact(true));
    form.resetFields();
  };
  const handleSubmit = () => {
    dispatch(createAndGetAllContacts(contact, params));
    dispatch(resetIsModalOpenContact(false));
    form.resetFields();
  };
  const onSearch: SearchProps["onSearch"] = (value) => {
    setParams({ ...params, search: value });
  };

  const onListClick = (value: string) => {
    setView(value);
  };

  const handleReset = () => {
    setParams(initialParams);
  };

  const handlePaginationChange = (paginationModel: GridPaginationModel) => {
    setParams({
      ...params,
      page: paginationModel.page + 1, // MUI DataGrid uses 0-based index for pages
      limit: paginationModel.pageSize,
    });
  };
  useEffect(() => {
    dispatch(fetchAllContacts(params));
  }, [params]);

  useEffect(() => {
    dispatch(resetContact());
    dispatch(resetContacts());
    dispatch(fetchAllAccountsWithoutParams());
    dispatch(getUserById());
  }, [dispatch]);

  useEffect(() => {
    if (accountForLookup?.accountId !== "") {
      form.setFieldsValue({ company: accountForLookup?.accountId });
      dispatch(
        handleInputChangeReducerContact({
          company: accountForLookup?.accountId,
        })
      );
    } else {
      form.setFieldsValue(emptyContact);
    }
  }, [accountForLookup]);

  return (
    <>
      <div className="addContactModalWrapper">
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
      <div className="listViewBackWrapper">
        <div className="contactsListToolbarWrapper">
          <div className="contactsListToolbarItem">
            <div className="tableTitleIconWrapper">
              <img
                src={CONTACT_ICON_ORANGE}
                alt="illustration"
                className="illustrationIcon"
              />
              {contactToken}
            </div>

            {screenWidth < 768 ? (
              <Tooltip title={"Add new Contact"}>
                <PlusOutlined onClick={showModal} />
              </Tooltip>
            ) : (
              <Button onClick={showModal} className="addContactModalBtn">
                New
              </Button>
            )}
            {selectedRowKeys.length > 0 ? (
              <div className="leadsDeleteBottomBar">
                <Popconfirm
                  title="Delete this Contact"
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
          <Tabs.TabPane key={"myView"} tab={`My ${contactToken}`}>
            <div className="contactsViewWapper">
              {view === "card" && loading ? (
                <Skeleton />
              ) : contacts?.length > 0 && view === "card" && !loading ? (
                <div className="contactsListWrapper">
                  {contacts?.map((contactItem, index) => {
                    return (
                      <>
                        <div
                          key={index}
                          className="contactBox"
                          onClick={() => onBoxClick(contactItem)}
                        >
                          <Avatar className="contactAvtar">
                            {contactItem?.firstName?.slice(0, 1)?.toUpperCase()}
                          </Avatar>
                          <div className="contactBoxInfo">
                            <div className="contactBoxInfo1">
                              {`${contactItem?.firstName} ${contactItem?.lastName}`}
                            </div>
                            <div className="contactBoxInfo2">
                              {`${contactItem?.city} ,${contactItem?.country}`}
                            </div>
                            <div className="contactBoxInfo2">
                              {contactItem?.state}
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
              ) : (
                <div>No Contacts Found</div>
              )}
            </div>
          </Tabs.TabPane>
          {user?.role === "SALESPERSON" ? null : (
            <Tabs.TabPane key={"myTeamView"} tab={`All ${contactToken}`}>
              {" "}
              <div className="contactsViewWapper">
                {view === "card" && loading ? (
                  <Skeleton />
                ) : contacts?.length > 0 && view === "card" && !loading ? (
                  <div className="contactsListWrapper">
                    {contacts?.map((contactItem, index) => {
                      return (
                        <>
                          <div
                            key={index}
                            className="contactBox"
                            onClick={() => onBoxClick(contactItem)}
                          >
                            <Avatar className="contactAvtar">
                              {contactItem?.firstName
                                ?.slice(0, 1)
                                ?.toUpperCase()}
                            </Avatar>
                            <div className="contactBoxInfo">
                              <div className="contactBoxInfo1">
                                {`${contactItem?.firstName} ${contactItem?.lastName}`}
                              </div>
                              <div className="contactBoxInfo2">
                                {`${contactItem?.city} ,${contactItem?.country}`}
                              </div>
                              <div className="contactBoxInfo2">
                                {contactItem?.state}
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
                ) : (
                  <div>No Contacts Found</div>
                )}
              </div>
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default AllContacts;
