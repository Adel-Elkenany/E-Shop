import { NotFoundError, ValidationError } from "@packages/error-handler";
import { imagekit } from "@packages/libs/imagekit";
import prisma from "@packages/libs/prisma";
import { NextFunction, Response, Request } from "express";

// get product categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
 try {
  const config = await prisma.siteConfig.findFirst();

  if (!config) {
   return res.status(404).json({
    message: 'Categories not found',
   })
  }

  return res.status(200).json({
   categories: config.categories,
   subCategories: config.subCategories,
  })
 } catch (error) {
  return next(error);
 }
};

// Create Discount Code
export const createDiscountCode = async (req: any, res: Response, next: NextFunction) => {
 try {
  console.log("createDiscountCode called");
  console.log("req.body:", req.body);
  console.log("req.seller:", req.seller);
  const { publicName, discountType, discountValue, discountCode } = req.body;
  const isDiscountCodeExist = await prisma.discountCodes.findUnique({
   where: {
    discountCode: discountCode,
   }
  });

  if (isDiscountCodeExist) {
   return next(new ValidationError('Discount code already exists'));
  }

  const newDiscountCode = await prisma.discountCodes.create({
   data: {
    publicName,
    discountType,
    discountValue: parseFloat(discountValue),
    discountCode,
    sellerId: req.seller.id,
   }
  });

  res.status(201).json({
   message: 'Discount code created successfully',
   discountCode: newDiscountCode,
  });
 } catch (error) {
  next(error);
 }
};

// get all discount codes
export const getAllDiscountCodes = async (req: any, res: Response, next: NextFunction) => {
 try {
  const discountCodes = await prisma.discountCodes.findMany({
   where: {
    sellerId: req.seller.id,
   },
   orderBy: {
    createdAt: "desc",
   }
  });

  res.status(200).json({
   success: true,
   discountCodes,
  });
 } catch (error) {
  return next(error);
 }
};

// get discount code
export const getDiscountCode = async (req: any, res: Response, next: NextFunction) => {
 try {
  const discountCode = await prisma.discountCodes.findUnique({
   where: {
    id: req.params.id,
    sellerId: req.seller.id,
   }
  });

  res.status(200).json({
   success: true,
   discountCode,
  });
 } catch (error) {
  return next(error);
 }
};

// Delete discount code
export const deleteDiscountCode = async (req: any, res: Response, next: NextFunction) => {
 try {
  const discountCode = await prisma.discountCodes.findFirst({
   where: {
    id: req.params.id,
    sellerId: req.seller.id,
   }
  });

  if (!discountCode) {
   return next(new NotFoundError('Discount code not found or you are not authorized'));
  }

  await prisma.discountCodes.delete({
   where: {
    id: req.params.id,
   }
  });

  res.status(200).json({
   message: 'Discount code deleted successfully',
   discountCode,
  });
 } catch (error) {
  return next(error);
 }
};

// upload product image
export const uploadProductImage = async (req: Request, res: Response, next: NextFunction) => {
 try {
  const { fileName } = req.body;

  const response = await imagekit.upload({
   file: fileName,
   fileName: `product=${Date.now()}.jpg`,
   folder: 'products',
  });

  res.status(201).json({
   file_url: response.url,
   fileName: response.fileId,
  });
 } catch (error) {
  return next(error);
 }
};

