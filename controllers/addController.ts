import sql from '../config/dbconfig';
import { Request, Response } from 'express';

export const addPro = (req: Request, res: Response): void => {
  res.render("addProduct.ejs");
};

export const addProduct = async (req: Request, res: Response): Promise<void> => {
  const { name, price, description, category, quantity } = req.body;
  const img_urls = req.body["img_urls[]"]; // name="img_urls[]" in HTML

  try {
    if (!name || !price || !img_urls || !description || !category || !quantity) {
      throw new Error("All fields are required");
    }

    const imageUrls: string[] = Array.isArray(img_urls)
      ? img_urls.map((url: string) => url.trim()).filter(Boolean)
      : [img_urls].filter(Boolean);

    if (imageUrls.length === 0) {
      throw new Error("At least one image URL is required");
    }

    const mainImage = imageUrls[0];
    const extraImages = imageUrls.slice(1);

    const insertedProduct = await sql`
      INSERT INTO products (name, price, image_url, description, category, quantity)
      VALUES (${name}, ${price}, ${mainImage}, ${description}, ${category}, ${quantity})
      RETURNING id;
    `;
    const productId = insertedProduct[0].id;

    for (const url of imageUrls) {
      await sql`
        INSERT INTO product_images (product_id, image_url)
        VALUES (${productId}, ${url});
      `;
    }

    console.log(`Product '${name}' added with ${imageUrls.length} image(s)`);
    res.status(201).json({ message: "Product added successfully", redirect: "/dashboard" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding product:", error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    } else {
      console.error("Unknown error:", error);
      res.status(500).send("Unexpected error occurred");
    }
  }
};
