import express from "express";
import passport from "passport";
import cors from "cors";
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
import { paymentRoutes } from "./routes/paymentRoute";
import webhookRouter from "./middleware/webhook";

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

// API Routes (React Frontend Calls This)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/products", productRoutes);
app.use("/api/products", updateRoutes); 

//For Google OAuth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    session: true,
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/product"); // or /dashboard, your choice
  }
);

app.use("/api", webhookRouter);
app.use("/api/payment", paymentRoutes);

// Set view engine ejs
// Only use if using ejs files which is in the views folder
app.set("view engine", "ejs");
app.use("/dashboard", dashboardRoute);
// app.use("/products", productRoutes);
// app.use("/products", updateRoutes);
app.use("/ratings", ratingRoutes);
app.use(authEventHandler); // Routes to User Authentication
app.use("/shoppingCart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/user", userRoutes);

app.use("/", paymentRoutes);

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
