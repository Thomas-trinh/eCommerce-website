import express, { Request, Response } from "express";
import {
  updateProductById,
  getProductById,
  deleteProductById,
  updateProductQuantity,
  updateProductImages
} from "../db/details_db";

const router = express.Router();

// GET: Render the update form for a specific product
router.get("/:id/updates", async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);
    const product = await getProductById(productId);
    
    if (product) {
      res.render("updateProduct.ejs", { product });
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST: Handle form submission and update product details
router.post("/:id/updates", async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);

    const updatedProduct = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      image_url: req.body.image_url,
      quantity: req.body.quantity,
      category: req.body.category,
    };

    const imgUrls = Array.isArray(req.body["img_urls[]"])
      ? req.body["img_urls[]"]
      : [req.body["img_urls[]"]];

    const images = imgUrls
      .map((url: string) => url.trim())
      .filter(Boolean)
      .map((url: string) => ({
        image_url: url,
        alt_text: undefined,
      }));

    await updateProductById(productId, updatedProduct);
    await updateProductImages(productId, images);

    // res.redirect(`/products/${productId}`);
    res.json({
      message: "Product updated successfully!",
      redirect: "/dashboard", // or `/products/${productId}` if needed
    });    
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST: Delete a product
router.post("/:id/delete", async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);
    const product = await getProductById(productId);

    await deleteProductById(productId);
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST: Search for product by ID
router.post("/search", async (req: Request, res: Response): Promise<void> => {
  try {
    const searchId = Number(req.body.searchId);
    if (isNaN(searchId)) return res.redirect("/dashboard");

    const product = await getProductById(searchId);
    if (!product) return res.redirect("/dashboard");

    res.render("dashboard.ejs", { products: [product] });
  } catch (error) {
    console.error("Error searching product:", error);
    res.status(500).send("Internal Server Error");
  }
});

export const updateRoutes = router;
