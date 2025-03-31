import { validationResult } from "express-validator";
import {
  getAllProducts,
  getFilteredProducts,
  getSearchedProducts,
  getSearchedProductsWithCategory,
} from "../db/products_db.js";

export const showAllProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.render("products.ejs", {
      products,
      result: true,
      filter: "Sort",
      keyword: "",
      category: "all",
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const showFilteredProducts = async (req, res) => {
  try {
    const { filter, keyword, category } = req.body;
    let products;
    const filterValue = filter.toLowerCase().replace(" ", "_");
    products = await getFilteredProducts(filterValue, keyword, category);

    if (products.length == 0) {
      products = await getAllProducts();
      res.render("products.ejs", {
        products,
        result: false,
        filter,
        keyword,
        category,
      });
    } else {
      res.render("products.ejs", {
        products,
        result: true,
        filter,
        keyword,
        category,
      });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const showSearchedProducts = async (req, res) => {
  const result = validationResult(req);
  console.log(result)
  if (!result.isEmpty()) {
    console.log("Error, invalid input");
    res.redirect("/products");
  }

  try {
    const { keyword, category } = req.body;
    let products;
    if (category === "all") products = await getSearchedProducts(keyword);
    else products = await getSearchedProductsWithCategory(keyword, category);

    if (products.length == 0) {
      products = await getAllProducts();
      res.render("products.ejs", {
        products,
        result: false,
        filter: "Sort",
        keyword,
        category,
      });
    } else {
      res.render("products.ejs", {
        products,
        result: true,
        filter: "Sort",
        keyword,
        category,
      });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};
