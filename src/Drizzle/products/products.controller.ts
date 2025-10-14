import { Request, Response } from "express";
import {
  createProductService,
  getProductsService,
  getProductByIdService,
  getProductByNameService,
  getProductsByCategoryService,
  updateProductService,
  deleteProductService,
  getActiveProductsService,
} from "./products.service";

//
// 🧩 Create a new product
//
export const createProductController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      stock_quantity,
      category_id,
      is_active,
    } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({
        message: "Product name, price, and category_id are required",
      });
    }

    const existingProduct = await getProductByNameService(name);
    if (existingProduct) {
      return res.status(409).json({ message: "Product name already exists" });
    }

    await createProductService({
      name,
      description,
      price,
      stock_quantity,
      category_id,
      is_active: is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: "Product created successfully" });
  } catch (error: any) {
    console.error("❌ Error in createProductController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get all products
//
export const getProductsController = async (_req: Request, res: Response) => {
  try {
    const products = await getProductsService();
    return res.status(200).json({ data: products });
  } catch (error: any) {
    console.error("❌ Error in getProductsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get product by ID
//
export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await getProductByIdService(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ data: product });
  } catch (error: any) {
    console.error("❌ Error in getProductByIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get product by name
//
export const getProductByNameController = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Product name is required" });
    }

    const product = await getProductByNameService(name);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ data: product });
  } catch (error: any) {
    console.error("❌ Error in getProductByNameController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get products by category ID
//
export const getProductsByCategoryController = async (req: Request, res: Response) => {
  try {
    const category_id = parseInt(req.params.category_id);
    if (isNaN(category_id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const products = await getProductsByCategoryService(category_id);
    return res.status(200).json({ data: products });
  } catch (error: any) {
    console.error("❌ Error in getProductsByCategoryController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Update a product
//
export const updateProductController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updates = { ...req.body, updated_at: new Date() };

    await updateProductService(id, updates);
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error: any) {
    console.error("❌ Error in updateProductController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Delete a product
//
export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    await deleteProductService(id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error in deleteProductController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get all active products (visible + in stock)
//
export const getActiveProductsController = async (_req: Request, res: Response) => {
  try {
    const products = await getActiveProductsService();
    return res.status(200).json({ data: products });
  } catch (error: any) {
    console.error("❌ Error in getActiveProductsController:", error);
    return res.status(500).json({ error: error.message });
  }
};
