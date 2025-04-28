import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
const CustomToolbar = ({ date, label, 
//   localizer,
onNavigate, onView, }) => {
    const [activeView, setActiveView] = useState("week"); // Initial active view
    const goToBack = () => {
        onNavigate && onNavigate("PREV", date);
    };
    const goToNext = () => {
        onNavigate && onNavigate("NEXT", date);
    };
    const handleViewChange = (view) => {
        setActiveView(view);
        onView && onView(view);
    };
    return (_jsxs("div", { className: "custom-toolbar-wrapper", children: [_jsxs("div", { className: "custom-toolbar-item", children: [_jsx(Button, { onClick: goToBack, className: "rbc-custom-tool-nav-btn", children: _jsx(ArrowLeftOutlined, { className: "custom-toolbar-arrow" }) }), _jsx(Button, { onClick: goToNext, className: "rbc-custom-tool-nav-btn", children: _jsx(ArrowRightOutlined, { className: "custom-toolbar-arrow" }) }), _jsx("span", { className: "rbc-custom-tool-date", children: label })] }), _jsxs("div", { className: "custom-toolbar-item", children: [_jsx(Button, { onClick: () => handleViewChange("day"), className: activeView === "day"
                            ? "rbc-custom-tool-view-btn-active"
                            : "rbc-custom-tool-view-btn", children: "Day" }), _jsx(Button, { className: activeView === "week"
                            ? "rbc-custom-tool-view-btn-active"
                            : "rbc-custom-tool-view-btn", onClick: () => handleViewChange("week"), children: "Week" }), _jsx(Button, { className: activeView === "month"
                            ? "rbc-custom-tool-view-btn-active"
                            : "rbc-custom-tool-view-btn", onClick: () => handleViewChange("month"), children: "Month" }), _jsx(Button, { className: activeView === "agenda"
                            ? "rbc-custom-tool-view-btn-active"
                            : "rbc-custom-tool-view-btn", onClick: () => handleViewChange("agenda"), children: "Agenda" })] })] }));
};
export default CustomToolbar;
