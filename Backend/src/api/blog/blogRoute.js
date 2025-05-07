import express from "express"
import { isAuth, isUser } from "../../middleware/auth.js";
import blogController from "./blogController.js";

const blogRoute=express.Router()

blogRoute.get("/",[isAuth,isUser],blogController.getAllBlogs)
blogRoute.post("/create",[isAuth,isUser],blogController.createBlog)
blogRoute.put("/update/:id",[isAuth,isUser],blogController.updateBlog)
blogRoute.delete("/delete/:id",[isAuth,isUser],blogController.deleteBlog)

export default blogRoute;