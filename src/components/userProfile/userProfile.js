import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as XLSX from "xlsx";
import "../../styles/userProfile/userProfile.css";
import { countryFlags, currencyOptions, } from "../../utilities/common/dataArrays";
import { Avatar, Button, Form, Input, Popconfirm, Select, Skeleton, message, } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { getUserById, handleInputChangeReducerAuth, updateUserProfileById, } from "../../redux/features/authenticationSlice";
import { useEffect, useState } from "react";
import { getAllAccounts } from "../../redux/features/accountsSlice";
import { getAllLeads } from "../../redux/features/leadSlice";
import { getAllContacts } from "../../redux/features/contactsSlice";
import { getAllActivities } from "../../redux/features/activitySlice";
import { getAllOpportunities } from "../../redux/features/opportunitiesSlice";
import { getAllReferrals } from "../../redux/features/referralsSlice";
import { getAllNotes } from "../../redux/features/noteSlice";
import { getAllAppointments } from "../../redux/features/calendarSlice";
const UserProfileComponent = () => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const { user, getUserLoader, updateUserLoader } = useAppSelector((state) => state.authentication);
    const { leads } = useAppSelector((state) => state.leads);
    const { accounts } = useAppSelector((state) => state.accounts);
    const { contacts } = useAppSelector((state) => state.contacts);
    const { opportunities } = useAppSelector((state) => state.opportunities);
    const { activities } = useAppSelector((state) => state.activities);
    const { referrals } = useAppSelector((state) => state.referrals);
    const { notes } = useAppSelector((state) => state.notes);
    const { appointments } = useAppSelector((state) => state.appointments);
    console.log("leads", leads[0]);
    console.log("accounts", accounts[0]);
    console.log("contacts", contacts[0]);
    console.log("opportunities", opportunities[0]);
    console.log("activities", activities[0]);
    console.log("referrals", referrals[0]);
    console.log("notes", notes[0]);
    console.log("appointments", appointments[0]);
    const [editable, setEditable] = useState(false);
    const [userProfile, setUserProfile] = useState({
        firstName: "Rahul Singh",
        lastName: "Patil",
        phone: "9453772548",
        countryCode: "+91",
        currency: "INR",
        userId: user?.userId,
    });
    // const handleThemeChange = (name: string, value: string) => {
    //   dispatch(
    //     handleInputChangeReducerAuth({
    //       [name]: value,
    //     })
    //   );
    // };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerAuth({
            [name]: value,
        }));
        setUserProfile({ ...userProfile, [name]: value });
    };
    const handleSelectChange = (value, name) => {
        dispatch(handleInputChangeReducerAuth({
            [name]: value,
        }));
        setUserProfile({ ...userProfile, [name]: value });
    };
    const handleSubmit = async () => {
        dispatch(updateUserProfileById(userProfile))
            .then(() => setEditable(false))
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        dispatch(getUserById());
        dispatch(getAllAccounts());
        dispatch(getAllLeads());
        dispatch(getAllContacts());
        dispatch(getAllActivities());
        dispatch(getAllOpportunities());
        dispatch(getAllReferrals());
        dispatch(getAllNotes());
        dispatch(getAllAppointments());
    }, []);
    useEffect(() => {
        form.setFieldsValue(user);
    }, [user]);
    useEffect(() => {
        setUserProfile({
            firstName: user?.firstName,
            lastName: user?.lastName,
            phone: user?.phone,
            countryCode: user?.countryCode,
            currency: user?.currency,
            userId: user?.userId,
        });
    }, [user]);
    function handleExport() {
        // Create a new workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        let exportedFields = "";
        if (leads.length) {
            const worksheet = XLSX.utils.json_to_sheet(leads);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
            exportedFields += "leads,";
        }
        if (accounts.length) {
            const worksheet = XLSX.utils.json_to_sheet(accounts);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");
            exportedFields += "accounts,";
        }
        if (contacts.length) {
            const worksheet = XLSX.utils.json_to_sheet(contacts);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
            exportedFields += "contacts,";
        }
        if (opportunities.length) {
            const worksheet = XLSX.utils.json_to_sheet(opportunities);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Opportunities");
            exportedFields += "opportunities,";
        }
        if (activities.length) {
            const worksheet = XLSX.utils.json_to_sheet(activities);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");
            exportedFields += "activities,";
        }
        if (referrals.length) {
            const worksheet = XLSX.utils.json_to_sheet(referrals);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Referalls");
            exportedFields += "referrals,";
        }
        if (notes.length) {
            const worksheet = XLSX.utils.json_to_sheet(notes);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Notes");
            exportedFields += "notes,";
        }
        if (appointments.length) {
            const formattedAppointments = appointments.map((appointment) => {
                const { orgnizerId, calparticipaters, ...formattedAppointment } = appointment;
                return formattedAppointment;
            });
            const worksheet = XLSX.utils.json_to_sheet(formattedAppointments);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
            exportedFields += "appointments,";
        }
        if (workbook.SheetNames.length > 0) {
            // Export the workbook to a file
            XLSX.writeFile(workbook, "data.xlsx");
            exportedFields = exportedFields.slice(0, -1);
            // unExportedFields = unExportedFields.slice(0, -1);
            message.success("Data exported successfully");
            message.success(`Exported fields : ${exportedFields}`);
            // message.success(`Unexported fields : ${unExportedFields}, no data found.`);
        }
        else {
            message.error("No data to export");
        }
    }
    return (_jsx(_Fragment, { children: _jsx("div", { className: "listViewBackWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, initialValues: user, children: [_jsxs("div", { className: "profileTopDiv", children: [_jsx("div", { className: "profilePageTitle", children: "General Settings" }), user.role === "ADMIN" && (_jsx(Popconfirm, { title: "Export Data", description: _jsxs("div", { children: [_jsx("div", { children: "This will export data from your subscription to excel." }), _jsxs("div", { children: [" ", "Are you sure you want to continue with the operation?"] })] }), onConfirm: handleExport, okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", 
                                    // htmlType="submit"
                                    className: "profileSubmitBtn", children: "Export All Data" }) }))] }), getUserLoader ? (_jsx(Skeleton, {})) : (_jsx(_Fragment, { children: _jsxs("div", { className: "generalWrapper", children: [_jsx("div", { className: "profilePicWrapperDiv", children: _jsxs(Avatar, { className: "profilePicAvatar", children: [user?.firstName?.slice(0, 1), user?.lastName?.slice(0, 1)] }) }), _jsxs("div", { className: "generalFlexItem", children: [_jsxs("div", { className: "profileFormItemDiv", children: [_jsx(Form.Item, { name: "firstName", label: "First Name", className: "profileFormInput", rules: [
                                                        {
                                                            required: true,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "string", placeholder: "Please enter here", disabled: !editable }) }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "profileFormInput", rules: [
                                                        {
                                                            required: true,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "lastName", type: "string", placeholder: "Please enter here", disabled: !editable }) })] }), _jsxs("div", { className: "profileFormItemDiv", children: [_jsx(Form.Item, { name: "email", label: "Email", className: "profileFormInput", rules: [
                                                        {
                                                            type: "email",
                                                            message: "The input is not valid E-mail!",
                                                        },
                                                        {
                                                            required: false,
                                                            message: "Please input your E-mail!",
                                                        },
                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "email", placeholder: "Please enter here", disabled: true }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "profileFormInput", rules: [
                                                        {
                                                            required: true,
                                                            message: "This field is mandatory!",
                                                        },
                                                        {
                                                            pattern: /^\d*$/,
                                                            message: "Please enter a valid phone number!",
                                                        },
                                                    ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { disabled: !editable, value: user?.countryCode, style: { width: "200px" }, onChange: (value) => handleSelectChange(value, "countryCode"), options: countryFlags?.map((flag) => ({
                                                                    value: flag.key,
                                                                    label: (_jsxs("div", { style: {
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                        }, children: [_jsx("img", { src: flag.value, alt: "flagIcon", style: {
                                                                                    width: "20px",
                                                                                    height: "15px",
                                                                                    marginRight: "10px",
                                                                                } }), flag.label, " (", flag.key, ")"] })),
                                                                })), showSearch: true, placeholder: "Select a country", filterOption: (input, option) => option?.label.props.children[1]
                                                                    .toLowerCase()
                                                                    .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here", value: user?.phone, disabled: !editable })] }) })] }), _jsxs("div", { className: "profileFormItemDiv", children: [_jsx(Form.Item, { name: "currency", label: "Currency", className: "profileFormInput", rules: [
                                                        {
                                                            required: false,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "currency"), options: currencyOptions, disabled: !editable }) }), _jsx(Form.Item, { name: "role", label: "Role", className: "profileFormInput", rules: [
                                                        {
                                                            required: false,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "Role", type: "string", placeholder: "Please enter here", disabled: true }) })] }), _jsxs("div", { className: "profileFormItemDiv", children: [_jsx(Form.Item, { name: "companyName", label: "Organization", className: "profileFormInput", rules: [
                                                        {
                                                            required: true,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "companyName", type: "string", placeholder: "Please enter here", disabled: true }) }), _jsx(Form.Item, { className: "profileFormInput" })] }), _jsx("div", { className: "profileSubmitBtnDiv", children: _jsx(Form.Item, { children: _jsxs("div", { className: "actionButtons", children: [_jsx(Button, { onClick: () => setEditable(true), className: "profileEditBtn", children: "Edit" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "profileSubmitBtn", loading: updateUserLoader, children: "Save" })] }) }) })] })] }) }))] }) }) }));
};
export default UserProfileComponent;
