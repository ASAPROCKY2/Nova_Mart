import { eq, sql } from "drizzle-orm";
import db from "../../Drizzle/db";
import { DeliveriesTable, OrdersTable, TIDelivery, TSDelivery } from "../../Drizzle/schema";

//
// 🚚 Create a new delivery
//
export const createDeliveryService = async (delivery: TIDelivery) => {
  await db.insert(DeliveriesTable).values(delivery);
  return "Delivery created successfully";
};

//
// 🚚 Get all deliveries
//
export const getDeliveriesService = async () => {
  return await db.query.DeliveriesTable.findMany({
    with: {
      order: true,
    },
  });
};

//
// 🚚 Get delivery by ID
//
export const getDeliveryByIdService = async (id: number) => {
  return await db.query.DeliveriesTable.findFirst({
    where: eq(DeliveriesTable.delivery_id, id),
    with: {
      order: true,
    },
  });
};

//
// 🚚 Get deliveries by order ID
//
export const getDeliveriesByOrderIdService = async (orderId: number) => {
  return await db.query.DeliveriesTable.findMany({
    where: eq(DeliveriesTable.order_id, orderId),
    with: {
      order: true,
    },
  });
};

//
// 🚚 Update a delivery
//
export const updateDeliveryService = async (
  id: number,
  updates: Partial<TIDelivery>
) => {
  const allowedUpdates = { ...updates, created_at: undefined, updated_at: new Date() };

  await db
    .update(DeliveriesTable)
    .set(allowedUpdates)
    .where(eq(DeliveriesTable.delivery_id, id));

  return "Delivery updated successfully";
};

//
// 🚚 Delete a delivery
//
export const deleteDeliveryService = async (id: number) => {
  await db.delete(DeliveriesTable).where(eq(DeliveriesTable.delivery_id, id));
  return "Delivery deleted successfully";
};

//
// 🚚 Get delivery summary by order ID
// Returns: { totalDeliveries, pending, shipped, delivered, cancelled }
export const getDeliverySummaryByOrderIdService = async (orderId: number) => {
  const summary = await db.execute(
    sql`
      SELECT
        COUNT(*) AS total_deliveries,
        SUM(CASE WHEN delivery_status = 'pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN delivery_status = 'processing' THEN 1 ELSE 0 END) AS processing,
        SUM(CASE WHEN delivery_status = 'shipped' THEN 1 ELSE 0 END) AS shipped,
        SUM(CASE WHEN delivery_status = 'delivered' THEN 1 ELSE 0 END) AS delivered,
        SUM(CASE WHEN delivery_status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
      FROM deliveries
      WHERE order_id = ${orderId};
    `
  );

  return summary.rows?.[0] || null;
};
