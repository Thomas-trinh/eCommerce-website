import sql from "../config/dbconfig.js";

export const getUserByUsername = async (username) => {
  const result = await sql`SELECT * FROM users WHERE username = ${username};`;
  if (result.length > 0) {
    return result[0];
  } else {
    return null;
  }
};

export const getUserByID = async (id) => {
  const result = await sql`SELECT * FROM users WHERE id = ${id};`;
  if (result.length > 0) {
    return result[0];
  } else {
    return null;
  }
};
