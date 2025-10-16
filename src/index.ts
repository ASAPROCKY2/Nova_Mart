// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 🧩 Load environment variables
dotenv.config();

// 🛠️ Import route modules
import UserRoutes from "./Drizzle/users/user.router";
import CategoryRoutes from "./Drizzle/categories/categories.router";
import ProductRoutes from "./Drizzle/products/products.router";
import OrderRoutes from "./Drizzle/orders/orders.routers";
import OrderItemRoutes from "./Drizzle/orderitems/orderitems.router";
import PaymentRoutes from "./Drizzle/payments/payments.router";
import DeliveryRoutes from "./Drizzle/deliveries/deliveries.router";

// ⚙️ Initialize express app
const app = express();

// 🧠 Middleware
app.use(express.json());

// 🌍 Enable CORS (connect backend ↔ frontend)
app.use(
  cors({
    origin: "http://localhost:5173", // your React (Vite) frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 🧭 Root route
app.get("/", (req, res) => {
  res.send("NovaMart API is live 🚀");
});

// 🛒 Register all routes
UserRoutes(app);
CategoryRoutes(app);
ProductRoutes(app);
OrderRoutes(app);
OrderItemRoutes(app);
PaymentRoutes(app);
DeliveryRoutes(app);

// 🚀 Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`✅ NovaMart backend running at: http://localhost:${PORT}`);
});
