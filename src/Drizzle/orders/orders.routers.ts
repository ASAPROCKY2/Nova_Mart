import { Express } from "express";
import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  getOrdersByUserIdController,
  updateOrderController,
  deleteOrderController,
  createPaymentController,
  updatePaymentStatusController,
  createDeliveryController,
  updateDeliveryStatusController,
  getOrdersByStatusController,
  getTotalSalesController,
} from "./orders.controllers";

//
// 🧭 Order Routes for NovaMart
//
const OrderRoutes = (app: Express) => {
  //
  // ➕ CREATE ORDER
  //
  app.route("/orders").post(async (req, res, next) => {
    try {
      await createOrderController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 📋 GET ALL ORDERS
  //
  app.route("/orders").get(async (req, res, next) => {
    try {
      await getOrdersController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🔍 GET ORDER BY ID
  //
  app.route("/orders/:id").get(async (req, res, next) => {
    try {
      await getOrderByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 👤 GET ORDERS BY USER ID
  //
  app.route("/users/:userId/orders").get(async (req, res, next) => {
    try {
      await getOrdersByUserIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // ✏️ UPDATE ORDER
  //
  app.route("/orders/:id").put(async (req, res, next) => {
    try {
      await updateOrderController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🗑️ DELETE ORDER
  //
  app.route("/orders/:id").delete(async (req, res, next) => {
    try {
      await deleteOrderController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 💳 CREATE PAYMENT
  //
  app.route("/payments").post(async (req, res, next) => {
    try {
      await createPaymentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 💳 UPDATE PAYMENT STATUS
  //
  app.route("/payments/:paymentId/status").put(async (req, res, next) => {
    try {
      await updatePaymentStatusController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🚚 CREATE DELIVERY
  //
  app.route("/deliveries").post(async (req, res, next) => {
    try {
      await createDeliveryController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🚚 UPDATE DELIVERY STATUS
  //
  app.route("/deliveries/:deliveryId/status").put(async (req, res, next) => {
    try {
      await updateDeliveryStatusController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 📦 GET ORDERS BY STATUS
  //
  app.route("/orders/status").get(async (req, res, next) => {
    try {
      await getOrdersByStatusController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 💰 GET TOTAL SALES SUMMARY
  //
  app.route("/orders/summary/sales").get(async (req, res, next) => {
    try {
      await getTotalSalesController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default OrderRoutes;
