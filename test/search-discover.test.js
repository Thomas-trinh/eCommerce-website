import { test, after, describe, before } from 'node:test';
import assert from 'assert';
import { showAllProducts, showSearchedProducts } from '../controllers/productController'; 
import { showFilteredProducts } from '../controllers/productController';
import sql from '../config/dbconfig';
import { getAllProducts, getFilteredProducts, getSearchedProducts, getSearchedProductsWithCategory } from '../db/products_db';


// Function testing
describe("Positive test data handling function", () => {
    test("Get all products from database", async () => {
        const result = await getAllProducts();
        assert.ok(result.length > 0);
    });

    test("Get latest products from database", async () => {
        const filter = "latest";
        const keyword = "camera";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get latest products from database", async () => {
        const filter = "latest";
        const keyword = "T shirt";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get latest products from database", async () => {
        const filter = "latest";
        const keyword = "coca";
        const category = "drink";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get oldest products from database", async () => {
        const filter = "oldest";
        const keyword = "";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get oldest products from database", async () => {
        const filter = "oldest";
        const keyword = "camera";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });
    test("Get oldest products from database", async () => {
        const filter = "oldest";
        const keyword = "t";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get low price products from database", async () => {
        const filter = "low_price";
        const keyword = "camera";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get low price products from database", async () => {
        const filter = "low_price";
        const keyword = "";
        const category = "drink";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get low price products from database", async () => {
        const filter = "low_price";
        const keyword = "sho";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get high price products from database", async () => {
        const filter = "high_price";
        const keyword = "camera";
        const category = "electronics";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get high price products from database", async () => {
        const filter = "high_price";
        const keyword = "c";
        const category = "electronics";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get high price products from database", async () => {
        const filter = "high_price";
        const keyword = "sho";
        const category = "cloth";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });
    
    test("Get rating products from database", async () => {
        const filter = "rating";
        const keyword = "camera";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });
    
    
    test("Get rating products from database", async () => {
        const filter = "rating";
        const keyword = "";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get rating products from database", async () => {
        const filter = "rating";
        const keyword = "";
        const category = "Electronics";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get rating products from database", async () => {
        const filter = "rating";
        const keyword = "t";
        const category = "cloth";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get Searched products from database", async () => {
        const keyword = 'T';
        const result = await getSearchedProducts(keyword);
        assert.ok(result.length > 0);
    });
    
    test("Get Searched products from database", async () => {
        const keyword = 'C';
        const result = await getSearchedProducts(keyword);
        assert.ok(result.length > 0);
    });

    test("Get Searched products with category from database", async () => {
        const keyword = 'c';
        const category = "Electronics";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length > 0);
    });

    test("Get Searched products from database", async () => {
        const keyword = 'T';
        const result = await getSearchedProducts(keyword);
        assert.ok(result.length > 0);
    });
    
    test("Get Searched products from database", async () => {
        const keyword = 'C';
        const result = await getSearchedProducts(keyword);
        assert.ok(result.length > 0);
    });

    test("Get Searched products with category from database", async () => {
        const keyword = 'c';
        const category = "Electronics";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length > 0);
    });
    
});


