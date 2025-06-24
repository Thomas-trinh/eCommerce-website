// repositories/ProductRepository.ts
import sql from "../config/dbconfig";
import { IProductRepository } from "../interfaces/IProductRepository";
import { Product } from "../interfaces/models/Product";

export class ProductRepository implements IProductRepository {
  getById(productId: number) {
    throw new Error("Method not implemented.");
  }
  getImagesByProductId(productId: number) {
    throw new Error("Method not implemented.");
  }
  //For ejs
  async getAll(): Promise<Product[]> {
    return await sql<Product[]>`SELECT * FROM products`;
  }

  async getBySearch(keyword: string): Promise<Product[]> {
    return await sql<Product[]>`
      SELECT * FROM products WHERE name ILIKE ${'%' + keyword + '%'}
    `;
  }

  async getByCategory(category: string): Promise<Product[]> {
    return await sql<Product[]>`
      SELECT * FROM products
      WHERE LOWER(category) = LOWER(${category})
    `;
  }

  async getBySearchAndCategory(keyword: string, category: string): Promise<Product[]> {
    return await sql<Product[]>`
      SELECT * FROM products
      WHERE name ILIKE ${'%' + keyword + '%'}
      AND category ILIKE ${'%' + category + '%'}
    `;
  }

  async getByFilter(filter: string): Promise<Product[]> {
    const map = {
      latest: "created_at DESC",
      oldest: "created_at ASC",
      low_price: "price ASC",
      high_price: "price DESC",
      rating: "rating DESC",
    };
  
    const orderClause = map[filter as keyof typeof map] || "created_at DESC";
  
    return await sql<Product[]>`
      SELECT * FROM products ORDER BY ${sql.unsafe(orderClause)};
    `;
  }  
}
