import { Request, Response } from "express";
import { getProductById } from '../db/details_db';
import { getAllCommentsAndRatings, addCommentAndRating } from '../db/ratings_db';

// Show the rating form for a specific product
export const getRating = async (request: Request, response: Response): Promise<void> => {
  const id = Number(request.params.id);

  try {
    const product = await getProductById(id);
    const token = request.cookies.token;

    if (product) {
      // response.render("rateProduct.ejs", {
      //   product,
      //   id,
      //   loggedIn: Boolean(token)
      // });
      response.json({
        product,
        id,
        loggedIn: Boolean(token)
      })
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
  const token = request.cookies.token;

  if(!token){
    response.status(401).json({ message: "Unauthorised"});
    return;
  }

  try {
    const { reviewText, rating } = request.body;
    await addCommentAndRating(id, reviewText, Number(rating));
    // response.redirect(`/products/${id}`);

    response.status(201).json({ message: "Review added successfully"});
  } catch (error) {
    console.error("Error creating review:", error);
    response.status(500).send("Server error");
  }
};

// Display all comments and ratings for a product
export const showAllCommentsAndRatings = async (request: Request, response: Response): Promise<void> => {
  const id = Number(request.params.id);

  try {
    const comments = await getAllCommentsAndRatings(id);

    // response.render("productPageInfo.ejs", {
    //   id,
    //   comments
    // });
    response.json(comments);
  } catch (error) {
    console.error("Failed to load comments and ratings:", error);
    response.status(500).send("Server error");
  }
};
