import express from "express"
import experienceController from "./exprianceController.js"
import { isAuth, isUser } from "../../middleware/auth.js"

const exprianceRoute=express.Router()

exprianceRoute.get("/",[isAuth,isUser],experienceController.getAllExperiences),
exprianceRoute.post("/create",[isAuth,isUser],experienceController.createExperience),
exprianceRoute.put("/update/:id",[isAuth,isUser],experienceController.updateExperience),
exprianceRoute.delete("/delete/:id",[isAuth,isUser],experienceController.deleteExperience)

export default exprianceRoute
