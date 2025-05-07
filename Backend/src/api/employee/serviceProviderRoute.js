import express from "express"
import serviceProviderController from "./serviceProviderController.js"
const serviceProviderRoute=express.Router()
serviceProviderRoute.get("/:id",serviceProviderController.getById),
serviceProviderRoute.get("/",serviceProviderController.getAllUser),
serviceProviderRoute.post("/",serviceProviderController.createUser)

export default serviceProviderRoute