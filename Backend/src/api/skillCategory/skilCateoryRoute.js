import express from "express"
import skillCategoryController from "./skillCategoryController.js"
import { isAuth, isUser } from "../../middleware/auth.js"

const skillCategoryRoute=express.Router()

skillCategoryRoute.get("/",[isAuth,isUser],skillCategoryController.getAllSkillCategory),
skillCategoryRoute.post("/create",[isAuth,isUser],skillCategoryController.createSkillCategory),
skillCategoryRoute.put("/update/:id",[isAuth,isUser],skillCategoryController.updateSkillCategory),
skillCategoryRoute.delete("/delete/:id",[isAuth,isUser],skillCategoryController.deleteSkillCategory)
  
export default skillCategoryRoute

