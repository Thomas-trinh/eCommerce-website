import sql from "../config/dbconfig.js";

// Function to add comment and rating to the database
export const addCommentAndRating = async (id, commentText, rating) => {
  try {
    // Insert comment into the comments table
    const commentResult = await sql`
      INSERT INTO comments (id, commentText)
      VALUES (${id}, ${commentText})
      RETURNING commentID;
    `;
    const commentID = commentResult[0].commentid;


    // Insert rating into the ratings table (if provided)
    if (rating) {
      await sql`
        INSERT INTO ratings (id, commentID, rating, timeDate)
        VALUES (${id}, ${commentID}, ${rating}, NOW());
      `;
    }
  } catch (error) {
    console.error('Error saving comment and rating:', error);
    return error;
  }
};


// Fetch all comments and their associated ratings
export const getAllCommentsAndRatings = async (id) => {
  const result = await sql`
      SELECT c.commentID, c.commentText, r.rating, r.timeDate
      FROM comments c
      LEFT JOIN ratings r ON c.id = r.id
      WHERE c.id = ${id}
      ORDER BY r.timeDate DESC;
    `;
  if (result.length > 0) {
    return result;
  } else {
    return 'No comments or ratings found.';
  }

};