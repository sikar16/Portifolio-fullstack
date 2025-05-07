import express from "express"
import { isAuth, isUser } from "../../middleware/auth.js"
import projectCategoryController from "./projectCategoryController.js"

const projectCategoryRoute=express.Router()
projectCategoryRoute.get("/",[isAuth,isUser],projectCategoryController.getAllCategories),
projectCategoryRoute.post("/create",[isAuth,isUser],projectCategoryController.createCategory),
projectCategoryRoute.put("/update/:id",[isAuth,isUser],projectCategoryController.updateCategory),
projectCategoryRoute.delete("/delete/:id",[isAuth,isUser],projectCategoryController.deleteCategory)

export default projectCategoryRoute