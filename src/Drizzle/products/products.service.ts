import { eq, sql, ilike } from "drizzle-orm";
import db from "../../Drizzle/db";
import {
  ProductsTable,
  CategoriesTable,
  TIProduct,
  TSProduct,
} from "../../Drizzle/schema";

//
// 🧩 Create a new product
//
export const createProductService = async (product: TIProduct) => {
  await db.insert(ProductsTable).values(product);
  return "Product created successfully";
};

//
// 🧩 Get all products
//
export const getProductsService = async () => {
  return await db.query.ProductsTable.findMany({
    with: {
      category: true, // include related category info
    },
  });
};

//
// 🧩 Get product by ID
//
export const getProductByIdService = async (id: number) => {
  return await db.query.ProductsTable.findFirst({
    where: eq(ProductsTable.product_id, id),
    with: {
      category: true,
    },
  });
};

//
// 🧩 Get product by name (✅ fixed: case-insensitive + trims spaces)
//
export const getProductByNameService = async (name: string) => {
  const cleanName = name.trim();

  return await db.query.ProductsTable.findFirst({
    where: ilike(ProductsTable.name, `%${cleanName}%`), // partial + case-insensitive match
    with: {
      category: true,
    },
  });
};

//
// 🧩 Get products by category ID
//
export const getProductsByCategoryService = async (category_id: number) => {
  return await db.query.ProductsTable.findMany({
    where: eq(ProductsTable.category_id, category_id),
    with: {
      category: true,
    },
  });
};

//
// 🧩 Update a product
//
export const updateProductService = async (
  id: number,
  updates: Partial<TIProduct>
) => {
  const allowedUpdates = { ...updates, updated_at: new Date() };

  await db
    .update(ProductsTable)
    .set(allowedUpdates)
    .where(eq(ProductsTable.product_id, id));

  return "Product updated successfully";
};

//
// 🧩 Delete a product
//
export const deleteProductService = async (id: number) => {
  await db.delete(ProductsTable).where(eq(ProductsTable.product_id, id));
  return "Product deleted successfully";
};

//
// 🧩 Get all active products (visible + in stock)
//
export const getActiveProductsService = async () => {
  return await db.query.ProductsTable.findMany({
    where: sql`${ProductsTable.is_active} = true AND ${ProductsTable.stock_quantity} > 0`,
    with: {
      category: true,
    },
  });
};

//
// 🧩 Reduce stock after order (helper)
//
export const reduceProductStockService = async (id: number, quantity: number) => {
  const product = await getProductByIdService(id);
  if (!product) throw new Error("Product not found");

  const newStock = Number(product.stock_quantity) - quantity;
  if (newStock < 0) throw new Error("Insufficient stock");

  await db
    .update(ProductsTable)
    .set({ stock_quantity: newStock, updated_at: new Date() })
    .where(eq(ProductsTable.product_id, id));

  return "Stock updated successfully";
};
 