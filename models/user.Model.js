import mongoose from "mongoose";
import * as yup from "yup";

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Mark as required
  },
  email: {
    type: String,
    unique: true,
    required: true, // Mark as required
  },
  number: {
    type: Number,
    unique: true,
    required: true, // Mark as required
  },
  address: {
    type: String,
    optional: true, // Optional: can be undefined
  },
  password: {
    type: String,
    required: true, // Mark as required
  },
  token: {
    type: String,
    optional: true, // Optional: can be undefined
  },
});

// Create Mongoose Model
const User = mongoose.model("User", userSchema);

// Define Yup Validation Schema
const userValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
  number: yup
    .number()
    .typeError("Contact number must be a valid number")
    .required("Contact number is required"),
  address: yup.string().optional().nullable(), // Optional: allow null or undefined
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"), // Adjusted minimum length
  token: yup.string().optional().nullable(), // Optional: allow null or undefined
});

// Example usage of the validation schema
const validateUser = async (userData) => {
  try {
    await userValidationSchema.validate(userData, { abortEarly: false });
    console.log("Validation successful");
  } catch (error) {
    throw new yup.ValidationError(error.errors); // Throw error to be caught in controller
  }
};

// Export model and validation functions
export { User, validateUser };
