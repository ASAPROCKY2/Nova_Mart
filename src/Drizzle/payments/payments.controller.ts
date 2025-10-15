import { Request, Response } from "express";
import {
  createPaymentService,
  getPaymentsService,
  getPaymentByIdService,
  getPaymentsByOrderIdService,
  updatePaymentService,
  deletePaymentService,
  getPaymentSummaryByOrderIdService,
} from "./payments.service";

//
// 💳 Create a new payment
//
export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const { order_id, amount, payment_method, payment_status } = req.body;

    if (!order_id || !amount || !payment_method) {
      return res.status(400).json({
        message: "order_id, amount, and payment_method are required",
      });
    }

    await createPaymentService({
      order_id,
      amount,
      payment_method,
      payment_status: payment_status || "pending",
      created_at: new Date(),
    });

    return res.status(201).json({ message: "Payment created successfully" });
  } catch (error: any) {
    console.error("❌ Error in createPaymentController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 💳 Get all payments
//
export const getPaymentsController = async (_req: Request, res: Response) => {
  try {
    const payments = await getPaymentsService();
    return res.status(200).json({ data: payments });
  } catch (error: any) {
    console.error("❌ Error in getPaymentsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 💳 Get payment by ID
//
export const getPaymentByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid payment ID" });
    }

    const payment = await getPaymentByIdService(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json({ data: payment });
  } catch (error: any) {
    console.error("❌ Error in getPaymentByIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 💳 Get payments by order ID
//
export const getPaymentsByOrderIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const orderId = parseInt(req.query.orderId as string);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const payments = await getPaymentsByOrderIdService(orderId);
    if (payments.length === 0) {
      return res.status(404).json({ message: "No payments found for this order" });
    }

    return res.status(200).json({ data: payments });
  } catch (error: any) {
    console.error("❌ Error in getPaymentsByOrderIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 💳 Update a payment
//
export const updatePaymentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid payment ID" });
    }

    const updates = { ...req.body, updated_at: new Date() };

    await updatePaymentService(id, updates);
    return res.status(200).json({ message: "Payment updated successfully" });
  } catch (error: any) {
    console.error("❌ Error in updatePaymentController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 💳 Delete a payment
//
export const deletePaymentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid payment ID" });
    }

    await deletePaymentService(id);
    return res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error in deletePaymentController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 💳 Get payment summary by order ID
//
export const getPaymentSummaryByOrderIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const orderId = parseInt(req.query.orderId as string);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const summary = await getPaymentSummaryByOrderIdService(orderId);
    if (!summary) {
      return res.status(404).json({ message: "No payments found for this order" });
    }

    return res.status(200).json({ data: summary });
  } catch (error: any) {
    console.error("❌ Error in getPaymentSummaryByOrderIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};
