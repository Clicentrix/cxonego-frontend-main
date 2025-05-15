import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Input, Popconfirm, Form, Modal, Button, Tooltip, Tabs, Spin, } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/oppotunities/opportunitiesListView.css";
import { TableOutlined, IdcardOutlined, PlusOutlined } from "@ant-design/icons";
import "../../styles/horizontalFunctions/filterDropdown.css";
import { createAndGetAllOpportunities, deleteOpportunityByIdAndGetAllOpportunities, emptyOpportunity, fetchAllOpportunities, handleInputChangeReducerOpportunity, resetIsModalOpenOpportunity, resetOpportunities, resetOpportunity, } from "../../redux/features/opportunitiesSlice";
import OpportunitiesKanban from "./opportunityKanban";
import AddOpportunityForm from "./addOpportunityForm";
import { fetchAllAccountsWithoutParams, resetAccount, resetAccountForLookup, } from "../../redux/features/accountsSlice";
import { fetchAllContactsWithoutParams, resetContact, resetContactForLookup, } from "../../redux/features/contactsSlice";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid, } from "@mui/x-data-grid";
import { OPPOTUNITIES_ICON_ORANGE } from "../../utilities/common/imagesImports";
import moment from "moment";
import { getUserById } from "../../redux/features/authenticationSlice";
const AllOpportunities = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { opportunities, loading, addOpportunityLoader, opportunity, getOpportunityLoader, isModalOpenOpportunity, totalOpportunities } = useAppSelector((state) => state.opportunities);
    const { accountForLookup } = useAppSelector((state) => state.accounts);
    const { contactForLookup } = useAppSelector((state) => state.contacts);
    const { screenWidth } = useAppSelector((state) => state.referrals);
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
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onTabChange = (key) => {
        setParams({ ...params, view: key });
    };
    const handleDelete = () => {
        dispatch(deleteOpportunityByIdAndGetAllOpportunities(selectedRowKeys, params));
        setSelectedRowKeys([]);
    };
    const handleSubmit = () => {
        dispatch(createAndGetAllOpportunities(opportunity, params));
        dispatch(resetIsModalOpenOpportunity(false));
        form.resetFields();
    };
    const onSearch = (value) => {
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
            dispatch(handleInputChangeReducerOpportunity({
                company: accountForLookup?.accountId,
            }));
        }
        else {
            form.setFieldsValue(emptyOpportunity);
        }
    }, [accountForLookup]);
    useEffect(() => {
        if (contactForLookup?.contactId !== "") {
            form.setFieldsValue({ contact: contactForLookup?.contactId });
            dispatch(handleInputChangeReducerOpportunity({
                contact: contactForLookup?.contactId,
            }));
        }
        else {
            form.setFieldsValue(emptyOpportunity);
        }
    }, [contactForLookup]);
    const onBoxClick = (opportunity) => {
        navigate(`/opportunity/${opportunity?.opportunityId}`);
    };
    const hyperlink = (id, link) => {
        navigate(`/${link}/${id}`);
    };
    const columns = [
        {
            headerName: "OPPORTUNITY NUMBER",
            field: "opportunityId",
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.opportunityId || emptyValue })),
            width: 200,
        },
        {
            headerName: "TITLE",
            field: "title",
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.title || emptyValue })),
            width: 200,
        },
        {
            headerName: "OWNER",
            field: "owner",
            width: 200,
            renderCell: (params) => (_jsx("div", { children: params?.row?.owner || emptyValue })),
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
            headerName: "CURRENCY",
            field: "currency",
            renderCell: (params) => (_jsx("div", { children: params?.row?.currency || emptyValue })),
            width: 120,
        },
        {
            headerName: "PURCHASE TIME FRAME",
            field: "purchaseTimeFrame",
            renderCell: (params) => (_jsx("div", { children: params?.row?.purchaseTimeFrame || emptyValue })),
            width: 200,
        },
        {
            headerName: "PURCHASE PROCESS",
            field: "purchaseProcess",
            renderCell: (params) => (_jsx("div", { children: params?.row?.purchaseProcess || emptyValue })),
            width: 180,
        },
        {
            headerName: "FORECASTE CATEGORY",
            field: "forecastCategory",
            renderCell: (params) => (_jsx("div", { children: params?.row?.forecastCategory || emptyValue })),
            width: 180,
        },
        {
            headerName: "EST. REVENUE",
            field: "estimatedRevenue",
            renderCell: (params) => (_jsx("div", { children: params?.row?.estimatedRevenue || emptyValue })),
            width: 150,
        },
        {
            headerName: "ACTUAL REVENUE",
            field: "actualRevenue",
            renderCell: (params) => (_jsx("div", { children: params?.row?.actualRevenue || emptyValue })),
            width: 160,
        },
        {
            headerName: "EST. CLOSE DATE",
            field: "estimatedCloseDate",
            renderCell: (params) => (_jsx("div", { children: moment(params?.row?.estimatedCloseDate).format("MMMM Do YYYY, h:mm:ss a") || emptyValue })),
            width: 210,
        },
        {
            headerName: "ACTUAL CLOSE DATE",
            field: "actualCloseDate",
            renderCell: (params) => params?.row?.actualCloseDate ? (_jsx("div", { children: moment(params?.row?.actualCloseDate).format("MMMM Do YYYY, h:mm:ss a") || emptyValue })) : (emptyValue),
            width: 210,
        },
        {
            headerName: "PROBABILITY",
            field: "probability",
            renderCell: (params) => (_jsx("div", { children: params?.row?.probability || emptyValue })),
            width: 120,
        },
        {
            headerName: "DESCRIPTION",
            field: "description",
            renderCell: (params) => (_jsx("div", { children: params?.row?.description || emptyValue })),
            width: 200,
        },
        {
            headerName: "CURRENT NEED",
            field: "currentNeed",
            renderCell: (params) => (_jsx("div", { children: params?.row?.currentNeed || emptyValue })),
            width: 200,
        },
        {
            headerName: "PROPOSED SOLUTION",
            field: "proposedSolution",
            renderCell: (params) => (_jsx("div", { children: params?.row?.proposedSolution || emptyValue })),
            width: 200,
        },
        {
            headerName: "STAGE",
            field: "stage",
            renderCell: (params) => (_jsx("div", { children: params?.row?.stage || emptyValue })),
            width: 150,
        },
        {
            headerName: "OPPORTUNITY STATUS",
            field: "status",
            renderCell: (params) => (_jsx("div", { children: params?.row?.status || emptyValue })),
            width: 190,
        },
        {
            headerName: "PRIORITY",
            field: "priority",
            renderCell: (params) => (_jsx("div", { children: params?.row?.priority || emptyValue })),
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
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "addOpportunityModalWrapper", children: _jsx(Modal, { open: isModalOpenOpportunity, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addOpportunityFormDiv", children: [_jsx("div", { className: "addOpportunityTitle", children: "New Opportunity" }), _jsx("div", { className: "addOpportunityFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, children: [_jsx(AddOpportunityForm, {}), _jsxs(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addOpportunityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addOpportunitySubmitBtn", loading: addOpportunityLoader, children: "Save" })] })] }) })] }) }) }), _jsxs("div", { className: "listViewBackWrapper", children: [_jsxs("div", { className: "opportunitiesListToolbarWrapper", children: [_jsxs("div", { className: "opportunitiesListToolbarItem", children: [_jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx("img", { src: OPPOTUNITIES_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Opportunities"] }), screenWidth < 768 ? (_jsx(Tooltip, { title: "Add new Opportunity", children: _jsx(PlusOutlined, { onClick: showModal }) })) : (_jsx(Button, { onClick: showModal, className: "addOpportunityModalBtn", children: "New" })), _jsx("div", { children: selectedRowKeys.length > 0 ? (_jsx("div", { className: "opportunitiesDeleteBottomBar", children: _jsx(Popconfirm, { title: "Delete the Opportunity", description: "Are you sure you want to delete this record?", onConfirm: handleDelete, okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", danger: true, style: { marginLeft: "10px" }, children: "Delete selected" }) }) })) : null })] }), _jsxs("div", { className: "opportunitiesSearchResetBar", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), value: params?.search }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" }), _jsx("div", { className: "opportunitiesSwitchDiv", children: view === "kanban" ? (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("list"), children: [_jsx(TableOutlined, {}), "List"] })) : (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("kanban"), children: [_jsx(IdcardOutlined, {}), "Kanban"] })) })] })] }), _jsxs(Tabs, { onChange: onTabChange, type: "card", children: [_jsx(Tabs.TabPane, { tab: "My Opportunities", children: opportunities?.length > 0 && view === "kanban" ? (_jsx(OpportunitiesKanban, { params: params })) : view === "list" ? (_jsx("div", { style: { height: "75vh" }, children: _jsx(DataGrid, { rows: opportunities?.map((item) => {
                                            return {
                                                ...item, estimatedRevenue: parseFloat(item?.estimatedRevenue),
                                                actualRevenue: parseFloat(item?.actualRevenue)
                                            };
                                        }), loading: loading || addOpportunityLoader || getOpportunityLoader, getRowId: (row) => row?.opportunityId, checkboxSelection: user?.role === "ADMIN" ? true : false, columns: columns, onRowSelectionModelChange: (newSelection) => {
                                            setSelectedRowKeys(newSelection);
                                        }, paginationMode: "server", initialState: {
                                            pagination: {
                                                paginationModel: {
                                                    pageSize: params.limit,
                                                    page: params.page - 1,
                                                },
                                            },
                                        }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalOpportunities > 0 ? totalOpportunities : 0 }, "opportunityId") })) : (_jsx("div", { children: "No Opportunities Found" })) }, "myView"), user?.role === "SALESPERSON" ? null : (_jsx(Tabs.TabPane, { tab: "All Opportunities", children: view === "kanban" && loading ? (_jsx(Spin, { spinning: addOpportunityLoader, tip: "Loading..." })) : opportunities?.length > 0 && view === "kanban" && !loading ? (_jsx(OpportunitiesKanban, { params: params })) : view === "list" ? (_jsx("div", { style: { height: "75vh" }, children: _jsx(DataGrid, { rows: opportunities?.map((item) => {
                                            return {
                                                ...item, estimatedRevenue: parseFloat(item?.estimatedRevenue),
                                                actualRevenue: parseFloat(item?.actualRevenue)
                                            };
                                        }), loading: loading || addOpportunityLoader || getOpportunityLoader, getRowId: (row) => row?.opportunityId, checkboxSelection: user?.role === "ADMIN" ? true : false, columns: columns, onRowSelectionModelChange: (newSelection) => {
                                            setSelectedRowKeys(newSelection);
                                        }, paginationMode: "server", initialState: {
                                            pagination: {
                                                paginationModel: {
                                                    pageSize: params.limit,
                                                    page: params.page - 1,
                                                },
                                            },
                                        }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalOpportunities > 0 ? totalOpportunities : 0 }, "opportunityId") })) : (_jsx("div", { children: "No Opportunities Found" })) }, "myTeamView"))] })] })] }));
};
export default AllOpportunities;
