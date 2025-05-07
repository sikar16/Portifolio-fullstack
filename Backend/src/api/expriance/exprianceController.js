import prisma from "../../config/prisma.js";
import experienceSchem from "./exprianceSchem.js";

const experienceController = {
    getAllExperiences: async (req, res) => {
        try {
            const experiences = await prisma.experience.findMany({
                where: { userId: req.user.id },
            });

            res.status(200).json({
                success: true,
                message: "Experience entries fetched successfully",
                data: experiences,
            });
        } catch (error) {
            console.error("Error fetching experience entries:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // Create a new experience entry
    createExperience: async (req, res) => {
        try {
            const data = experienceSchem.create.parse(req.body); // Validate incoming data

            const experience = await prisma.experience.create({
                data: {
                    ...data,
                    userId: req.user.id, // Associate with the logged-in user
                },
            });

            res.status(201).json({
                success: true,
                message: "Experience entry created successfully",
                data: experience,
            });
        } catch (error) {
            console.error("Error creating experience entry:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // Update experience entry
    updateExperience: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const data = experienceSchem.update.parse(req.body); // Validate incoming data

            const existing = await prisma.experience.findFirst({
                where: { id, userId: req.user.id }, // Ensure the user owns the entry
            });

            if (!existing) {
                return res.status(404).json({ success: false, message: "Experience entry not found" });
            }

            const updated = await prisma.experience.update({
                where: { id },
                data,
            });

            res.status(200).json({
                success: true,
                message: "Experience entry updated successfully",
                data: updated,
            });
        } catch (error) {
            console.error("Error updating experience entry:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // Delete experience entry
    deleteExperience: async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            const existing = await prisma.experience.findFirst({
                where: { id, userId: req.user.id }, // Ensure the user owns the entry
            });

            if (!existing) {
                return res.status(404).json({ success: false, message: "Experience entry not found" });
            }

            await prisma.experience.delete({
                where: { id },
            });

            res.status(200).json({
                success: true,
                message: "Experience entry deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting experience entry:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
};

export default experienceController;