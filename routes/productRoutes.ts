import express from "express";
import { ProductController } from "../controllers/productController";
import { showProductDetails } from "../controllers/ProductInfo";
import { ProductService } from "../services/productService";
import { addPro, addProduct } from '../controllers/addController';
import { ProductRepository } from "../repositories/ProductRepository";
import { body } from "express-validator";
import sql from "../config/dbconfig";

const repo = new ProductRepository();
const router = express.Router();
const productService = new ProductService(repo);
const productController = new ProductController(productService);

// Return in json format
router.get("/", async (req, res) => {
  const category = req.query.category;

  try {
    let products;

    if (category) {
      products = await repo.getByCategory(category as string);
    } else {
      products = await repo.getAll();
    }

    res.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", showProductDetails);

router.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    await sql`DELETE FROM product_images WHERE product_id = ${productId}`;

    await sql`DELETE FROM products WHERE id = ${productId}`;

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, category, price, quantity, description } = req.body;
  const imageUrls = req.body["img_urls[]"];

  try {
    await sql`UPDATE products SET name=${name}, price=${price}, category=${category}, quantity=${quantity}, description=${description} WHERE id=${id}`;

    await sql`DELETE FROM product_images WHERE product_id = ${id}`;
    for (const url of imageUrls) {
      await sql`INSERT INTO product_images (product_id, image_url) VALUES (${id}, ${url})`;
    }

    res.status(200).json({ message: "Updated successfully" });
  } catch (e) {
    console.error("Error updating:", e);
    res.status(500).json({ message: "Update failed" });
  }
});


// For ejs files in views folder
// router.get("/", productController.showAll)
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
// router.get("/:id", showProductDetails);


export const productRoutes = router;