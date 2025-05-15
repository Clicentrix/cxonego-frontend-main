import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Spin,
} from "antd";
import { RootState } from "../../redux/app/store";
import "../../styles/kanbanBoard/kanban.css";
import { useAppDispatch } from "../../redux/app/hooks";
import { Opportunity } from "../../utilities/common/exportDataTypes/opportunityDataTypes";
import { useNavigate } from "react-router-dom";
import {
  lostReasonOptions,
  wonReasonOptions,
} from "../../utilities/common/dataArrays";
import TextArea from "antd/es/input/TextArea";
import { fetchAllOpportunities, updateOpportunityByIdAndGetAllOpportunitiesWithParams } from "../../redux/features/opportunitiesSlice";
import { FetchAccountsParams } from "../../utilities/common/exportDataTypes/accountDataTypes";

type props = {
  params: FetchAccountsParams
}
const OpportunitiesKanban: React.FC<props> = ({ params }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const draggedOpportunity = useRef<Opportunity | null>(null);
  const [wonOrLost, setWonOrLost] = useState<string>("Won");
  const [popconfirmVisible, setPopconfirmVisible] = useState<boolean>(false);
  const [opportunityToUpdate, setOpportunityToUpdate] =
    useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { opportunities, addOpportunityLoader } = useSelector(
    (state: RootState) => state.opportunities
  );
  const [localOpportunities, setLocalOpportunities] = useState<Opportunity[]>(
    []
  );

  // opportunity closure code
  const handleSelectChange = (value: string, name: string) => {
    setOpportunityToUpdate((prevOpportunity) => ({
      ...prevOpportunity!,
      [name]: value,
    }));
  };

  const handleCloseOpportunity = async () => {
    await dispatch(
      updateOpportunityByIdAndGetAllOpportunitiesWithParams({
        ...opportunityToUpdate!,
        estimatedCloseDate: opportunityToUpdate?.estimatedCloseDate
          ? new Date(opportunityToUpdate?.estimatedCloseDate).toISOString()
          : opportunityToUpdate?.estimatedCloseDate!,
      }, params)
    );
    setIsModalOpen(false);
  };

  const handleCancel = async () => {
    await dispatch(fetchAllOpportunities(params))
    await setIsModalOpen(false);
    await form.resetFields();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOpportunityToUpdate((prevOpportunity) => ({
      ...prevOpportunity!,
      [name]: value,
    }));
  };

  const confirmChange = async () => {
    await setIsModalOpen(true);
    form.resetFields();
    await setPopconfirmVisible(false);
  };

  const cancelChange = () => {
    setPopconfirmVisible(false);
    dispatch(fetchAllOpportunities(params))
  };

  useEffect(() => {
    setLocalOpportunities(opportunities || []);
  }, [opportunities]);

  const onBoxClick = (opportunityId: string) => {
    navigate(`/opportunity/${opportunityId}`);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    stage: string
  ) => {
    e.preventDefault();
    if (draggedOpportunity.current) {
      // Update the stage of the opportunity to the specified stage
      const updatedOpportunity: Opportunity = {
        ...draggedOpportunity.current,
        stage: stage,
      };

      // Update local state and dispatch action
      const updatedOpportunities = localOpportunities?.map((opportunity) =>
        opportunity?.opportunityId === updatedOpportunity?.opportunityId
          ? updatedOpportunity
          : opportunity
      );
      setLocalOpportunities(updatedOpportunities);
      if (stage === "Won" || stage === "Lost") {
        setPopconfirmVisible(true);
        setWonOrLost(stage);
        setOpportunityToUpdate({
          ...updatedOpportunity,
          stage: stage,
          contact: updatedOpportunity?.contact?.includes("/")
            ? updatedOpportunity.contact?.split("/")[1]
            : updatedOpportunity?.contact,
          company: updatedOpportunity?.company?.includes("/")
            ? updatedOpportunity.company?.split("/")[1]
            : updatedOpportunity?.company,
        });
      } else {
        // Dispatch action to update opportunity in Redux store
        await dispatch(
          updateOpportunityByIdAndGetAllOpportunitiesWithParams({
            ...updatedOpportunity,
            contact: updatedOpportunity?.contact?.includes("/")
              ? updatedOpportunity.contact?.split("/")[1]
              : updatedOpportunity?.contact,
            company: updatedOpportunity?.company?.includes("/")
              ? updatedOpportunity.company?.split("/")[1]
              : updatedOpportunity?.company,
          }, params)
        );
      }
    }
  };
  const onDragStart = (opportunity: Opportunity) => {
    draggedOpportunity.current = opportunity;
  };

  const renderBoard = (stage: string) => {
    return (
      <div
        className="kanbanColumns"
        style={{
          backgroundColor: "#F9F9F9",
          borderTop: `4px solid ${getBorderColor(stage)}`,
        }}
      >
        <div className="kanbanColumnsHeader">
          <p>{stage}</p>

        </div>
        <div className="kanbanOverflowContainer">
          {localOpportunities
            .filter((opportunity) => opportunity?.stage === stage)
            .map((opportunity, index) => (
              <div
                key={index}
                draggable={opportunity?.stage !== "Lost" && opportunity?.stage !== "Won"}
                onDragStart={() => onDragStart(opportunity)}
                // onDragEnter={() => handleDrop(e, status)}
                className="kanbanCardWrapper"
              >
                {/* Content of the opportunity card */}
                {/* Replace this with your actual card layout */}
                <div
                  className="kanbanCardContainer"
                  onClick={() => onBoxClick(opportunity?.opportunityId)}
                >
                  <div>
                    <div className="kanbanCardText1">
                      <p>{opportunity?.title}</p>

                    </div>
                    <div className="kanbanCardText2">
                      <div className="kanbanCardText2Span">Priority : <span className="kanbanCardText2Value">
                        {" "}
                        {opportunity?.priority}
                      </span></div>

                      <div className="kanbanCardText2Span">Est. Revenue : <span className="kanbanCardText2Value">
                        {opportunity?.estimatedRevenue}
                      </span></div>

                    </div>
                  </div>
                  <div className="kanbanCardIcons">

                    {opportunity?.owner !== null && opportunity?.owner !== undefined && (
                      <>
                        <div className="leadsKanbanText">
                          {opportunity?.owner?.toString()}
                        </div>
                        <div className="ownerAvatar">
                          <Avatar>{opportunity?.owner?.toString().split(" ")[0]?.slice(0, 1)}{opportunity?.owner?.toString().split(" ")[1]?.slice(0, 1)}
                          </Avatar></div>
                      </>
                    )}

                  </div>

                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  // Function to get border color based on status
  const getBorderColor = (stage: string) => {
    switch (stage) {
      case "Analysis":
        return "#FF802C";
      case "Solutioning":
        return "#2BA6FF";
      case "Proposal":
        return "#56C300";
      case "Negotiation":
        return "#505265";
      case "Won":
        return "#FFD700";
      case "Lost":
        return "#FF6347";
      default:
        return "#000000";
    }
  };

  return (
    <div className="kanbanMain">
      <Popconfirm
        title={`Are you sure you want to close this opportunity as ${wonOrLost}?`}
        open={popconfirmVisible}
        onConfirm={confirmChange}
        onCancel={cancelChange}
        okText="Yes"
        cancelText="No"
      >
        {/* You can place a dummy element here to ensure Popconfirm is rendered */}
        <div className="leadKanbanPopconfirm"></div>
      </Popconfirm>
      <Modal
        open={isModalOpen}
        onOk={handleCloseOpportunity}
        onCancel={handleCancel}
        footer={false}
      >
        <div className="addAccountFormDiv">
          <div className="addAccountTitle">Close Opportunity</div>
          <div className="addOpportunityFormWrapper">
            <Form
              form={form}
              name="loginForm"
              onFinish={handleCloseOpportunity}
            >
              {wonOrLost === "Won" ? (
                <Form.Item
                  name="wonReason"
                  label="Won Reason"
                  className="addOpportunityFormInput"
                  rules={[
                    {
                      required: true,
                      message: "This field is mandatory!",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => handleSelectChange(value, "wonReason")}
                    options={wonReasonOptions}
                    showSearch
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  name="lostReason"
                  label="Lost Reason"
                  className="addOpportunityFormInput"
                  rules={[
                    {
                      required: true,
                      message: "This field is mandatory!",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) =>
                      handleSelectChange(value, "lostReason")
                    }
                    options={lostReasonOptions}
                  />
                </Form.Item>
              )}
              <Form.Item
                name="actualRevenue"
                label="Actual Revenue"
                className="addOpportunityFormInput"
                rules={[
                  {
                    required: true,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Input
                  onChange={handleInputChange}
                  name="actualRevenue"
                  type="number"
                  placeholder="Please enter here"
                />
              </Form.Item>
              <Form.Item
                label="Actual. Close Date"
                className="addOpportunityFormInput"
                rules={[
                  {
                    required: true,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <DatePicker
                  onChange={(_date, dateString) => {
                    // Ensure dateString is a string before converting to Date
                    if (typeof dateString === "string") {
                      const dateObject = new Date(dateString);
                      if (!isNaN(dateObject.getTime())) {
                        // Check if dateObject is valid
                        setOpportunityToUpdate((prevOpportunity) => ({
                          ...prevOpportunity!,
                          actualCloseDate: dateObject.toISOString(),
                        }));
                      } else {
                        console.error("Invalid date string:", dateString);
                      }
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                name="wonLostDescription"
                label="Note"
                className="addOpportunityFormInput"
                rules={[
                  {
                    required: false,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <TextArea
                  onChange={handleInputChange}
                  name="wonLostDescription"
                  placeholder="Please enter here"
                  maxLength={499}
                />
              </Form.Item>
              <Form.Item className="addOpportunitySubmitBtnWrapper">
                <Button
                  onClick={handleCancel}
                  className="addOpportunityCancelBtn"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="addOpportunitySubmitBtn"
                  loading={addOpportunityLoader}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
      {/* Rendering Kanban columns */}
      <Spin spinning={addOpportunityLoader} tip="Loading...">
        <div className="kanabanBoardWrapper">
          {/* New */}
          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Analysis")}
          >
            {renderBoard("Analysis")}
          </div>

          {/* In Progress */}
          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Solutioning")}
          >
            {renderBoard("Solutioning")}
          </div>

          {/* Qualified */}
          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Proposal")}
          >
            {renderBoard("Proposal")}
          </div>

          {/* Closed */}
          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Negotiation")}
          >
            {renderBoard("Negotiation")}
          </div>
          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Won")}
          >
            {renderBoard("Won")}
          </div>
          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Lost")}
          >
            {renderBoard("Lost")}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default OpportunitiesKanban;
