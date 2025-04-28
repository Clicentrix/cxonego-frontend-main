import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Input, Popconfirm, Form, Modal, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/activities/activitiesListView.css";
import "../../styles/oppotunities/opportunitiesListView.css";
import "../../styles/horizontalFunctions/filterDropdown.css";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { DataGrid, } from "@mui/x-data-grid";
import { createAndGetAllContactsByModuleId, deleteContactsByIdAndGetAllContactsByModuleId, fetchAllContactsByModuleId, handleInputChangeReducerContact, resetContact, resetContacts, resetIsModalOpenContact, } from "../../redux/features/contactsSlice";
import AddContactForm from "./addContactForm";
import { CONTACT_ICON_ORANGE } from "../../utilities/common/imagesImports";
const AllRelatedContacts = ({ moduleName, moduleId, }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { contacts, loading, contact, addContactLoader, getContactLoader, isModalOpenContact, totalContacts } = useAppSelector((state) => state.contacts);
    const { user } = useAppSelector((state) => state.authentication);
    const initialParams = {
        page: 1,
        limit: 10,
        search: "",
    };
    const [params, setParams] = useState(initialParams);
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const handleDelete = () => {
        dispatch(deleteContactsByIdAndGetAllContactsByModuleId(selectedRowKeys, params, moduleName, moduleId));
        setSelectedRowKeys([]);
    };
    const handleSubmit = async () => {
        if (moduleId) {
            await dispatch(createAndGetAllContactsByModuleId({ ...contact, company: moduleId }, params, moduleName, moduleId));
        }
        await dispatch(resetIsModalOpenContact(false));
        form.resetFields();
    };
    const onSearch = (value) => {
        setParams({ ...params, search: value });
    };
    const handlePaginationChange = (paginationModel) => {
        setParams({
            ...params,
            page: paginationModel.page + 1,
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
                    return (_jsx("div", { onClick: () => hyperlink(company.split("/").length > 0 ? company.split("/")[1] : "", "account"), className: "hyperlinkBlue", children: company.split("/").length > 0
                            ? company.split("/")[0]
                            : company || emptyValue }));
                }
                else {
                    return _jsx("div", { className: "hyperlinkBlue", children: emptyValue });
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
    const showModal = () => {
        dispatch(resetIsModalOpenContact(true));
        form.resetFields();
        form.setFieldsValue({ company: moduleId });
        dispatch(handleInputChangeReducerContact({ ...contact, company: moduleId }));
    };
    const handleCancel = () => {
        dispatch(resetIsModalOpenContact(false));
        form.resetFields();
    };
    const handleReset = () => {
        setParams(initialParams);
    };
    const onBoxClick = (contact) => {
        navigate(`/contact/${contact?.contactId}`);
    };
    const hyperlink = (contactId, link) => {
        navigate(`/${link}/${contactId}`);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "addActivityModalWrapper", children: _jsx(Modal, { open: isModalOpenContact, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addContactFormDiv", children: [_jsx("div", { className: "addContactTitle", children: "New Contact" }), _jsx("div", { className: "addContactFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, children: [_jsx(AddContactForm, {}), _jsxs(Form.Item, { className: "addContactSubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addContactCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addContactSubmitBtn", loading: addContactLoader, children: "Save" })] })] }) })] }) }) }), _jsxs("div", { className: "relatedListViewBackWrapper", children: [_jsxs("div", { className: "activitiesListToolbarWrapper", children: [_jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx("img", { src: CONTACT_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Related Contacts", _jsx(Button, { onClick: showModal, className: "addOpportunityModalBtn", children: "New" })] }), selectedRowKeys.length > 0 ? (_jsx("div", { className: "activityDeleteBottomBar", children: _jsx(Popconfirm, { title: "Delete the activity", description: "Are you sure you want to delete this record?", onConfirm: handleDelete, okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", danger: true, style: { marginLeft: "10px" }, children: "Delete selected" }) }) })) : null, _jsxs("div", { className: "opportunitiesSearchResetBar", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), style: { border: "1px solid var(--gray5)", padding: "2px 5px" }, value: params?.search }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filters" })] })] }), _jsx("div", { style: { height: "50vh" }, children: _jsx(DataGrid, { rows: contacts, loading: loading || addContactLoader || getContactLoader, getRowId: (row) => row?.contactId, checkboxSelection: user?.role === "ADMIN" ? true : false, columns: columns, onRowSelectionModelChange: (newSelection) => {
                                setSelectedRowKeys(newSelection);
                            }, paginationMode: "server", initialState: {
                                pagination: {
                                    paginationModel: {
                                        pageSize: params.limit,
                                        page: params.page - 1,
                                    },
                                },
                            }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalContacts > 0 ? totalContacts : 0 }, "contactId") })] })] }));
};
export default AllRelatedContacts;
