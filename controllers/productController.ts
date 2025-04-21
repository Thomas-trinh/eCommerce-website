import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  getAllProducts,
  getFilteredProducts,
  getSearchedProducts,
  getSearchedProductsWithCategory,
} from "../db/products_db"; // or .ts if already converted

// Interface for form input fields
interface ProductSearchBody {
  filter?: string;
  keyword?: string;
  category?: string;
}

// Show all products
export const showAllProducts = async (request: Request, response: Response): Promise<void> => {
  try {
    const products = await getAllProducts();
    response.render("products.ejs", {
      products,
      result: true,
      filter: "Sort",
      keyword: "",
      category: "all",
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    response.status(500).send("Internal Server Error");
  }
};

// Show filtered products
export const showFilteredProducts = async (request: Request<{}, {}, ProductSearchBody>, response: Response): Promise<void> => {
  try {
    const { filter = "Sort", keyword = "", category = "all" } = request.body;
    const filterValue = filter.toLowerCase().replace(" ", "_");
    
    let products = await getFilteredProducts(filterValue, keyword, category);

    const resultStatus = products.length > 0;

    if (!resultStatus) {
      products = await getAllProducts();
    }

    response.render("products.ejs", {
      products,
      result: resultStatus,
      filter,
      keyword,
      category,
    });
  } catch (error) {
    console.error("Error filtering products:", error);
    response.status(500).send("Internal Server Error");
  }
};

// Show searched products
export const showSearchedProducts = async (request: Request<{}, {}, ProductSearchBody>, response: Response): Promise<void> => {
  const result = validationResult(request);

  if (!result.isEmpty()) {
    console.log("Validation failed:", result.array());
    return response.redirect("/products");
  }

  try {
    const { keyword = "", category = "all" } = request.body;

    let products = category === "all"
      ? await getSearchedProducts(keyword)
      : await getSearchedProductsWithCategory(keyword, category);

    const resultStatus = products.length > 0;

    if (!resultStatus) {
      products = await getAllProducts();
    }

    response.render("products.ejs", {
      products,
      result: resultStatus,
      filter: "Sort",
      keyword,
      category,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    response.status(500).send("Internal Server Error");
  }
};
