import sql from "../config/dbconfig";
import { User } from "../interfaces/models/User";

// Get user by username
export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  const result = await sql<User[]>`
    SELECT * FROM users WHERE username = ${username};
  `;
  return result[0] ?? null;
};

// Get user by ID
export const getUserByID = async (id: number): Promise<User | null> => {
  const result = await sql<User[]>`
    SELECT * FROM users WHERE id = ${id};
  `;
  return result[0] ?? null;
};
