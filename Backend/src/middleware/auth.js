
import jwt from "jsonwebtoken";
import { SECRET } from "../config/secret.js";
import prisma from "../config/prisma.js";


export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      req.payload = payload;
      next();
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



export const isServiceProvider = async (req, res, next) => {
  try {
    if (!req.payload || !req.payload.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user payload",
      });
    }

    const serviceProvider = await prisma.serviceProvider.findFirst({
      where: { id: parseInt(req.payload.id) },
    });

    if (!serviceProvider) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Not a service provider",
      });
    }

    req.user = serviceProvider;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Database error",
      error: error.message,
    });
  }
};


export const isUser = async (req, res, next) => {
  try {
    if (!req.payload || !req.payload.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user payload",
      });
    }

    const user = await prisma.user.findFirst({
      where: { id: parseInt(req.payload.id) },
    });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Not a user",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Database error",
      error: error.message,
    });
  }
};


export const isAnyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
};