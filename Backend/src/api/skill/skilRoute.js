import express from "express"
import { isAuth, isUser } from "../../middleware/auth.js"
import skillController from "./skillController.js"

const skillRoute=express.Router()

skillRoute.get("/",[isAuth,isUser],skillController.getSkills),
skillRoute.post("/create",[isAuth,isUser],skillController.createSkill),
skillRoute.put("/update/:id",[isAuth,isUser],skillController.updateSkill)
skillRoute.delete("/delete/:id",[isAuth,isUser],skillController.deleteSkill)
  
export default skillRoute

