import express from "express";
import portifolioController from "./portifolioController.js";

const portifolioRoute = express.Router();

portifolioRoute.get("/:firstName",  portifolioController.getUserportifolio);

export default portifolioRoute;