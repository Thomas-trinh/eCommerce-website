import express from "express";
import { showAllProducts, showFilteredProducts, showSearchedProducts } from "../controllers/productController.js";
import { showProductDetails } from "../controllers/ProductInfo.js";
import { searchValidation } from "../middleware/product-validation.js";
import { addPro, addProduct } from '../controllers/addController.js';
import { body } from "express-validator";

const router = express.Router();

router.get("/", showAllProducts)
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
  ], showSearchedProducts)
router.post("/filter", showFilteredProducts)
router.get("/:id", showProductDetails);


export const productRoutes = router;