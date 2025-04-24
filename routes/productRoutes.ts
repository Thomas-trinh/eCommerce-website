import express from "express";
import { ProductController } from "../controllers/productController";
import { showProductDetails } from "../controllers/ProductInfo";
import { ProductService } from "../services/productService";
import { addPro, addProduct } from '../controllers/addController';
import { ProductRepository } from "../repositories/ProductRepository";
import { body } from "express-validator";

const repo = new ProductRepository();
const router = express.Router();
const productService = new ProductService(repo);
const productController = new ProductController(productService);

router.get("/", productController.showAll)
router.get("/add", addPro)
router.post("/add", addProduct);
router.post("/", [
    // Validation to disallow HTML tags
    body('keyword')
      .custom(value => {
        const htmlRegex = /<\/?[^>]+(>|$)/;
        if (htmlRegex.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        return true;
      }),
    // Validation to disallow common SQL keywords
    body('keyword')
      .custom(value => {
        const sqlRegex = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|EXEC|UNION|TABLE|FROM|WHERE)\b/i;
        if (sqlRegex.test(value)) {
          throw new Error('SQL keywords are not allowed');
        }
        return true;
      })
  ], productController.search)
router.post("/filter", productController.filter)
router.get("/:id", showProductDetails);


export const productRoutes = router;