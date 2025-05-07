import prisma from "../../config/prisma.js";
import projectCategorySchem from "./projectCategorySchem.js";

const projectCategoryController = {
    // Get all project categories for the logged-in user
    getAllCategories: async (req, res) => {
        try {
            const categories = await prisma.projectCategory.findMany({
                where: { userId: req.user.id },
            });
            res.status(200).json({
                success: true,
                message: "Project categories fetched successfully",
                data: categories,
            });
        } catch (error) {
            console.error("Error fetching project categories:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // Create a new project category
    createCategory: async (req, res) => {
        try {
            const data = projectCategorySchem.create.parse(req.body); // Validate incoming data
            const category = await prisma.projectCategory.create({
                data: {
                    ...data,
                    userId: req.user.id, // Associate with the logged-in user
                },
            });
            res.status(201).json({
                success: true,
                message: "Project category created successfully",
                data: category,
            });
        } catch (error) {
            console.error("Error creating project category:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // Update a project category
    updateCategory: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const data = projectCategorySchem.update.parse(req.body); // Validate incoming data

            const existing = await prisma.projectCategory.findFirst({
                where: { id, userId: req.user.id }, // Ensure the user owns the category
            });

            if (!existing) {
                return res.status(404).json({ success: false, message: "Project category not found" });
            }

            const updated = await prisma.projectCategory.update({
                where: { id },
                data,
            });

            res.status(200).json({
                success: true,
                message: "Project category updated successfully",
                data: updated,
            });
        } catch (error) {
            console.error("Error updating project category:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // Delete a project category
    deleteCategory: async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            const existing = await prisma.projectCategory.findFirst({
                where: { id, userId: req.user.id }, 
            });

            if (!existing) {
                return res.status(404).json({ success: false, message: "Project category not found" });
            }

            await prisma.projectCategory.delete({
                where: { id },
            });

            res.status(200).json({
                success: true,
                message: "Project category deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting project category:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
};

export default projectCategoryController;