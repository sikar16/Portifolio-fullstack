import express from "express"
import { isAuth, isUser } from "../../middleware/auth.js";
import testimonialController from "./testimonyController.js";

const testimonyRoute=express.Router()

testimonyRoute.get("/",[isAuth,isUser],testimonialController.getAllTestimonials)
testimonyRoute.post("/create",[isAuth,isUser],testimonialController.createTestimonial)
testimonyRoute.put("/update/:id",[isAuth,isUser],testimonialController.updateTestimonial)
testimonyRoute.delete("/delete/:id",[isAuth,isUser],testimonialController.deleteTestimonial)

export default testimonyRoute;