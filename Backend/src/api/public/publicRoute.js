import express from "express";
import publicController from "./publicController.js";
const publicRoute=express.Router();
publicRoute.post("/login",publicController.login)

export default publicRoute;