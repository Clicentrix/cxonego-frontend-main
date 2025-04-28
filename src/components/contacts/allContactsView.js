import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, Button, Form, Input, Modal, Popconfirm, Skeleton, Tabs, Tooltip, } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/contacts/contactsView.css";
import { useEffect, useState } from "react";
import { TableOutlined, IdcardOutlined, StarOutlined, StarFilled, PlusOutlined, } from "@ant-design/icons";
import { createAndGetAllContacts, deleteContactsByIdAndGetAllContacts, emptyContact, fetchAllContacts, handleInputChangeReducerContact, resetContact, resetContacts, resetIsModalOpenContact, } from "../../redux/features/contactsSlice";
import { CONTACT_ICON_ORANGE } from "../../utilities/common/imagesImports";
import AddContactForm from "./addContactForm";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { fetchAllAccountsWithoutParams } from "../../redux/features/accountsSlice";
import { DataGrid, } from "@mui/x-data-grid";
import { getUserById } from "../../redux/features/authenticationSlice";
// Define the AllAccounts component with the onBoxClick prop
const AllContacts = () => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [view, setView] = useState("list");
    const { contacts, loading, contact, addContactLoader, getContactLoader, isModalOpenContact, totalContacts } = useAppSelector((state) => state.contacts);
    const { accountForLookup } = useAppSelector((state) => state.accounts);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const { user } = useAppSelector((state) => state.authentication);
    const contactToken = user?.organisation && user?.organisation?.contactToken
        ? ` ${user.organisation.contactToken}`
        : " Contacts";
    const initialParams = {
        page: 1,
        limit: 10,
        search: "",
        view: "myView",
    };
    const [params, setParams] = useState(initialParams);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onTabChange = (key) => {
        setParams({ ...params, view: key });
    };
    const onBoxClick = (contact) => {
        navigate(`/contact/${contact?.contactId}`);
    };
    const hyperlink = (contactId, link) => {
        navigate(`/${link}/${contactId}`);
    };
    const columns = [
        {
            headerName: "CONTACT NUMBER",
            field: "contactIdForUsers",
            width: 200,
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.contactIdForUsers || emptyValue })),
        },
        {
            headerName: "FAVOURITE",
            width: 100,
            field: "favourite",
            renderCell: (params) => params?.row?.favourite === "Yes" ? (_jsx(StarFilled, { style: { color: "var(--orange-color" } })) : (_jsx(StarOutlined, {})),
        },
        {
            headerName: "FIRST NAME",
            field: "firstName",
            width: 200,
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.firstName || emptyValue })),
        },
        {
            headerName: "LAST NAME",
            field: "lastName",
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.lastName || emptyValue })),
            width: 150,
        },
        {
            headerName: "DESIGNATION",
            field: "designation",
            renderCell: (params) => (_jsx("div", { children: params?.row?.designation || emptyValue })),
            width: 130,
        },
        {
            headerName: "CONTACT NO.",
            field: "phone",
            renderCell: (params) => (_jsx("div", { children: params?.row?.countryCode
                    ? params?.row?.countryCode + params?.row?.phone
                    : "" + params?.row?.phone || emptyValue })),
            width: 150,
        },
        {
            headerName: "EMAIL",
            field: "email",
            renderCell: (params) => (_jsx("div", { children: params?.row?.email || emptyValue })),
            width: 220,
        },
        {
            headerName: "COMPANY",
            field: "company",
            width: 200,
            renderCell: (params) => {
                const company = params?.row?.company;
                if (typeof company === "string") {
                    return (_jsx("div", { onClick: () => hyperlink(company.split("/")?.length > 0 ? company?.split("/")[1] : "", "account"), className: "hyperlinkBlue", children: company?.split("/")?.length > 0
                            ? company?.split("/")[0]
                            : emptyValue }));
                }
                else {
                    return _jsx("div", { children: emptyValue });
                }
            },
        },
        {
            headerName: "DESCRIPTION",
            field: "description",
            renderCell: (params) => (_jsx("div", { children: params?.row?.description || emptyValue })),
            width: 220,
        },
        {
            headerName: "COUNTRY",
            field: "country",
            renderCell: (params) => (_jsx("div", { children: params?.row?.country || emptyValue })),
            width: 150,
        },
        {
            headerName: "STATE",
            field: "state",
            renderCell: (params) => (_jsx("div", { children: params?.row?.state || emptyValue })),
            width: 200,
        },
        {
            headerName: "CITY",
            field: "city",
            renderCell: (params) => (_jsx("div", { children: params?.row?.city || emptyValue })),
            width: 150,
        },
        {
            headerName: "OWNER",
            field: "owner",
            width: 240,
            renderCell: (params) => (_jsx("div", { children: params?.row?.owner || emptyValue })),
        },
        {
            headerName: "INDUSTRY",
            field: "industry",
            renderCell: (params) => (_jsx("div", { children: params?.row?.industry || emptyValue })),
            width: 130,
        },
        {
            headerName: "STATUS",
            field: "status",
            renderCell: (params) => (_jsx("div", { children: params?.row?.status || emptyValue })),
            width: 130,
        },
        {
            headerName: "CONTACT TYPE",
            field: "contactType",
            renderCell: (params) => (_jsx("div", { children: params?.row?.contactType || emptyValue })),
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
    const onSearch = (value) => {
        setParams({ ...params, search: value });
    };
    const onListClick = (value) => {
        setView(value);
    };
    const handleReset = () => {
        setParams(initialParams);
    };
    const handlePaginationChange = (paginationModel) => {
        setParams({
            ...params,
            page: paginationModel.page + 1,
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
            dispatch(handleInputChangeReducerContact({
                company: accountForLookup?.accountId,
            }));
        }
        else {
            form.setFieldsValue(emptyContact);
        }
    }, [accountForLookup]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "addContactModalWrapper", children: _jsx(Modal, { open: isModalOpenContact, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addContactFormDiv", children: [_jsx("div", { className: "addContactTitle", children: "New Contact" }), _jsx("div", { className: "addContactFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, children: [_jsx(AddContactForm, {}), _jsxs(Form.Item, { className: "addContactSubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addContactCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addContactSubmitBtn", loading: addContactLoader, children: "Save" })] })] }) })] }) }) }), _jsxs("div", { className: "listViewBackWrapper", children: [_jsxs("div", { className: "contactsListToolbarWrapper", children: [_jsxs("div", { className: "contactsListToolbarItem", children: [_jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx("img", { src: CONTACT_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), contactToken] }), screenWidth < 768 ? (_jsx(Tooltip, { title: "Add new Contact", children: _jsx(PlusOutlined, { onClick: showModal }) })) : (_jsx(Button, { onClick: showModal, className: "addContactModalBtn", children: "New" })), selectedRowKeys.length > 0 ? (_jsx("div", { className: "leadsDeleteBottomBar", children: _jsx(Popconfirm, { title: "Delete this Contact", description: "Are you sure you want to delete this record?", onConfirm: handleDelete, 
                                            // onCancel={onCancelDeletePopup}
                                            okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", danger: true, style: { marginLeft: "10px" }, children: "Delete selected" }) }) })) : null] }), _jsxs("div", { className: "opportunitiesSearchResetBar", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), value: params?.search }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" }), _jsx("div", { className: "opportunitiesSwitchDiv", children: view === "card" ? (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("list"), children: [_jsx(TableOutlined, {}), "List"] })) : (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("card"), children: [_jsx(IdcardOutlined, {}), "Card"] })) })] })] }), _jsxs(Tabs, { onChange: onTabChange, type: "card", children: [_jsx(Tabs.TabPane, { tab: `My ${contactToken}`, children: _jsx("div", { className: "contactsViewWapper", children: view === "card" && loading ? (_jsx(Skeleton, {})) : contacts?.length > 0 && view === "card" && !loading ? (_jsx("div", { className: "contactsListWrapper", children: contacts?.map((contactItem, index) => {
                                            return (_jsx(_Fragment, { children: _jsxs("div", { className: "contactBox", onClick: () => onBoxClick(contactItem), children: [_jsx(Avatar, { className: "contactAvtar", children: contactItem?.firstName?.slice(0, 1)?.toUpperCase() }), _jsxs("div", { className: "contactBoxInfo", children: [_jsx("div", { className: "contactBoxInfo1", children: `${contactItem?.firstName} ${contactItem?.lastName}` }), _jsx("div", { className: "contactBoxInfo2", children: `${contactItem?.city} ,${contactItem?.country}` }), _jsx("div", { className: "contactBoxInfo2", children: contactItem?.state })] })] }, index) }));
                                        }) })) : view === "list" ? (_jsx("div", { style: { height: "75vh" }, children: _jsx(DataGrid, { rows: contacts, loading: loading || addContactLoader || getContactLoader, getRowId: (row) => row?.contactId, checkboxSelection: user?.role === "ADMIN" ? true : false, columns: columns, onRowSelectionModelChange: (newSelection) => {
                                                setSelectedRowKeys(newSelection);
                                            }, paginationMode: "server", initialState: {
                                                pagination: {
                                                    paginationModel: {
                                                        pageSize: params.limit,
                                                        page: params.page - 1,
                                                    },
                                                },
                                            }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalContacts > 0 ? totalContacts : 0 }, "contactId") })) : (_jsx("div", { children: "No Contacts Found" })) }) }, "myView"), user?.role === "SALESPERSON" ? null : (_jsxs(Tabs.TabPane, { tab: `All ${contactToken}`, children: [" ", _jsx("div", { className: "contactsViewWapper", children: view === "card" && loading ? (_jsx(Skeleton, {})) : contacts?.length > 0 && view === "card" && !loading ? (_jsx("div", { className: "contactsListWrapper", children: contacts?.map((contactItem, index) => {
                                                return (_jsx(_Fragment, { children: _jsxs("div", { className: "contactBox", onClick: () => onBoxClick(contactItem), children: [_jsx(Avatar, { className: "contactAvtar", children: contactItem?.firstName
                                                                    ?.slice(0, 1)
                                                                    ?.toUpperCase() }), _jsxs("div", { className: "contactBoxInfo", children: [_jsx("div", { className: "contactBoxInfo1", children: `${contactItem?.firstName} ${contactItem?.lastName}` }), _jsx("div", { className: "contactBoxInfo2", children: `${contactItem?.city} ,${contactItem?.country}` }), _jsx("div", { className: "contactBoxInfo2", children: contactItem?.state })] })] }, index) }));
                                            }) })) : view === "list" ? (_jsx("div", { style: { height: "75vh" }, children: _jsx(DataGrid, { rows: contacts, loading: loading || addContactLoader || getContactLoader, getRowId: (row) => row?.contactId, checkboxSelection: user?.role === "ADMIN" ? true : false, columns: columns, onRowSelectionModelChange: (newSelection) => {
                                                    setSelectedRowKeys(newSelection);
                                                }, paginationMode: "server", initialState: {
                                                    pagination: {
                                                        paginationModel: {
                                                            pageSize: params.limit,
                                                            page: params.page - 1,
                                                        },
                                                    },
                                                }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalContacts > 0 ? totalContacts : 0 }, "contactId") })) : (_jsx("div", { children: "No Contacts Found" })) })] }, "myTeamView"))] })] })] }));
};
export default AllContacts;
