import User from "../models/user.Model.js";
import bcrypt from "bcrypt";
import Profile from "../models/user_Profile.Model.js";
import Consult from "../models/consult.Model.js";

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if all necessary fields are provided
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "All fields are required: name, email, and password" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User is already registered with this email" });
    }

    // Hash password with salt rounds set to 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = await User.create({ ...req.body, password: hashedPassword });

    console.log("New user created:", newUser);

    // Send success response
    return res.status(201).json({ success: true, message: "Registered successfully"});
  } catch (error) {
    console.error("Error in signup:", error);

    // Check for validation errors or other specific types of errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error: " + error.message
      });
    }

    // General server error response
    return res.status(500).json({
      success: false,
      message: error.message || "User cannot be registered. Please try again later."
    });
  }
};
export const uploadProfile = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    const uploadedImage = await Profile.create({
      userId: req.id,
      profileImage: req.body.profileImage,
    });
    user.profileImage = uploadedImage._id;
    user.save();
    return res.status(200).json({ success: true, uploadedImage });
  } catch (error) {
    return res.status(500).json({
      error: { message: "Internal Server Error", details: error.message },
    });
  }
};

export const signIn = async (req, res) => {
  try {
    console.log(req.body);

    const user = await User.findOne({ email: req.body.email ,accountType:req.body.accountType }).exec();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered. Please signup first.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      req.userId = user._id;
      return res.status(200).json({
        success: true,
        message: "Login Successfully.",
        user,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid Credential.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed, please try again.",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const responseData = await User.find();
    return res.status(200).json({ success: true, responseData });
  } catch (error) {
    return res.status(500).json({success: false,message: error.message});
  }
};


export const addConsult = async (req, res) => {
  try {
 

    // Check if userId is present, if not throw an error
    if (!req.body.userId) {
      return res.status(400).json({
        success: false,
        message: "Please login to access the Resources.",
      });
    }

    // Associate the consultation with the user ID
    const consultData = {
      ...req.body,
      patientId: req.body.userId,
    };

    // Create the consultation entry
    const responseData = await Consult.create(consultData);

    // Return success response with consultation data
    return res.status(201).json({ success: true, responseData });
  } catch (error) {
    // Return error response in case of server failure
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllDoctor = async (req, res) => {
  try {
    // Extract accountType from query parameters
    const accountType = req.query.accountType;
console.log("accountType",accountType);

    // Check if accountType is provided in the query
    if (!accountType) {
      return res.status(400).json({ success: false, message: "Account type is required" });
    }

    // Fetch all users with the specified accountType
    const doctors = await User.find({ accountType: accountType });

    // If no users are found with the specified accountType
    if (doctors.length === 0) {
      return res.status(404).json({ success: false, message: `No users found with the account type: ${accountType}` });
    }

    // Return success with the list of doctors
    return res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    // Log the error and return a server error response
    console.error("Error fetching doctors:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getConsult = async (req, res) => {
  try {
    // Populate the patientId field
    const response = await Consult.find().populate('patientId'); // Use the field name as a string
    return res.status(200).json(response);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updateConsult=async(req,res)=>{
  try {
    const consultId = req.params.id;

    // Check if consultId exists in the request
    if (!consultId) {
      return res.status(400).json({ success: false, message: "Consult ID is required" });
    }
    const response= await Consult.findByIdAndUpdate(consultId,req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
    
  }
}
