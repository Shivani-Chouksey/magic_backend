import express, { Router } from "express"
import { addConsult, getAllDoctor, getAllUsers, getConsult, signIn, signup, updateConsult, uploadProfile } from "../controllers/userController.js";

const router=express.Router();

router.post("/signup",signup);
router.post("/upload-profile",uploadProfile);
router.post("/signin",signIn)
router.get("/all",getAllUsers)
router.post("/consult",addConsult)
router.get("/consult",getConsult)
router.patch("/consult/:id",updateConsult)
router.get("/doctor",getAllDoctor)



export default router