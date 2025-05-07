import prisma from "../../config/prisma.js";

const portifolioController = {
  getUserportifolio: async (req, res, next) => {
    try {
      const { firstName } = req.params; // Get firstName from request parameters

      const userportifolio = await prisma.user.findFirst({
        where: {
          userInfo: {
            firstName: firstName, 
          },
        },
        select: {
          id: true,
          email: true,
          phoneNumber: true,
          userInfo: true,
          userDetails: true,
          socialLinks: true,
          _count: {
            select: {
              blogs: true,
              Education: true,
              Experience: true,
              ProjectCategory: true,
              services: true,
              SkillCategory: true,
              testimonials: true,
              Skills:true,
              projects:true
            },
          },
          projects: {
            include:{
              projectCategory:true,
              projectImage:true
            }
          },
          ServiceItem: true,
          blogs: {
            include:{
              blogImages:true,  
            }
            
          },
          Education: true,
          Experience: true,
          ProjectCategory: true,
          SkillCategory: true,
          testimonials: true,
          Skills:true,
          GeneralDescription:true,
services:{
  include:{
    Feature:true,
    ServiceItem:true,
  }
}

        },
      });

      if (!userportifolio) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fetched portfolio successfully",
        data: userportifolio,
      });
    } catch (error) {
      console.error("Error fetching portfolio", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching portfolio",
      });
    }
  },
};

export default portifolioController;