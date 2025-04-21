import express from "express";
import { productRoutes } from "./routes/productRoutes";
import { ratingRoutes } from "./routes/ratingRoutes";
import { authEventHandler } from "./routes/authEventHandler";
import cookieParser from "cookie-parser";
import { cartRoutes } from "./routes/shoppingCartRoutes";
import { checkoutRoutes } from "./routes/checkoutRoutes";
import { dashboardRoute } from "./routes/dashboardRoute";
import { updateRoutes } from './routes/updateProduct';
import dotenv from "dotenv";
import session from "express-session";
import { userRoutes } from "./routes/userRoutes";

// Create an Express application
export const app = express();
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not defined in environment variables");
}

// Set static files

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
dotenv.config({ path: "./controllers/.env" });
app.use(
  session({
    // secret: process.env.SESSION_SECRET,
    secret: sessionSecret,
    saveUninitialized: false,
    resave: true,
    // httpOnly: true,
    cookie: { maxAge: 60000 },
  })
);

// Set view engine ejs
app.set("view engine", "ejs");
app.use("/products", updateRoutes); // Need Help here (There are 2 /products in index file)
app.use("/dashboard", dashboardRoute);
app.use("/products", productRoutes);
app.use("/ratings", ratingRoutes);
app.use(authEventHandler); // Routes to User Authentication
app.use("/shoppingCart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/user", userRoutes);

// Define a route to serve the HTML file
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Redirect to page not found page
app.get("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.render("404");
  }

  // respond with json
  if (req.accepts("json")) {
    res.json({ error: "Not found" });
    return;
  }

  // default to plain-text. send()
  res.type("txt").send("Not found");
});

// Start the server
const PORT = process.env.PORT || 4000;

export const runningServer = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
