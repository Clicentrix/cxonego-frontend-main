// src/components/SchedulerForm.tsx

import React, { useState } from "react";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SchedulerForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [meetingTime, setMeetingTime] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call a function to send the meeting invite
      // Pass email and meetingTime as parameters
      await sendMeetingInvite(email, meetingTime);
      alert("Meeting invite sent successfully!");
    } catch (error) {
      console.error("Error sending meeting invite:", error);
      alert("Failed to send meeting invite. Please try again.");
    }
  };

  const sendMeetingInvite = async (
    recipientEmail: string,
    scheduledTime: string
  ) => {
    try {
      // Make an API call to your backend with the recipient's email and scheduled time
      const response = await axios.post(import.meta.env.BASE_URL, {
        email: recipientEmail,
        time: scheduledTime,
      });
      console.log("Response from backend:", response);
    } catch (error) {
      console.error("Error making API call to backend:", error);
      throw new Error("Failed to send meeting invite.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <label>
        Meeting Time:
        <input
          type="text"
          value={meetingTime}
          onChange={(e) => setMeetingTime(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Schedule Meeting</button>
    </form>
  );
};

export default SchedulerForm;
