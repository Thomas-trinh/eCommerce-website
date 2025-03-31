import sql from "../config/dbconfig.js";

export const getProductById = async (id) => {
  const result = await sql`SELECT * FROM products WHERE id = ${id};`;
  return result[0];
};

export const updateProductById = async (id, updatedProduct) => {
  const result = await sql`

        UPDATE products 
        SET 
          name = ${updatedProduct.name}, 
          description = ${updatedProduct.description}, 
          price = ${updatedProduct.price}, 
          image_url = ${updatedProduct.image_url}
        WHERE id = ${id};
      `;

  return result;
};

// Function to delete a product by ID
export const deleteProductById = async (id) => {
  // 'id' is an integer
  const result = await sql`
        DELETE FROM products WHERE id = ${id};
      `;
  return result;
};
