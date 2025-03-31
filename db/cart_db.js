import sql from "../config/dbconfig.js";

export const getCartDataByUserId = async (id) => {
    const result = await sql`SELECT * from cart WHERE user_id = ${id};`;
    return result[0];
  }
  
  export const createUserInCartTable = async (id, items) => {
    const result = await sql`INSERT INTO cart (user_id, items) VALUES (${id}, ${items});`;
    return result;
  }

  export const updateCartItems = async (userId, cartItems) => {
    const result = await sql`UPDATE cart SET items = ${cartItems} WHERE user_id = ${userId};`;
    return result;
  }