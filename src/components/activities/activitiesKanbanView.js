import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Spin } from "antd";
import "../../styles/kanbanBoard/kanban.css";
import { useAppDispatch } from "../../redux/app/hooks";
import { updateActivityByIdAndGetAllActivities } from "../../redux/features/activitySlice";
import { useNavigate } from "react-router-dom";
const ActivitiesKanban = ({ params }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const draggedActivity = useRef(null);
    const { activities, addActivityLoader } = useSelector((state) => state.activities);
    const [localActivities, setLocalActivities] = useState([]);
    const onBoxClick = (activityId) => {
        navigate(`/activity/${activityId}`);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = async (e, status) => {
        e.preventDefault();
        if (draggedActivity.current) {
            // Update the stage of the Activity to the specified stage
            const updatedActivity = {
                ...draggedActivity.current,
                activityStatus: status,
            };
            // Update local state and dispatch action
            const updatedActivities = localActivities?.map((activity) => activity.activityId === updatedActivity?.activityId
                ? updatedActivity
                : activity);
            setLocalActivities(updatedActivities);
            // Dispatch action to update ACTIVITY in Redux store
            await dispatch(updateActivityByIdAndGetAllActivities(updatedActivity, params));
        }
    };
    const onDragStart = (activity) => {
        draggedActivity.current = activity;
    };
    useEffect(() => {
        setLocalActivities(activities || []);
    }, [activities]);
    const renderBoard = (status) => {
        return (_jsxs("div", { className: "kanbanColumns", style: {
                backgroundColor: "#F9F9F9",
                borderTop: `4px solid ${getBorderColor(status)}`,
            }, children: [_jsx("div", { className: "kanbanColumnsHeader", children: _jsx("p", { children: status }) }), _jsx("div", { className: "kanbanOverflowContainer", children: localActivities
                        .filter((activity) => activity?.activityStatus === status)
                        .map((activity, index) => (_jsx("div", { draggable: true, onDragStart: () => onDragStart(activity), 
                        // onDragEnter={() => handleDrop(e, status)}
                        className: "kanbanCardWrapper", children: _jsxs("div", { className: "kanbanCardContainer", onClick: () => onBoxClick(activity?.activityId), children: [_jsx("div", { className: "kanbanCardText1", children: _jsx("p", { children: activity?.subject }) }), _jsxs("div", { className: "kanbanCardText2", children: [_jsxs("div", { className: "kanbanCardText2Span", children: ["Activity Type : ", _jsx("span", { className: "kanbanCardText2Value", children: activity?.activityType })] }), _jsxs("div", { className: "kanbanCardText2Span", children: ["Priority : ", _jsxs("span", { className: "kanbanCardText2Value", children: [" ", activity?.activityPriority] })] })] }), _jsx("div", { className: "kanbanCardIcons", children: activity?.owner !== null && activity?.owner !== undefined && (_jsxs(_Fragment, { children: [_jsx("div", { className: "leadsKanbanText", children: activity?.owner?.toString() }), _jsx("div", { className: "ownerAvatar", children: _jsxs(Avatar, { children: [activity?.owner?.toString().split(" ")[0]?.slice(0, 1), activity?.owner?.toString().split(" ")[1]?.slice(0, 1)] }) })] })) })] }) }, index))) })] }));
    };
    // Function to get border color based on status
    const getBorderColor = (status) => {
        switch (status) {
            case "Open":
                return "#FF802C";
            case "In Progress":
                return "#2BA6FF";
            case "Completed":
                return "#56C300";
            // case "Closed":
            //   return "#505265";
            default:
                return "#000000";
        }
    };
    return (_jsx("div", { className: "kanbanMainActivity", children: _jsx(Spin, { spinning: addActivityLoader, tip: "Loading...", children: _jsxs("div", { className: "activityKanabanBoardWrapper", children: [_jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "Open"), children: renderBoard("Open") }), _jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "In Progress"), children: renderBoard("In Progress") }), _jsx("div", { className: "boards-container", onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, "Completed"), children: renderBoard("Completed") })] }) }) }));
};
export default ActivitiesKanban;
