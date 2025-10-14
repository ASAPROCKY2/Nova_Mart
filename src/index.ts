// src/index.ts

import express from "express";
import dotenv from "dotenv";

// 🧩 Load environment variables
dotenv.config();

// 🛠️ Import routes
import UserRoutes from "./Drizzle/users/user.router";
import CategoryRoutes from "./Drizzle/categories/categories.router";
import ProductRoutes from "./Drizzle/products/products.router"; // ✅ newly added

// import OrderRoutes from "./Drizzle/orders/order.routes";
// import PaymentRoutes from "./Drizzle/payments/payment.routes";
// import DeliveryRoutes from "./Drizzle/deliveries/delivery.routes";

const app = express();
app.use(express.json()); // Parse JSON request bodies

// 🌍 Root route
app.get("/", (req, res) => {
  res.send("NovaMart API is live 🚀");
});

// 👥 Register routes
UserRoutes(app);
CategoryRoutes(app);
ProductRoutes(app); // ✅ added new route registration

// 🧭 Future routes (to be activated later)
// OrderRoutes(app);
// PaymentRoutes(app);
// DeliveryRoutes(app);

// 🚀 Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`✅ NovaMart backend running at: http://localhost:${PORT}`);
});
