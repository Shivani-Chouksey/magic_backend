import  { User, validateUser } from "../models/user.Model.js";
import bcrypt from "bcrypt";
import Profile from "../models/user_Profile.Model.js";
import jwt from "jsonwebtoken";
import { Socket } from 'socket.io';
import UserNotification from "../models/userNotification.Model.js";




export const registerController = async (req, res) => {
  try {
    // Validate user input using Yup, passing req.body directly
    await validateUser(req.body);

    const { email, password, name } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered with this email",
      });
    }

    // Hash password with salt rounds set to 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = await new User({
      ...req.body,
      password: hashedPassword,
    }).save();

    if (newUser) {
      await new UserNotification({ user: newUser._id }).save();
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error occurred. Please try again.",
      });
    }

    console.log("New user created:", newUser);

    // Emit a real-time event using the global Socket.IO instance
    if (global.io) {
      global.io.emit("user_registered", {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
      console.log("Socket.IO event emitted for new user registration");
    } else {
      console.warn("Global Socket.IO instance not available");
    }

    // Send success response
    return res.status(201).json({ success: true, message: "Registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error);

    // Check for validation errors from Yup
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors, // Return the array of validation error messages
      });
    }

    // General server error response
    return res.status(500).json({
      success: false,
      message: error.message || "User cannot be registered. Please try again later.",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    console.log(req.body);

    const user = await User.findOne({ email: req.body.email }).exec();

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

    // Set expiration date to 2 AM
    const expirationDate = new Date();
    expirationDate.setHours(2, 0, 0, 0);

    // If the current time has already passed 2 AM, set expiration to 2 AM the next day
    if (expirationDate.getTime() <= Date.now()) {
      expirationDate.setDate(expirationDate.getDate() + 1);
    }

    // Create JWT token
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: Math.floor((expirationDate.getTime() - Date.now()) / 1000) } // Time to expire in seconds
    );

  user.save();
    if (isPasswordValid) {
      req.userId = user._id;
    user.token = token;

     // Set the token as a secure, HTTP-only cookie
     res.cookie('token', token, {
      // httpOnly: true,  // Prevents client-side JavaScript from accessing the cookie
      // secure: process.env.NODE_ENV === 'production', // Ensures secure cookies in production
      // sameSite: 'Strict',  // Prevents CSRF attacks
      // expires: expirationDate  // Expiration time as per the 2 AM logic
    });

    return res.status(200).json({
      success: true,
      message: "Login successfully.",
      user,
      loginStatus:true,
      token,
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


export const getUserProfileController=async(req,res)=>{
  try {
    const userId = req.params.id;
    console.log("user id", userId);
    
    const responseData=await User.findById(userId);
    if(responseData){
    return res.status(200).json({ success: true, user: responseData });

    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
    
  }
}

