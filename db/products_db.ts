import sql from "../config/dbconfig";
import { Product } from "../interfaces/models/Product";

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  const result = await sql<Product[]>`SELECT * FROM products;`;
  return result;
};

// Get filtered products
export const getFilteredProducts = async (
  filter: string,
  keyword?: string,
  category?: string
): Promise<Product[]> => {
  let result: Product[] = [];

  switch (filter) {
    case "latest":
      result = await sql<Product[]>`SELECT * FROM products ORDER BY created_at DESC;`;
      break;
    case "oldest":
      result = await sql<Product[]>`SELECT * FROM products ORDER BY created_at ASC;`;
      break;
    case "low_price":
      result = await sql<Product[]>`SELECT * FROM products ORDER BY price ASC;`;
      break;
    case "high_price":
      result = await sql<Product[]>`SELECT * FROM products ORDER BY price DESC;`;
      break;
    case "rating":
      result = await sql<Product[]>`SELECT * FROM products ORDER BY rating DESC;`;
      break;
    default:
      result = await sql<Product[]>`SELECT * FROM products;`;
  }

  // Apply keyword filter
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    result = result.filter((item) =>
      item.name.toLowerCase().includes(lowerKeyword)
    );
  }

  // Apply category filter
  if (category && category !== "all") {
    result = result.filter((item) => item.category === category);
  }

  return result;
};

// Search by name
export const getSearchedProducts = async (name: string): Promise<Product[]> => {
  const result = await sql<Product[]>`
    SELECT * FROM products WHERE name ILIKE ${'%' + name + '%'};
  `;
  return result;
};

// Search by name and category
export const getSearchedProductsWithCategory = async (
  name: string,
  category: string
): Promise<Product[]> => {
  const result = await sql<Product[]>`
    SELECT * FROM products 
    WHERE name ILIKE ${'%' + name + '%'} 
    AND category ILIKE ${'%' + category + '%'};
  `;
  return result;
};
