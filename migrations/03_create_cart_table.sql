CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,  -- Auto-incrementing integer for unique comment ID
    user_id INTEGER NOT NULL,    -- Foreign key to the products table
    items TEXT NOT NULL,            -- Comment text
    CONSTRAINT fk_product 
        FOREIGN KEY (user_id) 
        REFERENCES users(id)  -- Assuming a 'products' table exists
        ON DELETE CASCADE
);