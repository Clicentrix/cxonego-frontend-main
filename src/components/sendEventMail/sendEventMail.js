import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/SchedulerForm.tsx
import { useState } from "react";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const SchedulerForm = () => {
    const [email, setEmail] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call a function to send the meeting invite
            // Pass email and meetingTime as parameters
            await sendMeetingInvite(email, meetingTime);
            alert("Meeting invite sent successfully!");
        }
        catch (error) {
            console.error("Error sending meeting invite:", error);
            alert("Failed to send meeting invite. Please try again.");
        }
    };
    const sendMeetingInvite = async (recipientEmail, scheduledTime) => {
        try {
            // Make an API call to your backend with the recipient's email and scheduled time
            const response = await axios.post(import.meta.env.BASE_URL, {
                email: recipientEmail,
                time: scheduledTime,
            });
            console.log("Response from backend:", response);
        }
        catch (error) {
            console.error("Error making API call to backend:", error);
            throw new Error("Failed to send meeting invite.");
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("label", { children: ["Email:", _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsx("br", {}), _jsxs("label", { children: ["Meeting Time:", _jsx("input", { type: "text", value: meetingTime, onChange: (e) => setMeetingTime(e.target.value) })] }), _jsx("br", {}), _jsx("button", { type: "submit", children: "Schedule Meeting" })] }));
};
export default SchedulerForm;
