import { Express } from "express";
import {
  createDeliveryController,
  getDeliveriesController,
  getDeliveryByIdController,
  getDeliveriesByOrderIdController,
  updateDeliveryController,
  deleteDeliveryController,
  getDeliverySummaryByOrderIdController,
} from "./deliveries.controller";

//
// 🚚 Delivery Routes for NovaMart
//
const DeliveryRoutes = (app: Express) => {
  //
  // ➕ CREATE — Create a new delivery
  //
  app.route("/deliveries").post(async (req, res, next) => {
    try {
      await createDeliveryController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 📋 READ — Get all deliveries
  //
  app.route("/deliveries").get(async (req, res, next) => {
    try {
      await getDeliveriesController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🔍 READ — Get deliveries by Order ID
  //
  app.route("/deliveries/order/:orderId").get(async (req, res, next) => {
    try {
      await getDeliveriesByOrderIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🔍 READ — Get delivery by ID
  //
  app.route("/deliveries/:id").get(async (req, res, next) => {
    try {
      await getDeliveryByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 📊 SUMMARY — Get delivery summary by order ID
  //
  app.route("/deliveries/order/:orderId/summary").get(async (req, res, next) => {
    try {
      await getDeliverySummaryByOrderIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // ✏️ UPDATE — Update a delivery
  //
  app.route("/deliveries/:id").put(async (req, res, next) => {
    try {
      await updateDeliveryController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🗑️ DELETE — Delete a delivery
  //
  app.route("/deliveries/:id").delete(async (req, res, next) => {
    try {
      await deleteDeliveryController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default DeliveryRoutes;
