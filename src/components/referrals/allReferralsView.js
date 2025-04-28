import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Input, Popconfirm, Form, Modal, Button, Skeleton, Avatar, Tooltip, } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/referrals/referralsListView.css";
import { TableOutlined, IdcardOutlined, PlusOutlined } from "@ant-design/icons";
import "../../styles/horizontalFunctions/filterDropdown.css";
import { useNavigate } from "react-router-dom";
import AddReferralForm from "./addReferralForm";
import { createAndGetAllReferrals, deleteReferralsByIdAndGetAllReferralsTotal, fetchAllReferrals, resetReferral, resetReferrals, } from "../../redux/features/referralsSlice";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid, } from "@mui/x-data-grid";
import { REFERALS_ICON_ORANGE } from "../../utilities/common/imagesImports";
import { getUserById } from "../../redux/features/authenticationSlice";
const AllReferralsView = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [view, setView] = useState("list");
    const { loading, addReferralLoader, referral, getReferralLoader, referrals, totalReferrals } = useAppSelector((state) => state.referrals);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const { user } = useAppSelector((state) => state.authentication);
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
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleDelete = () => {
        dispatch(deleteReferralsByIdAndGetAllReferralsTotal(selectedRowKeys, params));
        setSelectedRowKeys([]);
    };
    const handleSubmit = () => {
        dispatch(createAndGetAllReferrals(referral, params));
        setIsModalOpen(false);
        form.resetFields();
    };
    const onSearch = (value) => {
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
    const onBoxClick = (referral) => {
        navigate(`/referrals/${referral?.referId}`);
    };
    const columns = [
        {
            headerName: "REFERRAL NUMBER",
            field: "referIdForUsers",
            width: 150,
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.referIdForUsers || emptyValue })),
        },
        {
            headerName: "FIRST NAME",
            field: "firstName",
            width: 150,
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.firstName || emptyValue })),
        },
        {
            headerName: "LAST NAME",
            field: "lastName",
            width: 150,
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.lastName || emptyValue })),
        },
        {
            headerName: "OWNER",
            field: "owner",
            width: 180,
            renderCell: (params) => (_jsx("div", { children: params?.row?.owner || emptyValue })),
        },
        {
            headerName: "PHONE",
            field: "phone",
            width: 130,
            renderCell: (params) => (_jsx("div", { children: params?.row?.countryCode
                    ? params?.row?.countryCode + params?.row?.phone
                    : "" + params?.row?.phone || emptyValue })),
        },
        {
            headerName: "EMAIL",
            field: "email",
            width: 240,
            renderCell: (params) => (_jsx("div", { children: params?.row?.email || emptyValue })),
        },
        {
            headerName: "REFERRED BY",
            field: "referBy",
            width: 150,
            renderCell: (params) => (_jsx("div", { children: params?.row?.referBy || emptyValue })),
        },
        {
            headerName: "STATUS",
            field: "status",
            renderCell: (params) => (_jsx("div", { children: params?.row?.status || emptyValue })),
            width: 100,
        },
        {
            headerName: "DESCRIPTION",
            field: "description",
            width: 200,
            renderCell: (params) => (_jsx("div", { children: params?.row?.description || emptyValue })),
        },
        {
            headerName: "COMPANY",
            field: "company",
            width: 200,
            renderCell: (params) => (_jsx("div", { children: params?.row?.company || emptyValue })),
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
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "addReferralModalWrapper", children: _jsx(Modal, { open: isModalOpen, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addReferralFormDiv", children: [_jsx("div", { className: "addReferralTitle", children: "New Referral" }), _jsx("div", { className: "addReferralFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, children: [_jsx(AddReferralForm, {}), _jsxs(Form.Item, { className: "addReferralSubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addReferralCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addReferralSubmitBtn", loading: addReferralLoader, children: "Save" })] })] }) })] }) }) }), _jsxs("div", { className: "listViewBackWrapper", children: [_jsxs("div", { className: "referralsListToolbarWrapper", children: [_jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx("img", { src: REFERALS_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Referrals", screenWidth < 768 ? (_jsx(Tooltip, { title: "Add new referral", children: _jsx(PlusOutlined, { onClick: showModal }) })) : (_jsx(Button, { onClick: showModal, className: "addLeadModalBtn", children: "New" }))] }), selectedRowKeys.length > 0 ? (_jsx("div", { className: "referralDeleteBottomBar", children: _jsx(Popconfirm, { title: "Delete the referral", description: "Are you sure you want to delete this record?", onConfirm: handleDelete, 
                                    // onCancel={onCancelDeletePopup}
                                    okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", danger: true, style: { marginLeft: "10px" }, children: "Delete selected" }) }) })) : null, _jsxs("div", { className: "opportunitiesSearchResetBar", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), value: params?.search }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" }), _jsx("div", { className: "opportunitiesSwitchDiv", children: view === "card" ? (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("list"), children: [_jsx(TableOutlined, {}), "List"] })) : (_jsxs("div", { className: "opportunitiesSwitchDivItem", onClick: () => onListClick("card"), children: [_jsx(IdcardOutlined, {}), "Card"] })) })] })] }), _jsx("div", { className: "contactsViewWapper", children: view === "card" && loading ? (_jsx(Skeleton, {})) : referrals?.length > 0 && view === "card" && !loading ? (_jsx("div", { className: "contactsListWrapper", children: referrals?.map((referralItem, index) => {
                                return (_jsx(_Fragment, { children: _jsx("div", { className: "contactBox", onClick: () => onBoxClick(referralItem), children: _jsxs("div", { className: "contactBoxInfo", children: [_jsxs(Avatar, { className: "accountAvtar", children: [referralItem?.firstName?.slice(0, 1), " ", referralItem?.lastName?.slice(0, 1)] }), _jsxs("div", { children: [_jsx("div", { className: "contactBoxInfo1", children: `${referralItem?.firstName} ${referralItem?.lastName}` }), _jsx("div", { className: "contactBoxInfo2", children: `${referralItem?.company}` }), _jsx("div", { className: "contactBoxInfo2", children: referralItem?.phone })] })] }) }, index) }));
                            }) })) : view === "list" ? (_jsx("div", { style: { height: "75vh" }, children: _jsx(DataGrid, { rows: referrals, columns: columns, loading: loading || addReferralLoader || getReferralLoader, getRowId: (row) => row?.referId, checkboxSelection: user?.role === "ADMIN" ? true : false, onRowSelectionModelChange: (newSelection) => {
                                    setSelectedRowKeys(newSelection);
                                }, paginationMode: "server", initialState: {
                                    pagination: {
                                        paginationModel: {
                                            pageSize: params.limit,
                                            page: params.page - 1,
                                        },
                                    },
                                }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalReferrals > 0 ? totalReferrals : 0 }, "referId") })) : (_jsx("div", { children: "No Referrals Found" })) })] })] }));
};
export default AllReferralsView;
