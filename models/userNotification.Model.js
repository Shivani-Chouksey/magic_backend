import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema({
  notified: {
    type: Boolean,
    default:false
  },
 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  
 
});

const UserNotification = mongoose.model("userNotification", userNotificationSchema);

export default UserNotification;
