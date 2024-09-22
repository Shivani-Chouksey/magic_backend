import mongoose from "mongoose";

const consultSchema = new mongoose.Schema({
  currentIllnessHistory: {
    type: String,
  },
  recentSurgery: {
    type: String,
  },
  diabdiabetesStatus: {
    type: String,
  },
  anyAllergies: {
    type: String,
  },
  other: {
    type: String,
  },
  careTaken: {
    type: String,
  },
  medicines: {
    type: String,
  },
  doctorId:{
    type:mongoose.Schema.Types.ObjectId,
    trim:"User"
},
  patientId:{
    type:mongoose.Schema.Types.ObjectId,
    trim:"User"
}
});

const Consult = mongoose.model("consult", consultSchema);

export default Consult;
