import { Express } from "express";
import {
  createPaymentController,
  getPaymentsController,
  getPaymentByIdController,
  getPaymentsByOrderIdController,
  updatePaymentController,
  deletePaymentController,
  getPaymentSummaryByOrderIdController,
} from "./payments.controller";

//
// 💳 Payment Routes for NovaMart
//
const PaymentRoutes = (app: Express) => {
  //
  // ➕ CREATE — Create a new payment
  //
  app.route("/payments").post(async (req, res, next) => {
    try {
      await createPaymentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 📋 READ — Get all payments
  //
  app.route("/payments").get(async (req, res, next) => {
    try {
      await getPaymentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🔍 READ — Get payments by order ID (query param)
  // Example: /payments/by-order?orderId=123
  //
  app.route("/payments/by-order").get(async (req, res, next) => {
    try {
      await getPaymentsByOrderIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 📊 SUMMARY — Get payment summary for a specific order
  // Example: /payments/summary?orderId=123
  //
  app.route("/payments/summary").get(async (req, res, next) => {
    try {
      await getPaymentSummaryByOrderIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🔍 READ — Get payment by ID
  //
  app.route("/payments/:id").get(async (req, res, next) => {
    try {
      await getPaymentByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // ✏️ UPDATE — Update a specific payment
  //
  app.route("/payments/:id").put(async (req, res, next) => {
    try {
      await updatePaymentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🗑️ DELETE — Delete a specific payment
  //
  app.route("/payments/:id").delete(async (req, res, next) => {
    try {
      await deletePaymentController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default PaymentRoutes;
