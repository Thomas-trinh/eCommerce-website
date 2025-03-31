import { getProductById } from "../db/details_db.js"; // Updated to use getProductById

import { getAllCommentsAndRatings } from "../db/ratings_db.js"; // Updated to use getAllCommentsAndRatings

// Controller to fetch and show product details
export const showProductDetails = async (req, res) => {
    try {
        const token = req.cookies.token;
        const { id } = req.params;

        const details = await getProductById(id);
        const reviews = await getAllCommentsAndRatings(id);

        if (details && !token) {
            res.render("productPageInfo.ejs", {
                product: details,
                reviews,
                loggedIn: false
            });
        } else {
            res.render("productPageInfo.ejs", {
                product: details,
                reviews,
                loggedIn: true
            });
        }
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).send("Internal Server Error");
    }
};
