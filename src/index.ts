import express from "express";
import dotenv from "dotenv";

// 🧩 Load environment variables
dotenv.config();

// 🛠️ Import routes
import UserRoutes from "./Drizzle/users/user.router";
import CategoryRoutes from "./Drizzle/categories/categories.router";
import ProductRoutes from "./Drizzle/products/products.router"; 
import OrderRoutes from "./Drizzle/orders/orders.routers";
import OrderItemRoutes from "./Drizzle/orderitems/orderitems.router";

import PaymentRoutes from "./Drizzle/payments/payments.router";
import DeliveryRoutes from "./Drizzle/deliveries/deliveries.router";

const app = express();
app.use(express.json()); // Parse JSON request bodies

// 🌍 Root route
app.get("/", (req, res) => {
  res.send("NovaMart API is live 🚀");
});

// 👥 Register routes
UserRoutes(app);
CategoryRoutes(app);
ProductRoutes(app);
OrderRoutes(app);
OrderItemRoutes(app);

// 🧭 Future routes (to be activated later)
PaymentRoutes(app);
DeliveryRoutes(app);

// 🚀 Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`✅ NovaMart backend running at: http://localhost:${PORT}`);
});
