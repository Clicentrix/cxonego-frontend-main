import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Button, Form, Modal, Popconfirm, Spin } from "antd";
import { FetchLeadsParams, Lead } from "../../utilities/common/exportDataTypes/leadDataTypes";
import { RootState } from "../../redux/app/store";
import {
  fetchAllLeadsWithParams,
  updateLeadByIdAndGetAllleadsWithParams,
} from "../../redux/features/leadSlice";
import "../../styles/kanbanBoard/kanban.css";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useNavigate } from "react-router-dom";
import AddOpportunityForm from "../opportunities/addOpportunityForm";
import {
  addOpportunity,
  handleInputChangeReducerOpportunity,
  resetIsModalOpenOpportunity,
} from "../../redux/features/opportunitiesSlice";

type props = {
  params: FetchLeadsParams
}
const LeadsKanban: React.FC<props> = ({ params }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formOpportunity] = Form.useForm();
  const draggedLead = useRef<Lead | null>(null);
  const { leads, addLeadLoader, loading } = useSelector(
    (state: RootState) => state.leads
  );
  const { isModalOpenOpportunity, opportunity, addOpportunityLoader } =
    useAppSelector((state: RootState) => state.opportunities);
  const [localLeads, setLocalLeads] = useState<Lead[]>([]);
  const [popconfirmVisible, setPopconfirmVisible] = useState<boolean>(false);
  const [leadToUpdate, setLeadToUpdate] = useState<Lead | null>(null);

  useEffect(() => {
    setLocalLeads(leads || []);
  }, [leads]);

  useEffect(() => {
    if (isModalOpenOpportunity && leadToUpdate) {
      formOpportunity.setFieldsValue({
        title: leadToUpdate?.title,
        contact: leadToUpdate?.contact
          ? leadToUpdate.contact?.split("/")[1]
          : null,
        company: leadToUpdate?.company
          ? leadToUpdate.company?.split("/")[1]
          : null,
        currency: leadToUpdate?.currency,
        estimatedRevenue: leadToUpdate?.price,
        Lead: leadToUpdate?.leadId,
      });
      dispatch(
        handleInputChangeReducerOpportunity({
          title: leadToUpdate?.title,
          contact: leadToUpdate?.contact
            ? leadToUpdate.contact?.split("/")[1]
            : null,
          company: leadToUpdate?.company
            ? leadToUpdate.company?.split("/")[1]
            : null,
          currency: leadToUpdate?.currency,
          estimatedRevenue: leadToUpdate?.price,
          Lead: leadToUpdate?.leadId,
        })
      );
    }
  }, [isModalOpenOpportunity, leadToUpdate]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    status: string
  ) => {
    e.preventDefault();
    if (draggedLead.current) {
      const updatedLead = {
        ...draggedLead.current,
        status: status,
      };

      const updatedLeads = localLeads?.map((lead) =>
        lead.leadId === updatedLead?.leadId ? updatedLead : lead
      );
      setLocalLeads(updatedLeads);

      if (status === "Qualified") {
        setLeadToUpdate(updatedLead);
        setPopconfirmVisible(true);
      } else {
        await dispatch(
          updateLeadByIdAndGetAllleadsWithParams({
            ...updatedLead,
            contact: updatedLead?.contact
              ? updatedLead.contact?.split("/")[1]
              : null,
            company: updatedLead?.company
              ? updatedLead.company?.split("/")[1]
              : null,
          }, params)
        );
      }
    }
  };

  const onDragStart = (lead: Lead) => {
    draggedLead.current = lead;
  };

  const onBoxClick = (leadId: string) => {
    navigate(`/lead/${leadId}`);
  };

  const confirmChange = async () => {
    await dispatch(resetIsModalOpenOpportunity(true));
    await setPopconfirmVisible(false);
  };

  const cancelChange = () => {
    setPopconfirmVisible(false);
    dispatch(fetchAllLeadsWithParams(params))
  };

  const renderBoard = (status: string) => {
    return (
      <div
        className="kanbanColumns"
        style={{
          backgroundColor: "#F9F9F9",
          borderTop: `4px solid ${getBorderColor(status)}`,
        }}
      >
        <div className="kanbanColumnsHeader">
          <p>{status}</p>

        </div>
        <div className="kanbanOverflowContainer">
          {localLeads
            .filter((lead) => lead?.status === status)
            .map((lead, index) => (

              <div
                key={index}
                draggable={
                  lead?.status === "Closed"
                    ? false
                    : lead?.status === "Qualified"
                      ? false
                      : true
                }
                onDragStart={() => onDragStart(lead)}
                className="kanbanCardWrapper"
              >
                <div
                  className="kanbanCardContainer"
                  onClick={() => onBoxClick(lead?.leadId)}
                >
                  <div className="kanbanCardText1">
                    <p>{lead?.title}</p>

                  </div>
                  <div className="kanbanCardText2">
                    <div className="kanbanCardText2Span">Rating : <span className="kanbanCardText2Value">
                      {" "}
                      {lead?.rating}
                    </span></div>

                    <div className="kanbanCardText2Span">Est. Revenue : <span className="kanbanCardText2Value">{lead?.price}</span></div>

                  </div>
                  <div className="kanbanCardIcons">

                    {lead?.owner !== null && lead?.owner !== undefined && (
                      <>
                        <div className="leadsKanbanText">
                          {lead?.owner?.toString()}
                        </div>
                        <div className="ownerAvatar">
                          <Avatar>{lead?.owner?.toString().split(" ")[0]?.slice(0, 1)}{lead?.owner?.toString().split(" ")[1]?.slice(0, 1)}
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

  const getBorderColor = (status: string) => {
    switch (status) {
      case "New":
        return "#FF802C";
      case "In Progress":
        return "#2BA6FF";
      case "Qualified":
        return "#56C300";
      case "Closed":
        return "#505265";
      default:
        return "#000000";
    }
  };

  const handleSubmitOpportunity = async () => {
    if (leadToUpdate) {
      await dispatch(
        updateLeadByIdAndGetAllleadsWithParams({
          ...leadToUpdate,
          contact: leadToUpdate?.contact
            ? leadToUpdate.contact?.split("/")[1]
            : null,
          company: leadToUpdate?.company
            ? leadToUpdate.company?.split("/")[1]
            : null,
        }, params)
      ).then(() => {
        dispatch(addOpportunity(opportunity)).then(() => {
          dispatch(fetchAllLeadsWithParams(params));
        })
        dispatch(resetIsModalOpenOpportunity(false));
        formOpportunity.resetFields();
      }).catch(() => {
        console.log("Operation cannot be completed, you may want to contact administrator for help.")
      })
    }
  };

  const handleCancelOpportunity = async () => {
    await dispatch(resetIsModalOpenOpportunity(false));
    await dispatch(fetchAllLeadsWithParams(params))
    await formOpportunity.resetFields();
  };


  return (
    <div className="kanbanMain">
      <Popconfirm
        title="Are you sure you want to mark this as Qualified?"
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
        open={isModalOpenOpportunity}
        onOk={handleSubmitOpportunity}
        onCancel={handleCancelOpportunity}
        footer={false}
      >
        <div className="addOpportunityFormDiv">
          <div className="addOpportunityTitle">New Opportunity</div>
          <div className="addOpportunityFormWrapper">
            <Form
              form={formOpportunity}
              name="loginForm"
              onFinish={handleSubmitOpportunity}
            >
              <AddOpportunityForm />
              <Form.Item className="addOpportunitySubmitBtnWrapper">
                <Button
                  onClick={handleCancelOpportunity}
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

      <Spin spinning={addLeadLoader || loading} tip="Loading...">
        <div className="kanabanBoardWrapper">
          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "New")}
          >
            {renderBoard("New")}
          </div>

          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "In Progress")}
          >
            {renderBoard("In Progress")}
          </div>

          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Qualified")}
          >
            {renderBoard("Qualified")}
          </div>

          {/* <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Closed")}
          >
            {renderBoard("Closed")}
          </div> */}
        </div>
      </Spin>
    </div>
  );
};

export default LeadsKanban;
