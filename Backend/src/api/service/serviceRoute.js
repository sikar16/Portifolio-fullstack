import express from "express";
import serviceController from "./serviceController.js";
import { isAuth, isUser } from "../../middleware/auth.js";

const serviceRoute=express.Router()

// serviceRoute.get("/:id",[isAuth, isUser],serviceController.getSingleservice)
serviceRoute.get("/",[isAuth, isUser],serviceController.getAllservice)
serviceRoute.post("/createGeneralservice",[isAuth, isUser],serviceController.createGeneralDescription)
serviceRoute.post("/create",[isAuth, isUser],serviceController.createservice)
serviceRoute.get("/generaldes",[isAuth, isUser],serviceController.getGeneralDesc)
serviceRoute.put("/update/:id",[isAuth, isUser],serviceController.updateService)
serviceRoute.delete("/delete/:id",[isAuth, isUser],serviceController.deleteService)
export default serviceRoute