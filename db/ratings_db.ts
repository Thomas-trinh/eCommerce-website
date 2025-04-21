import sql from "../config/dbconfig";

// Provided interface for rating entries
export interface Rating {
  ratingid: number;
  id: number;
  commentid: number;
  rating: number;
  timedate: Date;
}

// New interface for joined comment + rating result
export interface CommentWithRating {
  commentid: number;
  commenttext: string;
  rating: number | null;
  timedate: Date | null;
}

// Add comment and optional rating
export const addCommentAndRating = async (
  id: number,
  commentText: string,
  rating?: number
): Promise<void | Error> => {
  try {
    // Insert into comments table
    const commentResult = await sql<{ commentid: number }[]>`
      INSERT INTO comments (id, commenttext)
      VALUES (${id}, ${commentText})
      RETURNING commentid;
    `;

    const commentid = commentResult[0]?.commentid;

    if (!commentid) {
      throw new Error("Failed to retrieve comment ID.");
    }

    // If rating is provided, insert it
    if (rating !== undefined) {
      await sql`
        INSERT INTO ratings (id, commentid, rating, timedate)
        VALUES (${id}, ${commentid}, ${rating}, NOW());
      `;
    }
  } catch (error) {
    console.error("Error saving comment and rating:", error);
  }
};

// Fetch all comments and ratings by ID
export const getAllCommentsAndRatings = async (
  id: number
): Promise<CommentWithRating[] | string> => {
  const result = await sql<CommentWithRating[]>`
    SELECT 
      c.commentid, 
      c.commenttext, 
      r.rating, 
      r.timedate
    FROM comments c
    LEFT JOIN ratings r ON c.commentid = r.commentid
    WHERE c.id = ${id}
    ORDER BY r.timedate DESC;
  `;

  return result.length > 0 ? result : "No comments or ratings found.";
};
