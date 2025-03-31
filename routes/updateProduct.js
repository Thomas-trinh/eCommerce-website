import express from "express";
import {
  updateProductById,
  getProductById,
  deleteProductById,
} from "../db/details_db.js"; // Import the functions

const router = express.Router();

// GET: Render the update form for a specific product
router.get("/:id/updates", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
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
router.post("/:id/updates", async (req, res) => {
  try {
    const updatedProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image_url: req.body.image_url,
    };

    await updateProductById(req.params.id, updatedProduct); // Update product in the database

    res.redirect(`/products/${req.params.id}`); // Redirect back to the product details page after updating
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const product = await getProductById(req.params.id); // Optional: Verify if the product exists
    if (!product) {
      return res.status(404).send("Product not found");
    }

    await deleteProductById(req.params.id); // Call the function to delete the product

    res.redirect("/dashboard"); // Redirect to the products list after deletion
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/search", async (req, res) => {
  try {
    const product = await getProductById(req.body.searchId);
    if (!product) res.redirect("/dashboard");

    res.render("dashboard.ejs", { products: [product] });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export const updateRoutes = router;
