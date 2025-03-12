import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { CustomToolbarProps } from "./exportDataTypes/leadDataTypes";

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  date,
  label,
  //   localizer,
  onNavigate,
  onView,
}) => {
  const [activeView, setActiveView] = useState<string>("week"); // Initial active view

  const goToBack = () => {
    onNavigate && onNavigate("PREV", date);
  };

  const goToNext = () => {
    onNavigate && onNavigate("NEXT", date);
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    onView && onView(view);
  };

  return (
    <div className="custom-toolbar-wrapper">
      <div className="custom-toolbar-item">
        <Button onClick={goToBack} className="rbc-custom-tool-nav-btn">
          <ArrowLeftOutlined className="custom-toolbar-arrow" />
        </Button>
        <Button onClick={goToNext} className="rbc-custom-tool-nav-btn">
          <ArrowRightOutlined className="custom-toolbar-arrow" />
        </Button>
        <span className="rbc-custom-tool-date">{label}</span>
      </div>
      <div className="custom-toolbar-item">
        <Button
          onClick={() => handleViewChange("day")}
          className={
            activeView === "day"
              ? "rbc-custom-tool-view-btn-active"
              : "rbc-custom-tool-view-btn"
          }
        >
          Day
        </Button>
        <Button
          className={
            activeView === "week"
              ? "rbc-custom-tool-view-btn-active"
              : "rbc-custom-tool-view-btn"
          }
          onClick={() => handleViewChange("week")}
        >
          Week
        </Button>
        <Button
          className={
            activeView === "month"
              ? "rbc-custom-tool-view-btn-active"
              : "rbc-custom-tool-view-btn"
          }
          onClick={() => handleViewChange("month")}
        >
          Month
        </Button>
        <Button
          className={
            activeView === "agenda"
              ? "rbc-custom-tool-view-btn-active"
              : "rbc-custom-tool-view-btn"
          }
          onClick={() => handleViewChange("agenda")}
        >
          Agenda
        </Button>
      </div>
    </div>
  );
};
export default CustomToolbar;
