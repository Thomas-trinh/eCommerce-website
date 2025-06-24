import { body } from "express-validator";

// Sanitization & Injection Protection
export const searchValidation = () => [
  // Disallow HTML tags in 'keyword'
  body("keyword")
    .custom((value) => !/<\/?[^>]+(>|$)/.test(value))
    .withMessage("HTML tags are not allowed"),
 
  // Disallow SQL keywords in 'inputField'
  body("inputField")
    .custom((value) =>
      !/\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|EXEC|UNION|TABLE|FROM|WHERE)\b/i.test(
        value
      )
    )
    .withMessage("Invalid"),
];
