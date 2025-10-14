import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
  boolean,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

//
// ENUMS
//
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "shipped", "delivered", "cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"]);
export const deliveryMethodEnum = pgEnum("delivery_method", ["pickup", "delivery"]);

//
// USERS TABLE
//
export const UsersTable = pgTable("users", {
  user_id: serial("user_id").primaryKey(),
  firstname: varchar("firstname", { length: 50 }).notNull(),
  lastname: varchar("lastname", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),

  contact_phone: varchar("contact_phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  role: roleEnum("role").default("user"),
  isVerified: boolean("isVerified").default(false),

  image_url: varchar("image_url", { length: 255 }).default(
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  ),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

//
// CATEGORIES TABLE
//
export const CategoriesTable = pgTable("categories", {
  category_id: serial("category_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});


// PRODUCTS TABLE

export const ProductsTable = pgTable("products", {
  product_id: serial("product_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock_quantity: integer("stock_quantity").default(0).notNull(),
  image_url: varchar("image_url", { length: 255 }),
  category_id: integer("category_id")
    .references(() => CategoriesTable.category_id, { onDelete: "set null" }),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});


// ORDERS TABLE

export const OrdersTable = pgTable("orders", {
  order_id: serial("order_id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => UsersTable.user_id, { onDelete: "cascade" }),
  total_amount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  order_status: orderStatusEnum("order_status").default("pending"),
  payment_status: paymentStatusEnum("payment_status").default("pending"),
  delivery_method: deliveryMethodEnum("delivery_method").default("delivery"),
  delivery_address: varchar("delivery_address", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});


// ORDER ITEMS TABLE

export const OrderItemsTable = pgTable("order_items", {
  order_item_id: serial("order_item_id").primaryKey(),
  order_id: integer("order_id")
    .notNull()
    .references(() => OrdersTable.order_id, { onDelete: "cascade" }),
  product_id: integer("product_id")
    .notNull()
    .references(() => ProductsTable.product_id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});


// PAYMENTS TABLE

export const PaymentsTable = pgTable("payments", {
  payment_id: serial("payment_id").primaryKey(),
  order_id: integer("order_id")
    .notNull()
    .references(() => OrdersTable.order_id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payment_status: paymentStatusEnum("payment_status").default("pending").notNull(),
  transaction_id: varchar("transaction_id", { length: 100 }),
  payment_method: varchar("payment_method", { length: 50 }),
  payment_date: timestamp("payment_date").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});


// DELIVERIES TABLE

export const DeliveriesTable = pgTable("deliveries", {
  delivery_id: serial("delivery_id").primaryKey(),
  order_id: integer("order_id")
    .notNull()
    .references(() => OrdersTable.order_id, { onDelete: "cascade" }),
  driver_name: varchar("driver_name", { length: 100 }),
  driver_phone: varchar("driver_phone", { length: 20 }),
  delivery_status: orderStatusEnum("delivery_status").default("pending"),
  delivery_date: timestamp("delivery_date"),
  created_at: timestamp("created_at").defaultNow(),
});


// RELATIONS

export const UserRelations = relations(UsersTable, ({ many }) => ({
  orders: many(OrdersTable),
}));

export const CategoryRelations = relations(CategoriesTable, ({ many }) => ({
  products: many(ProductsTable),
}));

export const ProductRelations = relations(ProductsTable, ({ one, many }) => ({
  category: one(CategoriesTable, {
    fields: [ProductsTable.category_id],
    references: [CategoriesTable.category_id],
  }),
  orderItems: many(OrderItemsTable),
}));

export const OrderRelations = relations(OrdersTable, ({ one, many }) => ({
  user: one(UsersTable, {
    fields: [OrdersTable.user_id],
    references: [UsersTable.user_id],
  }),
  items: many(OrderItemsTable),
  payments: many(PaymentsTable),
  deliveries: many(DeliveriesTable),
}));

export const OrderItemRelations = relations(OrderItemsTable, ({ one }) => ({
  order: one(OrdersTable, {
    fields: [OrderItemsTable.order_id],
    references: [OrdersTable.order_id],
  }),
  product: one(ProductsTable, {
    fields: [OrderItemsTable.product_id],
    references: [ProductsTable.product_id],
  }),
}));

export const PaymentRelations = relations(PaymentsTable, ({ one }) => ({
  order: one(OrdersTable, {
    fields: [PaymentsTable.order_id],
    references: [OrdersTable.order_id],
  }),
}));

export const DeliveryRelations = relations(DeliveriesTable, ({ one }) => ({
  order: one(OrdersTable, {
    fields: [DeliveriesTable.order_id],
    references: [OrdersTable.order_id],
  }),
}));

//
// TYPES
//
export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;

export type TICategory = typeof CategoriesTable.$inferInsert;
export type TSCategory = typeof CategoriesTable.$inferSelect;

export type TIProduct = typeof ProductsTable.$inferInsert;
export type TSProduct = typeof ProductsTable.$inferSelect;

export type TIOrder = typeof OrdersTable.$inferInsert;
export type TSOrder = typeof OrdersTable.$inferSelect;

export type TIOrderItem = typeof OrderItemsTable.$inferInsert;
export type TSOrderItem = typeof OrderItemsTable.$inferSelect;

export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;

export type TIDelivery = typeof DeliveriesTable.$inferInsert;
export type TSDelivery = typeof DeliveriesTable.$inferSelect;
