import express from "express"
import { registerController,loginController,getUserProfileController} from "../controllers/userController.js";
import { isAuthenticated } from "../middileware/authMiddileware.js";

const router=express.Router();

router.post("/register",registerController);
router.post("/login",loginController)
router.get("/profile/:id",isAuthenticated,getUserProfileController)



export default router