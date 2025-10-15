import { eq, sql } from "drizzle-orm";
import db from "../../Drizzle/db";
import {
  OrderItemsTable,
  OrdersTable,
  ProductsTable,
  TIOrderItem,
  TSOrderItem,
} from "../../Drizzle/schema";

//
// 🧩 Create a new order item
//
export const createOrderItemService = async (orderItem: TIOrderItem) => {
  await db.insert(OrderItemsTable).values(orderItem);
  return "Order item created successfully";
};

//
// 🧩 Get all order items
//
export const getOrderItemsService = async () => {
  return await db.query.OrderItemsTable.findMany({
    with: {
      order: true,
      product: true,
    },
  });
};

//
// 🧩 Get order item by ID
//
export const getOrderItemByIdService = async (id: number) => {
  return await db.query.OrderItemsTable.findFirst({
    where: eq(OrderItemsTable.order_item_id, id),
    with: {
      order: true,
      product: true,
    },
  });
};

//
// 🧩 Get order items by Order ID
//
export const getOrderItemsByOrderIdService = async (orderId: number) => {
  return await db.query.OrderItemsTable.findMany({
    where: eq(OrderItemsTable.order_id, orderId),
    with: {
      product: true,
    },
  });
};

//
// 🧩 Get order items by Product ID
//
export const getOrderItemsByProductIdService = async (productId: number) => {
  return await db.query.OrderItemsTable.findMany({
    where: eq(OrderItemsTable.product_id, productId),
    with: {
      order: true,
    },
  });
};

//
// 🧩 Update an order item by ID
//
export const updateOrderItemService = async (
  id: number,
  updates: Partial<TIOrderItem>
) => {
  await db
    .update(OrderItemsTable)
    .set(updates)
    .where(eq(OrderItemsTable.order_item_id, id));

  return "Order item updated successfully";
};

//
// 🧩 Delete an order item by ID
//
export const deleteOrderItemService = async (id: number) => {
  await db.delete(OrderItemsTable).where(eq(OrderItemsTable.order_item_id, id));
  return "Order item deleted successfully";
};

//
// 🧩 Get total items & total cost for a specific order
//
export const getOrderItemSummaryByOrderIdService = async (orderId: number) => {
  const result = await db
    .select({
      total_items: sql<number>`SUM(${OrderItemsTable.quantity})`,
      total_cost: sql<number>`SUM(${OrderItemsTable.price} * ${OrderItemsTable.quantity})`,
    })
    .from(OrderItemsTable)
    .where(eq(OrderItemsTable.order_id, orderId));

  return result[0];
};
