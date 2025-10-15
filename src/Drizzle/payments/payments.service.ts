import { eq } from "drizzle-orm";
import db from "../../Drizzle/db";
import { PaymentsTable, TIPayment, TSPayment } from "../../Drizzle/schema";

//
// 💳 Create a new payment
//
export const createPaymentService = async (payment: TIPayment) => {
  await db.insert(PaymentsTable).values(payment);
  return "Payment created successfully";
};

//
// 💳 Get all payments
//
export const getPaymentsService = async (): Promise<TSPayment[]> => {
  return await db.query.PaymentsTable.findMany({
    orderBy: (payments, { desc }) => [desc(payments.created_at)],
  });
};

//
// 💳 Get payment by ID
//
export const getPaymentByIdService = async (id: number): Promise<TSPayment | undefined> => {
  return await db.query.PaymentsTable.findFirst({
    where: eq(PaymentsTable.payment_id, id),
  });
};

//
// 💳 Get payments by Order ID
//
export const getPaymentsByOrderIdService = async (orderId: number): Promise<TSPayment[]> => {
  return await db.query.PaymentsTable.findMany({
    where: eq(PaymentsTable.order_id, orderId),
    orderBy: (payments, { desc }) => [desc(payments.created_at)],
  });
};

//
// 💳 Update payment by ID
//
export const updatePaymentService = async (
  id: number,
  updates: Partial<TIPayment>
) => {
  const allowedUpdates = { ...updates, updated_at: new Date() };

  await db
    .update(PaymentsTable)
    .set(allowedUpdates)
    .where(eq(PaymentsTable.payment_id, id));

  return "Payment updated successfully";
};

//
// 💳 Delete payment by ID
//
export const deletePaymentService = async (id: number) => {
  await db.delete(PaymentsTable).where(eq(PaymentsTable.payment_id, id));
  return "Payment deleted successfully";
};

//
// 💳 Get payment summary for an order (total paid & status)
//
export const getPaymentSummaryByOrderIdService = async (orderId: number) => {
  const payments = await db.query.PaymentsTable.findMany({
    where: eq(PaymentsTable.order_id, orderId),
  });

  if (payments.length === 0) return null;

  const totalPaid = payments.reduce(
    (sum, p) => sum + parseFloat(p.amount as unknown as string),
    0
  );

  return {
    order_id: orderId,
    totalPaid,
    latestStatus: payments[0].payment_status,
    totalTransactions: payments.length,
  };
};
