import bcrypt from 'bcrypt';
import prisma from "../../config/prisma.js";
import serviceProviderSchema from "./serviceProviderSchem.js";

const serviceProviderController = {
  // Create a new service provider
  createUser: async (req, res) => {
    try {
      const data = serviceProviderSchema.create.parse(req.body);

      const existingProvider = await prisma.serviceProvider.findUnique({
        where: { email: data.email },
      });

      if (existingProvider) {
        return res.status(400).json({
          success: false,
          message: "Service provider with this email already exists",
        });
      }

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          phoneNumber: data.phoneNumber,
          status: 'ACTIVE', // Default status
        },
      });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      console.error("Error creating User", error);
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },

  // Get all service providers
  getAllUser: async (req, res) => {
    try {
      const providers = await prisma.user.findMany();
      return res.status(200).json({
        success: true,
        message: "Fetched all service providers successfully",
        data: providers,
      });
    } catch (error) {
      console.error("Error fetching service providers:", error);
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success:false, message:"Invalid ID" });
      }
      const sp = await prisma.serviceProvider.findUnique({ where:{ id } });
      if (!sp) {
        return res.status(404).json({ success:false, message:"Not found" });
      }
      res.json({ success:true, data:sp });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success:false, message: err.message });
    }
  },
};

export default serviceProviderController;
