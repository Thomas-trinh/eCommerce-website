-- Sequence and defined type

INSERT INTO products ("name", "price", "image_url", "description", "category", "quantity") 
VALUES ('Camera - alpha', 24.99, 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1725956171/pexels-madebymath-90946_tlfavv.jpg', 'You will be addicted to this product like cocaine!', 'electronics', 10);

INSERT INTO products ("name", "price", "image_url", "description", "category", "quantity") 
VALUES ('Shoes - beta', 32.99, 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1665079442/samples/ecommerce/shoes.png', 'You will run faster than Bolt with this shoes.', 'cloth', 2);

INSERT INTO products ("name", "price", "image_url", "description", "category", "quantity") 
VALUES ('Coca-Cola - charlie', 149.99, 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1725956527/pexels-olenkabohovyk-3819969_jcqud7.jpg', 'You will be addicted to this product like cocaine!', 'drink', 100);

INSERT INTO products ("name", "price", "image_url", "description", "category", "quantity") 
VALUES ('T Shirt - delta', 25.99, 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1666076359/1129086_w7esum.png', 'You will be addicted to this product like cocaine!', 'cloth', 50);

INSERT INTO product_images (product_id, image_url)
SELECT id, image_url
FROM products
WHERE image_url IS NOT NULL;

