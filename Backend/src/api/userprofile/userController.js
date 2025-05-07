import prisma from "../../config/prisma.js";
import userSchem from "./userSchem.js";

const userController = {

getProfile: async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        userInfo: true,
        userDetails: true,
        socialLinks: true,
       _count:true
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetching user data",
      data: user,
    });

  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
},

  createProfile: async (req, res) => {
    try {
      const data = userSchem.register.parse(req.body);
      const userId = req.user.id;
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          userInfo: {
            upsert: {
              create: {
                firstName: data.userInfo.firstName,
                lastName: data.userInfo.lastName,
                country: data.userInfo.country,
                city: data.userInfo.city,
              },
              update: {
                firstName: data.userInfo.firstName,
                lastName: data.userInfo.lastName,
                country: data.userInfo.country,
                city: data.userInfo.city,
              },
            },
          },
          userDetails: {
            upsert: {
              create: {
                title: data.userDetails.title,
                heroImage: data.userDetails.heroImage,
                yearsOfExperience: data.userDetails.yearsOfExperience,
                aboutMe: data.userDetails.aboutMe,
                cv: data.userDetails.cv,
              },
              update: {
                title: data.userDetails.title,
                heroImage: data.userDetails.heroImage,
                yearsOfExperience: data.userDetails.yearsOfExperience,
                aboutMe: data.userDetails.aboutMe,
                cv: data.userDetails.cv,
              },
            },
          },
          socialLinks: {
            deleteMany: {},
            create: data.socialMediaLink.map((link) => ({
              name: link.name,
              link: link.link,
            })),
          },
        },
        include: {
          userInfo: true,
          userDetails: true,
          socialLinks: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const data = userSchem.update.parse(req.body);

      const userId = req.user.id;

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
        phoneNumber:data.phoneNumber,
        email:data.email,
          userInfo: {
            upsert: {
              create: {
                firstName: data.userInfo.firstName,
                lastName: data.userInfo.lastName,
                country: data.userInfo.country,
                city: data.userInfo.city,
              },
              update: {
                firstName: data.userInfo.firstName,
                lastName: data.userInfo.lastName,
                country: data.userInfo.country,
                city: data.userInfo.city,
              },
            },
          },
          userDetails: {
            upsert: {
              create: {
                title: data.userDetails.title,
                heroImage: data.userDetails.heroImage,
                yearsOfExperience: data.userDetails.yearsOfExperience,
                aboutMe: data.userDetails.aboutMe,
                cv: data.userDetails.cv,
              },
              update: {
                title: data.userDetails.title,
                heroImage: data.userDetails.heroImage,
                yearsOfExperience: data.userDetails.yearsOfExperience,
                aboutMe: data.userDetails.aboutMe,
                cv: data.userDetails.cv,
              },
            },
          },
          socialLinks: {
            deleteMany: {}, 
            create: data.socialMediaLink.map((link) => ({
              name: link.name,
              link: link.link,
            })),
          },
        },
        include: {
          userInfo: true,
          userDetails: true,
          socialLinks: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  deleteSocialLinks:async(req,res)=>{
    try {
        const userId = req.user.id; 
    
        // Check if the user exists
        const existingUser = await prisma.user.findUnique({
          where: { id: userId },
        });
    
        if (!existingUser) {
          return res.status(404).json({
            success: false,
            message: 'User not found',
          });
        }
    
        await prisma.socialLink.deleteMany({
          where: { userId },
        });
    
        return res.status(200).json({
          success: true,
          message: 'Social media links deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting social media links:', error);
        return res.status(500).json({
          success: false,
          message: 'An error occurred while deleting social media links',
        });
      }
  }
};

export default userController;
