import express, { Router } from "express";
import { createDiscountCode, deleteDiscountCode, getCategories, getDiscountCode, getAllDiscountCodes } from "../controllers/product.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";

const router: Router = express.Router();

router.get('/get-categories', getCategories);
router.get('/get-discount-codes', isAuthenticated, getAllDiscountCodes);
router.post('/create-discount-code', isAuthenticated, createDiscountCode);
router.get('/get-discount-code', isAuthenticated, getDiscountCode);
router.delete('/delete-discount-code/:id', isAuthenticated, deleteDiscountCode);

export default router;