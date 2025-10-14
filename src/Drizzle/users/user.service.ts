import { eq, sql } from "drizzle-orm";
import db from "../db";
import { UsersTable, OrdersTable, PaymentsTable, TIUser, TSUser } from "../schema";

//
// 🧩 Create a new user
//
export const createUserService = async (user: TIUser) => {
  await db.insert(UsersTable).values(user);
  return "User created successfully";
};

//
// 🧩 Get user by email
//
export const getUserByEmailService = async (email: string) => {
  return await db.query.UsersTable.findFirst({
    where: sql`${UsersTable.email} = ${email}`,
  });
};

//
// 🧩 Verify a user
//
export const verifyUserService = async (email: string) => {
  await db
    .update(UsersTable)
    .set({ isVerified: true })
    .where(sql`${UsersTable.email} = ${email}`);
};

//
// 🧩 Login a user
//
export const userLoginService = async (user: TSUser) => {
  const { email } = user;

  const userExist = await db.query.UsersTable.findFirst({
    columns: {
      user_id: true,
      firstname: true,
      lastname: true,
      email: true,
      password: true,
      contact_phone: true,
      address: true,
      city: true,
      role: true,
      image_url: true,
    },
    where: sql`${UsersTable.email} = ${email}`,
  });

  if (!userExist) {
    throw new Error("User not found");
  }

  return userExist;
};

//
// 🧩 Get all users
//
export const getUsersService = async () => {
  return await db.query.UsersTable.findMany();
};

//
// 🧩 Get a user by ID
//
export const getUserByIdService = async (id: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, id),
  });
};

//
// 🧩 Update a user by ID
//
export const updateUserService = async (
  id: number,
  updates: Partial<TIUser>
) => {
  const allowedUpdates = { ...updates, updated_at: new Date() };

  await db
    .update(UsersTable)
    .set(allowedUpdates)
    .where(eq(UsersTable.user_id, id));

  return "User updated successfully";
};

//
// 🧩 Delete a user by ID
//
export const deleteUserService = async (id: number) => {
  await db.delete(UsersTable).where(eq(UsersTable.user_id, id));
  return "User deleted successfully";
};

//
// 🧩 Get a user with all their orders
//
export const getUserWithOrdersService = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      orders: true,
    },
  });
};

//
// 🧩 Get a user with all their payments
//
export const getUserWithPaymentsService = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      orders: {
        with: {
          payments: true,
        },
      },
    },
  });
};

//
// 🧩 Get a user with all their order details (payments + deliveries + items)
//
export const getUserFullDetailsService = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      orders: {
        with: {
          items: true,
          payments: true,
          deliveries: true,
        },
      },
    },
  });
};
