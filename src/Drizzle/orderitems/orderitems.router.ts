import { Express } from "express";
import {
  createOrderItemController,
  getOrderItemsController,
  getOrderItemByIdController,
  getOrderItemsByOrderIdController,
  getOrderItemsByProductIdController,
  updateOrderItemController,
  deleteOrderItemController,
  getOrderItemSummaryByOrderIdController,
} from "./orderitems.controller";

//
// 🧭 Order Item Routes for NovaMart
//
const OrderItemRoutes = (app: Express) => {
  //
  // ➕ CREATE ORDER ITEM
  //
  app.route("/order-items").post(async (req, res, next) => {
    try {
      await createOrderItemController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 📋 GET ALL ORDER ITEMS
  //
  app.route("/order-items").get(async (req, res, next) => {
    try {
      await getOrderItemsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🔍 GET ORDER ITEMS BY ORDER ID
  //
  app.route("/orders/:orderId/items").get(async (req, res, next) => {
    try {
      await getOrderItemsByOrderIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🔍 GET ORDER ITEMS BY PRODUCT ID
  //
  app.route("/products/:productId/items").get(async (req, res, next) => {
    try {
      await getOrderItemsByProductIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 📊 GET ORDER ITEM SUMMARY (TOTAL ITEMS & COST)
  //
  app.route("/orders/:orderId/items/summary").get(async (req, res, next) => {
    try {
      await getOrderItemSummaryByOrderIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🔍 GET SINGLE ORDER ITEM BY ID
  //
  app.route("/order-items/:id").get(async (req, res, next) => {
    try {
      await getOrderItemByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // ✏️ UPDATE ORDER ITEM
  //
  app.route("/order-items/:id").put(async (req, res, next) => {
    try {
      await updateOrderItemController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🗑️ DELETE ORDER ITEM
  //
  app.route("/order-items/:id").delete(async (req, res, next) => {
    try {
      await deleteOrderItemController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default OrderItemRoutes;
