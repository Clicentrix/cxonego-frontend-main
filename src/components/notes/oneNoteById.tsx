import {
  Avatar,
  Button,
  Flex,
  Form,
  Input,
  InputRef,
  Skeleton,
  Tag,
  Tooltip,
  theme,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/referrals/oneReferralView.css";
import TextArea from "antd/es/input/TextArea";
import { OWNER } from "../../utilities/common/imagesImports";
import {
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { handleBack } from "../../utilities/common/commonFunctions/handleBack";
import {
  getNoteById,
  handleInputChangeReducerNote,
  setEditableMode,
  updateNoteById,
} from "../../redux/features/noteSlice";
import "../../styles/notes/allNotes.css";

const OneNoteById: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [form] = Form.useForm();
  const { addNoteLoader, getNoteLoader, editable, note } = useAppSelector(
    (state: RootState) => state.notes
  );
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);

  const noteId = params?.noteId;
  const [tagsString, setTagsString] = useState<string>("");
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const tags = tagsString.split(", ");
  const { token } = theme.useToken();
  const tagInputStyle: React.CSSProperties = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: "top",
  };
  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "note") {
      dispatch(
        handleInputChangeReducerNote({
          [name]: value,
        })
      );
    } else {
      setInputValue(e.target.value);
    }
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

  const handleClose = (removedTag: string) => {
    const newTags = tagsString
      .split(", ")
      .filter((tag) => tag !== removedTag)
      .join(", ");
    setTagsString(newTags);
  };
  const handleSubmit = () => {
    if (editable) {
      dispatch(updateNoteById(note));
    } else {
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

  return (
    <div className="oneAccountMainWrapper">
      {getNoteLoader ? (
        <>
          <Skeleton />
        </>
      ) : (
        <div
          className={
            editable ? "oneAccountViewWrapper" : "onceAccountViewWrapperNotEdit"
          }
        >
          <Form
            form={form}
            name="loginForm"
            onFinish={handleSubmit}
            initialValues={note}
          >
            <div className="oneAccountTopToolbar1">
              <div className="notesSelectViewWrapper">
                <div className="notesSelectView1">
                  <LeftOutlined className="backArrow" onClick={handleBack} />
                  <div className="opportunitysViewTitle">Notes</div>
                  <RightOutlined />
                </div>
                <div className="notesSelectView1">
                  <Form.Item className="addAccountSubmitBtnWrapper">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="accountEditBtn"
                      loading={addNoteLoader}
                    >
                      {screenWidth < 768 ? (
                        editable ? (
                          <Tooltip title={"Update Note"}>
                            <CheckCircleOutlined />
                          </Tooltip>
                        ) : (
                          <Tooltip title={"Save Changes"}>
                            <EditOutlined />
                          </Tooltip>
                        )
                      ) : editable ? (
                        "Save Changes"
                      ) : (
                        "Edit"
                      )}
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </div>

            <div>
              <div>
                <div className="updateAccountDivCol">
                  <div className="updateNoteFlex">
                    <Form.Item
                      name="note"
                      label="Note"
                      className="addActivityFormInput"
                      style={{ width: "100%" }}
                      rules={[
                        {
                          required: false,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <TextArea
                        onChange={handleInputChange}
                        name="note"
                        placeholder="Please enter here"
                        readOnly={!editable}
                        maxLength={499}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="updateAccountDivCol">
                  <div className="updateNoteFlex">
                    <Form.Item
                      name="tags"
                      label="Tags"
                      className="addAccountFormInput"
                      rules={[
                        {
                          required: false,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Flex gap="10px 0" wrap="wrap">
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
                              closable={editable}
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
                            onChange={handleInputChange}
                            onBlur={handleInputConfirm}
                            onPressEnter={handleInputConfirm}
                            disabled={!editable}
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
                </div>
              </div>
              <div className="accountInfo1">
                <div className="opportunityInfo1CompanyNameLabel">
                  <img
                    src={OWNER}
                    alt="illustration"
                    className="illustrationIcon"
                  />
                  Owner
                </div>
                <div className="accountOwnerDiv">
                  <Avatar>{note?.owner?.firstName?.slice(0, 1)}</Avatar>
                  <p className="accountInfo1CompanyName">
                    {note?.owner?.firstName} {note?.owner?.lastName}
                  </p>
                </div>
              </div>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default OneNoteById;
