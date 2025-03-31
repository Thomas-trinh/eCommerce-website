import { body } from "express-validator";

export const searchValidation = () => [
  body("keyword")
    .matches(/<\/?[^>]+(>|$)/)
    .withMessage("HTML tags are not allowed")
    .not(),
  // Validation to disallow common SQL keywords
  body("inputField")
    .matches(
      /\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|EXEC|UNION|TABLE|FROM|WHERE)\b/i
    )
    .withMessage("Invalid")
    .not(),
];
