import prisma from "../../config/prisma.js";
import skillCategorySchem from "./skillCategorySchem.js";

const skillCategoryController = {
  // Get all Skill Categories (with skills and skill items)
  getAllSkillCategory: async (req, res, next) => {
    try {
        const skillCategories = await prisma.skillCategory.findMany({
            where: {
                userId: req.user.id,
            },
          
        });

        return res.status(200).json({
            success: true,
            message: "Fetched all skill categories successfully",
            data: skillCategories,
        });
    } catch (error) {
        console.error("Error fetching skill categories:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching skill categories",
        });
    }
},

  // Create a new Skill Category
  createSkillCategory: async (req, res, next) => {
    try {
      const data = skillCategorySchem.create.parse(req.body);

      const existingCategory = await prisma.skillCategory.findFirst({
        where: {
          name: data.name,
          userId: req.user.id,
        },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Skill category already exists",
        });
      }

      const newSkillCategory = await prisma.skillCategory.create({
        data: {
          name: data.name,
          userId: req.user.id,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Skill category created successfully",
        data: newSkillCategory,
      });
    } catch (error) {
      console.error("Error creating skill category:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the skill category",
      });
    }
  },

  // Update Skill Category
  updateSkillCategory: async (req, res, next) => {
    try {
      const skillCategoryId = parseInt(req.params.id, 10);
      if (isNaN(skillCategoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid skill category ID",
        });
      }

      const data = skillCategorySchem.update.parse(req.body);

      const skillCategory = await prisma.skillCategory.findFirst({
        where: {
          id: skillCategoryId,
          userId: req.user.id,
        },
      });

      if (!skillCategory) {
        return res.status(404).json({
          success: false,
          message: "Skill category not found or unauthorized",
        });
      }

      const updatedSkillCategory = await prisma.skillCategory.update({
        where: { id: skillCategoryId },
        data: {
          name: data.name,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Skill category updated successfully",
        data: updatedSkillCategory,
      });
    } catch (error) {
      console.error("Error updating skill category:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the skill category",
      });
    }
  },

  deleteSkillCategory: async (req, res, next) => {
    try {
      const skillCategoryId = parseInt(req.params.id, 10);
      if (isNaN(skillCategoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid skill category ID",
        });
      }

      const skillCategory = await prisma.skillCategory.findFirst({
        where: {
          id: skillCategoryId,
          userId: req.user.id,
        },
      });

      if (!skillCategory) {
        return res.status(404).json({
          success: false,
          message: "Skill category not found or unauthorized",
        });
      }

  

     

    

      await prisma.skillCategory.delete({
        where: { id: skillCategoryId },
      });

      return res.status(200).json({
        success: true,
        message: "Skill category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting skill category:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the skill category",
      });
    }
  },
};

export default skillCategoryController;
