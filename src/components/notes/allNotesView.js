import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Tag, Tooltip } from "antd";
import { createAndGetAllNotes, deleteNotesByIdAndGetAllNotesTotal, fetchAllNotes, resetNote, resetNotes, } from "../../redux/features/noteSlice";
import { DataGrid, } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import AddNoteForm from "./addNoteForm";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { NOTES_ICON_ORANGE } from "../../utilities/common/imagesImports";
import { PlusOutlined } from "@ant-design/icons";
const AllNotesView = () => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { note, notes, loading, addNoteLoader, getNoteLoader, totalNotes } = useAppSelector((state) => state.notes);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const { user } = useAppSelector((state) => state.authentication);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [tagsString, setTagsString] = useState("");
    const initialParams = {
        page: 1,
        limit: 10,
        search: null || "",
    };
    const [params, setParams] = useState(initialParams);
    const onSearch = (value) => {
        setParams({ ...params, search: value });
    };
    const onBoxClick = (note) => {
        navigate(`/note/${note?.noteId}`);
    };
    const handleReset = () => {
        setParams(initialParams);
    };
    const columns = [
        {
            field: "noteId",
            headerName: "NOTE NUMBER",
            width: 300,
            renderCell: (params) => (_jsx("div", { className: "hyperlinkBlue", onClick: () => onBoxClick(params?.row), children: params?.row?.noteId || emptyValue })),
        },
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
    const handleResetForm = () => {
        form.resetFields();
        setTagsString("");
        dispatch(resetNote());
    };
    const handleSubmit = () => {
        dispatch(createAndGetAllNotes(note, params));
        setIsModalOpen(false);
        handleResetForm();
    };
    const showModal = () => {
        setIsModalOpen(true);
        handleResetForm();
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        handleResetForm();
    };
    const handleClose = (removedTag) => {
        const newTags = tagsString
            .split(", ")
            .filter((tag) => tag !== removedTag)
            .join(", ");
        setTagsString(newTags);
    };
    const handleDelete = () => {
        dispatch(deleteNotesByIdAndGetAllNotesTotal(selectedRowKeys, params));
        setSelectedRowKeys([]);
    };
    const handlePaginationChange = (paginationModel) => {
        setParams({
            ...params,
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    };
    useEffect(() => {
        dispatch(fetchAllNotes(params));
    }, [params]);
    useEffect(() => {
        dispatch(resetNote());
        dispatch(resetNotes());
    }, [dispatch]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { children: _jsx(Modal, { open: isModalOpen, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addActivityFormDiv", children: [_jsx("div", { className: "addActivityTitle", children: "New Note" }), _jsx("div", { className: "addActivityFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, children: [_jsx(AddNoteForm, {}), _jsxs(Form.Item, { className: "addActivitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addActivityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addActivitySubmitBtn", loading: addNoteLoader, children: "Save" })] })] }) })] }) }) }), _jsxs("div", { className: "listViewBackWrapper", children: [_jsxs("div", { className: "activitiesListToolbarWrapper", children: [_jsxs("div", { className: "activitiesListToolbarItem", children: [_jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx("img", { src: NOTES_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Notes", screenWidth < 768 ? (_jsx(Tooltip, { title: "Add new activity", children: _jsx(PlusOutlined, { onClick: showModal }) })) : (_jsx(Button, { onClick: showModal, className: "addOpportunityModalBtn", children: "New" }))] }), selectedRowKeys.length > 0 ? (_jsx("div", { className: "activityDeleteBottomBar", children: _jsx(Popconfirm, { title: "Delete this note", description: "Are you sure you want to delete this record?", onConfirm: handleDelete, 
                                            // onCancel={onCancelDeletePopup}
                                            okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", danger: true, style: { marginLeft: "10px" }, children: "Delete selected" }) }) })) : null] }), _jsxs("div", { className: "opportunitiesSearchResetBar", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), value: params?.search }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset filter" }), _jsx("div", { className: "opportunitiesSwitchDiv" })] })] }), _jsx("div", { style: { height: "75vh" }, children: _jsx(DataGrid, { rows: notes, columns: columns, loading: loading || addNoteLoader || getNoteLoader, getRowId: (row) => row?.noteId, checkboxSelection: user?.role === "ADMIN" ? true : false, onRowSelectionModelChange: (newSelection) => {
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
export default AllNotesView;
