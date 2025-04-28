import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Input, Popconfirm, Form, Modal, Button, Tag } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/activities/activitiesListView.css";
import "../../styles/oppotunities/opportunitiesListView.css";
import "../../styles/horizontalFunctions/filterDropdown.css";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { DataGrid, } from "@mui/x-data-grid";
import { createAndGetAllNotesByModuleId, deleteNotesByIdAndGetAllNotesByModuleId, fetchAllNotesByModuleId, handleInputChangeReducerNote, resetNote, resetNotes, } from "../../redux/features/noteSlice";
import AddNoteForm from "./addNoteForm";
import { NOTES_ICON_ORANGE } from "../../utilities/common/imagesImports";
import { getUserById } from "../../redux/features/authenticationSlice";
const AllRelatedNotes = ({ moduleName, moduleId, }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { note, notes, loading, addNoteLoader, getNoteLoader, totalNotes } = useAppSelector((state) => state.notes);
    const { user } = useAppSelector((state) => state.authentication);
    console.log("module name at activity", moduleName);
    const initialParams = {
        page: 1,
        limit: 10,
        search: "",
    };
    const [params, setParams] = useState(initialParams);
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [tagsString, setTagsString] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleDelete = () => {
        dispatch(deleteNotesByIdAndGetAllNotesByModuleId(selectedRowKeys, params, moduleName, moduleId));
        setSelectedRowKeys([]);
    };
    const handleSubmit = () => {
        if (moduleId) {
            if (moduleName === "opportunity") {
                dispatch(createAndGetAllNotesByModuleId({ ...note, opportunity: moduleId }, params, moduleName, moduleId));
            }
            else if (moduleName === "account") {
                dispatch(createAndGetAllNotesByModuleId({ ...note, company: moduleId }, params, moduleName, moduleId));
            }
            else if (moduleName === "contact") {
                dispatch(createAndGetAllNotesByModuleId({ ...note, contact: moduleId }, params, moduleName, moduleId));
            }
            else if (moduleName === "activity") {
                dispatch(createAndGetAllNotesByModuleId({ ...note, activity: moduleId }, params, moduleName, moduleId));
            }
            else {
                dispatch(createAndGetAllNotesByModuleId({ ...note, Lead: moduleId }, params, moduleName, moduleId));
            }
            setIsModalOpen(false);
            form.resetFields();
        }
    };
    const onSearch = (value) => {
        setParams({ ...params, search: value });
    };
    const handleClose = (removedTag) => {
        const newTags = tagsString
            .split(", ")
            .filter((tag) => tag !== removedTag)
            .join(", ");
        setTagsString(newTags);
    };
    useEffect(() => {
        dispatch(fetchAllNotesByModuleId({ moduleName, moduleId, params }));
    }, [params]);
    useEffect(() => {
        // dispatch(resetNote());
        dispatch(resetNotes());
        dispatch(getUserById());
    }, []);
    const columns = [
        {
            field: "note",
            headerName: "NOTE",
            width: 300,
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.note || emptyValue })),
        },
        {
            field: "owner",
            headerName: "OWNER",
            width: 200,
            renderCell: (params) => (_jsx("div", { children: params?.row?.owner || emptyValue })),
        },
        {
            field: "tags",
            headerName: "TAGS",
            width: 300,
            renderCell: (params) => {
                const { row } = params;
                const tags = row?.tags?.split(", ");
                return (_jsx("div", { className: "tagsContainerInTableView", children: tags?.length == undefined ? (_jsx("div", { className: "noTags", children: "No Tags Attached" })) : (tags?.map((tag, index) => (_jsx(Tag, { onClose: () => handleClose(tag), children: _jsx("span", { children: tag }) }, index)))) }));
            },
        },
        {
            field: "createdAt",
            headerName: "CREATED ON",
            width: 210,
        },
        {
            field: "updatedAt",
            headerName: "UPDATED ON",
            width: 210,
        },
    ];
    const showModal = async () => {
        setIsModalOpen(true);
        dispatch(resetNote());
        form.setFieldsValue({
            ...note,
            company: moduleName === "account" ? moduleId : null,
            contact: moduleName === "contact" ? moduleId : null,
            Lead: moduleName === "lead" ? moduleId : null,
            opportunity: moduleName === "opportunity" ? moduleId : null,
            activity: moduleName === "activity" ? moduleId : null,
        });
        dispatch(handleInputChangeReducerNote({
            ...note,
            company: moduleName === "account" ? moduleId : null,
            contact: moduleName === "contact" ? moduleId : null,
            Lead: moduleName === "lead" ? moduleId : null,
            opportunity: moduleName === "opportunity" ? moduleId : null,
            activity: moduleName === "activity" ? moduleId : null,
        }));
    };
    // useEffect(() => {
    //   form.setFieldsValue({
    //     ...note,
    //     company: moduleName === "account" ? moduleId : note?.company,
    //     contact: moduleName === "contact" ? moduleId : note?.contact,
    //     lead: moduleName === "lead" ? moduleId : note?.lead,
    //     opportunity: moduleName === "opportunity" ? moduleId : note?.opportunity,
    //     activity: moduleName === "activity" ? moduleId : note?.activity,
    //   });
    //   dispatch(
    //     handleInputChangeReducerNote({
    //       ...note,
    //       company: moduleName === "account" ? moduleId : note?.company,
    //       contact: moduleName === "contact" ? moduleId : note?.contact,
    //       lead: moduleName === "lead" ? moduleId : note?.lead,
    //       opportunity:
    //         moduleName === "opportunity" ? moduleId : note?.opportunity,
    //       activity: moduleName === "activity" ? moduleId : note?.activity,
    //     })
    //   );
    // }, [isModalOpen]);
    console.log("note at activity", note);
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    const handleReset = () => {
        setParams(initialParams);
    };
    const onBoxClick = (note) => {
        navigate(`/note/${note?.noteId}`);
    };
    const handlePaginationChange = (paginationModel) => {
        setParams({
            ...params,
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { children: _jsx(Modal, { open: isModalOpen, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addActivityFormDiv", children: [_jsx("div", { className: "addActivityTitle", children: "New Note" }), _jsx("div", { className: "addActivityFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, children: [_jsx(AddNoteForm, {}), _jsxs(Form.Item, { className: "addActivitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addActivityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addActivitySubmitBtn", loading: addNoteLoader, children: "Save" })] })] }) })] }) }) }), _jsxs("div", { className: "relatedListViewBackWrapper", children: [_jsxs("div", { className: "activitiesListToolbarWrapper", children: [_jsxs("div", { className: "activitiesListToolbarItem", children: [_jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx("img", { src: NOTES_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Related Notes", _jsx(Button, { onClick: showModal, className: "addOpportunityModalBtn", children: "New" })] }), selectedRowKeys.length > 0 ? (_jsx("div", { className: "activityDeleteBottomBar", children: _jsx(Popconfirm, { title: "Delete this note", description: "Are you sure you want to delete this record?", onConfirm: handleDelete, 
                                            // onCancel={onCancelDeletePopup}
                                            okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", danger: true, style: { marginLeft: "10px" }, children: "Delete selected" }) }) })) : null] }), _jsxs("div", { className: "opportunitiesSearchResetBar", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), style: { border: "1px solid var(--gray5)", padding: "2px 5px" }, value: params?.search }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filter" }), _jsx("div", { className: "opportunitiesSwitchDiv" })] })] }), _jsx("div", { style: { height: "50vh" }, children: _jsx(DataGrid, { rows: notes, columns: columns, loading: loading || addNoteLoader || getNoteLoader, getRowId: (row) => row?.noteId, checkboxSelection: user?.role === "ADMIN" ? true : false, onRowSelectionModelChange: (newSelection) => {
                                setSelectedRowKeys(newSelection);
                            }, paginationMode: "server", initialState: {
                                pagination: {
                                    paginationModel: {
                                        pageSize: params.limit,
                                        page: params.page - 1,
                                    },
                                },
                            }, onPaginationModelChange: handlePaginationChange, pageSizeOptions: [5, 10, 20, 25], rowCount: totalNotes > 0 ? totalNotes : 0 }, "noteId") })] })] }));
};
export default AllRelatedNotes;
