import express from "express"
import { isAuth, isUser } from "../../middleware/auth.js"
import projectController from "./projectController.js"

const projectRoute=express.Router()

projectRoute.get("/",[isAuth,isUser],projectController.getAllProjects),
projectRoute.post("/create",[isAuth,isUser],projectController.createProject),
projectRoute.put("/update/:id",[isAuth,isUser],projectController.updateProject),
projectRoute.delete("/delete/:id",[isAuth,isUser],projectController.deleteProject)

export default projectRoute
