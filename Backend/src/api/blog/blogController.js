import prisma from "../../config/prisma.js";
import blogSchem from "./blogSchem.js";

const blogController = {
  getAllBlogs: async (req, res) => {
    try {
      const blogs = await prisma.blog.findMany({
        where: { userId: req.user.id },
        include: { blogImages: true }, // Include related BlogImages
      });

      res.status(200).json({
        success: true,
        message: "Blogs fetched successfully",
        data: blogs,
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

// Create a new blog
createBlog: async (req, res) => {
  try {
    const data = blogSchem.create.parse(req.body);
    
    // Log the parsed data for debugging
    console.log("Parsed data:", data);

    const blog = await prisma.blog.create({
      data: {
        title: data.title, // Directly use the title from parsed data
        content: data.content, // Use content from parsed data
        categoryName: data.categoryName, // Use categoryName from parsed data
        userId: req.user.id, // User ID from request
        blogImages: {
          create: data.images.map(imageUrl => ({ imageUrl })), // Create associated BlogImages
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
},

 // Update blog
updateBlog: async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = blogSchem.update.parse(req.body);

    const existing = await prisma.blog.findFirst({
      where: { id, userId: req.user.id },
      include: { blogImages: true }, // Include related BlogImages
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        title: data.title, // Use title from parsed data
        content: data.content, // Use content from parsed data
        categoryName: data.categoryName, // Use categoryName from parsed data
        blogImages: {
          deleteMany: {}, // Optionally delete existing images
          create: data.images.map(imageUrl => ({ imageUrl })), // Add new images
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
},
 // Delete blog
deleteBlog: async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.blog.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Delete associated BlogImages first
    await prisma.blogImage.deleteMany({
      where: { blogId: id },
    });

    // Now delete the blog
    await prisma.blog.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
},
};

export default blogController;