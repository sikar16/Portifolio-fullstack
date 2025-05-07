import express from "express"
import userController from "./userController.js";
import { isAuth, isUser } from "../../middleware/auth.js";

const userRoute=express.Router()

userRoute.get("/",[isAuth,isUser],userController.getProfile)
userRoute.post("/create",[isAuth,isUser],userController.createProfile)
userRoute.put("/update",[isAuth,isUser],userController.updateProfile)
// userRoute.put("/delete",[isAuth,isUser],userController.deleteSocialLinks)

export default userRoute;