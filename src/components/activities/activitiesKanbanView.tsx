import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { Avatar, Spin } from "antd";
import { RootState } from "../../redux/app/store";
import "../../styles/kanbanBoard/kanban.css";
import { useAppDispatch } from "../../redux/app/hooks";
import { Activity, FetchActivityParams } from "../../utilities/common/exportDataTypes/activityDatatypes";
import { updateActivityByIdAndGetAllActivities } from "../../redux/features/activitySlice";
import { useNavigate } from "react-router-dom";

type props = {
  params: FetchActivityParams
}
const ActivitiesKanban: React.FC<props> = ({ params }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const draggedActivity = useRef<Activity | null>(null);
  const { activities, addActivityLoader } = useSelector(
    (state: RootState) => state.activities
  );
  const [localActivities, setLocalActivities] = useState<Activity[]>([]);

  const onBoxClick = (activityId: string) => {
    navigate(`/activity/${activityId}`);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    status: string
  ) => {
    e.preventDefault();
    if (draggedActivity.current) {
      // Update the stage of the Activity to the specified stage
      const updatedActivity: Activity = {
        ...draggedActivity.current,
        activityStatus: status,
      };

      // Update local state and dispatch action
      const updatedActivities = localActivities?.map((activity) =>
        activity.activityId === updatedActivity?.activityId
          ? updatedActivity
          : activity
      );
      setLocalActivities(updatedActivities);

      // Dispatch action to update ACTIVITY in Redux store
      await dispatch(
        updateActivityByIdAndGetAllActivities(updatedActivity, params)
      );
    }
  };

  const onDragStart = (activity: Activity) => {
    draggedActivity.current = activity;
  };

  useEffect(() => {
    setLocalActivities(activities || []);
  }, [activities]);

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
          {localActivities
            .filter((activity) => activity?.activityStatus === status)
            .map((activity, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => onDragStart(activity)}
                // onDragEnter={() => handleDrop(e, status)}
                className="kanbanCardWrapper"
              >
                {/* Content of the activity card */}
                {/* Replace this with your actual card layout */}
                <div
                  className="kanbanCardContainer"
                  onClick={() => onBoxClick(activity?.activityId)}
                >
                  <div className="kanbanCardText1">
                    <p>{activity?.subject}</p>

                  </div>
                  <div className="kanbanCardText2">
                    <div className="kanbanCardText2Span">Activity Type : <span className="kanbanCardText2Value">
                      {activity?.activityType}
                    </span></div>

                    <div className="kanbanCardText2Span">Priority : <span className="kanbanCardText2Value">
                      {" "}
                      {activity?.activityPriority}
                    </span></div>

                  </div>
                  <div className="kanbanCardIcons">

                    {activity?.owner !== null && activity?.owner !== undefined && (
                      <>
                        <div className="leadsKanbanText">
                          {activity?.owner?.toString()}
                        </div>
                        <div className="ownerAvatar">
                          <Avatar>{activity?.owner?.toString().split(" ")[0]?.slice(0, 1)}{activity?.owner?.toString().split(" ")[1]?.slice(0, 1)}
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
  const getBorderColor = (status: string) => {
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

  return (
    <div className="kanbanMainActivity">
      <Spin spinning={addActivityLoader} tip="Loading...">
        <div className="activityKanabanBoardWrapper">
          {/* Open */}
          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Open")}
          >
            {renderBoard("Open")}
          </div>

          {/* In Progress */}
          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "In Progress")}
          >
            {renderBoard("In Progress")}
          </div>

          {/* Completed */}
          <div
            className="boards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Completed")}
          >
            {renderBoard("Completed")}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default ActivitiesKanban;
