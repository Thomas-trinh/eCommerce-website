import { Request, Response } from "express";
import { getAllProducts } from '../db/products_db';

// Extend Express Request to include loggedInUser
interface CustomRequest extends Request {
  loggedInUser?: {
    id: number;
    [key: string]: any; // add more fields if needed
  };
}

export const dashboardPage = async (request: CustomRequest, response: Response): Promise<void> => {
  try {
    const user = request.loggedInUser;

    // Ensure the user is logged in and is admin (id === 1)
    if (!user || user.id !== 1) {
      return response.redirect("/");
    }

    // Fetch all products from the database
    const productList = await getAllProducts();

    // Render the dashboard with product data
    response.render("dashboard.ejs", { products: productList });

  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    response.status(500).send("Internal Server Error");
  }
};
