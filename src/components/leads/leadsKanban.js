import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Button, Form, Modal, Popconfirm, Spin } from "antd";
import { fetchAllLeadsWithParams, updateLeadByIdAndGetAllleadsWithParams, } from "../../redux/features/leadSlice";
import "../../styles/kanbanBoard/kanban.css";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useNavigate } from "react-router-dom";
import AddOpportunityForm from "../opportunities/addOpportunityForm";
import { addOpportunity, handleInputChangeReducerOpportunity, resetIsModalOpenOpportunity, } from "../../redux/features/opportunitiesSlice";
const LeadsKanban = ({ params }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [formOpportunity] = Form.useForm();
    const draggedLead = useRef(null);
    const { leads, addLeadLoader, loading } = useSelector((state) => state.leads);
    const { isModalOpenOpportunity, opportunity, addOpportunityLoader } = useAppSelector((state) => state.opportunities);
    const [localLeads, setLocalLeads] = useState([]);
    const [popconfirmVisible, setPopconfirmVisible] = useState(false);
    const [leadToUpdate, setLeadToUpdate] = useState(null);
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
            dispatch(handleInputChangeReducerOpportunity({
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
            }));
        }
    }, [isModalOpenOpportunity, leadToUpdate]);
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = async (e, status) => {
        e.preventDefault();
        if (draggedLead.current) {
            const updatedLead = {
                ...draggedLead.current,
                status: status,
            };
            const updatedLeads = localLeads?.map((lead) => lead.leadId === updatedLead?.leadId ? updatedLead : lead);
            setLocalLeads(updatedLeads);
            if (status === "Qualified") {
                setLeadToUpdate(updatedLead);
                setPopconfirmVisible(true);
            }
            else {
                await dispatch(updateLeadByIdAndGetAllleadsWithParams({
                    ...updatedLead,
                    contact: updatedLead?.contact
                        ? updatedLead.contact?.split("/")[1]
                        : null,
                    company: updatedLead?.company
                        ? updatedLead.company?.split("/")[1]
                        : null,
                }, params));
            }
        }
    };
    const onDragStart = (lead) => {
        draggedLead.current = lead;
    };
    const onBoxClick = (leadId) => {
        navigate(`/lead/${leadId}`);
    };
    const confirmChange = async () => {
        await dispatch(resetIsModalOpenOpportunity(true));
        await setPopconfirmVisible(false);
    };
    const cancelChange = () => {
        setPopconfirmVisible(false);
        dispatch(fetchAllLeadsWithParams(params));
    };
    const renderBoard = (status) => {
        return (_jsxs("div", { className: "kanbanColumns", style: {
                backgroundColor: "#F9F9F9",
                borderTop: `4px solid ${getBorderColor(status)}`,
            }, children: [_jsx("div", { className: "kanbanColumnsHeader", children: _jsx("p", { children: status }) }), _jsx("div", { className: "kanbanOverflowContainer", children: localLeads
                        .filter((lead) => lead?.status === status)
                        .map((lead, index) => (_jsx("div", { draggable: lead?.status === "Closed"
                            ? false
                            : lead?.status === "Qualified"
                                ? false
                                : true, onDragStart: () => onDragStart(lead), className: "kanbanCardWrapper", children: _jsxs("div", { className: "kanbanCardContainer", onClick: () => onBoxClick(lead?.leadId), children: [_jsx("div", { className: "kanbanCardText1", children: _jsx("p", { children: lead?.title }) }), _jsxs("div", { className: "kanbanCardText2", children: [_jsxs("div", { className: "kanbanCardText2Span", children: ["Rating : ", _jsxs("span", { className: "kanbanCardText2Value", children: [" ", lead?.rating] })] }), _jsxs("div", { className: "kanbanCardText2Span", children: ["Est. Revenue : ", _jsx("span", { className: "kanbanCardText2Value", children: lead?.price })] })] }), _jsx("div", { className: "kanbanCardIcons", children: lead?.owner !== null && lead?.owner !== undefined && (_jsxs(_Fragment, { children: [_jsx("div", { className: "leadsKanbanText", children: lead?.owner?.toString() }), _jsx("div", { className: "ownerAvatar", children: _jsxs(Avatar, { children: [lead?.owner?.toString().split(" ")[0]?.slice(0, 1), lead?.owner?.toString().split(" ")[1]?.slice(0, 1)] }) })] })) })] }) }, index))) })] }));
    };
    const getBorderColor = (status) => {
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
            await dispatch(updateLeadByIdAndGetAllleadsWithParams({
                ...leadToUpdate,
                contact: leadToUpdate?.contact
                    ? leadToUpdate.contact?.split("/")[1]
                    : null,
                company: leadToUpdate?.company
                    ? leadToUpdate.company?.split("/")[1]
                    : null,
            }, params)).then(() => {
                dispatch(addOpportunity(opportunity)).then(() => {
                    dispatch(fetchAllLeadsWithParams(params));
                });
                dispatch(resetIsModalOpenOpportunity(false));
                formOpportunity.resetFields();
            }).catch(() => {
                console.log("Operation cannot be completed, you may want to contact administrator for help.");
            });
        }
    };
    const handleCancelOpportunity = async () => {
        await dispatch(resetIsModalOpenOpportunity(false));
        await dispatch(fetchAllLeadsWithParams(params));
        await formOpportunity.resetFields();
    };
    return (_jsxs("div", { className: "kanbanMain", children: [_jsx(Popconfirm, { title: "Are you sure you want to mark this as Qualified?", open: popconfirmVisible, onConfirm: confirmChange, onCancel: cancelChange, okText: "Yes", cancelText: "No", children: _jsx("div", { className: "leadKanbanPopconfirm" }) }), _jsx(Modal, { open: isModalOpenOpportunity, onOk: handleSubmitOpportunity, onCancel: handleCancelOpportunity, footer: false, children: _jsxs("div", { className: "addOpportunityFormDiv", children: [_jsx("div", { className: "addOpportunityTitle", children: "New Opportunity" }), _jsx("div", { className: "addOpportunityFormWrapper", children: _jsxs(Form, { form: formOpportunity, name: "loginForm", onFinish: handleSubmitOpportunity, children: [_jsx(AddOpportunityForm, {}), _jsxs(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancelOpportunity, className: "addOpportunityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addOpportunitySubmitBtn", loading: addOpportunityLoader, children: "Save" })] })] }) })] }) }), _jsx(Spin, { spinning: addLeadLoader || loading, tip: "Loading...", children: _jsxs("div", { className: "kanabanBoardWrapper", children: [_jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "New"), children: renderBoard("New") }), _jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "In Progress"), children: renderBoard("In Progress") }), _jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "Qualified"), children: renderBoard("Qualified") })] }) })] }));
};
export default LeadsKanban;
