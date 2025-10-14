import { Express } from "express";
import {
  createUserController,
  verifyUserController,
  userLoginController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserByIdController,
  getUserWithOrdersController,
  getUserWithPaymentsController,
  getUserFullDetailsController,
} from "./user.controller";

//
// 🧭 User Routes for NovaMart
//
const UserRoutes = (app: Express) => {
  //
  // 🔐 AUTH ROUTES
  //
  // Register a new user
  app.route("/auth/register").post(async (req, res, next) => {
    try {
      await createUserController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Login user
  app.route("/auth/login").post(async (req, res, next) => {
    try {
      await userLoginController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Verify user (email verification)
  app.route("/auth/verify").post(async (req, res, next) => {
    try {
      await verifyUserController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 👥 USER MANAGEMENT
  //
  // Get all users
  app.route("/users").get(async (req, res, next) => {
    try {
      await getUsersController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get user by ID
  app.route("/users/:id").get(async (req, res, next) => {
    try {
      await getUserByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update user
  app.route("/users/:id").put(async (req, res, next) => {
    try {
      await updateUserController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete user
  app.route("/users/:id").delete(async (req, res, next) => {
    try {
      await deleteUserByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🛍️ USER RELATIONS
  //
  // Get user with orders
  app.route("/users/:id/orders").get(async (req, res, next) => {
    try {
      await getUserWithOrdersController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get user with payments
  app.route("/users/:id/payments").get(async (req, res, next) => {
    try {
      await getUserWithPaymentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get full user details (orders + items + payments + deliveries)
  app.route("/users/:id/details").get(async (req, res, next) => {
    try {
      await getUserFullDetailsController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default UserRoutes;
