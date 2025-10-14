import { Express } from "express";
import {
  createCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  getCategoryByNameController,
  updateCategoryController,
  deleteCategoryController,
  getCategoryWithProductsController,
} from "./categories.controller";

//
// 🧭 Category Routes for NovaMart
//
const CategoryRoutes = (app: Express) => {
  //
  // ➕ CREATE
  //
  app.route("/categories").post(async (req, res, next) => {
    try {
      await createCategoryController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 📋 READ (ALL)
  //
  app.route("/categories").get(async (req, res, next) => {
    try {
      await getCategoriesController(req, res);
    } catch (error) {
      next(error);
    }
  });
// 🔍 READ (BY NAME) — must come before /:id
app.route("/categories/search").get(async (req, res, next) => {
  try {
    await getCategoryByNameController(req, res);
  } catch (error) {
    next(error);
  }
});

// 🔍 READ (BY ID)
app.route("/categories/:id").get(async (req, res, next) => {
  try {
    await getCategoryByIdController(req, res);
  } catch (error) {
    next(error);
  }
});


  //
  // 🛍️ READ (CATEGORY WITH PRODUCTS)
  //
  app.route("/categories/:id/products").get(async (req, res, next) => {
    try {
      await getCategoryWithProductsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // ✏️ UPDATE
  //
  app.route("/categories/:id").put(async (req, res, next) => {
    try {
      await updateCategoryController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //
  // 🗑️ DELETE
  //
  app.route("/categories/:id").delete(async (req, res, next) => {
    try {
      await deleteCategoryController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default CategoryRoutes;
