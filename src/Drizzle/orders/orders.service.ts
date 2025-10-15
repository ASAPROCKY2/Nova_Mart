import { eq, sql } from "drizzle-orm";
import db from "../../Drizzle/db";
import {
  OrdersTable,
  OrderItemsTable,
  PaymentsTable,
  DeliveriesTable,
  ProductsTable,
  UsersTable,
  TIOrder,
  TSOrder,
  TIOrderItem,
  TIPayment,
  TIDelivery,
} from "../../Drizzle/schema";

//
// 🧩 Create a new order (with optional order items)
//
export const createOrderService = async (
  order: TIOrder,
  orderItems?: TIOrderItem[]
) => {
  // Create the order
  const [newOrder] = await db.insert(OrdersTable).values(order).returning();

  // If order items exist, insert them
  if (orderItems && orderItems.length > 0) {
    const itemsToInsert = orderItems.map((item) => ({
      ...item,
      order_id: newOrder.order_id,
    }));
    await db.insert(OrderItemsTable).values(itemsToInsert);
  }

  return "Order created successfully";
};

//
// 🧩 Get all orders
//
export const getOrdersService = async () => {
  return await db.query.OrdersTable.findMany({
    with: {
      user: true,
      items: { with: { product: true } },
      payments: true,
      deliveries: true,
    },
  });
};

//
// 🧩 Get order by ID (with all details)
//
export const getOrderByIdService = async (id: number) => {
  return await db.query.OrdersTable.findFirst({
    where: eq(OrdersTable.order_id, id),
    with: {
      user: true,
      items: { with: { product: true } },
      payments: true,
      deliveries: true,
    },
  });
};

//
// 🧩 Get orders by user ID
//
export const getOrdersByUserIdService = async (userId: number) => {
  return await db.query.OrdersTable.findMany({
    where: eq(OrdersTable.user_id, userId),
    with: {
      items: { with: { product: true } },
      payments: true,
      deliveries: true,
    },
  });
};

//
// 🧩 Update an order by ID
//
export const updateOrderService = async (
  id: number,
  updates: Partial<TIOrder>
) => {
  const allowedUpdates = { ...updates, updated_at: new Date() };

  await db
    .update(OrdersTable)
    .set(allowedUpdates)
    .where(eq(OrdersTable.order_id, id));

  return "Order updated successfully";
};

//
// 🧩 Delete an order by ID
//
export const deleteOrderService = async (id: number) => {
  await db.delete(OrdersTable).where(eq(OrdersTable.order_id, id));
  return "Order deleted successfully";
};

//
// 🧩 Create payment for an order
//
export const createPaymentService = async (payment: TIPayment) => {
  await db.insert(PaymentsTable).values(payment);
  return "Payment created successfully";
};

//
// 🧩 Update payment status
//
export const updatePaymentStatusService = async (
  paymentId: number,
  status: string
) => {
  await db
    .update(PaymentsTable)
    .set({ payment_status: status as any })
    .where(eq(PaymentsTable.payment_id, paymentId));
  return "Payment status updated successfully";
};

//
// 🧩 Create delivery for an order
//
export const createDeliveryService = async (delivery: TIDelivery) => {
  await db.insert(DeliveriesTable).values(delivery);
  return "Delivery created successfully";
};

//
// 🧩 Update delivery status
//
export const updateDeliveryStatusService = async (
  deliveryId: number,
  status: string
) => {
  await db
    .update(DeliveriesTable)
    .set({ delivery_status: status as any })
    .where(eq(DeliveriesTable.delivery_id, deliveryId));
  return "Delivery status updated successfully";
};

//
// 🧩 Get all orders by status
//
export const getOrdersByStatusService = async (status: string) => {
  return await db.query.OrdersTable.findMany({
    where: sql`${OrdersTable.order_status} = ${status}`,
    with: {
      user: true,
      items: { with: { product: true } },
      payments: true,
      deliveries: true,
    },
  });
};

//
// 🧩 Get total sales summary
//
export const getTotalSalesService = async () => {
  const result = await db
    .select({
      total_sales: sql<number>`SUM(${OrdersTable.total_amount})`,
    })
    .from(OrdersTable)
    .where(sql`${OrdersTable.payment_status} = 'paid'`);

  return result[0]?.total_sales || 0;
};
