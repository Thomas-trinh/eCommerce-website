import { getAllProducts } from '../db/products_db.js';

export const dashboardPage = async (req, res) => {
  try {
    const loggedInUser = req.loggedInUser;

    if (loggedInUser.id !== 1) res.redirect("/");
    
    // Fetch products from the database
    const products = await getAllProducts();
    
    // Render the dashboard view and pass the products
    res.render("dashboard.ejs", { products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};
