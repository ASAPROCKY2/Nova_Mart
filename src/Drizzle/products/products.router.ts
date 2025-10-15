import { Express } from "express";
import {
  createProductController,
  getProductsController,
  getProductByIdController,
  getProductByNameController,
  getProductsByCategoryController,
  updateProductController,
  deleteProductController,
  getActiveProductsController,
} from "./products.controller";

const ProductRoutes = (app: Express) => {
  //
  // ➕ CREATE PRODUCT
  //
  app.route("/products").post(async (req, res, next) => {
    try {
      await createProductController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 📋 GET ALL PRODUCTS
  //
  app.route("/products").get(async (req, res, next) => {
    try {
      await getProductsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🔍 GET PRODUCT BY NAME
  // Example: /products/search?name=milk
  //
  app.route("/products/search").get(async (req, res, next) => {
    try {
      await getProductByNameController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🟢 GET ACTIVE PRODUCTS (for customer-facing catalog)
  //
  app.route("/products/active").get(async (req, res, next) => {
    try {
      await getActiveProductsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🔍 GET PRODUCT BY ID
  //
  app.route("/products/:id").get(async (req, res, next) => {
    try {
      await getProductByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🧺 GET PRODUCTS BY CATEGORY ID
  //
  app.route("/categories/:category_id/products").get(async (req, res, next) => {
    try {
      await getProductsByCategoryController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // ✏️ UPDATE PRODUCT
  //
  app.route("/products/:id").put(async (req, res, next) => {
    try {
      await updateProductController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🗑️ DELETE PRODUCT
  //
  app.route("/products/:id").delete(async (req, res, next) => {
    try {
      await deleteProductController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default ProductRoutes;
