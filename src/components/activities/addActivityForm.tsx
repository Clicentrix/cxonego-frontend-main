// import { DatePicker, Form, Input, Select } from "antd";
// import { useAppDispatch } from "../../redux/app/hooks";
// import {
//   activityPriorityOptions,
//   activityStatusOptions,
//   activityTypeOptions,
// } from "../../utilities/common/dataArrays";
// import TextArea from "antd/es/input/TextArea";
// import { handleInputChangeReducerActivity } from "../../redux/features/activitySlice";

// function AddActivityForm() {
//   const dispatch = useAppDispatch();
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     dispatch(
//       handleInputChangeReducerActivity({
//         [name]: value,
//       })
//     );
//   };

//   const handleSelectChange = (value: string, name: string) => {
//     dispatch(
//       handleInputChangeReducerActivity({
//         [name]: value,
//       })
//     );
//   };

//   return (
//     <div>
//       <div className="activitiesAddFormGrid">
//         <Form.Item
//           name="activityType"
//           label="Type"
//           className="addOpportunityFormInput"
//           rules={[
//             {
//               required: false,
//               message: "This field is mandatory!",
//             },
//           ]}
//         >
//           <Select
//             onChange={(value) => handleSelectChange(value, "activityType")}
//             options={activityTypeOptions}
//             defaultValue={"Task"}
//           />
//         </Form.Item>
//         <Form.Item
//           name="startDate"
//           label="Start Date"
//           className="addOpportunityFormInput"
//           rules={[
//             {
//               required: false,
//               message: "This field is mandatory!",
//             },
//           ]}
//         >
//           {/* <DatePicker
//             onChange={(_date, dateString) => {
//               if (typeof dateString === "string" && dateString) {
//                 // Use moment to parse and format the date
//                 const dateObject = moment(dateString, "YYYY-MM-DD HH:mm A");
//                 if (dateObject.isValid()) {
//                   // Format date as ISO string
//                   const isoString = dateObject.toISOString();
//                   // Dispatch your action with the formatted date
//                   dispatch(
//                     handleInputChangeReducerActivity({
//                       startDate: isoString,
//                     })
//                   );
//                 }
//               }
//             }}
//             showTime={{ format: "HH:mm A", minuteStep: 30 }}
//             // format="YYYY-MM-DD hh:mm A"
//           /> */}
//           <DatePicker
//             onChange={handleStartDateChange}
//             showTime={{ format: "HH:mm A", minuteStep: 15 }}
//             format="YYYY-MM-DD hh:mm A"
//             disabledDate={disabledStartDate}
//           />
//         </Form.Item>
//       </div>
//       <div className="activitiesAddFormGrid">
//         <Form.Item
//           name="subject"
//           label="Subject"
//           className="addOpportunityFormInput"
//           rules={[
//             {
//               required: true,
//               message: "This field is mandatory!",
//             },
//           ]}
//         >
//           <Input
//             onChange={handleInputChange}
//             name="subject"
//             type="string"
//             placeholder="Please enter here"
//           />
//         </Form.Item>
//         <Form.Item
//           name="dueDate"
//           label="Due Date"
//           className="addOpportunityFormInput"
//           rules={[
//             {
//               required: true,
//               message: "This field is mandatory!",
//             },
//             { validator: validateEndDateTime },
//           ]}
//         >
//           {/* <DatePicker
//             onChange={(_date, dateString) => {
//               if (typeof dateString === "string" && dateString) {
//                 // Use moment to parse and format the date
//                 const dateObject = moment(dateString, "YYYY-MM-DD HH:mm A");
//                 if (dateObject.isValid()) {
//                   // Format date as ISO string
//                   const isoString = dateObject.toISOString();
//                   // Dispatch your action with the formatted date
//                   dispatch(
//                     handleInputChangeReducerActivity({
//                       dueDate: isoString,
//                     })
//                   );
//                 }
//               }
//             }}
//             showTime={{ format: "HH:mm A", minuteStep: 5 }}
//             format="YYYY-MM-DD HH:mm A"
//           /> */}
//           <DatePicker
//             onChange={handleEndDateChange}
//             showTime={{ format: "HH:mm A", minuteStep: 15 }}
//             format="YYYY-MM-DD hh:mm A"
//             disabledDate={disabledEndDate}
//           />
//         </Form.Item>
//       </div>
//       <div className="activitiesAddFormGrid">
//         <Form.Item
//           name="activityStatus"
//           label="Status"
//           className="addOpportunityFormInput"
//           rules={[
//             {
//               required: false,
//               message: "This field is mandatory!",
//             },
//           ]}
//         >
//           <Select
//             onChange={(value) => handleSelectChange(value, "activityStatus")}
//             options={activityStatusOptions}
//             defaultValue={"Open"}
//           />
//         </Form.Item>
//         <Form.Item
//           name="activityPriority"
//           label="Priority"
//           className="addOpportunityFormInput"
//           rules={[
//             {
//               required: false,
//               message: "This field is mandatory!",
//             },
//           ]}
//         >
//           <Select
//             onChange={(value) => handleSelectChange(value, "activityPriority")}
//             options={activityPriorityOptions}
//             defaultValue={"Medium"}
//           />
//         </Form.Item>
//       </div>
//       <div className="activitiesAddFormGrid">
//         <Form.Item
//           name="actualStartDate"
//           label="Actual Start Sate"
//           className="addOpportunityFormInput"
//           rules={[
//             {
//               required: false,
//               message: "This field is mandatory!",
//             },
//           ]}
//         >
//           <DatePicker
//             onChange={(_date, dateString) => {
//               // Ensure dateString is a string before converting to Date
//               if (typeof dateString === "string") {
//                 const dateObject = new Date(dateString);
//                 if (!isNaN(dateObject.getTime())) {
//                   // Check if dateObject is valid
//                   dispatch(
//                     handleInputChangeReducerActivity({
//                       actualStartDate: dateObject.toISOString(),
//                     })
//                   );
//                 } else {
//                   console.error("Invalid date string:", dateString);
//                 }
//               }
//             }}
//           />
//         </Form.Item>
//         <Form.Item
//           name="actualEndDate"
//           label="Actual End Date"
//           className="addOpportunityFormInput"
//           rules={[
//             {
//               required: false,
//               message: "This field is mandatory!",
//             },
//           ]}
//         >
//           <DatePicker
//             onChange={(_date, dateString) => {
//               // Ensure dateString is a string before converting to Date
//               if (typeof dateString === "string") {
//                 const dateObject = new Date(dateString);
//                 if (!isNaN(dateObject.getTime())) {
//                   // Check if dateObject is valid
//                   dispatch(
//                     handleInputChangeReducerActivity({
//                       actualEndDate: dateObject.toISOString(),
//                     })
//                   );
//                 } else {
//                   console.error("Invalid date string:", dateString);
//                 }
//               }
//             }}
//           />
//         </Form.Item>
//       </div>
//       <Form.Item
//         name="description"
//         label="Description"
//         className="addActivityFormInput"
//         style={{ width: "100%" }}
//         rules={[
//           {
//             required: false,
//             message: "This field is mandatory!",
//           },
//         ]}
//       >
//         <TextArea
//           onChange={handleInputChange}
//           name="description"
//           placeholder="Please enter here"
//           maxLength={499}
//         />
//       </Form.Item>
//     </div>
//   );
// }

// export default AddActivityForm;

// Add an empty export to make this a module
export {};
