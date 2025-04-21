import { Request, Response } from "express";
import { getProductById } from "../db/details_db";
import { getAllCommentsAndRatings } from "../db/ratings_db";

// Controller to fetch and display product details
export const showProductDetails = async (request: Request, response: Response): Promise<void> => {
  try {
    const token = request.cookies.token;
    const id = Number(request.params.id); // Convert string to number

    // if (isNaN(id)) {
    //   response.status(400).send("Invalid product ID.");
    // }

    const productDetails = await getProductById(id);
    const productReviews = await getAllCommentsAndRatings(id);

    // if (!productDetails) {
    //   response.status(404).send("Product not found.");
    // }

    response.render("productPageInfo.ejs", {
      product: productDetails,
      reviews: productReviews,
      loggedIn: Boolean(token),
    });

  } catch (error) {
    console.error("Error fetching product details:", error);
    response.status(500).send("Internal Server Error");
  }
};
