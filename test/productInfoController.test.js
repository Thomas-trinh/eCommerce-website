import { test, after } from 'node:test';
import assert from 'assert';
import { showProductDetails } from '../controllers/ProductInfo.js'; 
import sql from '../config/dbconfig.js';

test('Product is found', async () => {
    const req = { params: { id: '1' } };
    const res = {
        render: (view, data) => {
            assert.equal(view, 'productPageInfo.ejs');
            assert.equal(data, { product: { id: '1', name: 'Camera - alpha', price: '24.99' } });
        },
        status: () => res,
        send: () => {}
    };

    await showProductDetails(req, res);
});

test('Return 404 if product is not found', async () => {
    const req = { params: { id: '999' } };
    const res = {
        render: () => {},
        status: function(code) {
            assert.equal(code, 404);
            return this;
        },
        send: function(message) {
            assert.equal(message, 'Product not found');
        }
    };

    await showProductDetails(req, res);
});

after(() => sql.close());
