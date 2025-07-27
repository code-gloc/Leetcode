import validator from "validator";

const validate = (data) => {
    const mandatoryFields = ["firstName", "email", "password"];
    const isAllowed = mandatoryFields.every((k) => Object.keys(data).includes(k));

    if (!isAllowed)
        throw new Error("Mandatory fields are missing");

    if (!validator.isEmail(data.email))
        throw new Error("Invalid email format");

    if (!validator.isStrongPassword(data.password))
        throw new Error("Password is weak");

    if (!validator.isLength(data.firstName, { min: 2 }))
        throw new Error("First name should be at least 2 characters long");
};

export default validate;
