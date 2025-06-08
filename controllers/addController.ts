import sql from '../config/dbconfig';
import { Request, Response } from 'express';

export const addPro = (req : Request, res : Response): void => {
    res.render("addProduct.ejs");
};

export const addProduct = async (req : Request, res : Response): Promise<void> => {
  const {name, price, rating, img_url, description, category, quantity } = req.body;

  try {
      if (!name || !price || !img_url || !description || !category || !quantity) {
          throw new Error("All fields are required");
      }

      let currentId = await sql`SELECT MAX(id) FROM products`;
      const nextId = currentId[0].max + 1;
      
      const result = await sql`
        INSERT INTO products (id, name, price, rating, image_url, description, category, quantity)
          VALUES (${nextId}, ${name}, ${price}, ${rating}, ${img_url}, ${description}, ${category}, ${quantity});
      `;

      console.log("New Product Added:", result); 

      res.redirect("/products");
  } catch (error: unknown) {
      if(error instanceof Error){
        console.error("Error adding product:", error.message);
        res.status(500).send(`Internal Server Error: ${error.message}`);
      } else {
        console.error(error);
      }
  }
};