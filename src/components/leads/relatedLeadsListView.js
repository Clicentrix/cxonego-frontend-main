import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Input, Popconfirm, Form, Modal, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/leads/leadsListView.css";
import "../../styles/oppotunities/opportunitiesListView.css";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid, } from "@mui/x-data-grid";
import { createAndGetAllLeadsByModuleId, deleteLeadsByIdAndGetAllLeadsByModuleId, fetchAllLeadsByModuleId, handleInputChangeReducerLead, resetLead, resetLeads, } from "../../redux/features/leadSlice";
import AddLeadForm from "./addLeadForm";
import { LEADS_ICON_ORANGE } from "../../utilities/common/imagesImports";
const AllRelatedLeads = ({ moduleName, moduleId, }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { leads, loading, addLeadLoader, lead, getLeadLoader, totalLeads } = useAppSelector((state) => state.leads);
    const { user } = useAppSelector((state) => state.authentication);
    const initialParams = {
        page: 1,
        limit: 10,
        search: "",
    };
    const [params, setParams] = useState(initialParams);
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleDelete = () => {
        dispatch(deleteLeadsByIdAndGetAllLeadsByModuleId(selectedRowKeys, params, moduleName, moduleId));
        setSelectedRowKeys([]);
    };
    const handleSubmit = () => {
        if (moduleId) {
            if (moduleName === "account") {
                dispatch(createAndGetAllLeadsByModuleId({ ...lead, company: moduleId }, params, moduleName, moduleId));
            }
            else {
                dispatch(createAndGetAllLeadsByModuleId({ ...lead, contact: moduleId }, params, moduleName, moduleId));
            }
            setIsModalOpen(false);
            form.resetFields();
        }
    };
    const onSearch = (value) => {
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
                    return _jsx("div", { className: "hyperlinkBlue", children: emptyValue });
                }
            },
        },
        {
            headerName: "COMPANY",
            field: "company",
            width: 220,
            renderCell: (params) => {
                const company = params?.row?.company;
                if (typeof company === "string") {
                    return (_jsx("div", { onClick: () => hyperlink(company?.split("/").length > 0 ? company?.split("/")[1] : "", "account"), className: "hyperlinkBlue", children: company?.split("/").length > 0
                            ? company?.split("/")[0]
                            : company || emptyValue }));
                }
                else {
                    return _jsx("div", { className: "hyperlinkBlue", children: emptyValue });
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
            renderCell: (params) => (_jsx("div", { children: params?.row?.price || emptyValue })),
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
        form.setFieldsValue({
            ...lead,
            company: moduleName === "account" ? moduleId : lead?.company,
            contact: moduleName === "contact" ? moduleId : lead?.contact,
        });
        dispatch(handleInputChangeReducerLead({
            ...lead,
            company: moduleName === "account" ? moduleId : lead?.company,
            contact: moduleName === "contact" ? moduleId : lead?.contact,
        }));
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    const handleReset = () => {
        setParams(initialParams);
    };
    const onBoxClick = (lead) => {
        navigate(`/lead/${lead?.leadId}`);
    };
    const hyperlink = (id, link) => {
        navigate(`/${link}/${id}`);
    };
    const handlePaginationChange = (paginationModel) => {
        setParams({
            ...params,
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "addActivityModalWrapper", children: _jsx(Modal, { open: isModalOpen, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsx("div", { className: "addLeadFormDiv", children: _jsx("div", { className: "addLeadFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, children: [_jsx(AddLeadForm, {}), _jsxs(Form.Item, { className: "addLeadSubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addLeadCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addLeadSubmitBtn", loading: addLeadLoader, children: "Save" })] })] }) }) }) }) }), _jsxs("div", { className: "relatedListViewBackWrapper", children: [_jsxs("div", { className: "leadsListToolbarWrapper", children: [_jsxs("div", { className: "leadsListToolbarItem", children: [_jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx("img", { src: LEADS_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Related Leads"] }), _jsx(Button, { onClick: showModal, className: "addLeadModalBtn", children: "New" }), _jsx("div", { children: selectedRowKeys.length > 0 ? (_jsx("div", { className: "leadsDeleteBottomBar", children: _jsx(Popconfirm, { title: "Delete the Lead", description: "Are you sure you want to delete this record?", onConfirm: handleDelete, 
                                                // onCancel={onCancelDeletePopup}
                                                okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", danger: true, style: { marginLeft: "10px" }, children: "Delete selected" }) }) })) : null })] }), _jsxs("div", { className: "opportunitiesSearchResetBar", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), style: { border: "1px solid var(--gray5)", padding: "2px 5px" }, value: params?.search }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" })] })] }), _jsx("div", { style: { height: "50vh" }, children: _jsx(DataGrid, { rows: leads?.map((item) => {
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
                            }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalLeads > 0 ? totalLeads : 0 }, "leadId") })] })] }));
};
export default AllRelatedLeads;
