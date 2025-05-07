import prisma from "../../config/prisma.js";
import serviceSchem from "./serviceSchem.js";

const serviceController={


getSingleservice: async (req, res, next) => {
  try {
      const serviceId = parseInt(req.params.id, 10);

      if (isNaN(serviceId)) {
          return res.status(400).json({
              success: false,
              message: "Invalid service ID",
          });
      }

      const service = await prisma.service.findFirst({
          where: {
              id: serviceId,
              userId: req.user.id, 
          },
          include:{
            features:true
          }
      });

      if (!service) {
          return res.status(404).json({
              success: false,
              message: "Service not found or you do not have permission to view it",
          });
      }

      return res.status(200).json({
          success: true,
          data: service,
      });

  } catch (error) {
      console.error("Error fetching service:", error); 
      return res.status(500).json({
          success: false,
          message: `Error - ${error.message}`, 
      });
  }
},
getAllservice: async (req, res, next) => {
    try {
        // First get the general description
        const generalDescription = await prisma.generalDescription.findUnique({
            where: {
                userId: req.user.id,
            },
            select: {
                content: true
            }
        });

        // Then get all services with their items and features
        const services = await prisma.service.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                ServiceItem: true,
                Feature: true,
            }
        });

        return res.status(200).json({
            success: true,
            message: "Services fetched successfully",
            data: {
                content: generalDescription?.content || "", // Fallback to empty string if no description exists
                services: services.map(service => ({
                    id: service.id,
                    userId: service.userId,
                    ServiceItem: service.ServiceItem,
                    Feature: service.Feature
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error fetching services: ${error.message}`,
        });
    }
},
getGeneralDesc: async (req, res, next) => {
    try {
        const generalDescription = await prisma.generalDescription.findMany({
            where: {
                userId: req.user.id,
            },
            
        });

       

        return res.status(200).json({
            success: true,
            message: "general Description fetched successfully",
            data: generalDescription,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error fetching services: ${error.message}`,
        });
    }
},
 createGeneralDescription : async (req, res) => {
    try {
      const { content } = req.body;
      const userId = req.user.id; 
  
      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Description content is required"
        });
      }
  
      const description = await prisma.generalDescription.upsert({
        where: { userId },
        update: { content },
        create: {
          content,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      });
  
      return res.status(200).json({
        success: true,
        message: "General description saved successfully",
        data: description
      });
  
    } catch (error) {
      console.error("Error saving general description:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  },
createservice: async (req, res, next) => {
    try {
        const data = serviceSchem.create.parse(req.body);
        
        // First create the service
        const newService = await prisma.service.create({
            data: {
                userId: req.user.id,
            }
        });

      

        // Then create the service item with proper relations
        const newServiceItem = await prisma.serviceItem.create({
            data: {
                name: data.name,
                description: data.description,
                icon: data.icon,
                userId: req.user.id,  // Provide the userId
                serviceId: newService.id,  // Use the newly created service's ID
                features: {
                    create: data.features.map(featureName => ({
                        name: featureName,
                        serviceId: newService.id
                    }))
                }
            },
            include: {
                features: true,
                service: true
            }
        });

        return res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: {
                serviceItem: newServiceItem
            }
        });
    } catch (error) {
        console.error("Error creating service:", error);
        return res.status(500).json({
            success: false,
            message: `Error - ${error.message}`,
        });
    }
},

updateService: async (req, res) => {
    try {
        const serviceItemId = parseInt(req.params.id, 10);
        const data = serviceSchem.update.parse(req.body);

        if (isNaN(serviceItemId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service item ID",
            });
        }

        // Verify the service item exists and belongs to the user
        const existingItem = await prisma.serviceItem.findFirst({
            where: {
                id: serviceItemId,
                userId: req.user.id
            },
            include: {
                features: true
            }
        });

        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: "Service item not found",
            });
        }

        // Delete old features
        await prisma.feature.deleteMany({
            where: {
                serviceItemId
            }
        });

        const updatedItem = await prisma.serviceItem.update({
            where: { id: serviceItemId },
            data: {
                name: data.name,
                description: data.description,
                icon: data.icon,
                features: {
                    create: data.features.map(name => ({
                        name,
                        serviceId: existingItem.serviceId, // Use serviceId from existing item
                    }))
                }
            },
            include: {
                features: true
            }
        });
        

        return res.status(200).json({
            success: true,
            message: "Service item updated successfully",
            data: updatedItem
        });

    } catch (error) {
        console.error("Error updating service item:", error);
        return res.status(500).json({
            success: false,
            message: `Error - ${error.message}`,
        });
    }
},
deleteService: async (req, res) => {
    try {
        const serviceItemId = parseInt(req.params.id, 10);

        if (isNaN(serviceItemId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service item ID",
            });
        }

        // Verify the service item exists and belongs to the user
        const existingItem = await prisma.serviceItem.findFirst({
            where: {
                id: serviceItemId,
                userId: req.user.id
            }
        });

        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: "Service item not found",
            });
        }

        // Delete features first
        await prisma.feature.deleteMany({
            where: { serviceItemId }
        });

        // Then delete the service item
        await prisma.serviceItem.delete({
            where: { id: serviceItemId }
        });

        return res.status(200).json({
            success: true,
            message: "Service item deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting service item:", error);
        return res.status(500).json({
            success: false,
            message: `Error - ${error.message}`
        });
    }
}

  

}

export default serviceController;