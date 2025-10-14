import db from "./db";
import {
  UsersTable,
  CategoriesTable,
  ProductsTable,
  OrdersTable,
  OrderItemsTable,
  PaymentsTable,
  DeliveriesTable,
} from "./schema";

async function seed() {
  console.log(" Seeding NovaMart database started...");

  // USERS
  await db.insert(UsersTable).values([
    { firstname: "Ian", lastname: "Kamunya", email: "ian.kamunya@example.com", password: "hashed123", contact_phone: "0712345678", address: "Kikuyu", city: "Nairobi", role: "admin" },
    { firstname: "Mary", lastname: "Wambui", email: "mary.wambui@example.com", password: "hashed234", contact_phone: "0723456789", address: "Thika", city: "Kiambu", role: "user" },
    { firstname: "John", lastname: "Otieno", email: "john.otieno@example.com", password: "hashed345", contact_phone: "0734567890", address: "Kisumu CBD", city: "Kisumu", role: "user" },
    { firstname: "Grace", lastname: "Mutua", email: "grace.mutua@example.com", password: "hashed456", contact_phone: "0745678901", address: "Nyali", city: "Mombasa", role: "user" },
    { firstname: "Peter", lastname: "Mwangi", email: "peter.mwangi@example.com", password: "hashed567", contact_phone: "0756789012", address: "Nakuru Town", city: "Nakuru", role: "user" },
  ]);

  // CATEGORIES
  await db.insert(CategoriesTable).values([
    { name: "Electronics", description: "Devices, gadgets, and accessories" },
    { name: "Groceries", description: "Everyday food and home supplies" },
    { name: "Clothing", description: "Men’s, women’s, and kids’ wear" },
    { name: "Furniture", description: "Home and office furniture" },
    { name: "Beauty", description: "Cosmetics and skincare products" },
  ]);

  // PRODUCTS
  await db.insert(ProductsTable).values([
    { name: "Smartphone X1", description: "5G Android smartphone", price: "450.00", stock_quantity: 30, category_id: 1, image_url: "https://via.placeholder.com/150" },
    { name: "Rice 10kg", description: "Premium long-grain rice", price: "12.50", stock_quantity: 200, category_id: 2, image_url: "https://via.placeholder.com/150" },
    { name: "Men’s Denim Jacket", description: "Blue stylish denim jacket", price: "35.00", stock_quantity: 50, category_id: 3, image_url: "https://via.placeholder.com/150" },
    { name: "Office Chair", description: "Ergonomic adjustable chair", price: "120.00", stock_quantity: 20, category_id: 4, image_url: "https://via.placeholder.com/150" },
    { name: "Face Cream", description: "Moisturizing daily cream", price: "15.99", stock_quantity: 80, category_id: 5, image_url: "https://via.placeholder.com/150" },
  ]);

  // ORDERS
  await db.insert(OrdersTable).values([
    { user_id: 2, total_amount: "450.00", order_status: "processing", payment_status: "paid", delivery_method: "delivery", delivery_address: "Thika" },
    { user_id: 3, total_amount: "25.00", order_status: "pending", payment_status: "pending", delivery_method: "pickup", delivery_address: "Kisumu CBD" },
    { user_id: 4, total_amount: "120.00", order_status: "shipped", payment_status: "paid", delivery_method: "delivery", delivery_address: "Nyali" },
    { user_id: 5, total_amount: "15.99", order_status: "delivered", payment_status: "paid", delivery_method: "delivery", delivery_address: "Nakuru Town" },
    { user_id: 2, total_amount: "35.00", order_status: "cancelled", payment_status: "refunded", delivery_method: "pickup", delivery_address: "Thika" },
  ]);

  // ORDER ITEMS
  await db.insert(OrderItemsTable).values([
    { order_id: 1, product_id: 1, quantity: 1, price: "450.00" },
    { order_id: 2, product_id: 2, quantity: 2, price: "25.00" },
    { order_id: 3, product_id: 4, quantity: 1, price: "120.00" },
    { order_id: 4, product_id: 5, quantity: 1, price: "15.99" },
    { order_id: 5, product_id: 3, quantity: 1, price: "35.00" },
  ]);

  // PAYMENTS
  await db.insert(PaymentsTable).values([
    { order_id: 1, amount: "450.00", payment_status: "paid", transaction_id: "TXN1001", payment_method: "M-Pesa" },
    { order_id: 2, amount: "25.00", payment_status: "pending", transaction_id: "TXN1002", payment_method: "Card" },
    { order_id: 3, amount: "120.00", payment_status: "paid", transaction_id: "TXN1003", payment_method: "Bank Transfer" },
    { order_id: 4, amount: "15.99", payment_status: "paid", transaction_id: "TXN1004", payment_method: "M-Pesa" },
    { order_id: 5, amount: "35.00", payment_status: "refunded", transaction_id: "TXN1005", payment_method: "Card" },
  ]);

  // DELIVERIES
  await db.insert(DeliveriesTable).values([
    { order_id: 1, driver_name: "Joseph Karanja", driver_phone: "0798765432", delivery_status: "processing" },
    { order_id: 2, driver_name: "Mary Achieng", driver_phone: "0787654321", delivery_status: "pending" },
    { order_id: 3, driver_name: "Peter Maina", driver_phone: "0776543210", delivery_status: "shipped" },
    { order_id: 4, driver_name: "James Kariuki", driver_phone: "0765432109", delivery_status: "delivered" },
    { order_id: 5, driver_name: "Sarah Njeri", driver_phone: "0754321098", delivery_status: "cancelled" },
  ]);

  console.log(" Seeding completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error(" Seeding failed:", error);
  process.exit(1);
});
