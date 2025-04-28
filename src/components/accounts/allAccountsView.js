import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, Button, Form, Input, Modal, Popconfirm, Skeleton, Tabs, Tooltip, } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/accounts/accountsView.css";
import { useEffect, useState } from "react";
import { createAndGetAllAccounts, deleteAccountsByIdAndGetAllAccounts, fetchAllAccounts, resetAccount, resetAccounts, resetIsModalOpenAccount, } from "../../redux/features/accountsSlice";
import { TableOutlined, IdcardOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AddAccountForm from "./addAccountForm";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid, } from "@mui/x-data-grid";
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
    const [view, setView] = useState("list");
    const { accounts, loading, account, addAccountLoader, isModalOpenAccount, getAccountLoader, totalAccounts } = useAppSelector((state) => state.accounts);
    const navigate = useNavigate();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const { user } = useAppSelector((state) => state.authentication);
    const companyToken = user?.organisation && user?.organisation?.companyToken
        ? ` ${user.organisation.companyToken}`
        : " Companies";
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
    const onSearch = (value) => {
        setParams({ ...params, search: value });
    };
    const onListClick = (value) => {
        setView(value);
    };
    const handleReset = () => {
        setParams(initialAccountsParams);
    };
    const onBoxClick = (account) => {
        navigate(`/account/${account?.accountId}`);
    };
    const handlePaginationChange = (paginationModel) => {
        setParams({
            ...params,
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    };
    const columns = [
        {
            headerName: "COMPANY NUMBER",
            field: "accountId",
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.accountId || emptyValue })),
            width: 200,
        },
        {
            headerName: "NAME",
            field: "accountName",
            width: 200,
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.accountName || emptyValue })),
        },
        {
            headerName: "DESCRIPTION",
            field: "description",
            width: 250,
            renderCell: (params) => (_jsx("div", { children: params?.row?.description || emptyValue })),
        },
        {
            headerName: "COUNTRY",
            field: "country",
            width: 150,
            renderCell: (params) => (_jsx("div", { children: params?.row?.country || emptyValue })),
        },
        {
            headerName: "STATE",
            field: "state",
            width: 150,
            renderCell: (params) => (_jsx("div", { children: params?.row?.state || emptyValue })),
        },
        {
            headerName: "CITY",
            field: "city",
            width: 160,
            renderCell: (params) => (_jsx("div", { children: params?.row?.city || emptyValue })),
        },
        {
            headerName: "OWNER",
            field: "owner",
            width: 180,
            renderCell: (params) => (_jsx("div", { children: params?.row?.owner || emptyValue })),
        },
        {
            headerName: "ADDRESS",
            field: "address",
            width: 150,
            renderCell: (params) => (_jsx("div", { children: params?.row?.address || emptyValue })),
        },
        {
            headerName: "WEBSITE",
            field: "website",
            width: 220,
            renderCell: (params) => (_jsx("div", { children: params?.row?.website || emptyValue })),
        },
        {
            headerName: "INDUSTRY",
            field: "industry",
            width: 150,
            renderCell: (params) => (_jsx("div", { children: params?.row?.industry || emptyValue })),
        },
        {
            headerName: "STATUS",
            field: "status",
            width: 150,
            renderCell: (params) => (_jsx("div", { children: params?.row?.status || emptyValue })),
        },
        {
            headerName: "EMAIL",
            field: "email",
            width: 240,
            renderCell: (params) => (_jsx("div", { children: params?.row?.email || emptyValue })),
        },
        {
            headerName: "CONTACT NO.",
            field: "phone",
            width: 180,
            renderCell: (params) => (_jsx("div", { children: params?.row?.countryCode
                    ? params?.row?.countryCode + params?.row?.phone
                    : "" + params?.row?.phone || emptyValue })),
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
    const onTabChange = (key) => {
        setParams({ ...params, view: key });
    };
    useEffect(() => {
        dispatch(fetchAllAccounts(params));
    }, [params]);
    console.log("tota kjhgf", totalAccounts);
    useEffect(() => {
        dispatch(resetAccount());
        dispatch(resetAccounts());
        dispatch(getUserById());
    }, [dispatch]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "addAccountModalWrapper", children: _jsx(Modal, { open: isModalOpenAccount, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addAccountFormDiv", children: [_jsx("div", { className: "addAccountTitle", children: "New Company" }), _jsx("div", { className: "addOpportunityFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, initialValues: account, children: [_jsx(AddAccountForm, {}), _jsxs(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addOpportunityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addOpportunitySubmitBtn", loading: addAccountLoader, children: "Save" })] })] }) })] }) }) }), _jsxs("div", { className: "listViewBackWrapper", children: [_jsxs("div", { className: "accountsListToolbarWrapper", children: [_jsxs("div", { className: "accountsListToolbarItem", children: [_jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx("img", { src: ACCOUNT_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), companyToken] }), screenWidth < 768 ? (_jsx(Tooltip, { title: "Add new referral", children: _jsx(PlusOutlined, { onClick: showModal }) })) : (_jsx(Button, { onClick: showModal, className: "addAccountModalBtn", children: "New" })), _jsx("div", { children: selectedRowKeys.length > 0 ? (_jsx("div", { className: "leadsDeleteBottomBar", children: _jsx(Popconfirm, { title: "Delete this Company", description: "Are you sure you want to delete this record?", onConfirm: handleDelete, okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", danger: true, style: { marginLeft: "10px" }, children: "Delete selected" }) }) })) : null })] }), _jsxs("div", { className: "opportunitiesSearchResetBar", children: [_jsx(Input, { placeholder: "search here new..", name: "searchText", onChange: (e) => onSearch(e.target.value), value: params?.search }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" }), _jsx("div", { className: "opportunitiesSwitchDiv", children: view === "card" ? (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("list"), children: [_jsx(TableOutlined, {}), "List"] })) : (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("card"), children: [_jsx(IdcardOutlined, {}), "Card"] })) })] })] }), _jsxs(Tabs, { onChange: onTabChange, type: "card", children: [_jsxs(Tabs.TabPane, { tab: `My ${companyToken}`, children: [" ", _jsx("div", { className: "accountsViewWapper", children: view === "card" && loading ? (_jsx(Skeleton, {})) : accounts?.length > 0 && view === "card" && !loading ? (_jsx("div", { className: "accountsListWrapper", children: accounts?.map((accountItem, index) => {
                                                return (_jsx(_Fragment, { children: _jsxs("div", { className: "accountBox", onClick: () => onBoxClick(accountItem), children: [_jsx(Avatar, { className: "accountAvtar", children: accountItem?.accountName?.slice(0, 1) }), _jsxs("div", { className: "accountBoxInfo", children: [_jsx("div", { className: "accountBoxInfo1", children: accountItem?.accountName }), _jsx("div", { className: "accountBoxInfo2", children: `${accountItem?.city} ,${accountItem?.country}` }), _jsx("div", { className: "accountBoxInfo2", children: accountItem?.website })] })] }, index) }));
                                            }) })) : view === "list" ? (_jsx("div", { style: { height: "75vh" }, children: _jsx(DataGrid, { rows: accounts, columns: columns, loading: loading || addAccountLoader || getAccountLoader, getRowId: (row) => row?.accountId, checkboxSelection: user?.role === "ADMIN" ? true : false, onRowSelectionModelChange: (newSelection) => {
                                                    setSelectedRowKeys(newSelection);
                                                }, paginationMode: "server", initialState: {
                                                    pagination: {
                                                        paginationModel: {
                                                            pageSize: params.limit,
                                                            page: params.page - 1,
                                                        },
                                                    },
                                                }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalAccounts > 0 ? totalAccounts : 0 }, "accountId") })) : (_jsx("div", { children: "No Accounts Found" })) })] }, "myView"), user?.role === "SALESPERSON" ? null : (_jsxs(Tabs.TabPane, { tab: `All ${companyToken}`, children: [" ", _jsx("div", { className: "accountsViewWapper", children: view === "card" && loading ? (_jsx(Skeleton, {})) : accounts?.length > 0 && view === "card" && !loading ? (_jsx("div", { className: "accountsListWrapper", children: accounts?.map((accountItem, index) => {
                                                return (_jsx(_Fragment, { children: _jsxs("div", { className: "accountBox", onClick: () => onBoxClick(accountItem), children: [_jsx(Avatar, { className: "accountAvtar", children: accountItem?.accountName?.slice(0, 1) }), _jsxs("div", { className: "accountBoxInfo", children: [_jsx("div", { className: "accountBoxInfo1", children: accountItem?.accountName }), _jsx("div", { className: "accountBoxInfo2", children: `${accountItem?.city} ,${accountItem?.country}` }), _jsx("div", { className: "accountBoxInfo2", children: accountItem?.website })] })] }, index) }));
                                            }) })) : view === "list" ? (_jsx("div", { style: { height: "75vh" }, children: _jsx(DataGrid, { rows: accounts, columns: columns, loading: loading || addAccountLoader || getAccountLoader, getRowId: (row) => row?.accountId, checkboxSelection: user?.role === "ADMIN" ? true : false, onRowSelectionModelChange: (newSelection) => {
                                                    setSelectedRowKeys(newSelection);
                                                }, paginationMode: "server", initialState: {
                                                    pagination: {
                                                        paginationModel: {
                                                            pageSize: params.limit,
                                                            page: params.page - 1,
                                                        },
                                                    },
                                                }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalAccounts > 0 ? totalAccounts : 0 }, "accountId") })) : (_jsx("div", { children: "No Accounts Found" })) })] }, "myTeamView"))] })] })] }));
};
export default AllAccounts;
