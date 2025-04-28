import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircleFilled } from "@ant-design/icons";
// CSS style variables
const internalStyle = {
    bsIcon: {
        color: "#00FF00",
    },
    loginIcon: {
        color: "f4f4f4",
    },
    resetErrorMessageStyle: {
        display: "flex",
        flexDirection: "column",
    },
    resetPassFormStyle: {
        width: "100%",
    },
};
export const getPasswordValidityIcons = (password) => {
    const validityIcons = []; // Check for "Numbers and letters" requirement
    if (password.match(/[a-zA-Z]/) && password.match(/\d/)) {
        validityIcons.push(_jsxs("div", { children: [_jsx(CheckCircleFilled, { size: 12, style: internalStyle.bsIcon }), " ", _jsx("span", { className: "passwordValidationChar", children: "Numbers and letters" }), " "] }, "letters-and-numbers"));
    }
    else {
        validityIcons.push(_jsxs("div", { children: [_jsx("span", { className: "passwordValidationDot" }), " ", _jsx("span", { className: "passwordValidationChar", children: "Numbers and letters" }), " "] }, "letters-and-numbers"));
    } // Check for "Min 8 characters" requirement
    if (password.length >= 8) {
        validityIcons.push(_jsxs("div", { children: [_jsx(CheckCircleFilled, { size: 12, style: internalStyle.bsIcon }), " ", _jsx("span", { className: "passwordValidationChar", children: "Min 8 characters" }), " "] }, "min-length"));
    }
    else {
        validityIcons.push(_jsxs("div", { children: [_jsx("span", { className: "passwordValidationDot" }), " ", _jsx("span", { className: "passwordValidationChar", children: "Min 8 characters" }), " "] }, "min-length"));
    } // Check for "Upper and lower case" requirement
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        validityIcons.push(_jsxs("div", { children: [_jsx(CheckCircleFilled, { size: 12, style: internalStyle.bsIcon }), " ", _jsx("span", { className: "passwordValidationChar", children: "Upper and lower case" }), " "] }, "upper-lower-case"));
    }
    else {
        validityIcons.push(_jsxs("div", { children: [_jsx("span", { className: "passwordValidationDot" }), " ", _jsx("span", { className: "passwordValidationChar", children: "Upper and lower case" }), " "] }, "upper-lower-case"));
    } // Check for "Special character" requirement
    if (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
        validityIcons.push(_jsxs("div", { children: [_jsx(CheckCircleFilled, { size: 12, style: internalStyle.bsIcon }), " ", _jsx("span", { className: "passwordValidationChar", children: "Special character" }), " "] }, "special-characters"));
    }
    else {
        validityIcons.push(_jsxs("div", { children: [_jsx("span", { className: "passwordValidationDot" }), " ", _jsx("span", { className: "passwordValidationChar", children: "Special character" }), " "] }, "special-characters"));
    }
    return validityIcons;
};
