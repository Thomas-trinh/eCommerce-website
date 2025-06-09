import { test, suite, after } from 'node:test';
import assert from 'assert';
import { getProductById, updateProductById, deleteProductById } from '../db/details_db';
import sql from '../config/dbconfig';

// Suite: Testing product information retrieval
suite('Product Information Tests', () => {
    test('should return product details for valid product ID 1', async () => {
        const result = await getProductById(1);
        assert.equal(result.id, 1);
        assert.equal(result.name, 'Camera - alpha');
        assert.equal(result.price, '24.99');
        assert.equal(result.category, 'electronics');
    });

    test('should return product details for valid product ID 2', async () => {
        const result = await getProductById(2);
        assert.equal(result.id, 2);
        assert.equal(result.name, 'Shoes - beta');
        assert.equal(result.price, '32.99');
        assert.equal(result.category, 'cloth');
    });

    test('should return product details for valid product ID 3', async () => {
        const result = await getProductById(3);
        assert.equal(result.id, 3);
        assert.equal(result.name, 'Coca-Cola - charlie');
        assert.equal(result.price, '149.99');
        assert.equal(result.category, 'drink');
    });

    test('should return null when no product is found for non-existent ID', async () => {
        const result = await getProductById(999);
        assert.equal(result, null);
    });
    
    after(() => sql.close()); // Close the SQL connection after tests
});

// Suite: Testing product updates
suite('Product Updating Tests', () => {
    test('should fail to connect to the database with invalid ID', async () => {
        try {
            await getProductById(0);
            assert.fail('Failed to connect to the DB');
        } catch (error) {
            assert.equal(error.message, 'Failed to connect to the DB');
        }
    });

    test('should update product details when ID equals to 1', async () => {
        // Mock updated product data
        const updatedProduct = {
            name: 'Camera - alpha',
            description: 'Camera - alpha',
            price: 24.99,
            image_url: 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1725956171/pexels-madebymath-90946_tlfavv.jpg'
        };

        // Run the updateProductById function
        await updateProductById(1, updatedProduct); // Assuming product with ID 1 exists

        // Fetch the updated product to verify
        const result = await getProductById(1);

        // Assert that the product was updated correctly
        assert.equal(result.id, 1);
        assert.equal(result.name, 'Camera - alpha');
        assert.equal(result.description, 'Camera - alpha');
        assert.equal(result.price, 24.99);
        assert.equal(result.image_url, 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1725956171/pexels-madebymath-90946_tlfavv.jpg');
    });

    test('should update product details when ID equals to 2', async () => {
        const updatedProduct = {
            name: 'Shoes - beta',
            description: 'You will run faster than Bolt with this shoes',
            price: 32.99,
            image_url: 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1665079442/samples/ecommerce/shoes.png'
        };

        await updateProductById(2, updatedProduct);

        const result = await getProductById(2);

        assert.equal(result.id, 2);
        assert.equal(result.name, 'Shoes - beta');
        assert.equal(result.description, 'You will run faster than Bolt with this shoes');
        assert.equal(result.price, 32.99);
        assert.equal(result.image_url, 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1665079442/samples/ecommerce/shoes.png');
    });

    test('should update product details when ID equals to 3', async () => {
        // Mock updated product data
        const updatedProduct = {
            name: 'Coca-Cola - charlie',
            description: 'You will be addicted to this product like cocaine!',
            price: 149.99,
            image_url: 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1725956527/pexels-olenkabohovyk-3819969_jcqud7.jpg'
        }
        await updateProductById(3, updatedProduct);

        const result = await getProductById(3);

        assert.equal(result.id, 3);
        assert.equal(result.name, 'Coca-Cola - charlie');
        assert.equal(result.description, 'You will be addicted to this product like cocaine!');
        assert.equal(result.price, 149.99);
        assert.equal(result.image_url, 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1725956527/pexels-olenkabohovyk-3819969_jcqud7.jpg');
    });

    test('should update product details when ID equals to 4', async () => {
        // Mock updated product data
        const updatedProduct = {
            name: 'T Shirt - delta',
            description: 'You will be addicted to this product like cocaine!',
            price: 25.99,
            image_url: 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1666076359/1129086_w7esum.png'
        }
        await updateProductById(4, updatedProduct);

        const result = await getProductById(4);

        assert.equal(result.id, 4);
        assert.equal(result.name, 'T Shirt - delta');
        assert.equal(result.description, 'You will be addicted to this product like cocaine!');
        assert.equal(result.price, 25.99);
        assert.equal(result.image_url, 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1666076359/1129086_w7esum.png');
    });

    test("deleteProductById should delete a product and return result", async () => {
        const record = await sql `SELECT * FROM products WHERE id = 4`;
        const newRecord = {
            id: record[0].id,
            name: record[0].name,
            description: record[0].description,
            price: record[0].price,
            image_url: record[0].image_url,
            category: record[0].category
        }
        
         const result = await deleteProductById(4);
         assert.ok(result);

            await sql `INSERT INTO products ${sql(newRecord)}`;
    });

    after(() => sql.close());
});
