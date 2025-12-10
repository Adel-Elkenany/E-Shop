import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initializeConfig = async () => {
 try {
  const existingConfig = await prisma.siteConfig.findFirst();
  if (!existingConfig) {
   await prisma.siteConfig.create({
    data: {
     categories: [
      "Electronics",
      "Accessories",
      "Computers",
      "Home & Kitchen",
     ],
     subCategories: {
      "Electronics": ["Mobile & Tablets", "Laptops", "Gaming"],
      "Accessories": ["Cables", "Chargers"],
      "Computers": ["Desktops", "Laptops", "Gaming"],
      "Home & Kitchen": ["Cookware", "Dining", "Bedding"],
     },
    },
   });
  }
 } catch (error) {
  console.log("Error initializing site config", error);
 }
};

export default initializeConfig;
