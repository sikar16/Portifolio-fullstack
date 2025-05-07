import express from "express"
import { isAuth, isUser } from "../../middleware/auth.js"
import educationController from "./educationController.js"

const educationRoute=express.Router()

educationRoute.get("/",[isAuth,isUser],educationController.getAllEducation),
educationRoute.post("/create",[isAuth,isUser],educationController.createEducation),
educationRoute.put("/update/:id",[isAuth,isUser],educationController.updateEducation),
educationRoute.delete("/delete/:id",[isAuth,isUser],educationController.deleteEducation)

export default educationRoute
