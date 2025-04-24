// controllers/ProductController.ts
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { IProductService } from "../interfaces/IProductService";

export class ProductController {
  constructor(private readonly service: IProductService) { }

  showAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.service.getAll();
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

  filter = async (req: Request, res: Response): Promise<void> => {
    try {
      const { filter = "Sort", keyword = "", category = "all" } = req.body;
      const filterValue = filter.toLowerCase().replace(" ", "_");

      let products = await this.service.filterProducts(filterValue, keyword, category);

      const resultStatus = products.length > 0;

      if (!resultStatus) {
        products = await this.service.getAll();
      }

      res.render("products.ejs", {
        products,
        result: resultStatus,
        filter,
        keyword,
        category,
      });
    } catch (error) {
      console.error("Error filtering products:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  search = async (req: Request, res: Response): Promise<void> => {
    const result = validationResult(req);
  
    if (!result.isEmpty()) {
      console.log("Validation failed:", result.array());
      return res.redirect("/products");
    }
  
    try {
      const { keyword = "", category = "all" } = req.body;
  
      let products = await this.service.search(keyword, category);
      const resultStatus = products.length > 0;
  
      if (!resultStatus) {
        products = await this.service.getAll();
      }
  
      res.render("products.ejs", {
        products,
        result: resultStatus,
        filter: "Sort",
        keyword,
        category,
      });
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).send("Internal Server Error");
    }
  };  
}
