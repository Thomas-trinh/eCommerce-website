import { test, suite, after } from 'node:test';
import assert from 'assert';
import { getCheckoutPage } from '../controllers/checkoutController.js';
import { createUserInCartTable, getCartDataByUserId, updateCartItems } from '../db/cart_db.js';
import sql from "../config/dbconfig.js";

suite('Checkout Controller Tests', () => {
  
  test('getCheckoutPage should render the checkout page with cart items', async () => {
    // Create mock implementations
    const mockGetCartDataByUserId = async (userId) => ({
      user_id: userId,
      items: JSON.stringify([{ id: 1, name: 'Camera - alpha', price: 24.99 }]),
    });

    const mockUpdateCartItems = async (userId, items) => {};

    // Mock request and response objects
    const req = {
      loggedInUser: { id: 1 },
    };

    const res = {
      render: (view, data) => {
        assert.equal(view, 'checkout.ejs');
        assert.deepEqual(data.products, [{ id: 1, name: 'Camera - alpha', price: 24.99 }]);
      },
      status: () => res,
      send: () => {},
    };

    // Call the function with mock dependencies
    await getCheckoutPage(req, res, mockGetCartDataByUserId, mockUpdateCartItems);
  });

  test('getCheckoutPage should return 401 if there is an error', async () => {
    // Mock getCartDataByUserId to throw an error
    const mockGetCartDataByUserId = async () => {
      throw new Error('DB Error');
    };

    const mockUpdateCartItems = async (userId, items) => {};

    // Mock request and response objects
    const req = {
      loggedInUser: { id: 1 },
    };

    const res = {
      status: (code) => {
        assert.equal(code, 401);
        return res;
      },
      send: (message) => {
        assert.equal(message, 'Unauthorised access');
      },
    };

    // Call the function with mock dependencies
    await getCheckoutPage(req, res, mockGetCartDataByUserId, mockUpdateCartItems);
  });
  test("createUserInCartTable should create a new cart for a user", async () => {
    const result = await createUserInCartTable(1, "[]");
    assert.ok(result);

  });

  test("getCartDataByUserId should return the cart data for a user", async () => {
    const result = await getCartDataByUserId(1);
    assert.ok(result.hasOwnProperty("user_id"));
  });

  test("updateCartItems should update the cart items for a user", async () => {
    const result = await updateCartItems(1, "[]");
    assert.ok(result.count > 0);

  });
  after(async () => await sql.end());
});