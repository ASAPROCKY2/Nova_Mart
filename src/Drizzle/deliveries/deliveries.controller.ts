import { Request, Response } from "express";
import {
  createDeliveryService,
  getDeliveriesService,
  getDeliveryByIdService,
  getDeliveriesByOrderIdService,
  updateDeliveryService,
  deleteDeliveryService,
  getDeliverySummaryByOrderIdService,
} from "./deliveries.service";

//
// 🚚 Create a new delivery
//
export const createDeliveryController = async (req: Request, res: Response) => {
  try {
    const { order_id, driver_name, driver_phone, delivery_status, delivery_date } = req.body;

    if (!order_id) {
      return res.status(400).json({ message: "order_id is required" });
    }

    await createDeliveryService({
      order_id,
      driver_name,
      driver_phone,
      delivery_status: delivery_status || "pending",
      delivery_date: delivery_date ? new Date(delivery_date) : null,
      created_at: new Date(),
    });

    return res.status(201).json({ message: "Delivery created successfully" });
  } catch (error: any) {
    console.error("❌ Error in createDeliveryController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🚚 Get all deliveries
//
export const getDeliveriesController = async (_req: Request, res: Response) => {
  try {
    const deliveries = await getDeliveriesService();
    return res.status(200).json({ data: deliveries });
  } catch (error: any) {
    console.error("❌ Error in getDeliveriesController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🚚 Get delivery by ID
//
export const getDeliveryByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid delivery ID" });

    const delivery = await getDeliveryByIdService(id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    return res.status(200).json({ data: delivery });
  } catch (error: any) {
    console.error("❌ Error in getDeliveryByIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🚚 Get deliveries by order ID
//
export const getDeliveriesByOrderIdController = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId); // ✅ FIXED: was req.query.orderId
    if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });

    const deliveries = await getDeliveriesByOrderIdService(orderId);
    if (deliveries.length === 0)
      return res.status(404).json({ message: "No deliveries found for this order" });

    return res.status(200).json({ data: deliveries });
  } catch (error: any) {
    console.error("❌ Error in getDeliveriesByOrderIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🚚 Update a delivery
//
export const updateDeliveryController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid delivery ID" });

    const updates = { ...req.body, updated_at: new Date() };

    await updateDeliveryService(id, updates);
    return res.status(200).json({ message: "Delivery updated successfully" });
  } catch (error: any) {
    console.error("❌ Error in updateDeliveryController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🚚 Delete a delivery
//
export const deleteDeliveryController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>> = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid delivery ID" });

    await deleteDeliveryService(id);
    return res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error in deleteDeliveryController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🚚 Get delivery summary by order ID
//
export const getDeliverySummaryByOrderIdController = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId); // ✅ FIXED: was req.query.orderId
    if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });

    const summary = await getDeliverySummaryByOrderIdService(orderId);
    if (!summary) return res.status(404).json({ message: "No deliveries found for this order" });

    return res.status(200).json({ data: summary });
  } catch (error: any) {
    console.error("❌ Error in getDeliverySummaryByOrderIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};
