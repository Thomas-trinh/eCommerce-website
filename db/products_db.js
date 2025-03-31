import sql from "../config/dbconfig.js";

export const getAllProducts = async () => {
  const result = await sql`SELECT * from products;`;
  return result;
};

export const getFilteredProducts = async (filter, keyword, category) => {
  let result = [];

  if (filter === "latest") result = await sql`SELECT * from products ORDER BY created_at;`;
  if (filter === "oldest") result = await sql`SELECT * from products ORDER BY created_at DESC;`;
  if (filter === "low_price") result = await sql`SELECT * from products ORDER BY price;`;
  if (filter === "high_price") result = await sql`SELECT * from products ORDER BY price DESC;`;
  if (filter === "rating") result = await sql`SELECT * from products ORDER BY rating DESC;`;

  if (keyword && category === "all") {
    const filteredResult = result.filter((item) => item.name.toLowerCase().includes(keyword));
    if (filteredResult.length !== 0) return filteredResult;
  }
  if (keyword && category !== "all") {
    const filteredResult = result.filter((item) => item.name.toLowerCase().includes(keyword) && item.category === category);
    if (filteredResult.length !== 0) return filteredResult;
  }

  return result;
};

export const getSearchedProducts = async (name) => {
  const result = await sql`SELECT * from products WHERE name ILIKE ${'%' + name + '%'};`;
  return result;
};

export const getSearchedProductsWithCategory = async (name, category) => {
  const result = await sql`SELECT * from products WHERE name ILIKE ${'%' + name + '%'} AND category ILIKE ${'%' + category + '%'};`;
  return result;
};
