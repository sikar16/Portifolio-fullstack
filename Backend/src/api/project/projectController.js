import prisma from "../../config/prisma.js";
import projectSchema from "./projectSchem.js";

const projectController = {
  getAllProjects: async (req, res) => {
    try {
      const projects = await prisma.project.findMany({
        where: { userId: req.user.id },
        include: {
          projectImage: true,
          projectCategory: true,
        },
      });
      res.status(200).json({
        success: true,
        message: "Projects fetched successfully",
        data: projects,
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  getSingleProject: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await prisma.project.findFirst({
        where: { id, userId: req.user.id },
        include: {
          projectImage: true,
          projectCategory: true,
        },
      });

      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }

      res.status(200).json({
        success: true,
        message: "Project fetched successfully",
        data: project,
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },


createProject: async (req, res) => {
    try {
      const data = projectSchema.create.parse(req.body);
  
      // ✅ Check if projectCategoryId exists BEFORE creating project
      const category = await prisma.projectCategory.findUnique({
        where: { id: data.projectCategoryId },
      });
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid projectCategoryId: category not found",
        });
      }
  
      const createdProject = await prisma.project.create({
        data: {
          name: data.name,
          description: data.description,
          demoLink: data.demoLink,
          technology: data.technology,
          userId: req.user.id,
          projectCategoryId: data.projectCategoryId,
          projectImage: {
            create: data.projectImage?.map((img) => ({ image: img })) || [],
          },
        },
        include: { projectImage: true },
      });
  
      res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: createdProject,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
  

  // Update a project
  updateProject: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = projectSchema.update.parse(req.body);

      const existing = await prisma.project.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!existing) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }

      // Delete old images if new ones are provided
      if (data.projectImage) {
        await prisma.projectImage.deleteMany({ where: { projectId: id } });
      }

      const updated = await prisma.project.update({
        where: { id },
        data: {
          ...data,
          projectImage: data.projectImage
            ? {
                create: data.projectImage.map((img) => ({ image: img })),
              }
            : undefined,
        },
        include: { projectImage: true },
      });

      res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  // Delete a project
  deleteProject: async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      const existing = await prisma.project.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!existing) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }

      // Delete project images first due to foreign key constraint
      await prisma.projectImage.deleteMany({ where: { projectId: id } });

      await prisma.project.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
};

export default projectController;
