-- Create products table
CREATE TABLE IF NOT EXISTS products (
"id" SERIAL PRIMARY KEY,
"name" varchar NOT NULL,
"price" numeric NOT NULL,
-- "rating" numeric,
-- "reviews" text,
"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
"image_url" varchar,
"description" text,
"category" varchar,
"quantity" INTEGER
);

-- Create comments table 
CREATE TABLE IF NOT EXISTS comments (
    commentID SERIAL PRIMARY KEY,  -- Auto-incrementing integer for unique comment ID
    id INTEGER NOT NULL,    -- Foreign key to the products table
    commentText TEXT NOT NULL,            -- Comment text
    CONSTRAINT fk_product 
        FOREIGN KEY (id) 
        REFERENCES products(id)  -- Assuming a 'products' table exists
        ON DELETE CASCADE
);

-- Create ratings table 
CREATE TABLE IF NOT EXISTS ratings (
    ratingID SERIAL PRIMARY KEY,    -- Auto-incrementing integer for unique rating ID
    id INTEGER NOT NULL,     -- Foreign key to the products table
    commentID INTEGER NOT NULL,     -- Foreign key to the comments table
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Rating between 1 and 5
    timeDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the rating is submitted
    CONSTRAINT fk_product_ratings 
        FOREIGN KEY (id) 
        REFERENCES products(id)   -- Reference to products table
        ON DELETE CASCADE,
    CONSTRAINT fk_comment 
        FOREIGN KEY (commentID) 
        REFERENCES comments(commentID)  -- Reference to comments table
        ON DELETE CASCADE
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
    imageID SERIAL PRIMARY KEY,      -- Unique image ID
    product_id INTEGER NOT NULL,     -- Foreign key to the products table
    image_url VARCHAR NOT NULL,      -- Image URL
    alt_text VARCHAR,                -- Optional alt text for accessibility/SEO
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_image
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);
