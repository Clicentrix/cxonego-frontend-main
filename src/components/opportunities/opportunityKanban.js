import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Spin, } from "antd";
import "../../styles/kanbanBoard/kanban.css";
import { useAppDispatch } from "../../redux/app/hooks";
import { useNavigate } from "react-router-dom";
import { lostReasonOptions, wonReasonOptions, } from "../../utilities/common/dataArrays";
import TextArea from "antd/es/input/TextArea";
import { fetchAllOpportunities, updateOpportunityByIdAndGetAllOpportunitiesWithParams } from "../../redux/features/opportunitiesSlice";
const OpportunitiesKanban = ({ params }) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const draggedOpportunity = useRef(null);
    const [wonOrLost, setWonOrLost] = useState("Won");
    const [popconfirmVisible, setPopconfirmVisible] = useState(false);
    const [opportunityToUpdate, setOpportunityToUpdate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { opportunities, addOpportunityLoader } = useSelector((state) => state.opportunities);
    const [localOpportunities, setLocalOpportunities] = useState([]);
    // opportunity closure code
    const handleSelectChange = (value, name) => {
        setOpportunityToUpdate((prevOpportunity) => ({
            ...prevOpportunity,
            [name]: value,
        }));
    };
    const handleCloseOpportunity = async () => {
        await dispatch(updateOpportunityByIdAndGetAllOpportunitiesWithParams({
            ...opportunityToUpdate,
            estimatedCloseDate: opportunityToUpdate?.estimatedCloseDate
                ? new Date(opportunityToUpdate?.estimatedCloseDate).toISOString()
                : opportunityToUpdate?.estimatedCloseDate,
        }, params));
        setIsModalOpen(false);
    };
    const handleCancel = async () => {
        await dispatch(fetchAllOpportunities(params));
        await setIsModalOpen(false);
        await form.resetFields();
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOpportunityToUpdate((prevOpportunity) => ({
            ...prevOpportunity,
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
        dispatch(fetchAllOpportunities(params));
    };
    useEffect(() => {
        setLocalOpportunities(opportunities || []);
    }, [opportunities]);
    const onBoxClick = (opportunityId) => {
        navigate(`/opportunity/${opportunityId}`);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = async (e, stage) => {
        e.preventDefault();
        if (draggedOpportunity.current) {
            // Update the stage of the opportunity to the specified stage
            const updatedOpportunity = {
                ...draggedOpportunity.current,
                stage: stage,
            };
            // Update local state and dispatch action
            const updatedOpportunities = localOpportunities?.map((opportunity) => opportunity?.opportunityId === updatedOpportunity?.opportunityId
                ? updatedOpportunity
                : opportunity);
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
            }
            else {
                // Dispatch action to update opportunity in Redux store
                await dispatch(updateOpportunityByIdAndGetAllOpportunitiesWithParams({
                    ...updatedOpportunity,
                    contact: updatedOpportunity?.contact?.includes("/")
                        ? updatedOpportunity.contact?.split("/")[1]
                        : updatedOpportunity?.contact,
                    company: updatedOpportunity?.company?.includes("/")
                        ? updatedOpportunity.company?.split("/")[1]
                        : updatedOpportunity?.company,
                }, params));
            }
        }
    };
    const onDragStart = (opportunity) => {
        draggedOpportunity.current = opportunity;
    };
    const renderBoard = (stage) => {
        return (_jsxs("div", { className: "kanbanColumns", style: {
                backgroundColor: "#F9F9F9",
                borderTop: `4px solid ${getBorderColor(stage)}`,
            }, children: [_jsx("div", { className: "kanbanColumnsHeader", children: _jsx("p", { children: stage }) }), _jsx("div", { className: "kanbanOverflowContainer", children: localOpportunities
                        .filter((opportunity) => opportunity?.stage === stage)
                        .map((opportunity, index) => (_jsx("div", { draggable: opportunity?.stage !== "Lost" && opportunity?.stage !== "Won", onDragStart: () => onDragStart(opportunity), 
                        // onDragEnter={() => handleDrop(e, status)}
                        className: "kanbanCardWrapper", children: _jsxs("div", { className: "kanbanCardContainer", onClick: () => onBoxClick(opportunity?.opportunityId), children: [_jsxs("div", { children: [_jsx("div", { className: "kanbanCardText1", children: _jsx("p", { children: opportunity?.title }) }), _jsxs("div", { className: "kanbanCardText2", children: [_jsxs("div", { className: "kanbanCardText2Span", children: ["Priority : ", _jsxs("span", { className: "kanbanCardText2Value", children: [" ", opportunity?.priority] })] }), _jsxs("div", { className: "kanbanCardText2Span", children: ["Est. Revenue : ", _jsx("span", { className: "kanbanCardText2Value", children: opportunity?.estimatedRevenue })] })] })] }), _jsx("div", { className: "kanbanCardIcons", children: opportunity?.owner !== null && opportunity?.owner !== undefined && (_jsxs(_Fragment, { children: [_jsx("div", { className: "leadsKanbanText", children: opportunity?.owner?.toString() }), _jsx("div", { className: "ownerAvatar", children: _jsxs(Avatar, { children: [opportunity?.owner?.toString().split(" ")[0]?.slice(0, 1), opportunity?.owner?.toString().split(" ")[1]?.slice(0, 1)] }) })] })) })] }) }, index))) })] }));
    };
    // Function to get border color based on status
    const getBorderColor = (stage) => {
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
    return (_jsxs("div", { className: "kanbanMain", children: [_jsx(Popconfirm, { title: `Are you sure you want to close this opportunity as ${wonOrLost}?`, open: popconfirmVisible, onConfirm: confirmChange, onCancel: cancelChange, okText: "Yes", cancelText: "No", children: _jsx("div", { className: "leadKanbanPopconfirm" }) }), _jsx(Modal, { open: isModalOpen, onOk: handleCloseOpportunity, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addAccountFormDiv", children: [_jsx("div", { className: "addAccountTitle", children: "Close Opportunity" }), _jsx("div", { className: "addOpportunityFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleCloseOpportunity, children: [wonOrLost === "Won" ? (_jsx(Form.Item, { name: "wonReason", label: "Won Reason", className: "addOpportunityFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "wonReason"), options: wonReasonOptions, showSearch: true }) })) : (_jsx(Form.Item, { name: "lostReason", label: "Lost Reason", className: "addOpportunityFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "lostReason"), options: lostReasonOptions }) })), _jsx(Form.Item, { name: "actualRevenue", label: "Actual Revenue", className: "addOpportunityFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "actualRevenue", type: "number", placeholder: "Please enter here" }) }), _jsx(Form.Item, { label: "Actual. Close Date", className: "addOpportunityFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(DatePicker, { onChange: (_date, dateString) => {
                                                // Ensure dateString is a string before converting to Date
                                                if (typeof dateString === "string") {
                                                    const dateObject = new Date(dateString);
                                                    if (!isNaN(dateObject.getTime())) {
                                                        // Check if dateObject is valid
                                                        setOpportunityToUpdate((prevOpportunity) => ({
                                                            ...prevOpportunity,
                                                            actualCloseDate: dateObject.toISOString(),
                                                        }));
                                                    }
                                                    else {
                                                        console.error("Invalid date string:", dateString);
                                                    }
                                                }
                                            } }) }), _jsx(Form.Item, { name: "wonLostDescription", label: "Note", className: "addOpportunityFormInput", rules: [
                                            {
                                                required: false,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(TextArea, { onChange: handleInputChange, name: "wonLostDescription", placeholder: "Please enter here", maxLength: 499 }) }), _jsxs(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addOpportunityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addOpportunitySubmitBtn", loading: addOpportunityLoader, children: "Save" })] })] }) })] }) }), _jsx(Spin, { spinning: addOpportunityLoader, tip: "Loading...", children: _jsxs("div", { className: "kanabanBoardWrapper", children: [_jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "Analysis"), children: renderBoard("Analysis") }), _jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "Solutioning"), children: renderBoard("Solutioning") }), _jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "Proposal"), children: renderBoard("Proposal") }), _jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "Negotiation"), children: renderBoard("Negotiation") }), _jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "Won"), children: renderBoard("Won") }), _jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "Lost"), children: renderBoard("Lost") })] }) })] }));
};
export default OpportunitiesKanban;
