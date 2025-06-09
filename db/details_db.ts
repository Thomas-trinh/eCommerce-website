import sql from "../config/dbconfig";
import { Product, ProductImage, ProductImageInput } from "../interfaces/models/Product";

// Get product by ID
export const getProductById = async (id: number): Promise<Product | undefined> => {
  const result = await sql<Product[]>`
    SELECT * FROM products WHERE id = ${id};
  `;

  const product = result[0];
  if (!product) return undefined;

  // Get associated product images
  const imagesResult = await sql<ProductImage[]>`
    SELECT image_url, alt_text
    FROM product_images
    WHERE product_id = ${id}
    ORDER BY imageID ASC
  `;
  product.images = imagesResult;

  // Calculate average rating from reviews
  const ratingResult = await sql`
    SELECT AVG(rating) AS average_rating
    FROM ratings
    WHERE id = ${id};
  `;
  const avg = ratingResult[0]?.average_rating;

  // Inject into product (if your Product interface doesn't have it, add `average_rating?: number`)
  product.average_rating = avg ? parseFloat(avg).toFixed(1) : "0.0";

  return product;
};


// Update product by ID
type UpdateProductInput = Pick<Product, "name" | "description" | "price" | "quantity">;

export const updateProductById = async (
  id: number,
  updatedProduct: UpdateProductInput
): Promise<void> => {
  await sql`
    UPDATE products 
    SET 
      name = ${updatedProduct.name}, 
      description = ${updatedProduct.description}, 
      price = ${updatedProduct.price}, 
      quantity = ${updatedProduct.quantity},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id};
  `;
};


// Delete product by ID
export const deleteProductById = async (id: number): Promise<void> => {
  await sql`
    DELETE FROM products WHERE id = ${id};
  `;
};

// Used to deduct the product quantity after user purchase
export const updateProductQuantity = async (id: number, quantity: number): Promise<void> => {
  await sql`
  UPDATE products
  SET quantity = quantity - ${quantity},
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ${id}
`;
}

export const getProductImagesById = async (id: number): Promise<ProductImage[]> => {
  const result = await sql<ProductImage[]>`
    SELECT image_url, alt_text
    FROM product_images
    WHERE product_id = ${id}
    ORDER BY imageID ASC
  `;
  return result;
};

export const updateProductImages = async (
  productId: number,
  newImages: ProductImageInput[]
): Promise<void> => {
  // Delete old images
  await sql`DELETE FROM product_images WHERE product_id = ${productId}`;

  // Insert new ones
  for (const img of newImages) {
    await sql`
      INSERT INTO product_images (product_id, image_url, alt_text)
      VALUES (${productId}, ${img.image_url}, ${img.alt_text || null})
    `;
  }
};