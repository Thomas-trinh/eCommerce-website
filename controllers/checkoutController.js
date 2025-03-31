import { getCartDataByUserId, updateCartItems } from "../db/cart_db.js";

// Refactor to accept dependencies (getCartDataByUserId and updateCartItems)
export const getCheckoutPage = async (req, res, getCartDataByUserId, updateCartItems) => {
  try {
      const loggedInUser = req.loggedInUser;
      let data = await getCartDataByUserId(loggedInUser.id);
      let cartItems = JSON.parse(data.items);

      await updateCartItems(loggedInUser.id, "[]");
      res.render("checkout.ejs", {
          products: cartItems
      });
  } catch (err) {
      console.error(err);
      res.status(401).send("Unauthorised access");
  }
};
