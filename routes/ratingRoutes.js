import express from "express";
import { getRating, showAllCommentsAndRatings, createReview } from "../controllers/ratingController.js";    // Importing the controller functions

const router = express.Router();  // Creating a router object

router.get('/:id', getRating);

router.post('/:id/review', createReview); // Route to handle review submission

router.get('/products/:id/all-comment-rating', showAllCommentsAndRatings); // Route - show all comments and ratings

export const ratingRoutes = router;  // Exporting the router object
