import { test, after, suite } from "node:test";
import assert from "assert";

import {
  getCart,
  addItemToCart,
  removeCartItem,
  getItemsNumberInCart,
} from "../controllers/shoppingCartController";
import {
  createUserInCartTable,
  getCartDataByUserId,
  updateCartItems,
} from "../db/cart_db";
import sql from "../config/dbconfig";
import { getUserByUsername, getUserByID } from "../db/user_db";
import {
  deleteProductById,
  getProductById,
  updateProductById,
} from "../db/details_db";

suite("Shopping Cart Controller Tests", () => {
  suite("Success Cases", () => {
    test("getCart should return the cart items for a user", async () => {
      const req = {
        loggedInUser: { id: 1 },
      };
      const res = {
        render: (view, data) => {
          assert.ok(
            data.hasOwnProperty("products"),
            "The products should exist."
          );
          assert.ok(
            Array.isArray(data.products),
            "The products should be an array."
          );
        },
        status: () => {
          return res;
        },
        send: () => {
          return res;
        },
      };
      await getCart(req, res);
    });

    test("getCart should return the cart item price for a user", async () => {
      const req = {
        loggedInUser: { id: 1 },
      };
      const res = {
        render: (view, data) => {
          // Check if totalPrice is present and is a string
          assert.ok(
            data.hasOwnProperty("totalPrice"),
            "The totalPrice should exist."
          );
          assert.equal(
            typeof data.totalPrice,
            "string",
            "The totalPrice should be a formatted string."
          );

          // Check if the totalPrice calculation is correct
          const expectedPrice = new Intl.NumberFormat("en-IN", {
            maximumSignificantDigits: 5,
          }).format(30.5);
          assert.equal(
            data.totalPrice,
            expectedPrice,
            "The totalPrice should match the sum of item prices."
          );
        },
        status: () => {
          return res;
        },
        send: () => {
          return res;
        },
      };
      await getCart(req, res);
    });

    test("addItemToCart should add a product to the cart", async () => {
      const req = {
        loggedInUser: { id: 1 },
        params: { id: 1 },
      };
      const res = {
        redirect: () => {},
      };
      await addItemToCart(req, res);
    });

    test("removeCartItem should remove a product from the cart", async () => {
      const req = {
        loggedInUser: { id: 1 },
        params: { id: 1 },
      };
      const res = {
        redirect: () => {},
      };
      await removeCartItem(req, res);
    });

    test("getItemsNumberInCart should return the number of items in the cart", async () => {
      const req = {
        loggedInUser: { id: 1 },
      };
      const res = {
        status: () => res,
        json: (data) => {
          // Check that the response contains the "number" property
          assert.ok(
            data.hasOwnProperty("number"),
            "Response should have 'number' property."
          );
          assert.ok(
            Number.isInteger(data.number),
            "'number' should be an integer."
          );
        },
      };

      await getItemsNumberInCart(req, res);
    });
  });

  suite("Error Cases: Missing Token", () => {
    test("getCart should not get the page if user is not found", async () => {
      const req = {
        loggedInUser: { id: 0 },
      };
      const res = {
        render: (view, data) => {
          assert.ok(
            !data.hasOwnProperty("products"),
            "The products should exist."
          );
          assert.ok(
            Array.isArray(data.products),
            "The products should be an array."
          );
        },
        status: () => {
          return res;
        },
        send: () => {
          return res;
        },
      };
      await getCart(req, res);
    });

    // These test is WORKING
    test("addItemToCart should throw an error if no token is found", async () => {
      const req = {
        params: { id: 1 },
        cookies: { token: null },
      };

      // Mocking the response object
      const res = {
        status: (code) => {
          return {
            send: (message) => {
              assert.equal(code, 401);
              assert.equal(message, "Unauthorised access");
            },
          };
        },
      };

      await addItemToCart(req, res);
    });

    test("getItemsNumberInCart should throw an error if no token is found", async () => {
      const req = {
        params: { id: 1 },
        cookies: { token: null },
      };

      // Mocking the response object
      const res = {
        status: (code) => {
          return {
            send: (message) => {
              assert.equal(code, 401);
              assert.equal(message, "Unauthorised access");
            },
          };
        },
      };

      await getItemsNumberInCart(req, res);
    });

    test("getCart should throw an error if no token is found", async () => {
      const req = {
        cookies: { token: null },
      };
      const res = {
        status: (code) => {
          assert.equal(code, 401);
          return res;
        },
        send: (error) => {
          assert.equal(error, "Unauthorised access");
        },
      };
      await getCart(req, res);
    });
  });

  suite("Error Cases: Invalid IDs or Data Not Found", () => {
    // These test is WORKING
    test("addItemToCart should throw an error if the product ID is invalid", async () => {
      const req = {
        params: { id: null },
        cookies: { token: "testToken" },
      };
      const res = {
        status: (code) => {
          assert.equal(code, 401);
          return res;
        },
        send: (error) => {
          assert.equal(error, "Unauthorised access");
        },
      };
      await addItemToCart(req, res);
    });

    test("getCart should throw an error if the user is not found", async () => {
      const req = {
        cookies: { token: "testToken" },
      };
      const res = {
        status: (code) => {
          assert.equal(code, 401);
          return res;
        },
        send: (error) => {
          assert.equal(error, "Unauthorised access");
        },
      };
      await getCart(req, res);
    });
  });

  suite("Cart Database Tests", () => {
    test("getUserByUsername should return user when user exists", async () => {
      const user = await getUserByUsername("admin"); // Ensure the username exists in the database, otherwise it will fail

      assert.ok(user, "User should be returned when username exists."); // Ensure a user object is returned

      assert.ok(
        user.hasOwnProperty("id"),
        "User object should have 'id' property."
      ); // Check that the user object has the expected properties
    });

    test("getUserByUsername should return null when user doesn't exist", async () => {
      const user = await getUserByUsername("asdfa");
      assert.ok(!user);
    });

    test("getUserByID should return user when user exists", async () => {
      const user = await getUserByID(1);
      assert.ok(user);
    });

    test("getUserByID should return null when user doesn't exist", async () => {
      const user = await getUserByID(0);
      assert.ok(!user);
    });

    test("createUserInCartTable should create a new cart for a user", async () => {
      const result = await createUserInCartTable(1, "[]");
      assert.ok(result);

      after(async () => {
        await sql`DELETE FROM cart WHERE user_id = 1 and items = '[]';`;
      });
    });

    test("getCartDataByUserId should return the cart data for a user", async () => {
      const result = await getCartDataByUserId(1);
      assert.ok(result.hasOwnProperty("user_id"));
    });

    test("updateCartItems should update the cart items for a user", async () => {
      const result = await updateCartItems(1, "[]");
      assert.ok(result.count > 0);

      after(async () => {
        await sql`DELETE FROM cart WHERE user_id = 1 and items = '[]';`;
      });
    });

    test("should update product details when valid ID and data are provided", async () => {
      // Mock updated product data
      const updatedProduct = {
        name: "Camera - alpha",
        description: "Camera - alpha",
        price: 24.99,
        image_url:
          "https://res.cloudinary.com/dtbk6m3ig/image/upload/v1725956171/pexels-madebymath-90946_tlfavv.jpg",
      };

      // Run the updateProductById function
      await updateProductById(1, updatedProduct); // Assuming product with ID 1 exists

      // Fetch the updated product to verify
      const result = await getProductById(1);

      // Assert that the product was updated correctly
      assert.equal(result.id, 1);
      assert.equal(result.name, "Camera - alpha");
      assert.equal(result.description, "Camera - alpha");
      assert.equal(result.price, 24.99);
      assert.equal(
        result.image_url,
        "https://res.cloudinary.com/dtbk6m3ig/image/upload/v1725956171/pexels-madebymath-90946_tlfavv.jpg"
      );
    });

    test("deleteProductById cannot delete a non existing product and return result", async () => {
      const result = await deleteProductById(0);
      console.log(result);
      assert.ok(result);
    });
  });

  after(async () => await sql.end());
});