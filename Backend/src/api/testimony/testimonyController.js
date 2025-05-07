import prisma from "../../config/prisma.js";
import testimonialSchema from "./testimonySchem.js";

const testimonialController = {
  // Get all testimonials for the logged-in user
  getAllTestimonials: async (req, res) => {
    try {
      const testimonials = await prisma.testimonial.findMany({
        where: { userId: req.user.id },
    
      });

      res.status(200).json({
        success: true,
        message: "Testimonials fetched successfully",
        data: testimonials,
      });
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  // Create a new testimonial
  createTestimonial: async (req, res) => {
    try {
      const data = testimonialSchema.create.parse(req.body);

      const testimonial = await prisma.testimonial.create({
        data: {
          ...data,
          userId: req.user.id,
        },
      });

      res.status(201).json({
        success: true,
        message: "Testimonial created successfully",
        data: testimonial,
      });
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  // Update testimonial
  updateTestimonial: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = testimonialSchema.update.parse(req.body);

      const existing = await prisma.testimonial.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!existing) {
        return res.status(404).json({ success: false, message: "Testimonial not found" });
      }

      const updated = await prisma.testimonial.update({
        where: { id },
        data,
      });

      res.status(200).json({
        success: true,
        message: "Testimonial updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  // Delete testimonial
  deleteTestimonial: async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      const existing = await prisma.testimonial.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!existing) {
        return res.status(404).json({ success: false, message: "Testimonial not found" });
      }

      await prisma.testimonial.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: "Testimonial deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
};

export default testimonialController;
