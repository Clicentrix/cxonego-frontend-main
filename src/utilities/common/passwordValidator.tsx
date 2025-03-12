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

export const getPasswordValidityIcons = (password: string) => {
  const validityIcons = []; // Check for "Numbers and letters" requirement

  if (password.match(/[a-zA-Z]/) && password.match(/\d/)) {
    validityIcons.push(
      <div key="letters-and-numbers">
        <CheckCircleFilled size={12} style={internalStyle.bsIcon} />{" "}
        <span className="passwordValidationChar">Numbers and letters</span>{" "}
      </div>
    );
  } else {
    validityIcons.push(
      <div key="letters-and-numbers">
        <span className="passwordValidationDot"></span>{" "}
        <span className="passwordValidationChar">Numbers and letters</span>{" "}
      </div>
    );
  } // Check for "Min 8 characters" requirement

  if (password.length >= 8) {
    validityIcons.push(
      <div key="min-length">
        <CheckCircleFilled size={12} style={internalStyle.bsIcon} />{" "}
        <span className="passwordValidationChar">Min 8 characters</span>{" "}
      </div>
    );
  } else {
    validityIcons.push(
      <div key="min-length">
        <span className="passwordValidationDot"></span>{" "}
        <span className="passwordValidationChar">Min 8 characters</span>{" "}
      </div>
    );
  } // Check for "Upper and lower case" requirement

  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
    validityIcons.push(
      <div key="upper-lower-case">
        <CheckCircleFilled size={12} style={internalStyle.bsIcon} />{" "}
        <span className="passwordValidationChar">Upper and lower case</span>{" "}
      </div>
    );
  } else {
    validityIcons.push(
      <div key="upper-lower-case">
        <span className="passwordValidationDot"></span>{" "}
        <span className="passwordValidationChar">Upper and lower case</span>{" "}
      </div>
    );
  } // Check for "Special character" requirement

  if (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
    validityIcons.push(
      <div key="special-characters">
        <CheckCircleFilled size={12} style={internalStyle.bsIcon} />{" "}
        <span className="passwordValidationChar">Special character</span>{" "}
      </div>
    );
  } else {
    validityIcons.push(
      <div key="special-characters">
        <span className="passwordValidationDot"></span>{" "}
        <span className="passwordValidationChar">Special character</span>{" "}
      </div>
    );
  }

  return validityIcons;
};
