// import { message } from "antd";
// import { useEffect, useState } from "react";
// import {
//   requestPermission,
//   onMessageListener,
// } from "../../services/firebaseConfig"; // Adjust the path according to your file structure

// function Notification() {
//   const [notification, setNotification] = useState({ title: "", body: "" });

//   useEffect(() => {
//     requestPermission();

//     const handleMessage = async () => {
//       try {
//         const payload = await onMessageListener();
//         setNotification({
//           title: payload?.notification.title,
//           body: payload?.notification.body,
//         });
//         console.log("Notification fcm 1", payload);

//         console.log("Payload from Firebase FCM", payload);

//         message.success(payload?.notification?.title);
//       } catch (error) {
//         console.log("Failed to handle message fcm", error);
//       }
//     };

//     handleMessage();

//     // Cleanup function if necessary
//     return () => {
//       // If onMessageListener provides an unsubscribe method, you can call it here
//       // unsubscribe(); // Adjust based on your actual implementation
//     };
//   }, []);

//   return (
//     <>
//       <div>Hello</div>
//       {notification.title && (
//         <div>
//           <h4>{notification.title}</h4>
//           <p>{notification.body}</p>
//         </div>
//       )}
//     </>
//   );
// }

// export default Notification;

// Add an empty export to make this a module
export {};
