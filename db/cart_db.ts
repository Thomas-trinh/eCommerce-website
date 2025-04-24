import sql from "../config/dbconfig";
import { CartData } from "../interfaces/models/Cart";

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
