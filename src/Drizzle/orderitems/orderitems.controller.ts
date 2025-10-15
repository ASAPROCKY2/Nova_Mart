import { Request, Response } from "express";
import {
  createOrderItemService,
  getOrderItemsService,
  getOrderItemByIdService,
  getOrderItemsByOrderIdService,
  getOrderItemsByProductIdService,
  updateOrderItemService,
  deleteOrderItemService,
  getOrderItemSummaryByOrderIdService,
} from "./orderitems.service";

//
// 🧩 Create a new order item
//
export const createOrderItemController = async (req: Request, res: Response) => {
  try {
    const { order_id, product_id, quantity, price } = req.body;

    if (!order_id || !product_id || !quantity || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await createOrderItemService({
      order_id,
      product_id,
      quantity,
      price,
    });

    return res.status(201).json({ message: "Order item created successfully" });
  } catch (error: any) {
    console.error("❌ Error in createOrderItemController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get all order items
//
export const getOrderItemsController = async (_req: Request, res: Response) => {
  try {
    const orderItems = await getOrderItemsService();
    return res.status(200).json({ data: orderItems });
  } catch (error: any) {
    console.error("❌ Error in getOrderItemsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get order item by ID
//
export const getOrderItemByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid order item ID" });

    const orderItem = await getOrderItemByIdService(id);
    if (!orderItem) return res.status(404).json({ message: "Order item not found" });

    return res.status(200).json({ data: orderItem });
  } catch (error: any) {
    console.error("❌ Error in getOrderItemByIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get order items by Order ID
//
export const getOrderItemsByOrderIdController = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId);
    if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });

    const items = await getOrderItemsByOrderIdService(orderId);
    if (!items || items.length === 0)
      return res.status(404).json({ message: "No order items found for this order" });

    return res.status(200).json({ data: items });
  } catch (error: any) {
    console.error("❌ Error in getOrderItemsByOrderIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get order items by Product ID
//
export const getOrderItemsByProductIdController = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) return res.status(400).json({ message: "Invalid product ID" });

    const items = await getOrderItemsByProductIdService(productId);
    if (!items || items.length === 0)
      return res.status(404).json({ message: "No order items found for this product" });

    return res.status(200).json({ data: items });
  } catch (error: any) {
    console.error("❌ Error in getOrderItemsByProductIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Update an order item
//
export const updateOrderItemController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid order item ID" });

    const updates = req.body;
    await updateOrderItemService(id, updates);

    return res.status(200).json({ message: "Order item updated successfully" });
  } catch (error: any) {
    console.error("❌ Error in updateOrderItemController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Delete an order item
//
export const deleteOrderItemController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid order item ID" });

    await deleteOrderItemService(id);
    return res.status(200).json({ message: "Order item deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error in deleteOrderItemController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get order item summary (total items & cost) by Order ID
//
export const getOrderItemSummaryByOrderIdController = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId);
    if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });

    const summary = await getOrderItemSummaryByOrderIdService(orderId);
    if (!summary)
      return res.status(404).json({ message: "No order items found for this order" });

    return res.status(200).json({ data: summary });
  } catch (error: any) {
    console.error("❌ Error in getOrderItemSummaryByOrderIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};
