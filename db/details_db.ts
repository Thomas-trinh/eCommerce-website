import sql from "../config/dbconfig";
import { Product } from "../interfaces/models/Product";

// Get product by ID
export const getProductById = async (id: number): Promise<Product | undefined> => {
  const result = await sql<Product[]>`
    SELECT * FROM products WHERE id = ${id};
  `;
  return result[0];
};

// Update product by ID
type UpdateProductInput = Pick<Product, "name" | "description" | "price" | "image_url">;

export const updateProductById = async (id: number, updatedProduct: UpdateProductInput): Promise<void> => {
  await sql`
    UPDATE products 
    SET 
      name = ${updatedProduct.name}, 
      description = ${updatedProduct.description}, 
      price = ${updatedProduct.price}, 
      image_url = ${updatedProduct.image_url}
    WHERE id = ${id};
  `;
};

// Delete product by ID
export const deleteProductById = async (id: number): Promise<void> => {
  await sql`
    DELETE FROM products WHERE id = ${id};
  `;
};
