import { eq, sql } from "drizzle-orm";
import db from "../../Drizzle/db";
import { CategoriesTable, ProductsTable, TICategory, TSCategory } from "../../Drizzle/schema";

//
// 🧩 Create a new category
//
export const createCategoryService = async (category: TICategory) => {
  await db.insert(CategoriesTable).values(category);
  return "Category created successfully";
};

//
// 🧩 Get all categories
//
export const getCategoriesService = async () => {
  return await db.query.CategoriesTable.findMany();
};

//
// 🧩 Get category by ID
//
export const getCategoryByIdService = async (id: number) => {
  return await db.query.CategoriesTable.findFirst({
    where: eq(CategoriesTable.category_id, id),
  });
};

//
// 🧩 Get category by name
//
export const getCategoryByNameService = async (name: string) => {
  return await db.query.CategoriesTable.findFirst({
    where: sql`${CategoriesTable.name} = ${name}`,
  });
};

//
// 🧩 Update a category by ID
//
export const updateCategoryService = async (
  id: number,
  updates: Partial<TICategory>
) => {
  const allowedUpdates = { ...updates, updated_at: new Date() };

  await db
    .update(CategoriesTable)
    .set(allowedUpdates)
    .where(eq(CategoriesTable.category_id, id));

  return "Category updated successfully";
};

//
// 🧩 Delete a category by ID
//
export const deleteCategoryService = async (id: number) => {
  await db.delete(CategoriesTable).where(eq(CategoriesTable.category_id, id));
  return "Category deleted successfully";
};

//
// 🧩 Get category with its products
//
export const getCategoryWithProductsService = async (id: number) => {
  return await db.query.CategoriesTable.findFirst({
    where: eq(CategoriesTable.category_id, id),
    with: {
      products: true,
    },
  });
};
