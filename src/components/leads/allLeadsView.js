import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Input, Popconfirm, Form, Modal, Button, Skeleton, Tooltip, Tabs, } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { createAndGetAllleads, deleteLeadByIdAndGetAllleads, emptyLead, fetchAllLeadsWithParams, handleInputChangeReducerLead, resetLead, resetLeads, } from "../../redux/features/leadSlice";
import "../../styles/leads/leadsListView.css";
import { TableOutlined, IdcardOutlined, PlusOutlined } from "@ant-design/icons";
import "../../styles/horizontalFunctions/filterDropdown.css";
import LeadsKanban from "./leadsKanban";
import AddLeadForm from "./addLeadForm";
import { useNavigate } from "react-router-dom";
import { fetchAllAccountsWithoutParams, resetAccount, resetAccountForLookup, } from "../../redux/features/accountsSlice";
import { fetchAllContactsWithoutParams, resetContact, resetContactForLookup, } from "../../redux/features/contactsSlice";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid, } from "@mui/x-data-grid";
import { LEADS_ICON_ORANGE } from "../../utilities/common/imagesImports";
import { getUserById } from "../../redux/features/authenticationSlice";
const AllLeads = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { leads, loading, lead, addLeadLoader, getLeadLoader, totalLeads } = useAppSelector((state) => state.leads);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const { accountForLookup } = useAppSelector((state) => state.accounts);
    const { contactForLookup } = useAppSelector((state) => state.contacts);
    const { user } = useAppSelector((state) => state.authentication);
    const [view, setView] = useState("list");
    const initialParams = {
        page: 1,
        limit: 10,
        search: "",
        view: "myView",
    };
    const [params, setParams] = useState(initialParams);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onTabChange = (key) => {
        setParams({ ...params, view: key });
    };
    const handleDelete = () => {
        dispatch(deleteLeadByIdAndGetAllleads(selectedRowKeys, params));
        setSelectedRowKeys([]);
    };
    const handleSubmit = () => {
        dispatch(createAndGetAllleads(lead, params));
        setIsModalOpen(false);
        form.resetFields();
    };
    const onSearch = (value) => {
        setParams({ ...params, search: value });
    };
    useEffect(() => {
        dispatch(fetchAllLeadsWithParams(params));
    }, [params]);
    useEffect(() => {
        dispatch(resetLead());
        dispatch(resetLeads());
        dispatch(fetchAllAccountsWithoutParams());
        dispatch(fetchAllContactsWithoutParams());
        dispatch(getUserById());
    }, [dispatch]);
    useEffect(() => {
        if (accountForLookup?.accountId !== "") {
            form.setFieldsValue({ company: accountForLookup?.accountId });
            dispatch(handleInputChangeReducerLead({
                company: accountForLookup?.accountId,
            }));
        }
        else {
            form.setFieldsValue(emptyLead);
        }
    }, [accountForLookup]);
    useEffect(() => {
        if (contactForLookup?.contactId !== "") {
            form.setFieldsValue({ contact: contactForLookup?.contactId });
            dispatch(handleInputChangeReducerLead({
                contact: contactForLookup?.contactId,
            }));
        }
        else {
            form.setFieldsValue(emptyLead);
        }
    }, [contactForLookup]);
    useEffect(() => {
        dispatch(resetAccountForLookup());
        dispatch(resetAccount());
        dispatch(resetContact());
        dispatch(resetContactForLookup());
    }, []);
    const onBoxClick = (lead) => {
        navigate(`/lead/${lead?.leadId}`);
    };
    const hyperlink = (id, link) => {
        navigate(`/${link}/${id}`);
    };
    const columns = [
        {
            headerName: "LEAD NUMBER",
            field: "leadId",
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.leadId || emptyValue })),
            width: 130,
        },
        {
            headerName: "FIRST NAME",
            field: "firstName",
            renderCell: (params) => (_jsx("div", { children: params?.row?.firstName || emptyValue })),
            width: 130,
        },
        {
            headerName: "LAST NAME",
            field: "lastName",
            renderCell: (params) => (_jsx("div", { children: params?.row?.lastName || emptyValue })),
            width: 130,
        },
        {
            headerName: "LEAD TITLE",
            field: "title",
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.title || emptyValue })),
            width: 150,
        },
        {
            headerName: "DESCRIPTION",
            field: "description",
            renderCell: (params) => (_jsx("div", { children: params?.row?.description || emptyValue })),
            width: 220,
        },
        {
            headerName: "PHONE",
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
            width: 220,
            renderCell: (params) => {
                const company = params?.row?.company;
                if (typeof company === "string") {
                    return (_jsx("div", { onClick: () => hyperlink(company.split("/").length > 0 ? company.split("/")[1] : "", "account"), className: "hyperlinkBlue", children: company.split("/").length > 0
                            ? company.split("/")[0]
                            : company || emptyValue }));
                }
                else {
                    return _jsx("div", { children: emptyValue });
                }
            },
        },
        {
            headerName: "CONTACT",
            field: "contact",
            width: 220,
            renderCell: (params) => {
                const contact = params?.row?.contact;
                if (typeof contact === "string") {
                    return (_jsx("div", { onClick: () => hyperlink(contact.split("/").length > 0 ? contact.split("/")[1] : "", "contact"), className: "hyperlinkBlue", children: contact.split("/").length > 0
                            ? contact.split("/")[0]
                            : contact || emptyValue }));
                }
                else {
                    return _jsx("div", { children: emptyValue });
                }
            },
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
            width: 150,
        },
        {
            headerName: "CITY",
            field: "city",
            renderCell: (params) => (_jsx("div", { children: params?.row?.city || emptyValue })),
            width: 150,
        },
        {
            headerName: "LEAD SOURCE",
            field: "leadSource",
            renderCell: (params) => (_jsx("div", { children: params?.row?.leadSource || emptyValue })),
            width: 180,
        },
        {
            headerName: "RATING",
            field: "rating",
            renderCell: (params) => (_jsx("div", { children: params?.row?.rating || emptyValue })),
            width: 100,
        },
        {
            headerName: "CURRENCY",
            field: "currency",
            renderCell: (params) => (_jsx("div", { children: params?.row?.currency || emptyValue })),
            width: 100,
        },
        {
            headerName: "EST. REVENUE",
            field: "price",
            width: 150,
            renderCell: (params) => (_jsx("div", { children: parseFloat(params?.row?.price) || emptyValue })),
        },
        {
            headerName: "OWNER",
            field: "owner",
            width: 200,
            renderCell: (params) => (_jsx("div", { children: params?.row?.owner || emptyValue })),
        },
        {
            headerName: "STATUS",
            field: "status",
            renderCell: (params) => (_jsx("div", { children: params?.row?.status || emptyValue })),
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
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    const handleReset = () => {
        setParams(initialParams);
    };
    const onListClick = (value) => {
        setView(value);
    };
    const handlePaginationChange = (paginationModel) => {
        setParams({
            ...params,
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "addLeadModalWrapper", children: _jsx(Modal, { open: isModalOpen, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsx("div", { className: "addLeadFormDiv", children: _jsx("div", { className: "addLeadFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, children: [_jsx(AddLeadForm, {}), _jsxs(Form.Item, { className: "addLeadSubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addLeadCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addLeadSubmitBtn", loading: addLeadLoader, children: "Save" })] })] }) }) }) }) }), _jsxs("div", { className: "listViewBackWrapper", children: [_jsxs("div", { className: "leadsListToolbarWrapper", children: [_jsxs("div", { className: "leadsListToolbarItem", children: [_jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx("img", { src: LEADS_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Leads"] }), screenWidth < 768 ? (_jsx(Tooltip, { title: "Add new lead", children: _jsx(PlusOutlined, { onClick: showModal }) })) : (_jsx(Button, { onClick: showModal, className: "addLeadModalBtn", children: "New" })), _jsx("div", { children: selectedRowKeys.length > 0 ? (_jsx("div", { className: "leadsDeleteBottomBar", children: _jsx(Popconfirm, { title: "Delete the Lead", description: "Are you sure you want to delete this record?", onConfirm: handleDelete, 
                                                // onCancel={onCancelDeletePopup}
                                                okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", danger: true, style: { marginLeft: "10px" }, children: "Delete selected" }) }) })) : null })] }), _jsxs("div", { className: "opportunitiesSearchResetBar", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), value: params?.search }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" }), _jsx("div", { className: "opportunitiesSwitchDiv", children: view === "kanban" ? (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("list"), children: [_jsx(TableOutlined, {}), "List"] })) : (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("kanban"), children: [_jsx(IdcardOutlined, {}), "Kanban"] })) })] })] }), _jsxs(Tabs, { onChange: onTabChange, type: "card", children: [_jsx(Tabs.TabPane, { tab: "My Leads", children: leads?.length > 0 && view === "kanban" ? (_jsx(LeadsKanban, { params: params })) : view === "list" ? (_jsx("div", { style: { height: "75vh" }, children: _jsx(DataGrid, { rows: leads?.map((item) => {
                                            return {
                                                ...item, price: parseFloat(item?.price)
                                            };
                                        }), loading: loading || addLeadLoader || getLeadLoader, getRowId: (row) => row?.leadId, checkboxSelection: user?.role === "ADMIN" ? true : false, columns: columns, onRowSelectionModelChange: (newSelection) => {
                                            setSelectedRowKeys(newSelection);
                                        }, paginationMode: "server", initialState: {
                                            pagination: {
                                                paginationModel: {
                                                    pageSize: params.limit,
                                                    page: params.page - 1,
                                                },
                                            },
                                        }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalLeads > 0 ? totalLeads : 0 }, "leadId") })) : (_jsx("div", { children: "No Leads Found" })) }, "myView"), user?.role === "SALESPERSON" ? null : (_jsx(Tabs.TabPane, { tab: "All Leads", children: view === "kanban" && loading ? (_jsx(Skeleton, {})) : leads?.length > 0 && view === "kanban" && !loading ? (_jsx(LeadsKanban, { params: params })) : view === "list" ? (_jsx("div", { style: { height: "75vh" }, children: _jsx(DataGrid, { rows: leads?.map((item) => {
                                            return {
                                                ...item, price: parseFloat(item?.price)
                                            };
                                        }), loading: loading || addLeadLoader || getLeadLoader, getRowId: (row) => row?.leadId, checkboxSelection: user?.role === "ADMIN" ? true : false, columns: columns, onRowSelectionModelChange: (newSelection) => {
                                            setSelectedRowKeys(newSelection);
                                        }, paginationMode: "server", initialState: {
                                            pagination: {
                                                paginationModel: {
                                                    pageSize: params.limit,
                                                    page: params.page - 1,
                                                },
                                            },
                                        }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalLeads > 0 ? totalLeads : 0 }, "leadId") })) : (_jsx("div", { children: "No Leads Found" })) }, "myTeamView"))] })] })] }));
};
export default AllLeads;
