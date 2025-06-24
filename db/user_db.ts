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

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await sql<User[]>`
    SELECT * FROM users WHERE email = ${email};
  `;
  return result[0] ?? null;
};

// Create user (without password, for OAuth sign-in)
export const createUser = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}): Promise<User> => {
  const result = await sql<User[]>`
    INSERT INTO users (username, email)
    VALUES (${username}, ${email})
    RETURNING *;
  `;
  return result[0];
};
