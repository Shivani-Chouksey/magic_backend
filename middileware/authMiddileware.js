import jwt from "jsonwebtoken";
import { User } from "../models/user.Model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization") &&
      req.header("Authorization").split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided. Please login first.",
      });
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decoded) {
        return res.status(401).json({
          message: "Token Not Verify / Please Login to Access The resources",
        });
      }

      req.id = decoded.id;
      req.token = token;

      if (decoded && decoded.exp) {
        // JWT expiration time is in seconds since epoch
        const now = Math.floor(Date.now() / 1000); // current time in seconds
        const isExpired = decoded.exp < now;

        if (isExpired) {
          // console.log("Token has expired");
          return res.status(401).json({
            message: "Token has expired",
          });
        }
        if (!isExpired) {
          const user = await User.findById(decoded.id);

          if (!user) {
            return res.status(401).json({
              message:
                "Token Not Verify / Please Login to Access The resources",
            });
          }

          if (user.token != token) {
            return res.status(401).json({
              message:
                "Token Not Verify / Please Login to Access The resources",
            });
          }
          req.id = decoded.id;
          req.token = token;
          next();
        }
      }
    } else {
      return res.status(401).json({
        message: "Token Not Verify / Please Login to Access The resources",
      });
    }
  } catch (error) {
    // console.log("Authentication Error ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
