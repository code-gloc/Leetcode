import validator from "validator";

const validate = (data) => {
  const mandatoryFields = ["firstName", "email", "password"];
  const isAllowed = mandatoryFields.every((k) => Object.keys(data).includes(k));
  if (!isAllowed) throw new Error("Mandatory fields are missing");

  // Validate email
  if (!validator.isEmail(data.email)) throw new Error("Invalid email format");

  // Only require minimum 8 characters for password
  if (!validator.isLength(data.password, { min: 8 })) {
    throw new Error("Password must be at least 8 characters long");
  }

  // Validate first name length
  if (!validator.isLength(data.firstName, { min: 2 }))
    throw new Error("First name should be at least 2 characters long");
};

export default validate;
