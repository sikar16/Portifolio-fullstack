import prisma from "../../config/prisma.js";
import educationSchem from "./educationSchem.js";

const educationController = {
  // Get all education entries for the logged-in user
  getAllEducation: async (req, res) => {
    try {
      const education = await prisma.education.findMany({
        where: { userId: req.user.id },
      });

      res.status(200).json({
        success: true,
        message: "Education entries fetched successfully",
        data: education,
      });
    } catch (error) {
      console.error("Error fetching education entries:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  // Create a new education entry
  createEducation: async (req, res) => {
    try {
      const data = educationSchem.create.parse(req.body); // Validate incoming data

      const education = await prisma.education.create({
        data: {
          ...data,
          userId: req.user.id, // Associate with the logged-in user
        },
      });

      res.status(201).json({
        success: true,
        message: "Education entry created successfully",
        data: education,
      });
    } catch (error) {
      console.error("Error creating education entry:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  // Update education entry
  updateEducation: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = educationSchem.update.parse(req.body); // Validate incoming data

      const existing = await prisma.education.findFirst({
        where: { id, userId: req.user.id }, // Ensure the user owns the entry
      });

      if (!existing) {
        return res.status(404).json({ success: false, message: "Education entry not found" });
      }

      const updated = await prisma.education.update({
        where: { id },
        data,
      });

      res.status(200).json({
        success: true,
        message: "Education entry updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating education entry:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  // Delete education entry
  deleteEducation: async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      const existing = await prisma.education.findFirst({
        where: { id, userId: req.user.id }, // Ensure the user owns the entry
      });

      if (!existing) {
        return res.status(404).json({ success: false, message: "Education entry not found" });
      }

      await prisma.education.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: "Education entry deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting education entry:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
};

export default educationController;