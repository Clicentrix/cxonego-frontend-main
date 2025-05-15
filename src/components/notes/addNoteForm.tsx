import { Form } from "antd";
import { useAppDispatch } from "../../redux/app/hooks";
import TextArea from "antd/es/input/TextArea";
import {
  handleInputChangeReducerNote,
  resetNote,
} from "../../redux/features/noteSlice";
import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Flex, Input, Tag, theme, Tooltip } from "antd";

const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: "top",
};

function AddNoteForm() {
  const dispatch = useAppDispatch();
  const { token } = theme.useToken();
  const [tagsString, setTagsString] = useState<string>("");
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

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

  const handleClose = (removedTag: string) => {
    const newTags = tagsString
      .split(", ")
      .filter((tag) => tag !== removedTag)
      .join(", ");
    setTagsString(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChangeTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tagsString.includes(inputValue)) {
      const newTags =
        tagsString === "" ? inputValue : `${tagsString}, ${inputValue}`;
      setTagsString(newTags);
      dispatch(handleInputChangeReducerNote({ tags: newTags }));
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  const tags = tagsString.split(", ");
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(
      handleInputChangeReducerNote({
        [name]: value,
      })
    );
  };

  return (
    <div>
      <Form.Item
        name="note"
        label="Note"
        className="addReferralFormInput"
        rules={[
          {
            required: true,
            message: "This field is mandatory!",
          },
        ]}
      >
        <TextArea
          onChange={handleInputChange}
          name="note"
          placeholder="Please enter here"
          maxLength={499}
        />
      </Form.Item>
      <Form.Item
        name="tags"
        label="Tags"
        className="addReferralFormInput"
        rules={[
          {
            required: false,
            message: "This field is mandatory!",
          },
        ]}
      >
        <Flex gap="4px 0" wrap="wrap">
          {tags?.map<React.ReactNode>((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={editInputRef}
                  key={tag}
                  size="small"
                  style={tagInputStyle}
                  value={editInputValue}
                  onChange={handleEditInputChange}
                  onBlur={handleEditInputConfirm}
                  onPressEnter={handleEditInputConfirm}
                />
              );
            }
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable={index !== 0}
                style={{ userSelect: "none" }}
                onClose={() => handleClose(tag)}
              >
                <span
                  onDoubleClick={(e) => {
                    if (index !== 0) {
                      setEditInputIndex(index);
                      setEditInputValue(tag);
                      e.preventDefault();
                    }
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
          {inputVisible ? (
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={tagInputStyle}
              value={inputValue}
              onChange={handleInputChangeTag}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          ) : (
            <Tag
              style={tagPlusStyle}
              icon={<PlusOutlined />}
              onClick={showInput}
            >
              New Tag
            </Tag>
          )}
        </Flex>
      </Form.Item>
    </div>
  );
}

export default AddNoteForm;
