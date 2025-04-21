import sql from "../config/dbconfig";

// Define a type for cart item structure
export interface CartData {
  user_id: number;
  items: string; // JSON string of cart items
}

// Get cart data for a specific user
export const getCartDataByUserId = async (id: number): Promise<CartData | undefined> => {
  const result = await sql<CartData[]>`SELECT * FROM cart WHERE user_id = ${id};`;
  return result[0];
};

// Create a new user entry in the cart table
export const createUserInCartTable = async (id: number, items: string): Promise<void> => {
  await sql`INSERT INTO cart (user_id, items) VALUES (${id}, ${items});`;
};

// Update cart items for a user
export const updateCartItems = async (userId: number, cartItems: string): Promise<void> => {
  await sql`UPDATE cart SET items = ${cartItems} WHERE user_id = ${userId};`;
};
