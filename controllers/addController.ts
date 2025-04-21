import sql from '../config/dbconfig';
import { Request, Response } from 'express';

export const addPro = (req : Request, res : Response): void => {
    res.render("addProduct.ejs");
};

// Controller to handle product submission from the form
// A Promise is an object that represents the result of an asynchronous operation — something that will finish in the future.
export const addProduct = async (req : Request, res : Response): Promise<void> => {
  const {name, price, rating, img_url, description, category } = req.body;

  try {
      // Validation to ensure all fields are filled
      if (!name || !price || !img_url || !description || !category) {
          throw new Error("All fields are required");
      }

      // Insert the new product into the database
      let currentId = await sql`SELECT MAX(id) FROM products`;
      const nextId = currentId[0].max + 1;
      
      const result = await sql`
        INSERT INTO products (id, name, price, rating, image_url, description, category)
          VALUES (${nextId}, ${name}, ${price}, ${rating}, ${img_url}, ${description}, ${category});
      `;

      console.log("New Product Added:", result); 

      // Redirect to the route that displays all products after adding
      res.redirect("/products");  // Or "/productRoute" depending on your setup
  } catch (error: unknown) {
      if(error instanceof Error){
        console.error("Error adding product:", error.message);
        res.status(500).send(`Internal Server Error: ${error.message}`);
      } else {
        console.error(error);
      }
  }
};