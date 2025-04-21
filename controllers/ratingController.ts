import { Request, Response } from "express";
import { getProductById } from '../db/details_db';
import { getAllCommentsAndRatings, addCommentAndRating } from '../db/ratings_db';

// Show the rating form for a specific product
export const getRating = async (request: Request, response: Response): Promise<void> => {
  const id = Number(request.params.id);

  try {
    // if (isNaN(id)) {
    //   response.status(400).send("Invalid product ID");
    // }

    const product = await getProductById(id);

    if (product) {
      response.render("rateProduct.ejs", {
        product,
        id
      });
    } else {
      response.status(404).send("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product for rating:", error);
    response.status(500).send("Server error");
  }
};

// Create a new review
export const createReview = async (request: Request, response: Response): Promise<void> => {
  const id = Number(request.params.id);

  try {
    // if (isNaN(id)) {
    //   response.status(400).send("Invalid product ID");
    // }

    const { reviewText, rating } = request.body;

    // Optionally validate rating is a number
    await addCommentAndRating(id, reviewText, Number(rating));
    response.redirect(`/products/${id}`);
  } catch (error) {
    console.error("Error creating review:", error);
    response.status(500).send("Server error");
  }
};

// Display all comments and ratings for a product
export const showAllCommentsAndRatings = async (request: Request, response: Response): Promise<void> => {
  const id = Number(request.params.id);

  try {
    // if (isNaN(id)) {
    //   response.status(400).send("Invalid product ID");
    // }

    const comments = await getAllCommentsAndRatings(id);

    response.render("productPageInfo.ejs", {
      id,
      comments
    });
  } catch (error) {
    console.error("Failed to load comments and ratings:", error);
    response.status(500).send("Server error");
  }
};
