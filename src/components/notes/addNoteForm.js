import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form } from "antd";
import { useAppDispatch } from "../../redux/app/hooks";
import TextArea from "antd/es/input/TextArea";
import { handleInputChangeReducerNote, resetNote, } from "../../redux/features/noteSlice";
import { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Flex, Input, Tag, theme, Tooltip } from "antd";
const tagInputStyle = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: "top",
};
function AddNoteForm() {
    const dispatch = useAppDispatch();
    const { token } = theme.useToken();
    const [tagsString, setTagsString] = useState("");
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState("");
    const inputRef = useRef(null);
    const editInputRef = useRef(null);
    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);
    useEffect(() => {
        editInputRef.current?.focus();
    }, [editInputValue]);
    useEffect(() => {
        dispatch(resetNote());
        setTagsString("");
    }, []);
    const handleClose = (removedTag) => {
        const newTags = tagsString
            .split(", ")
            .filter((tag) => tag !== removedTag)
            .join(", ");
        setTagsString(newTags);
    };
    const showInput = () => {
        setInputVisible(true);
    };
    const handleInputChangeTag = (e) => {
        setInputValue(e.target.value);
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
    const tagPlusStyle = {
        height: 22,
        background: token.colorBgContainer,
        borderStyle: "dashed",
    };
    const tags = tagsString.split(", ");
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerNote({
            [name]: value,
        }));
    };
    return (_jsxs("div", { children: [_jsx(Form.Item, { name: "note", label: "Note", className: "addReferralFormInput", rules: [
                    {
                        required: true,
                        message: "This field is mandatory!",
                    },
                ], children: _jsx(TextArea, { onChange: handleInputChange, name: "note", placeholder: "Please enter here", maxLength: 499 }) }), _jsx(Form.Item, { name: "tags", label: "Tags", className: "addReferralFormInput", rules: [
                    {
                        required: false,
                        message: "This field is mandatory!",
                    },
                ], children: _jsxs(Flex, { gap: "4px 0", wrap: "wrap", children: [tags?.map((tag, index) => {
                            if (editInputIndex === index) {
                                return (_jsx(Input, { ref: editInputRef, size: "small", style: tagInputStyle, value: editInputValue, onChange: handleEditInputChange, onBlur: handleEditInputConfirm, onPressEnter: handleEditInputConfirm }, tag));
                            }
                            const isLongTag = tag.length > 20;
                            const tagElem = (_jsx(Tag, { closable: index !== 0, style: { userSelect: "none" }, onClose: () => handleClose(tag), children: _jsx("span", { onDoubleClick: (e) => {
                                        if (index !== 0) {
                                            setEditInputIndex(index);
                                            setEditInputValue(tag);
                                            e.preventDefault();
                                        }
                                    }, children: isLongTag ? `${tag.slice(0, 20)}...` : tag }) }, tag));
                            return isLongTag ? (_jsx(Tooltip, { title: tag, children: tagElem }, tag)) : (tagElem);
                        }), inputVisible ? (_jsx(Input, { ref: inputRef, type: "text", size: "small", style: tagInputStyle, value: inputValue, onChange: handleInputChangeTag, onBlur: handleInputConfirm, onPressEnter: handleInputConfirm })) : (_jsx(Tag, { style: tagPlusStyle, icon: _jsx(PlusOutlined, {}), onClick: showInput, children: "New Tag" }))] }) })] }));
}
export default AddNoteForm;
