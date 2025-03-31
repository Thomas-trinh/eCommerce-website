import { getProductById } from '../db/details_db.js';
import { getAllCommentsAndRatings, addCommentAndRating } from '../db/ratings_db.js';

// Show product details for rating
export const getRating = async (req, res) => {
  const { id } = req.params; // Get productId from the request URL
  const details = await getProductById(id);

  if (details) {
    res.render("rateProduct.ejs", {
      product: details,
      id: id
    });
  } else {
    res.status(404).send("Product not found");
  }

};

// Create a new review                                                 
export const createReview = async (req, res) => {
  try {
    const { id } = req.params;  // Get productId from the request URL
    const { reviewText, rating } = req.body; // Extract review details from the request body

    await addCommentAndRating(id, reviewText, rating);// Add the comment and rating to the database

    res.redirect(`/products/${id}`); // Redirect to the product page
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).send('Server error');
  }
};

// Show all comments and ratings for a product
export const showAllCommentsAndRatings = async (req, res) => {
  try {
    const { id } = req.params; // Get productId from the request URL
    const commentsAndRatings = await getAllCommentsAndRatings(id);

    // Render the view with the comments and ratings
    res.render('productPageInfo.ejs', { id: id, comments: commentsAndRatings });
  } catch (error) {
    console.error(`Failed to render all comments and ratings: ${error}`);
    res.status(500).send('Server Error');
  }
};
