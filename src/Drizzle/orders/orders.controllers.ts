import { Request, Response } from "express";
import {
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  getOrdersByUserIdService,
  updateOrderService,
  deleteOrderService,
  createPaymentService,
  updatePaymentStatusService,
  createDeliveryService,
  updateDeliveryStatusService,
  getOrdersByStatusService,
  getTotalSalesService,
} from "./orders.service";

//
// 🧩 Create a new order (with optional items)
//
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { user_id, total_amount, orderItems } = req.body;

    if (!user_id || !total_amount) {
      return res
        .status(400)
        .json({ message: "user_id and total_amount are required" });
    }

    await createOrderService(
      {
        user_id,
        total_amount,
        created_at: new Date(),
        updated_at: new Date(),
      },
      orderItems
    );

    return res.status(201).json({ message: "Order created successfully" });
  } catch (error: any) {
    console.error("❌ Error in createOrderController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get all orders
//
export const getOrdersController = async (_req: Request, res: Response) => {
  try {
    const orders = await getOrdersService();
    return res.status(200).json({ data: orders });
  } catch (error: any) {
    console.error("❌ Error in getOrdersController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get order by ID
//
export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "Invalid order ID" });

    const order = await getOrderByIdService(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ data: order });
  } catch (error: any) {
    console.error("❌ Error in getOrderByIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get orders by user ID
//
export const getOrdersByUserIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId))
      return res.status(400).json({ message: "Invalid user ID" });

    const orders = await getOrdersByUserIdService(userId);
    return res.status(200).json({ data: orders });
  } catch (error: any) {
    console.error("❌ Error in getOrdersByUserIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Update an order by ID
//
export const updateOrderController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "Invalid order ID" });

    const updates = { ...req.body, updated_at: new Date() };

    await updateOrderService(id, updates);
    return res.status(200).json({ message: "Order updated successfully" });
  } catch (error: any) {
    console.error("❌ Error in updateOrderController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Delete an order
//
export const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "Invalid order ID" });

    await deleteOrderService(id);
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error in deleteOrderController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Create payment for an order
//
export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const { order_id, amount, payment_method, transaction_id } = req.body;

    if (!order_id || !amount) {
      return res
        .status(400)
        .json({ message: "order_id and amount are required" });
    }

    await createPaymentService({
      order_id,
      amount,
      payment_method,
      transaction_id,
      created_at: new Date(),
      payment_date: new Date(),
    });

    return res.status(201).json({ message: "Payment created successfully" });
  } catch (error: any) {
    console.error("❌ Error in createPaymentController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Update payment status
//
export const updatePaymentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const paymentId = parseInt(req.params.paymentId);
    const { status } = req.body;

    if (isNaN(paymentId))
      return res.status(400).json({ message: "Invalid payment ID" });
    if (!status)
      return res.status(400).json({ message: "Payment status is required" });

    await updatePaymentStatusService(paymentId, status);
    return res.status(200).json({ message: "Payment status updated" });
  } catch (error: any) {
    console.error("❌ Error in updatePaymentStatusController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Create delivery
//
export const createDeliveryController = async (req: Request, res: Response) => {
  try {
    const { order_id, driver_name, driver_phone, delivery_status } = req.body;

    if (!order_id) {
      return res.status(400).json({ message: "order_id is required" });
    }

    await createDeliveryService({
      order_id,
      driver_name,
      driver_phone,
      delivery_status,
      created_at: new Date(),
    });

    return res.status(201).json({ message: "Delivery created successfully" });
  } catch (error: any) {
    console.error("❌ Error in createDeliveryController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Update delivery status
//
export const updateDeliveryStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const deliveryId = parseInt(req.params.deliveryId);
    const { status } = req.body;

    if (isNaN(deliveryId))
      return res.status(400).json({ message: "Invalid delivery ID" });
    if (!status)
      return res.status(400).json({ message: "Delivery status is required" });

    await updateDeliveryStatusService(deliveryId, status);
    return res.status(200).json({ message: "Delivery status updated" });
  } catch (error: any) {
    console.error("❌ Error in updateDeliveryStatusController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get orders by status
//
export const getOrdersByStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.query;
    if (!status || typeof status !== "string") {
      return res.status(400).json({ message: "Order status is required" });
    }

    const orders = await getOrdersByStatusService(status);
    return res.status(200).json({ data: orders });
  } catch (error: any) {
    console.error("❌ Error in getOrdersByStatusController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get total sales summary
//
export const getTotalSalesController = async (_req: Request, res: Response) => {
  try {
    const totalSales = await getTotalSalesService();
    return res.status(200).json({ total_sales: totalSales });
  } catch (error: any) {
    console.error("❌ Error in getTotalSalesController:", error);
    return res.status(500).json({ error: error.message });
  }
};
