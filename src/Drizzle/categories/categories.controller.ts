import { Request, Response } from "express";
import {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  getCategoryByNameService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryWithProductsService,
} from "./categories.service";

//
// 🧩 Create a new category
//
export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await getCategoryByNameService(name);
    if (existingCategory) {
      return res.status(409).json({ message: "Category name already exists" });
    }

    await createCategoryService({
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: "Category created successfully" });
  } catch (error: any) {
    console.error("❌ Error in createCategoryController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get all categories
//
export const getCategoriesController = async (_req: Request, res: Response) => {
  try {
    const categories = await getCategoriesService();
    return res.status(200).json({ data: categories });
  } catch (error: any) {
    console.error("❌ Error in getCategoriesController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get category by ID
//
export const getCategoryByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid category ID" });

    const category = await getCategoryByIdService(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    return res.status(200).json({ data: category });
  } catch (error: any) {
    console.error("❌ Error in getCategoryByIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get category by name
//
export const getCategoryByNameController = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await getCategoryByNameService(name);
    if (!category) return res.status(404).json({ message: "Category not found" });

    return res.status(200).json({ data: category });
  } catch (error: any) {
    console.error("❌ Error in getCategoryByNameController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Update a category
//
export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid category ID" });

    const updates = { ...req.body, updated_at: new Date() };

    await updateCategoryService(id, updates);
    return res.status(200).json({ message: "Category updated successfully" });
  } catch (error: any) {
    console.error("❌ Error in updateCategoryController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Delete a category
//
export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid category ID" });

    await deleteCategoryService(id);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error in deleteCategoryController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get category with its products
//
export const getCategoryWithProductsController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid category ID" });

    const category = await getCategoryWithProductsService(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    return res.status(200).json({ data: category });
  } catch (error: any) {
    console.error("❌ Error in getCategoryWithProductsController:", error);
    return res.status(500).json({ error: error.message });
  }
};
