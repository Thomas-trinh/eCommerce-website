import sql from '../config/dbconfig.js';

export const addPro = (req, res) => {
    res.render("addProduct.ejs");
  }

// Controller to handle product submission from the form
export const addProduct = async (req, res) => {
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
  } catch (error) {
      console.error("Error adding product:", error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};