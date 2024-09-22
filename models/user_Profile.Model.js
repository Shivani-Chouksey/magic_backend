import mongoose from "mongoose";

const profileSchema=new mongoose.Schema({

profileImage:{
    type:String,
    trim:true
},
userId:{
    type:mongoose.Schema.Types.ObjectId,
    trim:"User"
}
});

const Profile=mongoose.model("profile",profileSchema);

export default Profile;