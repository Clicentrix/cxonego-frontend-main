import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, Button, Flex, Form, Input, Skeleton, Tag, Tooltip, theme, } from "antd";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/referrals/oneReferralView.css";
import TextArea from "antd/es/input/TextArea";
import { OWNER } from "../../utilities/common/imagesImports";
import { LeftOutlined, RightOutlined, PlusOutlined, EditOutlined, CheckCircleOutlined, } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { handleBack } from "../../utilities/common/commonFunctions/handleBack";
import { getNoteById, handleInputChangeReducerNote, setEditableMode, updateNoteById, } from "../../redux/features/noteSlice";
import "../../styles/notes/allNotes.css";
const OneNoteById = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const [form] = Form.useForm();
    const { addNoteLoader, getNoteLoader, editable, note } = useAppSelector((state) => state.notes);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const noteId = params?.noteId;
    const [tagsString, setTagsString] = useState("");
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState("");
    const inputRef = useRef(null);
    const editInputRef = useRef(null);
    const tags = tagsString.split(", ");
    const { token } = theme.useToken();
    const tagInputStyle = {
        width: 64,
        height: 22,
        marginInlineEnd: 8,
        verticalAlign: "top",
    };
    const tagPlusStyle = {
        height: 22,
        background: token.colorBgContainer,
        borderStyle: "dashed",
    };
    const showInput = () => {
        setInputVisible(true);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "note") {
            dispatch(handleInputChangeReducerNote({
                [name]: value,
            }));
        }
        else {
            setInputValue(e.target.value);
        }
    };
    const handleInputConfirm = () => {
        if (inputValue && !tagsString.includes(inputValue)) {
            const newTags = tagsString === "" ? inputValue : `${tagsString}, ${inputValue}`;
            setTagsString(newTags);
            dispatch(handleInputChangeReducerNote({ tags: newTags }));
        }
        setInputVisible(false);
        setInputValue("");
    };
    const handleEditInputChange = (e) => {
        setEditInputValue(e.target.value);
    };
    const handleEditInputConfirm = () => {
        const tagsArray = tagsString.split(", ");
        tagsArray[editInputIndex] = editInputValue;
        const newTags = tagsArray.join(", ");
        setTagsString(newTags);
        setEditInputIndex(-1);
        setEditInputValue("");
    };
    const handleClose = (removedTag) => {
        const newTags = tagsString
            .split(", ")
            .filter((tag) => tag !== removedTag)
            .join(", ");
        setTagsString(newTags);
    };
    const handleSubmit = () => {
        if (editable) {
            dispatch(updateNoteById(note));
        }
        else {
            dispatch(setEditableMode(true));
        }
    };
    useEffect(() => {
        if (noteId) {
            dispatch(setEditableMode(false));
            dispatch(getNoteById(noteId));
        }
    }, [noteId]);
    useEffect(() => {
        form.setFieldsValue(note);
    }, [note]);
    useEffect(() => {
        setTagsString(note?.tags || "");
    }, [note]);
    return (_jsx("div", { className: "oneAccountMainWrapper", children: getNoteLoader ? (_jsx(_Fragment, { children: _jsx(Skeleton, {}) })) : (_jsx("div", { className: editable ? "oneAccountViewWrapper" : "onceAccountViewWrapperNotEdit", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, initialValues: note, children: [_jsx("div", { className: "oneAccountTopToolbar1", children: _jsxs("div", { className: "notesSelectViewWrapper", children: [_jsxs("div", { className: "notesSelectView1", children: [_jsx(LeftOutlined, { className: "backArrow", onClick: handleBack }), _jsx("div", { className: "opportunitysViewTitle", children: "Notes" }), _jsx(RightOutlined, {})] }), _jsx("div", { className: "notesSelectView1", children: _jsx(Form.Item, { className: "addAccountSubmitBtnWrapper", children: _jsx(Button, { type: "primary", htmlType: "submit", className: "accountEditBtn", loading: addNoteLoader, children: screenWidth < 768 ? (editable ? (_jsx(Tooltip, { title: "Update Note", children: _jsx(CheckCircleOutlined, {}) })) : (_jsx(Tooltip, { title: "Save Changes", children: _jsx(EditOutlined, {}) }))) : editable ? ("Save Changes") : ("Edit") }) }) })] }) }), _jsxs("div", { children: [_jsxs("div", { children: [_jsx("div", { className: "updateAccountDivCol", children: _jsx("div", { className: "updateNoteFlex", children: _jsx(Form.Item, { name: "note", label: "Note", className: "addActivityFormInput", style: { width: "100%" }, rules: [
                                                    {
                                                        required: false,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(TextArea, { onChange: handleInputChange, name: "note", placeholder: "Please enter here", readOnly: !editable, maxLength: 499 }) }) }) }), _jsx("div", { className: "updateAccountDivCol", children: _jsx("div", { className: "updateNoteFlex", children: _jsx(Form.Item, { name: "tags", label: "Tags", className: "addAccountFormInput", rules: [
                                                    {
                                                        required: false,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsxs(Flex, { gap: "10px 0", wrap: "wrap", children: [tags?.map((tag, index) => {
                                                            if (editInputIndex === index) {
                                                                return (_jsx(Input, { ref: editInputRef, size: "small", style: tagInputStyle, value: editInputValue, onChange: handleEditInputChange, onBlur: handleEditInputConfirm, onPressEnter: handleEditInputConfirm }, tag));
                                                            }
                                                            const isLongTag = tag.length > 20;
                                                            const tagElem = (_jsx(Tag, { closable: editable, style: { userSelect: "none" }, onClose: () => handleClose(tag), children: _jsx("span", { onDoubleClick: (e) => {
                                                                        if (index !== 0) {
                                                                            setEditInputIndex(index);
                                                                            setEditInputValue(tag);
                                                                            e.preventDefault();
                                                                        }
                                                                    }, children: isLongTag ? `${tag.slice(0, 20)}...` : tag }) }, tag));
                                                            return isLongTag ? (_jsx(Tooltip, { title: tag, children: tagElem }, tag)) : (tagElem);
                                                        }), inputVisible ? (_jsx(Input, { ref: inputRef, type: "text", size: "small", style: tagInputStyle, value: inputValue, onChange: handleInputChange, onBlur: handleInputConfirm, onPressEnter: handleInputConfirm, disabled: !editable })) : (_jsx(Tag, { style: tagPlusStyle, icon: _jsx(PlusOutlined, {}), onClick: showInput, children: "New Tag" }))] }) }) }) })] }), _jsxs("div", { className: "accountInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "accountOwnerDiv", children: [_jsx(Avatar, { children: note?.owner?.firstName?.slice(0, 1) }), _jsxs("p", { className: "accountInfo1CompanyName", children: [note?.owner?.firstName, " ", note?.owner?.lastName] })] })] })] })] }) })) }));
};
export default OneNoteById;
