import {
  createUserInCartTable,
  getCartDataByUserId,
  updateCartItems,
} from "../db/cart_db.js";
import { getProductById } from "../db/details_db.js";

export const getCart = async (req, res) => {
  try {
    const loggedInUser = req.loggedInUser;

    const data = await getCartDataByUserId(loggedInUser.id);
    if (!data) await createUserInCartTable(loggedInUser.id, "[]");
    const cartItems = JSON.parse(data.items);

    let price = 0;

    if (cartItems.length > 0)
      for (let item of cartItems) price += Number(item.price);

    res.render("cart.ejs", {
      products: cartItems,
      totalPrice: new Intl.NumberFormat("en-IN", {
        maximumSignificantDigits: 5,
      }).format(price),
    });
  } catch (err) {
    console.error(err);
    res.status(401).send("Unauthorised access");
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const loggedInUser = req.loggedInUser;
    let addedProducts = [];

    const { id } = req.params;
    const product = await getProductById(id);

    addedProducts.push(product);

    let data = await getCartDataByUserId(loggedInUser.id);

    if (!data) await createUserInCartTable(loggedInUser.id, "[]");
    else {
      addedProducts = addedProducts.concat(JSON.parse(data.items));
    }

    await updateCartItems(loggedInUser.id, JSON.stringify(addedProducts));

    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.status(401).send("Unauthorised access");
  }
};

export const removeCartItem = async (req, res) => {
  const loggedInUser = req.loggedInUser;
  const { id } = req.params;

  let data = await getCartDataByUserId(loggedInUser.id);
  const currentItems = JSON.parse(data.items);

  if (currentItems.indexOf(currentItems[id]) > -1)
    currentItems.splice(currentItems.indexOf(currentItems[id]), 1);

  await updateCartItems(loggedInUser.id, JSON.stringify(currentItems));

  res.redirect("/shoppingCart");
};

export const getItemsNumberInCart = async (req, res) => {
  try {
    const loggedInUser = req.loggedInUser;

    const data = await getCartDataByUserId(loggedInUser.id);

    if (!data) await createUserInCartTable(loggedInUser.id, "[]");

    const cartItems = JSON.parse(data.items);

    res.status(200).json({ number: cartItems.length });
  } catch (err) {
    console.error(err);
    res.status(401).send("Unauthorised access");
  }
};
