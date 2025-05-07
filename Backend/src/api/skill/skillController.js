import prisma from "../../config/prisma.js";
import skillSchem from "./skillSchem.js";

const skillController = {
    getSkills: async (req, res) => {
        try {
            const skills = await prisma.skills.findMany({
                where: { userId: req.user.id }, // Fetch skills for the logged-in user
                include: {
                    skillCategory: true,
                },
            });
            res.status(200).json({
                success: true,
                message: "Skills fetched successfully",
                data: skills,
            });
        } catch (error) {
            console.error("Error fetching skills:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // Get a single skill by ID
    getSingleSkill: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const skill = await prisma.skills.findFirst({
                where: { id, userId: req.user.id }, // Ensure the user owns the skill
                include: {
                    skillCategory: true,
                },
            });

            if (!skill) {
                return res.status(404).json({ success: false, message: "Skill not found" });
            }

            res.status(200).json({
                success: true,
                message: "Skill fetched successfully",
                data: skill,
            });
        } catch (error) {
            console.error("Error fetching skill:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // Create a new skill
    createSkill: async (req, res) => {
        try {
          const data = skillSchem.create.parse({
            ...req.body,
            userId: req.user.id,
          });
      
          const newSkill = await prisma.skills.create({
            data: {
              name: data.name,
              proficiency: data.proficiency,
              icon: data.icon,
              skillCategoryId: data.skillCategoryId,
              userId: data.userId,
            },
            include: {
              skillCategory: true,
            },
          });
      
          res.status(201).json({
            success: true,
            message: "Skill created successfully",
            data: newSkill,
          });
        } catch (error) {
          console.error("Error creating skill:", error);
          res.status(400).json({
            success: false,
            message: error.message,
          });
        }
      },

    // Update a skill
    updateSkill: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const data = skillSchem.update.parse(req.body);

            const existingSkill = await prisma.skills.findFirst({
                where: { id, userId: req.user.id }, // Ensure the user owns the skill
            });

            if (!existingSkill) {
                return res.status(404).json({ success: false, message: "Skill not found" });
            }

            const updatedSkill = await prisma.skills.update({
                where: { id },
                data: {
                    ...data,
                },
                include: { skillCategory: true },
            });

            res.status(200).json({
                success: true,
                message: "Skill updated successfully",
                data: updatedSkill,
            });
        } catch (error) {
            console.error("Error updating skill:", error);
            res.status(400).json({ success: false, message: "Invalid data", details: error.errors });
        }
    },

    // Delete a skill
    deleteSkill: async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            const existingSkill = await prisma.skills.findFirst({
                where: { id, userId: req.user.id }, // Ensure the user owns the skill
            });

            if (!existingSkill) {
                return res.status(404).json({ success: false, message: "Skill not found" });
            }

            await prisma.skills.delete({ where: { id } });

            res.status(200).json({
                success: true,
                message: "Skill deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting skill:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
};

export default skillController;