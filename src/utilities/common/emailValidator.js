export const validateEmail = (rule, value, callback) => {
    const trimmedValue = value.trim();
    if (trimmedValue === "" || /\S+@\S+\.\S+/.test(trimmedValue)) {
        callback("This field is required");
    }
    else {
        callback("Invalid email address");
        console.log("rule", rule);
    }
};
