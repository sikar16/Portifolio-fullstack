import express from "express"
import publicRoute from "../api/public/publicRoute.js";
import serviceProviderRoute from "../api/employee/serviceProviderRoute.js";
import userRoute from "../api/userprofile/userRoute.js";
import serviceRoute from "../api/service/serviceRoute.js";
import skillCategoryRoute from "../api/skillCategory/skilCateoryRoute.js";
import skillRoute from "../api/skill/skilRoute.js";
import testimonyRoute from "../api/testimony/testimonyRoute.js";
import blogRoute from "../api/blog/blogRoute.js";
import educationRoute from "../api/education/educationRoute.js";
import exprianceRoute from "../api/expriance/exprianceRoute.js";
import projectCategoryRoute from "../api/projectCategory/projectCateoryRoute.js";
import projectRoute from "../api/project/projectRoute.js";
import portifolioRoute from "../api/portifolio/portifolioRoute.js";


const appRoute=express.Router()
appRoute.use("/public",publicRoute)
appRoute.use("/service_p",serviceProviderRoute)
appRoute.use("/user",userRoute)
appRoute.use("/service",serviceRoute)
appRoute.use("/skillCategory",skillCategoryRoute)
appRoute.use("/skill",skillRoute)
appRoute.use("/testimony",testimonyRoute)
appRoute.use("/blog",blogRoute)
appRoute.use("/education",educationRoute)
appRoute.use("/expriance",exprianceRoute)
appRoute.use("/projectCategory",projectCategoryRoute)
appRoute.use("/project",projectRoute)
appRoute.use("/portifolio",portifolioRoute)
export default appRoute;