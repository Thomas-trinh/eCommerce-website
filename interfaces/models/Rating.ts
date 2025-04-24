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