describe("Netagive test of data handling function", () => {
    test("Fail to get all products from database", async () => {
        const result = await getAllProducts();
        assert.ok(result.length > 0);
    });

    test("Fail to get filtered products from database", async () => {
        const filter = "invalid filter";
        const keyword = "invalid keyword";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'Z';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'c';
        const category = "]nvalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get all products from database", async () => {
        const result = await getAllProducts();
        assert.ok(result.length > 0);
    });

    test("Fail to get filtered products from database", async () => {
        const filter = "invalid filter";
        const keyword = "invalid keyword";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'Z';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'c';
        const category = "]nvalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get all products from database", async () => {
        const result = await getAllProducts();
        assert.ok(result.length > 0);
    });

    test("Fail to get filtered products from database", async () => {
        const filter = "invalid filter";
        const keyword = "invalid keyword";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'Z';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'c';
        const category = "]nvalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get all products from database", async () => {
        const result = await getAllProducts();
        assert.ok(result.length > 0);
    });

    test("Fail to get filtered products from database", async () => {
        const filter = "invalid filter";
        const keyword = "invalid keyword";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'Z';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'c';
        const category = "]nvalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get all products from database", async () => {
        const result = await getAllProducts();
        assert.ok(result.length > 0);
    });

    test("Fail to get filtered products from database", async () => {
        const filter = "invalid filter";
        const keyword = "invalid keyword";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'Z';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'c';
        const category = "invalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get all products from database", async () => {
        const result = await getAllProducts();
        assert.ok(result.length > 0);
    });

    test("Fail to get filtered products from database", async () => {
        const filter = "invalid filter";
        const keyword = "invalid keyword";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'Z';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'c';
        const category = "]nvalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get all products from database", async () => {
        const result = await getAllProducts();
        assert.ok(result.length > 0);
    });

    test("Fail to get filtered products from database", async () => {
        const filter = "invalid filter";
        const keyword = "invalid keyword";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'Y';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'P';
        const category = "]nvalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get all products from database", async () => {
        const result = await getAllProducts();
        assert.ok(result.length > 0);
    });

    test("Fail to get filtered products from database", async () => {
        const filter = "invalid filter";
        const keyword = "invalid keyword";
        const category = "all";

        const result = await getFilteredProducts(filter, keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = '&*&';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = '@#';
        const category = "]nvalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '<>';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'Z';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'Qx';
        const category = "]nvalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });
    test("Fail to get searched products from database", async () => {
        const keyword = 'Z';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = '>jt';
        const category = "invalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = 'asdf';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = 'SELECT * FROM users';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });
    test("Fail to get searched products from database", async () => {
        const keyword = ')(';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = '^&';
        const category = "invalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = 'asdf';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = ' (@#';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });
    test("Fail to get searched products from database", async () => {
        const keyword = '<html></html>';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = ';;';
        const category = "invalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = 'wer';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });
    test("Fail to get searched products from database", async () => {
        const keyword = 'awef';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'c';
        const category = "invalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = 'asdf123';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });
    test("Fail to get searched products from database", async () => {
        const keyword = 'x';

        const result = await getSearchedProducts(keyword);
        assert.ok(result.length == 0);
    });

    test("Fail to get searched products from database", async () => {
        const keyword = 'd';
        const category = "invalid";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });

    test("Fail to get Searched products from database", async () => {
        const keyword = '/*(//';
        const category = "invalid category";

        const result = await getSearchedProductsWithCategory(keyword, category);
        assert.ok(result.length == 0);
    });
    
});

// Controller testing
describe("Test render function", () => {
    let products;


    before(async () => {
        products = await getAllProducts(); 
    });

    test('Render page with products', async () => {
        const req = {};
        const res = {
            render: (view, data) => {
                assert.equal(view, 'products.ejs');
                assert.deepEqual(data, {
                    products,
                    result: true,
                    filter: 'Sort',
                    keyword: '',
                    category: 'all'
                });
            },
            status: function() { return this; },
            send: () => {}
        };
    
        await showAllProducts(req, res);
    });

    test('Handle error while fetching products', async () => {
        const req = {};
        const res = {
            status: function(code) {
                assert.equal(code, 500);
                return this;
            },
            send: (message) => {
                assert.equal(message, "Internal Server Error");
            }
        };

        await showAllProducts(req, res);
    });

    test('Render page with filtered products', async () => {
        const filter = "latest";
        const keyword = "camera";
        const category = "all";

        const req = { body: { filter, keyword, category } };
        const products = await getFilteredProducts(filter, keyword, category);
        const res = {
            render: (view, data) => {
                assert.equal(view, 'products.ejs');
                assert.deepEqual(data, {
                    products,
                    result: true,
                    filter,
                    keyword,
                    category
                });
            },
            status: function () { return this },
            send: () => {}
        };

        await showFilteredProducts(req, res);
    });

    test('Render page without filtered products', async () => {
        const filter = "invalid";
        const keyword = "invalid";
        const category = "invalid";

        const req = { body: { filter, keyword, category } };
        const products = await getFilteredProducts(filter, keyword, category);
        const res = {
            render: (view, data) => {
                assert.equal(view, 'products.ejs');
                assert.deepEqual(data, {
                    products,
                    result: true,
                    filter,
                    keyword,
                    category
                });
            },
            status: function () { return this },
            send: () => {}
        };

        await showFilteredProducts(req, res);
    });

    test('Render page with searched products with category', async () => {
        const keyword = 'Camera';
        const category = 'Electronics';
    
        const products = await getSearchedProducts(keyword);
        const req = { body: { keyword, category } };
        const res = {
            render: (view, data) => {
                assert.equal(view, 'products.ejs');
                assert.deepEqual(data, {
                    products,
                    result: true,
                    filter: 'Sort',
                    keyword,
                    category
                });
            },
            status: () => res,
            send: () => {}
        };
    
        await showSearchedProducts(req, res);
    });

    test('Render page without searched products with category', async () => {
        const keyword = 'invalid';
        const category = 'invalid';
    
        const products = await getSearchedProducts(keyword);
        const req = { body: { keyword, category } };
        const res = {
            render: (view, data) => {
                assert.equal(view, 'products.ejs');
                assert.deepEqual(data, {
                    products,
                    result: true,
                    filter: 'Sort',
                    keyword,
                    category
                });
            },
            status: () => res,
            send: () => {}
        };
    
        await showSearchedProducts(req, res);
    });

});


after(async () => await sql.end());