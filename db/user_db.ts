import sql from "../config/dbconfig";

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

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
